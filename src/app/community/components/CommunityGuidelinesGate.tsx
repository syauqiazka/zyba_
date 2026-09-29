"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CommunityGuidelinesModal from "./GuidelinesModal";

const CURRENT_VERSION = "1.0";

export default function CommunityGuidelinesGate({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [accepted, setAccepted] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        let mounted = true;

        async function checkGuidelines() {
            try {
                const res = await fetch(
                    "/api/community/guidelines",
                    {
                        cache: "no-store",
                    }
                );

                if (res.status === 401) {
                    router.replace("/login");
                    return;
                }

                if (!res.ok) {
                    throw new Error(
                        "Gagal mengecek Community Guidelines"
                    );
                }

                const data = await res.json();

                if (!mounted) return;

                const isAccepted =
                    data.accepted === true &&
                    data.version === CURRENT_VERSION;

                setAccepted(isAccepted);
            } catch (error) {
                console.error(
                    "Community Guidelines check error:",
                    error
                );
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        }

        checkGuidelines();

        return () => {
            mounted = false;
        };
    }, [router]);

    const handleAccept = async () => {
        if (saving) return;

        setSaving(true);

        try {
            const res = await fetch(
                "/api/community/guidelines",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    cache: "no-store",
                }
            );

            if (!res.ok) {
                const data = await res.json().catch(() => null);

                throw new Error(
                    data?.error ||
                    "Gagal menyimpan persetujuan."
                );
            }

            setAccepted(true);
        } catch (error) {
            console.error(
                "Community Guidelines accept error:",
                error
            );

            alert(
                "Persetujuan belum berhasil disimpan. Silakan coba lagi."
            );
        } finally {
            setSaving(false);
        }
    };

    // Jangan tampilkan Community sebelum status
    // Guidelines selesai dicek.
    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-cream">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-brown-900/10 border-t-brown-900" />

                    <p className="text-xs font-medium text-brown-700/60">
                        Menyiapkan Community...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <>
            {children}

            <CommunityGuidelinesModal
                open={!accepted}
                onAccept={handleAccept}
                loading={saving}
            />
        </>
    );
}