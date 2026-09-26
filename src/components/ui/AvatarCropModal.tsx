"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  RotateCw,
  RotateCcw,
  FlipHorizontal,
  ZoomIn,
  ZoomOut,
  X,
  Check,
  AlertTriangle,
  Move,
  Loader2,
} from "lucide-react";

interface AvatarCropModalProps {
  isOpen: boolean;
  imageSrc: string | null;
  onClose: () => void;
  onConfirm: (croppedFile: File) => Promise<void> | void;
  isUploading?: boolean;
}

export default function AvatarCropModal({
  isOpen,
  imageSrc,
  onClose,
  onConfirm,
  isUploading = false,
}: AvatarCropModalProps) {
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0); // 0, 90, 180, 270
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [initialPinchDist, setInitialPinchDist] = useState<number | null>(null);
  const [initialPinchScale, setInitialPinchScale] = useState(1);

  // Confirmation step state
  const [showConfirmStep, setShowConfirmStep] = useState(false);
  const [previewBlobUrl, setPreviewBlobUrl] = useState<string | null>(null);
  const [croppedFile, setCroppedFile] = useState<File | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  // Reset when a new image is loaded
  useEffect(() => {
    if (isOpen) {
      setScale(1);
      setRotation(0);
      setFlipH(false);
      setFlipV(false);
      setOffset({ x: 0, y: 0 });
      setShowConfirmStep(false);
      setPreviewBlobUrl(null);
      setCroppedFile(null);
    }
  }, [isOpen, imageSrc]);

  // Prevent background scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [isOpen]);

  // Rotate 90 deg clockwise
  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  // Flip Horizontal
  const handleFlipH = () => {
    setFlipH((prev) => !prev);
  };

  // Reset
  const handleReset = () => {
    setScale(1);
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
    setOffset({ x: 0, y: 0 });
  };

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch drag & pinch handlers (for mobile & tablet)
  const getTouchDist = (t1: React.Touch, t2: React.Touch) => {
    const dx = t1.clientX - t2.clientX;
    const dy = t1.clientY - t2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - offset.x,
        y: e.touches[0].clientY - offset.y,
      });
      setInitialPinchDist(null);
    } else if (e.touches.length === 2) {
      setIsDragging(false);
      const dist = getTouchDist(e.touches[0], e.touches[1]);
      setInitialPinchDist(dist);
      setInitialPinchScale(scale);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && isDragging) {
      setOffset({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y,
      });
    } else if (e.touches.length === 2 && initialPinchDist !== null) {
      const dist = getTouchDist(e.touches[0], e.touches[1]);
      const factor = dist / initialPinchDist;
      const newScale = Math.min(3.5, Math.max(0.6, initialPinchScale * factor));
      setScale(newScale);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setInitialPinchDist(null);
  };

  // Wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.1 : -0.1;
    setScale((prev) => Math.min(3.5, Math.max(0.6, prev + delta)));
  };

  // Generate cropped circular file using HTML5 Canvas
  const generateCroppedImage = useCallback(async (): Promise<File | null> => {
    if (!imageSrc || !imgRef.current) return null;

    const img = imgRef.current;
    const canvas = document.createElement("canvas");
    const outputSize = 512; // 512x512 high res
    canvas.width = outputSize;
    canvas.height = outputSize;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // Radius of circular preview in screen pixels
    const cropCircleRadius = 120; // 240px diameter

    // Fill clean background
    ctx.fillStyle = "#F7F2E7";
    ctx.fillRect(0, 0, outputSize, outputSize);

    ctx.save();

    // Map screen crop window to 512x512 canvas coordinates
    ctx.translate(outputSize / 2, outputSize / 2);

    // Apply rotation
    ctx.rotate((rotation * Math.PI) / 180);

    // Apply flips
    ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);

    // Scaling ratio from screen to canvas
    const ratio = outputSize / (cropCircleRadius * 2);

    // Apply zoom & pan offset
    const renderScale = scale * ratio;
    const renderOffsetX = offset.x * ratio;
    const renderOffsetY = offset.y * ratio;

    // Draw image centered
    const nw = img.naturalWidth || 512;
    const nh = img.naturalHeight || 512;

    // Maintain aspect ratio fit
    const baseFitScale = (cropCircleRadius * 2) / Math.min(nw, nh);
    const drawW = nw * baseFitScale * scale * ratio;
    const drawH = nh * baseFitScale * scale * ratio;

    ctx.drawImage(
      img,
      -drawW / 2 + (rotation % 180 !== 0 ? renderOffsetY : renderOffsetX),
      -drawH / 2 + (rotation % 180 !== 0 ? renderOffsetX : renderOffsetY),
      drawW,
      drawH
    );

    ctx.restore();

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(null);
            return;
          }
          const file = new File([blob], "avatar_profile.jpg", {
            type: "image/jpeg",
            lastModified: Date.now(),
          });
          resolve(file);
        },
        "image/jpeg",
        0.92
      );
    });
  }, [imageSrc, scale, rotation, flipH, flipV, offset]);

  // Proceed to confirmation modal
  const handleProceedToConfirm = async () => {
    const file = await generateCroppedImage();
    if (!file) return;

    setCroppedFile(file);
    setPreviewBlobUrl(URL.createObjectURL(file));
    setShowConfirmStep(true);
  };

  // Final confirmation save
  const handleFinalSave = async () => {
    if (!croppedFile) return;
    await onConfirm(croppedFile);
    onClose();
  };

  if (!isOpen || !imageSrc) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      {/* Dark backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Main Cropper Container */}
      <div
        className="relative w-full max-w-lg bg-brown-900 text-cream rounded-3xl shadow-2xl border border-brown-700/40 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header bar with tools */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/10 bg-brown-900/90 z-20">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 text-cream/80 hover:text-white transition-colors"
              title="Batal"
            >
              <X size={18} />
            </button>
            <span className="font-display font-bold text-sm text-white">
              {showConfirmStep ? "Konfirmasi Foto" : "Sesuaikan & Crop Foto"}
            </span>
          </div>

          {!showConfirmStep ? (
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Rotate 90 deg button (fixes belok/tilted photo) */}
              <button
                type="button"
                onClick={handleRotate}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-cream text-xs font-semibold transition-all active:scale-95"
                title="Putar 90 Derajat"
              >
                <RotateCw size={14} className="text-orange-400" />
                <span className="hidden sm:inline">Putar</span>
              </button>

              {/* Flip Horizontal */}
              <button
                type="button"
                onClick={handleFlipH}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 text-cream transition-all active:scale-95"
                title="Balik Horizontal"
              >
                <FlipHorizontal size={14} />
              </button>

              {/* Reset */}
              <button
                type="button"
                onClick={handleReset}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 text-cream transition-all active:scale-95"
                title="Reset Posisi"
              >
                <RotateCcw size={14} />
              </button>

              {/* Confirm Crop button */}
              <button
                type="button"
                onClick={handleProceedToConfirm}
                className="ml-1 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs px-3.5 py-1.5 rounded-full transition-all active:scale-95 shadow-md flex items-center gap-1 cursor-pointer"
              >
                <Check size={14} />
                <span>Gunakan</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowConfirmStep(false)}
              className="text-xs text-orange-400 hover:underline font-semibold"
            >
              ← Edit Ulang
            </button>
          )}
        </div>

        {/* STEP 1: Interactive Crop Area */}
        {!showConfirmStep ? (
          <div className="flex-1 flex flex-col select-none overflow-hidden">
            {/* Gesture Canvas Container */}
            <div
              ref={containerRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onWheel={handleWheel}
              className="relative w-full h-[320px] sm:h-[360px] bg-black/90 flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing touch-none"
            >
              {/* Invisible reference image for natural dimensions */}
              <img
                ref={imgRef}
                src={imageSrc}
                alt="Source"
                className="hidden"
                onLoad={() => {
                  setScale(1);
                  setOffset({ x: 0, y: 0 });
                }}
              />

              {/* Transformed image layer */}
              <div
                className="absolute pointer-events-none transition-transform duration-75"
                style={{
                  transform: `translate(${offset.x}px, ${offset.y}px) rotate(${rotation}deg) scale(${
                    flipH ? -scale : scale
                  }, ${flipV ? -scale : scale})`,
                  transformOrigin: "center center",
                }}
              >
                <img
                  src={imageSrc}
                  alt="Avatar preview"
                  className="max-w-none select-none max-h-[380px] object-contain"
                  draggable={false}
                />
              </div>

              {/* Circular Cutout Overlay Mask */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <svg
                  className="w-full h-full"
                  viewBox="0 0 400 400"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <mask id="crop-mask">
                      {/* White rectangle covers everything */}
                      <rect width="400" height="400" fill="white" />
                      {/* Black circle cuts out the center */}
                      <circle cx="200" cy="200" r="120" fill="black" />
                    </mask>
                  </defs>
                  {/* Dark overlay with mask cutout */}
                  <rect
                    width="400"
                    height="400"
                    fill="rgba(0, 0, 0, 0.65)"
                    mask="url(#crop-mask)"
                  />
                  {/* Subtle guide ring */}
                  <circle
                    cx="200"
                    cy="200"
                    r="120"
                    fill="none"
                    stroke="#F2884B"
                    strokeWidth="2.5"
                    strokeDasharray="4 4"
                    opacity="0.85"
                  />
                </svg>
              </div>

              {/* Helper badge */}
              <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 text-[10px] text-cream/80 flex items-center gap-1.5 pointer-events-none">
                <Move size={11} className="text-orange-400" />
                <span>Geser &amp; cubit untuk atur posisi</span>
              </div>
            </div>

            {/* Bottom Controls: Zoom Slider */}
            <div className="px-6 py-3.5 bg-brown-900 border-t border-white/10 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs text-cream/70 font-semibold">
                <span className="flex items-center gap-1">
                  <ZoomOut size={14} /> Zoom
                </span>
                <span className="font-mono text-orange-400">{Math.round(scale * 100)}%</span>
                <ZoomIn size={14} />
              </div>
              <input
                type="range"
                min="0.6"
                max="3.5"
                step="0.05"
                value={scale}
                onChange={(e) => setScale(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
            </div>
          </div>
        ) : (
          /* STEP 2: Cooldown Warning & Confirmation Modal */
          <div className="p-6 flex flex-col items-center text-center gap-5 animate-in fade-in duration-200">
            {/* Cropped Preview */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-orange-500 shadow-xl bg-cream">
                {previewBlobUrl && (
                  <img
                    src={previewBlobUrl}
                    alt="Cropped Preview"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <span className="absolute -bottom-1 -right-1 bg-green-500 text-white rounded-full p-1 border-2 border-brown-900">
                <Check size={14} />
              </span>
            </div>

            {/* Warning Alert Box (Cooldown 3 Hari) */}
            <div className="w-full bg-orange-500/10 border border-orange-500/40 rounded-2xl p-4 text-left flex gap-3.5 items-start">
              <div className="w-8 h-8 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0 mt-0.5">
                <AlertTriangle size={18} />
              </div>
              <div className="flex-1">
                <h4 className="font-display font-bold text-sm text-orange-300">
                  Perhatian: Cooldown Ganti Foto Profil
                </h4>
                <p className="text-xs text-cream/80 mt-1 leading-relaxed">
                  Setelah kamu menyimpan foto profil ini, akunmu akan masuk masa cooldown dan{" "}
                  <strong className="text-white">tidak dapat mengganti foto profil lagi selama 3 hari ke depan</strong>.
                </p>
              </div>
            </div>

            <p className="text-xs text-cream/70 max-w-sm">
              Pastikan posisi wajah dan foto sudah sesuai dengan keinginanmu sebelum melanjutkan.
            </p>

            {/* Action buttons */}
            <div className="w-full flex flex-col sm:flex-row gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmStep(false)}
                disabled={isUploading}
                className="flex-1 py-2.5 rounded-full border border-white/20 hover:bg-white/10 text-xs font-bold text-cream transition-colors cursor-pointer"
              >
                ← Kembali Sesuaikan
              </button>
              <button
                type="button"
                onClick={handleFinalSave}
                disabled={isUploading}
                className="flex-1 py-2.5 rounded-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {isUploading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <>
                    <Check size={14} />
                    <span>Ya, Simpan Foto Profil</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
