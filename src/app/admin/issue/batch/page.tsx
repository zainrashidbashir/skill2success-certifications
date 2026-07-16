"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Link from "next/link";
import { Upload, FileSpreadsheet, Download, Loader2 } from "lucide-react";
import CertificatePreview from "@/components/CertificatePreview";

export default function BatchIssuePage() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [excelData, setExcelData] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0, stage: "" });
  const [currentCertToRender, setCurrentCertToRender] = useState<any>(null);

  useEffect(() => {
    fetch("/api/admin/templates")
      .then(r => r.json())
      .then(data => setTemplates(data));
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const bstr = event.target?.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws);
      setExcelData(data);
    };
    reader.readAsBinaryString(file);
  };

  const processBatch = async () => {
    if (!selectedTemplateId) return toast.error("Please select a template");
    if (excelData.length === 0) return toast.error("Please upload an Excel file with data");

    setIsProcessing(true);
    setProgress({ current: 0, total: excelData.length, stage: "Registering in database..." });

    try {
      // 1. Send data to backend to issue certificates
      const res = await fetch("/api/admin/issue/batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          records: excelData,
          templateId: selectedTemplateId
        })
      });

      if (!res.ok) throw new Error("Failed to process batch on server");
      const { certificates } = await res.json();
      const selectedTemplate = templates.find(t => t.id === selectedTemplateId);

      // 2. Generate PDFs and ZIP them
      setProgress({ current: 0, total: certificates.length, stage: "Generating PDFs..." });
      const zip = new JSZip();

      for (let i = 0; i < certificates.length; i++) {
        const cert = certificates[i];
        setProgress({ current: i + 1, total: certificates.length, stage: "Generating PDFs..." });
        
        // Mount the certificate via React state
        setCurrentCertToRender({ ...cert, template: selectedTemplate });
        
        // Wait for React to render and DOM to paint
        await new Promise(r => setTimeout(r, 150));

        const element = document.getElementById(`batch-cert-render`);
        if (element) {
          const canvas = await html2canvas(element, { scale: 2, useCORS: true });
          const imgData = canvas.toDataURL("image/jpeg", 0.9);
          const pdf = new jsPDF("landscape", "px", [1122, 794]);
          pdf.addImage(imgData, "JPEG", 0, 0, 1122, 794);
          
          const pdfBlob = pdf.output("blob");
          zip.file(`${cert.student.name}_${cert.course.name}.pdf`.replace(/\s+/g, "_"), pdfBlob);
        }
      }

      setProgress({ current: certificates.length, total: certificates.length, stage: "Zipping files..." });
      
      const zipContent = await zip.generateAsync({ type: "blob" });
      saveAs(zipContent, `Certificates_Batch_${new Date().getTime()}.zip`);
      
      toast.success("Batch processing complete!");

    } catch (err: any) {
      toast.error(err.message || "An error occurred during batch processing");
    } finally {
      setIsProcessing(false);
      setProgress({ current: 0, total: 0, stage: "" });
      setCurrentCertToRender(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Batch Issue (Excel)</h1>
            <p className="text-gray-500">Upload an Excel file to generate certificates in bulk.</p>
          </div>
          <Link href="/admin">
            <Button variant="outline">Back</Button>
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 space-y-6">
          
          <div>
            <Label>1. Select Certificate Template</Label>
            <select 
              className="w-full mt-2 p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
              value={selectedTemplateId}
              onChange={(e) => setSelectedTemplateId(e.target.value)}
            >
              <option value="">-- Choose a template --</option>
              {templates.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

          <div>
            <Label>2. Upload Excel Data</Label>
            <p className="text-sm text-gray-500 mb-2">Required Columns: StudentName, Email, CourseName, InstructorName, IssueDate</p>
            <Label htmlFor="excel-upload" className="cursor-pointer flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <FileSpreadsheet className="w-10 h-10 text-green-500 mb-2" />
              <span className="font-medium">Click to upload .xlsx or .csv</span>
              {excelData.length > 0 && <span className="text-sm text-green-600 mt-2 font-bold">{excelData.length} records loaded</span>}
            </Label>
            <input id="excel-upload" type="file" accept=".xlsx, .csv" className="hidden" onChange={handleFileUpload} />
          </div>

          {/* Live Preview of first record */}
          {excelData.length > 0 && selectedTemplateId && (
            <div className="mt-8 border-t pt-8 flex flex-col items-center">
              <h3 className="text-lg font-semibold mb-4 w-full">Live Preview (First Record)</h3>
              <CertificatePreview certData={{
                studentName: excelData[0].StudentName || "[Student Name]",
                courseName: excelData[0].CourseName || "[Course Name]",
                instructorName: excelData[0].InstructorName || "[Instructor Name]",
                issueDate: excelData[0].IssueDate || new Date().toISOString(),
                credentialId: "PREVIEW-BATCH",
                verifyUrl: "https://credentials.skill2success.com/verify/PREVIEW-BATCH",
                template: templates.find(t => t.id === selectedTemplateId)
              }} />
            </div>
          )}

          <Button 
            className="w-full bg-blue-600 hover:bg-blue-700" 
            onClick={processBatch}
            disabled={isProcessing || !selectedTemplateId || excelData.length === 0}
          >
            {isProcessing ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {progress.stage} ({progress.current}/{progress.total})</>
            ) : (
              <><Download className="mr-2 h-4 w-4" /> Issue Certificates & Download ZIP</>
            )}
          </Button>

        </div>

        {/* Hidden container for PDF rendering */}
        <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
          <div id="batch-cert-render">
            {currentCertToRender && (
              <CertificatePreview certData={{
                studentName: currentCertToRender.student.name,
                courseName: currentCertToRender.course.name,
                instructorName: currentCertToRender.instructor.name,
                issueDate: currentCertToRender.issueDate,
                credentialId: currentCertToRender.credentialId,
                verifyUrl: `https://credentials.skill2success.com/verify/${currentCertToRender.credentialId}`,
                template: currentCertToRender.template
              }} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
