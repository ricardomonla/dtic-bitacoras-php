# Plantillas de Prompts para Interacciones en Español

## Plantilla Base Universal

```markdown
**IDIOMA: ESPAÑOL**
**CONTEXTO: Desarrollo app-diplo-ia (React + TypeScript + Docker)**
**TAREA: [Descripción específica de la tarea]**

Instrucciones detalladas en español...
```

## Plantillas Específicas por Tipo de Tarea

### 1. Desarrollo de Código

```markdown
**IDIOMA: ESPAÑOL**
**CONTEXTO: Desarrollo app-diplo-ia (React + TypeScript + Docker)**
**TAREA: Implementar nueva funcionalidad**

Desarrolla el código para [descripción de la funcionalidad].
Incluye:
- Componente React con TypeScript
- Manejo de estado con hooks
- Validación de datos
- Comentarios en español
- Manejo de errores

Proporciona el código completo con ejemplos de uso.
```

### 2. Debugging y Solución de Problemas

```markdown
**IDIOMA: ESPAÑOL**
**CONTEXTO: Desarrollo app-diplo-ia (React + TypeScript + Docker)**
**TAREA: Resolver error específico**

Estoy experimentando el siguiente error:
```
[paste del error aquí]
```

Contexto del error:
- Archivo donde ocurre: src/[archivo].tsx
- Acción que lo provoca: [descripción]
- Comportamiento esperado: [descripción]

Explica en español:
1. Causa raíz del error
2. Solución paso a paso
3. Código corregido con comentarios
4. Cómo prevenir errores similares
```

### 3. Optimización y Mejora de Rendimiento

```markdown
**IDIOMA: ESPAÑOL**
**CONTEXTO: Desarrollo app-diplo-ia (React + TypeScript + Docker)**
**TAREA: Optimizar rendimiento**

Analiza el código actual y sugiere optimizaciones para:
- [lista de problemas específicos]

Enfócate en:
- Lazy loading de componentes
- Memoización de datos
- Optimización de re-renders
- Mejoras en el almacenamiento local

Proporciona código optimizado con métricas de mejora esperadas.
```

### 4. Trabajo con Docker

```markdown
**IDIOMA: ESPAÑOL**
**CONTEXTO: Desarrollo app-diplo-ia (Docker + nginx)**
**TAREA: Resolver problema de Docker**

Problema actual:
- [descripción del problema]

Configuración actual:
- Puerto: 3000
- Imagen: app-diplo-ia:latest
- Contenedor: app-diplo-ia-container

Explica en español cómo resolver este problema con comandos específicos.
Después de la solución, probar con: curl http://localhost:3000
```

### 5. Documentación y Explicaciones

```markdown
**IDIOMA: ESPAÑOL**
**CONTEXTO: Desarrollo app-diplo-ia (React + TypeScript + Docker)**
**TAREA: Documentar funcionalidad**

Documenta la funcionalidad de [nombre de la funcionalidad].
Incluye:
- Propósito y uso
- Parámetros y tipos de datos
- Ejemplos de implementación
- Consideraciones especiales
- Casos de uso comunes

Proporciona documentación completa en español con ejemplos de código.
```

## Recordatorios de Uso

- **Siempre comenzar con `**IDIOMA: ESPAÑOL**`**
- **Especificar el contexto del proyecto**
- **Ser específico en la tarea requerida**
- **Incluir ejemplos de código cuando sea relevante**
- **Mencionar restricciones o requisitos especiales**

## Comandos Rápidos

Para acceder a recordatorios desde la terminal:
```bash
./app-run.sh remind idioma    # Recordatorio de idioma
./app-run.sh remind docker    # Recordatorio de Docker
./app-run.sh remind prompt    # Mostrar plantilla base