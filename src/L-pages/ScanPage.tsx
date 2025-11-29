"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, Upload, ArrowLeft, Sparkles } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import TopNav from '../components/TopNav';
import Card from '../components/Card';
import Button from '../components/Button';
import ImageUpload from '../components/ImageUpload';
import ProgressIndicator from '../components/ProgressIndicator';
import type { User } from '@/types';
import { createScan } from '@/utils/scans';

interface ScanPageProps {
  user: User;
}

export default function ScanPage({ user }: ScanPageProps) {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  type Step = { label: string; status: 'pending' | 'processing' | 'complete' };
  const stepLabels = [
    'Uploading image',
    'Preprocessing image',
    'Analyzing features',
    'Classifying species',
    'Preparing results',
  ];
  const currentStepIndex = Math.min(Math.floor(progress / 20), stepLabels.length - 1);
  const steps: Step[] = stepLabels.map((label, index) => ({
    label,
    status:
      progress === 100
        ? 'complete'
        : index < currentStepIndex
        ? 'complete'
        : index === currentStepIndex
        ? 'processing'
        : 'pending',
  }));

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    router.replace('/login');
  };

  const handleImageSelect = (_file: File, preview: string) => {
    setSelectedImage(preview);
  };

  const handleScan = async () => {
    if (!selectedImage) return;

    setIsScanning(true);
    setProgress(0);

    // Simulate scanning progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + 5;
      });
    }, 100);

    // Simulate API call (replace with real model call if you have one)
    setTimeout(async () => {
      clearInterval(interval);
      setProgress(100);

      // Mock classification logic (same as before)
      const speciesSlugs = ['boston-fern', 'maidenhair-fern', 'birds-nest-fern', 'staghorn-fern', 'asparagus-fern'];
      const isFern = Math.random() > 0.3; // 70% chance it's a fern
      const isPlant = isFern || Math.random() > 0.5; // If not fern, 50% chance it's still a plant
      const speciesSlug = isFern ? speciesSlugs[Math.floor(Math.random() * speciesSlugs.length)] : null;
      const confidence = isFern
        ? 0.85 + Math.random() * 0.14 // 0.85-0.99 for ferns
        : isPlant
        ? 0.80 + Math.random() * 0.15 // 0.80-0.95 for plants
        : 0.70 + Math.random() * 0.20; // 0.70-0.90 for non-plants

      try {
        const result = await createScan(
          user.id,
          selectedImage,
          isPlant,
          isFern,
          speciesSlug,
          confidence
        );

        // Store in localStorage for immediate retrieval on results page (fallback)
        localStorage.setItem('lastScanResult', JSON.stringify(result));

        setTimeout(() => {
          router.push(`/results/${result.id}`);
        }, 500);
      } catch (err) {
        console.error('Failed to save scan:', err);
        setError('Failed to save scan result. Please try again.');
        setIsScanning(false);
        setProgress(0);
      }
    }, 2000);
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
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => router.push('/dashboard')}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-[var(--color-neutral-800)] mb-1">Scan New Fern</h1>
                <p className="text-[var(--color-neutral-600)]">
                  Upload or capture a photo for identification
                </p>
              </div>
            </div>

            {/* Upload Section */}
            <Card padding="lg">
              <ImageUpload
                onImageSelect={handleImageSelect}
                preview={selectedImage ?? undefined}
                onClear={isScanning ? undefined : () => setSelectedImage(null)}
              />

              {selectedImage && !isScanning && (
                <div className="mt-6">
                  <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    onClick={handleScan}
                  >
                    Start Classification
                  </Button>
                </div>
              )}
            </Card>

            {/* Processing Steps */}
            {isScanning && (
              <Card padding="lg">
                <h3 className="text-[var(--color-neutral-800)] mb-6">Processing Image...</h3>
                <ProgressIndicator steps={steps} />
              </Card>
            )}

            {/* Tips Card */}
            {!isScanning && !selectedImage && (
              <Card padding="lg">
                <h4 className="text-[var(--color-neutral-800)] mb-4">Tips for Best Results</h4>
                <ul className="space-y-3 text-[var(--color-neutral-600)]">
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                      ✓
                    </span>
                    <span>Ensure the fern is clearly visible and in focus</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                      ✓
                    </span>
                    <span>Take photos in good lighting conditions</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                      ✓
                    </span>
                    <span>Capture the fronds and leaflets clearly</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                      ✓
                    </span>
                    <span>Avoid blurry or pixelated images</span>
                  </li>
                </ul>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}