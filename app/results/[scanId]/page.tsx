"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import type { User } from "@/types";
import ResultsPage from "@/L-pages/ResultsPage";

export default function ResultsRoutePage() {
  const router = useRouter();
  const params = useParams<{ scanId: string }>();
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
  if (!params?.scanId) return null;

  return <ResultsPage user={user} scanId={params.scanId} />;
}
