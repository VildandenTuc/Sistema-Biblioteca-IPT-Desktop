// src/components/common/ExportButton.jsx

import { Dropdown } from "react-bootstrap";
import { FaFileDownload, FaFileExcel, FaFilePdf } from "react-icons/fa";
import { toast } from "react-toastify";

/**
 * Componente reutilizable para exportar datos a Excel o PDF
 * @param {Function} onExportExcel - Función que se ejecuta al exportar a Excel
 * @param {Function} onExportPDF - Función que se ejecuta al exportar a PDF
 * @param {String} variant - Variante de color del botón (default: "success")
 * @param {String} size - Tamaño del botón (default: "sm")
 * @param {Boolean} disabled - Si el botón está deshabilitado (default: false)
 */
const ExportButton = ({
  onExportExcel,
  onExportPDF,
  variant = "success",
  size = "sm",
  disabled = false,
}) => {
  const handleExport = (type) => {
    try {
      if (type === "excel") {
        const success = onExportExcel();
        if (success !== false) {
          toast.success("Reporte exportado a Excel exitosamente");
        }
      } else if (type === "pdf") {
        const success = onExportPDF();
        if (success !== false) {
          toast.success("Reporte exportado a PDF exitosamente");
        }
      }
    } catch (error) {
      console.error("Error al exportar:", error);
      toast.error("Error al exportar el reporte");
    }
  };

  return (
    <Dropdown>
      <Dropdown.Toggle variant={variant} size={size} disabled={disabled}>
        <FaFileDownload className="me-2" />
        Exportar
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item onClick={() => handleExport("excel")}>
          <FaFileExcel className="me-2 text-success" />
          Exportar a Excel (.xlsx)
        </Dropdown.Item>
        <Dropdown.Item onClick={() => handleExport("pdf")}>
          <FaFilePdf className="me-2 text-danger" />
          Exportar a PDF (.pdf)
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default ExportButton;
