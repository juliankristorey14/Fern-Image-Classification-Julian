"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Trash2, Calendar, Target } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import TopNav from '../components/TopNav';
import Card from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal';
import type { User, ScanResult } from '@/types';
import { getScanById, deleteScan } from '@/utils/scans';
import { ImageWithFallback } from '../components/fig/ImageWithFallback';

interface FernDetailsPageProps {
  user: User;
  fernId: string;
}

export default function FernDetailsPage({ user, fernId }: FernDetailsPageProps) {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [scan, setScan] = useState<ScanResult | null>(null);
  const [deleteModal, setDeleteModal] = useState(false);

  useEffect(() => {
    if (fernId) {
      (async () => {
        const result = await getScanById(fernId);
        if (result) {
          setScan(result);
        }
      })();
    }
  }, [fernId]);

  const handleDelete = async () => {
    if (scan) {
      await deleteScan(scan.id);
    }
    setDeleteModal(false);
    router.push('/history');
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    router.replace('/login');
  };

  if (!scan) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

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
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Back Button */}
            <div className="flex items-center justify-between">
              <Button variant="ghost" onClick={() => router.push('/history')}>
                <ArrowLeft className="w-5 h-5" />
                Back to History
              </Button>
              <Button variant="danger" onClick={() => setDeleteModal(true)}>
                <Trash2 className="w-5 h-5" />
                Delete
              </Button>
            </div>

            {/* Image and Basic Info */}
            <Card padding="none">
              <ImageWithFallback
                src={scan.image}
                alt={scan.details?.commonName || 'Scan'}
                className="w-full h-auto max-h-96 object-contain rounded-t-2xl"
              />
              <div className="p-6 space-y-4">
                {scan.isFern && scan.details ? (
                  <>
                    <div className="text-center">
                      <div className="text-5xl mb-3">🌿</div>
                      <h1 className="text-[var(--color-neutral-800)] mb-2">
                        {scan.details.commonName}
                      </h1>
                      <p className="text-[var(--color-neutral-600)] italic">
                        {scan.details.scientificName}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[var(--color-neutral-200)]">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-[var(--color-neutral-600)]">Scanned</p>
                          <p className="text-[var(--color-neutral-800)]">
                            {new Date(scan.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                          <Target className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm text-[var(--color-neutral-600)]">Confidence</p>
                          <p className="text-[var(--color-neutral-800)]">
                            {Math.round(scan.confidence * 100)}%
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <h2 className="text-[var(--color-neutral-800)] mb-2">
                      {scan.isPlant ? 'Not a Fern' : 'Not a Plant'}
                    </h2>
                    <p className="text-[var(--color-neutral-600)]">
                      This image was identified as {scan.isPlant ? 'a plant, but not a fern species' : 'not containing a plant'}.
                    </p>
                  </div>
                )}
              </div>
            </Card>

            {/* Detailed Information */}
            {scan.isFern && scan.details && (
              <div className="space-y-6">
                {/* Description */}
                <Card padding="lg">
                  <h3 className="text-[var(--color-neutral-800)] mb-3">Description</h3>
                  <p className="text-[var(--color-neutral-600)] leading-relaxed">
                    {scan.details.description}
                  </p>
                </Card>

                {/* Habitat */}
                <Card padding="lg">
                  <h3 className="text-[var(--color-neutral-800)] mb-3">Habitat</h3>
                  <p className="text-[var(--color-neutral-600)] leading-relaxed">
                    {scan.details.habitat}
                  </p>
                </Card>

                {/* Care Requirements */}
                <Card padding="lg">
                  <h3 className="text-[var(--color-neutral-800)] mb-3">Care Requirements</h3>
                  <p className="text-[var(--color-neutral-600)] leading-relaxed">
                    {scan.details.careRequirements}
                  </p>
                </Card>

                {/* Fun Facts */}
                <Card padding="lg">
                  <h3 className="text-[var(--color-neutral-800)] mb-4">Fun Facts</h3>
                  <ul className="space-y-3">
                    {scan.details.funFacts.map((fact, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 text-[var(--color-neutral-600)]"
                      >
                        <span className="w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                          {index + 1}
                        </span>
                        <span>{fact}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Delete Modal */}
      <Modal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        title="Delete Scan"
        footer={
          <div className="flex gap-3">
            <Button variant="ghost" fullWidth onClick={() => setDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" fullWidth onClick={handleDelete}>
              Delete
            </Button>
          </div>
        }
      >
        <p>Are you sure you want to delete this scan from your history? This action cannot be undone.</p>
      </Modal>
    </div>
  );
}
