import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpen, Clock, Headphones, Music } from "lucide-react";
import { accountDb } from "@/backend/db/accountClient";
import { getResourceSlug, getResourceDescription } from "@/lib/resourceSlug";

export const dynamic = "force-dynamic";

type ResourcePageProps = {
  params: {
    slug: string;
  };
};

async function getResource(slug: string) {
  const resources = await accountDb.resource.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    resources.find(
      (resource) => getResourceSlug(resource.title) === slug
    ) ?? null
  );
}

export async function generateMetadata({
  params,
}: ResourcePageProps): Promise<Metadata> {
  const resource = await getResource(params.slug);

  if (!resource) {
    return {
      title: "Resource Tidak Ditemukan",
      robots: {
        index: false,
        follow: true,
      },
    };
  }

  const description = getResourceDescription(
    resource.body,
    `${resource.title} — sumber daya wellness dan kesehatan mental dari ZYBA.`
  );

  const slug = getResourceSlug(resource.title);

return {
  title: resource.title,
  description,
  robots: resource.isPro
    ? {
        index: false,
        follow: true,
      }
    : {
        index: true,
        follow: true,
      },
  alternates: {
    canonical: `/resources/${slug}`,
  },
    openGraph: {
      type: resource.type === "ARTICLE" ? "article" : "website",
      title: resource.title,
      description,
      url: `/resources/${slug}`,
      siteName: "ZYBA",
    },
    twitter: {
      card: "summary",
      title: resource.title,
      description,
    },
  };
}

function getTypeLabel(type: string) {
  if (type === "COURSE") return "Kursus Audio";
  if (type === "AUDIO") return "Audio Ambient";
  return "Artikel Edukasi";
}

function getTypeIcon(type: string) {
  if (type === "COURSE") return <Headphones className="w-5 h-5" />;
  if (type === "AUDIO") return <Music className="w-5 h-5" />;
  return <BookOpen className="w-5 h-5" />;
}

function escapeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export default async function ResourceDetailPage({
  params,
}: ResourcePageProps) {
  const resource = await getResource(params.slug);

  if (!resource) {
    notFound();
  }

  const description = getResourceDescription(
    resource.body,
    `${resource.title} — sumber daya wellness dan kesehatan mental dari ZYBA.`
  );

  const paragraphs = resource.body
    ? resource.body
        .split(/\n\s*\n/)
        .map((paragraph) => paragraph.trim())
        .filter(Boolean)
    : [];

  const slug = getResourceSlug(resource.title);
  const resourceUrl = `https://jhic.zyba.my.id/resources/${slug}`;

  const jsonLd =
    resource.type === "ARTICLE"
      ? {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: resource.title,
          description,
          author: resource.author
            ? {
                "@type": "Person",
                name: resource.author,
              }
            : {
                "@type": "Organization",
                name: "ZYBA",
              },
          publisher: {
            "@type": "Organization",
            name: "ZYBA",
            url: "https://jhic.zyba.my.id",
          },
          datePublished: resource.createdAt.toISOString(),
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": resourceUrl,
          },
        }
      : {
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: resource.title,
          description,
          url: resourceUrl,
        };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: escapeJsonLd(jsonLd),
        }}
      />

      <article className="max-w-4xl mx-auto pb-16">
        <Link
          href="/resources"
          className="inline-flex items-center gap-2 text-sm font-semibold text-brown-700 hover:text-orange-500 transition-colors mb-6"
        >
          <ArrowLeft size={16} />
          Kembali ke Sumber Daya
        </Link>

        <header className="glass-card rounded-3xl p-6 sm:p-8 md:p-10 border border-brown-900/10 bg-white shadow-sm">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-100 text-green-700 text-xs font-bold">
              {getTypeIcon(resource.type)}
              {getTypeLabel(resource.type)}
            </span>

            {resource.durationMin ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-brown-700">
                <Clock size={14} />
                {resource.durationMin} menit
              </span>
            ) : null}

            {resource.isPro ? (
              <span className="px-3 py-1.5 rounded-full bg-orange-500 text-white text-xs font-bold">
                PRO
              </span>
            ) : null}
          </div>

          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-brown-900 leading-tight">
            {resource.title}
          </h1>

          {resource.author ? (
            <p className="mt-4 text-sm text-brown-700">
              Oleh{" "}
              <span className="font-semibold text-brown-900">
                {resource.author}
              </span>
            </p>
          ) : null}
        </header>

{resource.isPro ? (
  <div className="mt-6 glass-card rounded-3xl p-6 sm:p-8 md:p-10 border border-orange-500/20 bg-orange-50/40 text-center">
    <div className="inline-flex items-center justify-center px-3 py-1.5 rounded-full bg-orange-500 text-white text-xs font-bold mb-4">
      ZYBA PLUS
    </div>

    <h2 className="font-display text-xl sm:text-2xl font-extrabold text-brown-900">
      Konten Premium ZYBA
    </h2>

    <p className="mt-2 text-sm sm:text-base text-brown-700 leading-7 max-w-xl mx-auto">
      Resource ini tersedia untuk pengguna ZYBA Plus. Upgrade untuk mengakses
      materi edukasi lengkap.
    </p>

    <Link
      href="/resources"
      className="inline-flex items-center justify-center mt-5 min-h-[44px] px-6 rounded-full bg-brown-900 text-white text-sm font-bold hover:bg-orange-500 transition-colors"
    >
      Kembali ke Sumber Daya
    </Link>
  </div>
) : (
  <div className="mt-6 glass-card rounded-3xl p-6 sm:p-8 md:p-10 border border-brown-900/10 bg-white">
    {paragraphs.length > 0 ? (
      <div className="space-y-5">
        {paragraphs.map((paragraph, index) => (
          <p
            key={index}
            className="text-base sm:text-lg text-brown-800 leading-8"
          >
            {paragraph}
          </p>
        ))}
      </div>
    ) : (
      <p className="text-base text-brown-700 leading-7">
        {description}
      </p>
    )}
  </div>
)}
      </article>
    </>
  );
}