# 📘 Bitácora SERVIDORES `250909`

### 📅 09/09/2025

---

#### ⏱️ Cronología de Actividades:

| Hora  | Recurso        | Detalle |
| ----- | -------------- | ------- |
| 08:00 | **dtic-SERVIDORES** | Preparación y revisión del cableado para migración de tomas a la nueva instalación eléctrica. |
| 08:10 | **dtic-SERVIDORES** | Comunicación a **DASUTeN** sobre el apagado de servidores. Se espera confirmación de **Andrea ALMIRÓN** para proceder sin afectar tareas. |
| 08:40 | **dtic-SERVIDORES** | Confirmación del usuario para iniciar la desconexión. |
| 08:45 | **dtic-SERVIDORES** | Inicio del recableado y migración a los nuevos tomas de corriente. |
| 08:50 | **dtic-SERVIDORES** | Se detecta la necesidad de un toma de **20A** para la conexión de la UPS principal (no prevista en la instalación). Se mantiene conectada en el toma antiguo hasta realizar el cambio. |
| 08:55 | **dtic-SERVIDORES** | Recableo y reubicación de enchufes, eliminando conexiones innecesarias. |
| 09:00 | **dtic-SERVIDORES** | Prueba de autonomía de la UPS: resultado menor a **5 minutos**. |
| 09:38 | **dtic-SERVIDORES** | Reconexión de la UPS, arranque de servidores y servicios. Tiempo total de arranque: ~4 minutos. |
| 09:38 | **dtic-SERVIDORES** | Se informa a **DASUTeN** que ya puede reconectarse y se solicita confirmación de acceso. |
| 10:01 | **dtic-SERVIDORES** | **Andrea ALMIRÓN** confirma acceso sin inconvenientes a la PCV y sistemas. |
| 10:53 | **srv-NS8** | Inicio de configuración para descargar respaldos de **SysAcadWEB** en carpeta local. |
| 12:04 | **dtic-SysACAD-Web** | Se detecta en *wwwroot* de `srv-SysAcadWEB` una carpeta con gran volumen de archivos que genera cuelgues en la manipulación web. |
| 12:04 | **dtic-SysACAD-Web** | Se solicita autorización a **Marcela LÓPEZ** (Directora de RRHH) para conservar solo archivos del año en curso. Argumentos: ya existe respaldo completo, mantener más de 8 años carece de sentido operativo, y los documentos antiguos se regeneran desde el sistema de escritorio. |
| 13:00 | **dtic-SysACAD-Web** | En espera de respuesta de RRHH. Se continuará el **10/09/2025**. |

---

✅ **Conclusión del día:**  
Se completó la migración eléctrica de los servidores, quedando pendiente la instalación de un toma de **20A** para la UPS principal. El tiempo de arranque se midió en ~4 minutos y se validó el acceso a los sistemas.  
En **dtic-SysACAD-Web** se detectó un exceso de archivos históricos de recibos en *wwwroot*, que ralentizan la operación. Se solicitó autorización a Recursos Humanos para depuración controlada, quedando en espera de confirmación.  

---

#### 📊 Resumen por Recurso:

| Fecha      | Recurso            | Actividades principales |
| ---------- | ------------------ | ----------------------- |
| 09/09/2025 | **dtic-SERVIDORES** | Migración eléctrica, recableado, prueba de autonomía de UPS, arranque de sistemas. |
| 09/09/2025 | **dtic-SysACAD-Web**        | Configuración de respaldos de SysAcadWEB + detección de exceso de archivos históricos. |

---

✍️ *Última edición: 09/09/2025 22:00*

**Pendientes o Próximos pasos:**  
* Coordinar instalación de toma de **20A** para la UPS principal.  
* Revisar autonomía reducida de la UPS (<5 minutos).  
* Esperar autorización de RRHH para depuración de archivos en `srv-SysAcadWEB`.  
