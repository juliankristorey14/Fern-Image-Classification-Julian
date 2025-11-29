"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, User as UserIcon, Check, X, Camera, Upload } from "lucide-react";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Card from "@/components/Card";
import Alert from "@/components/Alert";
import { registerWithEmail } from "@/utils/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const passwordRequirements = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "Contains uppercase letter", met: /[A-Z]/.test(password) },
    { label: "Contains lowercase letter", met: /[a-z]/.test(password) },
    { label: "Contains number", met: /[0-9]/.test(password) },
  ];

  const passwordStrength = passwordRequirements.filter((req) => req.met).length;

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Profile picture must be less than 5MB");
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        setError("Please select a valid image file");
        return;
      }

      setProfilePicture(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicturePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeProfilePicture = () => {
    setProfilePicture(null);
    setProfilePicturePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (passwordStrength < 3) {
      setError("Password does not meet minimum requirements");
      return;
    }

    setIsLoading(true);

    try {
      const { user, error: registerError } = await registerWithEmail(
        username,
        email,
        password,
        profilePicture
      );

      if (registerError || !user) {
        setError(registerError ?? "Unable to create account. Please try again.");
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.replace("/login");
      }, 2000);
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
          <h1 className="text-[var(--color-neutral-800)] mb-2">Create Account</h1>
          <p className="text-[var(--color-neutral-600)]">Join FernID to start identifying ferns</p>
        </div>

        <Card padding="lg">
          {error && (
            <div className="mb-6">
              <Alert type="error" onClose={() => setError("")}>
                {error}
              </Alert>
            </div>
          )}

          {success && (
            <div className="mb-6">
              <Alert type="success">
                Account created successfully! Redirecting to login...
              </Alert>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="block text-[var(--color-neutral-700)]">Profile Picture</label>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[var(--color-neutral-200)] to-[var(--color-neutral-300)] flex items-center justify-center overflow-hidden border-3 border-white shadow-lg">
                    {profilePicturePreview ? (
                      <img 
                        src={profilePicturePreview} 
                        alt="Profile preview" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <UserIcon className="w-8 h-8 text-[var(--color-neutral-500)]" />
                    )}
                  </div>
                  {!profilePicturePreview && (
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[var(--color-primary)] rounded-full flex items-center justify-center border-2 border-white">
                      <Camera className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <input
                    type="file"
                    id="profile-picture"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                    className="hidden"
                  />
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => document.getElementById('profile-picture')?.click()}
                      className="flex items-center gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      {profilePicturePreview ? 'Change' : 'Upload'}
                    </Button>
                    {profilePicturePreview && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={removeProfilePicture}
                        className="text-[var(--color-error)] hover:bg-red-50 border-[var(--color-error)]"
                      >
                        <X className="w-4 h-4" />
                        Remove
                      </Button>
                    )}
                  </div>
                  <p className="text-xs text-[var(--color-neutral-500)] mt-1">
                    JPG, PNG or GIF (max 5MB)
                  </p>
                </div>
              </div>
            </div>

            <Input
              type="text"
              label="Username"
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              icon={<UserIcon className="w-5 h-5" />}
              required
            />

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
              placeholder="Create a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock className="w-5 h-5" />}
              required
            />

            {password && (
              <div className="space-y-2">
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className={`h-2 flex-1 rounded-full transition-all ${
                        level <= passwordStrength
                          ? passwordStrength <= 2
                            ? "bg-red-500"
                            : passwordStrength === 3
                            ? "bg-yellow-500"
                            : "bg-green-500"
                          : "bg-[var(--color-neutral-200)]"
                      }`}
                    />
                  ))}
                </div>
                <div className="space-y-1">
                  {passwordRequirements.map((req, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      {req.met ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <X className="w-4 h-4 text-[var(--color-neutral-400)]" />
                      )}
                      <span
                        className={
                          req.met
                            ? "text-green-700"
                            : "text-[var(--color-neutral-600)]"
                        }
                      >
                        {req.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Input
              type="password"
              label="Confirm Password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              icon={<Lock className="w-5 h-5" />}
              error={
                confirmPassword && password !== confirmPassword
                  ? "Passwords do not match"
                  : undefined
              }
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              disabled={isLoading || success}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-[var(--color-neutral-200)] text-center">
            <p className="text-[var(--color-neutral-600)]">
              Already have an account?{" "}
              <Link href="/login" className="text-[var(--color-primary)] hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
