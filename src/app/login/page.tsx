"use client";

import { useState, useEffect } from "react";
import { Button, Input, Card, CardBody, Divider } from "@heroui/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/sections";
import { LogIn, Eye, EyeOff, Mail, Lock } from "lucide-react";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const messageParam = searchParams.get("message");
    if (messageParam) {
      setMessage(messageParam);
    }
  }, [searchParams]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  const validateForm = () => {
    if (!formData.email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }
    if (!formData.password) {
      setError("Password is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to log in");
      }

      // Store user data in localStorage for now (replace with proper session management)
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirect to home page or intended destination
      const returnTo = searchParams.get("returnTo") || "/";
      router.push(returnTo);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center py-16 px-4">
        <Card className="w-full max-w-md">
          <CardBody className="p-8">
            <div className="text-center mb-8">
              <LogIn className="mx-auto h-12 w-12 text-primary mb-4" />
              <h1 className="text-2xl font-semibold">Welcome Back</h1>
              <p className="text-foreground/70 mt-2">
                Sign in to your Fiyova account
              </p>
            </div>

            {message && (
              <div className="mb-4 p-3 rounded-lg bg-success-50 border border-success-200">
                <p className="text-success-800 text-sm">{message}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email Address"
                placeholder="Enter your email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                startContent={<Mail className="text-default-400" size={18} />}
                variant="bordered"
                isRequired
                isDisabled={loading}
              />

              <Input
                label="Password"
                placeholder="Enter your password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                startContent={<Lock className="text-default-400" size={18} />}
                endContent={
                  <Button
                    isIconOnly
                    variant="light"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                    type="button"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </Button>
                }
                variant="bordered"
                isRequired
                isDisabled={loading}
              />

              {error && (
                <div className="p-3 rounded-lg bg-danger-50 border border-danger-200">
                  <p className="text-danger-800 text-sm">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                color="primary"
                size="lg"
                className="w-full"
                isLoading={loading}
                isDisabled={loading}
              >
                {loading ? "Signing In..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <Link
                href="/forgot-password"
                className="text-sm text-primary hover:text-primary/80"
              >
                Forgot your password?
              </Link>
            </div>

            <Divider className="my-6" />

            <div className="text-center">
              <p className="text-sm text-foreground/70">
                Don't have an account?{" "}
                <Link
                  href="/signup"
                  className="text-primary hover:text-primary/80 font-medium"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </CardBody>
        </Card>
      </main>
      <Footer />
    </div>
  );
}