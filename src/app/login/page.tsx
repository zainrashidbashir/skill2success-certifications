"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid email or password");
    } else {
      // If we log in successfully, redirect to home and let middleware route them!
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-t-4 border-t-green-500">
        <CardHeader className="text-center">
          <ShieldCheck className="w-16 h-16 text-green-500 mx-auto mb-2" />
          <CardTitle className="text-2xl font-bold">Skill2Success Login</CardTitle>
          <CardDescription>Login to manage or view your certificates.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm text-center">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                className="w-full border rounded-md p-2 dark:bg-gray-900"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@example.com or admin@skill2success.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                className="w-full border rounded-md p-2 dark:bg-gray-900"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="student123 or admin123"
                required
              />
            </div>
            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
              Sign In
            </Button>
          </form>
          <div className="mt-6 text-sm text-gray-500 text-center space-y-1">
            <p><strong>Admin Demo:</strong> admin@skill2success.com / admin123</p>
            <p><strong>Student Demo:</strong> student5@example.com / student123</p>
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 text-sm text-center">
            <span className="text-gray-500">Don't have an account? </span>
            <Link href="/register" className="text-green-600 hover:underline font-medium">
              Register here
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
