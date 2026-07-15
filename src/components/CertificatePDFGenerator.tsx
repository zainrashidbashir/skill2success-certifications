"use client";

import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CertificateProps {
  studentName: string;
  courseName: string;
  instructorName: string;
  issueDate: string;
  credentialId: string;
  verifyUrl: string;
}

export default function CertificatePDFGenerator({ certData }: { certData: CertificateProps }) {
  const certificateRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);

  const downloadPDF = async () => {
    if (!certificateRef.current) return;
    setLoading(true);
    
    try {
      // Temporarily make it visible for html2canvas
      certificateRef.current.style.display = "block";
      
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2, // High resolution
        useCORS: true,
        logging: false
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4" // 297mm x 210mm
      });

      pdf.addImage(imgData, "PNG", 0, 0, 297, 210);
      pdf.save(`Skill2Success_Certificate_${certData.credentialId}.pdf`);

      // Hide it again
      certificateRef.current.style.display = "none";
    } catch (err) {
      console.error("Failed to generate PDF", err);
    }
    setLoading(false);
  };

  return (
    <>
      <Button variant="outline" onClick={downloadPDF} disabled={loading}>
        <Download className="mr-2 h-4 w-4" /> 
        {loading ? "Generating PDF..." : "Download PDF"}
      </Button>

      {/* Hidden Certificate HTML Template to be rendered into PDF */}
      <div 
        ref={certificateRef} 
        style={{
          display: "none", // Hidden by default, only shown during PDF capture
          width: "1122px", // A4 Landscape pixels at 96 DPI
          height: "793px", 
          backgroundColor: "#ffffff",
          padding: "20px",
          position: "absolute",
          top: "-9999px",
          left: "-9999px"
        }}
      >
        {/* Outer Navy Border */}
        <div style={{
          border: "20px solid #0a192f",
          height: "100%",
          boxSizing: "border-box",
          padding: "10px",
          backgroundColor: "#fff"
        }}>
          {/* Inner Gold Border */}
          <div style={{
            border: "4px solid #d4af37",
            height: "100%",
            boxSizing: "border-box",
            padding: "50px",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            fontFamily: "'Times New Roman', Times, serif"
          }}>
            
            {/* Corner Accents */}
            <div style={{ position: "absolute", top: "-4px", left: "-4px", width: "30px", height: "30px", borderTop: "8px solid #0a192f", borderLeft: "8px solid #0a192f" }}></div>
            <div style={{ position: "absolute", top: "-4px", right: "-4px", width: "30px", height: "30px", borderTop: "8px solid #0a192f", borderRight: "8px solid #0a192f" }}></div>
            <div style={{ position: "absolute", bottom: "-4px", left: "-4px", width: "30px", height: "30px", borderBottom: "8px solid #0a192f", borderLeft: "8px solid #0a192f" }}></div>
            <div style={{ position: "absolute", bottom: "-4px", right: "-4px", width: "30px", height: "30px", borderBottom: "8px solid #0a192f", borderRight: "8px solid #0a192f" }}></div>

            {/* Header / Logo Area */}
            <div style={{ display: "flex", justifyContent: "center", width: "100%", marginBottom: "20px" }}>
              <div style={{ textAlign: "center" }}>
                <h1 style={{ color: "#0a192f", fontSize: "36px", margin: "0", letterSpacing: "4px", textTransform: "uppercase" }}>
                  Skill2Success
                </h1>
                <div style={{ width: "100px", height: "2px", backgroundColor: "#d4af37", margin: "10px auto" }}></div>
              </div>
            </div>

            {/* Main Title */}
            <h1 style={{ 
              fontSize: "64px", 
              color: "#0a192f", 
              letterSpacing: "8px", 
              margin: "20px 0 10px 0",
              fontWeight: "normal" 
            }}>
              CERTIFICATE
            </h1>
            <p style={{ letterSpacing: "6px", color: "#d4af37", fontSize: "16px", textTransform: "uppercase", marginBottom: "40px" }}>
              Of Completion
            </p>

            {/* Recipient Area */}
            <p style={{ fontSize: "20px", color: "#374151", fontStyle: "italic", marginBottom: "20px" }}>This certificate is proudly presented to</p>
            
            <h2 style={{ 
              fontSize: "52px", 
              color: "#0a192f", 
              margin: "0", 
              fontFamily: "'Brush Script MT', 'Lucida Handwriting', cursive",
              borderBottom: "1px solid #d4af37", 
              display: "inline-block", 
              paddingBottom: "5px",
              paddingInline: "40px"
            }}>
              {certData.studentName}
            </h2>

            <p style={{ fontSize: "18px", color: "#374151", fontStyle: "italic", marginTop: "30px", marginBottom: "20px", maxWidth: "800px", textAlign: "center", lineHeight: "1.5" }}>
              for successfully completing the rigorous requirements and demonstrating exceptional proficiency in
            </p>
            
            <h3 style={{ fontSize: "32px", color: "#0a192f", margin: "0", fontWeight: "bold" }}>
              {certData.courseName}
            </h3>

            {/* Bottom Section: Signatures & Seal */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", width: "100%", marginTop: "auto", paddingBottom: "20px" }}>
              
              {/* Date */}
              <div style={{ textAlign: "center", width: "250px" }}>
                <div style={{ borderBottom: "1px solid #0a192f", height: "40px", marginBottom: "10px", display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
                   <span style={{ fontSize: "22px", color: "#0a192f" }}>{new Date(certData.issueDate).toLocaleDateString()}</span>
                </div>
                <p style={{ margin: 0, color: "#0a192f", fontSize: "16px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "1px" }}>Date</p>
              </div>

              {/* Gold Seal */}
              <div style={{ position: "relative", width: "120px", height: "120px" }}>
                <div style={{ 
                  position: "absolute", top: "0", left: "0", width: "100%", height: "100%", 
                  background: "radial-gradient(ellipse at center, #f6e27a 0%, #cb9b51 100%)",
                  borderRadius: "50%",
                  border: "2px dashed #8a6d3b",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"
                }}>
                   <span style={{ color: "#fff", fontSize: "14px", fontWeight: "bold", letterSpacing: "1px", textShadow: "1px 1px 2px rgba(0,0,0,0.5)" }}>OFFICIAL</span>
                   <span style={{ color: "#fff", fontSize: "28px", margin: "2px 0", textShadow: "1px 1px 2px rgba(0,0,0,0.5)" }}>★</span>
                   <span style={{ color: "#fff", fontSize: "12px", fontWeight: "bold", letterSpacing: "1px", textShadow: "1px 1px 2px rgba(0,0,0,0.5)" }}>SEAL</span>
                </div>
              </div>

              {/* Signature */}
              <div style={{ textAlign: "center", width: "250px" }}>
                <div style={{ borderBottom: "1px solid #0a192f", height: "40px", marginBottom: "10px", display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
                   {/* Fake Cursive Signature */}
                   <span style={{ fontFamily: "'Brush Script MT', 'Lucida Handwriting', cursive", fontSize: "36px", color: "#0a192f", transform: "rotate(-5deg)", display: "inline-block" }}>
                     {certData.instructorName}
                   </span>
                </div>
                <p style={{ margin: 0, color: "#0a192f", fontSize: "16px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "1px" }}>{certData.instructorName}</p>
                <p style={{ margin: 0, color: "#6b7280", fontSize: "12px" }}>Lead Instructor</p>
              </div>

            </div>
            
            {/* Validation Link bottom absolute */}
            <div style={{ position: "absolute", bottom: "10px", width: "100%", textAlign: "center" }}>
              <p style={{ margin: 0, fontSize: "11px", color: "#9ca3af", fontFamily: "sans-serif" }}>
                Credential ID: {certData.credentialId} | Verify Authenticity: {certData.verifyUrl}
              </p>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
