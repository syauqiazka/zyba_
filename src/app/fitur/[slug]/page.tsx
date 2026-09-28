import Link from "next/link";
import { notFound } from "next/navigation";
import {
    ArrowLeft,
    ArrowRight,
    Brain,
    HeartPulse,
    MessageCircle,
    UsersRound,
} from "lucide-react";

const features = {
    companion: {
        title: "Companion",
        headline: "Tempat buat cerita tanpa harus menyusun semuanya dengan sempurna.",
        description:
            "Companion membantu kamu menuangkan apa yang sedang kamu rasakan, memahaminya secara perlahan, lalu menemukan langkah kecil yang bisa dilakukan.",
        icon: MessageCircle,
        loginPath: "/companion",
    },

    "daily-check-in": {
        title: "Daily Check-in",
        headline: "Kenali keadaanmu hari ini, lalu lihat polanya dari waktu ke waktu.",
        description:
            "Daily Check-in membantu kamu mencatat kondisi mental, fisik, dan sosial secara rutin sehingga perubahan kecil tidak mudah terlewat.",
        icon: Brain,
        loginPath: "/assessment/daily",
    },

    activity: {
        title: "Activity",
        headline: "Ubah niat menjadi langkah kecil yang realistis.",
        description:
            "Activity membantu kamu menjalankan kebiasaan sederhana yang sesuai dengan kondisimu, tanpa membuat semuanya terasa berat.",
        icon: HeartPulse,
        loginPath: "/activity",
    },

    community: {
        title: "Community",
        headline: "Tetap terhubung dengan orang lain tanpa kehilangan ruang privatmu.",
        description:
            "Community menjadi ruang untuk berbagi, menemukan pengalaman yang relevan, dan merasa tidak sendirian dalam perjalananmu.",
        icon: UsersRound,
        loginPath: "/community",
    },
} as const;

type Slug = keyof typeof features;

export default async function FeaturePage({
    params,
}: {
    params: { slug: string };
}) {
    const feature = features[params.slug as Slug];

    if (!feature) {
        notFound();
    }

    const Icon = feature.icon;

    return (
        <main className="min-h-screen bg-cream text-brown-900">
            <div className="landing-container py-10 md:py-16">

                <Link
                    href="/#fitur"
                    className="inline-flex items-center gap-2 text-sm text-brown-600 hover:text-brown-900 transition-colors"
                >
                    <ArrowLeft size={16} />
                    Kembali
                </Link>

                <div className="max-w-4xl mx-auto pt-16 md:pt-24">

                    <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center mb-8">
                        <Icon size={26} className="text-orange-500" />
                    </div>

                    <p className="eyebrow mb-4">
                        ZYBA / {feature.title}
                    </p>

                    <h1 className="text-5xl md:text-7xl font-display font-bold leading-[0.95] tracking-tight">
                        {feature.headline}
                    </h1>

                    <p className="mt-8 max-w-2xl text-lg leading-8 text-brown-600">
                        {feature.description}
                    </p>

                    <div className="mt-10 flex flex-wrap gap-4">
                        <Link
                            href={`/login?redirect=${encodeURIComponent(feature.loginPath)}`}
                            className="button-primary inline-flex items-center gap-2"
                        >
                            Mulai dengan {feature.title}
                            <ArrowRight size={18} />
                        </Link>

                        <Link
                            href="/#fitur"
                            className="button-secondary"
                        >
                            Lihat fitur lain
                        </Link>
                    </div>

                </div>
            </div>
        </main>
    );
}