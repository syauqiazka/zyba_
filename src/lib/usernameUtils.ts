import { accountDb } from "@/backend/db/accountClient";

/**
 * Generate unique username from name
 * Pattern: firstname.lastname or firstname.lastname2, firstname.lastname3, etc.
 */
export async function generateUniqueUsername(name: string): Promise<string> {
  // Clean name: lowercase, remove special chars, split by space
  const cleaned = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove diacritics
    .replace(/[^a-z0-9\s]/g, "")
    .trim();

  const parts = cleaned.split(/\s+/).filter(Boolean);
  
  if (parts.length === 0) {
    // Fallback to random
    return `user${Math.random().toString(36).substring(2, 8)}`;
  }

  const baseUsername = parts.length === 1 
    ? parts[0] 
    : `${parts[0]}.${parts[parts.length - 1]}`;

  // Check if base is available
  const existing = await accountDb.user.findUnique({
    where: { username: baseUsername },
  });

  if (!existing) {
    return baseUsername;
  }

  // Try with numbers 2-999
  for (let i = 2; i < 1000; i++) {
    const candidate = `${baseUsername}${i}`;
    const exists = await accountDb.user.findUnique({
      where: { username: candidate },
    });
    if (!exists) {
      return candidate;
    }
  }

  // Ultimate fallback
  return `${baseUsername}.${Math.random().toString(36).substring(2, 8)}`;
}

/**
 * Assign username to user if they don't have one
 */
export async function ensureUsername(userId: string): Promise<string> {
  const user = await accountDb.user.findUnique({
    where: { id: userId },
    select: { username: true, name: true },
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (user.username) {
    return user.username;
  }

  // Generate and assign
  const newUsername = await generateUniqueUsername(user.name);
  await accountDb.user.update({
    where: { id: userId },
    data: { username: newUsername },
  });

  return newUsername;
}
