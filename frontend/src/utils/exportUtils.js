// src/utils/exportUtils.js

import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/**
 * Exporta datos a Excel (.xlsx)
 * @param {Array} data - Array de objetos con los datos
 * @param {String} fileName - Nombre del archivo (sin extensión)
 * @param {String} sheetName - Nombre de la hoja
 */
export const exportToExcel = (data, fileName = "reporte", sheetName = "Datos") => {
  try {
    // Crear libro de trabajo
    const workbook = XLSX.utils.book_new();

    // Convertir datos a hoja de cálculo
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Agregar hoja al libro
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    // Generar archivo y descargar
    XLSX.writeFile(workbook, `${fileName}.xlsx`);

    return true;
  } catch (error) {
    console.error("Error al exportar a Excel:", error);
    return false;
  }
};

/**
 * Exporta datos a PDF
 * @param {Array} data - Array de objetos con los datos
 * @param {Array} columns - Array de objetos con configuración de columnas: [{ header: "Nombre", dataKey: "nombre" }]
 * @param {String} fileName - Nombre del archivo (sin extensión)
 * @param {String} title - Título del documento
 */
export const exportToPDF = (
  data,
  columns,
  fileName = "reporte",
  title = "Reporte"
) => {
  try {
    // Crear documento PDF en orientación landscape si hay muchas columnas
    const orientation = columns.length > 5 ? "landscape" : "portrait";
    const doc = new jsPDF(orientation);

    // Configurar fuente
    doc.setFontSize(16);
    doc.text(title, 14, 15);

    // Agregar fecha de generación
    doc.setFontSize(10);
    const fecha = new Date().toLocaleDateString("es-AR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    doc.text(`Generado: ${fecha}`, 14, 22);

    // Crear tabla usando autoTable
    autoTable(doc, {
      startY: 28,
      head: [columns.map((col) => col.header)],
      body: data.map((row) => columns.map((col) => row[col.dataKey] || "-")),
      styles: {
        fontSize: 9,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [13, 110, 253], // Color azul Bootstrap primary
        textColor: 255,
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      margin: { top: 28 },
    });

    // Agregar pie de página con número de página
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.text(
        `Página ${i} de ${pageCount}`,
        doc.internal.pageSize.width / 2,
        doc.internal.pageSize.height - 10,
        { align: "center" }
      );
    }

    // Descargar PDF
    doc.save(`${fileName}.pdf`);

    return true;
  } catch (error) {
    console.error("Error al exportar a PDF:", error);
    return false;
  }
};
