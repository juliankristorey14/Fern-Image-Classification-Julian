"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@/types";
import HistoryPage from "@/L-pages/HistoryPage";

export default function HistoryRoutePage() {
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

  return <HistoryPage user={user} />;
}
