import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import { accountDb } from "@/backend/db/accountClient";

export interface StoredUser {
  id: string;
  email: string;
  username?: string | null;
  passwordHash: string;
  name: string;
  avatarUrl?: string | null;
  phone?: string | null;
  location?: string | null;
  bio?: string | null;
  communicationStyle?: string; // legacy, mapped from companionPersona
  plan?: "FREE" | "PLUS";
  onboardingCompleted: boolean;
  zybaScore?: number | null;
  stressLevel?: number | null;
  streak?: number;
  createdAt: string;
  updatedAt: string;
}

export interface StoredAssessment {
  id: string;
  userId: string;
  goal?: string;
  gender?: string;
  age?: number;
  weightKg?: number;
  initialMood?: string;
  soughtHelpBefore?: boolean;
  physicalSymptoms?: string[];
  sleepQualityRating?: number;
  stressLevel?: number;
  medications?: string;
  mentalHealthSymptoms?: string[];
  expressionText?: string;
  calculatedScore: number;
  createdAt: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");
const ASSESSMENTS_FILE = path.join(DATA_DIR, "assessments.json");

/** Compute streak in days from a given ISO date string (since account was created / last activity) */
export function computeStreak(createdAtIso: string): number {
  try {
    const created = new Date(createdAtIso);
    const now = new Date();
    const diffMs = now.getTime() - created.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    return Math.max(1, diffDays + 1);
  } catch {
    return 1;
  }
}

// Ensure data folder and file exist
function ensureFiles() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(USERS_FILE)) {
    // Seed default demo user
    const defaultPasswordHash = bcrypt.hashSync("demo_password", 12);
    const initialUsers: StoredUser[] = [
      {
        id: "user_demo_alex",
        email: "alex@zyba.app",
        passwordHash: defaultPasswordHash,
        name: "Alex Rivera",
        avatarUrl: "fox_face",
        communicationStyle: "FORMAL",
        plan: "FREE",
        onboardingCompleted: true,
        zybaScore: 80,
        stressLevel: 2,
        streak: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
    fs.writeFileSync(USERS_FILE, JSON.stringify(initialUsers, null, 2), { encoding: "utf8" });
  }
  if (!fs.existsSync(ASSESSMENTS_FILE)) {
    fs.writeFileSync(ASSESSMENTS_FILE, JSON.stringify([], null, 2), { encoding: "utf8" });
  }
}

function readLocalUsers(): StoredUser[] {
  ensureFiles();
  try {
    const raw = fs.readFileSync(USERS_FILE, { encoding: "utf8" });
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeLocalUsers(users: StoredUser[]): void {
  ensureFiles();
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), { encoding: "utf8" });
}

function readLocalAssessments(): StoredAssessment[] {
  ensureFiles();
  try {
    const raw = fs.readFileSync(ASSESSMENTS_FILE, { encoding: "utf8" });
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeLocalAssessments(assessments: StoredAssessment[]): void {
  ensureFiles();
  fs.writeFileSync(ASSESSMENTS_FILE, JSON.stringify(assessments, null, 2), { encoding: "utf8" });
}

// ── Helper: convert Prisma user row → StoredUser ────────────────────────────
function dbToStored(user: any): StoredUser {
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    passwordHash: user.passwordHash,
    name: user.name,
    avatarUrl: user.avatarUrl,
    phone: user.phone,
    location: user.location,
    bio: user.bio,
    communicationStyle: user.companionPersona as any,
    plan: user.plan as any,
    onboardingCompleted: user.onboardingCompleted,
    zybaScore: user.zybaScore,
    stressLevel: user.stressLevel,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}

export const userRepository = {
  async findByEmail(email: string): Promise<StoredUser | null> {
    const normalized = email.toLowerCase().trim();
    try {
      const user = await accountDb.user.findUnique({ where: { email: normalized } });
      if (user) return dbToStored(user);
    } catch (e: any) {
      console.warn("[userRepo] DB findByEmail failed, checking local fallback:", e.message);
    }

    // Check local fallback
    try {
      const localUsers = readLocalUsers();
      const found = localUsers.find((u) => u.email.toLowerCase() === normalized);
      if (found) return found;
    } catch (fsErr) {
      console.error("[userRepo] local read failed:", fsErr);
    }

    // Default demo fallback for alex@zyba.app
    if (normalized === "alex@zyba.app" || normalized === "alex.rivera@gmail.com") {
      return {
        id: "user_demo_alex",
        email: normalized,
        passwordHash: bcrypt.hashSync("demo_password", 12),
        name: "Alex Rivera",
        avatarUrl: "fox_face",
        communicationStyle: "FORMAL",
        plan: "FREE",
        onboardingCompleted: true,
        zybaScore: 80,
        stressLevel: 2,
        streak: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }

    return null;
  },

  async findById(id: string): Promise<StoredUser | null> {
    try {
      const user = await accountDb.user.findUnique({ where: { id } });
      if (user) return dbToStored(user);
    } catch (e: any) {
      console.warn("[userRepo] DB findById failed, checking local fallback:", e.message);
    }

    try {
      const localUsers = readLocalUsers();
      const found = localUsers.find((u) => u.id === id);
      if (found) return found;
    } catch {}

    if (id === "user_demo_alex") {
      return {
        id: "user_demo_alex",
        email: "alex@zyba.app",
        passwordHash: bcrypt.hashSync("demo_password", 12),
        name: "Alex Rivera",
        avatarUrl: "fox_face",
        communicationStyle: "FORMAL",
        plan: "FREE",
        onboardingCompleted: true,
        zybaScore: 80,
        stressLevel: 2,
        streak: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }

    return null;
  },

  async create(data: {
    email: string;
    passwordHash: string;
    name: string;
    avatarUrl?: string;
    onboardingCompleted?: boolean;
    zybaScore?: number;
  }): Promise<StoredUser> {
    const normalized = data.email.toLowerCase().trim();
    const existing = await this.findByEmail(normalized);
    if (existing) throw new Error(`Email ${normalized} sudah terdaftar.`);

    try {
      const created = await accountDb.user.create({
        data: {
          email: normalized,
          name: data.name,
          passwordHash: data.passwordHash,
          avatarUrl: data.avatarUrl || "fox",
          onboardingCompleted: data.onboardingCompleted ?? false,
          zybaScore: data.zybaScore,
        },
      });
      return dbToStored(created);
    } catch (dbErr: any) {
      console.warn("[userRepo] DB create failed, saving to local fallback:", dbErr.message);
      const newUser: StoredUser = {
        id: `user_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        email: normalized,
        name: data.name,
        passwordHash: data.passwordHash,
        avatarUrl: data.avatarUrl || "fox",
        onboardingCompleted: data.onboardingCompleted ?? false,
        zybaScore: data.zybaScore ?? null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      try {
        const users = readLocalUsers();
        users.push(newUser);
        writeLocalUsers(users);
      } catch {}
      return newUser;
    }
  },

  /**
   * Ensures a user exists in the PostgreSQL database.
   * Handles local-fallback users, migrated users, or when switching to a fresh database.
   * If the user doesn't exist in DB, it auto-creates the user row so Foreign Key
   * constraints (daily_assessments, mood, etc.) NEVER fail.
   */
  async ensureUserExistsInNeon(
    userId: string,
    emailHint?: string,
    nameHint?: string
  ): Promise<{ neonId: string } | null> {
    // 1. Check if user already exists in DB by ID
    try {
      const existing = await accountDb.user.findUnique({
        where: { id: userId },
        select: { id: true, email: true },
      });
      if (existing) {
        return { neonId: existing.id };
      }
    } catch (e: any) {
      console.warn("[userRepo] DB check by id failed:", e.message);
    }

    // 2. Not found in DB by ID. Check if we have an email from hint or local fallback
    const localUser = await this.findById(userId);
    const candidateEmail = (emailHint || localUser?.email || "").toLowerCase().trim();

    if (candidateEmail) {
      try {
        const existingByEmail = await accountDb.user.findUnique({
          where: { email: candidateEmail },
          select: { id: true, email: true },
        });

        if (existingByEmail) {
          // Found by email in DB! Sync local record to this DB id if present
          try {
            const users = readLocalUsers();
            const idx = users.findIndex(
              (u) => u.id === userId || u.email.toLowerCase() === candidateEmail
            );
            if (idx !== -1) {
              users[idx].id = existingByEmail.id;
              writeLocalUsers(users);
            }
          } catch {}
          return { neonId: existingByEmail.id };
        }
      } catch (e: any) {
        console.warn("[userRepo] DB check by email failed:", e.message);
      }
    }

    // 3. User does NOT exist in DB at all (fresh DB, reset, or local fallback).
    // Auto-create user in DB now so foreign key constraints never fail!
    const effectiveEmail = candidateEmail || `${userId}@zyba.app`;
    const effectiveName = nameHint || localUser?.name || "Pengguna ZYBA";
    const effectivePass = localUser?.passwordHash || bcrypt.hashSync("zyba_session_fallback", 10);

    try {
      const created = await accountDb.user.create({
        data: {
          id: userId,
          email: effectiveEmail,
          name: effectiveName,
          passwordHash: effectivePass,
          avatarUrl: localUser?.avatarUrl || "fox",
          bio: localUser?.bio || undefined,
          phone: localUser?.phone || undefined,
          username: localUser?.username || undefined,
          onboardingCompleted: localUser?.onboardingCompleted ?? true,
          zybaScore: localUser?.zybaScore || 80,
          stressLevel: localUser?.stressLevel || 2,
        },
      });
      console.log(`[userRepo] Auto-created user in DB: ${created.id} (${created.email})`);

      try {
        const users = readLocalUsers();
        const idx = users.findIndex((u) => u.id === userId);
        if (idx !== -1) {
          users[idx].id = created.id;
          writeLocalUsers(users);
        }
      } catch {}

      return { neonId: created.id };
    } catch (createErr: any) {
      console.error("[userRepo] DB user auto-creation failed:", createErr.message);

      // If race condition or duplicate email/id conflict, retry lookup
      try {
        if (effectiveEmail) {
          const userByEmail = await accountDb.user.findUnique({
            where: { email: effectiveEmail },
            select: { id: true },
          });
          if (userByEmail) return { neonId: userByEmail.id };
        }
        const userById = await accountDb.user.findUnique({
          where: { id: userId },
          select: { id: true },
        });
        if (userById) return { neonId: userById.id };
      } catch {}

      return null;
    }
  },

  async update(
    idOrEmail: string,
    data: Partial<Omit<StoredUser, "id" | "email" | "createdAt">>
  ): Promise<StoredUser | null> {
    try {
      const updated = await accountDb.user.update({
        where: idOrEmail.includes("@") ? { email: idOrEmail } : { id: idOrEmail },
        data: {
          name: data.name ?? undefined,
          avatarUrl: data.avatarUrl ?? undefined,
          companionPersona: (data.communicationStyle as any) ?? undefined,
          onboardingCompleted: data.onboardingCompleted ?? undefined,
          zybaScore: data.zybaScore ?? undefined,
          stressLevel: data.stressLevel ?? undefined,
          passwordHash: data.passwordHash ?? undefined,
          phone: data.phone ?? undefined,
          location: data.location ?? undefined,
          bio: data.bio ?? undefined,
        },
      });
      return dbToStored(updated);
    } catch (e: any) {
      console.warn("[userRepo] DB update failed, updating local fallback:", e.message);
      try {
        const users = readLocalUsers();
        const idx = users.findIndex(
          (u) => u.id === idOrEmail || u.email.toLowerCase() === idOrEmail.toLowerCase()
        );
        if (idx !== -1) {
          users[idx] = { ...users[idx], ...data, updatedAt: new Date().toISOString() };
          writeLocalUsers(users);
          return users[idx];
        }
      } catch {}
      return null;
    }
  },

  async saveAssessment(
    userId: string,
    assessmentData: any,
    calculatedScore: number,
    stressLevel: number
  ): Promise<StoredAssessment> {
    await this.update(userId, { zybaScore: calculatedScore, stressLevel, onboardingCompleted: true });

    const asmData = {
      userId,
      goal: assessmentData.goal,
      gender: assessmentData.gender,
      age: assessmentData.age ? Number(assessmentData.age) : undefined,
      weightKg: assessmentData.weight ? Number(assessmentData.weight) : undefined,
      initialMood: assessmentData.mood,
      soughtHelpBefore: assessmentData.soughtHelp,
      physicalSymptoms: assessmentData.physicalSymptoms || [],
      sleepQualityRating: assessmentData.sleepRating ? Number(assessmentData.sleepRating) : undefined,
      stressLevel: Number(stressLevel),
      medications: assessmentData.medications,
      mentalHealthSymptoms: assessmentData.mentalSymptoms || [],
      expressionText: assessmentData.expressionText,
    };

    const saved = await accountDb.assessment.upsert({
      where: { userId },
      create: asmData,
      update: asmData,
    });

    return {
      id: saved.id,
      userId: saved.userId,
      ...assessmentData,
      calculatedScore,
      createdAt: saved.createdAt.toISOString(),
    };
  },

  async getLatestAssessment(userId: string): Promise<StoredAssessment | null> {
    try {
      const a = await accountDb.assessment.findUnique({ where: { userId } });
      if (!a) return null;
      return { id: a.id, userId: a.userId, calculatedScore: a.stressLevel ?? 0, createdAt: a.createdAt.toISOString() };
    } catch { return null; }
  },
};
