---
title: "Portable Template Framework"
version: "1.0.0"
author: "[Your Name or Organization]"
description: "A generalized, portable framework for automatic template selection and automation across projects."
language: "en"
last_updated: "2025-11-14"
framework_type: "hybrid_markdown_yaml"
extensions: []
  # Placeholder for extension metadata
  # - name: "example_extension"
  #   version: "1.0.0"
  #   description: "Description of extension"
---

# Portable Template Framework

A generalized framework for automatic template selection and automation, designed for portability across different projects and domains.

## Template Index

### Structured Catalog

```yaml
templates:
  base_universal:
    id: "BASE-001"
    category: "general"
    subcategory: "universal"
    priority: 10
    keywords:
      - "general"
      - "basic"
      - "universal"
    patterns:
      - "standard"
      - "default"
    description: "Universal base template for general tasks"

  # Placeholder for additional templates
  # template_example:
  #   id: "EX-001"
  #   category: "example"
  #   subcategory: "sample"
  #   priority: 5
  #   keywords: ["example", "sample"]
  #   patterns: ["pattern1", "pattern2"]
  #   description: "Example template definition"

categories:
  - general
  - debugging
  - optimization
  - configuration
  - data
  - maintenance
  - documentation
  - version_control
  # Placeholder for additional categories
```

## Classification Algorithm

### Pseudo-Code for Template Selection

```javascript
// Generalized classification algorithm
function selectTemplate(userPrompt) {
    const promptLower = userPrompt.toLowerCase();
    let bestTemplate = templates.base_universal;
    let bestScore = 0;

    // Iterate through all templates
    for (const template of Object.values(templates)) {
        let score = 0;

        // Score based on exact keyword matches
        for (const keyword of template.keywords) {
            if (promptLower.includes(keyword.toLowerCase())) {
                score += 2;
            }
        }

        // Score based on pattern matches
        for (const pattern of template.patterns) {
            if (promptLower.includes(pattern.toLowerCase())) {
                score += 3;
            }
        }

        // Bonus for priority (lower priority number = higher bonus)
        score += (10 - template.priority) * 0.1;

        // Bonus for category match
        if (promptLower.includes(template.category)) {
            score += 1;
        }

        if (score > bestScore) {
            bestScore = score;
            bestTemplate = template;
        }
    }

    return bestTemplate;
}
```

## Example Template Definitions

### Base Universal Template

**ID:** BASE-001  
**Category:** general/universal  
**Priority:** 10  

**Keywords:** general, basic, universal  
**Patterns:** standard, default  

**Template Content:**
```
**SELECTED TEMPLATE:** BASE-001
**CATEGORY:** general/universal
**CONFIDENCE:** [calculated percentage]
**JUSTIFICATION:** [selection reasons]

## Proposed Execution Plan
[Step-by-step plan details]

Confirm execution of this plan? (Yes/No)

[Next: Full template content...]
```

### Debugging Template Example

**ID:** DEBUG-001  
**Category:** debugging/error_resolution  
**Priority:** 3  

**Keywords:** error, problem, bug, debug, solution, failure, crash, exception  
**Patterns:** debug, troubleshoot, fix  

**Template Content:**
```
**SELECTED TEMPLATE:** DEBUG-001
**CATEGORY:** debugging/error_resolution
**CONFIDENCE:** [calculated percentage]
**JUSTIFICATION:** [selection reasons]

## Debugging Plan
1. Identify error symptoms
2. Gather diagnostic information
3. Analyze root cause
4. Implement fix
5. Test solution

Confirm execution of this plan? (Yes/No)

[Next: Detailed debugging steps...]
```

## Integration Mechanisms

### Framework Integration

This framework integrates with automation systems through:

1. **Prompt Analysis:** Automatic extraction of keywords and patterns from user inputs.
2. **Template Matching:** Scoring-based selection of most appropriate template.
3. **Response Generation:** Structured output with plan proposal and confirmation.
4. **Extension Support:** Modular design allowing custom templates and categories.

### Structured Request Format

Recognized format for prioritized processing:

```
[REQUEST]
[Task description]
Use [_prompts/prompts_app_.md] for this request.
```

**System Behavior:**
- Automatic detection of [REQUEST] format
- Priority boost for specified framework file
- Mandatory plan proposal and confirmation

**Response Structure:**
```markdown
**REQUEST RECOGNIZED**
**PRIORITY FILE:** [specified file]

## Proposed Execution Plan
[Step-by-step details]

Confirm execution? (Yes/No)
```

## Extension Guidelines

### Adding New Templates

1. **Define Template Structure:**
   - Unique ID (format: CATEGORY-XXX)
   - Category and subcategory
   - Priority level (1-10, lower = higher priority)
   - Keywords array
   - Patterns array
   - Description

2. **Update Catalog:**
   - Add to `templates` section in YAML
   - Include in `categories` list if new

3. **Test Integration:**
   - Verify classification algorithm selects correctly
   - Ensure response format consistency

### Framework Extensions

Extensions can be added via:

- **YAML Metadata:** Update `extensions` array in frontmatter
- **Template Additions:** Append new templates to catalog
- **Category Expansions:** Add new categories as needed
- **Algorithm Modifications:** Customize scoring logic for specific domains

### Best Practices

- Maintain keyword/pattern relevance
- Use consistent ID naming conventions
- Test extensions across different prompt types
- Document extension purposes and usage

---

## Communication Preferences

This framework implements a dual-language approach for optimal efficiency:

- **User Interactions:** All user-facing communications, prompts, responses, documentation, and interactions must be conducted exclusively in Spanish
- **Internal Processing:** Technical operations, backend processing, system logs, and internal communications can remain in English for efficiency
- **Language Policy Clarification:**
  - Spanish-only enforcement for all user-facing elements
  - English allowed for backend processing and technical operations
- **Automatic Detection:** System automatically detects language context and applies appropriate processing
- **Fallback Mechanisms:**
  - For user inputs: Automatic translation to Spanish where possible, rejection with correction instructions
  - For internal processing: English processing maintained for technical efficiency
- **Enforcement Rules:**
  - All user-generated content, templates, and responses must be in Spanish
  - User inputs validated for Spanish language compliance
  - Documentation, help text, and system messages provided exclusively in Spanish
  - Backend processing, logging, and technical operations in English
- **Impact on System Operations:**
  - Prompt interpretation: User prompts processed in Spanish context, internal logic in English
  - Response generation: User responses generated in Spanish, internal responses in English
  - System operations: User-facing operations in Spanish, backend operations in English

---

## Version History

- **Version 1.0.0:** 2025-11-14 - Initial generalized framework implementation
