import type { Metadata } from "next";
import ClientLayout from "./ClientLayout";
import "./globals.css";

export const metadata: Metadata = {
  title: "ZYBA — Gen Z Wellness Support",
  description:
    "Pendamping kesehatan mental, fisik, dan sosial berbasis AI untuk Gen Z.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}