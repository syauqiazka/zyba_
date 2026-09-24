"use client";

import React, {
    useEffect,
    useId,
    useState,
    type ChangeEvent,
    type KeyboardEvent,
    type PointerEvent,
} from "react";

/**
 * Hue:
 * 0   = merah
 * 60  = kuning
 * 120 = hijau
 *
 * inverted = true:
 * nilai tinggi dianggap negatif
 * (contoh: stres dan kecemasan)
 */
export function scoreHue(
    value: number,
    min = 1,
    max = 5,
    inverted = false
): number {
    if (max <= min) return 60;

    const clamped = Math.min(max, Math.max(min, value));
    const t = (clamped - min) / (max - min);

    return Math.round((inverted ? 1 - t : t) * 120);
}

export function scoreColor(
    value: number,
    min = 1,
    max = 5,
    inverted = false
): string {
    return `hsl(${scoreHue(value, min, max, inverted)} 70% 42%)`;
}

/**
 * Warna teks badge dibuat lebih gelap
 * agar tetap mudah dibaca.
 */
export function scoreText(
    value: number,
    min = 1,
    max = 5,
    inverted = false
): string {
    return `hsl(${scoreHue(value, min, max, inverted)} 75% 28%)`;
}

/**
 * Background transparan untuk badge.
 */
export function scoreTint(
    value: number,
    min = 1,
    max = 5,
    inverted = false
): string {
    return `hsl(${scoreHue(value, min, max, inverted)} 70% 42% / 0.15)`;
}

interface ScoreSliderProps {
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    inverted?: boolean;
    ariaLabel?: string;
}

const THUMB = 22;

export default function ScoreSlider({
    value,
    onChange,
    min = 1,
    max = 5,
    inverted = false,
    ariaLabel = "Score",
}: ScoreSliderProps) {
    const [display, setDisplay] = useState(value);
    const [dragging, setDragging] = useState(false);

    const inputId = useId();

    /**
     * Pastikan display selalu berada di dalam range.
     */
    const clamp = (num: number) =>
        Math.min(max, Math.max(min, num));

    /**
     * Sinkronisasi dengan parent.
     * Ketika sedang drag, jangan paksa display berubah.
     */
    useEffect(() => {
        if (!dragging) {
            setDisplay(clamp(value));
        }
    }, [value, dragging, min, max]);

    /**
     * Posisi visual thumb.
     *
     * Dibatasi agar thumb tidak keluar dari ujung slider.
     */
    const safeDisplay = clamp(display);

    const range = max - min;
    const t = range > 0 ? (safeDisplay - min) / range : 0;

    const pos = `calc(
    ${THUMB / 2}px +
    (100% - ${THUMB}px) * ${t}
  )`;

    const color = scoreColor(
        safeDisplay,
        min,
        max,
        inverted
    );

    /**
     * Saat drag:
     * - hanya animasikan warna
     * - posisi mengikuti pointer secara langsung
     *
     * Saat tidak drag:
     * - posisi dan warna dianimasikan.
     */
    const transition = dragging
        ? "background-color 120ms linear"
        : "left 250ms ease, width 250ms ease, background-color 250ms ease";

    const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
        const next = clamp(Number(e.target.value));

        if (!Number.isFinite(next)) return;

        setDisplay(next);

        const rounded = Math.round(next);

        if (rounded !== value) {
            onChange(rounded);
        }
    };

    const startDragging = (
        e: PointerEvent<HTMLInputElement>
    ) => {
        setDragging(true);

        /**
         * Menjaga pointer tetap ditangkap walaupun
         * pointer bergerak sedikit keluar dari input.
         */
        try {
            e.currentTarget.setPointerCapture(e.pointerId);
        } catch {
            // Tidak semua browser mendukung pointer capture.
        }
    };

    const finishDragging = () => {
        setDragging(false);

        setDisplay((current) => {
            const rounded = Math.round(clamp(current));

            if (rounded !== value) {
                onChange(rounded);
            }

            return rounded;
        });
    };

    const handleKeyDown = (
        e: KeyboardEvent<HTMLInputElement>
    ) => {
        let delta = 0;

        switch (e.key) {
            case "ArrowRight":
            case "ArrowUp":
                delta = 1;
                break;

            case "ArrowLeft":
            case "ArrowDown":
                delta = -1;
                break;

            case "Home":
                e.preventDefault();
                onChange(min);
                setDisplay(min);
                return;

            case "End":
                e.preventDefault();
                onChange(max);
                setDisplay(max);
                return;

            default:
                return;
        }

        e.preventDefault();

        const next = clamp(value + delta);

        setDisplay(next);

        if (next !== value) {
            onChange(next);
        }
    };

    return (
        <div
            className="relative h-8 w-full select-none touch-none"
            role="presentation"
        >
            {/* Track */}
            <div
                className="
          absolute
          left-0
          right-0
          top-1/2
          h-2
          -translate-y-1/2
          rounded-full
          bg-brown-900/15
        "
            />

            {/* Fill */}
            <div
                className="
          absolute
          left-0
          top-1/2
          h-2
          -translate-y-1/2
          rounded-full
        "
                style={{
                    width: pos,
                    backgroundColor: color,
                    transition,
                }}
                aria-hidden="true"
            />

            {/* Custom Thumb */}
            <div
                className="
          pointer-events-none
          absolute
          top-1/2
          rounded-full
          bg-white
          shadow-md
        "
                style={{
                    width: THUMB,
                    height: THUMB,
                    left: pos,
                    transform: "translate(-50%, -50%)",
                    border: `4px solid ${color}`,
                    transition,
                }}
                aria-hidden="true"
            />

            {/* Native Range Input */}
            <input
                id={inputId}
                type="range"
                min={min}
                max={max}
                step={0.01}
                value={safeDisplay}
                aria-label={ariaLabel}
                aria-valuemin={min}
                aria-valuemax={max}
                aria-valuenow={Math.round(safeDisplay)}
                aria-valuetext={`${Math.round(safeDisplay)} dari ${max}`}
                onChange={handleInput}
                onPointerDown={startDragging}
                onPointerUp={finishDragging}
                onPointerCancel={finishDragging}
                onLostPointerCapture={finishDragging}
                onBlur={finishDragging}
                onKeyDown={handleKeyDown}
                className="
          absolute
          inset-0
          h-full
          w-full
          cursor-pointer
          opacity-0
          appearance-none
        "
            />
        </div>
    );
}