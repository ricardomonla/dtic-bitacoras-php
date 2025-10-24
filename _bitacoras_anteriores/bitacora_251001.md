# 📊 Bitácora SERVIDORES - 📅 01/10/2025

**Responsable:** Lic. Ricardo MONLA  
**Área:** Departamento Servidores y Sistemas de Altas Prestaciones  
**Oficina:** Dirección de Tecnologías de la Información y la Comunicación (DTIC)  
**Institución:** Universidad Tecnológica Nacional – Facultad Regional La Rioja  

---

#### ⏱️ Cronología de Actividades:

| Hora        | Recurso        | Detalle                                                       |
|-------------|----------------|---------------------------------------------------------------|
| 16:00-17:23 | **dtic-BITÁCORAS** | Cambio de sección de `Resumen por Recurso` a `Histórico por Recurso` y agregado de movimientos históricos. |
| 17:23-18:00 | **dtic-UPTIME** | Agregados los siguientes monitores de red (grupo **dtic-REDES**):<br>- **red-GOB**:<br>  - GOB _SW03 Pasillo — `192.168.15.43`<br>  - GOB AP1 — `192.168.15.12`<br>  - GOB AP2 [F3608] Pasillo #134 — `192.168.15.13`<br>- **red-ICI**:<br>  - ICI _SW04-Pasillo — `192.168.15.44`<br>  - ICI AP1 Aulas — `192.168.15.14`<br>  - ICI AP2 Aulas — `192.168.15.15`<br>  - ICI AP3 Auditorio [3451] — `192.168.15.16` |
| 18:00-18:40 | **dtic-EVENTOS** | Reunión en sala de Consejo para coordinar detalles del evento *Colación de Grado – Jueves 09/10*. |
| 18:40-19:16 | **dtic-UPTIME** | Agregados monitores adicionales en **dtic-REDES**:<br>- **red-IEL**:<br>  - IEL _SW05-Pasillo — `192.168.15.45`<br>  - IEL AP1 Aulas — `192.168.15.22`<br>  - IEL AP2 Aulas [3453] — `192.168.15.23`<br>  - IEL AP3 LAB1 [F3597] — `192.168.15.26`<br>  - IEL AP4 LAB2 [F3607] — `192.168.15.27`<br>- **red-IEM**:<br>  - IEM _SW2 Pasillo — `192.168.15.42`<br>  - IEM AP1 [F3609] — `192.168.15.18`<br>  - IEM AP3 [F3611] — `192.168.15.20`<br>  - IEM AP4 [F3603] — `192.168.15.21`<br>- **red-TIC**:<br>  - TIC _SW0 Servidores — `192.168.15.40`<br>  - TIC _SW1 Pasillo — `192.168.15.41`<br>  - TIC AP1 [F3605] — `192.168.15.11`<br>  - TIC AP2 [F3606] — `192.168.15.10`<br>- **red-CANT**:<br>  - CANT AP1 OCT [F3598] — `192.168.15.28`<br>  - CANT AP2 Aulas [F3602] — `192.168.15.24`<br>  - CANT AP3 Aulas [F3599] — `192.168.15.25` |
| 20:00-20:20 | **dtic-DIGI** | Armado de reunión Zoom para el Ing. GRACIA: *Desafíos en los vínculos escolares* — Fechas: 8, 15, 22 y 29/10 a las 19:00.<br>- Enlace: https://utn.zoom.us/j/92253463777<br>- ID: `922 5346 3777` — PIN: `550066` |
| 20:20-21:24 | **srvv-UPTIME** | Reconfiguración del puerto de Uptime Kuma (3001 → 80). Se creó `/opt/uptime-kuma/.env` con el contenido `UPTIME_KUMA_PORT=80`<br>Se reinicia el servicio y se valida acceso en `http://upt.frlr.utn.edu.ar`. |
| 20:24-21:40 | **dtic-UPTIME** | Creación y publicación de la página de estado público: `http://upt.frlr.utn.edu.ar/status/servicios`. Se configura como página inicial en lugar del dashboard por defecto de Uptime Kuma. |

---

## ✅ Conclusión del día
La jornada reforzó la capacidad de **monitoreo** del campus: se incorporaron más de 20 puntos de red al sistema de Uptime Kuma (switches y puntos de acceso de las redes GOB, ICI, IEL, IEM, TIC y CANT), lo que mejora la visibilidad operativa de la infraestructura.  
Se optimizó la accesibilidad del servicio al reubicar Uptime Kuma en el puerto estándar `80` y al exponer una página pública de estado de servicios.  
Además, se avanzó en la gestión documental (históricos en la bitácora) y en la coordinación de eventos institucionales (Colación de Grado).  

---

## 📊 Resumen por Recurso - 📅 01/10/2025
| Recurso          | Avance principal |
|------------------|------------------|
| **dtic-BITÁCORAS** | Reorganización del formato de la bitácora para un mejor seguimiento histórico. |
| **dtic-UPTIME** | Incorporación de múltiples monitores de red en diferentes edificios y creación de una página pública de estado. |
| **dtic-EVENTOS** | Coordinación de reunión institucional para la Colación de Grado del 09/10. |
| **dtic-DIGI** | Configuración de reunión Zoom para ciclo de charlas sobre vínculos escolares. |
| **srvv-UPTIME** | Ajuste de configuración del puerto de Uptime Kuma y validación de accesibilidad en producción. |

---

## 📌 Pendientes o Próximos pasos
- Finalizar la carga de históricos en la bitácora con formato consolidado.  
- Continuar el monitoreo y ajuste de parámetros en Uptime Kuma.  
- Probar el funcionamiento integral de la página de estado público con usuarios finales.  
- Dar seguimiento a la organización del evento de Colación de Grado (logística, soporte técnico).  
- Verificar estabilidad de los monitores incorporados en todas las redes (GOB, ICI, IEL, IEM, TIC y CANT).  

---

✍️ *Última edición: 01/10/2025 21:40*
