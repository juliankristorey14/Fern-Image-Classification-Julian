"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock } from "lucide-react";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Card from "@/components/Card";
import Alert from "@/components/Alert";
import { loginWithEmail } from "@/utils/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const user = await loginWithEmail(email, password);

      if (user) {
        localStorage.setItem("currentUser", JSON.stringify(user));
        if (user.role === "admin") {
          router.replace("/admin");
        } else {
          router.replace("/dashboard");
        }
      } else {
        setError("Invalid email or password.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-neutral-100)] via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-2xl flex items-center justify-center">
              <span className="text-3xl">🌿</span>
            </div>
          </Link>
          <h1 className="mb-2 text-[var(--color-neutral-800)]">Welcome Back</h1>
          <p className="text-[var(--color-neutral-600)]">Sign in to continue your fern journey</p>
        </div>

        <Card padding="lg">
          {error && (
            <div className="mb-6">
              <Alert type="error" onClose={() => setError("")}>
                {error}
              </Alert>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              type="email"
              label="Email Address"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="w-5 h-5" />}
              required
            />

            <Input
              type="password"
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock className="w-5 h-5" />}
              required
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded accent-[var(--color-primary)]" />
                <span className="text-sm text-[var(--color-neutral-600)]">Remember me</span>
              </label>
              <a href="#" className="text-sm text-[var(--color-primary)] hover:underline">
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-[var(--color-neutral-200)] text-center">
            <p className="text-[var(--color-neutral-600)]">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-[var(--color-primary)] hover:underline">
                Create one
              </Link>
            </p>
          </div>

                  </Card>
      </div>
    </div>
  );
}
