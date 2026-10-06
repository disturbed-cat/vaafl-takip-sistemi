import {
  LayoutDashboard, Users, School, Compass, ShieldCheck, GraduationCap,
  Eye, BookOpen, Home, Menu, X, Plus, Search, Trash2, LogOut, TrendingUp,
  Target, ClipboardCheck, CheckCircle2, XCircle, AlertTriangle, ChevronDown, ChevronRight,
  KeyRound, Printer, LayoutGrid, DoorOpen, Presentation, CalendarPlus, CalendarDays, Pencil,
  Check, MessageCircle, ChevronLeft, ImagePlus, CalendarClock,
} from "lucide-react";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { createPortal } from "react-dom";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";



const SUPABASE_URL = "https://ufqpguvxoksdeeansfpy.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVmcXBndXZ4b2tzZGVlYW5zZnB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg5NzAxNTIsImV4cCI6MjEwNDU0NjE1Mn0.IRPVtNtLhI3StzKZEoejmSwlY2yMUpeSyfcI54fOsbM";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


const COLORS = {
  bg: "#F5F5F7",
  text: "#1D1D1F",
  textSecondary: "#6E6E73",
  blue: "#0071E3",
  indigo: "#5E5CE6",
  teal: "#30B0C7",
  orange: "#FF9500",
  green: "#34C759",
  pink: "#FF375F",
  red: "#FF3B30",
};

const ROLE_CONFIG = {
  admin: { label: "Müdür", color: COLORS.blue, icon: ShieldCheck },
  teacher: { label: "Sınıf Rehber Öğretmeni", color: COLORS.indigo, icon: GraduationCap },
  coach: { label: "Koç", color: COLORS.teal, icon: Compass },
  counselor: { label: "Okul Rehber Öğretmeni", color: COLORS.orange, icon: Eye },
  student: { label: "Öğrenci", color: COLORS.green, icon: BookOpen },
  parent: { label: "Veli", color: COLORS.pink, icon: Home },
};

const STATUS_CONFIG = {
  yapiyor: { label: "Yapıyor", color: COLORS.blue },
  yapildi: { label: "Yapıldı", color: COLORS.green },
  yapilmadi: { label: "Yapılmadı", color: COLORS.red },
  eksik_yapildi: { label: "Eksik Yapıldı", color: COLORS.orange },
};

const TYPE_LABEL = { soru: "Soru", ders: "Ders", test: "Test" };

function sourceLabel(t) {
  if (t.type === "soru") {
    const parts = [];
    if (t.publisher) parts.push(t.publisher);
    if (t.sourceName) parts.push(t.sourceName);
    if (t.pageRange) parts.push(`s. ${t.pageRange}`);
    return parts.join(" · ");
  }
  if (t.type === "test") {
    const parts = [];
    if (t.publisher) parts.push(t.publisher);
    if (t.sourceName) parts.push(t.sourceName);
    return parts.join(" · ");
  }
  return "";
}

const glassCard = {
  background: "rgba(255,255,255,0.78)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "1px solid rgba(255,255,255,0.6)",
  boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
};

const sidebarStyle = {
  background: "rgba(255,255,255,0.6)",
  backdropFilter: "blur(30px)",
  WebkitBackdropFilter: "blur(30px)",
  borderRight: "1px solid rgba(0,0,0,0.06)",
};

function GlobalStyles() {
  return (
    <style>{`
      @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
      @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      @keyframes scaleIn { from { opacity: 0; transform: scale(0.94); } to { opacity: 1; transform: scale(1); } }
      @keyframes spin { to { transform: rotate(360deg); } }
      @keyframes pulseSoft { 0%, 100% { opacity: 1; } 50% { opacity: 0.55; } }
      @keyframes shimmerGlow { 0%, 100% { box-shadow: 0 0 0 0 rgba(0,113,227,0.25); } 50% { box-shadow: 0 0 0 6px rgba(0,113,227,0); } }

      .page-content { animation: fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) both; }
      .modal-backdrop-anim { animation: fadeIn 0.2s ease both; }
      .modal-content-anim { animation: scaleIn 0.28s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
      .stagger-item { animation: fadeInUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) both; }
      .stagger-grid > *:nth-child(1) { animation-delay: 0.02s; }
      .stagger-grid > *:nth-child(2) { animation-delay: 0.06s; }
      .stagger-grid > *:nth-child(3) { animation-delay: 0.10s; }
      .stagger-grid > *:nth-child(4) { animation-delay: 0.14s; }
      .stagger-grid > *:nth-child(5) { animation-delay: 0.18s; }
      .stagger-grid > *:nth-child(6) { animation-delay: 0.22s; }
      .spin-anim { animation: spin 0.9s linear infinite; }
      .pulse-anim { animation: pulseSoft 1.6s ease-in-out infinite; }
      .glow-anim { animation: shimmerGlow 2.2s ease-in-out infinite; }

      button { transition: transform 0.15s cubic-bezier(0.4,0,0.2,1), background-color 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease, border-color 0.2s ease, filter 0.2s ease; }
      button:active:not(:disabled) { transform: scale(0.96); }
      button:disabled { cursor: not-allowed; }

      .card-hover { transition: transform 0.25s cubic-bezier(0.16,1,0.3,1), box-shadow 0.25s ease; }
      .card-hover:hover { transform: translateY(-3px); box-shadow: 0 14px 32px rgba(0,0,0,0.1); }

      .nav-btn { transition: background-color 0.2s ease, color 0.2s ease, transform 0.15s ease; }
      .nav-btn:hover { background-color: rgba(0,113,227,0.08); }
      .nav-btn:active { transform: scale(0.98); }

      .lift-hover:hover { filter: brightness(1.06); transform: translateY(-1px); box-shadow: 0 6px 18px rgba(0,0,0,0.15); }

      ::-webkit-scrollbar { width: 8px; height: 8px; }
      ::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.15); border-radius: 8px; }
      ::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,0.25); }
            .print-only { display: none; }
      @media print {
        @page { size: A4; margin: 12mm; }
        body > *:not(.print-only) { display: none !important; }
        .print-only { display: block !important; }
      }
    `}</style>
  );
}

const FONT = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';



// StackBlitz'te public klasörüne logo.png adıyla logo dosyasını ekleyin — otomatik burada görünecek
const LOGO_URL = "/logo.png";

// Veli hesabı olmayanlar için — kendi Google Form linkinizle değiştirin

/* ------------------------------------------------------------------ */
/* Randevu Sistemi — sabitler ve tarih/saat yardımcıları                */
/* ------------------------------------------------------------------ */

const MONTH_NAMES = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];


function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

/* ------------------------------------------------------------------ */
/* Ders Programı — sabitler                                             */
/* ------------------------------------------------------------------ */

const MAIN_SUBJECTS = [
  "Matematik", "Fizik", "Kimya", "Biyoloji", "Türk Dili ve Edebiyatı", "Coğrafya", "Tarih",
  "Yabancı Dil (İngilizce)", "Din Kültürü ve Ahlâk Bilgisi", "Bilgisayar Bilimi", "Beden Eğitimi",
  "Sağlık Bilgisi ve Trafik Kültürü",
];
const ELECTIVE_SUBJECTS = [
  "Astronomi ve Uzay Bilimleri", "Mantık", "Felsefe", "Psikoloji", "Sosyoloji", "İslam Bilim Tarihi",
  "Diksiyon ve Hitabet", "Ekonomi", "Girişimcilik", "Drama", "Sanat Tarihi", "Bilgi Kuramı",
  "Bilişim Proje Hazırlama",
];
const CODE_PREFIX = { student: "OGR", teacher: "OGT", coach: "KOC", counselor: "REH", parent: "VEL" };
const SEQ_NAME = { student: "public.student_code_seq", teacher: "public.teacher_code_seq", coach: "public.coach_code_seq", counselor: "public.counselor_code_seq", parent: "public.parent_code_seq" };

const WEEKDAY_LABELS = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma"];
const PERIOD_TIMES = [
  { period: 1, start: "08:10", end: "08:50" },
  { period: 2, start: "09:05", end: "09:45" },
  { period: 3, start: "10:00", end: "10:40" },
  { period: 4, start: "10:50", end: "11:30" },
  { period: 5, start: "11:40", end: "12:20" },
  { period: 6, start: "13:00", end: "13:40" },
  { period: 7, start: "13:50", end: "14:30" },
  { period: 8, start: "14:30", end: "15:10" },
];

const ADMIN_NAV = [
  { id: "overview", label: "Genel Bakış", icon: LayoutDashboard },
  { id: "users", label: "Kullanıcılar", icon: Users },
  { id: "classes", label: "Sınıflar", icon: School },
  { id: "coaching", label: "Koç Atamaları", icon: Compass },
  { id: "credentials", label: "Şifreler", icon: KeyRound },
  { id: "schedule", label: "Ders Programı", icon: CalendarClock },
];

const TC_NAV = [
  { id: "overview", label: "Genel Bakış", icon: LayoutDashboard },
  { id: "students", label: "Öğrencilerim", icon: Users },
  { id: "myclasses", label: "Sınıflarım", icon: School },
  { id: "exams", label: "Sınavlar", icon: BookOpen },
  { id: "targets", label: "Hedefler", icon: Target },
  { id: "verify", label: "Doğrulama", icon: ClipboardCheck },
];

const CN_NAV = [
  { id: "overview", label: "Genel Bakış", icon: LayoutDashboard },
  { id: "classes", label: "Sınıflar", icon: School },
  { id: "students", label: "Öğrenciler", icon: Users },
  { id: "coaching", label: "Koçlar", icon: Compass },
];

const PROGRESS_NAV = [
  { id: "overview", label: "Genel Bakış", icon: LayoutDashboard },
  { id: "targets", label: "Hedefler", icon: Target },
  { id: "summary", label: "Sınıf Özeti", icon: MessageCircle },
];

function computeProgress(studentId, allStudentTargets) {
  const mine = allStudentTargets.filter((st) => st.student_id === studentId);
  if (mine.length === 0) return 0;
  const score = mine.reduce((sum, st) => {
    if (st.status === "yapildi") return sum + 1;
    if (st.status === "eksik_yapildi") return sum + 0.5;
    return sum;
  }, 0);
  return Math.round((score / mine.length) * 100);
}

function buildUsers(profiles, students, classes, studentTargets) {
  const studentExtra = Object.fromEntries(students.map((s) => [s.id, s]));
  const classByTeacher = Object.fromEntries(classes.filter((c) => c.teacher_id).map((c) => [c.teacher_id, c.id]));

  return profiles.map((p) => {
    const base = { id: p.id, name: p.full_name, role: p.role, email: p.email };
    if (p.role === "teacher") {
      base.classId = classByTeacher[p.id] || null;
    }
    if (p.role === "student") {
      const extra = studentExtra[p.id] || {};
      base.classId = extra.class_id || null;
      base.coachId = extra.coach_id || null;
      base.parentId = extra.parent_id || null;
      base.progress = computeProgress(p.id, studentTargets);
    }
    if (p.role === "parent") {
      const child = students.find((s) => s.parent_id === p.id);
      base.childId = child ? child.id : null;
    }
    return base;
  });
}

const mapClasses = (rows) => rows.map((c) => ({ id: c.id, name: c.name, level: c.grade_level, teacherId: c.teacher_id || null, seatingChart: c.seating_chart || null }));

const mapTargets = (rows) => rows.map((t) => ({
  id: t.id, title: t.title, type: t.type, targetValue: t.target_value,
  description: t.description, dueDate: t.due_date, createdBy: t.created_by,
  createdAt: t.created_at, assignmentLabel: t.assignment_label,
  publisher: t.publisher, sourceName: t.source_name, pageRange: t.page_range,
}));

const mapStudentTargets = (rows) => rows.map((st) => ({
  id: st.id, targetId: st.target_id, studentId: st.student_id, status: st.status,
  solvedCount: st.solved_count, correctCount: st.correct_count, wrongCount: st.wrong_count,
  submittedAt: st.submitted_at, verifiedBy: st.verified_by, verifiedAt: st.verified_at,
}));


const mapBookChecks = (rows) => rows.map((r) => ({
  id: r.id, studentId: r.student_id, classId: r.class_id, checkedBy: r.checked_by, date: r.check_date, status: r.status,
}));

const mapBehaviorEvents = (rows) => rows.map((r) => ({
  id: r.id, studentId: r.student_id, classId: r.class_id, createdBy: r.created_by, date: r.event_date, type: r.type,
}));

const mapComments = (rows) => rows.map((r) => ({
  id: r.id, studentId: r.student_id, classId: r.class_id, createdBy: r.created_by, date: r.comment_date, text: r.comment, createdAt: r.created_at,
}));

const mapAnnouncements = (rows) => rows.map((a) => ({
  id: a.id, title: a.title, body: a.body, imageUrl: a.image_url,
  createdBy: a.created_by, audienceType: a.audience_type, classId: a.class_id, createdAt: a.created_at,
}));

const mapTeacherSubjects = (rows) => rows.map((r) => ({ id: r.id, teacherId: r.teacher_id, subject: r.subject }));
const mapScheduleSlots = (rows) => rows.map((r) => ({ id: r.id, teacherId: r.teacher_id, day: r.day_of_week, period: r.period, subject: r.subject, classId: r.class_id }));

// Tüm tabloları çeker ve UI'ın beklediği şekle çevirir
async function fetchAllData() {
  const [profilesRes, classesRes, studentsRes, targetsRes, studentTargetsRes, credentialsRes, bookChecksRes, behaviorEventsRes, commentsRes, announcementsRes, teacherSubjectsRes, scheduleSlotsRes] = await Promise.all([
    supabase.from("profiles").select("*"),
    supabase.from("classes").select("*"),
    supabase.from("students").select("*"),
    supabase.from("targets").select("*"),
    supabase.from("student_targets").select("*"),
    supabase.from("credentials").select("*"),
    supabase.from("book_checks").select("*"),
    supabase.from("behavior_events").select("*"),
    supabase.from("student_comments").select("*"),
    supabase.from("announcements").select("*"),
    supabase.from("teacher_subjects").select("*"),
    supabase.from("schedule_slots").select("*"),
  ]);

  const firstError = profilesRes.error || classesRes.error || studentsRes.error || targetsRes.error || studentTargetsRes.error;
  if (firstError) throw firstError;

  const rawStudentTargets = studentTargetsRes.data;
  return {
    users: buildUsers(profilesRes.data, studentsRes.data, classesRes.data, rawStudentTargets),
    classes: mapClasses(classesRes.data),
    targets: mapTargets(targetsRes.data),
    studentTargets: mapStudentTargets(rawStudentTargets),
    credentials: (credentialsRes.data || []).map((c) => ({ id: c.id, code: c.username_code, password: c.generated_password })),
    bookChecks: mapBookChecks(bookChecksRes.data || []),
    behaviorEvents: mapBehaviorEvents(behaviorEventsRes.data || []),
    studentComments: mapComments(commentsRes.data || []),
    announcements: mapAnnouncements(announcementsRes.data || []),
    teacherSubjects: mapTeacherSubjects(teacherSubjectsRes.data || []),
    scheduleSlots: mapScheduleSlots(scheduleSlotsRes.data || []),
  };
}

function initials(name) {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function Avatar({ name, color, size = 40 }) {
  return (
    <div
      style={{
        width: size, height: size, borderRadius: "50%",
        background: `${color}1A`, color,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontWeight: 600, fontSize: size * 0.38, flexShrink: 0,
      }}
    >
      {initials(name)}
    </div>
  );
}

function RoleBadge({ role }) {
  const cfg = ROLE_CONFIG[role];
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium" style={{ background: `${cfg.color}15`, color: cfg.color }}>
      {cfg.label}
    </span>
  );
}

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className="px-2.5 py-1 rounded-full text-xs font-medium flex-shrink-0" style={{ background: `${cfg.color}15`, color: cfg.color }}>
      {cfg.label}
    </span>
  );
}

function StatCard({ label, value, icon: Icon, color }) {
  return (
    <div className="rounded-2xl p-5 flex items-center gap-4 card-hover stagger-item" style={glassCard}>
      <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${color}15` }}>
        <Icon size={20} color={color} strokeWidth={2} />
      </div>
      <div className="min-w-0">
        <div className="text-2xl font-semibold" style={{ color: COLORS.text }}>{value}</div>
        <div className="text-sm truncate" style={{ color: COLORS.textSecondary }}>{label}</div>
      </div>
    </div>
  );
}

function FormInput({ label, ...props }) {
  return (
    <label className="block mb-4">
      <span className="block text-xs font-medium mb-1.5" style={{ color: COLORS.textSecondary }}>{label}</span>
      <input
        {...props}
        className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none transition"
        style={{ border: "1px solid rgba(0,0,0,0.1)", background: "#FAFAFA", color: COLORS.text }}
        onFocus={(e) => { e.target.style.border = `1px solid ${COLORS.blue}`; e.target.style.background = "#fff"; }}
        onBlur={(e) => { e.target.style.border = "1px solid rgba(0,0,0,0.1)"; e.target.style.background = "#FAFAFA"; }}
      />
    </label>
  );
}

function FormSelect({ label, children, ...props }) {
  return (
    <label className="block mb-4">
      <span className="block text-xs font-medium mb-1.5" style={{ color: COLORS.textSecondary }}>{label}</span>
      <select
        {...props}
        className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none transition"
        style={{ border: "1px solid rgba(0,0,0,0.1)", background: "#FAFAFA", color: COLORS.text }}
      >
        {children}
      </select>
    </label>
  );
}

function ModalShell({ title, onClose, children, width = 480 }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop-anim" style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }} onClick={onClose}>
      <div
        className="w-full rounded-3xl p-6 modal-content-anim"
        style={{ ...glassCard, background: "rgba(255,255,255,0.97)", maxWidth: width, maxHeight: "90vh", overflowY: "auto" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold" style={{ color: COLORS.text }}>{title}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition">
            <X size={18} color={COLORS.textSecondary} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function AddUserModal({ onClose, onSubmit, classes, coaches, students, defaultRole = "student" }) {
  const staffMode = defaultRole === "teacher";
  const roleOptions = staffMode
    ? [["teacher", "Öğretmen"], ["counselor", "Okul Rehber Öğretmeni"]]
    : [["student", "Öğrenci"], ["parent", "Veli"]];
  const [form, setForm] = useState({
    name: "", role: staffMode ? "teacher" : "student",
    classId: staffMode ? "" : (classes[0]?.id || ""), coachId: "", childId: students[0]?.id || "",
    subjects: [MAIN_SUBJECTS[0]], isCoach: false,
  });
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState(null);
  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const updateSubjectAt = (i, value) => {
    const next = [...form.subjects];
    next[i] = value;
    setForm({ ...form, subjects: next });
  };
  const addSubjectRow = () => {
    const remaining = [...MAIN_SUBJECTS, ...ELECTIVE_SUBJECTS].find((s) => !form.subjects.includes(s));
    if (!remaining) return;
    setForm({ ...form, subjects: [...form.subjects, remaining] });
  };
  const removeSubjectAt = (i) => setForm({ ...form, subjects: form.subjects.filter((_, idx) => idx !== i) });

  const handleSubmit = async () => {
    if (!form.name.trim()) return;
    if (form.role === "parent" && !form.childId) return;
    setSaving(true);
    const payload = { name: form.name.trim(), role: form.role };
    if (form.role === "teacher") {
      payload.subjects = form.subjects;
      if (form.isCoach) { payload.role = "coach"; payload.classId = null; }
      else payload.classId = form.classId || null;
    }
    if (form.role === "student") { payload.classId = form.classId || null; payload.coachId = form.coachId || null; }
    if (form.role === "parent") payload.childId = form.childId || null;
    const res = await onSubmit(payload);
    setSaving(false);
    setResult(res);
  };

  if (result) {
    return (
      <ModalShell title={result.error ? "Oluşturulamadı" : "Oluşturuldu"} onClose={onClose} width={420}>
        {result.error ? (
          <p className="text-sm mb-4" style={{ color: COLORS.red }}>{result.error}</p>
        ) : (
          <div className="rounded-xl p-4 mb-4" style={{ background: "rgba(0,0,0,0.02)" }}>
            <div className="text-sm font-medium mb-3" style={{ color: COLORS.text }}>{form.name.trim()}</div>
            <div className="flex items-center justify-between text-sm mb-1.5">
              <span style={{ color: COLORS.textSecondary }}>Kullanıcı Kodu</span>
              <span className="font-mono font-semibold" style={{ color: COLORS.blue }}>{result.code}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span style={{ color: COLORS.textSecondary }}>Şifre</span>
              <span className="font-mono font-semibold" style={{ color: COLORS.text }}>{result.password}</span>
            </div>
          </div>
        )}
        <button onClick={onClose} className="w-full py-3 rounded-xl text-sm font-semibold text-white transition" style={{ background: COLORS.blue }}>Tamam</button>
      </ModalShell>
    );
  }

  return (
    <ModalShell title={staffMode ? "Yeni Öğretmen Ekle" : "Yeni Kullanıcı Ekle"} onClose={onClose}>
      <FormSelect label="Rol" value={form.role} onChange={update("role")}>
        {roleOptions.map(([key, label]) => <option key={key} value={key}>{label}</option>)}
      </FormSelect>
      <FormInput label="Ad Soyad" placeholder="Örn. Ahmet Yıldız" value={form.name} onChange={update("name")} />

      {form.role === "teacher" && (
        <>
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="block text-xs font-medium" style={{ color: COLORS.textSecondary }}>Sorumlu Olacağı Sınıf (opsiyonel)</span>
              <label className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer" style={{ color: COLORS.text }}>
                <input type="checkbox" checked={form.isCoach} onChange={(e) => setForm({ ...form, isCoach: e.target.checked, classId: e.target.checked ? "" : form.classId })} />
                Koç
              </label>
            </div>
            <select
              value={form.classId}
              onChange={update("classId")}
              disabled={form.isCoach}
              className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none"
              style={{ border: "1px solid rgba(0,0,0,0.1)", background: form.isCoach ? "#EDEDED" : "#FAFAFA", color: COLORS.text, opacity: form.isCoach ? 0.6 : 1 }}
            >
              <option value="">Atanmadı</option>
              {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="mb-4">
            <span className="block text-xs font-medium mb-1.5" style={{ color: COLORS.textSecondary }}>Branş</span>
            {form.subjects.map((subj, i) => (
              <div key={i} className="flex items-center gap-2 mb-2">
                <select
                  value={subj}
                  onChange={(e) => updateSubjectAt(i, e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none"
                  style={{ border: "1px solid rgba(0,0,0,0.1)", background: "#FAFAFA", color: COLORS.text }}
                >
                  <optgroup label="Ana Branşlar">
                    {MAIN_SUBJECTS.filter((s) => s === subj || !form.subjects.includes(s)).map((s) => <option key={s} value={s}>{s}</option>)}
                  </optgroup>
                  <optgroup label="Seçmeli Dersler">
                    {ELECTIVE_SUBJECTS.filter((s) => s === subj || !form.subjects.includes(s)).map((s) => <option key={s} value={s}>{s}</option>)}
                  </optgroup>
                </select>
                {form.subjects.length > 1 && (
                  <button onClick={() => removeSubjectAt(i)} className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 hover:bg-gray-100 transition">
                    <X size={15} color={COLORS.textSecondary} />
                  </button>
                )}
              </div>
            ))}
            {form.subjects.length < MAIN_SUBJECTS.length + ELECTIVE_SUBJECTS.length && (
              <button onClick={addSubjectRow} className="text-xs font-semibold" style={{ color: COLORS.blue }}>+ Başka Ders Ekle</button>
            )}
          </div>
        </>
      )}
      {form.role === "student" && (
        <>
          <FormSelect label="Sınıf" value={form.classId} onChange={update("classId")}>
            {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </FormSelect>
          <FormSelect label="Koç (opsiyonel)" value={form.coachId} onChange={update("coachId")}>
            <option value="">Atanmadı — sonra Koç Atamaları'ndan atanabilir</option>
            {coaches.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </FormSelect>
        </>
      )}
      {form.role === "parent" && (
        <FormSelect label="Bağlı Olduğu Öğrenci" value={form.childId} onChange={update("childId")}>
          {students.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </FormSelect>
      )}

      <button onClick={handleSubmit} disabled={saving || !form.name.trim()} className="w-full mt-2 py-3 rounded-xl text-sm font-semibold text-white transition" style={{ background: COLORS.blue, opacity: (saving || !form.name.trim()) ? 0.6 : 1 }}>
        {saving ? "Oluşturuluyor..." : "Kullanıcıyı Oluştur"}
      </button>
    </ModalShell>
  );
}
function AddClassModal({ onClose, onSave, teachers }) {
  const [level, setLevel] = useState(9);
  const [section, setSection] = useState("A");
  const [teacherId, setTeacherId] = useState("");

  const handleSubmit = () => {
    onSave({ name: `${level}-${section}`, level: Number(level), teacherId: teacherId || null });
    onClose();
  };

  return (
    <ModalShell title="Yeni Sınıf Ekle" onClose={onClose} width={400}>
      <div className="grid grid-cols-2 gap-3">
        <FormSelect label="Kademe" value={level} onChange={(e) => setLevel(e.target.value)}>
          {[9, 10, 11, 12].map((l) => <option key={l} value={l}>{l}</option>)}
        </FormSelect>
        <FormSelect label="Şube" value={section} onChange={(e) => setSection(e.target.value)}>
          {["A", "B", "C", "D", "E"].map((s) => <option key={s} value={s}>{s}</option>)}
        </FormSelect>
      </div>
      <FormSelect label="Sınıf Rehber Öğretmeni (opsiyonel)" value={teacherId} onChange={(e) => setTeacherId(e.target.value)}>
        <option value="">Sonra atanacak</option>
        {teachers.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
      </FormSelect>
      <button onClick={handleSubmit} className="w-full mt-2 py-3 rounded-xl text-sm font-semibold text-white transition" style={{ background: COLORS.blue }}>
        Sınıfı Oluştur
      </button>
    </ModalShell>
  );
}

function EditClassModal({ cls, onClose, onSave, teachers }) {
  const [level, setLevel] = useState(cls.level);
  const [section, setSection] = useState(cls.name.split("-")[1] || "A");
  const [teacherId, setTeacherId] = useState(cls.teacherId || "");

  const handleSubmit = () => {
    onSave(cls.id, { name: `${level}-${section}`, level: Number(level), teacherId: teacherId || null });
    onClose();
  };

  return (
    <ModalShell title="Sınıfı Düzenle" onClose={onClose} width={400}>
      <div className="grid grid-cols-2 gap-3">
        <FormSelect label="Kademe" value={level} onChange={(e) => setLevel(e.target.value)}>
          {[9, 10, 11, 12].map((l) => <option key={l} value={l}>{l}</option>)}
        </FormSelect>
        <FormSelect label="Şube" value={section} onChange={(e) => setSection(e.target.value)}>
          {["A", "B", "C", "D", "E"].map((s) => <option key={s} value={s}>{s}</option>)}
        </FormSelect>
      </div>
      <FormSelect label="Sınıf Rehber Öğretmeni" value={teacherId} onChange={(e) => setTeacherId(e.target.value)}>
        <option value="">Atanmadı</option>
        {teachers.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
      </FormSelect>
      <button onClick={handleSubmit} className="w-full mt-2 py-3 rounded-xl text-sm font-semibold text-white transition" style={{ background: COLORS.blue }}>
        Kaydet
      </button>
    </ModalShell>
  );
}

function EditStudentModal({ student, onClose, onSave, classes, coaches }) {
  const [classId, setClassId] = useState(student.classId || "");
  const [coachId, setCoachId] = useState(student.coachId || "");

  const handleSubmit = () => {
    onSave(student.id, { classId: classId || null, coachId: coachId || null });
    onClose();
  };

  return (
    <ModalShell title={`${student.name} — Düzenle`} onClose={onClose} width={400}>
      <FormSelect label="Sınıf" value={classId} onChange={(e) => setClassId(e.target.value)}>
        <option value="">Sınıfsız</option>
        {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
      </FormSelect>
      <FormSelect label="Koç (opsiyonel)" value={coachId} onChange={(e) => setCoachId(e.target.value)}>
        <option value="">Atanmadı</option>
        {coaches.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
      </FormSelect>
      <button onClick={handleSubmit} className="w-full mt-2 py-3 rounded-xl text-sm font-semibold text-white transition" style={{ background: COLORS.blue }}>
        Kaydet
      </button>
    </ModalShell>
  );
}

const BULK_ROLE_TITLES = { student: "Öğrenci Ekle", teacher: "Öğretmen Ekle", coach: "Koç Ekle" };

function BulkAddModal({ role, classes, onClose, onSubmit }) {
  const [classId, setClassId] = useState(classes[0]?.id || "");
  const [namesText, setNamesText] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const handleSubmit = async () => {
    const names = namesText.split("\n").map((n) => n.trim()).filter(Boolean);
    if (names.length === 0) return;
    setLoading(true);
    const res = await onSubmit(role, role === "student" ? classId : null, names);
    setLoading(false);
    if (res) setResults(res);
  };

  if (results) {
    return (
      <ModalShell title="Oluşturuldu" onClose={onClose} width={560}>
        <div className="rounded-xl overflow-hidden mb-4" style={{ border: "1px solid rgba(0,0,0,0.08)" }}>
          <div style={{ maxHeight: 320, overflowY: "auto" }}>
            {results.map((r, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-2.5 text-sm" style={{ borderTop: i === 0 ? "none" : "1px solid rgba(0,0,0,0.06)" }}>
                <span className="flex-1 min-w-0 truncate" style={{ color: COLORS.text }}>{r.name}</span>
                {r.error ? (
                  <span className="text-xs" style={{ color: COLORS.red }}>{r.error}</span>
                ) : (
                  <>
                    <span className="font-mono text-xs" style={{ color: COLORS.blue }}>{r.code}</span>
                    <span className="font-mono text-xs" style={{ color: COLORS.textSecondary }}>{r.password}</span>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs mb-4" style={{ color: COLORS.textSecondary }}>
          Bu kodları istediğiniz zaman "Şifreler" sayfasından tekrar görüntüleyip yazdırabilirsiniz.
        </p>
        <button onClick={onClose} className="w-full py-3 rounded-xl text-sm font-semibold text-white" style={{ background: COLORS.blue }}>Tamam</button>
      </ModalShell>
    );
  }

  return (
    <ModalShell title={BULK_ROLE_TITLES[role]} onClose={onClose} width={480}>
      {role === "student" && (
        <FormSelect label="Sınıf" value={classId} onChange={(e) => setClassId(e.target.value)}>
          {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </FormSelect>
      )}
      <label className="block mb-4">
        <span className="block text-xs font-medium mb-1.5" style={{ color: COLORS.textSecondary }}>
          Ad Soyad Listesi (her satıra bir kişi)
        </span>
        <textarea
          value={namesText}
          onChange={(e) => setNamesText(e.target.value)}
          rows={8}
          placeholder={"Ahmet Yılmaz\nAyşe Kara\nMehmet Ali Demir"}
          className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none"
          style={{ border: "1px solid rgba(0,0,0,0.1)", background: "#FAFAFA", color: COLORS.text, resize: "vertical" }}
        />
      </label>
      <button onClick={handleSubmit} disabled={loading} className="w-full py-3 rounded-xl text-sm font-semibold text-white transition" style={{ background: COLORS.blue, opacity: loading ? 0.6 : 1 }}>
        {loading ? "Oluşturuluyor..." : "Oluştur"}
      </button>
    </ModalShell>
  );
}

function AssignTargetModal({ onClose, onSave, pool, poolLabel }) {
  const [form, setForm] = useState({
    title: "", type: "soru", targetValue: 20, description: "", dueDate: "",
    publisher: "", sourceName: "", pageRange: "",
    mode: "all", selectedIds: [],
  });
  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });
  const toggleStudent = (id) => setForm((f) => ({ ...f, selectedIds: f.selectedIds.includes(id) ? f.selectedIds.filter((x) => x !== id) : [...f.selectedIds, id] }));

  const VALUE_LABEL = { soru: "Soru Sayısı", ders: "Konu/Ünite Sayısı", test: "Deneme Sayısı" };

  const handleSubmit = () => {
    if (!form.title.trim()) return;
    const studentIds = form.mode === "all" ? pool.map((s) => s.id) : form.selectedIds;
    if (studentIds.length === 0) return;
    onSave({
      title: form.title.trim(),
      type: form.type,
      targetValue: Number(form.targetValue) || 1,
      description: form.description.trim(),
      dueDate: form.dueDate,
      publisher: form.publisher.trim() || null,
      sourceName: form.sourceName.trim() || null,
      pageRange: form.type === "soru" ? (form.pageRange.trim() || null) : null,
      studentIds,
      assignmentLabel: form.mode === "all" ? `${poolLabel} (Tüm Grup)` : `Seçili Öğrenciler (${studentIds.length})`,
    });
    onClose();
  };

  return (
    <ModalShell title="Yeni Hedef Ver" onClose={onClose} width={520}>
      <FormInput label="Hedef Başlığı" placeholder="Örn. Fizik Optik Konu Testi" value={form.title} onChange={update("title")} />
      <div className="grid grid-cols-2 gap-3">
        <FormSelect label="Tür" value={form.type} onChange={update("type")}>
          <option value="soru">Soru</option>
          <option value="ders">Ders</option>
          <option value="test">Test</option>
        </FormSelect>
        <FormInput label={VALUE_LABEL[form.type]} type="number" min="1" value={form.targetValue} onChange={update("targetValue")} />
      </div>

      {(form.type === "soru" || form.type === "test") && (
        <div className="grid grid-cols-2 gap-3">
          <FormInput label="Yayınevi" placeholder="Örn. 3D Yayınları" value={form.publisher} onChange={update("publisher")} />
          <FormInput
            label={form.type === "soru" ? "Kitap Adı" : "Deneme Adı"}
            placeholder={form.type === "soru" ? "Örn. Soru Bankası" : "Örn. TYT Deneme 5"}
            value={form.sourceName}
            onChange={update("sourceName")}
          />
        </div>
      )}
      {form.type === "soru" && (
        <FormInput label="Sayfa Aralığı (opsiyonel)" placeholder="Örn. 45-52" value={form.pageRange} onChange={update("pageRange")} />
      )}

      <FormInput label="Açıklama (opsiyonel)" placeholder="Kısa yönerge yazın" value={form.description} onChange={update("description")} />
      <FormInput label="Bitiş Tarihi (opsiyonel)" type="date" value={form.dueDate} onChange={update("dueDate")} />

      <div className="mb-4">
        <span className="block text-xs font-medium mb-2" style={{ color: COLORS.textSecondary }}>Kime Atansın</span>
        <div className="flex gap-2 mb-3">
          <button onClick={() => setForm({ ...form, mode: "all" })} className="flex-1 py-2.5 rounded-xl text-sm font-medium transition" style={{ background: form.mode === "all" ? COLORS.blue : "#FAFAFA", color: form.mode === "all" ? "#fff" : COLORS.textSecondary, border: "1px solid rgba(0,0,0,0.1)" }}>
            {poolLabel} ({pool.length})
          </button>
          <button onClick={() => setForm({ ...form, mode: "select" })} className="flex-1 py-2.5 rounded-xl text-sm font-medium transition" style={{ background: form.mode === "select" ? COLORS.blue : "#FAFAFA", color: form.mode === "select" ? "#fff" : COLORS.textSecondary, border: "1px solid rgba(0,0,0,0.1)" }}>
            Belirli Öğrenciler
          </button>
        </div>
        {form.mode === "select" && (
          <div className="rounded-xl p-2 flex flex-col gap-1" style={{ border: "1px solid rgba(0,0,0,0.08)", maxHeight: 180, overflowY: "auto" }}>
            {pool.map((s) => (
              <label key={s.id} className="flex items-center gap-2.5 px-2 py-2 rounded-lg text-sm cursor-pointer" style={{ color: COLORS.text }}>
                <input type="checkbox" checked={form.selectedIds.includes(s.id)} onChange={() => toggleStudent(s.id)} />
                {s.name}
              </label>
            ))}
          </div>
        )}
      </div>

      <button onClick={handleSubmit} className="w-full mt-1 py-3 rounded-xl text-sm font-semibold text-white transition" style={{ background: COLORS.blue }}>
        Hedefi Ata
      </button>
    </ModalShell>
  );
}


function LoginScreen({ onLogin }) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError("");
    if (!identifier.trim() || !password) return;
    setLoading(true);

    let email = identifier.trim();
    if (!email.includes("@")) {
      const { data: resolved, error: resolveError } = await supabase.rpc("resolve_login_email", { p_code: email });
      if (resolveError || !resolved) {
        setLoading(false);
        setError("Kullanıcı kodu bulunamadı.");
        return;
      }
      email = resolved;
    }

    const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (signInError) {
      setError("Kullanıcı kodu/e-posta veya şifre hatalı.");
      return;
    }
    onLogin(data.session);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4" style={{ background: COLORS.bg, fontFamily: FONT }}>
      <GlobalStyles />
      <div className="absolute rounded-full" style={{ width: 500, height: 500, background: `radial-gradient(circle, ${COLORS.blue}22, transparent 70%)`, top: -150, left: -150 }} />
      <div className="absolute rounded-full" style={{ width: 500, height: 500, background: `radial-gradient(circle, ${COLORS.indigo}1A, transparent 70%)`, bottom: -180, right: -180 }} />

      <div className="w-full relative rounded-3xl p-8 sm:p-10 modal-content-anim" style={{ ...glassCard, maxWidth: 420, zIndex: 1 }}>
        <img
          src={LOGO_URL}
          alt="Okul Logosu"
          className="w-14 h-14 rounded-2xl object-cover mb-6 mx-auto"
          style={{ background: `linear-gradient(135deg, ${COLORS.blue}, ${COLORS.indigo})` }}
        />
        <h1 className="text-xl font-semibold text-center mb-1" style={{ color: COLORS.text }}>Öğrenci Başarı Takip Sistemi</h1>
        <p className="text-sm text-center mb-7" style={{ color: COLORS.textSecondary }}>Hesabınızla giriş yapın</p>

        <FormInput label="Kullanıcı Kodu veya E-posta" placeholder="Örn. OGR0001" value={identifier} onChange={(e) => setIdentifier(e.target.value)} />
        <FormInput label="Şifre" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />

        {error && (
          <p className="text-xs mb-3 px-1" style={{ color: COLORS.red, animation: "fadeIn 0.2s ease" }}>{error}</p>
        )}

        <button onClick={handleSubmit} disabled={loading} className="w-full py-3 rounded-xl text-sm font-semibold text-white transition lift-hover" style={{ background: COLORS.blue, opacity: loading ? 0.7 : 1 }}>
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <span className="spin-anim inline-block w-3.5 h-3.5 rounded-full border-2 border-white" style={{ borderTopColor: "transparent" }} />
              Giriş yapılıyor...
            </span>
          ) : "Giriş Yap"}
        </button>
      </div>
    </div>
  );
}

function SidebarContent({ navItems, active, setActive, user, onLogout, onNavigate }) {
  return (
    <div className="h-full flex flex-col p-5">
      <div className="flex items-center gap-2.5 px-2 mb-8">
        <img
          src={LOGO_URL}
          alt="Okul Logosu"
          className="w-9 h-9 rounded-xl object-cover flex-shrink-0"
          style={{ background: `linear-gradient(135deg, ${COLORS.blue}, ${COLORS.indigo})`, transition: "transform 0.3s cubic-bezier(0.34,1.56,0.64,1)" }}
        />
        <span className="text-sm font-semibold" style={{ color: COLORS.text }}>Başarı Takip</span>
      </div>

      <nav className="flex-1 flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = active === item.id;
          const hasBadge = item.badge > 0;
          return (
            <button
              key={item.id}
              onClick={() => { setActive(item.id); onNavigate && onNavigate(); }}
              className="nav-btn flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-left"
              style={{
                background: isActive ? `${COLORS.blue}12` : hasBadge ? `${COLORS.red}0D` : "transparent",
                color: isActive ? COLORS.blue : hasBadge ? COLORS.red : COLORS.textSecondary,
              }}
            >
              <item.icon size={18} strokeWidth={2} />
              <span className="flex-1">{item.label}</span>
              {hasBadge && (
                <span className="text-xs font-semibold px-1.5 py-0.5 rounded-full flex-shrink-0 pulse-anim" style={{ background: COLORS.red, color: "#fff" }}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="pt-4" style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}>
        <div className="flex items-center gap-3 px-2 mb-3">
          <Avatar name={user.name} color={COLORS.blue} size={36} />
          <div className="min-w-0">
            <div className="text-sm font-medium truncate" style={{ color: COLORS.text }}>{user.name}</div>
            <div className="text-xs" style={{ color: COLORS.textSecondary }}>{user.roleLabel}</div>
          </div>
        </div>
        <button onClick={onLogout} className="nav-btn flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-medium w-full" style={{ color: COLORS.red }}>
          <LogOut size={16} />
          Çıkış Yap
        </button>
      </div>
    </div>
  );
}

function Shell({ navItems, active, setActive, user, onLogout, title, subtitle, headerActions, children }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  return (
    <div className="min-h-screen flex" style={{ background: COLORS.bg, fontFamily: FONT }}>
      <GlobalStyles />
      <aside className="hidden md:block w-64 flex-shrink-0 sticky top-0 h-screen" style={sidebarStyle}>
        <SidebarContent navItems={navItems} active={active} setActive={setActive} user={user} onLogout={onLogout} />
      </aside>

      {mobileNavOpen && (
        <div className="fixed inset-0 z-40 md:hidden modal-backdrop-anim">
          <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.3)" }} onClick={() => setMobileNavOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-64" style={{ ...sidebarStyle, background: "rgba(255,255,255,0.98)", animation: "fadeInUp 0.25s cubic-bezier(0.16,1,0.3,1) both" }}>
            <SidebarContent navItems={navItems} active={active} setActive={setActive} user={user} onLogout={onLogout} onNavigate={() => setMobileNavOpen(false)} />
          </aside>
        </div>
      )}

      <main className="flex-1 min-w-0">
        <header
          className="sticky top-0 z-30 flex items-center gap-3 px-5 sm:px-8 py-4"
          style={{ background: "rgba(245,245,247,0.85)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderBottom: "1px solid rgba(0,0,0,0.06)" }}
        >
          <button className="md:hidden p-2 -ml-2 rounded-lg" onClick={() => setMobileNavOpen(true)}>
            <Menu size={20} color={COLORS.text} />
          </button>
          <h1 key={title} className="text-xl sm:text-2xl font-semibold" style={{ color: COLORS.text, animation: "fadeIn 0.3s ease both" }}>{title}</h1>
          {subtitle && (
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ml-1" style={{ background: `${COLORS.textSecondary}15`, color: COLORS.textSecondary }}>
              <Eye size={12} /> {subtitle}
            </span>
          )}
          {headerActions && <div className="ml-auto flex items-center gap-2">{headerActions}</div>}
        </header>
        <div key={active} className="px-5 sm:px-8 py-6 page-content">{children}</div>
      </main>
    </div>
  );
}

function AdminOverviewTab({ users, classes }) {
  const students = users.filter((u) => u.role === "student");
  const teachers = users.filter((u) => u.role === "teacher");
  const coaches = users.filter((u) => u.role === "coach");
  const parents = users.filter((u) => u.role === "parent");
  const avgProgress = students.length ? Math.round(students.reduce((sum, s) => sum + (s.progress || 0), 0) / students.length) : 0;

  const chartData = classes.map((c) => {
    const classStudents = students.filter((s) => s.classId === c.id);
    const avg = classStudents.length ? Math.round(classStudents.reduce((sum, s) => sum + (s.progress || 0), 0) / classStudents.length) : 0;
    return { name: c.name, ortalama: avg };
  });
  const barColors = [COLORS.blue, COLORS.indigo, COLORS.teal, COLORS.green, COLORS.orange];
  const coachLoad = coaches.map((c) => ({ ...c, count: students.filter((s) => s.coachId === c.id).length }));
  const maxLoad = Math.max(1, ...coachLoad.map((c) => c.count));

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6 stagger-grid">
        <StatCard label="Öğrenci" value={students.length} icon={BookOpen} color={COLORS.green} />
        <StatCard label="Öğretmen" value={teachers.length} icon={GraduationCap} color={COLORS.indigo} />
        <StatCard label="Koç" value={coaches.length} icon={Compass} color={COLORS.teal} />
        <StatCard label="Veli" value={parents.length} icon={Home} color={COLORS.pink} />
        <StatCard label="Sınıf" value={classes.length} icon={School} color={COLORS.orange} />
        <StatCard label="Ortalama İlerleme" value={`%${avgProgress}`} icon={TrendingUp} color={COLORS.blue} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3 rounded-2xl p-6" style={glassCard}>
          <h3 className="text-sm font-semibold mb-5" style={{ color: COLORS.text }}>Sınıf Bazlı Ortalama İlerleme</h3>
          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={chartData} barSize={40}>
                <CartesianGrid vertical={false} stroke="rgba(0,0,0,0.06)" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: COLORS.textSecondary }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: COLORS.textSecondary }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(v) => [`%${v}`, "Ortalama"]} contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
                <Bar dataKey="ortalama" radius={[8, 8, 0, 0]}>
                  {chartData.map((_, i) => <Cell key={i} fill={barColors[i % barColors.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-2 rounded-2xl p-6" style={glassCard}>
          <h3 className="text-sm font-semibold mb-5" style={{ color: COLORS.text }}>Koç Başına Öğrenci Sayısı</h3>
          <div className="flex flex-col gap-4">
            {coachLoad.map((c) => (
              <div key={c.id}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm" style={{ color: COLORS.text }}>{c.name}</span>
                  <span className="text-sm font-medium" style={{ color: COLORS.textSecondary }}>{c.count} öğrenci</span>
                </div>
                <div className="w-full rounded-full h-2" style={{ background: "rgba(0,0,0,0.06)" }}>
                  <div className="h-2 rounded-full" style={{ width: `${(c.count / maxLoad) * 100}%`, background: COLORS.teal }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function UsersTab({ users, classes, onBulkAddClick, onSingleAddClick, onDelete, onEditStudentClick }) {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [confirmId, setConfirmId] = useState(null);
    const [scrollInfo, setScrollInfo] = useState({ atBottom: false, scrollable: false });
  useEffect(() => {
    const update = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight > window.innerHeight + 120;
      const atBottom = window.innerHeight + window.scrollY >= doc.scrollHeight - 80;
      setScrollInfo((prev) => (prev.scrollable === scrollable && prev.atBottom === atBottom ? prev : { scrollable, atBottom }));
    };
    update();
    window.addEventListener("scroll", update);
    window.addEventListener("resize", update);
    const ro = new ResizeObserver(update);
    ro.observe(document.body);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      ro.disconnect();
    };
  }, []);
  const { atBottom, scrollable } = scrollInfo;
  const scrollToggle = () => {
    window.scrollTo({ top: atBottom ? 0 : document.documentElement.scrollHeight, behavior: "smooth" });
  };

  const filtered = users.filter((u) => {
    if (u.role === "admin") return false;
    if (roleFilter !== "all" && u.role !== roleFilter) return false;
    if (search && !u.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });
  const classNameOf = (id) => classes.find((c) => c.id === id)?.name;
  const userNameOf = (id) => users.find((u) => u.id === id)?.name;

  return (
    <div>
      <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl mb-3" style={{ background: "rgba(255,255,255,0.8)", border: "1px solid rgba(0,0,0,0.08)" }}>
        <Search size={16} color={COLORS.textSecondary} />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Kullanıcı ara..." className="w-full bg-transparent outline-none text-sm" style={{ color: COLORS.text }} />
      </div>

      <div className="flex flex-wrap gap-2 mb-5">
        <button onClick={() => onBulkAddClick("student")} className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background: COLORS.blue }}>
          <Plus size={16} /> Öğrenci Ekle
        </button>
        <button onClick={() => onSingleAddClick("teacher")} className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background: COLORS.indigo }}>
          <Plus size={16} /> Öğretmen Ekle
        </button>
        <button onClick={() => onSingleAddClick("student")} className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-medium" style={{ color: COLORS.textSecondary, border: "1px solid rgba(0,0,0,0.1)" }}>
          <Plus size={16} /> Diğer / Tekil Ekle
        </button>
      </div>

      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        {["all", "teacher", "coach", "counselor", "student", "parent"].map((r) => (
          <button
            key={r}
            onClick={() => setRoleFilter(r)}
            className="px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition flex-shrink-0"
            style={{ background: roleFilter === r ? COLORS.text : "rgba(255,255,255,0.8)", color: roleFilter === r ? "#fff" : COLORS.textSecondary, border: "1px solid rgba(0,0,0,0.08)" }}
          >
            {r === "all" ? "Tümü" : ROLE_CONFIG[r].label}
          </button>
        ))}
      </div>

      <div className="rounded-2xl overflow-hidden" style={glassCard}>
        {filtered.length === 0 && <div className="py-14 text-center text-sm" style={{ color: COLORS.textSecondary }}>Kullanıcı bulunamadı</div>}
        {filtered.map((u, i) => (
          <div key={u.id} className="flex items-center gap-3 px-5 py-3.5" style={{ borderTop: i === 0 ? "none" : "1px solid rgba(0,0,0,0.05)" }}>
            <Avatar name={u.name} color={ROLE_CONFIG[u.role].color} />
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium truncate" style={{ color: COLORS.text }}>{u.name}</div>
              <div className="text-xs truncate" style={{ color: COLORS.textSecondary }}>
                {u.email}
                {u.role === "teacher" && u.classId && ` · ${classNameOf(u.classId)} Sınıf Öğretmeni`}
                {u.role === "student" && ` · ${classNameOf(u.classId) || "Sınıfsız"}${u.coachId ? ` · Koç: ${userNameOf(u.coachId)}` : ""}`}
                {u.role === "parent" && u.childId && ` · ${userNameOf(u.childId)} velisi`}
              </div>
            </div>
            <div className="hidden sm:block"><RoleBadge role={u.role} /></div>
            {u.role === "student" && (
              <button onClick={() => onEditStudentClick(u)} className="p-2 rounded-lg flex-shrink-0 hover:bg-gray-100 transition">
                <Pencil size={16} color={COLORS.textSecondary} />
              </button>
            )}
            {confirmId === u.id ? (
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button onClick={() => { onDelete(u.id); setConfirmId(null); }} className="text-xs font-semibold px-2.5 py-1.5 rounded-lg text-white" style={{ background: COLORS.red }}>Sil</button>
                <button onClick={() => setConfirmId(null)} className="text-xs font-medium px-2.5 py-1.5 rounded-lg" style={{ color: COLORS.textSecondary }}>Vazgeç</button>
              </div>
            ) : (
              <button onClick={() => setConfirmId(u.id)} className="p-2 rounded-lg flex-shrink-0 hover:bg-gray-100 transition">
                <Trash2 size={16} color={COLORS.textSecondary} />
              </button>
            )}
          </div>
                ))}
      </div>

            {scrollable && createPortal(
        <div className="fixed bottom-6 left-0 right-0 md:left-64 z-30 flex justify-center pointer-events-none">
          <button
            onClick={scrollToggle}
            className="pointer-events-auto flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold text-white lift-hover"
            style={{ background: COLORS.text, boxShadow: "0 8px 24px rgba(0,0,0,0.25)", fontFamily: FONT }}
          >
            <ChevronDown size={16} style={{ transform: atBottom ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
            {atBottom ? "Yukarı çık" : "Aşağı in"}
          </button>
        </div>,
        document.body
      )}
    </div>
  );
}

function ClassesTab({ classes, users, onAddClick, onSeatingClick, onEditClick, readOnly = false }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm" style={{ color: COLORS.textSecondary }}>{classes.length} sınıf listeleniyor</p>
        {!readOnly && (
          <button onClick={onAddClick} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background: COLORS.blue }}>
            <Plus size={16} /> Sınıf Ekle
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {classes.map((c) => {
          const teacher = users.find((u) => u.role === "teacher" && u.classId === c.id);
          const classStudents = users.filter((u) => u.role === "student" && u.classId === c.id);
          const avg = classStudents.length ? Math.round(classStudents.reduce((sum, s) => sum + (s.progress || 0), 0) / classStudents.length) : 0;
          return (
            <div key={c.id} className="rounded-2xl p-6 card-hover" style={glassCard}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-lg font-semibold" style={{ color: COLORS.text }}>{c.name}</div>
                  <div className="text-xs" style={{ color: COLORS.textSecondary }}>{c.level}. Sınıf</div>
                </div>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${COLORS.orange}15` }}>
                  <School size={18} color={COLORS.orange} />
                </div>
              </div>
              <div className="text-sm mb-1" style={{ color: COLORS.textSecondary }}>
                Rehber Öğretmen: <span style={{ color: COLORS.text, fontWeight: 500 }}>{teacher ? teacher.name : "Atanmadı"}</span>
              </div>
              <div className="text-sm mb-4" style={{ color: COLORS.textSecondary }}>{classStudents.length} öğrenci</div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs" style={{ color: COLORS.textSecondary }}>Ortalama İlerleme</span>
                <span className="text-xs font-semibold" style={{ color: COLORS.text }}>%{avg}</span>
              </div>
              <div className="w-full rounded-full h-2 mb-4" style={{ background: "rgba(0,0,0,0.06)" }}>
                <div className="h-2 rounded-full" style={{ width: `${avg}%`, background: COLORS.blue }} />
              </div>
              {!readOnly && (
                <div className="flex gap-2">
                  <button onClick={() => onEditClick(c)} className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold" style={{ color: COLORS.blue, background: `${COLORS.blue}12` }}>
                    <Pencil size={14} /> Düzenle
                  </button>
                  <button onClick={() => onSeatingClick(c.id)} className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold" style={{ color: COLORS.indigo, background: `${COLORS.indigo}12` }}>
                    <LayoutGrid size={14} /> Oturma Planı
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CoachingTab({ users, classes, onAssign, onUnassign, readOnly = false }) {
  const coaches = users.filter((u) => u.role === "coach");
  const students = users.filter((u) => u.role === "student");
  const unassigned = students.filter((s) => !s.coachId);
  const classNameOf = (id) => classes.find((c) => c.id === id)?.name;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <div className="rounded-2xl p-6" style={glassCard}>
        <h3 className="text-sm font-semibold mb-5" style={{ color: COLORS.text }}>Koçlar ve Atanan Öğrenciler</h3>
        <div className="flex flex-col gap-5">
          {coaches.map((coach) => {
            const assigned = students.filter((s) => s.coachId === coach.id);
            return (
              <div key={coach.id}>
                <div className="flex items-center gap-2.5 mb-2.5">
                  <Avatar name={coach.name} color={COLORS.teal} size={32} />
                  <span className="text-sm font-medium" style={{ color: COLORS.text }}>{coach.name}</span>
                  <span className="text-xs" style={{ color: COLORS.textSecondary }}>({assigned.length})</span>
                </div>
                <div className="flex flex-wrap gap-2 pl-1">
                  {assigned.length === 0 && <span className="text-xs" style={{ color: COLORS.textSecondary }}>Henüz öğrenci atanmadı</span>}
                  {assigned.map((s) => (
                    <span key={s.id} className={`inline-flex items-center gap-1.5 pl-3 ${readOnly ? "pr-3" : "pr-2"} py-1.5 rounded-full text-xs font-medium`} style={{ background: `${COLORS.teal}12`, color: COLORS.text }}>
                      {s.name}
                      {!readOnly && (
                        <button onClick={() => onUnassign(s.id)} className="w-4 h-4 rounded-full flex items-center justify-center hover:opacity-70 transition">
                          <X size={11} />
                        </button>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl p-6" style={glassCard}>
        <h3 className="text-sm font-semibold mb-1" style={{ color: COLORS.text }}>Atanmamış Öğrenciler</h3>
        <p className="text-xs mb-5" style={{ color: COLORS.textSecondary }}>{unassigned.length} öğrenci koç bekliyor</p>
        <div className="flex flex-col gap-2.5">
          {unassigned.length === 0 && <div className="text-sm py-6 text-center" style={{ color: COLORS.textSecondary }}>Tüm öğrenciler bir koça atanmış</div>}
          {unassigned.map((s) => (
            <div key={s.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "rgba(0,0,0,0.02)" }}>
              <Avatar name={s.name} color={COLORS.green} size={32} />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate" style={{ color: COLORS.text }}>{s.name}</div>
                <div className="text-xs" style={{ color: COLORS.textSecondary }}>{classNameOf(s.classId) || "Sınıfsız"}</div>
              </div>
              {readOnly ? (
                <span className="text-xs font-medium px-2.5 py-1.5 rounded-lg flex-shrink-0" style={{ background: `${COLORS.orange}12`, color: COLORS.orange }}>Koç bekliyor</span>
              ) : (
                <select
                  onChange={(e) => { if (e.target.value) { onAssign(s.id, e.target.value); e.target.value = ""; } }}
                  defaultValue=""
                  className="text-xs px-2.5 py-2 rounded-lg outline-none flex-shrink-0"
                  style={{ border: "1px solid rgba(0,0,0,0.1)", background: "#fff", color: COLORS.text }}
                >
                  <option value="" disabled>Koça ata</option>
                  {coaches.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
/* ------------------------------------------------------------------ */
/* Ders Programı                                                        */
/* ------------------------------------------------------------------ */

function ScheduleSlotModal({ day, period, existingSlot, homeroomClass, subjects, rehberlikAvailable, classes, onSave, onClear, onClose }) {
  const [subject, setSubject] = useState(existingSlot?.subject || (subjects.length === 1 ? subjects[0] : ""));
  const [classId, setClassId] = useState(existingSlot?.classId || homeroomClass?.id || "");
  const isRehberlik = subject === "Rehberlik";

  const handleConfirm = () => {
    if (!subject) return;
    const finalClassId = isRehberlik ? (homeroomClass?.id || null) : (classId || null);
    onSave(subject, finalClassId);
    onClose();
  };

  return (
    <ModalShell title={`${WEEKDAY_LABELS[day - 1]} · ${period}. Ders`} onClose={onClose} width={420}>
      <div className="mb-4">
        <span className="block text-xs font-medium mb-2" style={{ color: COLORS.textSecondary }}>Ders</span>
        <div className="flex flex-wrap gap-2">
          {rehberlikAvailable && (
            <button
              onClick={() => setSubject("Rehberlik")}
              className="px-3 py-2 rounded-xl text-xs font-medium transition"
              style={{ background: subject === "Rehberlik" ? COLORS.indigo : "#FAFAFA", color: subject === "Rehberlik" ? "#fff" : COLORS.text, border: "1px solid rgba(0,0,0,0.1)" }}
            >
              Rehberlik
            </button>
          )}
          {subjects.map((s) => (
            <button
              key={s}
              onClick={() => setSubject(s)}
              className="px-3 py-2 rounded-xl text-xs font-medium transition"
              style={{ background: subject === s ? COLORS.blue : "#FAFAFA", color: subject === s ? "#fff" : COLORS.text, border: "1px solid rgba(0,0,0,0.1)" }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {subject && !isRehberlik && (
        <FormSelect label="Sınıf" value={classId} onChange={(e) => setClassId(e.target.value)}>
          <option value="">Seçin</option>
          {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </FormSelect>
      )}

      <div className="flex gap-2 mt-1">
        {existingSlot && (
          <button onClick={() => { onClear(); onClose(); }} className="flex-1 py-3 rounded-xl text-sm font-semibold transition" style={{ color: COLORS.red, background: `${COLORS.red}12` }}>
            Temizle
          </button>
        )}
        <button
          onClick={handleConfirm}
          disabled={!subject || (!isRehberlik && !classId)}
          className="flex-1 py-3 rounded-xl text-sm font-semibold text-white transition"
          style={{ background: COLORS.blue, opacity: (!subject || (!isRehberlik && !classId)) ? 0.5 : 1 }}
        >
          Kaydet
        </button>
      </div>
    </ModalShell>
  );
}

function ScheduleGrid({ teacher, teacherSubjects, scheduleSlots, classes, onSetSlot, onClearSlot, onClearDay, readOnly = false }) {
  const [editingCell, setEditingCell] = useState(null);
  const homeroomClass = classes.find((c) => c.id === teacher.classId);
  const mySubjects = teacherSubjects.filter((ts) => ts.teacherId === teacher.id).map((ts) => ts.subject);
  const mySlots = scheduleSlots.filter((s) => s.teacherId === teacher.id);
  const rehberlikUsed = mySlots.some((s) => s.subject === "Rehberlik");
  const classNameOf = (id) => classes.find((c) => c.id === id)?.name || "";
  const slotAt = (day, period) => mySlots.find((s) => s.day === day && s.period === period);

  const handleCellClick = (day, period) => {
    if (readOnly) return;
    const existing = slotAt(day, period);
    if (!existing && mySubjects.length === 1 && homeroomClass && rehberlikUsed) {
      onSetSlot(teacher.id, day, period, mySubjects[0], homeroomClass.id);
      return;
    }
    setEditingCell({ day, period, existing: existing || null });
  };

  const thStyle = { padding: "8px 6px", fontSize: 10, color: COLORS.textSecondary, fontWeight: 500, textAlign: "center", borderLeft: "1px solid rgba(0,0,0,0.05)" };

  return (
    <div>
      <div className="rounded-2xl" style={{ ...glassCard, overflowX: "auto" }}>
        <table style={{ borderCollapse: "collapse", width: "100%", minWidth: 760 }}>
          <thead>
            <tr>
              <th style={{ padding: "10px 12px", textAlign: "left" }}></th>
              {PERIOD_TIMES.map((p) => (
                <th key={p.period} style={thStyle}>
                  <div>{p.period}. Ders</div>
                  <div style={{ fontWeight: 400 }}>{p.start}-{p.end}</div>
                  {(p.period === 7 || p.period === 8) && <div style={{ fontSize: 9, color: COLORS.indigo }}>Blok</div>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {WEEKDAY_LABELS.map((label, i) => {
              const day = i + 1;
              const daySlots = mySlots.filter((s) => s.day === day);
              const isEmpty = daySlots.length === 0;
              return (
                <tr key={day} style={{ borderTop: "1px solid rgba(0,0,0,0.05)" }}>
                  <td style={{ padding: "10px 12px" }}>
                    <div className="text-sm font-medium mb-1 whitespace-nowrap" style={{ color: COLORS.text }}>{label}</div>
                    {!readOnly && (
                      <label className="flex items-center gap-1.5 text-xs cursor-pointer whitespace-nowrap" style={{ color: COLORS.textSecondary }}>
                        <input type="checkbox" checked={isEmpty} onChange={() => { if (!isEmpty) onClearDay(teacher.id, day); }} />
                        BOŞ GÜN
                      </label>
                    )}
                  </td>
                  {PERIOD_TIMES.map((p) => {
                    const slot = slotAt(day, p.period);
                    return (
                      <td key={p.period} style={{ borderLeft: "1px solid rgba(0,0,0,0.05)", padding: 4 }}>
                        <button
                          onClick={() => handleCellClick(day, p.period)}
                          disabled={readOnly}
                          className="w-full rounded-lg text-center transition"
                          style={{
                            padding: "8px 4px", minHeight: 48,
                            background: slot ? (slot.subject === "Rehberlik" ? `${COLORS.indigo}15` : `${COLORS.blue}12`) : "rgba(0,0,0,0.02)",
                            border: slot ? "none" : "1.5px dashed rgba(0,0,0,0.1)",
                          }}
                        >
                          {slot ? (
                            <>
                              <div className="text-xs font-semibold truncate" style={{ color: slot.subject === "Rehberlik" ? COLORS.indigo : COLORS.blue }}>{slot.subject}</div>
                              {slot.classId && <div className="text-xs truncate" style={{ color: COLORS.textSecondary }}>{classNameOf(slot.classId)}</div>}
                            </>
                          ) : (
                            !readOnly && <Plus size={14} color={COLORS.textSecondary} style={{ margin: "0 auto" }} />
                          )}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {editingCell && (
        <ScheduleSlotModal
          day={editingCell.day}
          period={editingCell.period}
          existingSlot={editingCell.existing}
          homeroomClass={homeroomClass}
          subjects={mySubjects}
          rehberlikAvailable={!!homeroomClass && (!rehberlikUsed || editingCell.existing?.subject === "Rehberlik")}
          classes={classes}
          onSave={(subject, classId) => onSetSlot(teacher.id, editingCell.day, editingCell.period, subject, classId)}
          onClear={() => onClearSlot(teacher.id, editingCell.day, editingCell.period)}
          onClose={() => setEditingCell(null)}
        />
      )}
    </div>
  );
}

function ScheduleBuilderTab({ teachers, teacherSubjects, scheduleSlots, classes, onSetSlot, onClearSlot, onClearDay }) {
  const [pendingTeacherId, setPendingTeacherId] = useState("");
  const [activeTeacherId, setActiveTeacherId] = useState(null);
  const teacher = teachers.find((t) => t.id === activeTeacherId);

  if (!teacher) {
    return (
      <div className="rounded-2xl p-6" style={glassCard}>
        <h3 className="text-sm font-semibold mb-4" style={{ color: COLORS.text }}>Öğretmen Seçin</h3>
        <FormSelect label="Öğretmen" value={pendingTeacherId} onChange={(e) => setPendingTeacherId(e.target.value)}>
          <option value="">Seçin</option>
          {teachers.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
        </FormSelect>
        <button
          onClick={() => setActiveTeacherId(pendingTeacherId)}
          disabled={!pendingTeacherId}
          className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition"
          style={{ background: COLORS.blue, opacity: pendingTeacherId ? 1 : 0.5 }}
        >
          Devam
        </button>
      </div>
    );
  }

  return (
    <div>
      <button onClick={() => setActiveTeacherId(null)} className="flex items-center gap-1 text-xs font-medium mb-4" style={{ color: COLORS.blue }}>
        <ChevronLeft size={14} /> Öğretmen Seç
      </button>
      <h2 className="text-lg font-semibold mb-4" style={{ color: COLORS.text }}>{teacher.name}</h2>
      <ScheduleGrid teacher={teacher} teacherSubjects={teacherSubjects} scheduleSlots={scheduleSlots} classes={classes} onSetSlot={onSetSlot} onClearSlot={onClearSlot} onClearDay={onClearDay} />
    </div>
  );
}

function AllSchedulesTab({ teachers, teacherSubjects, scheduleSlots, classes }) {
  const [selectedId, setSelectedId] = useState("");
  const teacher = teachers.find((t) => t.id === selectedId);
  return (
    <div>
      <div className="rounded-2xl p-6 mb-5" style={glassCard}>
        <FormSelect label="Öğretmen" value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>
          <option value="">Seçin</option>
          {teachers.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
        </FormSelect>
      </div>
      {teacher && <ScheduleGrid teacher={teacher} teacherSubjects={teacherSubjects} scheduleSlots={scheduleSlots} classes={classes} readOnly />}
    </div>
  );
}

function ClassScheduleTab({ classes, scheduleSlots, users }) {
  const [selectedClassId, setSelectedClassId] = useState("");
  const cls = classes.find((c) => c.id === selectedClassId);
  const teacherName = (id) => users.find((u) => u.id === id)?.name || "—";
  const slotsForClass = cls ? scheduleSlots.filter((s) => s.classId === cls.id) : [];
  const slotAt = (day, period) => slotsForClass.find((s) => s.day === day && s.period === period);
  const thStyle = { padding: "8px 6px", fontSize: 10, color: COLORS.textSecondary, fontWeight: 500, textAlign: "center", borderLeft: "1px solid rgba(0,0,0,0.05)" };

  return (
    <div>
      <div className="rounded-2xl p-6 mb-5" style={glassCard}>
        <FormSelect label="Sınıf" value={selectedClassId} onChange={(e) => setSelectedClassId(e.target.value)}>
          <option value="">Seçin</option>
          {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </FormSelect>
      </div>
      {cls && (
        <div className="rounded-2xl" style={{ ...glassCard, overflowX: "auto" }}>
          <table style={{ borderCollapse: "collapse", width: "100%", minWidth: 760 }}>
            <thead>
              <tr>
                <th style={{ padding: "10px 12px", textAlign: "left" }}></th>
                {PERIOD_TIMES.map((p) => (
                  <th key={p.period} style={thStyle}>
                    <div>{p.period}. Ders</div>
                    <div style={{ fontWeight: 400 }}>{p.start}-{p.end}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {WEEKDAY_LABELS.map((label, i) => {
                const day = i + 1;
                return (
                  <tr key={day} style={{ borderTop: "1px solid rgba(0,0,0,0.05)" }}>
                    <td style={{ padding: "10px 12px" }}>
                      <div className="text-sm font-medium whitespace-nowrap" style={{ color: COLORS.text }}>{label}</div>
                    </td>
                    {PERIOD_TIMES.map((p) => {
                      const slot = slotAt(day, p.period);
                      return (
                        <td key={p.period} style={{ borderLeft: "1px solid rgba(0,0,0,0.05)", padding: 4 }}>
                          <div className="rounded-lg text-center" style={{ padding: "8px 4px", minHeight: 48, background: slot ? `${COLORS.blue}12` : "rgba(0,0,0,0.02)" }}>
                            {slot ? (
                              <>
                                <div className="text-xs font-semibold truncate" style={{ color: COLORS.blue }}>{slot.subject}</div>
                                <div className="text-xs truncate" style={{ color: COLORS.textSecondary }}>{teacherName(slot.teacherId)}</div>
                              </>
                            ) : (
                              <span className="text-xs" style={{ color: COLORS.textSecondary }}>—</span>
                            )}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function ScheduleTab({ teachers, teacherSubjects, scheduleSlots, classes, users, onSetSlot, onClearSlot, onClearDay }) {
  const [subTab, setSubTab] = useState("build");
  const TAB_BTN = (id, label) => (
    <button
      onClick={() => setSubTab(id)}
      className="px-3.5 py-1.5 rounded-full text-xs font-medium transition"
      style={{ background: subTab === id ? COLORS.text : "rgba(255,255,255,0.8)", color: subTab === id ? "#fff" : COLORS.textSecondary, border: "1px solid rgba(0,0,0,0.08)" }}
    >
      {label}
    </button>
  );
  return (
    <div>
      <div className="flex gap-2 mb-5">
        {TAB_BTN("build", "Program Oluştur")}
        {TAB_BTN("all", "Tüm Ders Programları")}
        {TAB_BTN("class", "Kimin Dersi Var?")}
      </div>
      {subTab === "build" && <ScheduleBuilderTab teachers={teachers} teacherSubjects={teacherSubjects} scheduleSlots={scheduleSlots} classes={classes} onSetSlot={onSetSlot} onClearSlot={onClearSlot} onClearDay={onClearDay} />}
      {subTab === "all" && <AllSchedulesTab teachers={teachers} teacherSubjects={teacherSubjects} scheduleSlots={scheduleSlots} classes={classes} />}
      {subTab === "class" && <ClassScheduleTab classes={classes} scheduleSlots={scheduleSlots} users={users} />}
    </div>
  );
}
function AllStudentsTab({ users, classes, studentTargets }) {
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const students = users.filter((u) => u.role === "student");
  const classNameOf = (id) => classes.find((c) => c.id === id)?.name;
  const coachNameOf = (id) => users.find((u) => u.id === id)?.name;

  const filtered = students.filter((s) => {
    if (classFilter !== "all" && s.classId !== classFilter) return false;
    if (search && !s.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl flex-1 sm:max-w-xs" style={{ background: "rgba(255,255,255,0.8)", border: "1px solid rgba(0,0,0,0.08)" }}>
          <Search size={16} color={COLORS.textSecondary} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Öğrenci ara..." className="w-full bg-transparent outline-none text-sm" style={{ color: COLORS.text }} />
        </div>
        <p className="text-sm flex-shrink-0" style={{ color: COLORS.textSecondary }}>{filtered.length} öğrenci</p>
      </div>

      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        {["all", ...classes.map((c) => c.id)].map((id) => (
          <button
            key={id}
            onClick={() => setClassFilter(id)}
            className="px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition flex-shrink-0"
            style={{
              background: classFilter === id ? COLORS.text : "rgba(255,255,255,0.8)",
              color: classFilter === id ? "#fff" : COLORS.textSecondary,
              border: "1px solid rgba(0,0,0,0.08)",
            }}
          >
            {id === "all" ? "Tümü" : classNameOf(id)}
          </button>
        ))}
      </div>

      <div className="rounded-2xl overflow-hidden" style={glassCard}>
        {filtered.length === 0 && <div className="py-14 text-center text-sm" style={{ color: COLORS.textSecondary }}>Öğrenci bulunamadı</div>}
        {filtered.map((s, i) => {
          const activeGoals = studentTargets.filter((st) => st.studentId === s.id && st.status === "yapiyor").length;
          return (
            <div key={s.id} className="flex items-center gap-3 px-5 py-3.5" style={{ borderTop: i === 0 ? "none" : "1px solid rgba(0,0,0,0.05)" }}>
              <Avatar name={s.name} color={COLORS.green} />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium truncate" style={{ color: COLORS.text }}>{s.name}</div>
                <div className="text-xs truncate" style={{ color: COLORS.textSecondary }}>
                  {classNameOf(s.classId) || "Sınıfsız"} · {s.coachId ? `Koç: ${coachNameOf(s.coachId)}` : "Koçsuz"} · {activeGoals} aktif hedef
                </div>
              </div>
              <div className="w-24 flex-shrink-0 hidden sm:block">
                <div className="w-full rounded-full h-2" style={{ background: "rgba(0,0,0,0.06)" }}>
                  <div className="h-2 rounded-full" style={{ width: `${s.progress}%`, background: COLORS.blue }} />
                </div>
              </div>
              <span className="text-xs font-semibold w-9 text-right flex-shrink-0" style={{ color: COLORS.text }}>%{s.progress}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CredentialsTab({ users, classes, credentials, onPrint }) {
  const credByUser = Object.fromEntries(credentials.map((c) => [c.id, c]));
  const students = users.filter((u) => u.role === "student");
  const staff = users.filter((u) => u.role === "teacher" || u.role === "coach" || u.role === "counselor");
  const parentOf = (s) => users.find((u) => u.id === s.parentId);

  const printClass = (cls) => {
    const rows = [];
    students.filter((s) => s.classId === cls.id).forEach((s) => {
      rows.push({ id: s.id, name: s.name, code: credByUser[s.id]?.code || "—", password: credByUser[s.id]?.password || "—" });
      const parent = parentOf(s);
      if (parent) {
        rows.push({ id: parent.id, name: `${parent.name} (Veli)`, code: credByUser[parent.id]?.code || "—", password: credByUser[parent.id]?.password || "—" });
      }
    });
    onPrint({ title: `${cls.name} — Öğrenci ve Veli Giriş Bilgileri`, rows });
  };

  const printStaff = () => {
    const rows = staff.map((u) => ({
      id: u.id, name: `${u.name} (${ROLE_CONFIG[u.role].label})`,
      code: credByUser[u.id]?.code || "—", password: credByUser[u.id]?.password || "—",
    }));
    onPrint({ title: "Öğretmen / Koç Giriş Bilgileri", rows });
  };

  return (
    <div>
      <div className="rounded-2xl p-6 mb-5" style={glassCard}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold" style={{ color: COLORS.text }}>Öğretmen ve Koçlar</h3>
          <button onClick={printStaff} className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-white flex-shrink-0" style={{ background: COLORS.blue }}>
            <Printer size={14} /> Yazdır
          </button>
        </div>
        <div className="flex flex-col gap-1.5">
          {staff.length === 0 && <p className="text-xs" style={{ color: COLORS.textSecondary }}>Henüz öğretmen/koç eklenmedi</p>}
          {staff.map((u) => (
            <div key={u.id} className="flex items-center gap-3 text-sm py-1.5">
              <span className="flex-1 min-w-0 truncate" style={{ color: COLORS.text }}>{u.name}</span>
              <div className="hidden sm:block"><RoleBadge role={u.role} /></div>
              <span className="font-mono text-xs w-20 text-right flex-shrink-0" style={{ color: COLORS.blue }}>{credByUser[u.id]?.code || "—"}</span>
              <span className="font-mono text-xs w-16 text-right flex-shrink-0" style={{ color: COLORS.textSecondary }}>{credByUser[u.id]?.password || "—"}</span>
            </div>
          ))}
        </div>
      </div>

      {classes.map((cls) => {
        const classStudents = students.filter((s) => s.classId === cls.id);
        return (
          <div key={cls.id} className="rounded-2xl p-6 mb-5" style={glassCard}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold" style={{ color: COLORS.text }}>{cls.name} <span style={{ color: COLORS.textSecondary, fontWeight: 400 }}>({classStudents.length} öğrenci)</span></h3>
              <button onClick={() => printClass(cls)} className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-white flex-shrink-0" style={{ background: COLORS.blue }}>
                <Printer size={14} /> Yazdır
              </button>
            </div>
            <div className="flex flex-col gap-1.5">
              {classStudents.length === 0 && <p className="text-xs" style={{ color: COLORS.textSecondary }}>Bu sınıfta öğrenci yok</p>}
              {classStudents.map((s) => {
                const parent = parentOf(s);
                return (
                  <div key={s.id}>
                    <div className="flex items-center gap-3 text-sm py-1.5">
                      <span className="flex-1 min-w-0 truncate" style={{ color: COLORS.text }}>{s.name}</span>
                      <span className="font-mono text-xs w-20 text-right flex-shrink-0" style={{ color: COLORS.blue }}>{credByUser[s.id]?.code || "—"}</span>
                      <span className="font-mono text-xs w-16 text-right flex-shrink-0" style={{ color: COLORS.textSecondary }}>{credByUser[s.id]?.password || "—"}</span>
                    </div>
                    {parent && (
                      <div className="flex items-center gap-3 text-xs py-1 pl-4" style={{ color: COLORS.textSecondary, borderTop: "1px dashed rgba(0,0,0,0.06)" }}>
                        <span className="flex-1 min-w-0 truncate">↳ Velisi: {parent.name}</span>
                        <span className="font-mono w-20 text-right flex-shrink-0" style={{ color: COLORS.pink }}>{credByUser[parent.id]?.code || "—"}</span>
                        <span className="font-mono w-16 text-right flex-shrink-0">{credByUser[parent.id]?.password || "—"}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function CreateAnnouncementModal({ onClose, onSave, audienceLabel }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError("");
    setUploading(true);
    const safeName = file.name.replace(/[^a-zA-Z0-9.]/g, "_");
    const path = `announcements/${Date.now()}-${safeName}`;
    const { error } = await supabase.storage.from("uploads").upload(path, file, { cacheControl: "3600", upsert: false });
    if (error) {
      setUploadError("Görsel yüklenemedi: " + error.message);
      setUploading(false);
      return;
    }
    const { data } = supabase.storage.from("uploads").getPublicUrl(path);
    setImageUrl(data.publicUrl);
    setUploading(false);
  };

  const handleSubmit = async () => {
    if (!title.trim() || !body.trim()) return;
    setSaving(true);
    await onSave({ title: title.trim(), body: body.trim(), imageUrl: imageUrl || null });
    setSaving(false);
    onClose();
  };

  return (
    <ModalShell title="Yeni Duyuru" onClose={onClose} width={480}>
      <p className="text-xs mb-4 px-1" style={{ color: COLORS.textSecondary }}>{audienceLabel}</p>
      <FormInput label="Başlık" placeholder="Örn. Veli Toplantısı Hakkında" value={title} onChange={(e) => setTitle(e.target.value)} />
      <label className="block mb-4">
        <span className="block text-xs font-medium mb-1.5" style={{ color: COLORS.textSecondary }}>İçerik</span>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={5}
          className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none"
          style={{ border: "1px solid rgba(0,0,0,0.1)", background: "#FAFAFA", color: COLORS.text, resize: "vertical" }}
        />
      </label>

      <label className="block mb-4">
        <span className="block text-xs font-medium mb-1.5" style={{ color: COLORS.textSecondary }}>Görsel (opsiyonel)</span>
        {imageUrl ? (
          <div className="relative">
            <img src={imageUrl} alt="" className="w-full h-36 object-cover rounded-xl" />
            <button onClick={() => setImageUrl("")} type="button" className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition" style={{ background: "rgba(0,0,0,0.6)" }}>
              <X size={14} color="#fff" />
            </button>
          </div>
        ) : (
          <label className="flex items-center justify-center gap-2 py-6 rounded-xl text-xs font-medium cursor-pointer transition" style={{ border: "1.5px dashed rgba(0,0,0,0.15)", color: COLORS.textSecondary, background: "#FAFAFA" }}>
            {uploading ? "Yükleniyor..." : (
              <>
                <ImagePlus size={16} /> Görsel Seç
              </>
            )}
            <input type="file" accept="image/*" onChange={handleFileChange} disabled={uploading} className="hidden" />
          </label>
        )}
        {uploadError && <p className="text-xs mt-1.5" style={{ color: COLORS.red }}>{uploadError}</p>}
      </label>

      <button onClick={handleSubmit} disabled={saving || uploading || !title.trim() || !body.trim()} className="w-full py-3 rounded-xl text-sm font-semibold text-white transition" style={{ background: COLORS.blue, opacity: (saving || uploading || !title.trim() || !body.trim()) ? 0.6 : 1 }}>
        {saving ? "Yayınlanıyor..." : "Yayınla"}
      </button>
    </ModalShell>
  );
}
function AnnouncementsPanel({ announcements, onOpen }) {
  const sorted = [...announcements].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return (
    <div className="rounded-2xl p-5" style={glassCard}>
      <h3 className="text-sm font-semibold mb-4" style={{ color: COLORS.text }}>Duyurular</h3>
      {sorted.length === 0 && <p className="text-xs" style={{ color: COLORS.textSecondary }}>Henüz duyuru yok</p>}
      <div className="flex flex-col gap-2.5">
        {sorted.map((a) => (
          <button key={a.id} onClick={() => onOpen(a.id)} className="w-full text-left rounded-xl p-3 transition card-hover" style={{ background: "rgba(0,0,0,0.02)" }}>
            {a.imageUrl && <img src={a.imageUrl} alt="" className="w-full h-24 object-cover rounded-lg mb-2" />}
            <div className="text-sm font-medium truncate" style={{ color: COLORS.text }}>{a.title}</div>
            <div className="text-xs truncate mt-0.5" style={{ color: COLORS.textSecondary }}>{a.body}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

function AnnouncementViewerModal({ announcements, initialId, onClose }) {
  const sorted = [...announcements].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const [index, setIndex] = useState(() => Math.max(0, sorted.findIndex((a) => a.id === initialId)));
  const current = sorted[index];
  if (!current) return null;

  return (
    <ModalShell title={current.title} onClose={onClose} width={480}>
      {current.imageUrl && (
        <img src={current.imageUrl} alt="" className="w-full rounded-xl mb-4" style={{ maxHeight: 260, objectFit: "cover" }} />
      )}
      <p className="text-xs mb-3" style={{ color: COLORS.textSecondary }}>{formatDateLong(current.createdAt.slice(0, 10))}</p>
      <p className="text-sm mb-5 whitespace-pre-wrap" style={{ color: COLORS.text, lineHeight: 1.6 }}>{current.body}</p>

      {sorted.length > 1 && (
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
            disabled={index === 0}
            className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium transition"
            style={{ color: COLORS.blue, background: `${COLORS.blue}12`, opacity: index === 0 ? 0.35 : 1 }}
          >
            <ChevronLeft size={14} /> Önceki
          </button>
          <span className="text-xs" style={{ color: COLORS.textSecondary }}>{index + 1} / {sorted.length}</span>
          <button
            onClick={() => setIndex((i) => Math.min(sorted.length - 1, i + 1))}
            disabled={index === sorted.length - 1}
            className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium transition"
            style={{ color: COLORS.blue, background: `${COLORS.blue}12`, opacity: index === sorted.length - 1 ? 0.35 : 1 }}
          >
            Sonraki <ChevronRight size={14} />
          </button>
        </div>
      )}

      <button onClick={onClose} className="w-full py-3 rounded-xl text-sm font-semibold transition" style={{ color: COLORS.textSecondary, background: "rgba(0,0,0,0.05)" }}>
        Kapat
      </button>
    </ModalShell>
  );
}

function AnnouncementsManageSection({ title, announcements, onCreateClick, onOpen, onDelete, canDelete }) {
  const sorted = [...announcements].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return (
    <div className="rounded-2xl p-6" style={glassCard}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold" style={{ color: COLORS.text }}>{title}</h3>
        <button onClick={onCreateClick} className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-white flex-shrink-0" style={{ background: COLORS.blue }}>
          <Plus size={14} /> Yeni Duyuru
        </button>
      </div>
      {sorted.length === 0 && <p className="text-xs" style={{ color: COLORS.textSecondary }}>Henüz duyuru yok</p>}
      <div className="flex flex-col gap-2">
        {sorted.map((a) => (
          <div key={a.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "rgba(0,0,0,0.02)" }}>
            <button onClick={() => onOpen(a.id)} className="flex-1 min-w-0 text-left">
              <div className="text-sm font-medium truncate" style={{ color: COLORS.text }}>{a.title}</div>
              <div className="text-xs truncate" style={{ color: COLORS.textSecondary }}>{a.body}</div>
            </button>
            {canDelete(a) && (
              <button onClick={() => onDelete(a.id)} className="p-2 rounded-lg flex-shrink-0 hover:bg-gray-100 transition">
                <Trash2 size={15} color={COLORS.textSecondary} />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function PrintableCredentials({ data }) {
  if (!data) return null;
  const cellStyle = { border: "1px solid #000", padding: "6px 10px", textAlign: "left", fontSize: 13 };
  return createPortal(
    <div className="print-only" style={{ padding: 24, fontFamily: FONT }}>
      <h1 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>{data.title}</h1>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={cellStyle}>Ad Soyad</th>
            <th style={cellStyle}>Kullanıcı Kodu</th>
            <th style={cellStyle}>Şifre</th>
          </tr>
        </thead>
        <tbody>
          {data.rows.map((r) => (
            <tr key={r.id}>
              <td style={cellStyle}>{r.name}</td>
              <td style={cellStyle}>{r.code}</td>
              <td style={cellStyle}>{r.password}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>,
    document.body
  );
}

function PrintableSeatingChart({ data }) {
  if (!data) return null;
  const { className, chart, students } = data;
  const nameOf = (id) => students.find((s) => s.id === id)?.name || "";
  const assignedIds = new Set();
  chart.desks.forEach((d) => { if (d.left) assignedIds.add(d.left); if (d.right) assignedIds.add(d.right); });
  const unassigned = students.filter((s) => !assignedIds.has(s.id));
  const rows = [0, 1, 2, 3, 4].map((r) => chart.desks.filter((d) => d.row === r));

  const fitFontSize = (name) => {
    const len = name.length;
    if (len <= 10) return 11.5;
    if (len <= 14) return 10;
    if (len <= 18) return 9;
    return 8;
  };

  const cellStyle = { border: "1.5px solid #333", borderRadius: 6, padding: "8px 4px", textAlign: "center", minHeight: 44, display: "flex", alignItems: "center", justifyContent: "center", wordBreak: "break-word", lineHeight: 1.2, overflow: "hidden" };

  return createPortal(
    <div className="print-only" style={{ padding: 28, fontFamily: FONT }}>
      <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 2 }}>{className} Sınıfı Oturma Düzeni</h1>
      <p style={{ fontSize: 11, color: "#666", marginBottom: 18 }}>{formatDateLong(todayStr())}</p>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div style={{ border: "1.5px dashed #999", borderRadius: 8, padding: "6px 14px", fontSize: 12 }}>Kapı</div>
        <div style={{ border: "1.5px solid #333", borderRadius: 8, padding: "6px 14px", fontSize: 12, fontWeight: 600 }}>Öğretmen Masası</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {rows.map((rowDesks, ri) => (
          <div key={ri} style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
            {rowDesks.map((desk) => {
              const leftName = nameOf(desk.left);
              const rightName = nameOf(desk.right);
              return (
                <div key={desk.id} style={{ display: "flex", gap: 4, border: "1px solid #ccc", borderRadius: 8, padding: 4 }}>
                  <div style={{ ...cellStyle, fontSize: leftName ? fitFontSize(leftName) : 12 }}>{leftName || "—"}</div>
                  <div style={{ ...cellStyle, fontSize: rightName ? fitFontSize(rightName) : 12 }}>{rightName || "—"}</div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {unassigned.length > 0 && (
        <div style={{ marginTop: 22 }}>
          <h3 style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Yerleştirilmemiş Öğrenciler</h3>
          <p style={{ fontSize: 12 }}>{unassigned.map((s) => s.name).join(", ")}</p>
        </div>
      )}
    </div>,
    document.body
  );
}
function emptySeatingChart() {
  const desks = [];
  let id = 1;
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 3; col++) {
      desks.push({ id: `d${id}`, row, col, left: null, right: null });
      id++;
    }
  }
  return { desks };
}

function moveStudentInChart(chart, studentId, toDeskId, toSide) {
  const desks = chart.desks.map((d) => ({ ...d }));
  let fromDesk = null, fromSide = null;
  desks.forEach((d) => {
    if (d.left === studentId) { fromDesk = d; fromSide = "left"; }
    if (d.right === studentId) { fromDesk = d; fromSide = "right"; }
  });
  const targetDesk = desks.find((d) => d.id === toDeskId);
  if (!targetDesk) return { desks };
  if (fromDesk && fromDesk.id === targetDesk.id && fromSide === toSide) return { desks };
  const occupant = targetDesk[toSide];
  targetDesk[toSide] = studentId;
  if (fromDesk) fromDesk[fromSide] = occupant || null;
  return { desks };
}

function removeStudentFromChart(chart, studentId) {
  const desks = chart.desks.map((d) => ({
    ...d,
    left: d.left === studentId ? null : d.left,
    right: d.right === studentId ? null : d.right,
  }));
  return { desks };
}

function SeatCell({ studentId, students, onDropStudent, onRemove }) {
  const [dragOver, setDragOver] = useState(false);
  const student = students.find((s) => s.id === studentId);
  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        const sid = e.dataTransfer.getData("text/plain");
        if (sid) onDropStudent(sid);
      }}
      className="flex-1 min-w-0 h-16 rounded-lg flex items-center justify-center px-1.5 text-center overflow-hidden"
      style={{
        background: dragOver ? `${COLORS.blue}15` : student ? `${COLORS.green}12` : "rgba(0,0,0,0.03)",
        border: `1.5px dashed ${dragOver ? COLORS.blue : "rgba(0,0,0,0.12)"}`,
      }}
    >
      {student ? (
        <span
          draggable
          onDragStart={(e) => e.dataTransfer.setData("text/plain", student.id)}
          onDoubleClick={() => onRemove(student.id)}
          title={`${student.name} — kaldırmak için çift tıklayın`}
          className="w-full text-xs font-medium cursor-grab select-none"
          style={{
            color: COLORS.text, lineHeight: 1.2,
            display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
            overflow: "hidden", wordBreak: "break-word",
          }}
        >
          {student.name}
        </span>
      ) : (
        <span className="text-xs" style={{ color: COLORS.textSecondary }}>Boş</span>
      )}
    </div>
  );
}

function SeatingChartBoard({ cls, students, initialChart, onSave, onPrint }) {
  const [chart, setChart] = useState(initialChart && initialChart.desks ? initialChart : emptySeatingChart());
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [unassignedDragOver, setUnassignedDragOver] = useState(false);

  const assignedIds = new Set();
  chart.desks.forEach((d) => { if (d.left) assignedIds.add(d.left); if (d.right) assignedIds.add(d.right); });
  const unassigned = students.filter((s) => !assignedIds.has(s.id));

  const handleDrop = (deskId, side, studentId) => {
    setChart((c) => moveStudentInChart(c, studentId, deskId, side));
    setSaved(false);
  };
  const handleRemove = (studentId) => {
    setChart((c) => removeStudentFromChart(c, studentId));
    setSaved(false);
  };

  const rows = [0, 1, 2, 3, 4].map((r) => chart.desks.filter((d) => d.row === r));

  const handleSave = async () => {
    setSaving(true);
    await onSave(cls.id, chart);
    setSaving(false);
    setSaved(true);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-5">
      <div className="flex-1 min-w-0" style={{ maxWidth: 560 }}>
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium" style={{ border: "1.5px dashed rgba(0,0,0,0.15)", color: COLORS.textSecondary }}>
            <DoorOpen size={14} /> Kapı
          </div>
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium" style={{ background: `${COLORS.indigo}12`, color: COLORS.indigo }}>
            <Presentation size={14} /> Öğretmen Masası
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {rows.map((rowDesks, ri) => (
            <div key={ri} className="grid grid-cols-3 gap-3">
              {rowDesks.map((desk) => (
                <div key={desk.id} className="rounded-xl p-1.5 flex gap-1" style={glassCard}>
                  <SeatCell studentId={desk.left} students={students} onDropStudent={(sid) => handleDrop(desk.id, "left", sid)} onRemove={handleRemove} />
                  <SeatCell studentId={desk.right} students={students} onDropStudent={(sid) => handleDrop(desk.id, "right", sid)} onRemove={handleRemove} />
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="flex gap-2 mt-5">
          <button onClick={handleSave} disabled={saving} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition" style={{ background: saved ? COLORS.green : COLORS.blue, opacity: saving ? 0.7 : 1 }}>
            {saving ? "Kaydediliyor..." : saved ? "Kaydedildi ✓" : "Oturma Planını Kaydet"}
          </button>
          {onPrint && (
            <button onClick={() => onPrint({ className: cls.name, chart, students })} className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold" style={{ color: COLORS.blue, background: `${COLORS.blue}12` }}>
              <Printer size={16} /> Yazdır
            </button>
          )}
        </div>
      </div>

      <div className="lg:w-64 flex-shrink-0">
        <div
          onDragOver={(e) => { e.preventDefault(); setUnassignedDragOver(true); }}
          onDragLeave={() => setUnassignedDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setUnassignedDragOver(false);
            const sid = e.dataTransfer.getData("text/plain");
            if (sid) handleRemove(sid);
          }}
          className="rounded-2xl p-4"
          style={{ ...glassCard, outline: unassignedDragOver ? `2px solid ${COLORS.blue}` : "none" }}
        >
          <h3 className="text-sm font-semibold mb-1" style={{ color: COLORS.text }}>Yerleştirilmemiş Öğrenciler</h3>
          <p className="text-xs mb-3" style={{ color: COLORS.textSecondary }}>Sürükleyip sıralara bırakın (geri almak için buraya sürükleyin)</p>
          <div className="flex flex-wrap gap-2">
            {unassigned.length === 0 && <p className="text-xs" style={{ color: COLORS.textSecondary }}>Herkes yerleştirildi</p>}
            {unassigned.map((s) => (
              <span
                key={s.id}
                draggable
                onDragStart={(e) => e.dataTransfer.setData("text/plain", s.id)}
                className="px-3 py-1.5 rounded-full text-xs font-medium cursor-grab select-none"
                style={{ background: `${COLORS.green}15`, color: COLORS.green, border: `1px solid ${COLORS.green}30` }}
              >
                {s.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


function StatMini({ label, value, color }) {
  return (
    <div className="rounded-xl py-2 text-center" style={{ background: `${color}0D` }}>
      <div className="text-sm font-semibold" style={{ color }}>{value}</div>
      <div className="text-xs" style={{ color: COLORS.textSecondary }}>{label}</div>
    </div>
  );
}

function BookCheckList({ students, classId, bookChecks, onCheck }) {
  const today = todayStr();
  const statusOf = (studentId) => bookChecks.find((b) => b.studentId === studentId && b.date === today)?.status || null;

  return (
    <div className="rounded-2xl overflow-hidden" style={glassCard}>
      {students.length === 0 && <div className="py-14 text-center text-sm" style={{ color: COLORS.textSecondary }}>Bu sınıfta öğrenci yok</div>}
      {students.map((s, i) => {
        const status = statusOf(s.id);
        return (
          <div key={s.id} className="flex items-center gap-3 px-5 py-3" style={{ borderTop: i === 0 ? "none" : "1px solid rgba(0,0,0,0.05)" }}>
            <Avatar name={s.name} color={COLORS.green} />
            <span className="flex-1 min-w-0 text-sm font-medium truncate" style={{ color: COLORS.text }}>{s.name}</span>
            <button
              onClick={() => onCheck(s.id, classId, "getirdi")}
              title="Getirdi"
              className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition"
              style={{ background: status === "getirdi" ? COLORS.green : `${COLORS.green}12` }}
            >
              <Check size={16} color={status === "getirdi" ? "#fff" : COLORS.green} strokeWidth={3} />
            </button>
            <button
              onClick={() => onCheck(s.id, classId, "getirmedi")}
              title="Getirmedi"
              className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition"
              style={{ background: status === "getirmedi" ? COLORS.red : `${COLORS.red}12` }}
            >
              <X size={16} color={status === "getirmedi" ? "#fff" : COLORS.red} strokeWidth={3} />
            </button>
            <button
              onClick={() => onCheck(s.id, classId, "gelmedi")}
              title="Gelmedi"
              className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition"
              style={{ background: status === "gelmedi" ? "#8B5E34" : "#fff", border: "2px solid #8B5E34" }}
            >
              {status === "gelmedi" && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#fff" }} />}
            </button>
          </div>
        );
      })}
    </div>
  );
}

function CommentModal({ student, onClose, onSave }) {
  const [text, setText] = useState("");
  const handleSubmit = () => {
    if (!text.trim()) return;
    onSave(text.trim());
    onClose();
  };
  return (
    <ModalShell title={`${student.name} — Yorum Ekle`} onClose={onClose} width={400}>
      <label className="block mb-4">
        <span className="block text-xs font-medium mb-1.5" style={{ color: COLORS.textSecondary }}>Yorum</span>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none"
          style={{ border: "1px solid rgba(0,0,0,0.1)", background: "#FAFAFA", color: COLORS.text, resize: "vertical" }}
        />
      </label>
      <button onClick={handleSubmit} className="w-full py-3 rounded-xl text-sm font-semibold text-white transition" style={{ background: COLORS.blue }}>
        Kaydet
      </button>
    </ModalShell>
  );
}

function BehaviorList({ students, classId, behaviorEvents, onBehavior, onComment }) {
  const [commentingStudent, setCommentingStudent] = useState(null);
  const countOf = (studentId, type) => behaviorEvents.filter((e) => e.studentId === studentId && e.type === type).length;

  return (
    <>
      <div className="rounded-2xl overflow-hidden" style={glassCard}>
        {students.length === 0 && <div className="py-14 text-center text-sm" style={{ color: COLORS.textSecondary }}>Bu sınıfta öğrenci yok</div>}
        {students.map((s, i) => (
          <div key={s.id} className="flex items-center gap-3 px-5 py-3" style={{ borderTop: i === 0 ? "none" : "1px solid rgba(0,0,0,0.05)" }}>
            <Avatar name={s.name} color={COLORS.green} />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate" style={{ color: COLORS.text }}>{s.name}</div>
              <div className="text-xs" style={{ color: COLORS.textSecondary }}>{countOf(s.id, "plus")} artı · {countOf(s.id, "minus")} eksi</div>
            </div>
            <button onClick={() => onBehavior(s.id, classId, "minus")} className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-base font-bold transition" style={{ background: `${COLORS.red}12`, color: COLORS.red }}>−</button>
            <button onClick={() => onBehavior(s.id, classId, "plus")} className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-base font-bold transition" style={{ background: `${COLORS.green}12`, color: COLORS.green }}>+</button>
            <button onClick={() => setCommentingStudent(s)} className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition" style={{ background: `${COLORS.indigo}12`, color: COLORS.indigo }}>
              <MessageCircle size={15} />
            </button>
          </div>
        ))}
      </div>
      {commentingStudent && (
        <CommentModal student={commentingStudent} onClose={() => setCommentingStudent(null)} onSave={(text) => onComment(commentingStudent.id, classId, text)} />
      )}
    </>
  );
}

const DAY_NAMES = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];

function formatDateLong(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  return `${d.getDate()} ${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()} ${DAY_NAMES[d.getDay()]}`;
}

function StudentSummaryCard({ student, bookChecks, behaviorEvents, comments }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const myChecks = bookChecks.filter((b) => b.studentId === student.id);
  const myBehavior = behaviorEvents.filter((e) => e.studentId === student.id);
  const myComments = comments.filter((c) => c.studentId === student.id);
  const plusCount = myBehavior.filter((e) => e.type === "plus").length;
  const minusCount = myBehavior.filter((e) => e.type === "minus").length;
  const getirdiCount = myChecks.filter((c) => c.status === "getirdi").length;

  const allDates = Array.from(new Set([
    ...myChecks.map((c) => c.date),
    ...myBehavior.map((e) => e.date),
    ...myComments.map((c) => c.date),
  ])).sort((a, b) => b.localeCompare(a));

  const dateDetail = (date) => ({
    check: myChecks.find((c) => c.date === date),
    dayPlus: myBehavior.filter((e) => e.date === date && e.type === "plus").length,
    dayMinus: myBehavior.filter((e) => e.date === date && e.type === "minus").length,
    dayComments: myComments.filter((c) => c.date === date),
  });

  const CHECK_LABEL = { getirdi: { label: "Getirdi", color: COLORS.green }, getirmedi: { label: "Getirmedi", color: COLORS.red }, gelmedi: { label: "Gelmedi", color: "#8B5E34" } };

  return (
    <div className="rounded-2xl p-5" style={glassCard}>
      <div className="flex items-center gap-3 mb-4">
        <Avatar name={student.name} color={COLORS.green} />
        <span className="text-sm font-semibold" style={{ color: COLORS.text }}>{student.name}</span>
      </div>
      <div className="grid grid-cols-3 gap-2 mb-4">
        <StatMini label="Artı" value={plusCount} color={COLORS.green} />
        <StatMini label="Eksi" value={minusCount} color={COLORS.red} />
        <StatMini label="Kitap-Defter" value={`${getirdiCount}/${myChecks.length}`} color={COLORS.blue} />
      </div>

      {allDates.length === 0 ? (
        <p className="text-xs" style={{ color: COLORS.textSecondary }}>Henüz kayıt yok</p>
      ) : (
        <div>
          <div className="text-xs font-medium mb-1.5" style={{ color: COLORS.textSecondary }}>Tarihler</div>
          <div className="flex flex-col gap-1.5">
            {allDates.map((date) => {
              const isOpen = selectedDate === date;
              const { check, dayPlus, dayMinus, dayComments } = dateDetail(date);
              const checkCfg = check ? CHECK_LABEL[check.status] : null;
              return (
                <div key={date}>
                  <button
                    onClick={() => setSelectedDate(isOpen ? null : date)}
                    className="w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg text-xs font-medium text-left transition"
                    style={{ background: isOpen ? `${COLORS.blue}12` : "rgba(0,0,0,0.02)", color: isOpen ? COLORS.blue : COLORS.text }}
                  >
                    <span>{formatDateLong(date)}</span>
                    {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </button>
                  {isOpen && (
                    <div className="px-3 py-2.5 rounded-lg mt-1 flex flex-col gap-1.5" style={{ background: "rgba(0,0,0,0.02)" }}>
                      {checkCfg && <div className="text-xs font-medium" style={{ color: checkCfg.color }}>Kitap-Defter: {checkCfg.label}</div>}
                      {(dayPlus > 0 || dayMinus > 0) && (
                        <div className="text-xs">
                          {dayPlus > 0 && <span style={{ color: COLORS.green }}>+{dayPlus} artı</span>}
                          {dayPlus > 0 && dayMinus > 0 && <span style={{ color: COLORS.textSecondary }}> · </span>}
                          {dayMinus > 0 && <span style={{ color: COLORS.red }}>{dayMinus} eksi</span>}
                        </div>
                      )}
                      {dayComments.map((c) => (
                        <div key={c.id} className="text-xs" style={{ color: COLORS.text }}>💬 {c.text}</div>
                      ))}
                      {!checkCfg && dayPlus === 0 && dayMinus === 0 && dayComments.length === 0 && (
                        <div className="text-xs" style={{ color: COLORS.textSecondary }}>Bu tarihte kayıt yok</div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function ClassSummaryView({ students, bookChecks, behaviorEvents, comments }) {
  return (
    <div className="flex flex-col gap-3">
      {students.length === 0 && <div className="rounded-2xl py-14 text-center text-sm" style={{ ...glassCard, color: COLORS.textSecondary }}>Görüntülenecek öğrenci yok</div>}
      {students.map((s) => (
        <StudentSummaryCard key={s.id} student={s} bookChecks={bookChecks} behaviorEvents={behaviorEvents} comments={comments} />
      ))}
    </div>
  );
}

function MyClassesTab({ myClasses, students, bookChecks, behaviorEvents, comments, onCheck, onBehavior, onComment }) {
  const [mode, setMode] = useState("book");
  const [selectedClassId, setSelectedClassId] = useState(null);
  const selectedClass = myClasses.find((c) => c.id === selectedClassId);

  const modeButtons = (
    <div className="flex flex-wrap gap-2 mb-5">
      <button onClick={() => setMode("book")} className="px-3.5 py-2 rounded-xl text-xs font-semibold transition" style={{ background: mode === "book" ? COLORS.blue : "rgba(255,255,255,0.8)", color: mode === "book" ? "#fff" : COLORS.textSecondary, border: "1px solid rgba(0,0,0,0.08)" }}>
        Kitap-Defter Kontrolü
      </button>
      <button onClick={() => setMode("behavior")} className="px-3.5 py-2 rounded-xl text-xs font-semibold transition" style={{ background: mode === "behavior" ? COLORS.blue : "rgba(255,255,255,0.8)", color: mode === "behavior" ? "#fff" : COLORS.textSecondary, border: "1px solid rgba(0,0,0,0.08)" }}>
        Ders İçi Davranış
      </button>
      <button onClick={() => setMode("summary")} className="px-3.5 py-2 rounded-xl text-xs font-semibold transition" style={{ background: mode === "summary" ? COLORS.blue : "rgba(255,255,255,0.8)", color: mode === "summary" ? "#fff" : COLORS.textSecondary, border: "1px solid rgba(0,0,0,0.08)" }}>
        Sınıf Özetlerim
      </button>
    </div>
  );

  if (selectedClass) {
    const classStudents = students.filter((s) => s.classId === selectedClass.id);
    return (
      <div>
        <button onClick={() => setSelectedClassId(null)} className="flex items-center gap-1 text-xs font-medium mb-4" style={{ color: COLORS.blue }}>
          <ChevronLeft size={14} /> Sınıflarım
        </button>
        {modeButtons}
        <h2 className="text-lg font-semibold mb-4" style={{ color: COLORS.text }}>{selectedClass.name}</h2>
        {mode === "book" && <BookCheckList students={classStudents} classId={selectedClass.id} bookChecks={bookChecks} onCheck={onCheck} />}
        {mode === "behavior" && <BehaviorList students={classStudents} classId={selectedClass.id} behaviorEvents={behaviorEvents} onBehavior={onBehavior} onComment={onComment} />}
        {mode === "summary" && <ClassSummaryView students={classStudents} bookChecks={bookChecks} behaviorEvents={behaviorEvents} comments={comments} />}
      </div>
    );
  }

  return (
    <div>
      {modeButtons}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {myClasses.length === 0 && <p className="text-sm" style={{ color: COLORS.textSecondary }}>Henüz bir sınıfınız yok.</p>}
        {myClasses.map((c) => {
          const classStudents = students.filter((s) => s.classId === c.id);
          return (
            <button key={c.id} onClick={() => setSelectedClassId(c.id)} className="rounded-2xl p-6 text-left transition card-hover" style={glassCard}>
              <div className="flex items-center justify-between mb-2">
                <div className="text-lg font-semibold" style={{ color: COLORS.text }}>{c.name}</div>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${COLORS.orange}15` }}>
                  <School size={18} color={COLORS.orange} />
                </div>
              </div>
              <div className="text-xs" style={{ color: COLORS.textSecondary }}>{classStudents.length} öğrenci</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
/* ------------------------------------------------------------------ */
/* Sınavlar (öğretmen)                                                  */
/* ------------------------------------------------------------------ */

const QUESTION_TYPES = [
  { id: "mc", label: "Çoktan seçmeli" },
  { id: "tf", label: "Doğru / Yanlış" },
  { id: "fill", label: "Boşluk doldurma" },
  { id: "open", label: "Açık uçlu / Yazma" },
];
const QUESTION_TYPE_LABEL = Object.fromEntries(QUESTION_TYPES.map((t) => [t.id, t.label]));
const DEFAULT_LEVELS = { A2: 30, B1: 55, B2: 75, C1: 90 };
const OPTION_LETTERS = "ABCDE";
const examTextareaStyle = { border: "1px solid rgba(0,0,0,0.1)", background: "#FAFAFA", color: COLORS.text, resize: "vertical" };
const examInputStyle = { border: "1px solid rgba(0,0,0,0.1)", background: "#FAFAFA", color: COLORS.text };

async function uploadExamImage(file) {
  const safeName = file.name.replace(/[^a-zA-Z0-9.]/g, "_");
  const path = `exams/${Date.now()}-${safeName}`;
  const { error } = await supabase.storage.from("uploads").upload(path, file, { cacheControl: "3600", upsert: false });
  if (error) return { error: error.message };
  const { data } = supabase.storage.from("uploads").getPublicUrl(path);
  return { url: data.publicUrl };
}

function ExamToggle({ checked, onChange, title, desc }) {
  return (
    <label className="flex items-start gap-3 py-2.5 cursor-pointer">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="mt-1" />
      <div>
        <div className="text-sm font-medium" style={{ color: COLORS.text }}>{title}</div>
        <div className="text-xs" style={{ color: COLORS.textSecondary }}>{desc}</div>
      </div>
    </label>
  );
}

function QuestionModal({ examId, question, correct, position, onClose, onSaved }) {
  const isNew = !question;
  const [type, setType] = useState(question?.type || "mc");
  const [text, setText] = useState(question?.text || "");
  const [passage, setPassage] = useState(question?.passage || "");
  const [imageUrl, setImageUrl] = useState(question?.image_url || "");
  const [points, setPoints] = useState(question?.points ?? 1);
  const [options, setOptions] = useState(question?.type === "mc" && Array.isArray(question.options) ? [...question.options] : ["", "", "", ""]);
  const [mcCorrect, setMcCorrect] = useState(question?.type === "mc" && typeof correct === "number" ? correct : null);
  const [tfCorrect, setTfCorrect] = useState(question?.type === "tf" && typeof correct === "boolean" ? correct : null);
  const [fillAnswers, setFillAnswers] = useState(question?.type === "fill" && Array.isArray(correct) ? correct.join("\n") : "");
  const [minWords, setMinWords] = useState(question?.min_words || "");
  const [maxWords, setMaxWords] = useState(question?.max_words || "");
  const [note, setNote] = useState(question?.type === "open" && typeof correct === "string" ? correct : "");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setUploading(true);
    const res = await uploadExamImage(file);
    setUploading(false);
    if (res.error) return setError("Görsel yüklenemedi: " + res.error);
    setImageUrl(res.url);
  };

  const addOption = () => { if (options.length < 5) setOptions([...options, ""]); };
  const removeOption = () => {
    if (options.length <= 2) return;
    const next = options.slice(0, -1);
    setOptions(next);
    if (mcCorrect !== null && mcCorrect >= next.length) setMcCorrect(null);
  };

  const handleSave = async () => {
    setError("");
    if (!text.trim()) return setError("Soru metnini yazın.");
    const pts = Number(String(points).replace(",", "."));
    if (isNaN(pts) || pts < 0) return setError("Puan 0 veya daha büyük bir sayı olmalı.");

    const row = { exam_id: examId, type, text: text.trim(), passage: passage.trim() || null, image_url: imageUrl || null, points: pts, options: null, min_words: null, max_words: null };
    let key = null;
    if (type === "mc") {
      const opts = options.map((o) => o.trim());
      if (opts.some((o) => !o)) return setError("Tüm şıkları doldurun ya da boş şıkkı silin.");
      if (mcCorrect === null || mcCorrect >= opts.length) return setError("Doğru şıkkı seçin.");
      row.options = opts;
      key = mcCorrect;
    } else if (type === "tf") {
      if (tfCorrect === null) return setError("Doğru cevabı seçin (Doğru ya da Yanlış).");
      key = tfCorrect;
    } else if (type === "fill") {
      const answers = fillAnswers.split("\n").map((s) => s.trim()).filter(Boolean);
      if (!answers.length) return setError("En az bir kabul edilen cevap yazın.");
      key = answers;
    } else {
      row.min_words = Number(minWords) || null;
      row.max_words = Number(maxWords) || null;
      if (row.min_words && row.max_words && row.min_words > row.max_words) return setError("En az kelime sayısı en fazlasından büyük olamaz.");
      key = note.trim() || null;
    }

    setSaving(true);
    let qid = question?.id;
    if (isNew) {
      const { data, error: e1 } = await supabase.from("exam_questions").insert({ ...row, position }).select().single();
      if (e1) { setSaving(false); return setError("Kaydedilemedi: " + e1.message); }
      qid = data.id;
    } else {
      const { error: e1 } = await supabase.from("exam_questions").update(row).eq("id", qid);
      if (e1) { setSaving(false); return setError("Kaydedilemedi: " + e1.message); }
    }
    const { error: e2 } = await supabase.from("exam_keys").upsert({ question_id: qid, correct: key });
    setSaving(false);
    if (e2) return setError("Soru kaydedildi ama doğru cevap kaydedilemedi: " + e2.message);
    onSaved();
  };

  return (
    <ModalShell title={isNew ? "Yeni Soru" : "Soruyu Düzenle"} onClose={onClose} width={580}>
      <div className="mb-4">
        <span className="block text-xs font-medium mb-1.5" style={{ color: COLORS.textSecondary }}>Soru Tipi</span>
        <div className="grid grid-cols-2 gap-2">
          {QUESTION_TYPES.map((t) => (
            <button
              key={t.id}
              onClick={() => setType(t.id)}
              className="py-2.5 px-3 rounded-xl text-xs font-semibold transition"
              style={{ background: type === t.id ? COLORS.blue : "#FAFAFA", color: type === t.id ? "#fff" : COLORS.text, border: "1px solid rgba(0,0,0,0.1)" }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <label className="block mb-4">
        <span className="block text-xs font-medium mb-1.5" style={{ color: COLORS.textSecondary }}>Okuma metni / paragraf (opsiyonel)</span>
        <textarea value={passage} onChange={(e) => setPassage(e.target.value)} rows={3} className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none" style={examTextareaStyle} />
      </label>

      <label className="block mb-4">
        <span className="block text-xs font-medium mb-1.5" style={{ color: COLORS.textSecondary }}>Soru</span>
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={3} className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none" style={examTextareaStyle} />
        {type === "fill" && <span className="block text-xs mt-1" style={{ color: COLORS.textSecondary }}>İpucu: Boşluğu soru metninde ___ ile gösterebilirsiniz.</span>}
      </label>

      <div className="mb-4">
        <span className="block text-xs font-medium mb-1.5" style={{ color: COLORS.textSecondary }}>Görsel (opsiyonel — grafik, şekil, resim)</span>
        {imageUrl ? (
          <div className="relative">
            <img src={imageUrl} alt="" className="w-full rounded-xl" style={{ maxHeight: 220, objectFit: "contain", background: "#fff", border: "1px solid rgba(0,0,0,0.08)" }} />
            <button onClick={() => setImageUrl("")} type="button" className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center" style={{ background: "rgba(0,0,0,0.6)" }}>
              <X size={14} color="#fff" />
            </button>
          </div>
        ) : (
          <label className="flex items-center justify-center gap-2 py-5 rounded-xl text-xs font-medium cursor-pointer transition" style={{ border: "1.5px dashed rgba(0,0,0,0.15)", color: COLORS.textSecondary, background: "#FAFAFA" }}>
            {uploading ? "Yükleniyor..." : (<><ImagePlus size={16} /> Görsel Seç</>)}
            <input type="file" accept="image/*" onChange={handleFile} disabled={uploading} className="hidden" />
          </label>
        )}
      </div>

      {type === "mc" && (
        <div className="mb-4">
          <span className="block text-xs font-medium mb-1.5" style={{ color: COLORS.textSecondary }}>
            Şıklar <span style={{ fontWeight: 400 }}>(doğru şıkkın harfine tıklayın)</span>
          </span>
          {options.map((o, j) => (
            <div key={j} className="flex items-center gap-2 mb-2">
              <button
                onClick={() => setMcCorrect(j)}
                className="w-9 h-9 rounded-full text-xs font-bold flex-shrink-0 transition"
                style={{ background: mcCorrect === j ? COLORS.green : "#FAFAFA", color: mcCorrect === j ? "#fff" : COLORS.textSecondary, border: "1px solid rgba(0,0,0,0.1)" }}
              >
                {OPTION_LETTERS[j]}
              </button>
              <input
                value={o}
                onChange={(e) => setOptions(options.map((x, k) => (k === j ? e.target.value : x)))}
                placeholder={`${OPTION_LETTERS[j]} şıkkı`}
                className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none"
                style={examInputStyle}
              />
            </div>
          ))}
          <div className="flex gap-2">
            <button onClick={addOption} disabled={options.length >= 5} className="px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ color: COLORS.blue, background: `${COLORS.blue}12`, opacity: options.length >= 5 ? 0.4 : 1 }}>Şık ekle</button>
            <button onClick={removeOption} disabled={options.length <= 2} className="px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ color: COLORS.textSecondary, background: "rgba(0,0,0,0.05)", opacity: options.length <= 2 ? 0.4 : 1 }}>Son şıkkı sil</button>
          </div>
        </div>
      )}

      {type === "tf" && (
        <div className="mb-4">
          <span className="block text-xs font-medium mb-1.5" style={{ color: COLORS.textSecondary }}>Doğru cevap</span>
          <div className="grid grid-cols-2 gap-2">
            {[[true, "Doğru"], [false, "Yanlış"]].map(([val, label]) => (
              <button
                key={label}
                onClick={() => setTfCorrect(val)}
                className="py-2.5 rounded-xl text-sm font-semibold transition"
                style={{ background: tfCorrect === val ? COLORS.green : "#FAFAFA", color: tfCorrect === val ? "#fff" : COLORS.text, border: "1px solid rgba(0,0,0,0.1)" }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {type === "fill" && (
        <label className="block mb-4">
          <span className="block text-xs font-medium mb-1.5" style={{ color: COLORS.textSecondary }}>Kabul edilen cevaplar (her satıra bir cevap)</span>
          <textarea value={fillAnswers} onChange={(e) => setFillAnswers(e.target.value)} rows={3} placeholder={"goes\ngo es"} className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none" style={examTextareaStyle} />
          <span className="block text-xs mt-1" style={{ color: COLORS.textSecondary }}>Büyük/küçük harf ve fazla boşluklar önemsenmez.</span>
        </label>
      )}

      {type === "open" && (
        <>
          <div className="grid grid-cols-2 gap-3">
            <FormInput label="En az kelime (opsiyonel)" type="number" min="0" value={minWords} onChange={(e) => setMinWords(e.target.value)} />
            <FormInput label="En fazla kelime (opsiyonel)" type="number" min="0" value={maxWords} onChange={(e) => setMaxWords(e.target.value)} />
          </div>
          <label className="block mb-4">
            <span className="block text-xs font-medium mb-1.5" style={{ color: COLORS.textSecondary }}>Puanlama notu / örnek cevap (opsiyonel, öğrenciler görmez)</span>
            <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none" style={examTextareaStyle} />
          </label>
        </>
      )}

      <div style={{ maxWidth: 140 }}>
        <FormInput label="Puan" type="number" min="0" step="0.5" value={points} onChange={(e) => setPoints(e.target.value)} />
      </div>

      {error && <p className="text-xs mb-3" style={{ color: COLORS.red }}>{error}</p>}

      <div className="flex gap-2">
        <button onClick={onClose} className="px-4 py-3 rounded-xl text-sm font-medium" style={{ color: COLORS.textSecondary }}>Vazgeç</button>
        <button onClick={handleSave} disabled={saving || uploading} className="flex-1 py-3 rounded-xl text-sm font-semibold text-white transition" style={{ background: COLORS.blue, opacity: (saving || uploading) ? 0.6 : 1 }}>
          {saving ? "Kaydediliyor..." : "Soruyu Kaydet"}
        </button>
      </div>
    </ModalShell>
  );
}

function ExamEditor({ examId, currentUser, onBack }) {
  const [id, setId] = useState(examId);
  const [loading, setLoading] = useState(!!examId);
  const [form, setForm] = useState({
    title: "", subject: "", description: "", duration: 40,
    shuffleQ: true, shuffleO: true, blockPaste: true, showResult: false,
    useLevels: false, levels: { ...DEFAULT_LEVELS },
  });
  const [questions, setQuestions] = useState([]);
  const [keys, setKeys] = useState({});
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState(null);
  const [editingQ, setEditingQ] = useState(null);
  const [confirmDelId, setConfirmDelId] = useState(null);

  const loadQuestions = async (targetId) => {
    const { data: qs, error } = await supabase.from("exam_questions").select("*").eq("exam_id", targetId).order("position", { ascending: true }).order("created_at", { ascending: true });
    if (error) { setNotice({ ok: false, text: "Sorular yüklenemedi: " + error.message }); return; }
    const list = qs || [];
    const keyMap = {};
    if (list.length) {
      const { data: ks } = await supabase.from("exam_keys").select("*").in("question_id", list.map((q) => q.id));
      (ks || []).forEach((k) => { keyMap[k.question_id] = k.correct; });
    }
    setQuestions(list);
    setKeys(keyMap);
  };

  useEffect(() => {
    if (!examId) return;
    (async () => {
      const { data: ex, error } = await supabase.from("exams").select("*").eq("id", examId).single();
      if (error || !ex) { setNotice({ ok: false, text: "Sınav yüklenemedi." }); setLoading(false); return; }
      setForm({
        title: ex.title, subject: ex.subject || "", description: ex.description || "", duration: ex.duration_minutes,
        shuffleQ: ex.shuffle_questions, shuffleO: ex.shuffle_options, blockPaste: ex.block_paste, showResult: ex.show_result,
        useLevels: !!ex.levels, levels: ex.levels || { ...DEFAULT_LEVELS },
      });
      await loadQuestions(examId);
      setLoading(false);
    })();
  }, []);

  const setField = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const saveSettings = async () => {
    setNotice(null);
    if (!form.title.trim()) return setNotice({ ok: false, text: "Sınav başlığını yazın." });
    const dur = Number(form.duration);
    if (!dur || dur < 1 || dur > 600) return setNotice({ ok: false, text: "Süre 1 ile 600 dakika arasında olmalı." });
    let levels = null;
    if (form.useLevels) {
      const L = { A2: Number(form.levels.A2), B1: Number(form.levels.B1), B2: Number(form.levels.B2), C1: Number(form.levels.C1) };
      if (Object.values(L).some((v) => isNaN(v) || v < 0 || v > 100) || !(L.A2 < L.B1 && L.B1 < L.B2 && L.B2 < L.C1)) {
        return setNotice({ ok: false, text: "Seviye eşikleri 0-100 arasında ve A2 < B1 < B2 < C1 olacak şekilde artmalı." });
      }
      levels = L;
    }
    const payload = {
      title: form.title.trim(), subject: form.subject.trim() || null, description: form.description.trim() || null,
      duration_minutes: dur, shuffle_questions: form.shuffleQ, shuffle_options: form.shuffleO,
      block_paste: form.blockPaste, show_result: form.showResult, levels,
    };
    setSaving(true);
    if (!id) {
      const { data, error } = await supabase.from("exams").insert({ ...payload, created_by: currentUser.id }).select().single();
      setSaving(false);
      if (error) return setNotice({ ok: false, text: "Sınav oluşturulamadı: " + error.message });
      setId(data.id);
      setNotice({ ok: true, text: "Sınav oluşturuldu. Şimdi soru ekleyebilirsiniz." });
    } else {
      const { error } = await supabase.from("exams").update(payload).eq("id", id);
      setSaving(false);
      if (error) return setNotice({ ok: false, text: "Kaydedilemedi: " + error.message });
      setNotice({ ok: true, text: "Ayarlar kaydedildi." });
    }
  };

  const nextPosition = questions.length ? Math.max(...questions.map((q) => q.position)) + 1 : 1;

  const moveQuestion = async (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= questions.length) return;
    const arr = [...questions];
    [arr[i], arr[j]] = [arr[j], arr[i]];
    const renumbered = arr.map((q, k) => ({ ...q, position: k + 1 }));
    setQuestions(renumbered);
    const changed = renumbered.filter((q, k) => q.position !== questions.find((o) => o.id === q.id)?.position);
    await Promise.all(changed.map((q) => supabase.from("exam_questions").update({ position: q.position }).eq("id", q.id)));
  };

  const deleteQuestion = async (qid) => {
    const { error } = await supabase.from("exam_questions").delete().eq("id", qid);
    setConfirmDelId(null);
    if (error) return setNotice({ ok: false, text: "Soru silinemedi: " + error.message });
    await loadQuestions(id);
  };

  const totalPoints = questions.reduce((s, q) => s + Number(q.points || 0), 0);

  if (loading) return <div className="py-14 text-center text-sm" style={{ color: COLORS.textSecondary }}>Yükleniyor...</div>;

  const correctLabel = (q) => {
    const k = keys[q.id];
    if (q.type === "tf") return k === true ? "Doğru: Doğru" : k === false ? "Doğru: Yanlış" : "";
    if (q.type === "fill") return Array.isArray(k) ? `Kabul edilen: ${k.join(" / ")}` : "";
    return "";
  };

  return (
    <div>
      <button onClick={onBack} className="flex items-center gap-1 text-xs font-medium mb-4" style={{ color: COLORS.blue }}>
        <ChevronLeft size={14} /> Sınavlarım
      </button>

      <div className="rounded-2xl p-6 mb-5" style={glassCard}>
        <h3 className="text-sm font-semibold mb-4" style={{ color: COLORS.text }}>Sınav Ayarları</h3>
        <FormInput label="Sınav Başlığı" placeholder="Örn. 9. Sınıf İngilizce 1. Yazılı" value={form.title} onChange={(e) => setField("title", e.target.value)} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FormInput label="Ders" list="exam-subjects" placeholder="Örn. Matematik" value={form.subject} onChange={(e) => setField("subject", e.target.value)} />
          <FormInput label="Süre (dakika)" type="number" min="1" max="600" value={form.duration} onChange={(e) => setField("duration", e.target.value)} />
        </div>
        <datalist id="exam-subjects">
          {[...MAIN_SUBJECTS, ...ELECTIVE_SUBJECTS].map((s) => <option key={s} value={s} />)}
        </datalist>
        <FormInput label="Açıklama / yönerge (opsiyonel)" placeholder="Öğrencilerin başlamadan önce göreceği kısa not" value={form.description} onChange={(e) => setField("description", e.target.value)} />

        <div style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }} className="pt-2">
          <ExamToggle checked={form.shuffleQ} onChange={(v) => setField("shuffleQ", v)} title="Soruları karıştır" desc="Her öğrenciye sorular farklı sırada gelir. Açık uçlu sorular her zaman sonda kalır." />
          <ExamToggle checked={form.shuffleO} onChange={(v) => setField("shuffleO", v)} title="Şıkları karıştır" desc="Çoktan seçmeli sorularda şık sırası her öğrenci için farklı olur." />
          <ExamToggle checked={form.blockPaste} onChange={(v) => setField("blockPaste", v)} title="Yazma sorularında yapıştırmayı kapat" desc="Öğrenci cevabını kopyalayıp yapıştıramaz." />
          <ExamToggle checked={form.showResult} onChange={(v) => setField("showResult", v)} title="Sonucu öğrenciye göster" desc="Puanlama tamamlandıktan sonra öğrenci kendi puanını görür." />
          <ExamToggle checked={form.useLevels} onChange={(v) => setField("useLevels", v)} title="Seviye hesapla (A1–C1)" desc="İngilizce seviye tespit sınavları için. Toplam puanın yüzdesine göre seviye atanır." />
        </div>

        {form.useLevels && (
          <div className="grid grid-cols-4 gap-2 mt-2">
            {["A2", "B1", "B2", "C1"].map((l) => (
              <FormInput key={l} label={`${l} en az %`} type="number" min="0" max="100" value={form.levels[l]} onChange={(e) => setForm((f) => ({ ...f, levels: { ...f.levels, [l]: e.target.value } }))} />
            ))}
          </div>
        )}

        {notice && <p className="text-xs mb-3" style={{ color: notice.ok ? COLORS.green : COLORS.red }}>{notice.text}</p>}
        <button onClick={saveSettings} disabled={saving} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition" style={{ background: COLORS.blue, opacity: saving ? 0.6 : 1 }}>
          {saving ? "Kaydediliyor..." : id ? "Ayarları Kaydet" : "Sınavı Oluştur"}
        </button>
      </div>

      {id ? (
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-semibold" style={{ color: COLORS.text }}>Sorular</h3>
              <p className="text-xs" style={{ color: COLORS.textSecondary }}>{questions.length} soru · toplam {totalPoints} puan</p>
            </div>
            <button onClick={() => setEditingQ({ question: null })} className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-white" style={{ background: COLORS.blue }}>
              <Plus size={14} /> Soru Ekle
            </button>
          </div>

          <div className="flex flex-col gap-2">
            {questions.length === 0 && (
              <div className="rounded-2xl py-12 text-center text-sm" style={{ ...glassCard, color: COLORS.textSecondary }}>Henüz soru eklenmedi</div>
            )}
            {questions.map((q, i) => (
              <div key={q.id} className="rounded-2xl p-4 flex gap-3" style={glassCard}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background: `${COLORS.blue}12`, color: COLORS.blue }}>{i + 1}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5 mb-1">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: `${COLORS.indigo}15`, color: COLORS.indigo }}>{QUESTION_TYPE_LABEL[q.type]}</span>
                    <span className="text-xs" style={{ color: COLORS.textSecondary }}>{Number(q.points)} puan</span>
                    {q.passage && <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(0,0,0,0.05)", color: COLORS.textSecondary }}>Okuma metni</span>}
                    {q.image_url && <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(0,0,0,0.05)", color: COLORS.textSecondary }}>Görsel</span>}
                  </div>
                  <p className="text-sm whitespace-pre-wrap" style={{ color: COLORS.text }}>{q.text}</p>
                  {q.image_url && <img src={q.image_url} alt="" className="mt-2 rounded-lg" style={{ maxHeight: 120, objectFit: "contain", border: "1px solid rgba(0,0,0,0.08)", background: "#fff" }} />}
                  {q.type === "mc" && Array.isArray(q.options) && (
                    <div className="mt-2 flex flex-col gap-0.5">
                      {q.options.map((o, j) => (
                        <span key={j} className="text-xs" style={{ color: keys[q.id] === j ? COLORS.green : COLORS.textSecondary, fontWeight: keys[q.id] === j ? 600 : 400 }}>{OPTION_LETTERS[j]}) {o}</span>
                      ))}
                    </div>
                  )}
                  {correctLabel(q) && <p className="text-xs mt-2 font-medium" style={{ color: COLORS.green }}>{correctLabel(q)}</p>}
                  {q.type === "open" && (q.min_words || q.max_words) && <p className="text-xs mt-2" style={{ color: COLORS.textSecondary }}>Hedef: {q.min_words || 0}–{q.max_words || "∞"} kelime</p>}
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  {confirmDelId === q.id ? (
                    <div className="flex items-center gap-1">
                      <button onClick={() => deleteQuestion(q.id)} className="text-xs font-semibold px-2.5 py-1.5 rounded-lg text-white" style={{ background: COLORS.red }}>Sil</button>
                      <button onClick={() => setConfirmDelId(null)} className="text-xs font-medium px-2 py-1.5 rounded-lg" style={{ color: COLORS.textSecondary }}>Vazgeç</button>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <button onClick={() => moveQuestion(i, -1)} disabled={i === 0} title="Yukarı taşı" className="p-1.5 rounded-lg hover:bg-gray-100 transition" style={{ opacity: i === 0 ? 0.3 : 1 }}>
                        <ChevronDown size={15} color={COLORS.textSecondary} style={{ transform: "rotate(180deg)" }} />
                      </button>
                      <button onClick={() => moveQuestion(i, 1)} disabled={i === questions.length - 1} title="Aşağı taşı" className="p-1.5 rounded-lg hover:bg-gray-100 transition" style={{ opacity: i === questions.length - 1 ? 0.3 : 1 }}>
                        <ChevronDown size={15} color={COLORS.textSecondary} />
                      </button>
                      <button onClick={() => setEditingQ({ question: q })} title="Düzenle" className="p-1.5 rounded-lg hover:bg-gray-100 transition">
                        <Pencil size={15} color={COLORS.textSecondary} />
                      </button>
                      <button onClick={() => setConfirmDelId(q.id)} title="Sil" className="p-1.5 rounded-lg hover:bg-gray-100 transition">
                        <Trash2 size={15} color={COLORS.textSecondary} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-xs px-1" style={{ color: COLORS.textSecondary }}>Önce sınavı oluşturun, ardından soru ekleyebilirsiniz.</p>
      )}

      {editingQ && (
        <QuestionModal
          examId={id}
          question={editingQ.question}
          correct={editingQ.question ? keys[editingQ.question.id] : null}
          position={nextPosition}
          onClose={() => setEditingQ(null)}
          onSaved={async () => { setEditingQ(null); await loadQuestions(id); }}
        />
      )}
    </div>
  );
}

function ExamsTab({ currentUser }) {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(undefined);
  const [confirmId, setConfirmId] = useState(null);

  const loadList = async () => {
    const { data, error: err } = await supabase.from("exams").select("*, exam_questions(count)").order("created_at", { ascending: false });
    if (err) setError("Sınavlar yüklenemedi: " + err.message);
    else { setExams(data || []); setError(""); }
    setLoading(false);
  };

  useEffect(() => { loadList(); }, []);

  const deleteExam = async (examId) => {
    const { error: err } = await supabase.from("exams").delete().eq("id", examId);
    setConfirmId(null);
    if (err) return setError("Sınav silinemedi: " + err.message);
    loadList();
  };

  if (editingId !== undefined) {
    return <ExamEditor examId={editingId} currentUser={currentUser} onBack={() => { setEditingId(undefined); loadList(); }} />;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm" style={{ color: COLORS.textSecondary }}>{exams.length} sınav</p>
        <button onClick={() => setEditingId(null)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background: COLORS.blue }}>
          <Plus size={16} /> Yeni Sınav
        </button>
      </div>

      {error && <p className="text-xs mb-3" style={{ color: COLORS.red }}>{error}</p>}
      {loading && <div className="py-14 text-center text-sm" style={{ color: COLORS.textSecondary }}>Yükleniyor...</div>}
      {!loading && exams.length === 0 && !error && (
        <div className="rounded-2xl py-14 text-center text-sm" style={{ ...glassCard, color: COLORS.textSecondary }}>Henüz sınav oluşturmadınız</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {exams.map((ex) => {
          const qCount = ex.exam_questions?.[0]?.count ?? 0;
          return (
            <div key={ex.id} className="rounded-2xl p-5 card-hover" style={glassCard}>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="min-w-0">
                  <div className="text-base font-semibold truncate" style={{ color: COLORS.text }}>{ex.title}</div>
                  <div className="text-xs" style={{ color: COLORS.textSecondary }}>{ex.subject || "Ders belirtilmedi"}</div>
                </div>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${COLORS.blue}15` }}>
                  <BookOpen size={18} color={COLORS.blue} />
                </div>
              </div>
              <div className="flex gap-2 mb-4">
                <span className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: `${COLORS.indigo}15`, color: COLORS.indigo }}>{qCount} soru</span>
                <span className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: `${COLORS.teal}15`, color: COLORS.teal }}>{ex.duration_minutes} dk</span>
              </div>
              {confirmId === ex.id ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs flex-1" style={{ color: COLORS.red }}>Sınav, soruları ve sonuçları silinecek. Emin misiniz?</span>
                  <button onClick={() => deleteExam(ex.id)} className="text-xs font-semibold px-3 py-1.5 rounded-lg text-white" style={{ background: COLORS.red }}>Sil</button>
                  <button onClick={() => setConfirmId(null)} className="text-xs font-medium px-2 py-1.5 rounded-lg" style={{ color: COLORS.textSecondary }}>Vazgeç</button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <button onClick={() => setEditingId(ex.id)} className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold" style={{ color: COLORS.blue, background: `${COLORS.blue}12` }}>
                    <Pencil size={14} /> Düzenle
                  </button>
                  <button onClick={() => setConfirmId(ex.id)} className="px-3 py-2 rounded-xl hover:bg-gray-100 transition" title="Sil">
                    <Trash2 size={15} color={COLORS.textSecondary} />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
function TCOverviewTab({ pool, myTargets, studentTargets, groupLabel }) {
  const myTargetIds = myTargets.map((t) => t.id);
  const relevant = studentTargets.filter((st) => myTargetIds.includes(st.targetId));
  const pending = relevant.filter((st) => st.submittedAt && st.status === "yapiyor").length;
  const avgProgress = pool.length ? Math.round(pool.reduce((sum, s) => sum + (s.progress || 0), 0) / pool.length) : 0;

  const counts = { yapiyor: 0, yapildi: 0, yapilmadi: 0, eksik_yapildi: 0 };
  relevant.forEach((r) => { counts[r.status] = (counts[r.status] || 0) + 1; });
  const chartData = Object.entries(STATUS_CONFIG).map(([key, cfg]) => ({ name: cfg.label, sayi: counts[key] || 0, color: cfg.color }));

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 stagger-grid">
        <StatCard label={groupLabel} value={pool.length} icon={Users} color={COLORS.green} />
        <StatCard label="Aktif Hedef" value={myTargets.length} icon={Target} color={COLORS.blue} />
        <StatCard label="Doğrulama Bekleyen" value={pending} icon={ClipboardCheck} color={COLORS.orange} />
        <StatCard label="Ortalama İlerleme" value={`%${avgProgress}`} icon={TrendingUp} color={COLORS.indigo} />
      </div>

      <div className="rounded-2xl p-6" style={glassCard}>
        <h3 className="text-sm font-semibold mb-5" style={{ color: COLORS.text }}>Hedef Durumu Dağılımı</h3>
        <div style={{ width: "100%", height: 240 }}>
          <ResponsiveContainer>
            <BarChart data={chartData} barSize={44}>
              <CartesianGrid vertical={false} stroke="rgba(0,0,0,0.06)" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: COLORS.textSecondary }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: COLORS.textSecondary }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
              <Bar dataKey="sayi" radius={[8, 8, 0, 0]}>
                {chartData.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function MyStudentsTab({ pool, classes, studentTargets, myTargets, showClass }) {
  const myTargetIds = myTargets.map((t) => t.id);
  const classNameOf = (id) => classes.find((c) => c.id === id)?.name;

  return (
    <div className="rounded-2xl overflow-hidden" style={glassCard}>
      {pool.length === 0 && <div className="py-14 text-center text-sm" style={{ color: COLORS.textSecondary }}>Henüz size atanmış öğrenci yok</div>}
      {pool.map((s, i) => {
        const activeCount = studentTargets.filter((st) => st.studentId === s.id && myTargetIds.includes(st.targetId)).length;
        return (
          <div key={s.id} className="flex items-center gap-3 px-5 py-3.5" style={{ borderTop: i === 0 ? "none" : "1px solid rgba(0,0,0,0.05)" }}>
            <Avatar name={s.name} color={COLORS.green} />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate" style={{ color: COLORS.text }}>{s.name}</div>
              <div className="text-xs truncate" style={{ color: COLORS.textSecondary }}>
                {showClass ? `${classNameOf(s.classId) || "Sınıfsız"} · ` : ""}{activeCount} aktif hedef
              </div>
            </div>
            <div className="w-24 flex-shrink-0 hidden sm:block">
              <div className="w-full rounded-full h-2" style={{ background: "rgba(0,0,0,0.06)" }}>
                <div className="h-2 rounded-full" style={{ width: `${s.progress}%`, background: COLORS.blue }} />
              </div>
            </div>
            <span className="text-xs font-semibold w-9 text-right flex-shrink-0" style={{ color: COLORS.text }}>%{s.progress}</span>
          </div>
        );
      })}
    </div>
  );
}

function TargetsTab({ myTargets, studentTargets, users, onAddClick }) {
  const [expanded, setExpanded] = useState([]);
  const toggle = (id) => setExpanded((e) => (e.includes(id) ? e.filter((x) => x !== id) : [...e, id]));
  const studentName = (id) => users.find((u) => u.id === id)?.name || "—";

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm" style={{ color: COLORS.textSecondary }}>{myTargets.length} hedef oluşturuldu</p>
        <button onClick={onAddClick} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background: COLORS.blue }}>
          <Plus size={16} /> Yeni Hedef
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {myTargets.length === 0 && (
          <div className="rounded-2xl py-14 text-center text-sm" style={{ ...glassCard, color: COLORS.textSecondary }}>Henüz hedef oluşturmadınız</div>
        )}
        {myTargets.map((t) => {
          const rows = studentTargets.filter((st) => st.targetId === t.id);
          const counts = { yapiyor: 0, yapildi: 0, yapilmadi: 0, eksik_yapildi: 0 };
          rows.forEach((r) => { counts[r.status] = (counts[r.status] || 0) + 1; });
          const isOpen = expanded.includes(t.id);
          return (
            <div key={t.id} className="rounded-2xl overflow-hidden" style={glassCard}>
              <button onClick={() => toggle(t.id)} className="w-full flex items-center gap-4 px-5 py-4 text-left">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${COLORS.blue}15` }}>
                  <Target size={18} color={COLORS.blue} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate" style={{ color: COLORS.text }}>{t.title}</div>
                  <div className="text-xs truncate" style={{ color: COLORS.textSecondary }}>
                    {TYPE_LABEL[t.type]}{sourceLabel(t) ? ` (${sourceLabel(t)})` : ""} · {t.assignmentLabel}{t.dueDate ? ` · Son tarih: ${t.dueDate}` : ""}
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 flex-shrink-0">
                  {Object.entries(STATUS_CONFIG).map(([key, cfg]) => counts[key] > 0 && (
                    <span key={key} className="px-2 py-1 rounded-full text-xs font-medium" style={{ background: `${cfg.color}15`, color: cfg.color }}>
                      {counts[key]}
                    </span>
                  ))}
                </div>
                {isOpen ? <ChevronDown size={18} color={COLORS.textSecondary} /> : <ChevronRight size={18} color={COLORS.textSecondary} />}
              </button>

              {isOpen && (
                <div style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}>
                  {rows.map((r) => (
                    <div key={r.id} className="flex items-center gap-3 px-5 py-3" style={{ borderTop: "1px solid rgba(0,0,0,0.04)" }}>
                      <Avatar name={studentName(r.studentId)} color={COLORS.green} size={30} />
                      <span className="text-sm flex-1 min-w-0 truncate" style={{ color: COLORS.text }}>{studentName(r.studentId)}</span>
                      <StatusBadge status={r.status} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function VerificationTab({ myTargets, studentTargets, users, onVerify }) {
  const myTargetIds = myTargets.map((t) => t.id);
  const pending = studentTargets.filter((st) => myTargetIds.includes(st.targetId) && st.submittedAt && st.status === "yapiyor");
  const targetOf = (id) => myTargets.find((t) => t.id === id);
  const studentOf = (id) => users.find((u) => u.id === id);

  return (
    <div>
      <p className="text-sm mb-5" style={{ color: COLORS.textSecondary }}>{pending.length} kayıt doğrulama bekliyor</p>
      {pending.length === 0 && (
        <div className="rounded-2xl py-14 text-center text-sm" style={{ ...glassCard, color: COLORS.textSecondary }}>Doğrulama bekleyen kayıt yok</div>
      )}
      <div className="flex flex-col gap-3">
        {pending.map((r) => {
          const target = targetOf(r.targetId);
          const student = studentOf(r.studentId);
          return (
            <div key={r.id} className="rounded-2xl p-5" style={glassCard}>
              <div className="flex items-center gap-3 mb-4">
                <Avatar name={student.name} color={COLORS.green} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate" style={{ color: COLORS.text }}>{student.name}</div>
                  <div className="text-xs truncate" style={{ color: COLORS.textSecondary }}>{target.title} · {TYPE_LABEL[target.type]}{sourceLabel(target) ? ` (${sourceLabel(target)})` : ""} · Gönderim: {r.submittedAt}</div>
                </div>
              </div>

              {target.type === "ders" ? (
                <p className="text-sm mb-4 px-1" style={{ color: COLORS.text }}>Öğrenci bu konuyu tamamladığını bildirdi.</p>
              ) : target.type === "test" ? (
                <div className="flex gap-3 mb-4">
                  <div className="flex-1 rounded-xl py-3 text-center" style={{ background: "rgba(0,0,0,0.03)" }}>
                    <div className="text-lg font-semibold" style={{ color: COLORS.text }}>{r.correctCount}</div>
                    <div className="text-xs" style={{ color: COLORS.textSecondary }}>Net</div>
                  </div>
                </div>
              ) : (
                <div className="flex gap-3 mb-4">
                  <div className="flex-1 rounded-xl py-3 text-center" style={{ background: "rgba(0,0,0,0.03)" }}>
                    <div className="text-lg font-semibold" style={{ color: COLORS.text }}>{r.solvedCount}</div>
                    <div className="text-xs" style={{ color: COLORS.textSecondary }}>Çözülen</div>
                  </div>
                  <div className="flex-1 rounded-xl py-3 text-center" style={{ background: `${COLORS.green}0D` }}>
                    <div className="text-lg font-semibold" style={{ color: COLORS.green }}>{r.correctCount}</div>
                    <div className="text-xs" style={{ color: COLORS.textSecondary }}>Doğru</div>
                  </div>
                  <div className="flex-1 rounded-xl py-3 text-center" style={{ background: `${COLORS.red}0D` }}>
                    <div className="text-lg font-semibold" style={{ color: COLORS.red }}>{r.wrongCount}</div>
                    <div className="text-xs" style={{ color: COLORS.textSecondary }}>Yanlış</div>
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <button onClick={() => onVerify(r.id, "yapildi")} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold text-white transition" style={{ background: COLORS.green }}>
                  <CheckCircle2 size={16} /> Yapıldı
                </button>
                <button onClick={() => onVerify(r.id, "yapilmadi")} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold text-white transition" style={{ background: COLORS.red }}>
                  <XCircle size={16} /> Yapılmadı
                </button>
                <button onClick={() => onVerify(r.id, "eksik_yapildi")} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold text-white transition" style={{ background: COLORS.orange }}>
                  <AlertTriangle size={16} /> Eksik Yapıldı
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function renderReadonlyStats(target, record) {
  if (target.type === "ders") {
    return <span className="text-sm" style={{ color: COLORS.textSecondary }}>Konu tamamlandı olarak işaretlendi.</span>;
  }
  if (target.type === "test") {
    return (
      <div>
        <div className="text-lg font-semibold" style={{ color: COLORS.text }}>{record.correctCount}</div>
        <div className="text-xs" style={{ color: COLORS.textSecondary }}>Net</div>
      </div>
    );
  }
  return (
    <>
      <div>
        <div className="text-lg font-semibold" style={{ color: COLORS.text }}>{record.solvedCount}</div>
        <div className="text-xs" style={{ color: COLORS.textSecondary }}>Çözülen</div>
      </div>
      <div>
        <div className="text-lg font-semibold" style={{ color: COLORS.green }}>{record.correctCount}</div>
        <div className="text-xs" style={{ color: COLORS.textSecondary }}>Doğru</div>
      </div>
      <div>
        <div className="text-lg font-semibold" style={{ color: COLORS.red }}>{record.wrongCount}</div>
        <div className="text-xs" style={{ color: COLORS.textSecondary }}>Yanlış</div>
      </div>
    </>
  );
}

function StudentTargetCard({ target, record, onSubmit, readOnly = false }) {
  const [editing, setEditing] = useState(false);
  const [solved, setSolved] = useState(record.solvedCount || "");
  const [correct, setCorrect] = useState(record.correctCount || "");
  const [wrong, setWrong] = useState(record.wrongCount || "");

  const isVerified = record.status !== "yapiyor";
  const hasSubmitted = !!record.submittedAt;

  const startEdit = () => {
    setSolved(record.solvedCount || "");
    setCorrect(record.correctCount || "");
    setWrong(record.wrongCount || "");
    setEditing(true);
  };

  const handleSubmit = () => {
    if (target.type === "ders") onSubmit(record.id, { solvedCount: 1, correctCount: 0, wrongCount: 0 });
    else if (target.type === "test") onSubmit(record.id, { solvedCount: 1, correctCount: Number(correct) || 0, wrongCount: 0 });
    else onSubmit(record.id, { solvedCount: Number(solved) || 0, correctCount: Number(correct) || 0, wrongCount: Number(wrong) || 0 });
    setEditing(false);
  };

  return (
    <div className="rounded-2xl p-5" style={glassCard}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-sm font-semibold truncate" style={{ color: COLORS.text }}>{target.title}</div>
          <div className="text-xs" style={{ color: COLORS.textSecondary }}>
            {TYPE_LABEL[target.type]}{target.dueDate ? ` · Son tarih: ${target.dueDate}` : ""}
          </div>
          {sourceLabel(target) && (
            <div className="text-xs font-medium mt-0.5" style={{ color: COLORS.indigo }}>{sourceLabel(target)}</div>
          )}
        </div>
        {isVerified ? (
          <StatusBadge status={record.status} />
        ) : hasSubmitted ? (
          <span className="px-2.5 py-1 rounded-full text-xs font-medium flex-shrink-0" style={{ background: `${COLORS.indigo}15`, color: COLORS.indigo }}>Onay Bekliyor</span>
        ) : (
          <StatusBadge status="yapiyor" />
        )}
      </div>

      {target.description && <p className="text-xs mt-2" style={{ color: COLORS.textSecondary }}>{target.description}</p>}

      {hasSubmitted && !editing && (
        <div className="mt-3 pt-3 flex items-center gap-5" style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}>
          {renderReadonlyStats(target, record)}
        </div>
      )}

      {editing && (
        <div className="mt-3 pt-3" style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}>
          {target.type === "ders" && <p className="text-sm mb-3" style={{ color: COLORS.text }}>Bu konuyu tamamladığınızı onaylayın.</p>}
          {target.type === "soru" && (
            <div className="grid grid-cols-3 gap-2">
              <FormInput label="Çözülen" type="number" min="0" value={solved} onChange={(e) => setSolved(e.target.value)} />
              <FormInput label="Doğru" type="number" min="0" value={correct} onChange={(e) => setCorrect(e.target.value)} />
              <FormInput label="Yanlış" type="number" min="0" value={wrong} onChange={(e) => setWrong(e.target.value)} />
            </div>
          )}
          {target.type === "test" && (
            <FormInput label="Net" type="number" step="0.25" min="0" value={correct} onChange={(e) => setCorrect(e.target.value)} />
          )}
          <div className="flex gap-2 mt-1">
            <button onClick={handleSubmit} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition" style={{ background: COLORS.blue }}>Kaydet</button>
            <button onClick={() => setEditing(false)} className="px-4 py-2.5 rounded-xl text-sm font-medium" style={{ color: COLORS.textSecondary }}>Vazgeç</button>
          </div>
        </div>
      )}

      {!readOnly && !isVerified && !editing && (
        <div className="mt-3 pt-3 flex items-center justify-between gap-3" style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}>
          {hasSubmitted ? (
            <>
              <span className="text-xs" style={{ color: COLORS.textSecondary }}>Girdiğiniz veri onay bekliyor</span>
              <button onClick={startEdit} className="px-4 py-2 rounded-xl text-xs font-semibold flex-shrink-0" style={{ color: COLORS.blue, background: `${COLORS.blue}12` }}>Düzenle</button>
            </>
          ) : (
            <>
              <span className="text-xs" style={{ color: COLORS.textSecondary }}>Henüz veri girmediniz</span>
              <button onClick={startEdit} className="px-4 py-2 rounded-xl text-xs font-semibold text-white flex-shrink-0" style={{ background: COLORS.blue }}>Veri Gir</button>
            </>
          )}
        </div>
      )}

      {readOnly && !hasSubmitted && !isVerified && (
        <div className="mt-3 pt-3" style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}>
          <span className="text-xs" style={{ color: COLORS.textSecondary }}>Öğrenci henüz veri girmedi.</span>
        </div>
      )}
    </div>
  );
}

function TargetsListTab({ myRecords, targets, onSubmit, readOnly = false }) {
  const priority = (r) => (r.status !== "yapiyor" ? 2 : r.submittedAt ? 1 : 0);
  const sorted = [...myRecords].sort((a, b) => priority(a) - priority(b));
  const targetOf = (id) => targets.find((t) => t.id === id);

  return (
    <div className="flex flex-col gap-3">
      {sorted.length === 0 && (
        <div className="rounded-2xl py-14 text-center text-sm" style={{ ...glassCard, color: COLORS.textSecondary }}>Henüz atanmış bir hedef yok</div>
      )}
      {sorted.map((r) => {
        const target = targetOf(r.targetId);
        if (!target) return null;
        return <StudentTargetCard key={r.id} target={target} record={r} onSubmit={onSubmit} readOnly={readOnly} />;
      })}
    </div>
  );
}

function ProgressOverviewTab({ person, myRecords, targets, classLabel, showLiveTag = false, announcements = [], onOpenAnnouncement }) {
  const pendingInput = myRecords.filter((r) => r.status === "yapiyor" && !r.submittedAt).length;
  const pendingReview = myRecords.filter((r) => r.status === "yapiyor" && r.submittedAt).length;
  const completed = myRecords.filter((r) => r.status !== "yapiyor").length;
  const soruRecords = myRecords.filter((r) => targets.find((t) => t.id === r.targetId)?.type === "soru");
  const totalSolved = soruRecords.reduce((s, r) => s + (r.solvedCount || 0), 0);
  const totalCorrect = soruRecords.reduce((s, r) => s + (r.correctCount || 0), 0);
  const accuracy = totalSolved ? Math.round((totalCorrect / totalSolved) * 100) : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <div className="lg:col-span-2">
        <div className="rounded-2xl p-6 mb-6 flex items-center gap-4" style={glassCard}>
          <Avatar name={person.name} color={COLORS.green} size={52} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <div className="text-lg font-semibold truncate" style={{ color: COLORS.text }}>{person.name}</div>
              {showLiveTag && (
                <span className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0" style={{ background: `${COLORS.green}15`, color: COLORS.green }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: COLORS.green, display: "inline-block" }} />
                  Canlı
                </span>
              )}
            </div>
            <div className="text-sm" style={{ color: COLORS.textSecondary }}>{classLabel ? `${classLabel} · ` : ""}Genel İlerleme %{person.progress}</div>
            <div className="w-full rounded-full h-2 mt-2" style={{ background: "rgba(0,0,0,0.06)" }}>
              <div className="h-2 rounded-full" style={{ width: `${person.progress}%`, background: COLORS.blue }} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <StatCard label="Veri Girişi Bekleyen" value={pendingInput} icon={Target} color={COLORS.orange} />
          <StatCard label="Onay Bekleyen" value={pendingReview} icon={ClipboardCheck} color={COLORS.indigo} />
          <StatCard label="Tamamlanan Hedef" value={completed} icon={CheckCircle2} color={COLORS.green} />
          <StatCard label="Soru Doğruluk Oranı" value={`%${accuracy}`} icon={TrendingUp} color={COLORS.blue} />
        </div>
      </div>

      <div className="lg:col-span-1">
        <AnnouncementsPanel announcements={announcements} onOpen={onOpenAnnouncement} />
      </div>
    </div>
  );
}

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [users, setUsers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [targets, setTargets] = useState([]);
  const [studentTargets, setStudentTargets] = useState([]);
  const [credentials, setCredentials] = useState([]);
  const [bookChecks, setBookChecks] = useState([]);
  const [behaviorEvents, setBehaviorEvents] = useState([]);
  const [studentComments, setStudentComments] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [teacherSubjects, setTeacherSubjects] = useState([]);
  const [scheduleSlots, setScheduleSlots] = useState([]);

  const [adminActive, setAdminActive] = useState("overview");
  const [tcActive, setTcActive] = useState("overview");
  const [cnActive, setCnActive] = useState("overview");
  const [progressActive, setProgressActive] = useState("overview");
  const [showUserModal, setShowUserModal] = useState(null);
  const [showClassModal, setShowClassModal] = useState(false);
  const [showTargetModal, setShowTargetModal] = useState(false);
  const [bulkAddRole, setBulkAddRole] = useState(null);
  const [printData, setPrintData] = useState(null);
  const [printSeatingChart, setPrintSeatingChart] = useState(null);
  const [seatingClassId, setSeatingClassId] = useState(null);
  const [editingClass, setEditingClass] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null);
  const [showCreateAnnouncement, setShowCreateAnnouncement] = useState(false);
  const [viewingAnnouncementId, setViewingAnnouncementId] = useState(null);

  const reload = async () => {
    try {
      const data = await fetchAllData();
      setUsers(data.users);
      setClasses(data.classes);
      setTargets(data.targets);
      setStudentTargets(data.studentTargets);
      setCredentials(data.credentials);
      setBookChecks(data.bookChecks);
      setBehaviorEvents(data.behaviorEvents);
      setStudentComments(data.studentComments);
      setAnnouncements(data.announcements);
      setTeacherSubjects(data.teacherSubjects);
      setScheduleSlots(data.scheduleSlots);
      setLoadError("");
    } catch (err) {
      setLoadError(err.message || "Veri yüklenirken bir hata oluştu.");
    }
    setLoading(false);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session) reload();
      else setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (newSession) {
        setLoading(true);
        reload();
      } else {
        setUsers([]); setClasses([]); setTargets([]); setStudentTargets([]);
        setLoading(false);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) return;
    const channel = supabase
      .channel("student-targets-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "student_targets" }, () => reload())
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [session]);

  useEffect(() => {
    if (!printData) return;
    const t = setTimeout(() => window.print(), 200);
    return () => clearTimeout(t);
  }, [printData]);

  useEffect(() => {
    if (!printSeatingChart) return;
    const t = setTimeout(() => window.print(), 200);
    return () => clearTimeout(t);
  }, [printSeatingChart]);

  const addUser = async (payload) => {
    const { data: seqData, error: seqError } = await supabase.rpc("next_code", { seq_name: SEQ_NAME[payload.role] });
    if (seqError) return { error: "Kod üretilemedi: " + seqError.message };
    const code = `${CODE_PREFIX[payload.role]}${String(seqData).padStart(4, "0")}`;
    const password = String(Math.floor(100000 + Math.random() * 900000));
    const email = `${code.toLowerCase()}@sistem.local`;
  
    const { error } = await supabase.functions.invoke("create-user", {
      body: {
        email, password, full_name: payload.name,
        role: payload.role, classId: payload.classId, coachId: payload.coachId, childId: payload.childId,
      },
      headers: { Authorization: `Bearer ${session.access_token}` },
    });
    if (error) return { error: "Kullanıcı oluşturulamadı: " + error.message };
  
    const { data: newProfile } = await supabase.from("profiles").select("id").eq("email", email).single();
    if (newProfile) {
      const { error: credError } = await supabase.from("credentials").insert({ id: newProfile.id, username_code: code, generated_password: password });
      if (credError) { reload(); return { error: "Hesap oluştu ama kod kaydedilemedi: " + credError.message }; }
      if (payload.role === "teacher" && payload.subjects && payload.subjects.length > 0) {
        const rows = payload.subjects.map((subject) => ({ teacher_id: newProfile.id, subject }));
        await supabase.from("teacher_subjects").insert(rows);
      }
    }
    reload();
    return { code, password };
  };
  const bulkAddUsers = async (role, classId, names) => {
    const { data, error } = await supabase.functions.invoke("bulk-create-users", {
      body: { role, classId, names },
      headers: { Authorization: `Bearer ${session.access_token}` },
    });
    if (error) { alert("Toplu oluşturma başarısız: " + error.message); return null; }
    reload();
    return data.results;
  };

  const deleteUser = async (id) => {
    const { error } = await supabase.functions.invoke("delete-user", {
      body: { userId: id },
      headers: { Authorization: `Bearer ${session.access_token}` },
    });
    if (error) { alert("Kullanıcı silinemedi: " + error.message); return; }
    reload();
  };

  const addClass = async (payload) => {
    const { error } = await supabase.from("classes").insert({
      name: payload.name, grade_level: payload.level, teacher_id: payload.teacherId || null,
    });
    if (error) { alert("Sınıf oluşturulamadı: " + error.message); return; }
    alert("Sınıf başarıyla oluşturuldu.");
    reload();
  };

  const editClass = async (classId, payload) => {
    if (payload.teacherId) {
      await supabase.from("classes").update({ teacher_id: null }).eq("teacher_id", payload.teacherId).neq("id", classId);
    }
    const { error } = await supabase.from("classes").update({
      name: payload.name, grade_level: payload.level, teacher_id: payload.teacherId || null,
    }).eq("id", classId);
    if (error) { alert("Sınıf güncellenemedi: " + error.message); return; }
    alert("Sınıf başarıyla güncellendi.");
    reload();
  };

  const editStudent = async (studentId, payload) => {
    const { error } = await supabase.from("students").update({
      class_id: payload.classId, coach_id: payload.coachId,
    }).eq("id", studentId);
    if (error) { alert("Öğrenci güncellenemedi: " + error.message); return; }
    alert("Öğrenci bilgileri güncellendi.");
    reload();
  };

  const assignCoach = async (studentId, coachId) => {
    const { error } = await supabase.from("students").update({ coach_id: coachId }).eq("id", studentId);
    if (error) { alert("Atama yapılamadı: " + error.message); return; }
    reload();
  };
  const unassignCoach = async (studentId) => {
    const { error } = await supabase.from("students").update({ coach_id: null }).eq("id", studentId);
    if (error) { alert("Kaldırılamadı: " + error.message); return; }
    reload();
  };

  const addTarget = async (payload, creatorId) => {
    const { data: newTarget, error } = await supabase
      .from("targets")
      .insert({
        title: payload.title, type: payload.type, target_value: payload.targetValue,
        description: payload.description, due_date: payload.dueDate || null,
        created_by: creatorId, assignment_label: payload.assignmentLabel,
        publisher: payload.publisher, source_name: payload.sourceName, page_range: payload.pageRange,
      })
      .select()
      .single();
    if (error) { alert("Hedef oluşturulamadı: " + error.message); return; }
    const rows = payload.studentIds.map((sid) => ({ target_id: newTarget.id, student_id: sid, status: "yapiyor" }));
    const { error: rowsError } = await supabase.from("student_targets").insert(rows);
    if (rowsError) { alert("Öğrencilere atanamadı: " + rowsError.message); return; }
    reload();
  };

  const verifyStudentTarget = async (id, status) => {
    const { error } = await supabase.rpc("verify_student_target", { p_record_id: id, p_status: status });
    if (error) { alert("Doğrulanamadı: " + error.message); return; }
    reload();
  };

  const submitStudentData = async (recordId, data) => {
    const { error } = await supabase.rpc("submit_student_data", {
      p_record_id: recordId, p_solved: data.solvedCount, p_correct: data.correctCount, p_wrong: data.wrongCount,
    });
    if (error) { alert("Kaydedilemedi: " + error.message); return; }
    reload();
  };

  const saveSeatingChart = async (classId, chart) => {
    const { error } = await supabase.rpc("update_seating_chart", { p_class_id: classId, p_chart: chart });
    if (error) { alert("Oturma planı kaydedilemedi: " + error.message); return; }
    reload();
  };
  const createAnnouncement = async (payload, creatorId) => {
    const { error } = await supabase.from("announcements").insert({
      title: payload.title, body: payload.body, image_url: payload.imageUrl,
      created_by: creatorId, audience_type: payload.audienceType, class_id: payload.classId,
    });
    if (error) { alert("Duyuru oluşturulamadı: " + error.message); return; }
    alert("Duyuru başarıyla yayınlandı.");
    reload();
  };
  
  const deleteAnnouncement = async (id) => {
    const { error } = await supabase.from("announcements").delete().eq("id", id);
    if (error) { alert("Duyuru silinemedi: " + error.message); return; }
    reload();
  };

  const setScheduleSlot = async (teacherId, day, period, subject, classId) => {
    const { error } = await supabase.from("schedule_slots").upsert(
      { teacher_id: teacherId, day_of_week: day, period, subject, class_id: classId },
      { onConflict: "teacher_id,day_of_week,period" }
    );
    if (error) { alert("Kaydedilemedi: " + error.message); return; }
    reload();
  };
  
  const clearScheduleSlot = async (teacherId, day, period) => {
    const { error } = await supabase.from("schedule_slots").delete().eq("teacher_id", teacherId).eq("day_of_week", day).eq("period", period);
    if (error) { alert("Silinemedi: " + error.message); return; }
    reload();
  };
  
  const clearScheduleDay = async (teacherId, day) => {
    const { error } = await supabase.from("schedule_slots").delete().eq("teacher_id", teacherId).eq("day_of_week", day);
    if (error) { alert("Silinemedi: " + error.message); return; }
    reload();
  };

  const recordBookCheck = async (studentId, classId, checkedBy, status) => {
    const { error } = await supabase.from("book_checks").upsert(
      { student_id: studentId, class_id: classId, checked_by: checkedBy, check_date: todayStr(), status },
      { onConflict: "student_id,check_date" }
    );
    if (error) { alert("Kaydedilemedi: " + error.message); return; }
    reload();
  };

  const addBehaviorEvent = async (studentId, classId, createdBy, type) => {
    const { error } = await supabase.from("behavior_events").insert({
      student_id: studentId, class_id: classId, created_by: createdBy, event_date: todayStr(), type,
    });
    if (error) { alert("Kaydedilemedi: " + error.message); return; }
    reload();
  };

  const addStudentComment = async (studentId, classId, createdBy, text) => {
    const { error } = await supabase.from("student_comments").insert({
      student_id: studentId, class_id: classId, created_by: createdBy, comment_date: todayStr(), comment: text,
    });
    if (error) { alert("Yorum kaydedilemedi: " + error.message); return; }
    reload();
  };

  const onLogout = async () => { await supabase.auth.signOut(); };

  if (!session) return <LoginScreen onLogin={setSession} />;

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: COLORS.bg, fontFamily: FONT }}>
        <GlobalStyles />
        <div className="relative w-14 h-14">
          <img
            src={LOGO_URL}
            alt="Okul Logosu"
            className="w-14 h-14 rounded-2xl object-cover pulse-anim"
            style={{ background: `linear-gradient(135deg, ${COLORS.blue}, ${COLORS.indigo})` }}
          />
          <div
            className="spin-anim absolute -inset-1.5 rounded-3xl"
            style={{ border: `2.5px solid ${COLORS.blue}30`, borderTopColor: COLORS.blue }}
          />
        </div>
        <p className="text-sm" style={{ color: COLORS.textSecondary, animation: "fadeIn 0.4s ease both" }}>Yükleniyor...</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: COLORS.bg, fontFamily: FONT }}>
        <div className="text-center max-w-sm">
          <p className="text-sm mb-3" style={{ color: COLORS.red }}>{loadError}</p>
          <button onClick={reload} className="px-4 py-2 rounded-xl text-sm font-semibold text-white" style={{ background: COLORS.blue }}>Tekrar Dene</button>
        </div>
      </div>
    );
  }

  const currentUser = users.find((u) => u.id === session.user.id);

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: COLORS.bg, fontFamily: FONT }}>
        <p className="text-sm text-center max-w-sm" style={{ color: COLORS.textSecondary }}>
          Hesabınız bulundu ama bir profil kaydı yok. Sistem yöneticinizle iletişime geçin.
        </p>
      </div>
    );
  }

  const teachers = users.filter((u) => u.role === "teacher");
  const coaches = users.filter((u) => u.role === "coach");
  const students = users.filter((u) => u.role === "student");

  if (currentUser.role === "admin") {
    const ADMIN_TITLES = { overview: "Genel Bakış", users: "Kullanıcılar", classes: "Sınıflar", coaching: "Koç Atamaları", credentials: "Şifreler", schedule: "Ders Programı" };    const seatingClass = seatingClassId ? classes.find((c) => c.id === seatingClassId) : null;
    const seatingClassStudents = seatingClass ? students.filter((s) => s.classId === seatingClass.id) : [];
    return (
      <>
        <div className="app-shell">
          <Shell navItems={ADMIN_NAV} active={adminActive} setActive={setAdminActive} user={{ name: currentUser.name, roleLabel: "Müdür" }} onLogout={onLogout} title={ADMIN_TITLES[adminActive]}>
            {adminActive === "overview" && (
              <>
                <AdminOverviewTab users={users} classes={classes} />
                <div className="mt-6">
                  <AnnouncementsManageSection
                    title="Okul Duyuruları"
                    announcements={announcements.filter((a) => a.audienceType === "school")}
                    onCreateClick={() => setShowCreateAnnouncement(true)}
                    onOpen={setViewingAnnouncementId}
                    onDelete={deleteAnnouncement}
                    canDelete={() => true}
                  />
                </div>
              </>
            )}
            {adminActive === "users" && <UsersTab users={users} classes={classes} onBulkAddClick={setBulkAddRole} onSingleAddClick={setShowUserModal} onDelete={deleteUser} onEditStudentClick={setEditingStudent} />}
            {adminActive === "classes" && <ClassesTab classes={classes} users={users} onAddClick={() => setShowClassModal(true)} onSeatingClick={setSeatingClassId} onEditClick={setEditingClass} />}
            {adminActive === "coaching" && <CoachingTab users={users} classes={classes} onAssign={assignCoach} onUnassign={unassignCoach} />}
            {adminActive === "credentials" && <CredentialsTab users={users} classes={classes} credentials={credentials} onPrint={setPrintData} />}
                        {adminActive === "schedule" && (
              <ScheduleTab
                teachers={[...teachers, ...coaches]}
                teacherSubjects={teacherSubjects}
                scheduleSlots={scheduleSlots}
                classes={classes}
                users={users}
                onSetSlot={setScheduleSlot}
                onClearSlot={clearScheduleSlot}
                onClearDay={clearScheduleDay}
              />
            )}
          </Shell>
        </div>
        {showUserModal && <AddUserModal onClose={() => setShowUserModal(null)} onSubmit={addUser} classes={classes} coaches={coaches} students={students} defaultRole={showUserModal} />}        {showClassModal && <AddClassModal onClose={() => setShowClassModal(false)} onSave={addClass} teachers={teachers} />}
        {bulkAddRole && <BulkAddModal role={bulkAddRole} classes={classes} onClose={() => setBulkAddRole(null)} onSubmit={bulkAddUsers} />}
        {editingClass && <EditClassModal cls={editingClass} onClose={() => setEditingClass(null)} onSave={editClass} teachers={teachers} />}
        {editingStudent && <EditStudentModal student={editingStudent} onClose={() => setEditingStudent(null)} onSave={editStudent} classes={classes} coaches={coaches} />}
        {seatingClass && (
          <ModalShell title={`${seatingClass.name} — Oturma Planı`} onClose={() => setSeatingClassId(null)} width={1020}>
            <SeatingChartBoard cls={seatingClass} students={seatingClassStudents} initialChart={seatingClass.seatingChart} onSave={saveSeatingChart} onPrint={setPrintSeatingChart} />
          </ModalShell>
        )}
        <PrintableCredentials data={printData} />
        <PrintableSeatingChart data={printSeatingChart} />
        {showCreateAnnouncement && (
          <CreateAnnouncementModal
            audienceLabel="Bu duyuru tüm öğrenci ve velilere gönderilecek."
            onClose={() => setShowCreateAnnouncement(false)}
            onSave={(payload) => createAnnouncement({ ...payload, audienceType: "school", classId: null }, currentUser.id)}
          />
        )}
        {viewingAnnouncementId && (
          <AnnouncementViewerModal announcements={announcements} initialId={viewingAnnouncementId} onClose={() => setViewingAnnouncementId(null)} />
        )}
      </>
    );
  }
  if (currentUser.role === "counselor") {
    const CN_TITLES = { overview: "Genel Bakış", classes: "Sınıflar", students: "Öğrenciler", coaching: "Koçlar" };
    return (
      <Shell
        navItems={CN_NAV}
        active={cnActive}
        setActive={setCnActive}
        user={{ name: currentUser.name, roleLabel: "Okul Rehber Öğretmeni" }}
        onLogout={onLogout}
        title={CN_TITLES[cnActive]}
        subtitle="Salt okunur gözlemci görünümü"
      >
        {cnActive === "overview" && <AdminOverviewTab users={users} classes={classes} />}
        {cnActive === "classes" && <ClassesTab classes={classes} users={users} readOnly />}
        {cnActive === "students" && <AllStudentsTab users={users} classes={classes} studentTargets={studentTargets} />}
        {cnActive === "coaching" && <CoachingTab users={users} classes={classes} readOnly />}
      </Shell>
    );
  }

  if (currentUser.role === "student") {
    const myClass = classes.find((c) => c.id === currentUser.classId);
    const myRecords = studentTargets.filter((st) => st.studentId === currentUser.id);
    const PROGRESS_TITLES = { overview: "Genel Bakış", targets: "Hedeflerim", summary: "Sınıf Özetim" };
    return (
      <>
        <Shell
          navItems={PROGRESS_NAV}
          active={progressActive}
          setActive={setProgressActive}
          user={{ name: currentUser.name, roleLabel: "Öğrenci" }}
          onLogout={onLogout}
          title={PROGRESS_TITLES[progressActive]}
        >
          {progressActive === "overview" && <ProgressOverviewTab person={currentUser} myRecords={myRecords} targets={targets} classLabel={myClass?.name} announcements={announcements} onOpenAnnouncement={setViewingAnnouncementId} />}
          {progressActive === "targets" && <TargetsListTab myRecords={myRecords} targets={targets} onSubmit={submitStudentData} />}
          {progressActive === "summary" && <ClassSummaryView students={[currentUser]} bookChecks={bookChecks} behaviorEvents={behaviorEvents} comments={studentComments} />}
        </Shell>
        {viewingAnnouncementId && (
          <AnnouncementViewerModal announcements={announcements} initialId={viewingAnnouncementId} onClose={() => setViewingAnnouncementId(null)} />
        )}
      </>
    );
  }  
  if (currentUser.role === "parent") {
    const child = users.find((u) => u.id === currentUser.childId);
    const childClass = child ? classes.find((c) => c.id === child.classId) : null;
    const myRecords = child ? studentTargets.filter((st) => st.studentId === child.id) : [];
    const PROGRESS_TITLES = { overview: "Genel Bakış", targets: "Hedefler", summary: "Sınıf Özeti" };
    return (
      <>
        <Shell
          navItems={PROGRESS_NAV}
          active={progressActive}
          setActive={setProgressActive}
          user={{ name: currentUser.name, roleLabel: "Veli" }}
          onLogout={onLogout}
          title={PROGRESS_TITLES[progressActive]}
        >
          {!child && <p className="text-sm" style={{ color: COLORS.textSecondary }}>Bağlı öğrenci bulunamadı.</p>}
          {child && progressActive === "overview" && <ProgressOverviewTab person={child} myRecords={myRecords} targets={targets} classLabel={childClass?.name} showLiveTag announcements={announcements} onOpenAnnouncement={setViewingAnnouncementId} />}
          {child && progressActive === "targets" && <TargetsListTab myRecords={myRecords} targets={targets} readOnly />}
          {child && progressActive === "summary" && <ClassSummaryView students={[child]} bookChecks={bookChecks} behaviorEvents={behaviorEvents} comments={studentComments} />}
        </Shell>
        {viewingAnnouncementId && (
          <AnnouncementViewerModal announcements={announcements} initialId={viewingAnnouncementId} onClose={() => setViewingAnnouncementId(null)} />
        )}
      </>
    );
  }
  const isTeacher = currentUser.role === "teacher";
  const myClass = isTeacher ? classes.find((c) => c.id === currentUser.classId) : null;
  const pool = isTeacher ? students.filter((s) => s.classId === currentUser.classId) : students.filter((s) => s.coachId === currentUser.id);
  const myTargets = targets.filter((t) => t.createdBy === currentUser.id);
  const poolLabel = isTeacher ? (myClass ? myClass.name : "Sınıfım") : "Öğrencilerim";
  const myClasses = isTeacher ? (myClass ? [myClass] : []) : classes.filter((c) => pool.some((s) => s.classId === c.id));
    const navItems = isTeacher
    ? [...TC_NAV, { id: "seating", label: "Oturma Planı", icon: LayoutGrid }]
    : TC_NAV;
  const TC_TITLES = { overview: "Genel Bakış", students: "Öğrencilerim", myclasses: "Sınıflarım", exams: "Sınavlar", targets: "Hedefler", verify: "Doğrulama", seating: "Oturma Planı"};

  return (
    <>
      <div className="app-shell">
        <Shell
          navItems={navItems}
          active={tcActive}
          setActive={setTcActive}
          user={{ name: currentUser.name, roleLabel: ROLE_CONFIG[currentUser.role].label }}
          onLogout={onLogout}
          title={TC_TITLES[tcActive]}
        >
          {tcActive === "overview" && (
            <>
              <TCOverviewTab pool={pool} myTargets={myTargets} studentTargets={studentTargets} groupLabel={isTeacher ? `Sınıfım (${myClass ? myClass.name : "-"})` : "Öğrencilerim"} />
              {isTeacher && (
                <div className="mt-6">
                  <AnnouncementsManageSection
                    title="Sınıf Duyurularım"
                    announcements={announcements}
                    onCreateClick={() => setShowCreateAnnouncement(true)}
                    onOpen={setViewingAnnouncementId}
                    onDelete={deleteAnnouncement}
                    canDelete={(a) => a.createdBy === currentUser.id}
                  />
                </div>
              )}
            </>
          )}
          {tcActive === "students" && <MyStudentsTab pool={pool} classes={classes} studentTargets={studentTargets} myTargets={myTargets} showClass={!isTeacher} />}
          {tcActive === "myclasses" && (
            <MyClassesTab
              myClasses={myClasses}
              students={students}
              bookChecks={bookChecks}
              behaviorEvents={behaviorEvents}
              comments={studentComments}
              onCheck={(studentId, classId, status) => recordBookCheck(studentId, classId, currentUser.id, status)}
              onBehavior={(studentId, classId, type) => addBehaviorEvent(studentId, classId, currentUser.id, type)}
              onComment={(studentId, classId, text) => addStudentComment(studentId, classId, currentUser.id, text)}
            />
          )}
          {tcActive === "targets" && <TargetsTab myTargets={myTargets} studentTargets={studentTargets} users={users} onAddClick={() => setShowTargetModal(true)} />}
          {tcActive === "verify" && <VerificationTab myTargets={myTargets} studentTargets={studentTargets} users={users} onVerify={verifyStudentTarget} />}
          {tcActive === "exams" && <ExamsTab currentUser={currentUser} />}
          {tcActive === "seating" && isTeacher && (
            myClass ? (
              <SeatingChartBoard cls={myClass} students={pool} initialChart={myClass.seatingChart} onSave={saveSeatingChart} onPrint={setPrintSeatingChart} />
            ) : (
              <p className="text-sm" style={{ color: COLORS.textSecondary }}>Henüz bir sınıfa atanmadınız.</p>
            )
          )}
        </Shell>
      </div>
      {showTargetModal && <AssignTargetModal onClose={() => setShowTargetModal(false)} onSave={(payload) => addTarget(payload, currentUser.id)} pool={pool} poolLabel={poolLabel} />}
      <PrintableSeatingChart data={printSeatingChart} />
      {isTeacher && showCreateAnnouncement && (
        <CreateAnnouncementModal
          audienceLabel={`Bu duyuru ${myClass ? myClass.name : "sınıfınız"} öğrenci ve velilerine gönderilecek.`}
          onClose={() => setShowCreateAnnouncement(false)}
          onSave={(payload) => createAnnouncement({ ...payload, audienceType: "class", classId: myClass?.id || null }, currentUser.id)}
        />
      )}
      {viewingAnnouncementId && (
        <AnnouncementViewerModal announcements={announcements} initialId={viewingAnnouncementId} onClose={() => setViewingAnnouncementId(null)} />
      )}
    </>
  );
}
