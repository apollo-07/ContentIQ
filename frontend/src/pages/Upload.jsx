import React, { useState, useEffect, useRef } from 'react';
import { uploadDataset, getDatasets } from '../services/api';
import { parseAndValidateCSV } from '../services/csvParser';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { ProgressBar } from '../components/common/ProgressBar';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorState } from '../components/common/ErrorState';
import { formatNumber } from '../utils/formatters';
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Clock,
  Database,
  Download,
  Check,
  RefreshCw,
  AlertCircle,
  Eye,
  Sparkles,
  Zap,
} from 'lucide-react';

export function Upload() {
  const [datasets, setDatasets] = useState([]);
  const [loadingDatasets, setLoadingDatasets] = useState(true);
  const [uploadStatus, setUploadStatus] = useState('idle'); // 'idle' | 'parsing' | 'uploading' | 'success' | 'error'
  const [uploadProgress, setUploadProgress] = useState(0);
  const [validationResult, setValidationResult] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const fetchDatasetHistory = async () => {
    setLoadingDatasets(true);
    try {
      const data = await getDatasets();
      setDatasets(data || []);
    } catch (err) {
      console.error('Failed to load dataset history:', err);
    } finally {
      setLoadingDatasets(false);
    }
  };

  useEffect(() => {
    fetchDatasetHistory();
  }, []);

  const handleFileProcess = async (file) => {
    if (!file) return;
    if (!file.name.endsWith('.csv') && file.type !== 'text/csv') {
      setUploadError('Invalid file type. Please upload a standard comma-separated (.csv) file.');
      return;
    }

    setUploadError(null);
    setUploadStatus('parsing');
    setUploadProgress(20);

    try {
      // 1. Client-side parse & validate
      const parsed = await parseAndValidateCSV(file);
      setValidationResult(parsed);
      setUploadProgress(50);
      setUploadStatus('uploading');

      // 2. Upload to API service
      const res = await uploadDataset(file);
      setUploadProgress(100);
      setUploadStatus('success');

      // Refresh history
      fetchDatasetHistory();
    } catch (err) {
      console.error('Upload failed:', err);
      setUploadStatus('error');
      setUploadError(
        err.response?.data?.detail || err.message || 'File processing or upload failed.'
      );
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDownloadSampleCSV = () => {
    const csvContent =
      'post_id,content_type,topic,day,hour,caption_length,hashtag_count,likes,comments,shares,engagement_rate\n' +
      '1,Reel,Behind the Scenes,Saturday,19,160,5,1820,140,85,8.6\n' +
      '2,Carousel,Tutorial & Tips,Thursday,18,340,7,1250,95,60,7.8\n' +
      '3,Single Image,Product,Monday,12,90,3,890,42,15,5.2\n' +
      '4,Reel,Product,Wednesday,20,180,6,2100,165,110,8.9\n' +
      '5,Video (Long),Industry Insights,Friday,15,450,4,780,50,22,4.7\n' +
      '6,Carousel,User Testimonials,Tuesday,17,210,5,1140,88,45,7.1\n' +
      '7,Single Image,Company Culture,Sunday,21,110,3,670,30,12,4.3\n';

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'sample_contentiq_social_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetUploader = () => {
    setUploadStatus('idle');
    setValidationResult(null);
    setUploadError(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neo-yellow/20 border-2 border-neo-yellow text-neo-yellow text-xs font-black uppercase tracking-wider mb-2">
            <Database className="w-3.5 h-3.5" />
            Data Ingestion Engine
          </div>
          <h2 className="text-2xl sm:text-4xl font-display font-black text-white tracking-tight">
            Dataset Ingestion & Validation
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Upload CSV social-media exports with automated client verification of schemas, missing cells, and duplicate rows.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleDownloadSampleCSV}
          icon={Download}
        >
          Download Sample CSV
        </Button>
      </div>

      {/* Upload Zone */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6">
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
              className={`border-2 border-dashed rounded-2xl p-8 sm:p-10 text-center cursor-pointer transition-all ${
                isDragOver
                  ? 'border-neo-yellow bg-neo-yellow/10 shadow-neo'
                  : 'border-slate-700 hover:border-neo-yellow hover:bg-slate-900/60'
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => e.target.files?.[0] && handleFileProcess(e.target.files[0])}
                accept=".csv,text/csv"
                className="hidden"
              />

              <div className="w-16 h-16 rounded-2xl bg-neo-yellow text-slate-950 border-2 border-slate-950 flex items-center justify-center mx-auto mb-4 shadow-neo">
                <UploadCloud className="w-8 h-8" />
              </div>

              <h4 className="text-lg font-display font-black text-white tracking-tight">
                Drag and drop your CSV file here
              </h4>
              <p className="text-xs text-slate-400 mt-1.5 mb-4 max-w-sm mx-auto font-medium">
                Supports post-level metrics with columns like content_type, topic, likes, comments, and reach.
              </p>

              <Button variant="primary" size="sm" type="button">
                Browse Local Files
              </Button>
            </div>

            {/* Upload Status & Progress */}
            {uploadStatus !== 'idle' && (
              <div className="mt-6 p-4 rounded-xl bg-slate-900 border-2 border-slate-800 space-y-3 shadow-neo-sm">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-mono">
                    {uploadStatus === 'uploading' || uploadStatus === 'parsing' ? (
                      <LoadingSpinner size="sm" message="" />
                    ) : uploadStatus === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 text-neo-mint" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-neo-pink" />
                    )}
                    <span className="font-bold text-white uppercase">
                      {uploadStatus === 'parsing' && 'Validating CSV Schema...'}
                      {uploadStatus === 'uploading' && 'Ingesting into Database Pipeline...'}
                      {uploadStatus === 'success' && 'Upload & Validation Complete!'}
                      {uploadStatus === 'error' && 'Upload Failed'}
                    </span>
                  </div>
                  {uploadStatus === 'success' && (
                    <button
                      onClick={resetUploader}
                      className="text-neo-yellow hover:underline font-black text-xs uppercase font-mono"
                    >
                      Upload Another
                    </button>
                  )}
                </div>

                <ProgressBar
                  value={uploadProgress}
                  max={100}
                  variant="segmented"
                  color={uploadStatus === 'error' ? 'pink' : 'emerald'}
                  size="sm"
                />

                {uploadError && (
                  <p className="text-xs text-neo-pink font-bold mt-1 font-mono">{uploadError}</p>
                )}
              </div>
            )}
          </Card>
        </div>

        {/* Validation Result Inspection Card */}
        <div className="lg:col-span-5 space-y-6">
          <Card
            title="VALIDATION BREAKDOWN"
            subtitle="Automated dataset health score and schema metrics"
            icon={FileSpreadsheet}
          >
            {!validationResult ? (
              <div className="py-12 text-center text-slate-500 text-xs font-mono">
                <FileText className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <span>Upload a CSV file to inspect row counts, duplicate checks, and missing cell audits.</span>
              </div>
            ) : (
              <div className="space-y-4 mt-4">
                <div className="p-3 rounded-xl bg-slate-900 border-2 border-slate-800 flex items-center justify-between shadow-neo-sm">
                  <span className="text-xs text-slate-400 font-mono font-bold">File Name:</span>
                  <span className="text-xs font-black text-white truncate max-w-[200px] font-mono">
                    {validationResult.filename}
                  </span>
                </div>

                {/* Validation Stats Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-slate-900 border-2 border-slate-800 shadow-neo-sm">
                    <span className="text-[10px] uppercase font-mono font-bold text-slate-400">Total Rows</span>
                    <p className="text-lg font-display font-black text-white mt-0.5">
                      {formatNumber(validationResult.rowCount)}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border-2 border-slate-800 shadow-neo-sm">
                    <span className="text-[10px] uppercase font-mono font-bold text-slate-400">Total Columns</span>
                    <p className="text-lg font-display font-black text-white mt-0.5">
                      {validationResult.columnCount}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border-2 border-slate-800 shadow-neo-sm">
                    <span className="text-[10px] uppercase font-mono font-bold text-slate-400">Missing Values</span>
                    <p
                      className={`text-lg font-display font-black mt-0.5 ${
                        validationResult.missingValues > 0 ? 'text-neo-yellow' : 'text-neo-mint'
                      }`}
                    >
                      {validationResult.missingValues}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border-2 border-slate-800 shadow-neo-sm">
                    <span className="text-[10px] uppercase font-mono font-bold text-slate-400">Duplicate Rows</span>
                    <p
                      className={`text-lg font-display font-black mt-0.5 ${
                        validationResult.duplicates > 0 ? 'text-neo-pink' : 'text-neo-mint'
                      }`}
                    >
                      {validationResult.duplicates}
                    </p>
                  </div>
                </div>

                {/* Errors or Warnings */}
                {validationResult.errors && validationResult.errors.length > 0 ? (
                  <div className="p-3 rounded-xl bg-rose-500/10 border-2 border-rose-500 text-xs text-rose-300 space-y-1 font-mono shadow-neo-sm">
                    <div className="font-black flex items-center gap-1.5 uppercase">
                      <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                      Detected Issues:
                    </div>
                    <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                      {validationResult.errors.map((err, i) => (
                        <li key={i}>{err}</li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border-2 border-emerald-500 text-xs text-emerald-300 flex items-center gap-2 font-mono shadow-neo-sm font-bold">
                    <CheckCircle2 className="w-4 h-4 text-neo-mint flex-shrink-0" />
                    <span>Clean dataset. Zero fatal schema formatting errors detected.</span>
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Dataset History Table */}
      <Card
        title="INGESTED DATASETS REPOSITORY"
        subtitle="Catalog of processed social intelligence files available for modeling"
        icon={Database}
        action={
          <Button
            variant="ghost"
            size="xs"
            onClick={fetchDatasetHistory}
            icon={RefreshCw}
          >
            Refresh
          </Button>
        }
      >
        {loadingDatasets ? (
          <LoadingSpinner message="Fetching dataset catalog..." />
        ) : datasets.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs font-mono">
            No datasets uploaded yet. Use the uploader above to add your first social dataset.
          </div>
        ) : (
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-slate-400 uppercase tracking-wider border-b-2 border-slate-800 font-mono font-bold">
                <tr>
                  <th className="py-3 px-4">Dataset ID / Filename</th>
                  <th className="py-3 px-4">Rows</th>
                  <th className="py-3 px-4">Cols</th>
                  <th className="py-3 px-4">Missing</th>
                  <th className="py-3 px-4">Duplicates</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Uploaded</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-slate-800 font-mono">
                {datasets.map((ds) => (
                  <tr key={ds.id} className="hover:bg-slate-900/60 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white">
                      <div className="flex items-center gap-2">
                        <FileSpreadsheet className="w-4 h-4 text-neo-yellow flex-shrink-0" />
                        <div>
                          <span className="block font-display">{ds.filename}</span>
                          <span className="text-[10px] text-slate-500 font-mono">{ds.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-200">{formatNumber(ds.total_rows)}</td>
                    <td className="py-3.5 px-4 text-slate-200">{ds.total_columns}</td>
                    <td className="py-3.5 px-4 text-slate-200">{ds.missing_values || 0}</td>
                    <td className="py-3.5 px-4 text-slate-200">{ds.duplicates || 0}</td>
                    <td className="py-3.5 px-4">
                      <Badge
                        variant={ds.status === 'PROCESSED' ? 'emerald' : 'yellow'}
                        size="xs"
                        dot
                      >
                        {ds.status || 'PROCESSED'}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {ds.created_at ? new Date(ds.created_at).toLocaleDateString() : 'Recent'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

