"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { UserProfile, UserRole } from "@/types/auth";
import {
  getRegisteredUsers,
  registerNewUser,
  updateUserProfile,
  updateUserPassword,
  deleteUser,
  generateSuggestedPassword,
  formatCredentialDeliveryMessage,
} from "@/lib/authService";
import { getCMSData, saveCMSData } from "@/lib/cmsStore";
import { toast } from "sonner";
import {
  Search,
  UserPlus,
  Users,
  Key,
  Copy,
  Check,
  Eye,
  EyeOff,
  Edit3,
  Trash2,
  Shield,
  Stethoscope,
  UserCheck,
  Sparkles,
  Share2,
  X,
  Lock,
  AlertCircle,
  Phone,
  Mail,
  CheckCircle2,
  Clock,
  Building2,
  Filter,
  FileCheck,
  BadgeCheck,
} from "lucide-react";

interface AdminUserManagementProps {
  currentUser: UserProfile;
}

const DENTAL_SPECIALTIES = [
  "Ortodoncia e Invisalign®",
  "Implantología y Cirugía Bucal",
  "Odontología Estética y Restauradora",
  "Endodoncia y Microcirugía Apical",
  "Periodoncia y Salud Gingival",
  "Odontopediatría Integral",
  "Rehabilitación Oral y Prótesis",
  "Cirugía Maxilofacial",
  "Odontología General y Prevención",
];

const HEALTH_PREVISIONS = [
  "Fonasa",
  "Isapre Banmédica",
  "Isapre Colmena",
  "Isapre Consalud",
  "Isapre Cruz Blanca",
  "Isapre Nueva Masvida",
  "Isapre Vida Tres",
  "Dipreca / Capredena",
  "Particular / Sin previsión",
];

const RECEPTION_SHIFTS = [
  "Turno Mañana (08:30 - 14:30)",
  "Turno Tarde (14:00 - 20:00)",
  "Jornada Completa (09:00 - 19:00)",
  "Turno Sábados & Rotativo",
];

const ADMIN_POSITIONS = [
  "Dirección Médica & Cirugía",
  "Administración General / Gerencia",
  "Finanzas, Tesorería & Facturación",
  "Jefatura de Operaciones Clínicas",
  "Soporte TI & Plataforma",
];

export function AdminUserManagement({ currentUser }: AdminUserManagementProps) {
  const [users, setUsers] = useState<Array<UserProfile & { password?: string }>>([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"todos" | UserRole>("todos");

  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createModalTab, setCreateModalTab] = useState<"crear" | "compartir">("crear");
  const [shareFilter, setShareFilter] = useState<"doctor" | "recepcion" | "admin" | "todos">("doctor");
  const [shareSearch, setShareSearch] = useState("");
  const [copiedAllProfessionals, setCopiedAllProfessionals] = useState(false);
  const [copiedSingleId, setCopiedSingleId] = useState<string | null>(null);

  const [showHandoffModal, setShowHandoffModal] = useState(false);
  const [handoffUser, setHandoffUser] = useState<(UserProfile & { password?: string }) | null>(null);
  const [copiedHandoff, setCopiedHandoff] = useState(false);
  const [copiedPassword, setCopiedPassword] = useState(false);

  // Edit User State
  const [editingUser, setEditingUser] = useState<(UserProfile & { password?: string }) | null>(null);

  // Quick Password Change Modal
  const [passwordTargetUser, setPasswordTargetUser] = useState<(UserProfile & { password?: string }) | null>(null);
  const [newQuickPassword, setNewQuickPassword] = useState("");
  const [showQuickPassToggle, setShowQuickPassToggle] = useState(false);

  // Delete User State
  const [deletingUser, setDeletingUser] = useState<(UserProfile & { password?: string }) | null>(null);

  // Create Form State
  const [createRole, setCreateRole] = useState<UserRole>("doctor");
  const [createFullName, setCreateFullName] = useState("");
  const [createEmail, setCreateEmail] = useState("");
  const [createRut, setCreateRut] = useState("");
  const [createPhone, setCreatePhone] = useState("");
  const [createPassword, setCreatePassword] = useState("");
  const [showCreatePasswordToggle, setShowCreatePasswordToggle] = useState(false);

  // Role-specific fields for creation
  const [createSpecialty, setCreateSpecialty] = useState(DENTAL_SPECIALTIES[0]);
  const [createCustomSpecialty, setCreateCustomSpecialty] = useState("");
  const [createBoxAssigned, setCreateBoxAssigned] = useState("Box 1");
  const [createSisRegistration, setCreateSisRegistration] = useState("");
  const [createSyncWithCmsDoctors, setCreateSyncWithCmsDoctors] = useState(true);

  const [createShift, setCreateShift] = useState(RECEPTION_SHIFTS[0]);
  const [createAssignedDesk, setCreateAssignedDesk] = useState("Recepción Central Suecia 3580");

  const [createPositionTitle, setCreatePositionTitle] = useState(ADMIN_POSITIONS[0]);

  const [createPrevision, setCreatePrevision] = useState("Fonasa");
  const [createConvenioLevel, setCreateConvenioLevel] = useState<"20%" | "40%" | "60%" | "Ninguno">("20%");
  const [createEmergencyContact, setCreateEmergencyContact] = useState("");

  // Load registered users
  const refreshUsers = () => {
    setUsers(getRegisteredUsers());
  };

  useEffect(() => {
    refreshUsers();
  }, []);

  // Set default suggested password when changing creation role
  const handleRoleSelectionChange = (newRole: UserRole) => {
    setCreateRole(newRole);
    setCreatePassword(generateSuggestedPassword(newRole));
  };

  const openCreateModal = (initialTab: "crear" | "compartir" = "crear") => {
    setCreateModalTab(initialTab);
    setCreateRole("doctor");
    setCreateFullName("");
    setCreateEmail("");
    setCreateRut("");
    setCreatePhone("");
    setCreatePassword(generateSuggestedPassword("doctor"));
    setCreateSpecialty(DENTAL_SPECIALTIES[0]);
    setCreateCustomSpecialty("");
    setCreateBoxAssigned("Box 1");
    setCreateSisRegistration("");
    setCreateSyncWithCmsDoctors(true);
    setCreateShift(RECEPTION_SHIFTS[0]);
    setCreateAssignedDesk("Recepción Central Suecia 3580");
    setCreatePositionTitle(ADMIN_POSITIONS[0]);
    setCreatePrevision("Fonasa");
    setCreateConvenioLevel("20%");
    setCreateEmergencyContact("");
    setShowCreateModal(true);
  };

  // Copy entire professional roster summary
  const handleCopyAllProfessionalsSummary = () => {
    const doctors = users.filter((u) => u.role === "doctor");
    const portalUrl =
      typeof window !== "undefined"
        ? `${window.location.origin}/login`
        : "https://behappydental.cl/login";

    let text = `🦷 *Centro Dental BeHappy - Nómina Oficial del Cuerpo Médico*\n`;
    text += `📍 Sede: Av. Suecia 3580, Providencia / Ñuñoa\n`;
    text += `🔐 Portal de Acceso Clínico: ${portalUrl}\n\n`;
    text += `📋 *Accesos de Especialistas (${doctors.length}):*\n`;

    doctors.forEach((doc, idx) => {
      text += `\n${idx + 1}. *${doc.fullName}*\n`;
      text += `   • Especialidad: ${doc.specialty || "Cirujano Dentista"}\n`;
      if (doc.boxAssigned) text += `   • Box Asignado: ${doc.boxAssigned}\n`;
      if (doc.clinicalRegistrationNumber) text += `   • Registro SIS: ${doc.clinicalRegistrationNumber}\n`;
      text += `   • Correo: ${doc.email}\n`;
      text += `   • Clave: ${doc.password || "BeHappy2026!"}\n`;
    });

    text += `\n🔐 *Instrucciones:* Ingresar a ${portalUrl} con su correo y contraseña asignada.`;

    if (navigator?.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedAllProfessionals(true);
      toast.success("Nómina completa de los 8 especialistas copiada");
      setTimeout(() => setCopiedAllProfessionals(false), 3000);
    }
  };

  // Copy individual professional credential message
  const handleCopySingleProfessional = (u: UserProfile & { password?: string }) => {
    const text = formatCredentialDeliveryMessage(u);
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedSingleId(u.id);
      toast.success(`Mensaje de acceso para ${u.fullName} copiado`);
      setTimeout(() => setCopiedSingleId(null), 2500);
    }
  };

  // Direct create and open WhatsApp delivery
  const handleCreateAndShareWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!createFullName.trim() || !createEmail.trim()) {
      toast.error("Por favor completa el nombre y correo del usuario");
      return;
    }

    const finalPassword = createPassword.trim() || generateSuggestedPassword(createRole);
    const finalSpecialty =
      createRole === "doctor"
        ? createCustomSpecialty.trim() || createSpecialty
        : undefined;

    const newUser = registerNewUser({
      fullName: createFullName.trim(),
      email: createEmail.trim(),
      password: finalPassword,
      rut: createRut.trim(),
      phone: createPhone.trim(),
      role: createRole,
      specialty: finalSpecialty,
      boxAssigned: createRole === "doctor" ? createBoxAssigned : undefined,
      clinicalRegistrationNumber: createRole === "doctor" ? createSisRegistration.trim() : undefined,
      shift: createRole === "recepcion" ? createShift : undefined,
      assignedDesk: createRole === "recepcion" ? createAssignedDesk : undefined,
      positionTitle: createRole === "admin" ? createPositionTitle : undefined,
      prevision: createRole === "paciente" ? createPrevision : undefined,
      convenioLevel: createRole === "paciente" ? createConvenioLevel : undefined,
      emergencyContact: createRole === "paciente" ? createEmergencyContact.trim() : undefined,
      setAsActiveSession: false,
    });

    if (createRole === "doctor" && createSyncWithCmsDoctors) {
      try {
        const cmsData = getCMSData();
        const existingDocs = cmsData.doctors || [];
        const cleanName = createFullName.trim();
        const alreadyInCms = existingDocs.some(
          (d) => d.name.toLowerCase() === cleanName.toLowerCase()
        );

        if (!alreadyInCms) {
          const slug = cleanName
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "");

          const newDoctorEntry = {
            id: `doc-${Date.now()}`,
            name: cleanName.startsWith("Dr.") || cleanName.startsWith("Dra.") ? cleanName : `Dr. ${cleanName}`,
            slug,
            role: finalSpecialty || "Odontólogo Especialista",
            specialty: finalSpecialty || "Odontología General",
            description: `Especialista en ${finalSpecialty || "salud dental"} en Centro Dental BeHappy Sede Suecia 3580.`,
            image: "/images/doctors/dr-johnny-lugo.png",
            tags: [finalSpecialty || "Odontología", "Atención Clínica"],
            schedule: "Lunes a Viernes 10:00 - 20:00 / Sábado 10:00 - 18:00 (Previa reserva)",
            assignedBox: (createBoxAssigned as "Box 1" | "Box 2" | "Box 3") || "Box 1",
            sisRegistrationNumber: createSisRegistration.trim() || undefined,
            isAvailableOnline: true,
          };

          saveCMSData(
            { doctors: [...existingDocs, newDoctorEntry] },
            {
              status: "draft",
              changeSummary: "Alta de doctor desde gestión de usuarios (pendiente de publicar)",
            }
          );
        }
      } catch (err) {
        console.error("Error syncing doctor to CMS:", err);
      }
    }

    refreshUsers();
    setShowCreateModal(false);

    const message = formatCredentialDeliveryMessage(newUser);
    const cleanPhone = createPhone.replace(/[^0-9]/g, "");
    const waUrl = cleanPhone
      ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`
      : `https://wa.me/?text=${encodeURIComponent(message)}`;

    if (typeof window !== "undefined") {
      window.open(waUrl, "_blank");
    }
    toast.success(`Usuario ${newUser.fullName} guardado y WhatsApp abierto para entrega`);
  };

  // Submit Create User
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!createFullName.trim() || !createEmail.trim()) {
      toast.error("Por favor completa el nombre y correo del usuario");
      return;
    }

    const finalPassword = createPassword.trim() || generateSuggestedPassword(createRole);
    const finalSpecialty =
      createRole === "doctor"
        ? createCustomSpecialty.trim() || createSpecialty
        : undefined;

    const newUser = registerNewUser({
      fullName: createFullName.trim(),
      email: createEmail.trim(),
      password: finalPassword,
      rut: createRut.trim(),
      phone: createPhone.trim(),
      role: createRole,
      specialty: finalSpecialty,
      boxAssigned: createRole === "doctor" ? createBoxAssigned : undefined,
      clinicalRegistrationNumber: createRole === "doctor" ? createSisRegistration.trim() : undefined,
      shift: createRole === "recepcion" ? createShift : undefined,
      assignedDesk: createRole === "recepcion" ? createAssignedDesk : undefined,
      positionTitle: createRole === "admin" ? createPositionTitle : undefined,
      prevision: createRole === "paciente" ? createPrevision : undefined,
      convenioLevel: createRole === "paciente" ? createConvenioLevel : undefined,
      emergencyContact: createRole === "paciente" ? createEmergencyContact.trim() : undefined,
      setAsActiveSession: false, // PRESERVE ADMIN SESSION!
    });

    // If role is doctor and sync with CMS is checked, add to CMS doctors if not already present
    if (createRole === "doctor" && createSyncWithCmsDoctors) {
      try {
        const cmsData = getCMSData();
        const existingDocs = cmsData.doctors || [];
        const cleanName = createFullName.trim();
        const alreadyInCms = existingDocs.some(
          (d) => d.name.toLowerCase() === cleanName.toLowerCase()
        );

        if (!alreadyInCms) {
          const slug = cleanName
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "");

          const newDoctorEntry = {
            id: `doc-${Date.now()}`,
            name: cleanName.startsWith("Dr.") || cleanName.startsWith("Dra.") ? cleanName : `Dr. ${cleanName}`,
            slug,
            role: finalSpecialty || "Odontólogo Especialista",
            specialty: finalSpecialty || "Odontología General",
            description: `Especialista en ${finalSpecialty || "salud dental"} en Centro Dental BeHappy Sede Suecia 3580.`,
            image: "/images/doctors/dr-johnny-lugo.png",
            tags: [finalSpecialty || "Odontología", "Atención Clínica"],
            schedule: "Lunes a Viernes 10:00 - 20:00 / Sábado 10:00 - 18:00 (Previa reserva)",
            assignedBox: (createBoxAssigned as "Box 1" | "Box 2" | "Box 3") || "Box 1",
            sisRegistrationNumber: createSisRegistration.trim() || undefined,
            isAvailableOnline: true,
          };

          saveCMSData(
            { doctors: [...existingDocs, newDoctorEntry] },
            {
              status: "draft",
              changeSummary: "Alta de doctor desde gestión de usuarios (pendiente de publicar)",
            }
          );
        }
      } catch (err) {
        console.error("Error syncing doctor to CMS:", err);
      }
    }

    refreshUsers();
    setShowCreateModal(false);

    // Open Credential Handoff Modal immediately!
    setHandoffUser(newUser);
    setShowHandoffModal(true);
    toast.success(`¡Usuario ${newUser.fullName} creado exitosamente con rol ${newUser.role}!`);
  };

  // Open Handoff Modal for any existing user
  const openHandoffForUser = (user: UserProfile & { password?: string }) => {
    setHandoffUser(user);
    setShowHandoffModal(true);
  };

  // Copy Full Delivery Message
  const handleCopyFullMessage = () => {
    if (!handoffUser) return;
    const msg = formatCredentialDeliveryMessage(handoffUser);
    navigator.clipboard.writeText(msg);
    setCopiedHandoff(true);
    toast.success("¡Ficha completa de credenciales copiada al portapapeles!");
    setTimeout(() => setCopiedHandoff(false), 2500);
  };

  // Copy Password Only
  const handleCopyPasswordOnly = (pass?: string) => {
    if (!pass) return;
    navigator.clipboard.writeText(pass);
    setCopiedPassword(true);
    toast.success("Contraseña copiada al portapapeles");
    setTimeout(() => setCopiedPassword(false), 2000);
  };

  // Open Edit Modal
  const openEditModal = (user: UserProfile & { password?: string }) => {
    setEditingUser({ ...user });
  };

  // Submit Edit Modal
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    updateUserProfile(editingUser.id, {
      fullName: editingUser.fullName,
      email: editingUser.email,
      rut: editingUser.rut,
      phone: editingUser.phone,
      role: editingUser.role,
      specialty: editingUser.role === "doctor" ? editingUser.specialty : undefined,
      boxAssigned: editingUser.role === "doctor" ? editingUser.boxAssigned : undefined,
      clinicalRegistrationNumber: editingUser.role === "doctor" ? editingUser.clinicalRegistrationNumber : undefined,
      shift: editingUser.role === "recepcion" ? editingUser.shift : undefined,
      assignedDesk: editingUser.role === "recepcion" ? editingUser.assignedDesk : undefined,
      positionTitle: editingUser.role === "admin" ? editingUser.positionTitle : undefined,
      prevision: editingUser.role === "paciente" ? editingUser.prevision : undefined,
      convenioLevel: editingUser.role === "paciente" ? editingUser.convenioLevel : undefined,
      emergencyContact: editingUser.role === "paciente" ? editingUser.emergencyContact : undefined,
      password: editingUser.password,
    });

    refreshUsers();
    setEditingUser(null);
    toast.success("Perfil y credenciales actualizados correctamente");
  };

  // Submit Quick Password Change
  const handleQuickPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordTargetUser || !newQuickPassword.trim()) return;

    updateUserPassword(passwordTargetUser.id, newQuickPassword.trim());
    refreshUsers();
    toast.success(`Nueva contraseña asignada a ${passwordTargetUser.fullName}`);
    setPasswordTargetUser(null);
    setNewQuickPassword("");
  };

  // Handle Delete
  const handleDeleteConfirm = () => {
    if (!deletingUser) return;
    const res = deleteUser(deletingUser.id);
    if (!res.success) {
      toast.error(res.error || "No se pudo eliminar el usuario");
      return;
    }
    refreshUsers();
    toast.success(`Usuario ${deletingUser.fullName} eliminado del sistema`);
    setDeletingUser(null);
  };

  // Filter users
  const filteredUsers = users.filter((u) => {
    if (roleFilter !== "todos" && u.role !== roleFilter) return false;
    if (!search.trim()) return true;
    const term = search.toLowerCase();
    return (
      u.fullName.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term) ||
      (u.rut && u.rut.toLowerCase().includes(term)) ||
      (u.specialty && u.specialty.toLowerCase().includes(term)) ||
      (u.positionTitle && u.positionTitle.toLowerCase().includes(term)) ||
      (u.phone && u.phone.includes(term))
    );
  });

  // Count by role
  const countByRole = {
    todos: users.length,
    doctor: users.filter((u) => u.role === "doctor").length,
    recepcion: users.filter((u) => u.role === "recepcion").length,
    admin: users.filter((u) => u.role === "admin").length,
    paciente: users.filter((u) => u.role === "paciente").length,
  };

  const roleBadgeConfig: Record<UserRole, { label: string; bg: string; text: string; border: string; icon: any }> = {
    doctor: {
      label: "Doctor / Médico",
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-200",
      icon: Stethoscope,
    },
    recepcion: {
      label: "Recepción / Admisión",
      bg: "bg-amber-50",
      text: "text-amber-700",
      border: "border-amber-200",
      icon: Clock,
    },
    admin: {
      label: "Dirección / Admin",
      bg: "bg-purple-50",
      text: "text-purple-700",
      border: "border-purple-200",
      icon: Shield,
    },
    paciente: {
      label: "Paciente",
      bg: "bg-teal-50",
      text: "text-teal-700",
      border: "border-teal-200",
      icon: UserCheck,
    },
  };

  return (
    <div className="space-y-5">
      {/* Top Banner with Stats & CTA */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-lg p-5 sm:p-6 shadow-md border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Gestión Integral de Accesos
              </span>
              <span className="text-xs text-slate-400 font-mono">Sede Suecia 3580</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Usuarios, Perfiles Clínicos & Credenciales
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Crea perfiles reales con contraseña directa para administradores, doctores, recepcionistas y pacientes.
              Entrega los accesos de inmediato por WhatsApp o correo en 1 clic.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0 self-start md:self-center">
            <button
              onClick={() => openCreateModal("compartir")}
              className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-mono text-xs uppercase tracking-wider font-bold rounded-md transition flex items-center gap-2 cursor-pointer shadow-sm"
              title="Ver nómina de especialistas y enviar accesos directos por WhatsApp"
            >
              <Share2 className="w-4 h-4 text-emerald-400" />
              <span>Compartir Cuentas con Profesionales</span>
            </button>

            <button
              onClick={() => openCreateModal("crear")}
              className="px-4 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs uppercase tracking-wider font-bold rounded-md shadow-lg hover:shadow-xl transition flex items-center gap-2 cursor-pointer"
            >
              <UserPlus className="w-4 h-4 text-slate-950" />
              <span>Invitar / Crear Usuario</span>
            </button>
          </div>
        </div>

        {/* Metric Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-4 mt-4 border-t border-slate-700/60 font-mono text-xs">
          <button
            onClick={() => setRoleFilter("todos")}
            className={`p-2.5 rounded border text-left transition ${
              roleFilter === "todos"
                ? "bg-white/15 border-white text-white"
                : "bg-slate-800/40 border-slate-700 text-slate-400 hover:text-slate-200"
            }`}
          >
            <div className="text-[10px] uppercase text-slate-400">Total Usuarios</div>
            <div className="text-lg font-bold text-white">{countByRole.todos}</div>
          </button>

          <button
            onClick={() => setRoleFilter("doctor")}
            className={`p-2.5 rounded border text-left transition ${
              roleFilter === "doctor"
                ? "bg-blue-500/20 border-blue-400 text-white"
                : "bg-slate-800/40 border-slate-700 text-slate-400 hover:text-blue-300"
            }`}
          >
            <div className="text-[10px] uppercase text-blue-300 flex items-center gap-1">
              <Stethoscope className="w-3 h-3" /> Doctores
            </div>
            <div className="text-lg font-bold text-blue-200">{countByRole.doctor}</div>
          </button>

          <button
            onClick={() => setRoleFilter("recepcion")}
            className={`p-2.5 rounded border text-left transition ${
              roleFilter === "recepcion"
                ? "bg-amber-500/20 border-amber-400 text-white"
                : "bg-slate-800/40 border-slate-700 text-slate-400 hover:text-amber-300"
            }`}
          >
            <div className="text-[10px] uppercase text-amber-300 flex items-center gap-1">
              <Clock className="w-3 h-3" /> Recepción
            </div>
            <div className="text-lg font-bold text-amber-200">{countByRole.recepcion}</div>
          </button>

          <button
            onClick={() => setRoleFilter("admin")}
            className={`p-2.5 rounded border text-left transition ${
              roleFilter === "admin"
                ? "bg-purple-500/20 border-purple-400 text-white"
                : "bg-slate-800/40 border-slate-700 text-slate-400 hover:text-purple-300"
            }`}
          >
            <div className="text-[10px] uppercase text-purple-300 flex items-center gap-1">
              <Shield className="w-3 h-3" /> Admins
            </div>
            <div className="text-lg font-bold text-purple-200">{countByRole.admin}</div>
          </button>

          <button
            onClick={() => setRoleFilter("paciente")}
            className={`p-2.5 rounded border text-left transition ${
              roleFilter === "paciente"
                ? "bg-teal-500/20 border-teal-400 text-white"
                : "bg-slate-800/40 border-slate-700 text-slate-400 hover:text-teal-300"
            }`}
          >
            <div className="text-[10px] uppercase text-teal-300 flex items-center gap-1">
              <UserCheck className="w-3 h-3" /> Pacientes
            </div>
            <div className="text-lg font-bold text-teal-200">{countByRole.paciente}</div>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-3.5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar por nombre, correo, RUT o especialidad..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-900 text-xs font-mono focus:outline-none focus:border-slate-900 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-[11px] font-mono text-slate-500 uppercase flex items-center gap-1">
            <Filter className="w-3 h-3" /> Rol:
          </span>
          {(["todos", "doctor", "recepcion", "admin", "paciente"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-2.5 py-1 rounded text-[11px] font-mono uppercase transition font-medium whitespace-nowrap ${
                roleFilter === r
                  ? "bg-slate-900 text-white font-bold"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {r === "todos" ? "Todos" : r}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[11px]">
              <tr>
                <th className="p-3.5">Usuario & Identificación</th>
                <th className="p-3.5">Rol & Perfil Específico</th>
                <th className="p-3.5">Contacto</th>
                <th className="p-3.5">Contraseña & Accesos</th>
                <th className="p-3.5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400 text-xs font-mono">
                    No se encontraron usuarios con los criterios de búsqueda seleccionados.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const roleMeta = roleBadgeConfig[u.role] || roleBadgeConfig.paciente;
                  const Icon = roleMeta.icon;
                  const isCurrentAuthUser = currentUser?.id === u.id || currentUser?.email.toLowerCase() === u.email.toLowerCase();

                  return (
                    <tr key={u.id} className="hover:bg-slate-50/70 transition">
                      {/* Name & RUT */}
                      <td className="p-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs uppercase ${roleMeta.bg} ${roleMeta.text} border ${roleMeta.border}`}>
                            {u.fullName.slice(0, 2)}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                              <span>{u.fullName}</span>
                              {isCurrentAuthUser && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono uppercase bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
                                  Tú (Sesión Activa)
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-slate-500 font-mono">
                              RUT: {u.rut || "Sin registrar"}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Role & Specific Profile Details */}
                      <td className="p-3.5">
                        <div className="space-y-1">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${roleMeta.bg} ${roleMeta.text} ${roleMeta.border}`}
                          >
                            <Icon className="w-3 h-3" />
                            {roleMeta.label}
                          </span>

                          {/* Doctor specific */}
                          {u.role === "doctor" && (
                            <div className="text-[11px] text-slate-700">
                              <span className="font-medium text-blue-900">{u.specialty || "Odontología General"}</span>
                              {u.boxAssigned && (
                                <span className="text-slate-500 block text-[10px]">Asignado: {u.boxAssigned}</span>
                              )}
                              {u.clinicalRegistrationNumber && (
                                <span className="text-slate-500 block text-[10px]">SIS: {u.clinicalRegistrationNumber}</span>
                              )}
                            </div>
                          )}

                          {/* Reception specific */}
                          {u.role === "recepcion" && (
                            <div className="text-[11px] text-slate-700">
                              <span className="font-medium text-amber-900">{u.shift || "Jornada Completa"}</span>
                              {u.assignedDesk && (
                                <span className="text-slate-500 block text-[10px]">{u.assignedDesk}</span>
                              )}
                            </div>
                          )}

                          {/* Admin specific */}
                          {u.role === "admin" && (
                            <div className="text-[11px] text-slate-700">
                              <span className="font-medium text-purple-900">{u.positionTitle || "Administración Central"}</span>
                              <span className="text-slate-500 block text-[10px]">Control Total CMS & Fichas</span>
                            </div>
                          )}

                          {/* Patient specific */}
                          {u.role === "paciente" && (
                            <div className="text-[11px] text-slate-700">
                              <span className="font-medium text-teal-900">Previsión: {u.prevision || "Fonasa"}</span>
                              <span className="text-slate-500 block text-[10px]">
                                Club BeHappy: {u.convenioLevel || "20%"}
                              </span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="p-3.5">
                        <div className="space-y-0.5">
                          <div className="text-slate-900 flex items-center gap-1 text-[11px]">
                            <Mail className="w-3 h-3 text-slate-400" />
                            <span>{u.email}</span>
                          </div>
                          <div className="text-slate-500 flex items-center gap-1 text-[10px]">
                            <Phone className="w-3 h-3 text-slate-400" />
                            <span>{u.phone || "Sin teléfono"}</span>
                          </div>
                        </div>
                      </td>

                      {/* Password & Credentials */}
                      <td className="p-3.5">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-1.5">
                            <span className="px-2 py-1 bg-slate-100 border border-slate-300 rounded font-mono text-[11px] text-slate-800 font-bold select-all">
                              {u.password || "BeHappy2026!"}
                            </span>
                            <button
                              onClick={() => handleCopyPasswordOnly(u.password || "BeHappy2026!")}
                              title="Copiar contraseña"
                              className="p-1 hover:bg-slate-200 rounded text-slate-600 transition"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <button
                            onClick={() => openHandoffForUser(u)}
                            className="inline-flex items-center gap-1 text-[10px] text-emerald-700 hover:text-emerald-900 font-bold transition underline"
                          >
                            <Share2 className="w-3 h-3" />
                            <span>Ficha de Entrega (WhatsApp)</span>
                          </button>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Quick Password */}
                          <button
                            onClick={() => {
                              setPasswordTargetUser(u);
                              setNewQuickPassword(generateSuggestedPassword(u.role));
                            }}
                            title="Cambiar contraseña"
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition"
                          >
                            <Key className="w-3.5 h-3.5" />
                          </button>

                          {/* Full Edit */}
                          <button
                            onClick={() => openEditModal(u)}
                            title="Editar perfil completo"
                            className="p-1.5 bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-700 rounded transition"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => setDeletingUser(u)}
                            disabled={isCurrentAuthUser || u.email.toLowerCase() === "gaboxxc@gmail.com"}
                            title={
                              isCurrentAuthUser
                                ? "No puedes eliminar tu propia cuenta en sesión"
                                : u.email.toLowerCase() === "gaboxxc@gmail.com"
                                ? "Cuenta principal protegida"
                                : "Eliminar usuario"
                            }
                            className={`p-1.5 rounded transition ${
                              isCurrentAuthUser || u.email.toLowerCase() === "gaboxxc@gmail.com"
                                ? "opacity-30 cursor-not-allowed text-slate-400 bg-slate-50"
                                : "hover:bg-red-50 text-red-600 bg-slate-100 hover:text-red-700"
                            }`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: INVITAR / CREAR USUARIOS O COMPARTIR CUENTAS CON PROFESIONALES */}
      {/* ========================================================================= */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className={`bg-white border border-slate-300 rounded-xl w-full p-5 sm:p-6 space-y-4 shadow-2xl my-8 transition-all ${
            createModalTab === "compartir" ? "max-w-3xl" : "max-w-xl"
          }`}>
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono tracking-widest text-emerald-700 uppercase font-bold block">
                    GESTIÓN DE ACCESOS & EQUIPO
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-mono uppercase bg-slate-100 text-slate-700 font-bold border border-slate-200">
                    Sede Suecia 3580
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
                  Invitar a Otros & Compartir Cuentas
                </h3>
                <p className="text-xs text-slate-500 font-light mt-0.5">
                  Crea perfiles con credenciales directas o envía de inmediato los accesos por WhatsApp a cada profesional.
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-800 p-1 rounded transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Tabs inside Modal */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-2.5 gap-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCreateModalTab("crear")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    createModalTab === "crear"
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Invitar / Crear Nuevo Acceso</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCreateModalTab("compartir")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    createModalTab === "compartir"
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200"
                  }`}
                >
                  <Share2 className="w-3.5 h-3.5 text-current" />
                  <span>Compartir Cuentas con Profesionales ({users.filter((u) => u.role === "doctor").length})</span>
                </button>
              </div>

              {createModalTab === "compartir" && (
                <button
                  type="button"
                  onClick={handleCopyAllProfessionalsSummary}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-black text-white text-[11px] font-mono font-bold rounded-md transition cursor-pointer shrink-0 self-start sm:self-auto"
                >
                  {copiedAllProfessionals ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedAllProfessionals ? "¡Nómina Copiada!" : "Copiar Nómina Completa"}</span>
                </button>
              )}
            </div>

            {/* ========================================================================= */}
            {/* SUB-VIEW 1: FORMULARIO CREAR / INVITAR NUEVO ACCESO */}
            {/* ========================================================================= */}
            {createModalTab === "crear" && (
              <form onSubmit={handleCreateSubmit} className="space-y-4 font-mono text-xs">
                {/* Shortcut banner to Compartir Cuentas */}
                <div className="bg-emerald-50/80 border border-emerald-200 rounded-lg p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2">
                    <Share2 className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span className="text-xs text-emerald-950 font-sans">
                      ¿Deseas enviar las cuentas ya listas a los <strong>8 especialistas</strong> del equipo?
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCreateModalTab("compartir")}
                    className="self-start sm:self-center px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-mono font-bold uppercase rounded transition shrink-0 cursor-pointer"
                  >
                    Ver Cuentas para Enviar →
                  </button>
                </div>

                {/* Role Selection Buttons */}
                <div>
                  <label className="block text-[11px] font-mono uppercase text-slate-600 mb-1.5 font-bold">
                    Selecciona el Rol del Usuario *
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(["doctor", "recepcion", "admin", "paciente"] as const).map((r) => {
                      const meta = roleBadgeConfig[r];
                      const Icon = meta.icon;
                      const isSelected = createRole === r;
                      return (
                        <button
                          key={r}
                          type="button"
                          onClick={() => handleRoleSelectionChange(r)}
                          className={`p-2.5 rounded-lg border text-left transition flex flex-col gap-1 cursor-pointer ${
                            isSelected
                              ? `border-slate-900 bg-slate-900 text-white shadow-sm ring-2 ring-slate-900/10`
                              : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          <div className="flex items-center gap-1.5">
                            <Icon className={`w-3.5 h-3.5 ${isSelected ? "text-white" : meta.text}`} />
                            <span className="font-bold text-[11px] uppercase">{r}</span>
                          </div>
                          <span className={`text-[10px] ${isSelected ? "text-slate-300" : "text-slate-500"}`}>
                            {r === "doctor" && "Box Clínico"}
                            {r === "recepcion" && "Turno & Agenda"}
                            {r === "admin" && "Control Total"}
                            {r === "paciente" && "Ficha & Convenio"}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* General Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-slate-700 mb-1 font-semibold">
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      required
                      value={createFullName}
                      onChange={(e) => setCreateFullName(e.target.value)}
                      placeholder={
                        createRole === "doctor"
                          ? "Ej: Dr. Roberto Silva"
                          : createRole === "recepcion"
                          ? "Ej: Andrea Muñoz"
                          : "Ej: Nombre y Apellido"
                      }
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 text-xs focus:outline-none focus:border-slate-900 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase text-slate-700 mb-1 font-semibold">
                      Correo Electrónico (Usuario de Acceso) *
                    </label>
                    <input
                      type="email"
                      required
                      value={createEmail}
                      onChange={(e) => setCreateEmail(e.target.value)}
                      placeholder="usuario@behappydental.cl"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 text-xs font-mono focus:outline-none focus:border-slate-900 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-slate-700 mb-1 font-semibold">
                      RUT Chileno
                    </label>
                    <input
                      type="text"
                      value={createRut}
                      onChange={(e) => setCreateRut(e.target.value)}
                      placeholder="15.820.419-3"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 text-xs font-mono focus:outline-none focus:border-slate-900 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase text-slate-700 mb-1 font-semibold">
                      Teléfono Móvil (WhatsApp para envío)
                    </label>
                    <input
                      type="tel"
                      value={createPhone}
                      onChange={(e) => setCreatePhone(e.target.value)}
                      placeholder="+56 9 1234 5678"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 text-xs font-mono focus:outline-none focus:border-slate-900 focus:bg-white"
                    />
                  </div>
                </div>

                {/* DYNAMIC ROLE FIELDS */}
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 space-y-3">
                  <div className="text-[11px] font-bold uppercase text-slate-800 flex items-center gap-1.5 border-b border-slate-200 pb-1.5">
                    <BadgeCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Configuración Específica para Perfil: {createRole.toUpperCase()}</span>
                  </div>

                  {/* DOCTOR FIELDS */}
                  {createRole === "doctor" && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] uppercase text-slate-600 mb-1 font-semibold">
                            Especialidad Odontológica *
                          </label>
                          <select
                            value={createSpecialty}
                            onChange={(e) => setCreateSpecialty(e.target.value)}
                            className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-900 text-xs"
                          >
                            {DENTAL_SPECIALTIES.map((esp) => (
                              <option key={esp} value={esp}>
                                {esp}
                              </option>
                            ))}
                            <option value="otra">Otra especialidad...</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase text-slate-600 mb-1 font-semibold">
                            Box Clínico Predeterminado
                          </label>
                          <select
                            value={createBoxAssigned}
                            onChange={(e) => setCreateBoxAssigned(e.target.value)}
                            className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-900 text-xs"
                          >
                            <option value="Box 1">Box 1 (Ortodoncia / General)</option>
                            <option value="Box 2">Box 2 (Estética / Restauradora)</option>
                            <option value="Box 3">Box 3 (Cirugía / Implantes)</option>
                          </select>
                        </div>
                      </div>

                      {createSpecialty === "otra" && (
                        <div>
                          <label className="block text-[10px] uppercase text-slate-600 mb-1 font-semibold">
                            Escribe la Especialidad
                          </label>
                          <input
                            type="text"
                            value={createCustomSpecialty}
                            onChange={(e) => setCreateCustomSpecialty(e.target.value)}
                            placeholder="Ej: Radiología Maxilofacial"
                            className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-900 text-xs"
                          />
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] uppercase text-slate-600 mb-1 font-semibold">
                            Registro SIS / Superintendencia
                          </label>
                          <input
                            type="text"
                            value={createSisRegistration}
                            onChange={(e) => setCreateSisRegistration(e.target.value)}
                            placeholder="Ej: SIS-84920"
                            className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-900 text-xs"
                          />
                        </div>

                        <div className="flex items-center pt-4">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={createSyncWithCmsDoctors}
                              onChange={(e) => setCreateSyncWithCmsDoctors(e.target.checked)}
                              className="rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                            />
                            <span className="text-[10px] text-slate-700">
                              Vincular a nómina de doctores del sitio web (CMS)
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* RECEPCION FIELDS */}
                  {createRole === "recepcion" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] uppercase text-slate-600 mb-1 font-semibold">
                          Turno & Horario
                        </label>
                        <select
                          value={createShift}
                          onChange={(e) => setCreateShift(e.target.value)}
                          className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-900 text-xs"
                        >
                          {RECEPTION_SHIFTS.map((sh) => (
                            <option key={sh} value={sh}>
                              {sh}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase text-slate-600 mb-1 font-semibold">
                          Ubicación de Atención
                        </label>
                        <input
                          type="text"
                          value={createAssignedDesk}
                          onChange={(e) => setCreateAssignedDesk(e.target.value)}
                          placeholder="Recepción Central Suecia 3580"
                          className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-900 text-xs"
                        />
                      </div>
                    </div>
                  )}

                  {/* ADMIN FIELDS */}
                  {createRole === "admin" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] uppercase text-slate-600 mb-1 font-semibold">
                          Cargo / Área de Dirección *
                        </label>
                        <select
                          value={createPositionTitle}
                          onChange={(e) => setCreatePositionTitle(e.target.value)}
                          className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-900 text-xs"
                        >
                          {ADMIN_POSITIONS.map((pos) => (
                            <option key={pos} value={pos}>
                              {pos}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase text-slate-600 mb-1 font-semibold">
                          Nivel de Privilegios
                        </label>
                        <input
                          type="text"
                          disabled
                          value="Acceso Total (CMS, Fichas, Finanzas, Usuarios)"
                          className="w-full px-3 py-1.5 bg-slate-200 border border-slate-300 rounded text-slate-700 text-xs"
                        />
                      </div>
                    </div>
                  )}

                  {/* PACIENTE FIELDS */}
                  {createRole === "paciente" && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[10px] uppercase text-slate-600 mb-1 font-semibold">
                          Previsión de Salud
                        </label>
                        <select
                          value={createPrevision}
                          onChange={(e) => setCreatePrevision(e.target.value)}
                          className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-900 text-xs"
                        >
                          {HEALTH_PREVISIONS.map((prev) => (
                            <option key={prev} value={prev}>
                              {prev}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase text-slate-600 mb-1 font-semibold">
                          Convenio Club BeHappy
                        </label>
                        <select
                          value={createConvenioLevel}
                          onChange={(e) => setCreateConvenioLevel(e.target.value as any)}
                          className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-900 text-xs"
                        >
                          <option value="20%">20% (Plan Preventivo)</option>
                          <option value="40%">40% (Plan Oro)</option>
                          <option value="60%">60% (Plan Corporativo)</option>
                          <option value="Ninguno">Ninguno</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase text-slate-600 mb-1 font-semibold">
                          Contacto Emergencia
                        </label>
                        <input
                          type="text"
                          value={createEmergencyContact}
                          onChange={(e) => setCreateEmergencyContact(e.target.value)}
                          placeholder="Nombre y Teléfono"
                          className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-900 text-xs"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* PASSWORD SETUP & GENERATOR */}
                <div className="bg-emerald-50/60 border border-emerald-200 rounded-lg p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-[11px] font-mono uppercase text-emerald-950 font-bold flex items-center gap-1.5">
                      <Key className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Contraseña de Acceso para Entregar *</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setCreatePassword(generateSuggestedPassword(createRole))}
                      className="text-[10px] text-emerald-800 hover:text-emerald-950 font-bold flex items-center gap-1 underline cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3 text-emerald-600" />
                      Generar Contraseña Segura
                    </button>
                  </div>

                  <div className="relative">
                    <input
                      type={showCreatePasswordToggle ? "text" : "password"}
                      required
                      value={createPassword}
                      onChange={(e) => setCreatePassword(e.target.value)}
                      placeholder="Ej: BeHappy2026!"
                      className="w-full pl-3 pr-10 py-2 bg-white border border-emerald-300 rounded text-slate-900 text-xs font-mono font-bold focus:outline-none focus:border-emerald-600"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCreatePasswordToggle(!showCreatePasswordToggle)}
                      className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-700 cursor-pointer"
                    >
                      {showCreatePasswordToggle ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  <p className="text-[10px] text-emerald-800 leading-relaxed font-light">
                    Esta es la contraseña que entregarás a la persona para que inicie sesión en{" "}
                    <strong>/login</strong>. Puedes enviársela de inmediato por WhatsApp o ver la ficha completa.
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center justify-between gap-2.5 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 border border-slate-300 rounded text-xs font-mono uppercase text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                  >
                    Cancelar
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCreateAndShareWhatsApp}
                      className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs font-mono uppercase rounded-md shadow-md transition flex items-center gap-1.5 cursor-pointer"
                      title="Guarda la cuenta y abre WhatsApp Web para enviar las credenciales"
                    >
                      <Phone className="w-4 h-4" />
                      <span>Compartir por WhatsApp</span>
                    </button>

                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-slate-900 hover:bg-black text-white font-bold text-xs font-mono uppercase rounded-md shadow-md transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Guardar & Ver Ficha</span>
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* ========================================================================= */}
            {/* SUB-VIEW 2: COMPARTIR CUENTAS CON PROFESIONALES */}
            {/* ========================================================================= */}
            {createModalTab === "compartir" && (
              <div className="space-y-4 font-mono text-xs">
                {/* Search & Filter Bar */}
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                    <input
                      type="text"
                      placeholder="Buscar por especialista, especialidad o Box..."
                      value={shareSearch}
                      onChange={(e) => setShareSearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded text-slate-900 text-xs focus:outline-none focus:border-slate-900"
                    />
                  </div>

                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                    <span className="text-[10px] text-slate-500 uppercase font-bold">Filtro:</span>
                    {(["doctor", "recepcion", "admin", "todos"] as const).map((f) => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => setShareFilter(f)}
                        className={`px-2.5 py-1 rounded text-[10px] uppercase font-bold transition cursor-pointer ${
                          shareFilter === f
                            ? "bg-slate-900 text-white"
                            : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {f === "doctor"
                          ? `Especialistas (${users.filter((u) => u.role === "doctor").length})`
                          : f === "recepcion"
                          ? `Recepción (${users.filter((u) => u.role === "recepcion").length})`
                          : f === "admin"
                          ? `Admins (${users.filter((u) => u.role === "admin").length})`
                          : "Todos"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Professionals List */}
                <div className="max-h-[55vh] overflow-y-auto space-y-2.5 pr-1 divide-y divide-slate-100">
                  {(() => {
                    const shareList = users.filter((u) => {
                      if (shareFilter !== "todos" && u.role !== shareFilter) return false;
                      if (!shareSearch.trim()) return true;
                      const term = shareSearch.toLowerCase();
                      return (
                        u.fullName.toLowerCase().includes(term) ||
                        u.email.toLowerCase().includes(term) ||
                        (u.specialty && u.specialty.toLowerCase().includes(term)) ||
                        (u.boxAssigned && u.boxAssigned.toLowerCase().includes(term)) ||
                        (u.clinicalRegistrationNumber && u.clinicalRegistrationNumber.toLowerCase().includes(term)) ||
                        (u.positionTitle && u.positionTitle.toLowerCase().includes(term))
                      );
                    });

                    if (shareList.length === 0) {
                      return (
                        <div className="p-8 text-center text-slate-500 space-y-1">
                          <Users className="w-6 h-6 text-slate-400 mx-auto" />
                          <p className="text-xs font-semibold">No se encontraron profesionales con ese filtro</p>
                          <p className="text-[11px] text-slate-400">Intenta con otro término de búsqueda o selecciona &quot;Todos&quot;.</p>
                        </div>
                      );
                    }

                    return shareList.map((prof) => {
                      return (
                        <div
                          key={prof.id}
                          className="pt-2.5 first:pt-0 p-3 bg-slate-50/70 border border-slate-200 rounded-lg hover:border-slate-300 hover:bg-white transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                        >
                          <div className="flex items-start gap-3">
                            <div className="relative w-12 h-12 rounded-full overflow-hidden bg-white border border-slate-300 shrink-0">
                              {prof.avatarUrl ? (
                                <Image
                                  src={prof.avatarUrl}
                                  alt={prof.fullName}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center font-bold text-xs uppercase bg-slate-200 text-slate-700">
                                  {prof.fullName.slice(0, 2)}
                                </div>
                              )}
                            </div>

                            <div className="space-y-1">
                              <div className="flex flex-wrap items-center gap-1.5">
                                <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{prof.fullName}</h4>
                                {prof.boxAssigned && (
                                  <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-blue-100 text-blue-800 border border-blue-200">
                                    {prof.boxAssigned}
                                  </span>
                                )}
                                {prof.clinicalRegistrationNumber && (
                                  <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                    {prof.clinicalRegistrationNumber}
                                  </span>
                                )}
                              </div>

                              <p className="text-[11px] text-slate-600 font-sans">
                                {prof.specialty || prof.shift || prof.positionTitle || "Profesional BeHappy"}
                              </p>

                              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-mono text-slate-500 pt-0.5">
                                <span className="flex items-center gap-1">
                                  <Mail className="w-3 h-3 text-slate-400" />
                                  <strong className="text-slate-800">{prof.email}</strong>
                                </span>
                                <span className="flex items-center gap-1">
                                  <Lock className="w-3 h-3 text-emerald-600" />
                                  Clave:{" "}
                                  <span className="font-bold text-slate-900 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 select-all">
                                    {prof.password || "BeHappy2026!"}
                                  </span>
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Share Buttons */}
                          <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                            {/* WhatsApp Button */}
                            <a
                              href={`https://wa.me/${(prof.phone || "+56947578597").replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                                formatCredentialDeliveryMessage(prof)
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold rounded shadow-xs transition flex items-center gap-1.5"
                              title={`Enviar mensaje con accesos por WhatsApp a ${prof.fullName}`}
                            >
                              <Phone className="w-3.5 h-3.5" />
                              <span>WhatsApp</span>
                            </a>

                            {/* Copy Message */}
                            <button
                              type="button"
                              onClick={() => handleCopySingleProfessional(prof)}
                              className="p-1.5 border border-slate-300 hover:border-slate-800 rounded bg-white text-slate-700 transition cursor-pointer"
                              title="Copiar mensaje de credenciales al portapapeles"
                            >
                              {copiedSingleId === prof.id ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>

                            {/* Full Card */}
                            <button
                              type="button"
                              onClick={() => {
                                setHandoffUser(prof);
                                setShowHandoffModal(true);
                              }}
                              className="p-1.5 border border-slate-300 hover:border-slate-800 rounded bg-white text-slate-700 transition cursor-pointer"
                              title="Ver ficha completa de entrega"
                            >
                              <FileCheck className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>

                {/* Footer inside Compartir */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setCreateModalTab("crear")}
                    className="text-xs text-slate-600 hover:text-slate-900 font-mono font-bold flex items-center gap-1 cursor-pointer"
                  >
                    ← Volver a Invitar / Crear Nuevo
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 border border-slate-300 rounded text-xs font-mono uppercase text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: FICHA DE ENTREGA DE CREDENCIALES (PARA WHATSAPP / CORREO) */}
      {/* ========================================================================= */}
      {showHandoffModal && handoffUser && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white border border-slate-300 rounded-xl max-w-lg w-full p-5 sm:p-6 space-y-4 shadow-2xl my-8">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-emerald-700 uppercase font-bold block">
                    LISTO PARA ENTREGAR
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    Ficha de Credenciales de Acceso
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setShowHandoffModal(false)}
                className="text-slate-400 hover:text-slate-800 p-1 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Credential Card Preview */}
            <div className="bg-slate-900 text-white p-4 sm:p-5 rounded-lg space-y-3 font-mono text-xs shadow-inner">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                  CENTRO DENTAL BEHAPPY · SEDE SUECIA 3580
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-white/10 text-slate-200">
                  {handoffUser.role}
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="text-sm font-bold text-white">{handoffUser.fullName}</div>
                {handoffUser.role === "doctor" && (
                  <div className="text-xs text-blue-300">
                    {handoffUser.specialty || "Cuerpo Médico"} {handoffUser.boxAssigned ? `· ${handoffUser.boxAssigned}` : ""}
                  </div>
                )}
                {handoffUser.role === "recepcion" && (
                  <div className="text-xs text-amber-300">
                    {handoffUser.shift || "Recepción"} · {handoffUser.assignedDesk || "Sede Suecia"}
                  </div>
                )}
                {handoffUser.role === "admin" && (
                  <div className="text-xs text-purple-300">
                    {handoffUser.positionTitle || "Dirección & Administración"} · Control Total
                  </div>
                )}
                {handoffUser.role === "paciente" && (
                  <div className="text-xs text-teal-300">
                    Previsión: {handoffUser.prevision || "Fonasa"} · Club: {handoffUser.convenioLevel || "20%"}
                  </div>
                )}
              </div>

              <div className="bg-slate-950/80 p-3 rounded border border-slate-800 space-y-2 mt-2">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-400">Usuario / Correo:</span>
                  <span className="font-bold text-white select-all">{handoffUser.email}</span>
                </div>
                {handoffUser.rut && (
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-400">RUT:</span>
                    <span className="text-slate-200 select-all">{handoffUser.rut}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-[11px] pt-1 border-t border-slate-800">
                  <span className="text-slate-400">Contraseña Asignada:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-emerald-400 text-sm select-all">
                      {handoffUser.password || "BeHappy2026!"}
                    </span>
                    <button
                      onClick={() => handleCopyPasswordOnly(handoffUser.password || "BeHappy2026!")}
                      title="Copiar contraseña"
                      className="p-1 hover:bg-slate-800 rounded text-slate-300"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-400">Portal de Acceso:</span>
                  <span className="text-blue-300 underline text-[10px]">
                    {typeof window !== "undefined" ? `${window.location.origin}/login` : "https://behappydental.cl/login"}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-2 pt-1 font-mono text-xs">
              <button
                onClick={handleCopyFullMessage}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg shadow-md transition flex items-center justify-center gap-2 uppercase tracking-wider text-xs"
              >
                {copiedHandoff ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedHandoff ? "¡Mensaje Copiado al Portapapeles!" : "Copiar Ficha para WhatsApp / Correo"}</span>
              </button>

              {handoffUser.phone && (
                <a
                  href={`https://wa.me/${handoffUser.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                    formatCredentialDeliveryMessage(handoffUser)
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-lg transition flex items-center justify-center gap-2 uppercase tracking-wider text-xs border border-slate-300"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Abrir WhatsApp Web con este Mensaje</span>
                </a>
              )}

              <button
                onClick={() => setShowHandoffModal(false)}
                className="w-full py-2 text-slate-500 hover:text-slate-800 text-[11px] uppercase transition font-bold"
              >
                Listo / Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: EDITAR PERFIL COMPLETO */}
      {/* ========================================================================= */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white border border-slate-300 rounded-xl max-w-lg w-full p-5 sm:p-6 space-y-4 shadow-2xl my-8">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase font-bold block">
                  EDICIÓN ADMINISTRATIVA
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  Editar Perfil & Credenciales
                </h3>
              </div>
              <button
                onClick={() => setEditingUser(null)}
                className="text-slate-400 hover:text-slate-800 p-1 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-3 font-mono text-xs">
              <div>
                <label className="block text-[11px] uppercase text-slate-700 mb-1 font-semibold">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  required
                  value={editingUser.fullName}
                  onChange={(e) => setEditingUser({ ...editingUser, fullName: e.target.value })}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-900 text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] uppercase text-slate-700 mb-1 font-semibold">
                    Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    required
                    value={editingUser.email}
                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-900 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase text-slate-700 mb-1 font-semibold">
                    RUT
                  </label>
                  <input
                    type="text"
                    value={editingUser.rut || ""}
                    onChange={(e) => setEditingUser({ ...editingUser, rut: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-900 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] uppercase text-slate-700 mb-1 font-semibold">
                    Teléfono
                  </label>
                  <input
                    type="text"
                    value={editingUser.phone || ""}
                    onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-900 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase text-slate-700 mb-1 font-semibold">
                    Rol Asignado *
                  </label>
                  <select
                    value={editingUser.role}
                    onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as UserRole })}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-900 text-xs font-bold"
                  >
                    <option value="doctor">Doctor</option>
                    <option value="recepcion">Recepción</option>
                    <option value="admin">Admin</option>
                    <option value="paciente">Paciente</option>
                  </select>
                </div>
              </div>

              {/* Doctor Specific */}
              {editingUser.role === "doctor" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-blue-50/50 p-2.5 rounded border border-blue-200">
                  <div>
                    <label className="block text-[10px] uppercase text-blue-900 mb-1 font-semibold">
                      Especialidad
                    </label>
                    <input
                      type="text"
                      value={editingUser.specialty || ""}
                      onChange={(e) => setEditingUser({ ...editingUser, specialty: e.target.value })}
                      placeholder="Ortodoncia e Invisalign®"
                      className="w-full px-3 py-1.5 bg-white border border-blue-300 rounded text-slate-900 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase text-blue-900 mb-1 font-semibold">
                      Box Asignado
                    </label>
                    <input
                      type="text"
                      value={editingUser.boxAssigned || ""}
                      onChange={(e) => setEditingUser({ ...editingUser, boxAssigned: e.target.value })}
                      placeholder="Box 1"
                      className="w-full px-3 py-1.5 bg-white border border-blue-300 rounded text-slate-900 text-xs"
                    />
                  </div>
                </div>
              )}

              {/* Recepcion Specific */}
              {editingUser.role === "recepcion" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-amber-50/50 p-2.5 rounded border border-amber-200">
                  <div>
                    <label className="block text-[10px] uppercase text-amber-900 mb-1 font-semibold">
                      Turno
                    </label>
                    <input
                      type="text"
                      value={editingUser.shift || ""}
                      onChange={(e) => setEditingUser({ ...editingUser, shift: e.target.value })}
                      placeholder="Jornada Completa"
                      className="w-full px-3 py-1.5 bg-white border border-amber-300 rounded text-slate-900 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase text-amber-900 mb-1 font-semibold">
                      Puesto
                    </label>
                    <input
                      type="text"
                      value={editingUser.assignedDesk || ""}
                      onChange={(e) => setEditingUser({ ...editingUser, assignedDesk: e.target.value })}
                      placeholder="Recepción Central Suecia 3580"
                      className="w-full px-3 py-1.5 bg-white border border-amber-300 rounded text-slate-900 text-xs"
                    />
                  </div>
                </div>
              )}

              {/* Admin Specific */}
              {editingUser.role === "admin" && (
                <div className="bg-purple-50/50 p-2.5 rounded border border-purple-200">
                  <label className="block text-[10px] uppercase text-purple-900 mb-1 font-semibold">
                    Cargo / Dirección
                  </label>
                  <input
                    type="text"
                    value={editingUser.positionTitle || ""}
                    onChange={(e) => setEditingUser({ ...editingUser, positionTitle: e.target.value })}
                    placeholder="Dirección Médica"
                    className="w-full px-3 py-1.5 bg-white border border-purple-300 rounded text-slate-900 text-xs"
                  />
                </div>
              )}

              {/* Paciente Specific */}
              {editingUser.role === "paciente" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-teal-50/50 p-2.5 rounded border border-teal-200">
                  <div>
                    <label className="block text-[10px] uppercase text-teal-900 mb-1 font-semibold">
                      Previsión
                    </label>
                    <input
                      type="text"
                      value={editingUser.prevision || ""}
                      onChange={(e) => setEditingUser({ ...editingUser, prevision: e.target.value })}
                      placeholder="Fonasa"
                      className="w-full px-3 py-1.5 bg-white border border-teal-300 rounded text-slate-900 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase text-teal-900 mb-1 font-semibold">
                      Convenio Club
                    </label>
                    <select
                      value={editingUser.convenioLevel || "20%"}
                      onChange={(e) => setEditingUser({ ...editingUser, convenioLevel: e.target.value as any })}
                      className="w-full px-3 py-1.5 bg-white border border-teal-300 rounded text-slate-900 text-xs"
                    >
                      <option value="20%">20%</option>
                      <option value="40%">40%</option>
                      <option value="60%">60%</option>
                      <option value="Ninguno">Ninguno</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Password */}
              <div>
                <label className="block text-[11px] uppercase text-slate-700 mb-1 font-semibold">
                  Contraseña
                </label>
                <input
                  type="text"
                  value={editingUser.password || ""}
                  onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })}
                  placeholder="Escribe nueva contraseña o conserva la actual"
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-900 text-xs font-mono font-bold"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 border border-slate-300 rounded text-xs font-mono uppercase text-slate-600 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 hover:bg-black text-white font-bold text-xs font-mono uppercase rounded shadow-sm"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: CAMBIO RÁPIDO DE CONTRASEÑA */}
      {/* ========================================================================= */}
      {passwordTargetUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white border border-slate-300 rounded-xl max-w-sm w-full p-5 space-y-3 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Asignar Nueva Contraseña
                </h3>
              </div>
              <button
                onClick={() => setPasswordTargetUser(null)}
                className="text-slate-400 hover:text-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 font-mono">
              Para: <strong>{passwordTargetUser.fullName}</strong> ({passwordTargetUser.email})
            </p>

            <form onSubmit={handleQuickPasswordSubmit} className="space-y-3 font-mono text-xs">
              <div className="relative">
                <input
                  type={showQuickPassToggle ? "text" : "password"}
                  required
                  value={newQuickPassword}
                  onChange={(e) => setNewQuickPassword(e.target.value)}
                  placeholder="Escribe la nueva contraseña"
                  className="w-full pl-3 pr-10 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 text-xs font-mono font-bold focus:outline-none focus:border-slate-900 focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowQuickPassToggle(!showQuickPassToggle)}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-700"
                >
                  {showQuickPassToggle ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <div className="flex justify-between items-center text-[10px]">
                <button
                  type="button"
                  onClick={() => setNewQuickPassword(generateSuggestedPassword(passwordTargetUser.role))}
                  className="text-emerald-700 font-bold hover:underline flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" /> Generar aleatoria
                </button>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setPasswordTargetUser(null)}
                  className="px-3 py-1.5 border border-slate-300 rounded text-xs font-mono uppercase text-slate-600"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-slate-900 hover:bg-black text-white font-bold text-xs font-mono uppercase rounded"
                >
                  Actualizar Clave
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: CONFIRMACIÓN DE ELIMINACIÓN */}
      {/* ========================================================================= */}
      {deletingUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white border border-red-200 rounded-xl max-w-sm w-full p-5 space-y-3 shadow-xl">
            <div className="flex items-center gap-2 text-red-600 border-b border-red-100 pb-2">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <h3 className="text-sm font-bold text-slate-900">¿Eliminar este usuario?</h3>
            </div>

            <p className="text-xs text-slate-600 font-mono leading-relaxed">
              ¿Estás seguro de que deseas eliminar el acceso de <strong>{deletingUser.fullName}</strong> ({deletingUser.email})?
              Esta acción revocará sus credenciales de inmediato.
            </p>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 font-mono text-xs">
              <button
                type="button"
                onClick={() => setDeletingUser(null)}
                className="px-3 py-1.5 border border-slate-300 rounded uppercase text-slate-600 hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold uppercase rounded"
              >
                Eliminar Definitivamente
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
