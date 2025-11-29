import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Trash2, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Sidebar from '../components/Sidebar';
import TopNav from '../components/TopNav';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Modal from '../components/Modal';
import type { User, ScanResult } from '@/types';
import { getUserScans, deleteScan } from '@/utils/scans';
import { ImageWithFallback } from '../components/fig/ImageWithFallback';

interface HistoryPageProps {
  user: User;
}

export default function HistoryPage({ user }: HistoryPageProps) {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteModal, setDeleteModal] = useState<string | null>(null);
  const [deleteAllOpen, setDeleteAllOpen] = useState(false);
  const [scans, setScans] = useState<ScanResult[]>([]);

  useEffect(() => {
    getUserScans(user.id).then(setScans);
  }, [user.id]);

  const filteredScans = scans.filter((scan) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      scan.details?.commonName.toLowerCase().includes(query) ||
      scan.details?.scientificName.toLowerCase().includes(query)
    );
  });

  const handleDelete = async (scanId: string) => {
    await deleteScan(scanId);
    setScans((prev) => prev.filter((s) => s.id !== scanId));
    setDeleteModal(null);
  };

  const handleDeleteAll = async () => {
    const promises = scans.map((scan) => deleteScan(scan.id));
    await Promise.all(promises);
    setScans([]);
    setDeleteAllOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    router.replace('/login');
  };

  return (
    <div className="flex h-screen bg-[var(--color-neutral-100)]">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar onLogout={handleLogout} />
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
              onLogout={handleLogout}
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
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-[var(--color-neutral-800)] mb-2">Scan History</h1>
                <p className="text-[var(--color-neutral-600)]">
                  View and manage your fern identification history
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Link href="/scan">
                  <Button variant="primary">New Scan</Button>
                </Link>
                {scans.length > 0 && (
                  <Button variant="danger" onClick={() => setDeleteAllOpen(true)}>
                    Delete All
                  </Button>
                )}
              </div>
            </div>

            {/* Search */}
            <Card padding="md">
              <Input
                type="text"
                placeholder="Search by species name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<Search className="w-5 h-5" />}
              />
            </Card>

            {/* Scan List */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {filteredScans.length > 0 ? (
                filteredScans.map((scan) => (
                  <Card key={scan.id} padding="none" hover>
                    <ImageWithFallback
                      src={scan.image}
                      alt={scan.details?.commonName || 'Scan'}
                      className="w-full h-48 object-cover rounded-t-2xl"
                    />
                    <div className="p-4 space-y-3">
                      <div>
                        <h4 className="text-[var(--color-neutral-800)] mb-1">
                          {scan.isFern
                            ? scan.details?.commonName || 'Unknown Fern'
                            : scan.isPlant
                            ? 'Not a Fern'
                            : 'Not a Plant'}
                        </h4>
                        {scan.isFern && scan.details && (
                          <p className="text-sm text-[var(--color-neutral-600)] italic">
                            {scan.details.scientificName}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[var(--color-neutral-600)]">
                          {new Date(scan.timestamp).toLocaleDateString()}
                        </span>
                        {scan.isFern && (
                          <span className="text-green-600">
                            {Math.round(scan.confidence * 100)}% match
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/fern/${scan.id}`} className="flex-1">
                          <Button variant="primary" size="sm" fullWidth>
                            <Eye className="w-4 h-4" />
                            View Details
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteModal(scan.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="col-span-full">
                  <Card padding="lg">
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">🔍</div>
                      <h3 className="text-[var(--color-neutral-800)] mb-2">
                        {searchQuery ? 'No results found' : 'No scans yet'}
                      </h3>
                      <p className="text-[var(--color-neutral-600)] mb-6">
                        {searchQuery
                          ? 'Try adjusting your search'
                          : 'Start by scanning your first fern!'}
                      </p>
                      {!searchQuery && (
                        <Link href="/scan">
                          <Button variant="primary">Scan a Fern</Button>
                        </Link>
                      )}
                    </div>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Delete Modal */}
      <Modal
        isOpen={!!deleteModal}
        onClose={() => setDeleteModal(null)}
        title="Delete Scan"
        footer={
          <div className="flex gap-3">
            <Button
              variant="ghost"
              fullWidth
              onClick={() => setDeleteModal(null)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              fullWidth
              onClick={() => handleDelete(deleteModal!)}
            >
              Delete
            </Button>
          </div>
        }
      >
        <p>Are you sure you want to delete this scan? This action cannot be undone.</p>
      </Modal>

      {/* Delete All Modal */}
      <Modal
        isOpen={deleteAllOpen}
        onClose={() => setDeleteAllOpen(false)}
        title="Delete All History"
        footer={
          <div className="flex gap-3">
            <Button
              variant="ghost"
              fullWidth
              onClick={() => setDeleteAllOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              fullWidth
              onClick={handleDeleteAll}
            >
              Delete All
            </Button>
          </div>
        }
      >
        <p>Are you sure you want to delete all your scan history? This cannot be undone.</p>
      </Modal>
    </div>
  );
}