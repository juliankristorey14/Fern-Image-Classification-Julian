"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import type { User } from "@/types";
import FernDetailsPage from "@/L-pages/FernDetailsPage";

export default function FernDetailsRoutePage() {
  const router = useRouter();
  const params = useParams<{ fernId: string }>();
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
  if (!params?.fernId) return null;

  return <FernDetailsPage user={user} fernId={params.fernId} />;
}
