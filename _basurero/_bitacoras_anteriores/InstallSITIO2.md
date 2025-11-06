Excelente 👏 — ya tenés conectividad y el usuario funcionando.

Ahora querés restringir **el acceso de `utnlr` solo a:**

* `localhost`, y
* hosts dentro de la red `10.0.10.X`

(Es decir, nada de conexiones desde otras IPs o externas).

---

## 🔒 Pasos para restringir el acceso

1️⃣ **Eliminar el usuario global (`'%'`)** que permite acceso desde cualquier lado:

```sql
DROP USER IF EXISTS 'utnlr'@'%';
```

---

2️⃣ **Crear los dos accesos permitidos:**

```sql
CREATE USER IF NOT EXISTS 'utnlr'@'localhost' IDENTIFIED BY 'UTN$utnlr00';
CREATE USER IF NOT EXISTS 'utnlr'@'10.0.10.%' IDENTIFIED BY 'UTN$utnlr00';
```

---

3️⃣ **Otorgar privilegios completos a ambos:**

```sql
GRANT ALL PRIVILEGES ON *.* TO 'utnlr'@'localhost' WITH GRANT OPTION;
GRANT ALL PRIVILEGES ON *.* TO 'utnlr'@'10.0.10.%' WITH GRANT OPTION;
FLUSH PRIVILEGES;
```

---

4️⃣ **Verificar:**

```sql
SELECT User, Host FROM mysql.user WHERE User='utnlr';
```

Deberías ver solo:

```
+-------+-------------+
| User  | Host        |
+-------+-------------+
| utnlr | localhost   |
| utnlr | 10.0.10.%   |
+-------+-------------+
```

---

5️⃣ **(Opcional pero recomendado):**
Editar el archivo de configuración de MariaDB (`/etc/mysql/mariadb.conf.d/50-server.cnf`) y asegurarte de que **solo escuche en esa red y localhost**:

```ini
bind-address = 127.0.0.1,10.0.10.19
```

Luego reiniciás el servicio:

```bash
sudo systemctl restart mariadb
```

---

✅ **Resultado final:**
El usuario `utnlr` solo podrá conectarse:

* desde la propia máquina (`localhost`), o
* desde equipos con IP en el rango `10.0.10.0/24`.

---

¿Querés que te deje el bloque completo de comandos listos para copiar y pegar en la consola de MariaDB?
