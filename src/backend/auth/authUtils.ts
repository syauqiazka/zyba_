import { SignJWT, jwtVerify } from "jose";

const getSecretKey = () => {
  const secret = process.env.NEXTAUTH_SECRET || "zyba-wellness-secure-secret-token-key-2024";
  return new TextEncoder().encode(secret);
};

export interface SessionPayload {
  userId: string;
  email: string;
  name?: string | null;
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
