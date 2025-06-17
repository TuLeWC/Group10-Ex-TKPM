import React, { useState } from "react";
import {
  Container,
  Card,
  Form,
  Button,
  Alert,
  ProgressBar,
} from "react-bootstrap";
import Papa from "papaparse";
import { saveAs } from "file-saver";
import axios from "axios";
import { Link } from "react-router-dom";
import { postDataToAPI } from "../ultis/api";
import { useTranslation } from "react-i18next";

const Import = () => {
  const { t } = useTranslation('import');
  const [importFile, setImportFile] = useState(null);
  const [importFormat, setImportFormat] = useState("csv");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importStats, setImportStats] = useState({
    success: 0,
    failed: 0,
    total: 0,
  });

  const handleFileChange = (e) => {
    setImportFile(e.target.files[0]);
    setMessage(null);
    setError(null);
    setImportStats({ success: 0, failed: 0, total: 0 });
    setImportProgress(0);
  };

  const handleFormatChange = (e) => {
    setImportFormat(e.target.value);
  };

  const parseCSV = (file) => {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.errors && results.errors.length > 0) {
            reject(results.errors[0].message);
            return;
          }

          try {
            // Xử lý dữ liệu từ CSV và chuyển đổi các đối tượng JSON lại thành objects
            const processedData = results.data.map((row) => {
              const processedRow = { ...row };

              // Xử lý các trường có thể là JSON string
              Object.keys(row).forEach((key) => {
                // Bỏ qua các trường rỗng
                if (!row[key]) return;

                // Các trường cần chuyển từ string JSON sang object
                if (
                  [
                    "faculty",
                    "program",
                    "studentStatus",
                    "addresses",
                    "idDocument",
                  ].includes(key)
                ) {
                  try {
                    // Kiểm tra xem có phải string có format JSON không
                    if (row[key].startsWith("{") || row[key].startsWith("[")) {
                      processedRow[key] = JSON.parse(
                        row[key].replace(/\"\"/g, '"')
                      );
                    }
                  } catch (err) {
                    console.warn(t('warnings.parse_field', { key }), err);
                  }
                }

                // Xử lý trường dateOfBirth từ định dạng dd/mm/yyyy sang ISO
                if (key === "dateOfBirth" && row[key].includes("/")) {
                  const [day, month, year] = row[key].split("/");
                  processedRow[key] = `${year}-${month.padStart(
                    2,
                    "0"
                  )}-${day.padStart(2, "0")}`;
                }
              });

              return processedRow;
            });

            resolve(processedData);
          } catch (error) {
            reject(t('errors.process_csv', { error: error.message }));
          }
        },
        error: (error) => {
          reject(t('errors.read_csv', { error: error.message }));
        },
        // Thêm cấu hình để xử lý dữ liệu chính xác hơn
        dynamicTyping: false, // Giữ nguyên kiểu dữ liệu string
        transformHeader: (header) => header.trim(),
      });
    });
  };

  const parseJSON = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          if (Array.isArray(data)) {
            resolve(data);
          } else {
            reject(t('errors.json_array_required'));
          }
        } catch (error) {
          reject(t('errors.parse_json', { error: error.message }));
        }
      };
      reader.onerror = () => {
        reject(t('errors.read_file'));
      };
      reader.readAsText(file);
    });
  };

  const handleImport = async () => {
    if (!importFile) {
      setError(t('errors.select_file'));
      return;
    }

    setImporting(true);
    setError(null);
    setMessage(t('messages.processing_file'));
    setImportProgress(0);
    setImportStats({ success: 0, failed: 0, total: 0 });

    try {
      // Parse file based on format
      let students = [];
      if (importFormat === "csv") {
        students = await parseCSV(importFile);
      } else {
        students = await parseJSON(importFile);
      }

      if (!students || students.length === 0) {
        setError(t('errors.no_student_data'));
        setImporting(false);
        setMessage(null);
        return;
      }

      setImportStats((prev) => ({ ...prev, total: students.length }));
      setMessage(t('messages.importing_students', { count: students.length }));

      let successCount = 0;
      let failedCount = 0;
      const failures = [];

      // Process students one by one
      for (let i = 0; i < students.length; i++) {
        const student = students[i];
        const result = await postDataToAPI("/api/students", student);

        if (result) {
          successCount++;
        } else {
          failedCount++;
          failures.push({
            student: `${student.id} - ${student.fullName || "Unknown"}`,
            error: result.error,
          });
        }

        // Update progress
        const progress = Math.round(((i + 1) / students.length) * 100);
        setImportProgress(progress);
        setImportStats({
          success: successCount,
          failed: failedCount,
          total: students.length,
        });
      }

      // Final message
      if (failedCount === 0) {
        setMessage(t('messages.import_success', { count: successCount }));
      } else {
        setMessage(
          t('messages.import_partial', {
            success: successCount,
            total: students.length,
            failed: failedCount,
          })
        );
        setError(t('errors.import_failed'));
        console.log(failures);
      }
    } catch (err) {
      setError(t('errors.processing_file', { error: err.message || err }));
      setMessage(null);
    } finally {
      setImporting(false);
      setImportFile(null);
    }
  };

  const handleExport = async (format) => {
    try {
      const response = await axios.get(`${API_URL}/export/${format}`, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], {
        type: format === "csv" ? "text/csv" : "application/json",
      });

      saveAs(blob, `students.${format}`);

      setMessage(`Xuất dữ liệu sang ${format.toUpperCase()} thành công`);
      setError(null);
    } catch (err) {
      setError(`Có lỗi xảy ra khi xuất dữ liệu sang ${format.toUpperCase()}`);
      setMessage(null);
    }
  };

  return (
    <Container className="mt-5">
      <div className="w-100 flex flex-row jus-justify-content-between align-items-center">
        <Link to="/" className="btn btn-info text-white">
        {t('buttons.back')}
        </Link>
        <h2>{t('title')}</h2>
      </div>

      {message && (
        <Alert variant="success" className="mt-3">
          {message}
        </Alert>
      )}

      {error && (
        <Alert variant="danger" className="mt-3">
          {error}
        </Alert>
      )}

      <Card className="mt-4">
        <Card.Header as="h5">{t('import_section.title')}</Card.Header>
        <Card.Body>
          <Form.Group className="mb-3">
            <Form.Label>{t('import_section.select_format')}</Form.Label>
            <Form.Select
              value={importFormat}
              onChange={handleFormatChange}
              disabled={importing}
            >
              <option value="csv">CSV</option>
              <option value="json">JSON</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>{t('import_section.select_file')}</Form.Label>
            <Form.Control
              type="file"
              accept={importFormat === "csv" ? ".csv" : ".json"}
              onChange={handleFileChange}
              disabled={importing}
            />
            <Form.Text className="text-muted">
              {importFormat === "csv"
                ? t('import_section.csv_hint')
                : t('import_section.json_hint')}
            </Form.Text>
          </Form.Group>

          {importing && (
            <div className="mb-3">
              <ProgressBar
                now={importProgress}
                label={`${importProgress}%`}
                animated
              />
              <div className="d-flex justify-content-between mt-2 text-muted small">
                <span>{t('import_section.success')}: {importStats.success}</span>
                <span>{t('import_section.failed')}: {importStats.failed}</span>
                <span>{t('import_section.total')}: {importStats.total}</span>
              </div>
            </div>
          )}

          <Button
            variant="primary"
            onClick={handleImport}
            disabled={!importFile || importing}
          >
            {importing ? t('buttons.importing') : t('buttons.import')}
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Import;
