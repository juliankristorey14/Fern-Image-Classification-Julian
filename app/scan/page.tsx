"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ScanPage from "@/L-pages/ScanPage";
import type { User } from "@/types";

export default function ScanRoutePage() {
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

  return <ScanPage user={user} />;
}
