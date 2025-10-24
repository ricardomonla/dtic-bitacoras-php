# 📘 Bitácora SERVIDORES `250929`

### 📅 29/09/2025

---

#### ⏱️ Cronología de Actividades:

| Hora   | Recurso       | Detalle                                            |
| ------ | ------------- | -------------------------------------------------- |
| 16:00-17:34 | **dtic-DIGI** | Control de grabaciones. |
| 16:16-17:34 | **dtic-DIGI** | Se trabaja y optimiza planilla de registro [dtic-DIGI v6.4 - Archivo Digital UTNLR](https://docs.google.com/spreadsheets/d/1vXMOQxzxdRd_tGgBErCngUWa2V0-bLCjF69VX0mZIQE). |
| 16:16-16:53 | **dtic-DIGI** | En la cuenta `POSG.Aula1 #ur09`, se configura Zapier para el registro de grabaciones en la planilla. |
| 16:16-16:41 | **dtic-DIGI** | Se descarga, sube y envía al usuario la grabación [27Sept_1641_SecExtA3_UTNLaRioja_2025.mp4](https://youtu.be/6wtuyoRf3wQ). |
| 16:35-16:52 | **dtic-DIGI** | Se descarga, sube y envía al usuario la grabación [26Sept_1742_POSGA1_UTNLaRioja_2025.mp4](https://youtu.be/OoCU36Wnvx0). |
| 16:58-17:15 | **dtic-DIGI** | En la cuenta `_RPRIV #a`, se configura el registro de grabaciones para `Consejo_Directivo_2025_UTNLaRioja 93184347562`. |
| 17:15-17:24 | **dtic-DIGI** | En la cuenta `_RPRIV #a`, se configura el registro de grabaciones para `Reunión_UTNLaRioja 98460927476`. |
| 17:25-17:34 | **dtic-DIGI** | En la cuenta `_RPRIV #f`, se configura el registro de grabaciones para `Concursos_2025_UTNLaRioja 93118718020`. |
| 18:00-18:26 | **srv-PMOX3** | Se inicia la configuración de VM WordPress para migración del sitio. Falló por falta de espacio para disco de 10G, se reintenta en otro servidor. |
| 18:26-18:34 | **dtic-DIGI** | En la cuenta `CarrGRADO.IEM.2doA #vc6`, se configura el registro de grabaciones para `IEM.2do_UTNLaRioja 92086937597`. |
| 18:34-19:14 | **dtic-DIGI** | De la cuenta `CarrGRADO.IEM.2doA #vc6`, se descargan, suben y envían al `Ing. GRACIA` las grabaciones [06Sept_0855_IEM2do_UTNLaRioja](https://youtu.be/F_NNtEWEp54); [13Sept_0857_IEM2do_UTNLaRioja](https://youtu.be/Kb7uyXyvPcs) y [20Sept_0850_IEM2do_UTNLaRioja](https://youtu.be/D0rZjrcwclQ). |
| 19:14-19:24 | **srv-PMOX3** | Se reintenta la instalación de VM WordPress pero vuelve a fallar por falta de espacio. |
| 19:24-19:26 | **srv-PMOX3** | Se migra la `107 (srvv-DATA)` al `srv-PMOX1`. |
| 19:28-19:30 | **srv-PMOX3** | Se migra la `106 (srvv-UPTIME)` al `srv-PMOX2`. |
| 19:35-19:56 | **srv-PMOX3** | Se detecta que está muy cargado el storage `local-lvm`, por lo que se decide liberarlo transfiriendo los discos de `srvv-FENIX` al storage `zfsDISCO1`. |
| 19:56-19:56 | **srvv-FENIX** | Se mueve el disco `Hard Disk (ide0)` desde `local-lvm` a `zfsDISCO1`. |
| 20:22-20:33 | **srvv-FENIX** | Se mueve el disco `Hard Disk (ide1)` desde `local-lvm` a `zfsDISCO1`. |
| 20:35-20:35 | **srvv-FENIX** | Se mueve el `EFI Disk` desde `local-lvm` a `zfsDISCO1`. |
| 20:54-20:59 | **srv-PMOX2** | Se regresa la `106 (srvv-UPTIME)` al `srv-PMOX3`. |
| 20:59-21:01 | **srv-PMOX1** | Se regresa la `107 (srvv-DATA)` al `srv-PMOX3`. |
| 21:19-- | **dtic-DIGI** | De la cuenta `SecEXT.Aula3 #ur15`, se descarga, sube y envía al `Ing. MISKOSKI` la grabación [06Sept_1652_SecExtA3_UTNLaRioja_2025](https://youtu.be/99swfJa9fhU). |
| 21:27-21:35 | **srv-PMOX3** | Se instala la `VM LXC - WordPress` usando el script `bash -c "$(curl -fsSL https://raw.githubusercontent.com/community-scripts/ProxmoxVE/main/ct/wordpress.sh)"` obtenido desde [Proxmox VE Helper-Scripts](https://community-scripts.github.io/ProxmoxVE/scripts?id=wordpress&category=Webservers+%26+Proxies). |
| 21:36-21:42 | **srvv-SITIO2** | Se configuran las IPs `10.0.10.19` y `190.114.205.19; GW:190.114.205.1`. |
| 21:44-21:48 | **srvv-MAURIK** | Se configura DNS para que `10.0.10.19` apunte a `s2.frlr.utn.edu.ar`. |
| 21:48-21:50 | **srvv-DNS** | Se configura DNS para que `190.114.205.19` apunte a `s2.frlr.utn.edu.ar`. |
| 21:50-22:00 | **srvv-SITIO2** | Se accede a la configuración de WordPress por la URL `http://s2.frlr.utn.edu.ar/wp-admin` y con las credenciales `adminUTLR -> UTN$larioja00`. |
| 22:00-22:00 | **srvv-SITIO2** | Se entregan los datos de acceso al `Lic. CANIZA`. |
| 22:00-22:34 | **srv-PMOX3** | Se clona la `100 srvsitio2` a `113 srvv-SITIO2` y se hace un backup de esta última VM. |

---

✅ **Conclusión del día:**  
La jornada tuvo dos ejes principales:  

1. **Área dtic-DIGI:**  
   * Control de grabaciones y actualización de la planilla de captación (v6.4).  
   * Configuración de cuentas en Zapier para automatizar el registro de sesiones (Consejo Directivo, Reuniones, Concursos, IEM, SecEXT).  
   * Descarga, subida y envío de grabaciones a distintos usuarios y docentes.  

2. **Infraestructura (Proxmox / WordPress):**  
   * Intentos iniciales fallidos de instalación de WordPress en VM por falta de espacio.  
   * Optimización del storage de `srv-PMOX3` migrando discos de `srvv-FENIX` desde `local-lvm` a `zfsDISCO1`.  
   * Reinstalación exitosa con contenedor LXC mediante script de la comunidad de Proxmox.  
   * Configuración de la nueva VM `srvv-SITIO2`, asignación de IPs públicas/privadas y actualización de DNS.  
   * Acceso validado al nuevo WordPress (`s2.frlr.utn.edu.ar/wp-admin`) y entrega de credenciales al usuario responsable.  
   * Clonado y backup de la nueva VM (`113 srvv-SITIO2`) para respaldo inmediato.  

En resumen, se consolidó el flujo de gestión de grabaciones digitales y se logró dejar operativo un nuevo **servidor WordPress funcional**, liberando además espacio en el storage de `srv-PMOX3`.  

---

#### 📊 Resumen por Recurso:

| Fecha      | Recurso        | Actividades principales                       |
| ---------- | -------------- | --------------------------------------------- |
| 29/09/2025 | **dtic-DIGI**  | Control de grabaciones, envío de material, actualización de planilla y automatización con Zapier. |
| 29/09/2025 | **srv-PMOX3**  | Instalación y despliegue de WordPress en LXC + gestión de storage y migración de discos. |
| 29/09/2025 | **srvv-FENIX** | Migración de discos de `local-lvm` a `zfsDISCO1`. |
| 29/09/2025 | **srvv-SITIO2**| Configuración de red + instalación de WordPress + pruebas de acceso. |
| 29/09/2025 | **srvv-MAURIK / srvv-DNS** | Actualización de registros DNS para el nuevo sitio `s2.frlr.utn.edu.ar`. |

---

✍️ *Última edición: 29/09/2025 22:55*

**Pendientes o Próximos pasos:**

* Monitorear el rendimiento y estabilidad del nuevo servidor WordPress (`srvv-SITIO2`).  
* Completar la migración de contenidos del sitio anterior al nuevo.  
* Documentar el procedimiento de despliegue (uso de scripts y ajustes de storage).  
* Dar seguimiento a las configuraciones en Zapier para asegurar que las grabaciones se registren correctamente.  
* Continuar con la normalización de la planilla de captación y la revisión de grabaciones atrasadas.  
