const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');
const { executeQuery } = require('./database');

async function loadResourcesFromPDF() {
  try {
    // Path to the PDF file
    const pdfPath = path.join(__dirname, '../../../_basurero/RECURSOs.pdf');

    // Read and parse the PDF
    const dataBuffer = fs.readFileSync(pdfPath);
    const data = await pdf(dataBuffer);
    const text = data.text;

    console.log('Extracted text from PDF:');
    console.log(text);

    // Parse the text into resource objects
    const resources = parseResources(text);

    console.log(`Parsed ${resources.length} resources from PDF`);

    // Insert resources into database in batch to avoid pool exhaustion
    const { insertedCount, skippedCount } = await insertResourcesBatch(resources);

    console.log(`Total resources processed: ${resources.length}`);
    console.log(`Successfully inserted: ${insertedCount}`);
    console.log(`Skipped (duplicates): ${skippedCount}`);
  } catch (error) {
    console.error('Error loading resources from PDF:', error);
  }
}

function parseResources(text) {
  const resources = [];
  const lines = text.split('\n').map(line => line.trim()).filter(line => line && !line.startsWith('lstRECUsDETALLES'));

  let currentEntry = '';
  for (const line of lines) {
    if (line.includes('|')) {
      if (currentEntry) {
        const resource = parseResourceLine(currentEntry);
        if (resource) resources.push(resource);
      }
      currentEntry = line;
    } else {
      currentEntry += '\n' + line;
    }
  }
  if (currentEntry) {
    const resource = parseResourceLine(currentEntry);
    if (resource) resources.push(resource);
  }

  return resources;
}

function parseResourceLine(entry) {
  // Example: ap-GOB-02 | GOB-PasilloAp 2 en Gobierno; SN: F3608;  #AP001
  const parts = entry.split('|');
  if (parts.length < 2) return null;

  const name = parts[0].trim();
  const rest = parts.slice(1).join('|').trim();

  // Extract ID from end
  const idMatch = rest.match(/#(\w+)$/);
  const dtic_id = idMatch ? idMatch[1] : null;

  if (!dtic_id) return null;  // Skip entries without valid dtic_id

  // Remove ID from rest
  const details = rest.replace(/\s*#(\w+)$/, '').trim();

  const resource = {
    dtic_id: dtic_id,
    name: name,
    description: details,
    category: 'hardware', // default
    status: 'available', // default
    location: null,
    serial_number: null,
    model: null,
    technical_specs: {}
  };

  // Infer category from name prefix
  const code = name.toLowerCase();
  if (code.startsWith('ap-') || code.startsWith('sw-') || code.startsWith('rut-')) {
    resource.category = 'network';
  } else if (code.startsWith('pc-') || code.startsWith('imp-') || code.startsWith('tv') || code.startsWith('tbl-') || code.startsWith('dsp-') || code.startsWith('dvr-')) {
    resource.category = 'hardware';
  } else if (code.startsWith('srv') || code.startsWith('pcv-') || code.startsWith('netb-')) {
    resource.category = 'software';
  } else if (code.startsWith('cam-') || code.startsWith('cel-')) {
    resource.category = 'security';
  } else if (code.startsWith('not-')) {
    resource.category = 'hardware'; // notebooks
  } else if (code.startsWith('tel-')) {
    resource.category = 'hardware';
  }

  // Parse details for SN, MOD, USR, location
  const snMatch = details.match(/SN:\s*([^;]+)/);
  if (snMatch) resource.serial_number = snMatch[1].trim();

  const modMatch = details.match(/MOD(?:ELO)?:\s*([^;]+)/);
  if (modMatch) resource.model = modMatch[1].trim();

  const usrMatch = details.match(/USR:\s*([^;]+)/);
  if (usrMatch) {
    resource.status = 'assigned';
    resource.technical_specs.usr = usrMatch[1].trim();
  }

  // Location from description, e.g., GOB-Pasillo
  const locMatch = details.match(/^([^-]+)-/);
  if (locMatch) resource.location = locMatch[1].trim();

  return resource;
}

async function insertResourcesBatch(resources) {
  const { pool } = require('./database');
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const values = resources.map((resource, index) => {
      const baseIndex = index * 9;
      return `($${baseIndex + 1}, $${baseIndex + 2}, $${baseIndex + 3}, $${baseIndex + 4}, $${baseIndex + 5}, $${baseIndex + 6}, $${baseIndex + 7}, $${baseIndex + 8}, $${baseIndex + 9})`;
    }).join(', ');

    const query = `
      INSERT INTO recursos (dtic_id, name, description, category, status, location, technical_specs, serial_number, model)
      VALUES ${values}
      ON CONFLICT (dtic_id) DO NOTHING
    `;

    const params = resources.flatMap(resource => [
      resource.dtic_id,
      resource.name,
      resource.description,
      resource.category,
      resource.status,
      resource.location,
      JSON.stringify(resource.technical_specs),
      resource.serial_number,
      resource.model
    ]);

    const result = await client.query(query, params);
    const insertedCount = result.rowCount;
    const skippedCount = resources.length - insertedCount;

    await client.query('COMMIT');
    return { insertedCount, skippedCount };
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error inserting resources batch:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Run the script
if (require.main === module) {
  loadResourcesFromPDF();
}

module.exports = { loadResourcesFromPDF };