import type { Metadata } from "next";
import { DM_Sans, Manrope } from "next/font/google";
import ClientLayout from "./ClientLayout";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
});

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://jhic.zyba.my.id";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "ZYBA — Gen Z Wellness Support",
    template: "%s | ZYBA",
  },

  description:
    "Pendamping kesehatan mental, fisik, dan sosial berbasis AI untuk Gen Z.",

  applicationName: "ZYBA",

  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "ZYBA",
    title: "ZYBA — Gen Z Wellness Support",
    description:
      "Pendamping kesehatan mental, fisik, dan sosial berbasis AI untuk Gen Z.",
  },

  twitter: {
    card: "summary",
    title: "ZYBA — Gen Z Wellness Support",
    description:
      "Pendamping kesehatan mental, fisik, dan sosial berbasis AI untuk Gen Z.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${dmSans.variable} ${manrope.variable}`}
    >
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
