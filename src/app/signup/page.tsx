"use client";

import { useState } from "react";
import { Button, Input, Card, CardBody, Divider } from "@heroui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/sections";
import { UserPlus, Eye, EyeOff, Mail, User, Lock } from "lucide-react";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Name is required");
      return false;
    }
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
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create account");
      }

      router.push("/login?message=Account created successfully! Please log in.");
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
              <UserPlus className="mx-auto h-12 w-12 text-primary mb-4" />
              <h1 className="text-2xl font-semibold">Create Account</h1>
              <p className="text-foreground/70 mt-2">
                Join Fiyova to start shopping amazing digital products
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Full Name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                startContent={<User className="text-default-400" size={18} />}
                variant="bordered"
                isRequired
                isDisabled={loading}
              />

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
                placeholder="Create a password"
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

              <Input
                label="Confirm Password"
                placeholder="Confirm your password"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                startContent={<Lock className="text-default-400" size={18} />}
                endContent={
                  <Button
                    isIconOnly
                    variant="light"
                    size="sm"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    type="button"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
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
                {loading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            <Divider className="my-6" />

            <div className="text-center">
              <p className="text-sm text-foreground/70">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-primary hover:text-primary/80 font-medium"
                >
                  Sign in
                </Link>
              </p>
            </div>

            <div className="mt-6 text-center">
              <p className="text-xs text-foreground/60">
                By creating an account, you agree to our{" "}
                <Link href="/terms" className="text-primary hover:text-primary/80">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-primary hover:text-primary/80">
                  Privacy Policy
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