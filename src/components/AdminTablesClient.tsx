"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminTablesClient({ initialCertificates, initialStudents }: { initialCertificates: any[], initialStudents: any[] }) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const deleteCertificate = async (id: string) => {
    if (!confirm("Are you sure you want to delete this certificate?")) return;
    setLoadingId(id);
    try {
      const res = await fetch(`/api/admin/certificate/${id}`, { method: "DELETE" });
      if (res.ok) {
        router.refresh();
      } else {
        alert("Failed to delete certificate.");
      }
    } catch (e) {
      console.error(e);
    }
    setLoadingId(null);
  };

  const deleteStudent = async (id: string) => {
    if (!confirm("Are you sure you want to delete this student and ALL of their certificates?")) return;
    setLoadingId(id);
    try {
      const res = await fetch(`/api/admin/student/${id}`, { method: "DELETE" });
      if (res.ok) {
        router.refresh();
      } else {
        alert("Failed to delete student.");
      }
    } catch (e) {
      console.error(e);
    }
    setLoadingId(null);
  };

  return (
    <div className="space-y-8">
      {/* Certificates Table */}
      <Card>
        <CardHeader>
          <CardTitle>Issued Certificates</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Credential ID</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Date Issued</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {initialCertificates.map((cert) => (
                <TableRow key={cert.id}>
                  <TableCell className="font-mono">{cert.credentialId}</TableCell>
                  <TableCell className="font-medium">{cert.student.name}</TableCell>
                  <TableCell>{cert.course.name}</TableCell>
                  <TableCell>{new Date(cert.issueDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                      {cert.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Link href={`/verify/${cert.credentialId}`} target="_blank">
                      <Button variant="outline" size="sm">Verify</Button>
                    </Link>
                    <Button 
                      variant="destructive" 
                      size="icon"
                      onClick={() => deleteCertificate(cert.id)}
                      disabled={loadingId === cert.id}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {initialCertificates.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    No certificates issued yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <CardTitle>Enrolled Students</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {initialStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{new Date(student.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="destructive" 
                      size="icon"
                      onClick={() => deleteStudent(student.id)}
                      disabled={loadingId === student.id}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {initialStudents.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                    No students registered yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
