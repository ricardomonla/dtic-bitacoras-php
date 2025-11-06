# 📘 Bitácora SERVIDORES `250922`

### 📅 22/09/2025

## 📋 Cronología de Actividades

| Hora  | Recurso  | Detalle |
|-------|----------|---------|
| 07:59-08:19 | srv-NS8   | Backup xen1-ns8 `srv-MauriK_20250911_075911.xva`. |
| 08:27-09:10 | srv-NS8   | Backup xen1-ns8 `srv-SysACADWeb_20250911_082715.xva`. |
| 07:49-08:08 | srv-PMOX3 | Backup Proxmox `(VM 111) srv-FENIX`. |
| 15:52-15:54 | srv-PMOX3 | Backup Proxmox `(VM 107) srv-DATA`. |
| 16:15 | srv-PMOX3 | Inicio de estudio para compartir la unidad ZFS `zfsDISCO1` en el clúster. |
| 17:00 | srv-PMOX3 | Configuración inicial del servidor NFS sobre `zfsDISCO1`. |
| 17:44 | srv-PMOX3 | Prueba de montaje manual desde un nodo Proxmox. |
| 08:06-08:09 | srv-PMOX2 | Backup Proxmox2 `(VM 108) pcv-DASU2`. |
| 08:30-08:32 | srv-PMOX2 | Backup Proxmox2 `(VM 109) pcv-DASU3`. |
| 15:50-15:53 | srv-PMOX2 | Backup Proxmox2 `(VM 110) pcv-SERVIIO`. |
| 17:44 | srv-PMOX2 | Prueba de montaje manual desde un nodo Proxmox. |
| 17:45 | srv-PMOX2 | Configuración de montaje NFS y acceso a directorios compartidos. |
| 17:54 | srv-PMOX2 | Adición de almacenamiento NFS en Proxmox mediante CLI. |
| 18:10 | srv-PMOX2 | Prueba de backup de `srv-KOHA (VM 105)` sobre el nuevo almacenamiento, con resultado exitoso. |
| 15:51-15:52 | srv-PMOX1 | Backup Proxmox `(VM 106) srv-UPTIME`. |
| 18:03-18:05 | srv-PMOX1 | Backup Proxmox `(VM 105) srv-KOHA`. |
| 18:07-18:10 | srv-PMOX1 | Backup Proxmox `(VM 104) srv-DOCs`. |
| 18:17-18:26 | srv-PMOX1 | Backup Proxmox `(VM 100) srv-TORII`. |
| 18:53-18:59 | srv-PMOX1 | Backup Proxmox `(VM 103) srv-DTIC`. |
| 19:06-19:09 | srv-PMOX1 | Backup Proxmox `(VM 101) srv-SITIO`. |
| 19:14-19:18 | srv-PMOX1 | Backup Proxmox `(VM 102) srv-SITIO0`. |
| 19:35 | srv-PMOX1 | Ejecución del comando `full_backup` mediante el script `dticBKPs_app.rb v5.2`. |

---

## 💻 Fragmento de configuración editado

```bash
# Configuración NFS en srv-PMOX3
apt update && apt install -y nfs-kernel-server
echo "/zfsDISCO1 10.0.10.0/24(rw,sync,no_subtree_check,no_root_squash)" | tee -a /etc/exports
exportfs -ra
systemctl enable --now nfs-kernel-server
showmount -e localhost

# Montaje en srv-PMOX2
mkdir -p /mnt/test-zfs
mount -t nfs -o vers=3 10.0.10.203:/zfsDISCO1 /mnt/test-zfs
umount /mnt/test-zfs

# Adición de almacenamiento en clúster
pvesm add nfs zfsDISCO1 --server 10.0.10.203 --export /zfsDISCO1/backups --path /mnt/pve/zfsDISCO1 --content iso,vztmpl,backup --options vers=3
```

---

## ✅ Conclusión del día
Se realizaron tareas de respaldo en `srv-NS8`, `srv-PMOX1` y `srv-PMOX2` para diferentes VMs.  
El foco principal fue la implementación de un almacenamiento compartido basado en ZFS y NFS desde `srv-PMOX3`.  
Se configuró la exportación de `/zfsDISCO1`, se probó el montaje desde `srv-PMOX2` y se añadió correctamente al clúster Proxmox.  
Finalmente, se validó el funcionamiento mediante la ejecución de respaldos exitosos, como el de la VM `srv-KOHA`, sobre este nuevo almacenamiento compartido.

---

## 📊 Resumen por Recurso

| Recurso   | Avance |
|-----------|--------|
| srv-NS8   | Backups de VMs `srv-MauriK` y `srv-SysACADWeb`. |
| srv-PMOX3 | Configuración de NFS sobre ZFS `zfsDISCO1` y exportación al clúster. |
| srv-PMOX2 | Montaje NFS, validación de acceso y backup de `srv-KOHA`. |
| srv-PMOX1 | Backups de múltiples VMs y ejecución del script `dticBKPs_app.rb v5.2`. |

---

## 📌 Pendientes o Próximos pasos

- Monitorear rendimiento y estabilidad del nuevo almacenamiento NFS (`zfsDISCO1`) en el clúster.  
- Revisar la configuración de respaldos existentes para usar el nuevo recurso compartido.  
- Resolver en `srv-NS8` la conexión pendiente a la base de datos de `sysAdminWeb`.  
- Ajustar la planificación de respaldos automáticos con `dticBKPs_app.rb v5.2`.  

---

✍️ *Última edición: 22/09/2025 20:00*
