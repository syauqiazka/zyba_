import { SignJWT, jwtVerify } from "jose";

const getSecretKey = () => {
  const secret = process.env.NEXTAUTH_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error("NEXTAUTH_SECRET must be configured with at least 32 characters.");
  }

  return new TextEncoder().encode(secret);
};

export interface SessionPayload {
  userId: string;
  email: string;
  name?: string | null;
  role?: "ADMIN" | "USER";
  onboardingCompleted?: boolean;
}

/**
 * Membuat token session yang ditandatangani (signed JWT) secara aman.
 * Mencegah pemalsuan token cookie dari ID pengguna yang dapat ditebak.
 */
export async function createSessionToken(payload: SessionPayload): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(getSecretKey());
}

/**
 * Memverifikasi integritas dan masa berlaku session token JWT.
 */
export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}
