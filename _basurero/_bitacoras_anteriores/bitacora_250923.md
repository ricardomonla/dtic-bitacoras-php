# 📘 Bitácora SERVIDORES `250923`

### 📅 23/09/2025

---

#### ⏱️ Cronología de Actividades:

| Hora   | Recurso       | Detalle |
| ------ | ------------- | ------- |
| 16:00  | **srv-PMOX1** | Se controla el funcionamiento de las VMs y se detecta que el `srv-TORII` presenta un consumo elevado de memoria. |
| 16:25  | **srv-TORII** | Se actualiza el Sistema Operativo para intentar estabilizar el uso de memoria. |
| 16:25  | **srv-TORII** | Durante la actualización se presenta un error. |
| 17:30  | **srv-TORII** | Se determina que el error proviene de una falla en `update-initramfs`, encargado de generar la imagen de booteo al aplicar nuevas actualizaciones. |
| 17:32  | **srv-TORII** | Se realiza un backup de la carpeta de configuración de **coreDNS** para restaurar desde un respaldo anterior. |
| 17:39-18:29 | **srv-TORII** | Se restaura el backup `/mnt/pve/zfsDISCO1/dump/vzdump-qemu-100-2025_09_18-08_02_28.vma.zst`. |
| 17:51  | **srv-DNS vm112** | Se inicia la preparación de una nueva VM para reinstalar el servidor DNS utilizando Debian 12 con Docker preinstalado. |
| 17:57  | **srv-DNS vm112** | Se ejecuta `update` y `upgrade` del sistema. |
| 18:09  | **srv-DNS vm112** | Se agrega el usuario `rmonla` y se instalan los paquetes `ssh` y `curl`. |
| 19:00  | **srv-TORII** | No logra recuperarse y el problema persiste; se decide continuar con la instalación del reemplazo en `srv-DNS vm112`. |
| 19:00  | **srv-DNS vm112** | Se configuran las interfaces de red estáticas. |

---

✅ **Conclusión del día:**  
El servidor **srv-TORII** no pudo estabilizarse tras fallas críticas en `update-initramfs`, incluso después de intentar restaurar desde un backup. Se avanzó con la creación y configuración inicial de **srv-DNS vm112** como reemplazo, con Debian 12, Docker, usuarios y red estática definidos. El nuevo servidor quedará listo para la migración de zonas DNS en los próximos días.

---

#### 📊 Resumen por Recurso:

| Fecha            | Recurso       | Actividades principales |
| ---------------- | ------------- | ----------------------- |
| 23/09/2025 17:51 | **srv-DNS vm112** | Preparación de nueva VM Debian 12 + instalación de dependencias + configuración de red estática |
| 23/09/2025 16:25 | **srv-TORII** | Actualización de SO, error en `update-initramfs`, intento de restauración con backup |
| 23/09/2025 16:00 | **srv-PMOX1** | Control de VMs, detección de consumo elevado de memoria en `srv-TORII` |
| 21/09/2025 19:10 | **srv-PMOX2** | Test de conectividad + verificación NFS + chequeo de clúster |
| 21/09/2025 18:50 | **srv-PMOX1** | 3 backups (`DB01`, `WEB01`, `APP01`) |
| 21/09/2025 17:30 | **srv-PMOX3** | 1 backup (`STORAGE`) + configuración inicial `zfsDATA` |
| 21/09/2025 16:00 | **srv-NS8**   | 1 backup + actualización de paquetes |

---

✍️ *Última edición: 23/09/2025 19:45*  

**Pendientes o Próximos pasos:**
* Completar instalación y configuración de **srv-DNS vm112** (servicios DNS en Docker).  
* Migrar zonas DNS desde `srv-TORII` al nuevo servidor.  
* Validar funcionamiento interno y externo de la resolución DNS.  
* Definir el futuro de `srv-TORII` (reutilización o baja definitiva).  
* Confirmar estabilidad del storage `zfsDATA`.  
* Configurar exportación NFS definitiva en `srv-PMOX3`.  
* Programar backups automáticos hacia el nuevo storage.  

