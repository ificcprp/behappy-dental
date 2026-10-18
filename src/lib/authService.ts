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
    rut: "15.820.419-3",
    role: "admin",
    positionTitle: "CEO & Director General",
    password: "abejas",
  },
  {
    ...DEMO_USERS.admin,
    email: "admin@behappydental.cl",
    rut: "14.230.112-8",
    role: "admin",
    positionTitle: "Dirección Médica & Cirugía",
    password: "admin",
  },
  {
    ...DEMO_USERS.admin,
    id: "usr_admin_02",
    email: "ceobehappy@gmail.com",
    rut: "14.230.112-8",
    role: "admin",
    positionTitle: "Administración Central & Finanzas",
    password: "admin",
  },
  {
    ...DEMO_USERS.doctor,
    email: "dr.lugo@behappydental.cl",
    rut: "16.128.940-K",
    role: "doctor",
    specialty: "Ortodoncia e Invisalign®",
    boxAssigned: "Box 1",
    clinicalRegistrationNumber: "SIS-84920",
    password: "doctor",
  },
  {
    ...DEMO_USERS.recepcion,
    email: "recepcion@behappydental.cl",
    rut: "19.340.512-4",
    role: "recepcion",
    shift: "Jornada Completa (09:00 - 19:00)",
    assignedDesk: "Recepción Central Suecia 3580",
    password: "recepcion",
  },
  {
    ...DEMO_USERS.paciente,
    email: "paciente@behappydental.cl",
    rut: "18.452.931-K",
    role: "paciente",
    prevision: "Fonasa",
    convenioLevel: "20%",
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
      } else {
        if (
          def.password &&
          (parsed[idx].password !== def.password ||
            parsed[idx].role !== def.role ||
            parsed[idx].fullName !== def.fullName ||
            parsed[idx].rut !== def.rut ||
            parsed[idx].rut?.includes("Suecia"))
        ) {
          parsed[idx].password = def.password;
          parsed[idx].role = def.role;
          parsed[idx].fullName = def.fullName;
          parsed[idx].rut = def.rut;
          updated = true;
        }
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
    window.dispatchEvent(new CustomEvent("behappy_users_updated", { detail: users }));
  } catch (err) {
    console.error("Error saving users:", err);
  }
}

export function getCurrentSession(): UserProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_SESSION_KEY);
    if (raw) {
      const session: UserProfile = JSON.parse(raw);
      if (session.email.toLowerCase() === "gaboxxc@gmail.com" && (session.rut?.includes("Suecia") || !session.rut)) {
        session.rut = "15.820.419-3";
        localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(session));
      }
      return session;
    }
    
    // Fallback to legacy key
    const legacy = localStorage.getItem("behappy_active_user");
    if (legacy) {
      const session: UserProfile = JSON.parse(legacy);
      if (session.email.toLowerCase() === "gaboxxc@gmail.com" && (session.rut?.includes("Suecia") || !session.rut)) {
        session.rut = "15.820.419-3";
      }
      return session;
    }
    
    return null;
  } catch (err) {
    console.error("Error getting session:", err);
    return null;
  }
}

export async function requestServerSession(
  email: string,
  options: { password?: string; demo?: boolean } = {}
): Promise<boolean> {
  try {
    const res = await fetch("/api/auth/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, ...options }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export function setCurrentSession(user: UserProfile, password?: string) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(user));
    localStorage.setItem("behappy_active_user", JSON.stringify(user));
    // Set cookie for middleware/session persistence
    document.cookie = `behappy_role=${user.role}; path=/; max-age=86400; SameSite=Lax`;

    // Request a signed, HttpOnly server session so staff APIs can verify the caller
    if (password) {
      void requestServerSession(user.email, { password });
    }
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
    fetch("/api/auth/session", { method: "DELETE" }).catch(() => {});
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
  setCurrentSession(profile, password);
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
  convenioLevel?: "20%" | "40%" | "60%" | "Ninguno";
  specialty?: string;
  boxAssigned?: string;
  clinicalRegistrationNumber?: string;
  shift?: string;
  assignedDesk?: string;
  positionTitle?: string;
  emergencyContact?: string;
  setAsActiveSession?: boolean;
}): UserProfile & { password?: string } {
  const users = getRegisteredUsers();
  const normalizedEmail = data.email.trim().toLowerCase();

  const existingIndex = users.findIndex((u) => u.email.toLowerCase() === normalizedEmail);

  const newUser: UserProfile & { password?: string } = {
    id: existingIndex >= 0 ? users[existingIndex].id : `usr_${Date.now()}`,
    email: normalizedEmail,
    fullName: data.fullName,
    rut: data.rut,
    phone: data.phone,
    role: data.role || "paciente",
    prevision: data.prevision || (data.role === "paciente" ? "Fonasa" : undefined),
    convenioLevel: data.convenioLevel || (data.role === "paciente" ? "20%" : undefined),
    specialty: data.specialty,
    boxAssigned: data.boxAssigned,
    clinicalRegistrationNumber: data.clinicalRegistrationNumber,
    shift: data.shift,
    assignedDesk: data.assignedDesk,
    positionTitle: data.positionTitle,
    emergencyContact: data.emergencyContact,
    password: data.password || "BeHappy2026!",
    createdAt: existingIndex >= 0 ? users[existingIndex].createdAt : new Date().toISOString(),
  };

  if (existingIndex >= 0) {
    users[existingIndex] = { ...users[existingIndex], ...newUser };
  } else {
    users.push(newUser);
  }

  saveRegisteredUsers(users);

  // CRITICAL FIX: Only set active session if explicitly requested (e.g. self-registration from /login)
  // When an admin creates a user from the portal, setAsActiveSession is false to preserve admin session.
  if (data.setAsActiveSession === true) {
    const { password: _, ...profile } = newUser;
    setCurrentSession(profile, newUser.password);
  }

  return newUser;
}

export function updateUserRole(userId: string, newRole: UserRole): boolean {
  return updateUserProfile(userId, { role: newRole });
}

export function updateUserProfile(
  userId: string,
  updates: Partial<UserProfile & { password?: string }>
): boolean {
  const users = getRegisteredUsers();
  const index = users.findIndex((u) => u.id === userId);
  if (index === -1) return false;

  const current = users[index];
  const updated: UserProfile & { password?: string } = {
    ...current,
    ...updates,
    email: updates.email ? updates.email.trim().toLowerCase() : current.email,
  };

  users[index] = updated;
  saveRegisteredUsers(users);

  // If updating currently logged in user, refresh session
  const session = getCurrentSession();
  if (session && session.id === userId) {
    const { password: _, ...profileUpdates } = updated;
    setCurrentSession(profileUpdates);
  }

  return true;
}

export function updateUserPassword(userId: string, newPassword: string): boolean {
  return updateUserProfile(userId, { password: newPassword });
}

export function deleteUser(userId: string): { success: boolean; error?: string } {
  const users = getRegisteredUsers();
  const target = users.find((u) => u.id === userId);
  if (!target) return { success: false, error: "Usuario no encontrado" };

  if (target.email.toLowerCase() === "gaboxxc@gmail.com") {
    return { success: false, error: "No es posible eliminar la cuenta principal de Gabriel (CEO / SuperAdmin)" };
  }

  const current = getCurrentSession();
  if (current && current.id === userId) {
    return { success: false, error: "No puedes eliminar la cuenta con la que tienes sesión activa actualmente" };
  }

  const filtered = users.filter((u) => u.id !== userId);
  saveRegisteredUsers(filtered);
  return { success: true };
}

export function generateSuggestedPassword(role: UserRole = "paciente"): string {
  const randomSuffix = Math.floor(100 + Math.random() * 900);
  switch (role) {
    case "doctor":
      return `Doc_${randomSuffix}!2026`;
    case "recepcion":
      return `Recep_${randomSuffix}!2026`;
    case "admin":
      return `Admin_${randomSuffix}!2026`;
    case "paciente":
    default:
      return `BeHappy${randomSuffix}!`;
  }
}

export function formatCredentialDeliveryMessage(
  user: UserProfile & { password?: string },
  loginUrl?: string
): string {
  const roleNames: Record<UserRole, string> = {
    paciente: "Paciente",
    doctor: "Cuerpo Médico / Doctor Tratante",
    recepcion: "Recepción & Admisión",
    admin: "Dirección Médica & Administración",
  };

  const portalUrl =
    loginUrl ||
    (typeof window !== "undefined"
      ? `${window.location.origin}/login`
      : "https://behappydental.cl/login");

  let roleDetails = "";
  if (user.role === "doctor") {
    if (user.specialty) roleDetails += `• Especialidad: ${user.specialty}\n`;
    if (user.boxAssigned) roleDetails += `• Box Asignado: ${user.boxAssigned}\n`;
    if (user.clinicalRegistrationNumber) roleDetails += `• Registro SIS: ${user.clinicalRegistrationNumber}\n`;
  } else if (user.role === "recepcion") {
    if (user.shift) roleDetails += `• Turno / Horario: ${user.shift}\n`;
    if (user.assignedDesk) roleDetails += `• Ubicación: ${user.assignedDesk}\n`;
  } else if (user.role === "admin") {
    if (user.positionTitle) roleDetails += `• Cargo: ${user.positionTitle}\n`;
    roleDetails += `• Nivel de Acceso: Control Total Plataforma\n`;
  } else if (user.role === "paciente") {
    if (user.prevision) roleDetails += `• Previsión: ${user.prevision}\n`;
    if (user.convenioLevel) roleDetails += `• Convenio Club: ${user.convenioLevel}\n`;
  }

  return `🦷 *Centro Dental BeHappy - Credenciales de Acceso al Portal Clínico*

¡Hola ${user.fullName}! Se ha configurado tu perfil de acceso en el sistema de Centro Dental BeHappy.

📋 *Detalle de tu cuenta:*
• Rol asignado: ${roleNames[user.role] || user.role}
${roleDetails}• Correo de acceso: ${user.email}
${user.rut ? `• RUT: ${user.rut}\n` : ""}• Contraseña de ingreso: ${user.password || "BeHappy2026!"}
• Enlace al Portal: ${portalUrl}

🔐 *Instrucciones para iniciar sesión:*
1. Ingresa al enlace del portal: ${portalUrl}
2. Digita tu correo (${user.email}) y la contraseña asignada.
3. Ya podrás gestionar todas tus funciones según tu rol.

📍 Sede: Av. Suecia 3580, Providencia / Ñuñoa
📞 Teléfono: +56 9 3757 5147
🌐 Web: behappydental.cl`;
}
