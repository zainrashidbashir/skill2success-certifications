import React from "react";

export default function CertificatePreview({ certData }: { certData: any }) {
  const hasTemplate = !!certData.template;
  let layoutConfig: any[] = [];
  if (hasTemplate && certData.template?.layoutConfig) {
    try { layoutConfig = JSON.parse(certData.template.layoutConfig); } catch (e) {}
  }

  // We scale it down to fit in normal layouts. 
  // 1122x794 is the original size. We will use CSS transform to scale it.
  const scale = 0.5; 
  const scaledWidth = 1122 * scale;
  const scaledHeight = 794 * scale;

  return (
    <div style={{ width: scaledWidth, height: scaledHeight, position: "relative" }} className="mx-auto my-6 overflow-hidden rounded-lg border shadow-sm bg-gray-200">
      <div 
        style={{
          width: "1122px", 
          height: "794px", 
          backgroundColor: "#ffffff",
          position: "absolute",
          top: 0,
          left: 0,
          transformOrigin: "top left",
          transform: `scale(${scale})`,
          ...(hasTemplate ? {
            backgroundImage: `url('${certData.template?.backgroundImage}')`,
            backgroundSize: "100% 100%",
            backgroundPosition: "center",
          } : {})
        }}
      >
        {hasTemplate ? (
          /* Dynamic Template Rendering */
          <div style={{ position: "relative", width: "100%", height: "100%", fontFamily: "sans-serif" }}>
            {layoutConfig.map((field: any, i: number) => {
              let text = field.text;
              if (field.type === "studentName") text = certData.studentName;
              if (field.type === "courseName") text = certData.courseName;
              if (field.type === "instructorName") text = certData.instructorName;
              if (field.type === "issueDate") text = new Date(certData.issueDate).toLocaleDateString();
              if (field.type === "credentialId") text = certData.credentialId;
              
              if (field.type === "qrCode") {
                return (
                  <div key={i} style={{ position: "absolute", left: field.x, top: field.y, width: 100, height: 100, background: "white", border: "1px solid #ccc", padding: 4 }}>
                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyItems: "center", justifyContent: "center", border: "1px solid #000" }}>
                      QR
                    </div>
                  </div>
                );
              }
              
              return (
                <div key={i} style={{ position: "absolute", left: field.x, top: field.y, fontSize: field.fontSize, fontFamily: field.fontFamily, color: field.color, whiteSpace: "nowrap" }}>
                  {text}
                </div>
              );
            })}
          </div>
        ) : (
          /* Legacy Hardcoded Design */
          <div style={{ border: "20px solid #0a192f", height: "100%", boxSizing: "border-box", padding: "10px", backgroundColor: "#fff" }}>
            <div style={{ border: "4px solid #d4af37", height: "100%", boxSizing: "border-box", padding: "50px", position: "relative", display: "flex", flexDirection: "column", alignItems: "center", fontFamily: "'Times New Roman', Times, serif" }}>
              
              <div style={{ position: "absolute", top: "-4px", left: "-4px", width: "30px", height: "30px", borderTop: "8px solid #0a192f", borderLeft: "8px solid #0a192f" }}></div>
              <div style={{ position: "absolute", top: "-4px", right: "-4px", width: "30px", height: "30px", borderTop: "8px solid #0a192f", borderRight: "8px solid #0a192f" }}></div>
              <div style={{ position: "absolute", bottom: "-4px", left: "-4px", width: "30px", height: "30px", borderBottom: "8px solid #0a192f", borderLeft: "8px solid #0a192f" }}></div>
              <div style={{ position: "absolute", bottom: "-4px", right: "-4px", width: "30px", height: "30px", borderBottom: "8px solid #0a192f", borderRight: "8px solid #0a192f" }}></div>
  
              <div style={{ display: "flex", justifyContent: "center", width: "100%", marginBottom: "20px" }}>
                <div style={{ textAlign: "center" }}>
                  <h1 style={{ color: "#0a192f", fontSize: "36px", margin: "0", letterSpacing: "4px", textTransform: "uppercase" }}>Skill2Success</h1>
                  <div style={{ width: "100px", height: "2px", backgroundColor: "#d4af37", margin: "10px auto" }}></div>
                </div>
              </div>
  
              <h1 style={{ fontSize: "64px", color: "#0a192f", letterSpacing: "8px", margin: "20px 0 10px 0", fontWeight: "normal" }}>CERTIFICATE</h1>
              <p style={{ letterSpacing: "6px", color: "#d4af37", fontSize: "16px", textTransform: "uppercase", marginBottom: "40px" }}>Of Completion</p>
  
              <p style={{ fontSize: "20px", color: "#374151", fontStyle: "italic", marginBottom: "20px" }}>This certificate is proudly presented to</p>
              
              <h2 style={{ fontSize: "52px", color: "#0a192f", margin: "0", fontFamily: "'Brush Script MT', 'Lucida Handwriting', cursive", borderBottom: "1px solid #d4af37", display: "inline-block", paddingBottom: "5px", paddingInline: "40px" }}>
                {certData.studentName}
              </h2>
  
              <p style={{ fontSize: "18px", color: "#374151", fontStyle: "italic", marginTop: "30px", marginBottom: "20px", maxWidth: "800px", textAlign: "center", lineHeight: "1.5" }}>
                for successfully completing the rigorous requirements and demonstrating exceptional proficiency in
              </p>
              
              <h3 style={{ fontSize: "32px", color: "#0a192f", margin: "0", fontWeight: "bold" }}>
                {certData.courseName}
              </h3>
  
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", width: "100%", marginTop: "auto", paddingBottom: "20px" }}>
                
                <div style={{ textAlign: "center", width: "250px" }}>
                  <div style={{ borderBottom: "1px solid #0a192f", height: "40px", marginBottom: "10px", display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
                     <span style={{ fontSize: "22px", color: "#0a192f" }}>{new Date(certData.issueDate).toLocaleDateString()}</span>
                  </div>
                  <p style={{ margin: 0, color: "#0a192f", fontSize: "16px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "1px" }}>Date</p>
                </div>
  
                <div style={{ position: "relative", width: "120px", height: "120px" }}>
                  <div style={{ position: "absolute", top: "0", left: "0", width: "100%", height: "100%", background: "radial-gradient(ellipse at center, #f6e27a 0%, #cb9b51 100%)", borderRadius: "50%", border: "2px dashed #8a6d3b", boxShadow: "0 4px 8px rgba(0,0,0,0.2)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                     <span style={{ color: "#fff", fontSize: "14px", fontWeight: "bold", letterSpacing: "1px", textShadow: "1px 1px 2px rgba(0,0,0,0.5)" }}>OFFICIAL</span>
                     <span style={{ color: "#fff", fontSize: "28px", margin: "2px 0", textShadow: "1px 1px 2px rgba(0,0,0,0.5)" }}>★</span>
                     <span style={{ color: "#fff", fontSize: "12px", fontWeight: "bold", letterSpacing: "1px", textShadow: "1px 1px 2px rgba(0,0,0,0.5)" }}>SEAL</span>
                  </div>
                </div>
  
                <div style={{ textAlign: "center", width: "250px" }}>
                  <div style={{ borderBottom: "1px solid #0a192f", height: "40px", marginBottom: "10px", display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
                     <span style={{ fontFamily: "'Brush Script MT', 'Lucida Handwriting', cursive", fontSize: "36px", color: "#0a192f", transform: "rotate(-5deg)", display: "inline-block" }}>
                       {certData.instructorName}
                     </span>
                  </div>
                  <p style={{ margin: 0, color: "#0a192f", fontSize: "16px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "1px" }}>{certData.instructorName}</p>
                  <p style={{ margin: 0, color: "#6b7280", fontSize: "12px" }}>Lead Instructor</p>
                </div>
  
              </div>
              
              <div style={{ position: "absolute", bottom: "10px", width: "100%", textAlign: "center" }}>
                <p style={{ margin: 0, fontSize: "11px", color: "#9ca3af", fontFamily: "sans-serif" }}>
                  Credential ID: {certData.credentialId} | Verify Authenticity: {certData.verifyUrl}
                </p>
              </div>
  
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
