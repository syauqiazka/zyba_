export const DEMO_USER_ID = "user_demo_alex";
export const DEMO_USER_EMAIL = "alex@zyba.app";

export function isDemoAccount(user?: {
  id?: string | null;
  email?: string | null;
} | null): boolean {
  if (!user) return false;

  return (
    user.id === DEMO_USER_ID ||
    user.email?.trim().toLowerCase() === DEMO_USER_EMAIL
  );
}
