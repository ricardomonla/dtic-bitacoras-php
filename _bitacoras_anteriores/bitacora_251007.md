# 📘 Bitácora SERVIDORES `251007`

### 📅 07/10/2025

---

## 📋 Cronología de Actividades

| Hora        | Recurso            | Detalle |
|--------------|--------------------|----------|
| 16:00-16:31 | **dtic-BITÁCORAS** | Actualización de información de días anteriores y del historial de recursos. |
| 16:31-16:34 | **dtic-BITÁCORAS** | Registro de eventos de descarga y envío de clases grabadas:<br>`06Oct_1359_ICI-1ro-25_UTNLaRioja.mp4` y `04Oct_1624_SecExtA3_UTNLaRioja_2025.mp4`. |
| 16:34-16:46 | **dtic-DIGI** | Preparación de reunión Zoom solicitada por **KSALDIS**:<br>🟨 *Reunión Zoom - DEFENSA DE TESIS*<br>📌 13 de octubre - 19:00 hs<br>🔗 https://utn.zoom.us/j/83855177245<br>ID: `838 5517 7245`<br>🔐 PIN: `990099` |
| 16:46-17:24 | **srvv-SITIO / srvv-SITIO0 / srvv-DTIC / srvv-DOCs / srvv-DNS / srvv-KOHA** | Actualización del sistema operativo de las VMs `101, 102, 103, 104, 105, 112`. |
| 17:24-18:12 | **srvv-SITIO2 [vm113]** | Actualización del sistema operativo. Se agrega usuario `utnlr` con credenciales `UTN$larioja00` y se configura acceso **sudo**. |
| 18:12-18:24 | **srvv-SITIO2 [vm113]** | Se instruye al usuario **RCANIZA** para acceder vía SSH y al panel de WordPress:<br>🔹 **SSH**: `10.0.10.19` → `utnlr / UTN$...`<br>🔹 **WordPress**: `http://s2.frlr.utn.edu.ar/wp-admin` → `adminUTNLR / UTN$...`. |
| 18:24-20:46 | **srvv-SITIO2 [vm113]** | Se realizan pruebas de seguridad en la base de datos MariaDB y se define la política de acceso restringido solo desde red interna y localhost.|

### 💻 Fragmento de configuración
```sql
DROP USER IF EXISTS 'utnlr'@'%';
CREATE USER IF NOT EXISTS 'utnlr'@'localhost' IDENTIFIED BY 'UTN$utnlr00';
CREATE USER IF NOT EXISTS 'utnlr'@'10.0.10.%' IDENTIFIED BY 'UTN$utnlr00';
GRANT ALL PRIVILEGES ON *.* TO 'utnlr'@'localhost' WITH GRANT OPTION;
GRANT ALL PRIVILEGES ON *.* TO 'utnlr'@'10.0.10.%' WITH GRANT OPTION;
FLUSH PRIVILEGES;
```

Además, se crea la base de datos `Web_Utn_19` con codificación UTF8:

```sql
CREATE DATABASE Web_Utn_19 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
``` 

---

## ✅ Conclusión del día
La jornada estuvo dedicada a la **actualización del sistema operativo** de las principales VMs del entorno de servidores y a la **mejora de la seguridad de acceso** al nuevo entorno WordPress (`srvv-SITIO2`).  
Se estableció una política de usuarios y permisos más estricta en **MariaDB**, permitiendo acceso únicamente desde `localhost` o la red interna `10.0.10.X`.  
Además, se realizaron tareas de mantenimiento documental (bitácoras anteriores), gestión de grabaciones y soporte técnico a reuniones académicas.  

---

## 📊 Resumen por Recurso - 📅 07/10/2025

| Recurso              | Avance principal |
|----------------------|------------------|
| **dtic-BITÁCORAS**       | Actualización de registros e historial de recursos. |
| **dtic-DIGI**            | Creación y configuración de reunión Zoom para defensa de tesis. |
| **srvv-SITIO (101)**     | Actualización de sistema operativo. |
| **srvv-SITIO0 (102)**    | Actualización de sistema operativo. |
| **srvv-DTIC (103)**      | Actualización de sistema operativo. |
| **srvv-DOCs (104)**      | Actualización de sistema operativo. |
| **srvv-KOHA (105)**      | Actualización de sistema operativo. |
| **srvv-DNS (112)**       | Actualización de sistema operativo. |
| **srvv-SITIO2 (113)**    | Creación del usuario `utnlr`, configuración de privilegios en MariaDB y creación de base de datos `Web_Utn_19`. |

---

## 📌 Pendientes o Próximos pasos

- Validar acceso remoto de RCANIZA al panel WordPress y base de datos.  
- Implementar copia de seguridad programada para `Web_Utn_19`.  
- Documentar la configuración final de seguridad aplicada a MariaDB.  
- Completar verificación post-actualización de todas las VMs.  

---

✍️ *Última edición: 08/10/2025 19:40*
