import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import { prisma, runWithPrisma } from "@/lib/prisma";

export interface StoredUser {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  avatarUrl?: string | null;
  phone?: string | null;
  location?: string | null;
  bio?: string | null;
  communicationStyle?: "CASUAL" | "FORMAL" | "FUN";
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

// User Repository Operations with transparent database fallback
export const userRepository = {
  async findByEmail(email: string): Promise<StoredUser | null> {
    const normalized = email.toLowerCase().trim();
    // Try Prisma first with fast circuit-breaker timeout
    try {
      const user = await runWithPrisma(() =>
        prisma.user.findUnique({
          where: { email: normalized },
        })
      );
      if (user) {
        return {
          id: user.id,
          email: user.email,
          passwordHash: user.passwordHash,
          name: user.name,
          avatarUrl: user.avatarUrl,
          phone: user.phone,
          location: user.location,
          bio: user.bio,
          communicationStyle: user.communicationStyle as any,
          plan: user.plan as any,
          onboardingCompleted: user.onboardingCompleted,
          zybaScore: user.zybaScore,
          createdAt: user.createdAt.toISOString(),
          updatedAt: user.updatedAt.toISOString(),
        };
      }
    } catch {
      // Fallback
    }

    const localUsers = readLocalUsers();
    return localUsers.find((u) => u.email.toLowerCase() === normalized) || null;
  },

  async findById(id: string): Promise<StoredUser | null> {
    try {
      const user = await runWithPrisma(() =>
        prisma.user.findUnique({
          where: { id },
        })
      );
      if (user) {
        return {
          id: user.id,
          email: user.email,
          passwordHash: user.passwordHash,
          name: user.name,
          avatarUrl: user.avatarUrl,
          phone: user.phone,
          location: user.location,
          bio: user.bio,
          communicationStyle: user.communicationStyle as any,
          plan: user.plan as any,
          onboardingCompleted: user.onboardingCompleted,
          zybaScore: user.zybaScore,
          createdAt: user.createdAt.toISOString(),
          updatedAt: user.updatedAt.toISOString(),
        };
      }
    } catch {
      // Local fallback
    }

    const localUsers = readLocalUsers();
    return localUsers.find((u) => u.id === id) || null;
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

    // Pastikan tidak ada duplikasi email
    const existing = await this.findByEmail(normalized);
    if (existing) {
      throw new Error(`Email ${normalized} sudah terdaftar.`);
    }

    const id = `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();

    const newUser: StoredUser = {
      id,
      email: normalized,
      passwordHash: data.passwordHash,
      name: data.name,
      avatarUrl: data.avatarUrl || "🦊",
      communicationStyle: "FORMAL",
      plan: "FREE",
      onboardingCompleted: data.onboardingCompleted ?? false,
      zybaScore: data.zybaScore ?? null,
      stressLevel: 2,
      streak: 1,
      createdAt: now,
      updatedAt: now,
    };

    // Try Prisma with circuit breaker
    try {
      const created = await runWithPrisma(() =>
        prisma.user.create({
          data: {
            email: normalized,
            name: data.name,
            passwordHash: data.passwordHash,
            avatarUrl: data.avatarUrl || "🦊",
            onboardingCompleted: data.onboardingCompleted ?? false,
            zybaScore: data.zybaScore,
          },
        })
      );
      if (created) {
        return {
          id: created.id,
          email: created.email,
          passwordHash: created.passwordHash,
          name: created.name,
          avatarUrl: created.avatarUrl,
          onboardingCompleted: created.onboardingCompleted,
          zybaScore: created.zybaScore,
          createdAt: created.createdAt.toISOString(),
          updatedAt: created.updatedAt.toISOString(),
        };
      }
    } catch {
      // Local fallback
    }

    const users = readLocalUsers();
    const existingIdx = users.findIndex((u) => u.email.toLowerCase() === normalized);
    if (existingIdx !== -1) {
      users[existingIdx] = newUser;
    } else {
      users.push(newUser);
    }
    writeLocalUsers(users);
    return newUser;
  },

  async update(
    idOrEmail: string,
    data: Partial<Omit<StoredUser, "id" | "email" | "createdAt">>
  ): Promise<StoredUser | null> {
    const now = new Date().toISOString();

    // Try Prisma with circuit breaker
    try {
      const updated = await runWithPrisma(() =>
        prisma.user.update({
          where: idOrEmail.includes("@") ? { email: idOrEmail } : { id: idOrEmail },
          data: {
            name: data.name,
            avatarUrl: data.avatarUrl,
            communicationStyle: data.communicationStyle,
            onboardingCompleted: data.onboardingCompleted,
            zybaScore: data.zybaScore,
            passwordHash: data.passwordHash,
          },
        })
      );
      if (updated) {
        return {
          id: updated.id,
          email: updated.email,
          passwordHash: updated.passwordHash,
          name: updated.name,
          avatarUrl: updated.avatarUrl,
          onboardingCompleted: updated.onboardingCompleted,
          zybaScore: updated.zybaScore,
          createdAt: updated.createdAt.toISOString(),
          updatedAt: updated.updatedAt.toISOString(),
        };
      }
    } catch {
      // Local fallback
    }

    const users = readLocalUsers();
    const idx = users.findIndex(
      (u) => u.id === idOrEmail || u.email.toLowerCase() === idOrEmail.toLowerCase()
    );
    if (idx === -1) return null;

    users[idx] = {
      ...users[idx],
      ...data,
      updatedAt: now,
    };
    writeLocalUsers(users);
    return users[idx];
  },

  async saveAssessment(
    userId: string,
    assessmentData: any,
    calculatedScore: number,
    stressLevel: number
  ): Promise<StoredAssessment> {
    const now = new Date().toISOString();
    const assessmentId = `asm_${Date.now()}`;

    // Update user's zybaScore & stressLevel
    await this.update(userId, {
      zybaScore: calculatedScore,
      stressLevel,
      onboardingCompleted: true,
    });

    const newAssessment: StoredAssessment = {
      id: assessmentId,
      userId,
      ...assessmentData,
      calculatedScore,
      createdAt: now,
    };

    // Try Prisma with circuit breaker
    try {
      await runWithPrisma(() =>
        prisma.assessment.upsert({
          where: { userId },
          create: {
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
          },
          update: {
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
          },
        })
      );
    } catch {
      // Local fallback
    }

    const assessments = readLocalAssessments();
    const existingIdx = assessments.findIndex((a) => a.userId === userId);
    if (existingIdx !== -1) {
      assessments[existingIdx] = newAssessment;
    } else {
      assessments.push(newAssessment);
    }
    writeLocalAssessments(assessments);

    return newAssessment;
  },

  async getLatestAssessment(userId: string): Promise<StoredAssessment | null> {
    const assessments = readLocalAssessments();
    return assessments.find((a) => a.userId === userId) || null;
  },
};
