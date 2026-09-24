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
      return null;
    } catch (e: any) {
      console.error("[userRepo] findByEmail:", e.message);
      throw e; // Re-throw supaya caller tahu ada DB error, bukan return null
    }
  },

  async findById(id: string): Promise<StoredUser | null> {
    try {
      const user = await accountDb.user.findUnique({ where: { id } });
      if (user) return dbToStored(user);
      return null;
    } catch (e: any) {
      console.error("[userRepo] findById:", e.message);
      throw e;
    }
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
          companionPersona: data.communicationStyle as any ?? undefined,
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
    } catch (e) { console.error("[userRepo] update:", e); return null; }
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
