// src/components/admin/BackupManager.jsx

import { useState, useEffect } from "react";
import { Container, Card, Button, Table, Alert, Modal, Form, Spinner, Badge } from "react-bootstrap";
import { FaDatabase, FaDownload, FaUpload, FaTrash, FaSyncAlt } from "react-icons/fa";
import axiosInstance from "../../api/axiosConfig";
import { ENDPOINTS } from "../../api/endpoints";
import { toast } from "react-toastify";

const BackupManager = () => {
  const [backups, setBackups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetchBackups();
  }, []);

  // Obtener lista de backups
  const fetchBackups = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(ENDPOINTS.BACKUP.LIST);
      setBackups(response.data);
    } catch (error) {
      console.error("Error al cargar backups:", error);
      toast.error("Error al cargar la lista de backups");
    } finally {
      setLoading(false);
    }
  };

  // Generar backup en el servidor
  const handleExport = async () => {
    if (!window.confirm("¿Generar un nuevo backup de la base de datos?")) {
      return;
    }

    setExporting(true);
    try {
      const response = await axiosInstance.post(ENDPOINTS.BACKUP.EXPORT);

      if (response.data.success) {
        toast.success(`Backup generado exitosamente: ${response.data.filename}`);
        fetchBackups(); // Actualizar lista
      } else {
        toast.error(response.data.message || "Error al generar el backup");
      }
    } catch (error) {
      console.error("Error al generar backup:", error);
      const errorMessage = error.response?.data?.message ||
                          error.errorMessage ||
                          "Error al generar el backup";
      toast.error(errorMessage);
    } finally {
      setExporting(false);
    }
  };

  // Descargar backup existente
  const handleDownload = async (filename) => {
    try {
      const response = await axiosInstance.get(
        ENDPOINTS.BACKUP.DOWNLOAD(filename),
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Backup descargado exitosamente");
    } catch (error) {
      console.error("Error al descargar backup:", error);
      toast.error("Error al descargar el backup");
    }
  };

  // Restaurar backup
  const handleImport = async () => {
    if (!selectedFile) {
      toast.warning("Selecciona un archivo .sql");
      return;
    }

    if (!window.confirm("⚠️ ADVERTENCIA: Restaurar un backup reemplazará TODOS los datos actuales. ¿Continuar?")) {
      return;
    }

    setImporting(true);
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await axiosInstance.post(ENDPOINTS.BACKUP.IMPORT, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(response.data.message || "Backup restaurado exitosamente");
      setShowImportModal(false);
      setSelectedFile(null);
      fetchBackups();
    } catch (error) {
      console.error("Error al restaurar backup:", error);
      const errorMessage = error.response?.data?.message ||
                          error.errorMessage ||
                          "Error al restaurar el backup";
      toast.error(errorMessage);
    } finally {
      setImporting(false);
    }
  };

  // Eliminar backup
  const handleDelete = async (filename) => {
    if (!window.confirm(`¿Eliminar el backup "${filename}"?`)) {
      return;
    }

    try {
      await axiosInstance.delete(ENDPOINTS.BACKUP.DELETE(filename));
      toast.success("Backup eliminado exitosamente");
      fetchBackups();
    } catch (error) {
      console.error("Error al eliminar backup:", error);
      toast.error("Error al eliminar el backup");
    }
  };

  // Formatear tamaño de archivo
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  // Manejar selección de archivo
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.name.endsWith('.sql')) {
        toast.warning("Solo se permiten archivos .sql");
        e.target.value = null;
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
    }
  };

  return (
    <Container className="py-4">
      <h2 className="mb-4">
        <FaDatabase className="me-2" />
        Gestión de Backups
      </h2>

      {/* Alertas informativas */}
      <Alert variant="info" className="mb-4">
        <strong>ℹ️ Información:</strong> Los backups incluyen toda la estructura y datos de la base de datos.
        Se recomienda generar backups periódicamente antes de realizar cambios importantes.
      </Alert>

      {/* Botones de acción */}
      <Card className="mb-4">
        <Card.Body>
          <div className="d-flex gap-3 flex-wrap">
            <Button
              variant="primary"
              onClick={handleExport}
              disabled={exporting}
            >
              {exporting ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Generando...
                </>
              ) : (
                <>
                  <FaDownload className="me-2" />
                  Generar Backup
                </>
              )}
            </Button>

            <Button
              variant="warning"
              onClick={() => setShowImportModal(true)}
            >
              <FaUpload className="me-2" />
              Restaurar Backup
            </Button>

            <Button variant="secondary" onClick={fetchBackups}>
              <FaSyncAlt className="me-2" />
              Actualizar Lista
            </Button>
          </div>
        </Card.Body>
      </Card>

      {/* Lista de backups */}
      <Card>
        <Card.Header>
          <h5 className="mb-0">Backups Disponibles</h5>
        </Card.Header>
        <Card.Body>
          {loading ? (
            <div className="text-center py-4">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2">Cargando backups...</p>
            </div>
          ) : backups.length === 0 ? (
            <Alert variant="secondary">No hay backups disponibles</Alert>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Nombre de Archivo</th>
                  <th>Tamaño</th>
                  <th>Fecha de Creación</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {backups.map((backup) => (
                  <tr key={backup.filename}>
                    <td>{backup.filename}</td>
                    <td>
                      <Badge bg="info">{formatFileSize(backup.sizeBytes)}</Badge>
                    </td>
                    <td>{new Date(backup.createdDate).toLocaleString("es-AR")}</td>
                    <td>
                      <Button
                        variant="success"
                        size="sm"
                        className="me-2"
                        onClick={() => handleDownload(backup.filename)}
                      >
                        <FaDownload /> Descargar
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(backup.filename)}
                      >
                        <FaTrash /> Eliminar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Modal de importación */}
      <Modal show={showImportModal} onHide={() => setShowImportModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Restaurar Backup</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="danger">
            <strong>⚠️ ADVERTENCIA:</strong> Esta acción reemplazará TODOS los datos actuales
            con los del archivo de backup. Esta operación no se puede deshacer.
          </Alert>

          <Form.Group>
            <Form.Label>Seleccionar archivo .sql</Form.Label>
            <Form.Control
              type="file"
              accept=".sql"
              onChange={handleFileChange}
            />
            {selectedFile && (
              <Form.Text className="text-muted">
                Archivo seleccionado: {selectedFile.name} ({formatFileSize(selectedFile.size)})
              </Form.Text>
            )}
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => {
            setShowImportModal(false);
            setSelectedFile(null);
          }}>
            Cancelar
          </Button>
          <Button
            variant="danger"
            onClick={handleImport}
            disabled={!selectedFile || importing}
          >
            {importing ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Restaurando...
              </>
            ) : (
              "Confirmar Restauración"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default BackupManager;
