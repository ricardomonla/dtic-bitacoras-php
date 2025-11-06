✅ Prompt unificado para documentar el avance (3 fases)

**Fase 1*  — Tareas Completadas*
Registra en español todas las tareas completadas desde el último registro.
Crea un archivo en el directorio _tareasTerminadas siguiendo el formato:

YYYYMMDD_HHMMSS_[descripcion].md

El archivo debe incluir:

Resumen claro de la tarea completada (antes llamado “Task Completed”), traducido y redactado en español.

Análisis de acciones por módulo, redactado en español.

Detalle de cambios, mejoras y soluciones aplicadas.

**Fase 2** — Versionado
Revisa si los cambios realizados requieren:

Actualización del número de versión del sistema en TODOS los archivos relevantes:
- package.json (frontend y backend si corresponde)
- CHANGELOG.md
- Archivos de interfaz que muestren versión (Navbar.tsx, Dashboard.tsx, etc.)
- Cualquier otro archivo que contenga referencias de versión

Actualización y registro correspondiente en CHANGELOG.md.

IMPORTANTE: Buscar todas las referencias de versión en el código antes de actualizar para asegurar consistencia.

Si corresponde, aplícalo antes de continuar.

**Fase 3** — Commit
Guarda todos los archivos modificados y realiza un commit en español que incluya:

Resumen breve del cambio.

Referencia al archivo generado en _tareasTerminadas.

IMPORTANTE: Si se actualizó la versión, incluir mención explícita en el commit.

Ejecuta todo preferentemente mediante un único comando o secuencia integrada.

**Fase 4** — Verificación
Después del commit, verificar que:
- La aplicación funciona correctamente
- Las versiones se muestran actualizadas en la interfaz
- No hay errores de compilación o runtime
- Los cambios se reflejan en el repositorio

Crea un archivo de verificación usando el formato:
YYYYMMDD_HHMMSS.md

El archivo se debe guardar en el directorio _estados/ y debe incluir:
- Fecha y hora de la verificación
- Versión verificada
- Resultados de todas las verificaciones realizadas
- Estado final del sistema
- Conclusiones y próximos pasos recomendados