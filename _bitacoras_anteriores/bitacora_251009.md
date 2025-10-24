# 📊 Bitácora SERVIDORES - 📅 09/10/2025

**Responsable:** Lic. Ricardo MONLA
**Área:** Departamento Servidores y Sistemas de Altas Prestaciones
**Oficina:** Dirección de Tecnologías de la Información y la Comunicación (DTIC)
**Institución:** Universidad Tecnológica Nacional – Facultad Regional La Rioja

---

## ⏱️ Cronología de Actividades

| Hora          | Recurso          | Detalle |
| ------------- | ---------------- | ------- |
| 00:01 – 00:50 | **srv_Xen1**     | Descarga de VMs `srvv-Maurik` y `srvv-SysAcadWeb`.|
| 00:19 – 01:01 | **srv_PMOX3**    | Backups de VMs `111 (srvv-FENIX)`, `108 (pcv-DASU2)`, `106 (srvv-UPTIME)`, `107 (srvv-DATA)` y `113 (srvv-SITIO2)`.|
| 00:45 – 01:17 | **srv_PMOX2**    | Backups de VMs `108 (pcv-DASU2)`, `109 (pcv-DASU3)`, `110 (pcv-SERVIIO)` y `113 (srvv-SITIO2)`.|
| 01:04 – 01:17 | **srv_PMOX1**    | Backups de VMs `101 (srvv-SITIO)`, `102 (srvv-SITIO0)`, `103 (srvv-DTIC)`, `104 (srvv-DOCs)` y `112 (srvv-DNS)`.|
| 01:17 – 13:57 | **dtic-BACKUPs** | Ejecución del script `dticBKPs` con la opción `C4. 🚀 Procesar todo y Subir todo`, generando respaldo completo de infraestructura virtual.|
| 16:30 – 22:00 | **dtic-EVENTOS** | Preparación, pruebas y desarrollo del evento institucional **“22° Colación de Grado – UTN Facultad Regional La Rioja”**.<br>• 16:30 – Pruebas de sonido de *CIR TENORI*.<br>• 17:30 – Pruebas de transmisión de streaming (Zoom y YouTube).<br>• 18:45 – Inicio de transmisión en vivo.<br>• 19:00 – Inicio del evento académico.<br>• 21:00 – Cierre del acto.<br>• 21:10 – Apagado, desconexión y guardado de equipos.<br>• 22:00 – Fin del servicio. |

---

## ✅ Conclusión del día

La jornada se centró en la **ejecución completa de respaldos automáticos** en los servidores principales de virtualización y almacenamiento, garantizando la actualización integral de los entornos de producción y contingencia.
Por la tarde, se brindó **soporte técnico operativo y logístico** durante la 22° Colación de Grado, asegurando la correcta transmisión por streaming y la coordinación audiovisual del evento.

Las tareas realizadas fortalecen la **continuidad operativa** y la **gestión de eventos institucionales** en tiempo real, consolidando los procedimientos de mantenimiento y documentación del área.

---

## 📊 Resumen por Recurso - 📅 09/10/2025

| Recurso               | Avance principal                                                                                                                                                   |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **dtic-BACKUPs**      | Ejecución integral de respaldos automáticos mediante el script `dticBKPs`, garantizando la actualización completa de las copias en servidores físicos y virtuales. |
| **srv_PMOX1 / 2 / 3** | Procesamiento exitoso de múltiples VMs bajo entorno Proxmox, con validación de tiempos y consistencia de respaldo.                                                 |
| **srv_Xen1**          | Descarga y verificación de VMs externas (`srvv-Maurik`, `srvv-SysAcadWeb`) para consolidar copias locales.                                                         |
| **dtic-EVENTOS**      | Coordinación y soporte técnico integral del evento “22° Colación de Grado”, con transmisión simultánea por Zoom y YouTube.                                         |

---

## 📌 Pendientes o Próximos pasos

* Verificar integridad de los respaldos generados y liberar espacio en los nodos Proxmox.
* Consolidar registros de ejecución en la bitácora de respaldo general (`dtic-BACKUPs`).
* Publicar actualización del histórico de eventos institucionales.
* Revisar logs de streaming y almacenamiento en la nube para copias de resguardo.

---

✍️ *Última edición: 13/10/2025 20:21*

---
