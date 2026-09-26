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

const CROP_DIAMETER = 240; // Diameter of the screen crop circle in px
const OUTPUT_SIZE = 512;   // High-res output size for exported avatar in px

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

  // Scaled base size so the image covers the 240px circle at scale=1
  const [baseSize, setBaseSize] = useState<{ w: number; h: number }>({
    w: CROP_DIAMETER,
    h: CROP_DIAMETER,
  });

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

  // When image loads, compute baseSize to guarantee full coverage of the crop circle
  const handleImageLoad = () => {
    if (!imgRef.current) return;
    const nw = imgRef.current.naturalWidth || 500;
    const nh = imgRef.current.naturalHeight || 500;
    // Scale factor so the SHORTEST side equals CROP_DIAMETER
    const baseFitScale = CROP_DIAMETER / Math.min(nw, nh);
    setBaseSize({
      w: Math.round(nw * baseFitScale),
      h: Math.round(nh * baseFitScale),
    });
    setScale(1);
    setOffset({ x: 0, y: 0 });
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
  };

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
      const newScale = Math.min(3.5, Math.max(1.0, initialPinchScale * factor));
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
    const delta = e.deltaY < 0 ? 0.08 : -0.08;
    setScale((prev) => Math.min(3.5, Math.max(1.0, prev + delta)));
  };

  // Generate cropped circular file using HTML5 Canvas with 100% exact 1-to-1 coordinate mapping
  const generateCroppedImage = useCallback(async (): Promise<File | null> => {
    if (!imageSrc || !imgRef.current) return null;

    const img = imgRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = OUTPUT_SIZE;
    canvas.height = OUTPUT_SIZE;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const M = OUTPUT_SIZE / CROP_DIAMETER; // Scale ratio from screen to canvas

    // Enable high-res smoothing
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    ctx.save();

    // 1. Move to canvas center + user drag offset (scaled by M)
    ctx.translate(OUTPUT_SIZE / 2 + offset.x * M, OUTPUT_SIZE / 2 + offset.y * M);

    // 2. Rotate around the image center
    ctx.rotate((rotation * Math.PI) / 180);

    // 3. Flip
    ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);

    // 4. Draw image centered
    const drawW = baseSize.w * scale * M;
    const drawH = baseSize.h * scale * M;
    ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);

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
        0.95
      );
    });
  }, [imageSrc, baseSize, scale, rotation, flipH, flipV, offset]);

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
  };

  if (!isOpen || !imageSrc) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#1f1610] text-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-white/10 flex flex-col max-h-[92vh]">
        {/* Header Toolbar */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/10 bg-brown-900/90 z-20">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 text-cream/80 hover:text-white transition-colors cursor-pointer"
              title="Batal"
            >
              <X size={18} />
            </button>
            <span className="font-display font-bold text-sm text-white">
              {showConfirmStep ? "Konfirmasi Foto Profil" : "Sesuaikan Posisi Foto"}
            </span>
          </div>

          {!showConfirmStep ? (
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Rotate 90 deg */}
              <button
                type="button"
                onClick={handleRotate}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-cream text-xs font-semibold transition-all active:scale-95 cursor-pointer"
                title="Putar 90 Derajat"
              >
                <RotateCw size={14} className="text-orange-400" />
                <span className="hidden sm:inline">Putar</span>
              </button>

              {/* Flip Horizontal */}
              <button
                type="button"
                onClick={handleFlipH}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 text-cream transition-all active:scale-95 cursor-pointer"
                title="Balik Horizontal"
              >
                <FlipHorizontal size={14} />
              </button>

              {/* Reset */}
              <button
                type="button"
                onClick={handleReset}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 text-cream transition-all active:scale-95 cursor-pointer"
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
              className="text-xs text-orange-400 hover:underline font-semibold cursor-pointer"
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
              className="relative w-full h-[320px] sm:h-[380px] bg-[#120d09] flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing touch-none select-none"
            >
              {/* Invisible reference image to compute natural dimensions */}
              <img
                ref={imgRef}
                src={imageSrc}
                alt="Source"
                className="hidden"
                onLoad={handleImageLoad}
              />

              {/* Transformed image layer — exact 1-to-1 match with Canvas */}
              <div
                className="absolute pointer-events-none transition-transform duration-75 flex items-center justify-center"
                style={{
                  width: `${baseSize.w}px`,
                  height: `${baseSize.h}px`,
                  transform: `translate(${offset.x}px, ${offset.y}px) rotate(${rotation}deg) scale(${
                    flipH ? -scale : scale
                  }, ${flipV ? -scale : scale})`,
                  transformOrigin: "center center",
                }}
              >
                <img
                  src={imageSrc}
                  alt="Avatar preview"
                  className="w-full h-full object-cover select-none block pointer-events-none"
                  draggable={false}
                />
              </div>

              {/* Circular Cutout Window — guaranteed perfect circle without any SVG distortion */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div
                  style={{ width: `${CROP_DIAMETER}px`, height: `${CROP_DIAMETER}px` }}
                  className="rounded-full border-2 border-dashed border-orange-500 shadow-[0_0_0_9999px_rgba(0,0,0,0.68)] relative"
                >
                  {/* Crosshair guide markers */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-orange-400/70" />
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-orange-400/70" />
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-orange-400/70" />
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-orange-400/70" />
                </div>
              </div>

              {/* Helper badge */}
              <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-[11px] font-medium text-cream/90 flex items-center gap-1.5 pointer-events-none shadow-md">
                <Move size={12} className="text-orange-400" />
                <span>Geser foto agar pas di tengah lingkaran</span>
              </div>
            </div>

            {/* Bottom Controls: Zoom Slider */}
            <div className="px-6 py-3.5 bg-brown-900 border-t border-white/10 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs text-cream/70 font-semibold">
                <span className="flex items-center gap-1">
                  <ZoomOut size={14} /> Zoom
                </span>
                <span className="font-mono text-orange-400 font-bold">{Math.round(scale * 100)}%</span>
                <ZoomIn size={14} />
              </div>
              <input
                type="range"
                min="1.0"
                max="3.5"
                step="0.02"
                value={scale}
                onChange={(e) => setScale(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
            </div>
          </div>
        ) : (
          /* STEP 2: Cooldown Warning & Confirmation Modal */
          <div className="p-6 flex flex-col items-center text-center gap-5 animate-in fade-in duration-200">
            {/* Cropped Preview — perfectly centered circular avatar */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-orange-500 shadow-xl bg-[#120d09] flex items-center justify-center">
                {previewBlobUrl && (
                  <img
                    src={previewBlobUrl}
                    alt="Cropped Preview"
                    className="w-full h-full object-cover object-center block"
                  />
                )}
              </div>
              <span className="absolute -bottom-1 -right-1 bg-green-500 text-white rounded-full p-1.5 border-2 border-brown-900 shadow-md">
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
              Pastikan posisi wajah dan foto sudah sesuai di tengah lingkaran sebelum menyimpan.
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
