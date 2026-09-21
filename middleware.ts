import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/auth";

/** Halaman yang hanya bisa diakses setelah login */
const PROTECTED_PATHS = [
  "/dashboard",
  "/wellness-journey",
  "/mood-check-in",
  "/activity",
  "/companion",
  "/community",
  "/resources",
  "/assessment",
  "/settings",
  "/welcome",
];

/**
 * Halaman yang bisa diakses meskipun sudah login tapi belum selesai assessment.
 * Assessment itu sendiri diizinkan, serta semua API route & halaman publik.
 */
const ASSESSMENT_ALLOWED_PATHS = ["/assessment", "/api/", "/login", "/onboarding", "/"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Izinkan public paths tanpa autentikasi
  if (pathname === "/" || pathname === "/onboarding" || pathname === "/login") {
    return NextResponse.next();
  }

  // Cek apakah path ini perlu proteksi autentikasi
  const isProtected = PROTECTED_PATHS.some((path) => pathname.startsWith(path));

  if (isProtected) {
    const token = request.cookies.get("auth-token");

    if (!token || !token.value) {
      const url = new URL("/login", request.url);
      url.searchParams.set("redirected", "true");
      return NextResponse.redirect(url);
    }

    // Verifikasi JWT
    const session = await verifySessionToken(token.value);
    if (!session) {
      const url = new URL("/login", request.url);
      url.searchParams.set("redirected", "true");
      const response = NextResponse.redirect(url);
      response.cookies.delete("auth-token");
      return response;
    }

    // ⚠️ GATE ASSESSMENT: User yang belum menyelesaikan assessment awal
    // HANYA boleh mengakses /assessment. Semua route lain dialihkan ke /assessment.
    const isOnboardingDone = session.onboardingCompleted === true;
    const isOnAssessment = pathname.startsWith("/assessment");

    if (!isOnboardingDone && !isOnAssessment) {
      return NextResponse.redirect(new URL("/assessment", request.url));
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};