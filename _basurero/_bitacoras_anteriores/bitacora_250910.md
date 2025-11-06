# 📘 Bitácora SERVIDORES `250910`

### 📅 10/09/2025

## 📋 Cronología de Actividades

| Hora  | Recurso | Detalle |
|-------|---------|---------|
| 08:08 | srv-NS8 | Inicio del procesamiento de archivos de `wwwroot` tras aprobación de RRHH. |
| 08:15 | srv-NS8 | Creación de repositorio GitHub `github.com/ricardomonla/DTIC-SysAcadAdmin-Web` y subida del backup. |
| 08:48 | srv-NS8 | Sincronización de archivos con carpeta local mediante `rclone`. |
| 08:58 | srv-NS8 | Finalización de sincronización local. |
| 09:23 | srv-NS8 | Limpieza de archivos de más de 2 años y carpetas vacías en `wwwroot/docentes/recibos`. |
| 09:53 | srv-NS8 | Inicio de la implementación del sistema `sysAdminWeb`. |
| 10:05 | srv-NS8 | Creación de directorios en `wwwroot/sys-admin-web`. |
| 10:19 | srv-NS8 | Ejecución del instructivo `0_SysAdminWeb - Requerimientos y Secuencia de Implementacion_V1.pdf`. |
| 10:19 | srv-NS8 | Edición de archivos `config.asp`, `membrete.htm`, `pie.htm`. |
| 11:15 | srv-NS8 | Sincronización de archivos locales al servidor mediante `rclone`. |
| 11:23 | srv-NS8 | Fin de la sincronización. |
| 12:45 | srv-NS8 | Modificación de archivos locales según instructivo y sincronización con servidor. |
| 12:50 | srv-NS8 | Funcionamiento parcial de la subsección web del sistema `sysAdminWeb` (pendiente conexión con base de datos). |

---

## 💻 Fragmento de configuración editado

```asp
<%
' ================================================================
' Archivo de configuración local
' ------------------------------------------------
' NOTA:
'   - Este archivo NO es reemplazado en las actualizaciones de SysAdmin WEB.
'   - Aquí deben colocarse todas las modificaciones necesarias para
'     redefinir variables establecidas en "configDefecto.asp".
' ================================================================

' 🔗 Ejemplo de cadena de conexión a SQL Server
' CadenaConexion = "Provider=SQLOLEDB;" & _
'                  "Data Source=NombreServer;" & _
'                  "Initial Catalog=NombreBase;" & _
'                  "User Id=UsuarioSQL;" & _
'                  "Pwd=Clave"

' 🏛️ Datos institucionales
Facultad   = "Regional La Rioja"

' 📧 Correos de contacto
mailRRHH   = "rrhh@frlr.utn.edu.ar"
mailDSI    = "dtic@frlr.utn.edu.ar"

' 📂 Directorios locales (descomentar si es necesario)
' DirectorioRecibos = "C:\inetpub\wwwroot\sys-admin-web\recibos"
' DirectorioODocs   = "C:\inetpub\wwwroot\sys-admin-web\oDocs"
%>
```

---

## ✅ Conclusión del día
Se realizó la depuración de archivos en `wwwroot/docentes/recibos` tras aprobación de RRHH y se generó un respaldo en GitHub.  
Se inició la implementación del sistema `sysAdminWeb`, editando los archivos de configuración necesarios y sincronizando cambios.  
Al cierre de la jornada, se logró habilitar la funcionalidad básica de la subsección web, aunque la conexión con la base de datos SQL sigue pendiente.

---

## 📊 Resumen por Recurso

| Recurso | Avance |
|---------|--------|
| srv-NS8 | Depuración de archivos, backup en GitHub, implementación parcial de `sysAdminWeb`. |
| Otros   | Sin actividades registradas. |

---

## 📌 Pendientes o Próximos pasos

- Revisar la configuración de la cadena de conexión en `config.asp` para habilitar comunicación con la base SQL.  
- Verificar la creación y permisos del usuario SQL requerido para `sysAdminWeb`.  
- Completar pasos 5 a 9 del instructivo `0_SysAdminWeb - Requerimientos y Secuencia de Implementacion_V1.pdf`.  
- Documentar las configuraciones específicas para la conexión a base de datos.  

---

✍️ *Última edición: 10/09/2025 12:50*
