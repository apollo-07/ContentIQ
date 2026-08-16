import Papa from 'papaparse';

/**
 * Validates and extracts statistics from uploaded CSV data.
 * @param {File} file
 * @returns {Promise<Object>} Analysis and validation results
 */
export function parseAndValidateCSV(file) {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: (results) => {
        try {
          const data = results.data;
          const errors = results.errors || [];
          const headers = results.meta.fields || [];

          if (!data || data.length === 0) {
            return resolve({
              isValid: false,
              filename: file.name,
              fileSize: file.size,
              rowCount: 0,
              columnCount: 0,
              headers: [],
              missingValues: 0,
              duplicates: 0,
              previewRows: [],
              errors: ['File is empty or contains no readable rows.'],
            });
          }

          let missingValues = 0;
          const seenRows = new Set();
          let duplicates = 0;

          data.forEach((row) => {
            // Count missing / null / undefined / empty string values
            headers.forEach((h) => {
              const val = row[h];
              if (val === null || val === undefined || val === '') {
                missingValues++;
              }
            });

            // Duplicate row detection via string representation
            const serialized = JSON.stringify(row);
            if (seenRows.has(serialized)) {
              duplicates++;
            } else {
              seenRows.add(serialized);
            }
          });

          // Check for common recommended column headers in social media analytics
          const recommendedCols = ['content_type', 'topic', 'engagement_rate', 'likes', 'comments', 'shares'];
          const missingRecommended = recommendedCols.filter(
            (col) => !headers.some((h) => h.toLowerCase().includes(col.replace('_', '')) || h.toLowerCase() === col)
          );

          const validationErrors = errors.map((e) => `Line ${e.row || '?'}: ${e.message}`);
          if (missingValues > data.length * headers.length * 0.5) {
            validationErrors.push('Warning: Over 50% of the dataset cells contain missing values.');
          }

          resolve({
            isValid: validationErrors.length === 0 || errors.length === 0,
            filename: file.name,
            fileSize: file.size,
            rowCount: data.length,
            columnCount: headers.length,
            headers,
            missingValues,
            duplicates,
            previewRows: data.slice(0, 10),
            errors: validationErrors,
            missingRecommended,
            allData: data,
          });
        } catch (err) {
          reject(err);
        }
      },
      error: (error) => {
        reject(error);
      },
    });
  });
}
