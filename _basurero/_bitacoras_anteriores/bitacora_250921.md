# 📘 Bitácora SERVIDORES `250921`

### 📅 21/09/2025

---

#### ⏱️ Cronología de Actividades:

| Data   | Recurso   | Detalle                                                   |
| ----------- | --------- | --------------------------------------------------------- |
| 08:05-08:20 | srv-NS8   | Backup xen1-ns8 `srv-WebAdmin_20250921_080500.xva`        |
| 08:30-08:40 | srv-PMOX1 | Backup Proxmox `(VM 101) srv-DB01`                        |
| 09:15-09:30 | srv-PMOX1 | Backup Proxmox `(VM 102) srv-WEB01`                       |
| 10:10       | srv-PMOX2 | Test conectividad entre nodos del clúster                 |
| 11:00-11:20 | srv-PMOX3 | Backup Proxmox `(VM 201) srv-STORAGE`                     |
| 15:45-16:00 | srv-NS8   | Prueba de actualización de paquetes en `sysAdminWeb`      |
| 17:10-17:30 | srv-PMOX3 | Configuración inicial de `zfsDATA` para pruebas compartidas |
| 18:00       | srv-PMOX2 | Verificación de montaje manual vía NFS                    |
| 18:40-18:50 | srv-PMOX1 | Backup Proxmox `(VM 103) srv-APP01`                       |
| 19:10       | srv-PMOX2 | Ejecución de script `check_cluster_status.sh`             |

---

✅ **Conclusión del día:**
Se realizaron tareas de backup en `srv-NS8`, `srv-PMOX1`, `srv-PMOX2` y `srv-PMOX3`.  
Se probó la conectividad del clúster, la configuración de `zfsDATA` y montajes NFS.  
Pendiente de revisar estabilidad y rendimiento del almacenamiento compartido.

---

#### 📊 Resumen por Recurso:

| Data             | Recurso       | Actividades principales    |
| ---------------- | ------------- | -------------------------- |
| 21/09/2025 16:00 | **srv-NS8**   | 1 backup + actualización de paquetes                       |
| 21/09/2025 17:30 | **srv-PMOX3** | 1 backup (`STORAGE`) + configuración inicial `zfsDATA`     |
| 21/09/2025 18:50 | **srv-PMOX1** | 3 backups (`DB01`, `WEB01`, `APP01`)                       |
| 21/09/2025 19:10 | **srv-PMOX2** | Test conectividad + verificación NFS + chequeo de clúster |

✍️ *Última edición: 21/09/2025 19:10*

---

**Pendientes o Próximos pasos:**
* Validar estabilidad del storage `zfsDATA`.  
* Configurar exportación NFS definitiva en `srv-PMOX3`.  
* Programar backups automáticos contra el nuevo storage.  
* Revisar conexión de `sysAdminWeb` a la base de datos.  
