import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldCheck, User, LayoutDashboard } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 flex flex-col items-center justify-center p-8">
      <div className="max-w-3xl text-center space-y-8">
        <div className="flex justify-center mb-6">
          <ShieldCheck className="w-24 h-24 text-green-600" />
        </div>
        
        <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Skill2Success <span className="text-green-600">Credentials</span>
        </h1>
        
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          A secure, cryptographically verifiable credential system. Issue, manage, and verify certificates with mathematical certainty.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-8 max-w-xl mx-auto">
          
          <Link href="/admin">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-100 dark:border-gray-700 cursor-pointer h-full flex flex-col items-center justify-center space-y-4 group">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-full group-hover:bg-blue-100 transition-colors">
                <LayoutDashboard className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold">Admin Portal</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Issue and manage certificates</p>
            </div>
          </Link>

          <Link href="/student">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-100 dark:border-gray-700 cursor-pointer h-full flex flex-col items-center justify-center space-y-4 group">
              <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded-full group-hover:bg-green-100 transition-colors">
                <User className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-2xl font-bold">Student Portal</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm">View and share your credentials</p>
            </div>
          </Link>

        </div>
      </div>
    </div>
  );
}
