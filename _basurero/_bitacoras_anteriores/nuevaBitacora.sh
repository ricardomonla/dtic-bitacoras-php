#!/bin/bash
# ============================================================
#  nuevaBitacora.sh - Generador de nueva bitácora en formato .md
#  ------------------------------------------------------------
#  Uso: ./nuevaBitacora.sh archivo_anterior.md
# ============================================================

# Fecha e ID para la nueva bitácora
ID_NEW=$(date +"%y%m%d")
FECHA_NEW=$(date +"%d/%m/%Y")
FILE_NEW="bitacora_${ID_NEW}.md"

echo "📘 Generando $FILE_NEW a partir de $FILE_ANT ..."

# --- Crear nueva bitácora ---
cat > "$FILE_NEW" <<EOF
**Corrige y completa la bitácora del ${FECHA_NEW}** siguiendo el formato institucional DTIC:

* Ortografía y gramática revisadas.
* Tono técnico-administrativo.
* Coherencia cronológica.
* Sección “Conclusión del día” redactada profesionalmente.
* “Resumen por Recurso” y “Pendientes” completados con base en la cronología.


# 📊 Bitácora SERVIDORES - 📅 ${FECHA_NEW}

**Responsable:** Lic. Ricardo MONLA  
**Área:** Departamento Servidores y Sistemas de Altas Prestaciones  
**Oficina:** Dirección de Tecnologías de la Información y la Comunicación (DTIC)  
**Institución:** Universidad Tecnológica Nacional – Facultad Regional La Rioja  

---

## ⏱️ Cronología de Actividades

| Hora        | Recurso         | Detalle |
|--------------|----------------|----------|
| 16:00_16:00 | **dtic_RECURSO** | Descarga, subida y envío de enlaces vía WhatsApp correspondientes a grabaciones de Zoom:<br>• [11Oct-1633 SecExtA3 UTNLaRioja](https://youtu.be/Kwm5dUSzx4k) → *Federico MISKOSKI* (\`3804-50-4164\`).|
| 16:00_16:00 | **dtic_RECURSO** | Ejecución del script \`dticBKPs\` con la opción \`C4. 🚀 Procesar todo y Subir todo\`. |

---

## ✅ Conclusión del día
Redactar una síntesis clara y objetiva de los avances y resultados obtenidos.  
Debe incluir los ejes principales del trabajo (técnicos, documentales o de coordinación) y, si aplica, las mejoras implementadas o los resultados medibles.

---

## 📊 Resumen por Recurso - 📅 ${FECHA_NEW}

| Recurso           | Avance principal |
|-------------------|------------------|
| **Recurso 1** | Resumen breve del avance o acción principal. |
| **Recurso 2** | Descripción de las mejoras o tareas ejecutadas. |

---

## 📌 Pendientes o Próximos pasos
- Listar acciones a verificar, validar o continuar.  
- Incluir hitos futuros o tareas que dependan de revisiones posteriores.  
- Usar redacción en infinitivo (“Verificar...”, “Actualizar...”, “Consolidar...”).  

---

✍️ *Última edición: ${FECHA_NEW} HH:MM*


EOF

echo "✅ Bitácora creada: $FILE_NEW"
