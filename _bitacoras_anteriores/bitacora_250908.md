# 📘 Bitácora SERVIDORES `250908`

### 📅 08/09/2025

---

#### ⏱️ Cronología de Actividades:

| Hora  | Recurso         | Detalle |
| ----- | --------------- | ------- |
| 08:14-08:32 | **srv-FENIX** | Backup en Proxmox de la VM/CT `111`. |
| 08:15 | **srv-NS8** | Se prepara el servidor agregando memoria RAM para pruebas con PCs virtuales. |
| 10:00 | **srv-NS8** | Instalación de una VM para pruebas de sistemas operativos de servidores. |
| 13:00 | **srv-NS8** | Fallan las pruebas realizadas con la VM. |
| 10:49-11:44 | **srv-SysAcadWEB** | Backup en Xen1 (`srv-vn6`). |
| 12:10 | **srv-SysAcadWEB** | Cambio de nombre de host de `VN6` a `srv-syscadweb`. |
| 12:13 | **srv-SysAcadWEB** | Desinstalación de software no utilizado: `TeamViewer Host` y `FileZilla Client`. |
| 12:23-12:26 | **srv-SysAcadWEB** | Intento de instalación de `Visual Studio Code` para respaldar la configuración web (fallido). |

---

✅ **Conclusión del día:**  
Se realizaron respaldos de VMs en **Proxmox** y **Xen1**, además de tareas de mantenimiento en `srv-syscadweb`.  
En paralelo, se preparó el servidor **NS8** para pruebas de entornos virtualizados, aunque los ensayos no resultaron exitosos.  
La jornada permitió avanzar en la organización de los recursos y detectar limitaciones en el método de pruebas actual.  

---

#### 📊 Resumen por Recurso:

| Fecha      | Recurso        | Actividades principales |
| ---------- | -------------- | ----------------------- |
| 08/09/2025 | **srv-FENIX** | Backup en Proxmox de la VM `111`. |
| 08/09/2025 | **srv-NS8**   | Preparación de entorno para pruebas + instalación fallida de VM. |
| 08/09/2025 | **srv-SysAcadWEB** | Backup en Xen1 + cambio de nombre de host + desinstalación de software innecesario + intento fallido de instalación de Visual Studio Code. |

---

✍️ *Última edición: 08/09/2025 22:00*

**Pendientes o Próximos pasos:**  
* Revisar y optimizar el procedimiento de pruebas en VMs.  
* Validar configuraciones antes de aplicarlas en servidores de producción.  
* Reintentar la instalación de herramientas necesarias en `srv-syscadweb` (ej. Visual Studio Code).  
