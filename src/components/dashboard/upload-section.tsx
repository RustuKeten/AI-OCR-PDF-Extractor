"use client";

import { Card } from "@/components/ui/card";
import PdfUploader from "@/components/ui/pdf-uploader";

interface UploadSectionProps {
  onFileSelect: (file: File) => void;
  isUploading: boolean;
}

export function UploadSection({
  onFileSelect,
  isUploading,
}: UploadSectionProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-xl sm:text-2xl font-bold text-card-foreground mb-2">
          PDF File Upload
        </h2>
        <p className="text-sm sm:text-base text-card-foreground">
          Upload your resume or CV to extract structured data
        </p>
      </div>

      {/* Upload Card */}
      <Card className="bg-gray-900 border-gray-700 shadow-lg">
        <PdfUploader
          onFileSelect={onFileSelect}
          isUploading={isUploading}
          maxSize={10}
        />
      </Card>
    </div>
  );
}

