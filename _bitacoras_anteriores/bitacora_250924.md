# 📘 Bitácora SERVIDORES `250924`

### 📅 24/09/2025

---

#### ⏱️ Cronología de Actividades:

| Hora        | Recurso                 | Detalle                                                                                                                                                                                                |
| ----------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 13:00-14:00 | **srvv-DNS \[vm112]**   | Se cambia el nombre de host a `srvDNS`. También se actualizan repositorios y aplicativos.                                                                                                              |
| 16:39       | **srvv-DNS \[vm112]**   | Cambio de contraseña del usuario `root -> UTN$...00`.                                                                                                                                                  |
| 16:41-16:43 | **srvv-DNS \[vm112]**   | Backup en Proxmox de la VM.                                                                                                                                                                            |
| 16:49       | **srvv-DNS \[vm112]**   | Se cambia nuevamente el nombre de host a `srvv-DNS`.                                                                                                                                                   |
| 16:52       | **srvv-DNS \[vm112]**   | Creación de carpeta para Docker: `sudo mkdir -p /docker/coreDNS`.                                                                                                                                      |
| 16:52       | **srvv-DNS \[vm112]**   | Copia de backup de Docker: `sudo scp -r rmonla@10.0.10.8:/mnt/ns8Disco3/dtic-BACKUPS/bkps-PMOX/srvTORII/coreDNS /docker/coreDNS`.                                                                      |
| 17:20       | **srvv-DNS \[vm112]**   | Ejecución de `docker compose up -d`, error por puerto 53 en uso.                                                                                                                                       |
| 17:34       | **srvv-DNS \[vm112]**   | Con `sudo lsof -i :53` se detecta que `systemd-resolved` ocupaba el puerto. Se edita `/etc/systemd/resolved.conf` agregando `DNSStubListener=no` y se reinicia el servicio.                            |
| 17:39       | **srvv-DNS \[vm112]**   | Nuevo intento de `docker compose up -d`, sin errores.                                                                                                                                                  |
| 17:41       | **srvv-DNS \[vm112]**   | Pruebas externas con `dig @10.0.10.3 pmox.frlr.utn.edu.ar`, resultados correctos.                                                                                                                      |
| 17:46-17:48 | **srvv-DNS \[vm112]**   | Backup en Proxmox de la VM.                                                                                                                                                                            |
| 17:53       | **srvv-TORII \[vm100]** | Se apaga y se desinstalan las interfaces de red, ya que la configuración de IPs se migra a `srvv-DNS [vm112]`.                                                                                         |
| 17:57-18:43 | **srv-PMOX1**           | Se clona `srvv-TORII [vm100]` a `x-srvv-TORII [vm114]` como respaldo, pero ocurre un error y la VM queda bloqueada.                                                                                    |
| 18:02       | **srvv-DNS \[vm112]**   | Configuración de IPs heredadas de `srvv-TORII`: `ens18 [STATIC] IP 190.114.205.2; DNS 190.114.221.1,8.8.4.4,1.1.1.1; ens19 [STATIC] IP 10.0.10.2; DNS 8.8.8.8,1.1.1.1,9.9.9.9; Gateway 190.114.205.1`. |
| 18:26       | **srv-PMOX1**           | Eliminación de `srvv-TORII [vm100]` para liberar espacio. No fue posible eliminar `x-srvv-TORII [vm114]`.                                                                                              |
| 18:48-18:55 | **srv-PMOX1**           | Investigación para desbloquear VM `x-srvv-TORII [vm114]`. Con `qm unlock 114` se desbloquea y luego se elimina desde la GUI.                                                                           |
| 19:01-19:15 | **srv-PMOX3**           | Se apaga `srvv-DNS [vm112]`, se migra a `srv-PMOX1`, se inicia y se realizan pruebas de funcionamiento.                                                                                                |
| 19:15-20:11 | **srvv-DNS \[vm112]**   | Se detecta pérdida de gateway (regresaba a `10.0.10.1`). Se corrige y queda persistente en `190.114.205.1`.                                                                                            |
| 20:29-22:00 | **dtic-IPs**            | Actualización de información de direcciones IP.                                                                                                                                                        |

---

✅ **Conclusión del día:**
Se completó la migración de los servicios DNS desde `srvv-TORII` hacia `srvv-DNS [vm112]` en contenedor Docker, asegurando su funcionamiento correcto tanto interno como externo.
Se resolvió el problema de bloqueo de la VM clonada (`x-srvv-TORII [vm114]`), logrando su eliminación.
El nuevo servidor DNS quedó operativo con configuración de red persistente.
Se actualizó la documentación de direcciones IP y se avanzó en la reorganización de la infraestructura.

---

#### 📊 Resumen por Recurso:

| Fecha      | Recurso                 | Actividades principales                                                                        |
| ---------- | ----------------------- | ---------------------------------------------------------------------------------------------- |
| 24/09/2025 | **srvv-DNS \[vm112]**   | Migración de servicios DNS + despliegue en Docker + configuración de red y gateway persistente |
| 24/09/2025 | **srvv-TORII \[vm100]** | Apagado y baja de interfaces de red para migración de IPs                                      |
| 24/09/2025 | **srv-PMOX1**           | Clonado y eliminación de VMs (`srvv-TORII`, `x-srvv-TORII`) + liberación de espacio            |
| 24/09/2025 | **srv-PMOX3**           | Migración de `srvv-DNS [vm112]` a `srv-PMOX1` y pruebas                                        |
| 24/09/2025 | **dtic-IPs**            | Actualización de inventario de IPs                                                             |

---

✍️ *Última edición: 24/09/2025 22:15*

**Pendientes o Próximos pasos:**

* Completar instalación y configuración de servicios adicionales en **srv-DNS \[vm112]**.
* Migrar todas las zonas DNS desde `srv-TORII`.
* Validar estabilidad en la resolución de nombres hacia internet y redes internas.
* Definir destino final de `srv-TORII` (reutilización o baja definitiva).
* Confirmar estado de `zfsDATA` y definir estrategia de almacenamiento.
* Finalizar configuración de exportación NFS en `srv-PMOX3`.
* Programar y automatizar los backups hacia el nuevo storage.

---
