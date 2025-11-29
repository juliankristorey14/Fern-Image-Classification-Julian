import { useState, useRef, DragEvent } from 'react';
import { Upload, Camera, X } from 'lucide-react';
import Button from './Button';
import Card from './Card';
import CameraModal from './CameraModal';

interface ImageUploadProps {
  onImageSelect: (file: File, preview: string) => void;
  preview?: string;
  onClear?: () => void;
}

export default function ImageUpload({ onImageSelect, preview, onClear }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const preview = e.target?.result as string;
      onImageSelect(file, preview);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const supportsGetUserMedia = () => !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);

  const handleTakePhotoClick = () => {
    if (supportsGetUserMedia()) {
      setIsCameraOpen(true);
    } else {
      cameraInputRef.current?.click();
    }
  };

  const handleModalCapture = (dataUrl: string, blob: Blob) => {
    const file = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
    onImageSelect(file, dataUrl);
  };

  return (
    <div className="w-full">
      {preview ? (
        <Card padding="none" className="relative overflow-hidden">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-auto max-h-96 object-contain"
          />
          {onClear && (
            <button
              onClick={onClear}
              className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-colors"
            >
              <X className="w-5 h-5 text-[var(--color-neutral-700)]" />
            </button>
          )}
        </Card>
      ) : (
        <div>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-200 ${
              isDragging
                ? 'border-[var(--color-primary)] bg-green-50'
                : 'border-[var(--color-neutral-300)] bg-white hover:border-[var(--color-primary)]'
            }`}
          >
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-[var(--color-neutral-100)] flex items-center justify-center">
                <Upload className="w-8 h-8 text-[var(--color-primary)]" />
              </div>
              <div>
                <p className="text-[var(--color-neutral-700)] mb-2">
                  Drag & drop your fern image here
                </p>
                <p className="text-sm text-[var(--color-neutral-500)]">
                  or choose from options below
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-5 h-5" />
              Upload Image
            </Button>
            <Button
              variant="secondary"
              size="lg"
              fullWidth
              onClick={handleTakePhotoClick}
            >
              <Camera className="w-5 h-5" />
              Take Photo
            </Button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            className="hidden"
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileInput}
            className="hidden"
          />
          <CameraModal
            isOpen={isCameraOpen}
            onClose={() => setIsCameraOpen(false)}
            onCapture={handleModalCapture}
          />
        </div>
      )}
    </div>
  );
}
