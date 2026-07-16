import { PrismaClient } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldCheck, UserCheck, PlusCircle } from "lucide-react";
import AdminTablesClient from "@/components/AdminTablesClient";

const prisma = new PrismaClient();

export default async function AdminDashboard() {
  const certificates = await prisma.certificate.findMany({
    include: { student: true, course: true },
    orderBy: { createdAt: 'desc' }
  });

  const students = await prisma.student.findMany({
    orderBy: { createdAt: 'desc' }
  });

  const studentsCount = students.length;
  const certsCount = certificates.length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
            <p className="text-gray-500">Manage students, courses, and certificates.</p>
          </div>
          <div className="space-x-4">
            <Link href="/admin/templates">
              <Button variant="outline">
                Manage Templates
              </Button>
            </Link>
            <Link href="/admin/issue/batch">
              <Button variant="outline" className="border-blue-500 text-blue-600 hover:bg-blue-50">
                Batch Issue (Excel)
              </Button>
            </Link>
            <Link href="/admin/issue">
              <Button className="bg-green-600 hover:bg-green-700">
                <PlusCircle className="mr-2 h-4 w-4" /> Issue Certificate
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Certificates</CardTitle>
              <ShieldCheck className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{certsCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Enrolled Students</CardTitle>
              <UserCheck className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{studentsCount}</div>
            </CardContent>
          </Card>
        </div>

        {/* Interactive Data Tables */}
        <AdminTablesClient 
          initialCertificates={certificates} 
          initialStudents={students} 
        />
      </div>
    </div>
  );
}
