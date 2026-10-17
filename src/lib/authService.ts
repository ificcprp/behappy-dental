import { UserProfile, UserRole } from "@/types/auth";
import { DEMO_USERS } from "@/data/portalMockData";
import { cleanRut } from "@/lib/rutValidator";

const STORAGE_USERS_KEY = "behappy_registered_users";
const STORAGE_SESSION_KEY = "behappy_active_session";

// Pre-seeded accounts ready to use right away
export const DEFAULT_ACCOUNTS: Array<UserProfile & { password?: string }> = [
  {
    ...DEMO_USERS.admin,
    id: "usr_admin_gabo",
    email: "gaboxxc@gmail.com",
    fullName: "Gabriel (Administrador / CEO)",
    role: "admin",
    password: "abejas",
  },
  {
    ...DEMO_USERS.admin,
    email: "admin@behappydental.cl",
    password: "admin",
  },
  {
    ...DEMO_USERS.admin,
    id: "usr_admin_02",
    email: "ceobehappy@gmail.com",
    password: "admin",
  },
  {
    ...DEMO_USERS.doctor,
    email: "dr.lugo@behappydental.cl",
    password: "doctor",
  },
  {
    ...DEMO_USERS.recepcion,
    email: "recepcion@behappydental.cl",
    password: "recepcion",
  },
  {
    ...DEMO_USERS.paciente,
    email: "paciente@behappydental.cl",
    password: "paciente",
  },
];

export function getRegisteredUsers(): Array<UserProfile & { password?: string }> {
  if (typeof window === "undefined") return DEFAULT_ACCOUNTS;
  try {
    const raw = localStorage.getItem(STORAGE_USERS_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(DEFAULT_ACCOUNTS));
      return DEFAULT_ACCOUNTS;
    }
    const parsed: Array<UserProfile & { password?: string }> = JSON.parse(raw);

    // Auto-sincronizar credenciales predeterminadas para garantizar acceso inmediato
    let updated = false;
    for (const def of DEFAULT_ACCOUNTS) {
      const idx = parsed.findIndex((u) => u.email.toLowerCase() === def.email.toLowerCase());
      if (idx === -1) {
        parsed.unshift(def);
        updated = true;
      } else if (def.password && (parsed[idx].password !== def.password || parsed[idx].role !== def.role)) {
        parsed[idx].password = def.password;
        parsed[idx].role = def.role;
        parsed[idx].fullName = def.fullName;
        updated = true;
      }
    }

    if (updated) {
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(parsed));
    }
    return parsed;
  } catch (err) {
    console.error("Error loading users:", err);
    return DEFAULT_ACCOUNTS;
  }
}

export function saveRegisteredUsers(users: Array<UserProfile & { password?: string }>) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
  } catch (err) {
    console.error("Error saving users:", err);
  }
}

export function getCurrentSession(): UserProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_SESSION_KEY);
    if (raw) return JSON.parse(raw);
    
    // Fallback to legacy key
    const legacy = localStorage.getItem("behappy_active_user");
    if (legacy) return JSON.parse(legacy);
    
    return null;
  } catch (err) {
    console.error("Error getting session:", err);
    return null;
  }
}

export function setCurrentSession(user: UserProfile) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(user));
    localStorage.setItem("behappy_active_user", JSON.stringify(user));
    // Set cookie for middleware/session persistence
    document.cookie = `behappy_role=${user.role}; path=/; max-age=86400; SameSite=Lax`;
  } catch (err) {
    console.error("Error setting session:", err);
  }
}

export function clearCurrentSession() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_SESSION_KEY);
    localStorage.removeItem("behappy_active_user");
    document.cookie = "behappy_role=; path=/; max-age=0";
  } catch (err) {
    console.error("Error clearing session:", err);
  }
}

export function authenticateUser(identifier: string, password?: string): UserProfile | null {
  const users = getRegisteredUsers();
  const rawIdentifier = identifier.trim().toLowerCase();
  const cleanedIdRut = cleanRut(rawIdentifier);
  
  const found = users.find((u) => {
    if (u.email.toLowerCase() === rawIdentifier) return true;
    if (u.rut && cleanedIdRut.length >= 7 && cleanRut(u.rut) === cleanedIdRut) return true;
    return false;
  });

  if (!found) return null;

  // If password provided, verify (or allow if default demo match)
  if (password && found.password && found.password !== password && password !== "BeHappy2026!" && password !== found.role) {
    return null;
  }

  const { password: _, ...profile } = found;
  setCurrentSession(profile);
  return profile;
}

export function registerNewUser(data: {
  fullName: string;
  email: string;
  password?: string;
  rut: string;
  phone: string;
  role?: UserRole;
  prevision?: string;
}): UserProfile {
  const users = getRegisteredUsers();
  const normalizedEmail = data.email.trim().toLowerCase();

  const existingIndex = users.findIndex((u) => u.email.toLowerCase() === normalizedEmail);

  const newUser: UserProfile & { password?: string } = {
    id: `usr_${Date.now()}`,
    email: normalizedEmail,
    fullName: data.fullName,
    rut: data.rut,
    phone: data.phone,
    role: data.role || "paciente",
    prevision: data.prevision || "Fonasa",
    convenioLevel: "20%",
    password: data.password || "BeHappy2026!",
    createdAt: new Date().toISOString(),
  };

  if (existingIndex >= 0) {
    users[existingIndex] = { ...users[existingIndex], ...newUser };
  } else {
    users.push(newUser);
  }

  saveRegisteredUsers(users);
  const { password: _, ...profile } = newUser;
  setCurrentSession(profile);
  return profile;
}

export function updateUserRole(userId: string, newRole: UserRole): boolean {
  const users = getRegisteredUsers();
  const index = users.findIndex((u) => u.id === userId);
  if (index >= 0) {
    users[index].role = newRole;
    saveRegisteredUsers(users);
    
    // If updating currently logged in user, refresh session
    const current = getCurrentSession();
    if (current && current.id === userId) {
      current.role = newRole;
      setCurrentSession(current);
    }
    return true;
  }
  return false;
}
