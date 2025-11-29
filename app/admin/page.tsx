"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Users, ScanLine, Leaf, TrendingUp, Menu } from "lucide-react";
import AdminSidebar from "@/components/AdminSidebar";
import Card from "@/components/Card";
import { getAllUsers, getAllScans, fernSpeciesData } from "@/utils/mockData";
import { ImageWithFallback } from "@/components/fig/ImageWithFallback";
import type { User } from "@/types";

export default function AdminPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser") || "null");
    setCurrentUser(user);
    if (!user || user.role !== "admin") {
      router.replace("/admin/login");
    }
  }, [router]);

  const users = getAllUsers();
  const scans = getAllScans();
  const fernScans = scans.filter((s) => s.isFern);
  const speciesCount = Object.keys(fernSpeciesData).length;

  const recentScans = scans.slice(0, 5);

  const speciesFrequency = fernScans.reduce((acc, scan) => {
    if (scan.species) {
      acc[scan.species] = (acc[scan.species] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const topSpecies = Object.entries(speciesFrequency)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([species, count]) => ({
      name: fernSpeciesData[species]?.commonName || species,
      count,
    }));

  const handleLogoutClick = () => {
    localStorage.removeItem("currentUser");
    router.replace("/admin/login");
  };

  return (
    <div className="flex h-screen bg-[var(--color-neutral-100)]">
      {/* Desktop Sidebar */}
      <div className="hidden h-full lg:block">
        <AdminSidebar onLogout={handleLogoutClick} user={currentUser} />
      </div>

      {/* Mobile Sidebar */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-50 w-72 h-screen">
            <AdminSidebar
              onLogout={handleLogoutClick}
              onClose={() => setIsSidebarOpen(false)}
              isMobile
              user={currentUser}
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Nav */}
        <div className="bg-white border-b border-[var(--color-neutral-200)] px-4 py-4 md:px-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden text-[var(--color-neutral-700)] hover:text-[var(--color-neutral-900)]"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-[var(--color-neutral-800)]">Admin Dashboard</h2>
            <div className="w-6 lg:w-0"></div>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Stats Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              <Card padding="md" hover>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[var(--color-neutral-600)] mb-1">Total Users</p>
                    <h2 className="text-[var(--color-neutral-800)]">{users.length}</h2>
                    <p className="text-sm text-green-600 mt-1">+12% this month</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </Card>

              <Card padding="md" hover>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[var(--color-neutral-600)] mb-1">Total Scans</p>
                    <h2 className="text-[var(--color-neutral-800)]">{scans.length}</h2>
                    <p className="text-sm text-green-600 mt-1">+24% this week</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                    <ScanLine className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </Card>

              <Card padding="md" hover>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[var(--color-neutral-600)] mb-1">Fern Species</p>
                    <h2 className="text-[var(--color-neutral-800)]">{speciesCount}</h2>
                    <p className="text-sm text-[var(--color-neutral-600)] mt-1">In database</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                    <Leaf className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </Card>

              <Card padding="md" hover>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[var(--color-neutral-600)] mb-1">Success Rate</p>
                    <h2 className="text-[var(--color-neutral-800)]">94.5%</h2>
                    <p className="text-sm text-green-600 mt-1">Model accuracy</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </Card>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card padding="lg">
                <h3 className="text-[var(--color-neutral-800)] mb-4">Recent Scans</h3>
                <div className="space-y-3">
                  {recentScans.map((scan) => {
                    const user = users.find((u) => u.id === scan.userId);
                    return (
                      <div
                        key={scan.id}
                        className="flex items-center gap-4 p-3 bg-[var(--color-neutral-100)] rounded-xl"
                      >
                        <ImageWithFallback
                          src={scan.image}
                          alt="Scan"
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-[var(--color-neutral-800)] truncate">
                            {scan.details?.commonName || "Not a fern"}
                          </p>
                          <p className="text-sm text-[var(--color-neutral-600)]">
                            by {user?.username || "Unknown"}
                          </p>
                        </div>
                        <div className="text-xs text-[var(--color-neutral-600)]">
                          {new Date(scan.timestamp).toLocaleDateString()}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>

              {/* Top Species */}
              <Card padding="lg">
                <h3 className="text-[var(--color-neutral-800)] mb-4">Most Scanned Species</h3>
                <div className="space-y-3">
                  {topSpecies.map((species, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center text-white">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-[var(--color-neutral-800)]">{species.name}</p>
                      </div>
                      <div className="text-[var(--color-neutral-600)]">
                        {species.count} scans
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card padding="lg">
              <h3 className="text-[var(--color-neutral-800)] mb-4">Quick Actions</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <button
                  onClick={() => router.push("/admin/users")}
                  className="p-4 bg-[var(--color-neutral-100)] hover:bg-[var(--color-neutral-200)] rounded-xl text-left transition-colors"
                >
                  <Users className="w-6 h-6 text-[var(--color-primary)] mb-2" />
                  <p className="text-[var(--color-neutral-800)]">Manage Users</p>
                </button>
                <button
                  onClick={() => router.push("/admin/species")}
                  className="p-4 bg-[var(--color-neutral-100)] hover:bg-[var(--color-neutral-200)] rounded-xl text-left transition-colors"
                >
                  <Leaf className="w-6 h-6 text-[var(--color-primary)] mb-2" />
                  <p className="text-[var(--color-neutral-800)]">Fern Database</p>
                </button>
                <button
                  onClick={() => router.push("/admin/scans")}
                  className="p-4 bg-[var(--color-neutral-100)] hover:bg-[var(--color-neutral-200)] rounded-xl text-left transition-colors"
                >
                  <ScanLine className="w-6 h-6 text-[var(--color-primary)] mb-2" />
                  <p className="text-[var(--color-neutral-800)]">View Scan Logs</p>
                </button>
                <button
                  onClick={() => router.push("/admin/settings")}
                  className="p-4 bg-[var(--color-neutral-100)] hover:bg-[var(--color-neutral-200)] rounded-xl text-left transition-colors"
                >
                  <TrendingUp className="w-6 h-6 text-[var(--color-primary)] mb-2" />
                  <p className="text-[var(--color-neutral-800)]">System Settings</p>
                </button>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
