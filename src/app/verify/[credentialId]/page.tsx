import { PrismaClient } from "@prisma/client";
import { HashService, CertificateDataPayload } from "@/services/HashService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle, ShieldCheck } from "lucide-react";
import React from "react";
import CertificatePDFGenerator from "@/components/CertificatePDFGenerator";
import CertificatePreview from "@/components/CertificatePreview";

const prisma = new PrismaClient();

export default async function VerifyPage({ params }: { params: Promise<{ credentialId: string }> }) {
  const resolvedParams = await params;
  
  // 1. Fetch certificate from DB
  const certificate = await prisma.certificate.findUnique({
    where: { credentialId: resolvedParams.credentialId },
    include: { student: true, course: true, instructor: true, template: true }
  });

  if (!certificate) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Card className="w-[500px] border-red-500 shadow-xl">
          <CardHeader className="text-center">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <CardTitle className="text-3xl font-bold text-red-600">Invalid Credential</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-gray-600 dark:text-gray-300">
            We could not find a certificate matching the ID: <strong>{resolvedParams.credentialId}</strong>.
          </CardContent>
        </Card>
      </div>
    );
  }

  // 2. Perform Cryptographic Verification (Tamper Detection)
  const payload: CertificateDataPayload = {
    credentialId: certificate.credentialId,
    studentName: certificate.student.name,
    courseName: certificate.course.name,
    instructorName: certificate.instructor.name,
    issueDate: certificate.issueDate.toISOString(),
    completionDate: certificate.completionDate.toISOString()
  };

  const isAuthentic = HashService.verifyHash(payload, certificate.hash);
  const isValidStatus = certificate.status === "VALID";

  const isVerified = isAuthentic && isValidStatus;

  // Log the verification attempt
  await prisma.verificationLog.create({
    data: {
      certificateId: certificate.id,
      success: isVerified,
    }
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Status Card */}
        <Card className={`border-t-8 shadow-xl ${isVerified ? 'border-t-green-500' : 'border-t-red-500'}`}>
          <CardHeader className="text-center pb-2">
            {isVerified ? (
              <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-4" />
            ) : (
              <XCircle className="w-20 h-20 text-red-500 mx-auto mb-4" />
            )}
            <CardTitle className={`text-4xl font-extrabold ${isVerified ? 'text-green-600' : 'text-red-600'}`}>
              {isVerified ? "Certificate Verified" : "Verification Failed"}
            </CardTitle>
            <p className="text-gray-500 mt-2">
              Credential ID: <span className="font-mono font-bold text-gray-800 dark:text-gray-200">{certificate.credentialId}</span>
            </p>
          </CardHeader>
          <CardContent>
            {isAuthentic ? (
              <div className="flex items-center justify-center text-sm text-green-700 bg-green-50 p-3 rounded-md mb-6">
                <ShieldCheck className="w-5 h-5 mr-2" />
                Cryptographic signature is valid and authentic.
              </div>
            ) : (
              <div className="flex items-center justify-center text-sm text-red-700 bg-red-50 p-3 rounded-md mb-6">
                <XCircle className="w-5 h-5 mr-2" />
                Warning: Certificate data has been tampered with or signature is invalid.
              </div>
            )}

            <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-6 bg-white dark:bg-gray-950 shadow-sm">
              <h3 className="text-lg font-semibold border-b pb-2 mb-4">Certificate Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                <div>
                  <p className="text-sm text-gray-500 uppercase tracking-wider">Issued To</p>
                  <p className="font-medium text-xl">{certificate.student.name}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 uppercase tracking-wider">Course Completed</p>
                  <p className="font-medium text-xl">{certificate.course.name}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 uppercase tracking-wider">Instructor</p>
                  <p className="font-medium">{certificate.instructor.name}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 uppercase tracking-wider">Issue Date</p>
                  <p className="font-medium">{new Date(certificate.issueDate).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-gray-100 dark:border-gray-800">
                <p className="text-xs text-gray-400 font-mono break-all">
                  <strong>SHA-256 Hash:</strong> {certificate.hash}
                </p>
              </div>

              <div className="mt-8 flex justify-center">
                <CertificatePreview certData={{
                  studentName: certificate.student.name,
                  courseName: certificate.course.name,
                  instructorName: certificate.instructor.name,
                  issueDate: certificate.issueDate.toISOString(),
                  credentialId: certificate.credentialId,
                  verifyUrl: `https://credentials.skill2success.com/verify/${certificate.credentialId}`,
                  template: certificate.template
                }} />
              </div>

              <div className="mt-6 flex justify-center">
                <CertificatePDFGenerator 
                  certData={{
                    studentName: certificate.student.name,
                    courseName: certificate.course.name,
                    instructorName: certificate.instructor.name,
                    issueDate: certificate.issueDate.toISOString(),
                    credentialId: certificate.credentialId,
                    verifyUrl: `https://credentials.skill2success.com/verify/${certificate.credentialId}`,
                    template: certificate.template
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
