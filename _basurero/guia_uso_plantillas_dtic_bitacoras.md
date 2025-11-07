# Guía de Uso: Plantillas de Prompts Adaptadas para DTIC Bitácoras

**Fecha:** 2025-11-07 11:35:50 (UTC-3)
**Estado:** ✅ COMPLETADO
**Versión:** 1.0.0

## 📋 Resumen de la Adaptación Completada

### **Archivos Generados**

1. **`analisis_comparativo_plantillas_dtic_bitacoras.md`**
   - Análisis detallado de compatibilidad entre plantillas originales y sistema DTIC
   - Identificación de brechas y requerimientos de adaptación
   - Plan de implementación estructurado

2. **`plantillas-prompts-dtic-bitacoras.md`**
   - Plantillas adaptadas específicamente para el sistema DTIC Bitácoras
   - 9 tipos de plantillas especializadas
   - Contexto completo del sistema incluido

## 🎯 Guía de Implementación y Uso

### **Selección de Plantillas por Tipo de Tarea**

#### **Desarrollo Frontend**
- **Usa:** `Desarrollo de Frontend (React + TypeScript)`
- **Para:** Nuevos componentes, integración con stores, interfaces de usuario
- **Contexto:** Incluye hooks genéricos, configuración YAML, entidades específicas

#### **Desarrollo Backend**
- **Usa:** `Desarrollo de Backend (Node.js + Express)`
- **Para:** APIs nuevas, endpoints, validaciones de servidor
- **Contexto:** PostgreSQL, JWT, middleware, sistema de permisos

#### **Funcionalidades de Seguridad**
- **Usa:** `Autenticación y Autorización (JWT + Middleware)`
- **Para:** Nuevos permisos, manejo de tokens, auditoría
- **Contexto:** Sistema jerárquico de permisos, tokens de 8 horas

#### **Operaciones de Base de Datos**
- **Usa:** `Gestión de Base de Datos (PostgreSQL)`
- **Para:** Optimización de queries, transacciones, migraciones
- **Contexto:** Performance, integridad referencial, backups

#### **Resolución de Problemas**
- **Usa:** `Debugging y Solución de Problemas`
- **Para:** Errores específicos del sistema
- **Contexto:** Stack completo, estado de autenticación, entidades relacionadas

#### **Optimización de Performance**
- **Usa:** `Optimización y Mejora de Rendimiento`
- **Para:** Mejoras de velocidad, eficiencia, recursos
- **Contexto:** Stack completo, métricas esperadas

#### **Configuración del Sistema**
- **Usa:** `Configuración del Sistema (Docker + YAML)`
- **Para:** Configuraciones, deployments, variables de entorno
- **Contexto:** Docker Compose, puertos, imágenes

#### **Entidades del Sistema**
- **Usa:** `Entidades CRUD y Stores Genéricos`
- **Para:** Modificaciones a entidades existentes o nuevas
- **Contexto:** useEntityManagement, configuración YAML, permisos

#### **Dashboard y Reportes**
- **Usa:** `Dashboard y Reportes`
- **Para:** Estadísticas, visualizaciones, exportación de datos
- **Contexto:** Carga paralela, datos en tiempo real, métricas contextuales

### **Mejores Prácticas de Uso**

#### **1. Contexto Obligatorio**
- Siempre incluir **IDIOMA: ESPAÑOL**
- Especificar **CONTEXTO: Desarrollo DTIC Bitácoras**
- Mencionar la **TAREA** específica
- Identificar el **MÓDULO** afectado

#### **2. Información Específica del Sistema**
- Referenciar las **entidades principales**: Técnicos, Recursos, Usuarios, Tareas
- Mencionar el **sistema de permisos**: viewer → technician → admin
- Incluir el **estado de autenticación** cuando sea relevante
- Considerar la **base de datos PostgreSQL**

#### **3. Ejemplos de Uso Correcto**

**✅ Ejemplo Bueno:**
```
**IDIOMA: ESPAÑOL**
**CONTEXTO: Desarrollo DTIC Bitácoras Frontend (React + TypeScript + Hooks)**
**TAREA: Implementar componente de búsqueda para módulo Recursos**
**MÓDULOS: CRUD Entidades, useEntityManagement**

Necesito crear un componente de búsqueda que permita filtrar recursos por:
- Nombre del recurso
- Técnico asignado
- Estado (activo/inactivo)
- Fecha de creación

Debe integrarse con el store genérico useEntityManagement y mantener la paginación existente.
```

**❌ Ejemplo Malo:**
```
**IDIOMA: ESPAÑOL**
**TAREA: Crear búsqueda**

Necesito una búsqueda.
```

#### **4. Integración con el Sistema Existente**

Las plantillas están diseñadas para trabajar con:

**Frontend (React + TypeScript):**
- `src/hooks/useEntityManagement.ts`
- `src/stores/genericEntityStore.ts`
- `src/components/common/EntityForm.tsx`
- `src/config/entities.yml`

**Backend (Node.js + Express):**
- `backend/src/middleware/auth.js`
- `backend/src/routes/[entidad].js`
- `backend/src/database.js`

**Base de Datos (PostgreSQL):**
- Esquemas: técnicos, recursos, usuarios, tareas, usuarios_asignados
- Configuración en `docker/init.sql`

### **Personalización y Extensión**

#### **Crear Nuevas Plantillas**
Para crear plantillas adicionales:

1. **Sigue la estructura base** con headers obligatorios
2. **Incluye contexto específico** del sistema DTIC
3. **Referencia tecnologías** del stack (React, Node.js, PostgreSQL)
4. **Menciona módulos** relevantes del sistema
5. **Proporciona ejemplos** específicos del contexto

#### **Adaptar Plantillas Existentes**
Para adaptar una plantilla a un caso específico:

1. **Modifica la TAREA** para el caso específico
2. **Ajusta MÓDULOS** según la funcionalidad
3. **Incluye detalles específicos** del problema o requerimiento
4. **Mantén el contexto** del sistema DTIC

### **Comandos de Terminal Integrados**

Los comandos recordatorio están disponibles:

```bash
./app-run.sh remind idioma    # Recordatorio de idioma
./app-run.sh remind dtic      # Recordatorio específico DTIC
./app-run.sh remind auth      # Recordatorio de autenticación
./app-run.sh remind prompt    # Mostrar plantilla base
./app-run.sh status           # Verificar estado del sistema
```

### **Métricas de Efectividad**

Para medir la efectividad de las plantillas:

1. **Reducción de tiempo** para especificar tareas
2. **Mejora en consistencia** de requests
3. **Incremento en completitud** de información proporcionada
4. **Reducción de iteraciones** en el proceso de desarrollo

### **Próximos Pasos Recomendados**

#### **Corto Plazo (1-2 semanas)**
1. **Implementar plantillas** en el workflow diario
2. **Gather feedback** del equipo de desarrollo
3. **Ajustar plantillas** según experiencia de uso
4. **Crear ejemplos prácticos** de cada tipo de plantilla

#### **Mediano Plazo (1-2 meses)**
1. **Integrar con el sistema** de documentación
2. **Crear scripts** para facilitar acceso a plantillas
3. **Expandir plantillas** para casos específicos identificados
4. **Medir impacto** en productividad del equipo

#### **Largo Plazo (3+ meses)**
1. **Automatizar部分** del proceso de selección de plantillas
2. **Crear templates dinámicos** basados en contexto
3. **Integrar con herramientas** de desarrollo (IDE plugins)
4. **Generar métricas** de uso y efectividad

## 🏁 Conclusión

La adaptación de las plantillas de prompts para DTIC Bitácoras ha sido **exitosa y completa**. Las nuevas plantillas:

- ✅ **Mantienen la estructura** y filosofía de las originales
- ✅ **Incluyen contexto específico** del sistema DTIC
- ✅ **Cubren todos los módulos** principales del sistema
- ✅ **Proporcionan ejemplos** y mejores prácticas
- ✅ **Son fáciles de usar** y adaptar

Las plantillas están **listas para implementación** inmediata y proporcionarán **valor significativo** al equipo de desarrollo al:

- **Estandarizar la comunicación** con AI assistants
- **Reducir tiempo** de especificación de tareas
- **Mejorar calidad** de las soluciones desarrolladas
- **Facilitar onboarding** de nuevos desarrolladores

**Próximo paso:** Implementar uso de las plantillas en el workflow diario y recolectar feedback del equipo.