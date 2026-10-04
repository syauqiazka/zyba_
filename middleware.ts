import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/auth";

/** Halaman yang hanya bisa diakses setelah login */
const PROTECTED_PATHS = [
  "/dashboard",
  "/wellness-journey",
  "/daily-assessment",
  "/mood-check-in",
  "/activity",
  "/companion",
  "/community",
  "/resources",
  "/assessment",
  "/settings",
  "/welcome",
  "/achievements",
  "/pencapaian",
];

/**
 * Halaman yang bisa diakses meskipun sudah login tapi belum selesai assessment.
 * Assessment itu sendiri diizinkan, serta semua API route & halaman publik.
 */
const ASSESSMENT_ALLOWED_PATHS = ["/assessment", "/api/", "/login", "/onboarding", "/"];

function getRedirectUrl(path: string, request: NextRequest): URL {
  const fwdHost = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  const fwdProto = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim() || "https";

  if (fwdHost && !fwdHost.includes("localhost") && !fwdHost.startsWith("127.")) {
    return new URL(path, `${fwdProto}://${fwdHost}`);
  }

  const host = request.headers.get("host")?.split(",")[0]?.trim();
  if (host && host.includes("zyba.my.id")) {
    return new URL(path, `https://${host}`);
  }

  const envBase = (
    process.env.NEXTAUTH_URL ||
    process.env.NEXT_PUBLIC_BASE_URL ||
    ""
  ).replace(/\/$/, "");

  if (envBase && !envBase.includes("localhost") && !envBase.startsWith("http://127.")) {
    return new URL(path, envBase);
  }

  if (
    process.env.NODE_ENV === "production" ||
    request.nextUrl.port === "30000" ||
    request.nextUrl.host.includes("30000")
  ) {
    return new URL(path, "https://jhic.zyba.my.id");
  }

  return new URL(path, request.url);
}

function buildAuthRedirect(request: NextRequest, protectedPath: string) {
  const url = getRedirectUrl("/login", request);
  url.searchParams.set("redirected", "true");
  url.searchParams.set("redirect", protectedPath);
  return url;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // API tidak membutuhkan page-level auth redirect di middleware.
  // Route API tetap melakukan autentikasi/otorisasi masing-masing.
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // Izinkan public paths & uploaded media tanpa autentikasi
  if (
    pathname === "/" ||
    pathname === "/onboarding" ||
    pathname === "/login" ||
    pathname.startsWith("/uploads/")
  ) {
    return NextResponse.next();
  }

  // Cek apakah path ini perlu proteksi autentikasi
  const isProtected = PROTECTED_PATHS.some((path) => pathname.startsWith(path));

  if (isProtected) {
    const token = request.cookies.get("auth-token");

    if (!token || !token.value) {
      return NextResponse.redirect(buildAuthRedirect(request, pathname));
    }

    // Verifikasi JWT
    const session = await verifySessionToken(token.value);
    if (!session) {
      const response = NextResponse.redirect(buildAuthRedirect(request, pathname));
      response.cookies.delete("auth-token");
      return response;
    }

    const isOnboardingDone = session.onboardingCompleted === true;
    const isOnAssessment = pathname.startsWith("/assessment");

    // ⚠️ GATE ASSESSMENT:
    // 1. User yang belum menyelesaikan assessment awal HANYA boleh mengakses /assessment.
    // 2. User yang SUDAH menyelesaikan assessment dilarang membuka /assessment lagi (dialihkan ke /dashboard).

    if (!isOnboardingDone && !isOnAssessment) {
      return NextResponse.redirect(getRedirectUrl("/assessment", request));
    }

    if (isOnboardingDone && isOnAssessment) {
      return NextResponse.redirect(getRedirectUrl("/dashboard", request));
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
