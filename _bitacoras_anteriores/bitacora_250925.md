# 📘 Bitácora SERVIDORES `250925`

### 📅 25/09/2025

---

#### ⏱️ Cronología de Actividades:

| Hora                   | Recurso                 | Detalle                             |
| ---------------------- | ----------------------- | ----------------------------------- |
| 24/09/2025 23:00-23:18 | **srvv-MAURIK**         | Descarga de backup desde Xen a NS8 y reinicio de la VM. |
| 24/09/2025 23:11-23:36 | **srvv-FENIX [vm111]**  | Backup en Proxmox.                  |
| 24/09/2025 23:21-23:59 | **srvv-SysAcad-WEB**    | Descarga de backup desde Xen a NS8 y reinicio de la VM. |
| 24/09/2025 23:41-23:45 | **srvv-DATA [vm107]**   | Backup en Proxmox.                  |
| 24/09/2025 23:45-23:46 | **srvv-UPTIME [vm106]** | Backup en Proxmox.                  |
| 24/09/2025 23:46-23:52 | **srvv-SITIO [vm101]**  | Backup en Proxmox.                  |
| 24/09/2025 23:52-23:57 | **srvv-SITIO0 [vm102]** | Backup en Proxmox.                  |
| 24/09/2025 23:57-00:05 | **srvv-DTIC [vm103]**   | Backup en Proxmox.                  |
| 00:05-00:09            | **srvv-DOCs [vm104]**   | Backup en Proxmox.                  |
| 00:09-00:11            | **srvv-DNS [vm112]**    | Backup en Proxmox.                  |
| 00:11-00:14            | **srvv-KOHA [vm105]**   | Backup en Proxmox.                  |
| 00:14-00:23            | **pcv-DASU2 [vm108]**   | Backup en Proxmox.                  |
| 00:23-00:29            | **pcv-DASU3 [vm109]**   | Backup en Proxmox.                  |
| 00:29-00:35            | **pcv-SERVIIO [vm110]** | Backup en Proxmox.                  |
| 00:35-00:35            | **srv-NS8**             | Procesamiento de archivos XVA.      |

---

✅ **Conclusión del día:**
La jornada se enfocó en la **ejecución de respaldos en Proxmox** para la mayoría de las VMs del entorno, incluyendo servicios críticos (`srvv-DNS`, `srvv-DATA`, `srvv-DTIC`, entre otros).
Se realizaron además migraciones de backups desde la infraestructura Xen hacia NS8, con reinicios controlados de VMs (`srvv-MAURIK`, `srvv-SysAcad-WEB`).
Los procesos se completaron correctamente, garantizando la disponibilidad de copias actualizadas para recuperación ante fallos.

---

#### 📊 Resumen por Recurso:

| Fecha      | Recurso              | Actividades principales                             |
| ---------- | ----------           | --------------------------------------------------- |
| 25/09/2025 | **srvv-MAURIK**      | Descarga de backup desde Xen → NS8 y reinicio.      |
| 25/09/2025 | **srvv-SysAcad-WEB** | Descarga de backup desde Xen → NS8 y reinicio.      |
| 25/09/2025 | **srvv-FENIX, srvv-DATA, srvv-UPTIME, srvv-SITIO, srvv-SITIO0, srvv-DTIC, srvv-DOCs, srvv-DNS, srvv-KOHA, pcv-DASU2, pcv-DASU3, pcv-SERVIIO** | Backups en Proxmox. |
| 25/09/2025 | **srv-NS8**          | Procesamiento de archivos XVA.                      |

---

✍️ *Última edición: 25/09/2025 22:30*

**Pendientes o Próximos pasos:**

* Verificar integridad y restaurabilidad de los backups generados.
* Completar la migración definitiva de todos los respaldos desde Xen hacia NS8.
* Documentar tiempos de respaldo y ajustes necesarios en cronogramas automáticos.
* Revisar espacio en almacenamiento de destino para evitar saturación.
