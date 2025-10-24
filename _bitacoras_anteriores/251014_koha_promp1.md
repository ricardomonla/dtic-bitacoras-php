Perfecto, esto es algo bastante común en **Koha** (el sistema integrado de gestión bibliotecaria). Si ya no puedes ingresar con el usuario **superadministrador (usually `koha_admin`)** o cualquier otro usuario con privilegios de “superlibrarian”, existen varias formas de **recuperar el acceso administrativo directamente desde la base de datos**, especialmente si tienes acceso al servidor.

Te explico paso a paso cómo hacerlo desde la **consola Debian/Linux**, asumiendo que tienes acceso al sistema donde corre Koha y a su base de datos (MariaDB/MySQL):

---

## 🧭 Paso 1: Identificar la instancia de Koha

Primero, listá las instancias instaladas:

```bash
sudo koha-list
```

Esto te mostrará algo como:

```
biblioteca
```

Supongamos que tu instancia se llama `biblioteca`.
El nombre lo vas a usar en los siguientes comandos.

---

## 🧩 Paso 2: Conectarte a la base de datos de Koha

Entrá al shell de MariaDB con privilegios sobre la base de datos de Koha:

```bash
sudo koha-mysql biblioteca
```

(o bien:)

```bash
mysql -u root -p
USE koha_biblioteca;
```

> ⚠️ El nombre real de la base puede ser algo como `koha_biblioteca` o similar.

---

## 🧠 Paso 3: Ver los usuarios actuales

En la base, ejecutá:

```sql
SELECT borrowernumber, userid, firstname, surname, flags FROM borrowers;
```

Esto te mostrará todos los usuarios del sistema.

El campo `flags` indica los privilegios (permisos).

* El **valor 1** significa **superlibrarian (administrador total)**.
* Otros valores son combinaciones de permisos menores.

---

## 🛠️ Paso 4: Convertir un usuario común en administrador

Si aún puedes ingresar con un usuario sin privilegios, **podés elevarlo a administrador** con:

```sql
UPDATE borrowers SET flags=1 WHERE userid='nombre_usuario';
```

Luego salís del SQL:

```sql
EXIT;
```

Y listo — ahora ese usuario tiene permisos de **superadministrador**.
Podrás ingresar a la interfaz web con ese usuario y recuperar control total.

---

## 🔐 Paso 5: (Opcional) Resetear la contraseña del usuario administrador original

Si querés recuperar el `koha_admin`, primero verificá su `userid`:

```sql
SELECT userid FROM borrowers WHERE userid='koha_admin';
```

Y luego podés cambiarle la contraseña, por ejemplo a “admin123”:

```sql
UPDATE borrowers SET password=SHA1('admin123') WHERE userid='koha_admin';
```

> ⚠️ En versiones recientes de Koha, el campo de contraseña puede llamarse `password` o `passwordhash`, dependiendo del esquema. Si no te deja ingresar, probá con:
>
> ```sql
> UPDATE borrowers SET password=SHA1('admin123'), salt=NULL WHERE userid='koha_admin';
> ```

Después, podés entrar de nuevo con ese usuario y cambiar la contraseña desde la interfaz.

---

## 🧹 Paso 6: (Recomendado) Revisar logs y auditoría

Para confirmar qué ocurrió (por ejemplo, si el usuario fue modificado o desactivado), podés mirar los logs del sistema:

```bash
sudo tail -n 100 /var/log/koha/biblioteca/opac-error.log
sudo tail -n 100 /var/log/koha/biblioteca/intranet-error.log
```

---

## ✅ Resumen rápido

| Acción                | Comando clave                                                            |
| --------------------- | ------------------------------------------------------------------------ |
| Entrar al SQL de Koha | `sudo koha-mysql biblioteca`                                             |
| Ver usuarios          | `SELECT userid, flags FROM borrowers;`                                   |
| Dar privilegios admin | `UPDATE borrowers SET flags=1 WHERE userid='usuario';`                   |
| Resetear contraseña   | `UPDATE borrowers SET password=SHA1('nueva') WHERE userid='koha_admin';` |

---

¿Querés que te ayude a escribir exactamente los comandos adaptados a tu instalación (nombre real de la instancia y usuario)?
Si me decís cómo se llama la instancia (`koha-list`) y el usuario con el que aún podés entrar, te dejo el bloque exacto para copiar y pegar.
