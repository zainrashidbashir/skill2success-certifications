import { PrismaClient } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Share2 } from "lucide-react";
import Link from "next/link";
import CertificatePDFGenerator from "@/components/CertificatePDFGenerator";
import CertificatePreview from "@/components/CertificatePreview";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

const prisma = new PrismaClient();

export default async function StudentDashboard() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || (session.user as any).role !== "STUDENT") {
    redirect("/login");
  }

  const student = await prisma.student.findUnique({
    where: { id: (session.user as any).id },
    include: {
      certificates: {
        include: { course: true, instructor: true, template: true }
      }
    }
  });

  if (!student) {
    return <div>No student found. Run the seeder.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="flex items-center space-x-4 mb-8">
          <div className="w-16 h-16 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-2xl font-bold">
            {student.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome back, {student.name}</h1>
            <p className="text-gray-500">View and manage your Skill2Success certificates.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {student.certificates.map((cert) => {
            
            // LinkedIn Sharing URL generation
            // Format: https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=...
            const verifyUrl = `https://credentials.skill2success.com/verify/${cert.credentialId}`;
            const linkedInShareUrl = `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent(cert.course.name)}&organizationId=1337&issueYear=${new Date(cert.issueDate).getFullYear()}&issueMonth=${new Date(cert.issueDate).getMonth() + 1}&certUrl=${encodeURIComponent(verifyUrl)}&certId=${cert.credentialId}`;

            return (
              <Card key={cert.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="md:flex">
                  <div className="md:w-1/3 bg-gray-100 dark:bg-gray-900 p-6 flex flex-col justify-center items-center border-r border-gray-200 dark:border-gray-800">
                    <ShieldCheckIcon className="w-16 h-16 text-green-600 mb-4" />
                    <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      {cert.status}
                    </span>
                  </div>
                  <div className="md:w-2/3 p-6 flex flex-col justify-between">
                    <div>
                      <p className="text-sm font-semibold text-green-600 mb-1">Credential ID: {cert.credentialId}</p>
                      <CardTitle className="text-2xl mb-2">{cert.course.name}</CardTitle>
                      <p className="text-sm text-gray-500 mb-6">
                        Issued on {new Date(cert.issueDate).toLocaleDateString()}
                      </p>

                      <div className="mb-6 flex justify-center">
                        <CertificatePreview certData={{
                          studentName: student.name,
                          courseName: cert.course.name,
                          instructorName: cert.instructor.name,
                          issueDate: cert.issueDate.toISOString(),
                          credentialId: cert.credentialId,
                          verifyUrl: verifyUrl,
                          template: cert.template
                        }} />
                      </div>
                    </div>
                    
                    <div className="mt-6 flex flex-wrap gap-3">
                      <Link href={`/verify/${cert.credentialId}`} target="_blank">
                        <Button variant="outline">
                          <Share2 className="mr-2 h-4 w-4" /> View Public Link
                        </Button>
                      </Link>
                      
                      {/* Coursera-style PDF Generator */}
                      <CertificatePDFGenerator 
                        certData={{
                          studentName: student.name,
                          courseName: cert.course.name,
                          instructorName: cert.instructor.name,
                          issueDate: cert.issueDate.toISOString(),
                          credentialId: cert.credentialId,
                          verifyUrl: verifyUrl,
                          template: cert.template
                        }}
                      />

                      <Link href={linkedInShareUrl} target="_blank">
                        <Button className="bg-[#0077b5] hover:bg-[#006396] text-white">
                          <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                          </svg>
                          Add to Profile
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  );
}

function ShieldCheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
