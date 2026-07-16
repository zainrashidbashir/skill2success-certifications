"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Save, Upload, Trash2, Plus, GripHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";

export interface TemplateField {
  id: string;
  type: string; // studentName, courseName, issueDate, credentialId, instructorName, qrCode, customText
  x: number;
  y: number;
  fontSize: number;
  fontFamily: string;
  color: string;
  text: string; // For preview or custom text
}

export default function TemplateBuilder() {
  const [templateName, setTemplateName] = useState("");
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [fields, setFields] = useState<TemplateField[]>([]);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be smaller than 2MB to store efficiently.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setBackgroundImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const addField = (type: string, defaultText: string) => {
    const newField: TemplateField = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      x: 100,
      y: 100,
      fontSize: 24,
      fontFamily: "Arial",
      color: "#000000",
      text: defaultText,
    };
    setFields([...fields, newField]);
    setSelectedFieldId(newField.id);
  };

  const updateField = (id: string, updates: Partial<TemplateField>) => {
    setFields(fields.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const removeField = (id: string) => {
    setFields(fields.filter(f => f.id !== id));
    if (selectedFieldId === id) setSelectedFieldId(null);
  };

  const handleDragEnd = (id: string, e: any, info: any) => {
    // 1122px is the original width. The container is scaled by 0.7.
    // Framer motion uses screen coordinates for info.offset.
    const scale = 0.7;
    const dx = info.offset.x / scale;
    const dy = info.offset.y / scale;

    setFields(currentFields => 
      currentFields.map(f => {
        if (f.id !== id) return f;
        return {
          ...f,
          x: Math.max(0, f.x + dx),
          y: Math.max(0, f.y + dy),
        };
      })
    );
  };

  const saveTemplate = async () => {
    if (!templateName) return toast.error("Please enter a template name");
    if (!backgroundImage) return toast.error("Please upload a background image");
    
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: templateName,
          backgroundImage,
          layoutConfig: fields,
        })
      });

      if (!res.ok) throw new Error("Failed to save template");

      toast.success("Template saved successfully!");
      router.push("/admin"); // Or wherever you want to redirect
      router.refresh();
    } catch (err) {
      toast.error("An error occurred while saving the template.");
    } finally {
      setIsSaving(false);
    }
  };

  const selectedField = fields.find(f => f.id === selectedFieldId);

  return (
    <div className="flex flex-col md:flex-row gap-6 h-[80vh]">
      {/* Sidebar Controls */}
      <div className="w-full md:w-80 flex flex-col gap-4 bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800 overflow-y-auto">
        <div>
          <Label>Template Name</Label>
          <Input 
            value={templateName} 
            onChange={e => setTemplateName(e.target.value)} 
            placeholder="e.g. Summer Robotics 2026"
            className="mt-1"
          />
        </div>

        <div>
          <Label>Background Image (Max 2MB)</Label>
          <div className="mt-1">
            <Label htmlFor="bg-upload" className="cursor-pointer flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <Upload className="w-5 h-5 text-gray-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Upload Certificate Design</span>
            </Label>
            <input id="bg-upload" type="file" accept="image/png, image/jpeg" className="hidden" onChange={handleImageUpload} />
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <Label className="mb-2 block">Add Fields</Label>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" onClick={() => addField("studentName", "[Student Name]")}>Student Name</Button>
            <Button variant="outline" size="sm" onClick={() => addField("courseName", "[Course Name]")}>Course Name</Button>
            <Button variant="outline" size="sm" onClick={() => addField("issueDate", "[Issue Date]")}>Issue Date</Button>
            <Button variant="outline" size="sm" onClick={() => addField("credentialId", "[Credential ID]")}>Credential ID</Button>
            <Button variant="outline" size="sm" onClick={() => addField("qrCode", "[QR Code]")}>QR Code</Button>
            <Button variant="outline" size="sm" onClick={() => addField("customText", "Custom Text")}>Custom Text</Button>
          </div>
        </div>

        {selectedField && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <Label>Edit Selected Field</Label>
              <Button variant="ghost" size="icon" className="text-red-500 h-6 w-6" onClick={() => removeField(selectedField.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            
            {selectedField.type === "customText" && (
              <div>
                <Label className="text-xs text-gray-500">Text</Label>
                <Input value={selectedField.text} onChange={e => updateField(selectedField.id, { text: e.target.value })} className="h-8" />
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs text-gray-500">Font Size (px)</Label>
                <Input type="number" value={selectedField.fontSize} onChange={e => updateField(selectedField.id, { fontSize: Number(e.target.value) })} className="h-8" />
              </div>
              <div>
                <Label className="text-xs text-gray-500">Color</Label>
                <Input type="color" value={selectedField.color} onChange={e => updateField(selectedField.id, { color: e.target.value })} className="h-8 px-1 py-0 cursor-pointer" />
              </div>
            </div>

            <div>
              <Label className="text-xs text-gray-500">Font Family</Label>
              <select 
                className="w-full h-8 text-sm border rounded-md px-2 bg-transparent border-gray-300 dark:border-gray-700"
                value={selectedField.fontFamily}
                onChange={e => updateField(selectedField.id, { fontFamily: e.target.value })}
              >
                <option value="Arial">Arial</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Georgia">Georgia</option>
                <option value="'Playfair Display', serif">Playfair Display</option>
                <option value="'Inter', sans-serif">Inter</option>
                <option value="'Dancing Script', cursive">Dancing Script (Cursive)</option>
              </select>
            </div>
          </div>
        )}

        <div className="mt-auto pt-4">
          <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={saveTemplate} disabled={isSaving}>
            {isSaving ? "Saving..." : <><Save className="w-4 h-4 mr-2" /> Save Template</>}
          </Button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden relative">
        {!backgroundImage ? (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 flex-col gap-2">
            <Upload className="w-12 h-12 opacity-20" />
            <p>Upload a background image to start building</p>
          </div>
        ) : (
          <div className="w-full h-full overflow-auto p-4 flex justify-center bg-gray-200">
            {/* Wrapper to reserve space for scaled container */}
            <div style={{ width: 1122 * 0.7, height: 794 * 0.7, position: "relative" }}>
              {/* The actual certificate container */}
              <div 
                ref={containerRef}
                className="absolute top-0 left-0 shadow-2xl bg-white select-none"
                style={{
                  width: "1122px", // A4 Landscape roughly at 96 DPI
                  height: "794px",
                  backgroundImage: `url(${backgroundImage})`,
                  backgroundSize: "100% 100%", // Fit image exactly into container
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  transformOrigin: "top left",
                  transform: "scale(0.7)", // scale down for preview
                }}
              >
              {fields.map(field => (
                <motion.div
                  key={field.id}
                  drag
                  dragMomentum={false}
                  onDragEnd={(e, info) => handleDragEnd(field.id, e, info)}
                  onClick={() => setSelectedFieldId(field.id)}
                  whileHover={{ outline: "2px dashed #3b82f6" }}
                  style={{
                    position: "absolute",
                    left: field.x,
                    top: field.y,
                    fontSize: `${field.fontSize}px`,
                    fontFamily: field.fontFamily,
                    color: field.color,
                    cursor: "move",
                    padding: "4px",
                    border: selectedFieldId === field.id ? "2px solid #3b82f6" : "2px solid transparent",
                    zIndex: selectedFieldId === field.id ? 10 : 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minWidth: "max-content",
                  }}
                >
                  {field.type === "qrCode" ? (
                    <div className="w-24 h-24 bg-gray-200 border-2 border-gray-400 flex items-center justify-center flex-col gap-1 text-gray-500 text-xs">
                      <GripHorizontal className="w-6 h-6" />
                      QR Code
                    </div>
                  ) : (
                    field.text
                  )}
                </motion.div>
              ))}
            </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
