"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import type { User } from "@/types";
import UserDashboard from "@/L-pages/UserDashboard";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("currentUser");
    if (!stored) {
      router.replace("/login");
      return;
    }
    const parsed = JSON.parse(stored) as User;
    if (parsed.role === "admin") {
      router.replace("/admin");
      return;
    }
    setUser(parsed);
  }, [router]);

  if (!user) return null;

  return (
    <UserDashboard
      user={user}
      onLogout={() => {
        localStorage.removeItem("currentUser");
        router.replace("/login");
      }}
    />
  );
}
