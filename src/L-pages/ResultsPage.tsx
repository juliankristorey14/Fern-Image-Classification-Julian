"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, XCircle, ScanLine, Save, ArrowLeft } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import TopNav from '../components/TopNav';
import Card from '../components/Card';
import Button from '../components/Button';
import Alert from '../components/Alert';
import type { User, ScanResult } from '@/types';
import { getScanById } from '@/utils/scans';
import { ImageWithFallback } from '../components/fig/ImageWithFallback';

interface ResultsPageProps {
  user: User;
  scanId: string;
}

export default function ResultsPage({ user, scanId }: ResultsPageProps) {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const byId = await getScanById(scanId);
        if (byId) {
          setResult(byId);
          return;
        }
      } catch (err) {
        console.error('getScanById error', err);
      }

      const storedResult = localStorage.getItem('lastScanResult');
      if (storedResult) {
        try {
          setResult(JSON.parse(storedResult) as ScanResult);
        } catch (err) {
          console.error('Invalid lastScanResult in localStorage', err);
        }
      }
    })();
  }, [scanId]);

  const handleSave = () => {
    // In real app, would save to backend
    setSaved(true);
    setTimeout(() => {
      router.push('/history');
    }, 1500);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    router.replace('/login');
  };

  if (!result) {
    return (
      <div className="flex h-screen items-center justify-center bg-[var(--color-neutral-100)]">
        <p className="text-[var(--color-neutral-600)]">Loading results...</p>
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
            <Button
              variant="ghost"
              onClick={() => router.push('/scan')}
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Scan
            </Button>

            {/* Success Alert */}
            {saved && (
              <Alert type="success">
                Scan saved to your history! Redirecting...
              </Alert>
            )}

            {/* Image Preview */}
            <Card padding="none">
              <ImageWithFallback
                src={result.image}
                alt="Scanned fern"
                className="w-full h-auto max-h-96 object-contain rounded-t-2xl"
              />
              <div className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  {result.isFern ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-600" />
                  )}
                  <h2 className="text-[var(--color-neutral-800)]">
                    {result.isFern ? 'Fern Detected!' : result.isPlant ? 'Not a Fern' : 'Not a Plant'}
                  </h2>
                </div>
                <p className="text-[var(--color-neutral-600)]">
                  Confidence: {Math.round(result.confidence * 100)}%
                </p>
              </div>
            </Card>

            {/* Classification Results */}
            {result.isFern && result.details && (
              <div className="space-y-6">
                {/* Species Name */}
                <Card padding="lg">
                  <div className="text-center space-y-2">
                    <div className="text-5xl mb-4">🌿</div>
                    <h2 className="text-[var(--color-neutral-800)]">
                      {result.details.commonName}
                    </h2>
                    <p className="text-[var(--color-neutral-600)] italic">
                      {result.details.scientificName}
                    </p>
                  </div>
                </Card>

                {/* Description */}
                <Card padding="lg">
                  <h3 className="text-[var(--color-neutral-800)] mb-3">Description</h3>
                  <p className="text-[var(--color-neutral-600)] leading-relaxed">
                    {result.details.description}
                  </p>
                </Card>

                {/* Habitat */}
                <Card padding="lg">
                  <h3 className="text-[var(--color-neutral-800)] mb-3">Habitat</h3>
                  <p className="text-[var(--color-neutral-600)] leading-relaxed">
                    {result.details.habitat}
                  </p>
                </Card>

                {/* Care Requirements */}
                <Card padding="lg">
                  <h3 className="text-[var(--color-neutral-800)] mb-3">Care Requirements</h3>
                  <p className="text-[var(--color-neutral-600)] leading-relaxed">
                    {result.details.careRequirements}
                  </p>
                </Card>

                {/* Fun Facts */}
                <Card padding="lg">
                  <h3 className="text-[var(--color-neutral-800)] mb-4">Fun Facts</h3>
                  <ul className="space-y-3">
                    {result.details.funFacts.map((fact, index) => (
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

            {/* Action Buttons */}
            <div className="grid sm:grid-cols-2 gap-4">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={handleSave}
                disabled={saved}
              >
                <Save className="w-5 h-5" />
                {saved ? 'Saved!' : 'Save to History'}
              </Button>
              <Button
                variant="secondary"
                size="lg"
                fullWidth
                onClick={() => router.push('/scan')}
              >
                <ScanLine className="w-5 h-5" />
                Scan Another
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}