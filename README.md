# 📊 Teatem

**Teatem** es una herramienta CLI que permite **convertir datos de un archivo Excel a un archivo JavaScript estructurado** con `views` y `events` para diferentes canales (`mobile`, `co`, `lo`, `imagin`).  

Facilita la gestión del etiquetado de datos en plataformas de seguimiento sin perder información previa.

---

## 🚀 Características

✅ **Convierte datos de un archivo Excel a un JavaScript estructurado**  
✅ **Selecciona interactivamente el canal en el que deseas aplicar el etiquetado**  
✅ **Genera un archivo `tracking-data.js` organizado en `views` y `events`**  

---

## 📦 Instalación

Si deseas instalarlo globalmente desde npm:

```sh
npm install -g teatem
```

Si deseas usarlo de forma local en un proyecto:

```sh
npm install teatem --save-dev
```

Si deseas clonar el código directamente:

```sh
git clone https://github.com/monicatvera/teatem.git
cd teatem
npm install
```

---

## 🔧 Uso

### 1️⃣ **Ejecutar el script**
```sh
teatem <archivo.xlsx>
```
Ejemplo:
```sh
teatem cdb_etiquetado.xlsx
```

### 2️⃣ **Seleccionar el canal**
Al ejecutar el comando, aparecerá un menú interactivo:
```
Selecciona el canal para aplicar el etiquetado:
> mobile
  co
  lo
  imagin
```
Selecciona una opción y presiona `Enter`.

### 3️⃣ **Revisar el archivo generado**
Después de ejecutar el script, se creará o actualizará el archivo `tracking-data.js` con la siguiente estructura:

```javascript
export const views = {
  mobile: [...],  // Datos de views del canal mobile
  co: [...],      // Datos de views del canal co
  lo: [...],      // Datos de views del canal lo
  imagin: [...]   // Datos de views del canal imagin
};

//informar event_category siempre aunque sea ''
export const events = {
  "event_id_1": { mobile: {...}, co: {...}, lo: {...}, imagin: {...} },
  "event_id_2": { mobile: {...}, co: {...}, lo: {...}, imagin: {...} }
};
```

Cada vez que ejecutas el script con otro canal, **solo se actualizarán los datos de ese canal sin afectar los demás**.

---

## ⚠️ Importante

🔹 **Revisa el archivo `tracking-data.js` después de la conversión.** Puede incluir algunos campos innecesarios, ya que es una copia del Excel.  
🔹 **Es necesario configurar manualmente los valores de `page_route` según los requisitos del proyecto.**  
🔹 **Si ejecutas el script con diferentes canales (`mobile`, `co`, `lo`, `imagin`), solo se actualizará el canal seleccionado y se mantendrán los demás sin cambios.**  

---

## 🛠 Requisitos y dependencias

Este script usa:
- **Node.js** (`>=14.0.0`)
- **Paquetes npm:**
  - `xlsx` (para leer archivos Excel)
  - `inquirer` (para la CLI interactiva)

Si no tienes las dependencias, instálalas con:
```sh
npm install
```

---

## 📝 Licencia

Este proyecto está bajo la licencia **MIT**. Puedes usarlo, modificarlo y compartirlo libremente. 😃

---

## 🔗 Contacto

Desarrollado por [@monicatvera](https://github.com/monicatvera)  

Si tienes preguntas o sugerencias, no dudes en abrir un **issue** en GitHub o contribuir al proyecto. 🚀
