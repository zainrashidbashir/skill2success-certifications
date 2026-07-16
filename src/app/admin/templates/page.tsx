import TemplateBuilder from "@/components/TemplateBuilder";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DeleteTemplateButton from "@/components/DeleteTemplateButton";
import Link from "next/link";

const prisma = new PrismaClient();

export default async function TemplatesPage() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    redirect("/login");
  }

  const templates = await prisma.certificateTemplate.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Certificate Templates</h1>
            <p className="text-gray-500">Design dynamic certificate layouts for batch issuing.</p>
          </div>
          <Link href="/admin">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>

        {/* Existing Templates List */}
        {templates.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {templates.map(template => (
              <Card key={template.id} className="overflow-hidden">
                <div 
                  className="h-32 bg-gray-200 bg-cover bg-center" 
                  style={{ backgroundImage: `url(${template.backgroundImage})` }}
                />
                <CardHeader className="py-3 px-4">
                  <CardTitle className="text-sm">{template.name}</CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  <p className="text-xs text-gray-500 mb-4">
                    {JSON.parse(template.layoutConfig).length} text fields configured.
                  </p>
                  <DeleteTemplateButton id={template.id} />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <hr className="border-gray-200 dark:border-gray-800" />
        
        {/* Template Builder */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Create New Template</h2>
          <TemplateBuilder />
        </div>

      </div>
    </div>
  );
}
