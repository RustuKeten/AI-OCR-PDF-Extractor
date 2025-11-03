/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCallback, useState } from "react";
import { useDropzone, FileRejection } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Upload, FileText, X, CheckCircle2, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

interface PdfUploaderProps {
  onFileSelect?: (file: File) => void;
  isUploading?: boolean;
  maxSize?: number; // in MB
}

export default function PdfUploader({
  onFileSelect,
  isUploading = false,
  maxSize = 10,
}: PdfUploaderProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = useCallback(
    async (file: File) => {
      setSelectedFile(file);
      setLoading(true);
      setResult(null);

      // Call onFileSelect callback if provided (this will handle upload and processing)
      if (onFileSelect) {
        // Just pass the file to the parent component, which will handle upload
        onFileSelect(file);
        setLoading(false);
        return;
      }

      // If no onFileSelect callback, use direct extraction (for standalone use)
      try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/extract", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to parse PDF");
        }

        setResult(data);
        toast.success("PDF processed successfully!");
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "An error occurred";
        setResult({
          error: errorMessage,
        });
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [onFileSelect]
  );

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      // Handle rejected files
      if (rejectedFiles.length > 0) {
        const rejection = rejectedFiles[0];
        if (rejection.errors[0]?.code === "file-too-large") {
          toast.error(`File is too large. Maximum size is ${maxSize}MB`);
        } else if (rejection.errors[0]?.code === "file-invalid-type") {
          toast.error("Please upload a PDF file");
        } else {
          toast.error("File upload failed");
        }
        return;
      }

      // Handle accepted files
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        handleFileUpload(file);
      }
    },
    [maxSize, handleFileUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    maxSize: maxSize * 1024 * 1024, // Convert MB to bytes
    multiple: false,
    disabled: isUploading || loading,
  });

  const removeFile = () => {
    setSelectedFile(null);
    setResult(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="space-y-6">
      <Card className="w-full bg-gray-800 border-gray-600 shadow-lg">
        <CardContent className="p-6">
          {!selectedFile ? (
            <div
              {...getRootProps()}
              className={`
                border-2 border-dashed rounded-lg p-4 sm:p-6 md:p-8 text-center cursor-pointer transition-colors
                ${
                  isDragActive
                    ? "border-blue-400 bg-blue-900/20"
                    : "border-gray-500 hover:border-blue-400 hover:bg-blue-900/10"
                }
                ${
                  isUploading || loading ? "pointer-events-none opacity-50" : ""
                }
              `}
            >
              <input {...getInputProps()} />
              <div className="mx-auto w-10 h-10 sm:w-12 sm:h-12 bg-blue-900/30 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                <Upload className="h-5 w-5 sm:h-6 sm:w-6 text-blue-400" />
              </div>
              <p className="text-base sm:text-lg font-semibold text-white mb-2">
                {isDragActive ? "Drop the PDF here" : "Upload a PDF file"}
              </p>
              <p className="text-xs sm:text-sm text-gray-300 mb-3 sm:mb-4">
                Drag and drop or click to select
              </p>
              {/* Upload Guidelines */}
              <div className="text-xs text-gray-400 bg-gray-700 rounded-md px-2 sm:px-3 py-1.5 sm:py-2 inline-block text-left">
                Maximum file size: {maxSize}MB
                <br />
                Supported format: PDF only
                <br />
                Text-based PDFs work best
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between p-3 sm:p-4 bg-green-900/20 border border-green-600 rounded-lg gap-2">
              <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-green-400 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-green-300 text-sm sm:text-base truncate">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs sm:text-sm text-green-400">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={removeFile}
                disabled={isUploading || loading}
                className="text-green-400 hover:text-green-300 hover:bg-green-900/30 flex-shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          {(isUploading || loading) && (
            <div className="mt-4 flex items-center justify-center space-x-2 p-4 bg-blue-900/20 border border-blue-600 rounded-lg">
              <LoadingSpinner size="sm" />
              <span className="text-sm font-medium text-blue-300">
                Processing PDF...
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Result Display */}
      {result && (
        <Card className="w-full bg-gray-800 border-gray-600 shadow-lg">
          <CardContent className="p-6">
            {result.error ? (
              <div className="flex items-start space-x-3 p-4 bg-red-900/20 border border-red-600 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-red-300 mb-1">Error</p>
                  <p className="text-sm text-red-400">{result.error}</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-start space-x-3 p-4 bg-green-900/20 border border-green-600 rounded-lg">
                  <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold text-green-300 mb-1">
                      File processed successfully!
                    </p>
                    {result.file?.id && (
                      <p className="text-xs sm:text-sm text-green-400">
                        File ID: {result.file.id}
                      </p>
                    )}
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm font-semibold text-white mb-2">
                    Extracted Data:
                  </p>
                  <pre className="bg-gray-900 border border-gray-700 text-gray-300 p-4 rounded-lg text-xs sm:text-sm overflow-auto max-h-[600px]">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

