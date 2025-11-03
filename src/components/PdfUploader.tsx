"use client";

import { useState } from "react";
import { ResumeData } from "@/types/resume";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Upload, FileText } from "lucide-react";
import toast from "react-hot-toast";

type ApiResult = ResumeData | { error: string };

export default function PdfUploader() {
  const [result, setResult] = useState<ApiResult | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) return;

    setLoading(true);
    setResult(null);

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
      toast.success("PDF extracted successfully!");
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
  }

  return (
    <div className="w-full space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="relative">
              <input
                type="file"
                accept="application/pdf"
                onChange={handleUpload}
                disabled={loading}
                className="hidden"
                id="pdf-upload"
              />
              <Button
                onClick={() => document.getElementById("pdf-upload")?.click()}
                size="lg"
                className="cursor-pointer"
                disabled={loading}
                type="button"
              >
                {loading ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload PDF Resume
                  </>
                )}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Select a PDF file to extract resume data
            </p>
          </div>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardContent className="pt-6">
            {"error" in result ? (
              <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-md">
                <strong>Error:</strong> {result.error}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Extracted Data</h3>
                </div>
                <pre className="bg-muted p-4 rounded-md text-sm overflow-auto max-h-[600px] border border-border">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
