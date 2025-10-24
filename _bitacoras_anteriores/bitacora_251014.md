# 📊 Bitácora SERVIDORES - 📅 14/10/2025

**Responsable:** Lic. Ricardo MONLA
**Área:** Departamento Servidores y Sistemas de Altas Prestaciones
**Oficina:** Dirección de Tecnologías de la Información y la Comunicación (DTIC)
**Institución:** Universidad Tecnológica Nacional – Facultad Regional La Rioja

---

## ⏱️ Cronología de Actividades

| Hora          | Recurso             | Detalle                   |
| ------------- | ------------------- | ------------------------- |
| 16:00_16:30 | **dtic_BITÁCORAS**  | Mejora del script de generación de bitácoras `nuevaBitacora.sh`, optimizando su estructura y nomenclatura para estandarizar registros automáticos. |
| 16:30_20:06 | **dtic_SERVIDORES** | Armado y testeo de **UPS2** con baterías nuevas. <br>• *18:27* – Inicio de prueba de **Tiempo de Carga Completa** (conexión continua hasta indicador de carga completa).<br>• *18:47* – Fin de prueba de carga.<br>• *18:47* – Inicio de prueba de **Control de Autonomía** (desconexión de red eléctrica y control del tiempo hasta apagado con carga real).<br>• *20:06* – Fin de prueba de autonomía. Resultados satisfactorios. |
| 19:10_19:40 | **srvv_DTIC**       | Actualización y optimización de servicios Docker.<br>• Desinstalación de servicios en desuso.<br>• Baja del contenedor `uptime-kuma` (`/docker/uptime_kuma$ docker compose down`).<br>• Actualización de la interfaz **Unifi Network** a la versión `9.5.21`. |
| 19:40_21:42 | **srvv_KOHA**       | Análisis y resolución del problema de acceso a la interfaz de administración. <br>• Se detectó que la modificación del número de credencial del usuario `rmonla` provocó una **desvinculación en índices de base de datos**. <br>• Desde consola Debian con privilegios administrativos (`sudo mariadb`), se restauraron permisos en la base `koha_utnlr`. <br>• Ejecución de consultas SQL para reestablecer privilegios y limpieza de usuarios inactivos. <br>• Se generó respaldo completo de la VM desde `srv-PMOX2`. <br>• Se crearon y validaron usuarios finales con privilegios administrativos: `rmonla`, `jessisanchez`, `silviaromero`. <br>• Pendiente: cambio de puerto 8080 → 80 y configuración DNS para acceso interno/externo. |

---

## ✅ Consultas SQL ejecutadas

```sql
rmonla@srvKOHA:~$ sudo koha-mysql utnlr
[sudo] password for rmonla: 
Reading table information for completion of table and column names
You can turn off this feature to get a quicker startup with -A

Welcome to the MariaDB monitor.  Commands end with ; or \g.
Your MariaDB connection id is 34
Server version: 10.5.29-MariaDB-0+deb11u1 Debian 11

Copyright (c) 2000, 2018, Oracle, MariaDB Corporation Ab and others.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.


MariaDB [koha_utnlr]> SELECT borrowernumber, userid, firstname, surname, flags FROM borrowers;
+----------------+----------------+-----------+-------------------+------------+
| borrowernumber | userid         | firstname | surname           | flags      |
+----------------+----------------+-----------+-------------------+------------+
|              1 | rmonla         | Ricardo   | Admin UTNLR       |          1 |
|              4 | jessisanchez   | NULL      | Jessica           | 1040055926 |
|              6 | sofiaemelivega | NULL      | Sofia  Emeli Vega |       NULL |
|              7 | silromero      | NULL      | AdminBiblio       |       NULL |
|              8 | rmonla2        | Ricardo   | MONLA             |       NULL |
+----------------+----------------+-----------+-------------------+------------+
5 rows in set (0,001 sec)

MariaDB [koha_utnlr]> UPDATE borrowers SET flags=1 WHERE userid='jessisanchez';
Query OK, 1 row affected (0,005 sec)
Rows matched: 1  Changed: 1  Warnings: 0

MariaDB [koha_utnlr]> SELECT borrowernumber, userid, firstname, surname, flags FROM borrowers;
+----------------+----------------+-----------+-------------------+-------+
| borrowernumber | userid         | firstname | surname           | flags |
+----------------+----------------+-----------+-------------------+-------+
|              1 | rmonla         | Ricardo   | Admin UTNLR       |     1 |
|              4 | jessisanchez   | NULL      | Jessica           |     1 |
|              6 | sofiaemelivega | NULL      | Sofia  Emeli Vega |  NULL |
|              7 | silromero      | NULL      | AdminBiblio       |  NULL |
|              8 | rmonla2        | Ricardo   | MONLA             |  NULL |
+----------------+----------------+-----------+-------------------+-------+
5 rows in set (0,000 sec)

MariaDB [koha_utnlr]> SELECT borrowernumber, userid, firstname, surname, flags FROM borrowers;
+----------------+--------------+-----------+-------------+-------+
| borrowernumber | userid       | firstname | surname     | flags |
+----------------+--------------+-----------+-------------+-------+
|              1 | rmonla       | Ricardo   | Admin UTNLR |     1 |
|              4 | jessisanchez | NULL      | Jessica     |     1 |
+----------------+--------------+-----------+-------------+-------+
2 rows in set (0,000 sec)

MariaDB [koha_utnlr]> UPDATE borrowers SET flags=1 WHERE userid='silviaromero';
Query OK, 1 row affected (0,001 sec)
Rows matched: 1  Changed: 1  Warnings: 0

MariaDB [koha_utnlr]> SELECT borrowernumber, userid, firstname, surname, flags FROM borrowers;
+----------------+--------------+-----------+--------------+-------+
| borrowernumber | userid       | firstname | surname      | flags |
+----------------+--------------+-----------+--------------+-------+
|              1 | rmonla       | Ricardo   | Admin UTNLR  |     1 |
|              4 | jessisanchez | NULL      | Jessica      |     1 |
|             10 | silviaromero | NULL      | silviaromero |     1 |
+----------------+--------------+-----------+--------------+-------+
3 rows in set (0,000 sec)
```

Usuarios finales activos con privilegios administrativos:

| Usuario        | Nombre  | Rol            | Privilegios |
| -------------- | ------- | -------------- | ----------- |
| `rmonla`       | Ricardo | Admin UTNLR    | ✅           |
| `jessisanchez` | Jessica | Administradora | ✅           |
| `silviaromero` | Silvia  | Administradora | ✅           |

---

## ✅ Conclusión del día

La jornada se centró en **mantenimiento técnico de servidores, optimización de infraestructura eléctrica y resolución de incidencias en sistemas**.
Se validó la operatividad de la **UPS2**, confirmando su autonomía y capacidad de respaldo ante cortes eléctricos.
En paralelo, se ejecutaron mejoras en la infraestructura Docker del servidor principal (`srvv-DTIC`), actualizando componentes y retirando servicios obsoletos.
Asimismo, se resolvió un incidente crítico en **srvv-KOHA**, restaurando el acceso administrativo mediante intervención directa en la base de datos y verificación integral de usuarios y privilegios.

Estas tareas fortalecen la **estabilidad operativa**, la **seguridad de acceso** y la **fiabilidad de los servicios institucionales de biblioteca y red**.

---

## 📊 Resumen por Recurso - 📅 14/10/2025

| Recurso             | Avance principal |
| ------------------- | ---------------- |
| **dtic_BITÁCORAS**  | Mejora y estandarización del script `nuevaBitacora.sh` para generación automatizada de bitácoras institucionales.                                |
| **dtic_SERVIDORES** | Pruebas de carga y autonomía en UPS2, con resultados positivos en condiciones reales.                                                            |
| **srvv_DTIC**       | Actualización de servicios Docker y plataforma Unifi Network a la versión `9.5.21`.                                                              |
| **srvv_KOHA**       | Resolución de problema de acceso por inconsistencia en base de datos, restaurando cuentas administrativas y realizando backup completo de la VM. |

---

## 📌 Pendientes o Próximos pasos

* Reconfigurar puerto de acceso de **KOHA** (8080 → 80).
* Ajustar DNS interno/externo para acceso transparente a la interfaz.
* Validar logs de autonomía de **UPS2** y documentar resultados.
* Consolidar la mejora del script `nuevaBitacora.sh` en el repositorio DTIC.
* Actualizar el histórico de recursos con las actividades del día.

---

✍️ *Última edición: 14/10/2025 21:50*

