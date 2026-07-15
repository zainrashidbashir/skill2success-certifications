"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function IssueForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ students: [], courses: [], instructors: [] });
  
  const [formData, setFormData] = useState({
    studentId: "",
    courseName: "",
    instructorName: "",
    issueDate: new Date().toISOString().split("T")[0],
    completionDate: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    // Fetch data to populate dropdowns/datalists
    async function fetchData() {
      const res = await fetch("/api/admin/data");
      const json = await res.json();
      setData(json);
      if (json.students.length > 0) setFormData(f => ({ ...f, studentId: json.students[0].id }));
    }
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch("/api/certificate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      if (res.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        alert("Failed to issue certificate");
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Issue Certificate</h1>
            <p className="text-gray-500">Create a new cryptographically verifiable credential.</p>
          </div>
          <Button variant="outline" onClick={() => router.push("/admin")}>Back</Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Certificate Details</CardTitle>
            <CardDescription>Select a student and enter the course and instructor details.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div>
                <label className="block text-sm font-medium mb-2">Student</label>
                <select 
                  className="w-full border rounded-md p-2 dark:bg-gray-900"
                  value={formData.studentId}
                  onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                  required
                >
                  {data.students.map((s: any) => <option key={s.id} value={s.id}>{s.name} ({s.email})</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Course Name</label>
                <input 
                  type="text"
                  list="course-list"
                  className="w-full border rounded-md p-2 dark:bg-gray-900"
                  value={formData.courseName}
                  onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
                  placeholder="e.g. Full Stack Web Development"
                  required
                />
                <datalist id="course-list">
                  {data.courses.map((c: any) => <option key={c.id} value={c.name} />)}
                </datalist>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Instructor Name</label>
                <input 
                  type="text"
                  list="instructor-list"
                  className="w-full border rounded-md p-2 dark:bg-gray-900"
                  value={formData.instructorName}
                  onChange={(e) => setFormData({ ...formData, instructorName: e.target.value })}
                  placeholder="e.g. John Doe"
                  required
                />
                <datalist id="instructor-list">
                  {data.instructors.map((i: any) => <option key={i.id} value={i.name} />)}
                </datalist>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Completion Date</label>
                  <input 
                    type="date" 
                    className="w-full border rounded-md p-2 dark:bg-gray-900" 
                    value={formData.completionDate}
                    onChange={(e) => setFormData({ ...formData, completionDate: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Issue Date</label>
                  <input 
                    type="date" 
                    className="w-full border rounded-md p-2 dark:bg-gray-900" 
                    value={formData.issueDate}
                    onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={loading}>
                {loading ? "Generating Hash & Issuing..." : "Issue Secure Certificate"}
              </Button>

            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
