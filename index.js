#!/usr/bin/env node

const fs = require("fs");
const xlsx = require("xlsx");
const inquirer = require("inquirer").default;

/**
 * Lee el archivo tracking-data.js existente y devuelve su contenido como objeto.
 */
function readExistingData(outputPath) {
  if (fs.existsSync(outputPath)) {
    try {
      const existingContent = fs.readFileSync(outputPath, "utf-8");
      return eval(existingContent); // ⚠️ Evalúa el archivo existente como objeto JS
    } catch (error) {
      console.error("❌ Error al leer el archivo existente:", error);
    }
  }
  return { views: { mobile: [], co: [], lo: [], imagin: [] }, events: {} };
}

/**
 * Convierte un archivo Excel en un JS estructurado con `views` y `events`
 */
function exportExcelToJS(
  excelPath,
  sheetName = "Pantallas Operativa",
  outputPath = "tracking-data.js",
  selectedChannel
) {
  try {
    console.log("🚀 Leyendo archivo Excel...");
    const workbook = xlsx.readFile(excelPath, { cellText: true, raw: false });
    const sheet = workbook.Sheets[sheetName];

    if (!sheet) {
      console.error(`❌ La hoja "${sheetName}" no existe en el archivo.`);
      return;
    }

    console.log(`✅ Hoja encontrada: ${sheetName}`);

    // Convertir la hoja en formato JSON
    const sheetData = xlsx.utils.sheet_to_json(sheet, { header: 1 });

    // Buscar la fila donde está "Tipo de HIT"
    let tipoHITRowIndex = -1;
    for (let i = 0; i < sheetData.length; i++) {
      if (
        sheetData[i][0] &&
        sheetData[i][0].toString().trim() === "Tipo de HIT"
      ) {
        tipoHITRowIndex = i;
        break;
      }
    }

    if (tipoHITRowIndex === -1) {
      console.error(
        "❌ No se encontró la fila 'Tipo de HIT'. Verifica el archivo Excel."
      );
      return;
    }

    console.log(
      `🔍 'Tipo de HIT' encontrado en la fila: ${tipoHITRowIndex + 1}`
    );

    // Obtener las claves (columna A)
    const propertyNames = sheetData
      .map((row) => row[0]?.toString().trim())
      .filter(Boolean);
    console.log("🔍 Propiedades detectadas:", propertyNames);

    // Cargar los datos existentes
    const existingData = readExistingData(outputPath);

    // Crear un diccionario para almacenar los datos organizados
    const data = [];

    // Recorrer las columnas (B, C, D...) para extraer los valores correctamente
    for (let col = 1; col < sheetData[tipoHITRowIndex].length; col++) {
      const colValues = sheetData.map((row) =>
        row[col] ? row[col].toString().trim() : ""
      );
      const entry = Object.fromEntries(
        propertyNames.map((prop, i) => [prop, colValues[i]])
      );

      if (entry["Tipo de HIT"]) {
        data.push(entry);
      }
    }

    console.log("🔄 Datos extraídos del Excel:", JSON.stringify(data, null, 2));

    let foundViews = 0;
    let foundEvents = 0;
    const eventNamesCount = {};

    for (const entry of data) {
      const tipoHIT = entry["Tipo de HIT"] ? entry["Tipo de HIT"].trim() : "";

      if (tipoHIT === "pageView (sendView)") {
        console.log(`📌 View detectada:`, entry);
        existingData.views[selectedChannel].push(entry);
        foundViews++;
      } else if (tipoHIT === "Async event (sendLink)") {
        let eventId = entry["page_name"]
          ? entry["page_name"]
              .trim()
              .toLowerCase()
              .replace(/ /g, "")
              .replace(/:/g, "")
          : "unknown_event";

        if (eventNamesCount[eventId]) {
          eventNamesCount[eventId]++;
          eventId = `${eventId}_${eventNamesCount[eventId]}`;
        } else {
          eventNamesCount[eventId] = 1;
        }

        if (!existingData.events[eventId]) {
          existingData.events[eventId] = {
            mobile: {},
            co: {},
            lo: {},
            imagin: {},
          };
        }

        console.log(`🎯 Event detectado:`, eventId);
        existingData.events[eventId][selectedChannel] = entry;
        foundEvents++;
      }
    }

    console.log(`✅ Views detectadas: ${foundViews}`);
    console.log(`✅ Events detectados: ${foundEvents}`);

    if (foundViews === 0 && foundEvents === 0) {
      console.warn(
        "⚠️ No se detectaron views ni events. Verifica que los valores de 'Tipo de HIT' sean correctos."
      );
    }

    function formatJSONWithoutQuotes(obj) {
      return JSON.stringify(obj, null, 2).replace(/"([^"]+)":/g, "$1:");
    }

    const jsContent = `export const views = ${formatJSONWithoutQuotes(
      existingData.views
    )};

//informar event_category siempre aunque sea ''
export const events = ${formatJSONWithoutQuotes(existingData.events)};
`;

    fs.writeFileSync(outputPath, jsContent, "utf-8");

    console.log(`✅ Archivo actualizado en: ${outputPath}`);

    // 🔴 ADVERTENCIA AL USUARIO
    console.log("⚠️ IMPORTANTE: Revisa el archivo generado tracking-data.js.");
    console.log(
      "⚠️ Puede incluir campos innecesarios, ya que es una copia del Excel pasado."
    );
    console.log(
      "⚠️ Se recomienda configurar manualmente los valores de `page_route` según los requisitos del proyecto."
    );
    console.log(`ℹ️ Proyecto desarrollado por @monicatvera`);
  } catch (error) {
    console.error("❌ Error procesando el archivo:", error);
  }
}

// **CLI Interactiva**
async function runCLI() {
  const args = process.argv.slice(2);
  if (args.length < 1) {
    console.error("❌ Uso: node index.js <archivo.xlsx>");
    process.exit(1);
  }

  const excelPath = args[0];
  const sheetName = "Pantallas Operativa";
  const outputPath = "tracking-data.js";

  const answers = await inquirer.prompt([
    {
      type: "list",
      name: "selectedChannel",
      message: "Selecciona el canal para aplicar el etiquetado:",
      choices: ["mobile", "co", "lo", "imagin"],
    },
  ]);

  exportExcelToJS(excelPath, sheetName, outputPath, answers.selectedChannel);
}

if (require.main === module) {
  runCLI();
}

module.exports = exportExcelToJS;
