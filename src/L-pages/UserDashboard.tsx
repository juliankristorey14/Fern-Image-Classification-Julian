import { useState } from 'react';
import Link from 'next/link';
import { ScanLine, History, TrendingUp, Calendar } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import TopNav from '../components/TopNav';
import Card from '../components/Card';
import Button from '../components/Button';
import type { User } from '@/types';
import { getUserScans } from '../utils/mockData';
import { ImageWithFallback } from '../components/fig/ImageWithFallback';

interface UserDashboardProps {
  user: User;
  onLogout: () => void;
}

export default function UserDashboard({ user, onLogout }: UserDashboardProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const userScans = getUserScans(user.id);
  const fernScans = userScans.filter(scan => scan.isFern);
  const recentScans = userScans.slice(0, 3);

  return (
    <div className="flex h-screen bg-[var(--color-neutral-100)]">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar onLogout={onLogout} />
      </div>

      {/* Mobile Sidebar */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsSidebarOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full">
            <Sidebar
              onLogout={onLogout}
              onClose={() => setIsSidebarOpen(false)}
              isMobile
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav username={user.username} profilePicture={user.profilePicture} onMenuClick={() => setIsSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Welcome Section */}
            <div>
              <h1 className="text-[var(--color-neutral-800)] mb-2">
                Welcome back, {user.username}! 👋
              </h1>
              <p className="text-[var(--color-neutral-600)]">
                Ready to discover more ferns today?
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              <Card padding="md" hover>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[var(--color-neutral-600)] mb-1">Total Scans</p>
                    <h2 className="text-[var(--color-neutral-800)]">{userScans.length}</h2>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                    <ScanLine className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </Card>

              <Card padding="md" hover>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[var(--color-neutral-600)] mb-1">Ferns Found</p>
                    <h2 className="text-[var(--color-neutral-800)]">{fernScans.length}</h2>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </Card>

              <Card padding="md" hover>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[var(--color-neutral-600)] mb-1">Species Identified</p>
                    <h2 className="text-[var(--color-neutral-800)]">
                      {new Set(fernScans.map(s => s.species)).size}
                    </h2>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                    <span className="text-2xl">🌿</span>
                  </div>
                </div>
              </Card>

              <Card padding="md" hover>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[var(--color-neutral-600)] mb-1">Member Since</p>
                    <h5 className="text-[var(--color-neutral-800)]">
                      {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </h5>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid lg:grid-cols-2 gap-6">
              <Card padding="lg">
                <div className="space-y-4">
                  <h3 className="text-[var(--color-neutral-800)]">Quick Actions</h3>
                  <Link href="/scan" className="block">
                    <div className="p-6 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-2xl text-white hover:shadow-lg transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                          <ScanLine className="w-7 h-7" />
                        </div>
                        <div>
                          <h4 className="mb-1">Scan a Fern</h4>
                          <p className="text-sm opacity-90">
                            Identify a new fern species instantly
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                  <div className="grid grid-cols-2 gap-3">
                    <Link href="/history">
                      <Button variant="ghost" fullWidth>
                        <History className="w-5 h-5" />
                        View History
                      </Button>
                    </Link>
                    <Link href="/profile">
                      <Button variant="ghost" fullWidth>
                        Profile
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>

              {/* Recent Scans */}
              <Card padding="lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[var(--color-neutral-800)]">Recent Scans</h3>
                  <Link href="/history">
                    <Button variant="ghost" size="sm">
                      View All
                    </Button>
                  </Link>
                </div>
                <div className="space-y-3">
                  {recentScans.length > 0 ? (
                    recentScans.map((scan) => (
                      <Link
                        key={scan.id}
                        href={`/fern/${scan.id}`}
                        className="flex items-center gap-4 p-3 rounded-xl hover:bg-[var(--color-neutral-100)] transition-all"
                      >
                        <ImageWithFallback
                          src={scan.image}
                          alt={scan.species || 'Plant'}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <h5 className="text-[var(--color-neutral-800)] truncate">
                            {scan.isFern
                              ? scan.details?.commonName || 'Unknown Fern'
                              : scan.isPlant
                              ? 'Not a Fern'
                              : 'Not a Plant'}
                          </h5>
                          <p className="text-sm text-[var(--color-neutral-600)]">
                            {new Date(scan.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                        {scan.isFern && (
                          <div className="text-sm text-green-600 flex items-center gap-1">
                            <span>{Math.round(scan.confidence * 100)}%</span>
                          </div>
                        )}
                      </Link>
                    ))
                  ) : (
                    <div className="text-center py-8 text-[var(--color-neutral-500)]">
                      <p>No scans yet</p>
                      <p className="text-sm mt-1">Start by scanning your first fern!</p>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
