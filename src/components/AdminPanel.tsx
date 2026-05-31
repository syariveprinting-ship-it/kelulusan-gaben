import React, { useState } from "react";
import { Student, SubjectGrade } from "../types";
import { getAutomaticTeacherNote } from "../studentsData";
import { loginAdminAnonymously, logoutAdmin } from "../firebase";
import { 
  X, 
  Lock, 
  Plus, 
  Edit2, 
  Trash2, 
  Search, 
  Save, 
  RotateCcw, 
  FileSpreadsheet, 
  UserPlus, 
  AlertTriangle,
  CheckCircle,
  FileText,
  User,
  GraduationCap
} from "lucide-react";

interface AdminPanelProps {
  students: Student[];
  onSaveStudents: (updated: Student[]) => void;
  onClose: () => void;
  defaultDb: Student[];
}

const DEFAULT_SUBJECTS = [
  { subject: "Pendidikan Agama dan Budi Pekerti", code: "PAIBP" },
  { subject: "Pendidikan Pancasila", code: "PP" },
  { subject: "Bahasa Indonesia", code: "IND" },
  { subject: "Matematika", code: "MAT" },
  { subject: "Ilmu Pengetahuan Alam dan Sosial (IPAS)", code: "IPAS" },
  { subject: "Seni dan Budaya (Seni Musik/Seni Rupa)", code: "SB" },
  { subject: "Pendidikan Jasmani, Olahraga, dan Kesehatan", code: "PJOK" },
  { subject: "Bahasa Jawa (Mulok)", code: "JW" },
  { subject: "Bahasa Inggris", code: "ENG" }
];

export default function AdminPanel({ students, onSaveStudents, onClose, defaultDb }: AdminPanelProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  
  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState("");
  
  // Editing state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentStudent, setCurrentStudent] = useState<Partial<Student> | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<"personal" | "grades" | "extras">("personal");
  
  // Custom Achievements & Grades editing list
  const [gradesInput, setGradesInput] = useState<Record<string, number>>({});
  const [achievementsText, setAchievementsText] = useState("");

  // Input mode selection: "rerata" (directly enter average score) or "detil" (individual subject scores)
  const [gradeInputMode, setGradeInputMode] = useState<"rerata" | "detil">("rerata");
  const [averageGradeState, setAverageGradeState] = useState<number>(85);

  // Bulk Import state
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [importText, setImportText] = useState("");
  const [importStatus, setImportStatus] = useState<{ success?: string; error?: string } | null>(null);

  // Deletion, Reset & Toast state
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const showToast = (message: string) => {
    setSuccessToast(message);
    setTimeout(() => {
      setSuccessToast(null);
    }, 4500);
  };

  const getCurrentAverageScore = (): number => {
    if (gradeInputMode === "rerata") {
      return Number(averageGradeState) || 0;
    } else {
      const keys = Object.keys(gradesInput);
      if (keys.length === 0) return 0;
      const sum = keys.reduce((acc, code) => acc + (Number(gradesInput[code]) || 0), 0);
      return parseFloat((sum / keys.length).toFixed(2));
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "admin123" || password === "gajahbendo2026") {
      try {
        await loginAdminAnonymously();
        setIsAuthenticated(true);
        setLoginError("");
      } catch (err) {
        setLoginError("Gagal autentikasi kesiswaan cloud. Silakan coba kembali.");
      }
    } else {
      setLoginError("Password salah! Silakan coba lagi.");
    }
  };

  const handleClose = async () => {
    try {
      await logoutAdmin();
    } catch (e) {
      console.error(e);
    }
    onClose();
  };

  const handleOpenAddForm = () => {
    // Scaffold new student skeleton
    const newGrades: Record<string, number> = {};
    DEFAULT_SUBJECTS.forEach(sub => {
      newGrades[sub.code] = 85; // set default to a sensible passing grade 85
    });
    
    setCurrentStudent({
      nisn: "",
      nis: "",
      name: "",
      birthPlaceDate: "",
      status: "LULUS",
      serialNumber: "",
      notes: "Siswa menunjukkan perkembangan yang baik secara akademis dan kepribadian.",
      achievements: []
    });
    
    setGradeInputMode("rerata");
    setAverageGradeState(85);
    setGradesInput(newGrades);
    setAchievementsText("");
    setFormErrors({});
    setActiveTab("personal");
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (student: Student) => {
    const editGrades: Record<string, number> = {};
    // Load existing grades
    DEFAULT_SUBJECTS.forEach(sub => {
      const match = student.grades.find(g => g.code === sub.code);
      editGrades[sub.code] = match ? match.score : 0;
    });

    // Check if user has all identical grades or is clean
    const allSame = student.grades.length > 0 && student.grades.every(g => g.score === student.grades[0].score);
    const calculatedAvg = student.grades.length > 0
      ? Math.round(student.grades.reduce((sum, g) => sum + g.score, 0) / student.grades.length)
      : 85;

    setGradeInputMode(allSame ? "rerata" : "detil");
    setAverageGradeState(calculatedAvg);
    setCurrentStudent(student);
    setGradesInput(editGrades);
    setAchievementsText(student.achievements ? student.achievements.join("\n") : "");
    setFormErrors({});
    setActiveTab("personal");
    setIsFormOpen(true);
  };

  const handleDeleteStudent = (nisn: string) => {
    const student = students.find(s => s.nisn === nisn);
    if (student) {
      setStudentToDelete(student);
    }
  };

  const confirmDeleteStudent = () => {
    if (studentToDelete) {
      const updated = students.filter(s => s.nisn !== studentToDelete.nisn);
      onSaveStudents(updated);
      showToast(`Data siswa ${studentToDelete.name} sukses dihapus.`);
      setStudentToDelete(null);
    }
  };

  const handleResetToDefault = () => {
    setIsResetConfirmOpen(true);
  };

  const confirmResetToDefault = () => {
    onSaveStudents(defaultDb);
    showToast("Basis data berhasil di-reset ke data bawaan simulasi.");
    setIsResetConfirmOpen(false);
  };

  const handleAutoGenerate = () => {
    const listNama = [
      "BUDI UTOMO", "SITI AISYAH", "EKO SUPRIYANTO", "MEGAWATI SARI", "GALIH PRASETYA", 
      "RIZKY AMALIA", "AHMAD MAULANA", "HENDRA LESMANA", "FITRI LESTARI", "DWIKI PRASETYO",
      "ANISA RAMADHANI", "RIAN CAHYONO", "SUTRISNO", "LILIS INDAH", "ZULFIKAR"
    ];
    const listTempat = ["Pasuruan", "Beji", "Gempol", "Bangil", "Pandaan", "Sukorejo"];
    const listTanggal = ["14 April 2014", "23 Mei 2014", "11 Juni 2014", "05 Juli 2014", "28 Agustus 2014", "19 September 2014"];
    const listCatatan = [
      "Aktif berdiskusi di kelas, menunjukkan sopan santun, serta memiliki disiplin yang sangat tinggi.",
      "Siswa teladan, berpikiran kreatif, teratur, dan suka membantu rekan sekelasnya memecahkan soal.",
      "Menunjukkan konsistensi hasil belajar yang sangat baik, patuh pada guru, dan selalu giat membaca.",
      "Memiliki minat yang besar di bidang olahraga, aktif pramuka, dan berbakat dalam pelajaran IPA sains.",
      "Siswa yang rajin mengumpulkan penugasan tepat waktu, mandiri, dan berpartisipasi aktif dalam ekstrakurikuler."
    ];
    
    // Choose 5 random names to generate
    const shuffledNames = [...listNama].sort(() => 0.5 - Math.random());
    const generated: Student[] = [];
    
    for (let i = 0; i < 5; i++) {
      const randomNisn = "014" + Math.floor(1000000 + Math.random() * 9000000).toString();
      const randomNis = `${Math.floor(1100 + Math.random() * 100)}/2020`;
      const name = shuffledNames[i] + " " + ["PRATAMA", "WIBOWO", "SAPUTRA", "WIJAYA", "SARI"][Math.floor(Math.random() * 5)];
      const birthPlace = listTempat[Math.floor(Math.random() * listTempat.length)];
      const birthDate = listTanggal[Math.floor(Math.random() * listTanggal.length)];
      const notes = listCatatan[Math.floor(Math.random() * listCatatan.length)];
      const status = Math.random() > 0.35 ? "LULUS DENGAN PUJIAN" : "LULUS";

      // Random high grades for SDN Gajahbendo Class VI candidates
      const grades: SubjectGrade[] = DEFAULT_SUBJECTS.map(sub => {
        const baseScore = sub.code === "MAT" 
          ? Math.floor(78 + Math.random() * 19) 
          : Math.floor(82 + Math.random() * 16);
        return {
          subject: sub.subject,
          code: sub.code,
          score: baseScore
        };
      });

      generated.push({
        nisn: randomNisn,
        nis: randomNis,
        name: name.toUpperCase(),
        birthPlaceDate: `${birthPlace}, ${birthDate}`,
        status,
        serialNumber: `421.2/0${Math.floor(Math.random() * 90) + 11}/SD-43/2026`,
        grades,
        notes,
        achievements: Math.random() > 0.5 
          ? [Math.random() > 0.5 ? "Peringkat Kelas" : "Juara Lomba Seni Tingkat Kecamatan"] 
          : []
      });
    }

    const updated = [...generated, ...students];
    onSaveStudents(updated);
    showToast(`Berhasil otomatis membuat 5 siswa baru SDN Gajahbendo dengan profil acak!`);
  };

  const handleImportText = () => {
    if (!importText.trim()) {
      setImportStatus({ error: "Kolom input masih kosong. Silakan masukkan data siswa terlebih dahulu." });
      return;
    }

    const lines = importText.split("\n").map(l => l.trim()).filter(l => l.length > 0);
    const parsedStudents: Student[] = [];
    let errorCount = 0;
    let duplicateCount = 0;
    let successCount = 0;

    lines.forEach((line, idx) => {
      // Split by tab (Excel/Google Sheets copy paste standard), semicolon, or comma
      let parts: string[] = [];
      if (line.includes("\t")) {
        parts = line.split("\t");
      } else if (line.includes(";")) {
        parts = line.split(";");
      } else {
        parts = line.split(",");
      }

      parts = parts.map(p => p.trim());

      // If header identifier row, skip it
      if (idx === 0 && (parts[0].toLowerCase().includes("nisn") || parts[2]?.toLowerCase().includes("nama"))) {
        return;
      }

      // We need at least 4 columns for fully functional profiles
      if (parts.length < 4) {
        errorCount++;
        return;
      }

      const nisn = parts[0];
      const nis = parts[1];
      const name = parts[2].toUpperCase();
      const birthPlaceDate = parts[3];
      
      const statusInput = parts[4] || "LULUS";
      let status: Student["status"] = "LULUS";
      if (statusInput.toUpperCase().includes("PUJIAN")) {
        status = "LULUS DENGAN PUJIAN";
      } else if (statusInput.toUpperCase().includes("TIDAK")) {
        status = "TIDAK LULUS";
      }

      // Check unique NISN inside currently parsing block too
      if (students.some(s => s.nisn === nisn) || parsedStudents.some(s => s.nisn === nisn)) {
        duplicateCount++;
        return;
      }

      let grades: SubjectGrade[] = [];
      let notes = "";

      // Detect automatically whether columns are Format Rerata (<= 8 parts) or Format Detil (9 mapel, > 8 parts)
      if (parts.length <= 8) {
        // Format Rerata
        // Parts indices: 0: nisn, 1: nis, 2: name, 3: birthPlaceDate, 4: status, 5: average, 6: notes
        const parsedAvg = Number(parts[5]) || 85;
        grades = DEFAULT_SUBJECTS.map(sub => ({
          subject: sub.subject,
          code: sub.code,
          score: Math.min(100, Math.max(0, parsedAvg))
        }));
        notes = parts[6] || "Siswa menunjukkan perkembangan karakter yang terpuji dan akademis yang stabil.";
      } else {
        // Format Detil (9 Mapel terpisah)
        // If user provided scores from column index 5 to 13
        const parsedScores = [
          Number(parts[5]) || Math.floor(80 + Math.random() * 15), // PAIBP
          Number(parts[6]) || Math.floor(81 + Math.random() * 15), // PP
          Number(parts[7]) || Math.floor(82 + Math.random() * 15), // IND
          Number(parts[8]) || Math.floor(78 + Math.random() * 20), // MAT
          Number(parts[9]) || Math.floor(80 + Math.random() * 16), // IPAS
          Number(parts[10]) || Math.floor(83 + Math.random() * 13), // SB
          Number(parts[11]) || Math.floor(82 + Math.random() * 14), // PJOK
          Number(parts[12]) || Math.floor(80 + Math.random() * 15), // JW
          Number(parts[13]) || Math.floor(80 + Math.random() * 16)  // ENG
        ];

        grades = DEFAULT_SUBJECTS.map((sub, sIdx) => ({
          subject: sub.subject,
          code: sub.code,
          score: Math.min(100, Math.max(0, parsedScores[sIdx]))
        }));

        // Notes are in column 14
        notes = parts[14] || "Siswa menunjukkan perkembangan karakter yang terpuji dan akademis yang stabil.";
      }

      parsedStudents.push({
        nisn,
        nis,
        name,
        birthPlaceDate,
        status,
        serialNumber: `421.2/0${Math.floor(Math.random() * 90) + 10}/SD-43/2026`,
        grades,
        notes,
        achievements: []
      });
      successCount++;
    });

    if (successCount === 0) {
      if (duplicateCount > 0) {
        setImportStatus({ error: `Semua ${duplicateCount} baris data yang dimasukkan diabaikan karena NISN sudah ada dalam sistem.` });
      } else {
        setImportStatus({ error: `Format tidak dikenal atau jumlah kolom kurang dari 6. Silakan gunakan format yang sesuai.` });
      }
      return;
    }

    const updatedList = [...parsedStudents, ...students];
    onSaveStudents(updatedList);
    
    setImportStatus({ 
      success: `Berhasil mengimpor ${successCount} rekor siswa! ${duplicateCount > 0 ? `(${duplicateCount} NISN dilewati karena duplikat)` : ""}` 
    });
    setImportText("");
    
    setTimeout(() => {
      setIsImportOpen(false);
      setImportStatus(null);
    }, 3000);
  };

  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentStudent) return;

    const errors: Record<string, string> = {};
    
    // Validations
    if (!currentStudent.nisn || !/^\d{10}$/.test(currentStudent.nisn)) {
      errors.nisn = "NISN wajib diisi tepat 10 digit angka.";
    }
    if (!currentStudent.nis) {
      errors.nis = "NIS wajib diisi.";
    }
    if (!currentStudent.name) {
      errors.name = "Nama Lengkap wajib diisi.";
    }
    if (!currentStudent.birthPlaceDate) {
      errors.birthPlaceDate = "Tempat, Tanggal Lahir wajib diisi.";
    }
    if (!currentStudent.serialNumber) {
      errors.serialNumber = "Nomor Surat Kelulusan (SKL) wajib diisi.";
    }

    // Check unique NISN if we are ADDING a new student
    const isAddingNew = !students.some(s => s.nisn === currentStudent.nisn);
    if (isAddingNew && currentStudent.nisn && students.some(s => s.nisn === currentStudent.nisn)) {
      errors.nisn = "Siswa dengan Nomor NISN ini sudah terdaftar.";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setActiveTab("personal"); // switch to personal data to rectify errors
      return;
    }

    // Prepare grades
    const finalGrades: SubjectGrade[] = DEFAULT_SUBJECTS.map(sub => ({
      subject: sub.subject,
      code: sub.code,
      score: gradeInputMode === "rerata" ? Number(averageGradeState) || 0 : (Number(gradesInput[sub.code]) || 0)
    }));

    // Prepare achievements list
    const finalAchievements = achievementsText
      .split("\n")
      .map(item => item.trim())
      .filter(item => item.length > 0);

    const updatedStudentRecord: Student = {
      nisn: currentStudent.nisn!,
      nis: currentStudent.nis!,
      name: currentStudent.name!.toUpperCase(), // Standardize name to upper case
      birthPlaceDate: currentStudent.birthPlaceDate!,
      status: (currentStudent.status || "LULUS") as Student["status"],
      serialNumber: currentStudent.serialNumber!,
      grades: finalGrades,
      notes: currentStudent.notes || "",
      achievements: finalAchievements
    };

    let updatedList: Student[];
    const index = students.findIndex(s => s.nisn === currentStudent.nisn);
    if (index >= 0) {
      // Modify existing
      updatedList = [...students];
      updatedList[index] = updatedStudentRecord;
    } else {
      // Create new
      updatedList = [updatedStudentRecord, ...students];
    }

    onSaveStudents(updatedList);
    setIsFormOpen(false);
    setCurrentStudent(null);
  };

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.nisn.includes(searchTerm) ||
    student.nis.includes(searchTerm)
  );

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fade-in">
        <div className="bg-white rounded-3xl w-full max-w-md p-8 border border-slate-100 shadow-2xl relative">
          <button 
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-4 text-[#1e3a8a] border border-blue-100/50">
              <Lock className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-extrabold text-[#1e3a8a] mb-2">Login Staf & Administrasi</h3>
            <p className="text-sm text-slate-500 mb-6">
              Gunakan panel ini untuk mengelola (Tambah, Edit, Hapus) basis data kelulusan SDN Gajahbendo Beji.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#1e3a8a] uppercase tracking-wider mb-2">
                Kata Sandi Portal
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan kata sandi admin"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 outline-none transition-all text-center text-base font-semibold"
              />
            </div>

            {loginError && (
              <div className="flex items-center gap-2 p-3.5 bg-rose-50 border border-rose-150 text-rose-700 rounded-xl text-xs sm:text-sm animate-shake">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-[#1e40af] hover:bg-[#1d4ed8] text-white rounded-xl font-bold text-base transition-all active:scale-[0.98] shadow-md shadow-blue-500/10 cursor-pointer"
            >
              Masuk ke Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-slate-50 rounded-[32px] w-full max-w-5xl h-full max-h-[95vh] border border-slate-200/50 shadow-2xl flex flex-col overflow-hidden">
        
        {/* Dashboard Header */}
        <div className="bg-white px-5 sm:px-8 py-5 border-b border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-500/20">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-[#1e3a8a] flex items-center gap-2">
                Basis Data Administrasi Kesiswaan
              </h2>
              <p className="text-xs text-slate-500">
                Kelola file kelulusan, input nilai raport, dan prestasi siswa kelas VI.
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleResetToDefault}
              title="Reset Database"
              className="px-3.5 py-2.5 text-xs font-semibold text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Database</span>
            </button>
            <button
              onClick={handleClose}
              className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search, Filter & Actions Toolbar */}
        <div className="bg-white border-b border-slate-100 px-5 sm:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-450 w-4 h-4" />
            <input
              type="text"
              placeholder="Cari nama, NISN, atau NIS..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 focus:bg-white outline-none text-sm transition-all focus:ring-4 focus:ring-blue-100/55"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            <button
              onClick={() => setIsImportOpen(true)}
              className="w-full md:w-auto px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-250 rounded-xl text-sm font-bold flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Import Excel/CSV</span>
            </button>

            <button
              onClick={handleAutoGenerate}
              className="w-full md:w-auto px-4 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-250 rounded-xl text-sm font-bold flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
            >
              <UserPlus className="w-4 h-4" />
              <span>Buat 5 Siswa Otomatis</span>
            </button>

            <button
              onClick={handleOpenAddForm}
              className="w-full md:w-auto px-5 py-2.5 bg-[#1e40af] hover:bg-[#1d4ed8] text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-blue-500/10 active:scale-[0.98] transition-all"
            >
              <Plus className="w-4 h-4 text-white" />
              <span>Tambah Data Siswa</span>
            </button>
          </div>
        </div>

        {/* Dashboard Content List */}
        <div className="flex-grow p-4 sm:p-8 overflow-y-auto">
          {filteredStudents.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center flex flex-col items-center">
              <FileSpreadsheet className="w-12 h-12 text-slate-300 mb-3" />
              <h4 className="text-base font-bold text-slate-700">Data Siswa Tidak Ditemukan</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm">
                Tidak ada data kesiswaan yang cocok dengan kata kunci "{searchTerm}". Pastikan ejaan benar atau rekayasa data baru.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-150 shadow-xs overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-slate-50/85 border-b border-slate-200 text-xs font-bold text-[#1e3a8a] uppercase tracking-wider">
                    <th className="px-6 py-4">Siswa</th>
                    <th className="px-6 py-4">NISN / NIS</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-center">Rata-Rata Nilai</th>
                    <th className="px-6 py-4 text-right">Kelola</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {filteredStudents.map((student) => {
                    // Calculate Average for List
                    const avg = student.grades.length > 0 
                      ? parseFloat((student.grades.reduce((sum, g) => sum + g.score, 0) / student.grades.length).toFixed(2))
                      : 0;
                    
                    return (
                      <tr key={student.nisn} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4.5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-700 font-bold flex items-center justify-center uppercase border border-blue-100/40 shrink-0">
                              {student.name.substring(0, 2)}
                            </div>
                            <div>
                              <p className="font-extrabold text-[#1e3a8a] uppercase">{student.name}</p>
                              <p className="text-xs text-slate-500 mt-0.5">{student.birthPlaceDate}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4.5 font-mono text-xs text-slate-600">
                          <div><span className="font-semibold text-[#1e3a8a]">NISN:</span> {student.nisn}</div>
                          <div className="mt-0.5"><span className="font-semibold text-[#1e3a8a]">NIS:</span> {student.nis}</div>
                        </td>
                        <td className="px-6 py-4.5">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-extrabold tracking-wide uppercase border ${
                            student.status.startsWith("LULUS DENGAN PUJIAN")
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : student.status.startsWith("LULUS")
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-rose-50 text-rose-700 border-rose-200"
                          }`}>
                            {student.status}
                          </span>
                        </td>
                        <td className="px-6 py-4.5 text-center font-bold text-slate-800 font-mono text-base">
                          {avg}
                        </td>
                        <td className="px-6 py-4.5 text-right whitespace-nowrap">
                          <div className="inline-flex gap-1.5 justify-end">
                            <button
                              onClick={() => handleOpenEditForm(student)}
                              className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg hover:text-blue-900 transition-colors cursor-pointer"
                              title="Edit Data"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteStudent(student.nisn)}
                              className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg hover:text-rose-900 transition-colors cursor-pointer"
                              title="Hapus Data"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Slide-over or Overlay Form for adding/editing students */}
      {isFormOpen && currentStudent && (
        <div className="fixed inset-0 z-55 flex items-center justify-center p-3.5 bg-slate-900/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-[28px] w-full max-w-2xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Form Header */}
            <div className="bg-slate-50 px-6 py-4 border-b border-indigo-50 flex items-center justify-between">
              <h3 className="font-extrabold text-[#1e3a8a] text-base flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                {students.some(s => s.nisn === currentStudent.nisn) ? "Edit Rekaman Kesiswaan" : "Tambah Rekaman Kesiswaan"}
              </h3>
              <button 
                onClick={() => setIsFormOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Tabs Indicator */}
            <div className="bg-slate-50/50 border-b border-indigo-50 gap-1 px-4 py-2 flex">
              <button
                type="button"
                onClick={() => setActiveTab("personal")}
                className={`px-4 py-2 text-xs font-bold rounded-lg uppercase tracking-wider cursor-pointer ${
                  activeTab === "personal"
                    ? "bg-[#1e40af] text-white"
                    : "text-[#1e3a8a] hover:bg-slate-100"
                }`}
              >
                1. Data Pribadi
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("grades")}
                className={`px-4 py-2 text-xs font-bold rounded-lg uppercase tracking-wider cursor-pointer ${
                  activeTab === "grades"
                    ? "bg-[#1e40af] text-white"
                    : "text-[#1e3a8a] hover:bg-slate-100"
                }`}
              >
                2. Daftar Nilai
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("extras")}
                className={`px-4 py-2 text-xs font-bold rounded-lg uppercase tracking-wider cursor-pointer ${
                  activeTab === "extras"
                    ? "bg-[#1e40af] text-white"
                    : "text-[#1e3a8a] hover:bg-slate-100"
                }`}
              >
                3. Catatan Guru
              </button>
            </div>

            {/* Form Content body */}
            <form onSubmit={handleSaveStudent} className="flex-grow flex flex-col overflow-hidden">
              <div className="p-6 overflow-y-auto space-y-4 flex-grow">
                
                {/* TAB 1: PERSONAL INFORMATION */}
                {activeTab === "personal" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-[#1e3a8a]/70 uppercase tracking-wider mb-1.5">
                          NISN (Nomor Induk Siswa Nasional) *
                        </label>
                        <input
                          type="text"
                          maxLength={10}
                          disabled={students.some(s => s.nisn === currentStudent.nisn)} // prevent editing nisn as it's the primary key
                          value={currentStudent.nisn || ""}
                          onChange={(e) => setCurrentStudent({...currentStudent, nisn: e.target.value.replace(/\D/g, "")})}
                          className={`w-full px-4.5 py-2.5 rounded-xl border ${formErrors.nisn ? "border-rose-350 bg-rose-50/20 text-rose-800" : "border-slate-200 focus:border-blue-500"} outline-none text-sm font-semibold`}
                          placeholder="Contoh: 0142859101"
                        />
                        {formErrors.nisn && <p className="text-rose-500 text-[11px] font-bold mt-1">{formErrors.nisn}</p>}
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#1e3a8a]/70 uppercase tracking-wider mb-1.5">
                          NIS (Nomor Induk Siswa) *
                        </label>
                        <input
                          type="text"
                          value={currentStudent.nis || ""}
                          onChange={(e) => setCurrentStudent({...currentStudent, nis: e.target.value})}
                          className="w-full px-4.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 outline-none text-sm font-semibold"
                          placeholder="Contoh: 1234/2020"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#1e3a8a]/70 uppercase tracking-wider mb-1.5">
                        Nama Lengkap Siswa *
                      </label>
                      <input
                        type="text"
                        value={currentStudent.name || ""}
                        onChange={(e) => setCurrentStudent({...currentStudent, name: e.target.value})}
                        className="w-full px-4.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 outline-none text-sm font-extrabold uppercase"
                        placeholder="Contoh: ADITYA PUTRA PRATAMA"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#1e3a8a]/70 uppercase tracking-wider mb-1.5">
                        Tempat, Tanggal Lahir *
                      </label>
                      <input
                        type="text"
                        value={currentStudent.birthPlaceDate || ""}
                        onChange={(e) => setCurrentStudent({...currentStudent, birthPlaceDate: e.target.value})}
                        className="w-full px-4.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 outline-none text-sm font-semibold"
                        placeholder="Contoh: Pasuruan, 12 April 2014"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-[#1e3a8a]/70 uppercase tracking-wider mb-1.5">
                          Status Kelulusan *
                        </label>
                        <select
                          value={currentStudent.status || "LULUS"}
                          onChange={(e) => setCurrentStudent({...currentStudent, status: e.target.value as Student["status"]})}
                          className="w-full px-4 px-3 py-2.5 rounded-xl bg-white border border-slate-200 focus:border-blue-500 outline-none text-sm font-bold text-slate-800"
                        >
                          <option value="LULUS">LULUS</option>
                          <option value="LULUS DENGAN PUJIAN">LULUS DENGAN PUJIAN</option>
                          <option value="TIDAK LULUS">TIDAK LULUS</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#1e3a8a]/70 uppercase tracking-wider mb-1.5">
                          Nomor Surat Keputusan Kelulusan (SKL) *
                        </label>
                        <input
                          type="text"
                          value={currentStudent.serialNumber || ""}
                          onChange={(e) => setCurrentStudent({...currentStudent, serialNumber: e.target.value})}
                          className="w-full px-4.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 outline-none text-sm font-semibold"
                          placeholder="Contoh: 421.2/089/SD-43/2026"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: GRADES */}
                {activeTab === "grades" && (
                  <div className="space-y-6">
                    <div className="flex bg-slate-100 p-1 rounded-xl w-full max-w-md mx-auto border border-slate-200">
                      <button
                        type="button"
                        onClick={() => setGradeInputMode("rerata")}
                        className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                          gradeInputMode === "rerata"
                            ? "bg-[#1e40af] text-white shadow-sm"
                            : "text-slate-600 hover:text-slate-800"
                        }`}
                      >
                        Input Rerata Saja (Cepat)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          // Ensure we've back-filled default list with the current avg if empty
                          const updated = { ...gradesInput };
                          DEFAULT_SUBJECTS.forEach(sub => {
                            if (!updated[sub.code] || updated[sub.code] === 0) {
                              updated[sub.code] = averageGradeState || 85;
                            }
                          });
                          setGradesInput(updated);
                          setGradeInputMode("detil");
                        }}
                        className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                          gradeInputMode === "detil"
                            ? "bg-[#1e40af] text-white shadow-sm"
                            : "text-slate-600 hover:text-slate-800"
                        }`}
                      >
                        Input Per Mapel (Lengkap)
                      </button>
                    </div>

                    {gradeInputMode === "rerata" ? (
                      <div className="bg-blue-50/50 border border-blue-100/50 p-6 rounded-2xl max-w-md mx-auto text-center space-y-4">
                        <label className="block text-xs font-extrabold text-[#1e3a8a] uppercase tracking-wider">
                          Rata-Rata Nilai Kelulusan (0 - 100)
                        </label>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          Tidak perlu repot memasukkan nilai satu per satu! Cukup masukkan rata-rata nilai siswa di bawah, dan sistem akan mengaturnya otomatis secara adil dan seragam.
                        </p>
                        <div className="inline-flex items-center gap-3.5 bg-white px-5 py-3 rounded-2xl border border-slate-200 shadow-inner">
                          <input
                            type="number"
                            min={0}
                            max={100}
                            required
                            value={averageGradeState === 0 ? "" : averageGradeState}
                            onChange={(e) => {
                              const val = Math.min(100, Math.max(0, parseFloat(e.target.value) || 0));
                              setAverageGradeState(val);
                            }}
                            placeholder="85"
                            className="w-24 text-center text-3xl font-mono font-black text-blue-900 outline-none"
                          />
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p className="text-xs text-slate-500 mb-4 italic">
                          Masukkan nilai raport kelulusan (skala 0 - 100) secara mendetail untuk seluruh mata pelajaran berikut.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {DEFAULT_SUBJECTS.map((sub) => (
                            <div key={sub.code} className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                              <div className="flex-grow">
                                <span className="block text-xs font-bold text-[#1e3a8a]">{sub.subject}</span>
                                <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">{sub.code}</span>
                              </div>
                              <input
                                type="number"
                                min={0}
                                max={100}
                                required
                                value={gradesInput[sub.code] ?? 0}
                                onChange={(e) => {
                                  const val = Math.min(100, Math.max(0, parseFloat(e.target.value) || 0));
                                  setGradesInput({ ...gradesInput, [sub.code]: val });
                                }}
                                className="w-20 px-3 py-2 bg-white border border-slate-250 focus:border-blue-500 outline-none rounded-lg text-center font-bold text-slate-900 text-sm font-mono"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 3: EXTRAS (ACHIEVEMENTS, NOTES) */}
                {activeTab === "extras" && (
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-bold text-[#1e3a8a]/70 uppercase tracking-wider">
                          Catatan Guru / Pembinaan Perkembangan Siswa
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            if (currentStudent) {
                              const avg = getCurrentAverageScore();
                              setCurrentStudent({
                                ...currentStudent,
                                notes: getAutomaticTeacherNote(avg, currentStudent.name || "")
                              });
                            }
                          }}
                          className="text-[10px] text-blue-600 hover:text-blue-800 font-bold bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg border border-blue-100 transition-all flex items-center gap-1 cursor-pointer"
                        >
                          ✨ Buat Otomatis Sesuai Nilai
                        </button>
                      </div>
                      <textarea
                        rows={4}
                        value={currentStudent.notes || ""}
                        onChange={(e) => setCurrentStudent({...currentStudent, notes: e.target.value})}
                        placeholder="Masukkan catatan positif mengenai sikap, absensi, atau keterampilan siswa..."
                        className="w-full px-4.5 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none text-sm font-semibold"
                      />
                      <p className="text-[10px] text-slate-400 mt-1">
                        Saran catatan akan otomatis disesuaikan dengan rata-rata nilai siswa ({getCurrentAverageScore()}).
                      </p>
                    </div>
                  </div>
                )}

              </div>

              {/* Form Footer actions */}
              <div className="bg-slate-50 px-6 py-4.5 border-t border-indigo-50 flex items-center justify-end gap-3.5">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-5 py-2.5 bg-slate-200 text-slate-700 hover:bg-slate-250 rounded-xl text-sm font-bold cursor-pointer"
                >
                  Batal
                </button>
                
                {activeTab !== "extras" ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (activeTab === "personal") setActiveTab("grades");
                      else if (activeTab === "grades") setActiveTab("extras");
                    }}
                    className="px-5 py-2.5 bg-[#1e40af] hover:bg-[#1d4ed8] text-white rounded-xl text-sm font-bold cursor-pointer"
                  >
                    Selanjutnya
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#1e40af] hover:bg-[#1d4ed8] text-white rounded-xl text-sm font-bold flex items-center gap-2 cursor-pointer"
                    id="btn-save-recipient"
                  >
                    <Save className="w-4 h-4" />
                    <span>Simpan Rekor</span>
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Excel / CSV Copy-Paste Import Overlay Modal */}
      {isImportOpen && (
        <div className="fixed inset-0 z-55 flex items-center justify-center p-3.5 bg-slate-900/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-[28px] w-full max-w-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="bg-slate-50 px-6 py-4.5 border-b border-indigo-50 flex items-center justify-between">
              <h3 className="font-extrabold text-[#1e3a8a] text-base flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                <span>Import Otomatis via Salin-Tempel (Excel / Sheets / CSV)</span>
              </h3>
              <button 
                onClick={() => setIsImportOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4 flex-grow">
              
              <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100/75 text-xs text-emerald-950">
                <h4 className="font-bold mb-1 uppercase tracking-wider text-[#1e3a8a]">Langkah-Langkah Import Otomatis (Cerdas):</h4>
                <p className="mb-2 leading-relaxed">
                  Sistem kami mendeteksi separator dan jenis dokumen spreadsheet Anda secara otomatis. Anda dapat mendesain spreadsheet dalam 2 model format pilihan:
                </p>
                <div className="space-y-2 mb-3">
                  <div className="bg-white p-2.5 rounded-lg border border-emerald-100 shadow-xs">
                    <span className="font-extrabold text-emerald-800 uppercase text-[10px] block mb-1">Opsi A: Format Nilai Rerata Saja (Lebih Cepat, 7 Kolom)</span>
                    <div className="font-mono overflow-x-auto whitespace-nowrap text-[9px] text-[#1e3a8a] py-0.5">
                      NISN | NIS | Nama Lengkap | Tempat, Tgl Lahir | Status Kelulusan | Rata-Rata Nilai | Catatan Guru
                    </div>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-emerald-100 shadow-xs">
                    <span className="font-extrabold text-indigo-800 uppercase text-[10px] block mb-1">Opsi B: Format Nilai 9 Mapel Lengkap (15 Kolom)</span>
                    <div className="font-mono overflow-x-auto whitespace-nowrap text-[9px] text-[#1e3a8a] py-0.5">
                      NISN | NIS | Nama Lengkap | Tempat, Tgl Lahir | Status | PAIBP | PP | IND | MAT | IPAS | SB | PJOK | JW | ENG | Catatan
                    </div>
                  </div>
                </div>
                <ol className="list-decimal pl-4.5 space-y-1">
                  <li>Buat kolom-kolom persis salah satu opsi di atas di Microsoft Excel atau Google Sheets.</li>
                  <li>Salin (Ctrl+C) seluruh baris data siswa yang ingin diunggah.</li>
                  <li>Tempelkan (Ctrl+V) di kolom teks besar di bawah ini lalu klik <strong>"Proses & Masukkan Data"</strong>.</li>
                </ol>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const sample = "0142859101\t1201/2020\tADITYA PUTRA PRATAMA\tPasuruan, 12 April 2014\tLULUS\t88.5\tSiswa sangat berbakat dan taat.";
                      setImportText(sample);
                    }}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-lg text-[9px] uppercase transition-all shadow-sm cursor-pointer"
                  >
                    Salin Contoh Format Rerata (7 Kolom)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const sample = "0142859101\t1201/2020\tADITYA PUTRA PRATAMA\tPasuruan, 12 April 2014\tLULUS\t85\t88\t90\t92\t86\t87\t89\t82\t84\tPerilaku sangat baik dan rajin.";
                      setImportText(sample);
                    }}
                    className="px-3 py-1.5 bg-[#1e40af] hover:bg-indigo-700 text-white font-extrabold rounded-lg text-[9px] uppercase transition-all shadow-sm cursor-pointer"
                  >
                    Salin Contoh Format Lengkap (15 Kolom)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1e3a8a]/70 uppercase tracking-wider mb-2">
                  Paste Data dari Excel / Teks CSV Ke Mari:
                </label>
                <textarea
                  rows={8}
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  placeholder="Paste data di sini..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-250 focus:border-emerald-500 rounded-xl outline-none font-mono text-xs focus:bg-white resize-y"
                />
              </div>

              {importStatus?.error && (
                <div className="flex items-center gap-2 p-3.5 bg-rose-50 border border-rose-150 text-rose-750 rounded-xl text-xs sm:text-sm">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500" />
                  <span>{importStatus.error}</span>
                </div>
              )}

              {importStatus?.success && (
                <div className="flex items-center gap-2 p-3.5 bg-emerald-50 border border-emerald-150 text-emerald-850 rounded-xl text-xs sm:text-sm animate-bounce-short">
                  <CheckCircle className="w-4 h-4 shrink-0 text-emerald-500" />
                  <span>{importStatus.success}</span>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="bg-slate-55 px-6 py-4.5 border-t border-indigo-50 flex items-center justify-end gap-3.5">
              <button
                type="button"
                onClick={() => setIsImportOpen(false)}
                className="px-5 py-2.5 bg-slate-250 text-slate-700 hover:bg-slate-300 rounded-xl text-sm font-bold cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleImportText}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold flex items-center gap-2 cursor-pointer shadow-md shadow-emerald-500/10 active:scale-[0.98] transition-all"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Proses & Masukkan Data</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Custom Toast Notification Popup */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-[120] flex items-center gap-3 px-5 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl shadow-xl animate-fade-in border border-emerald-500/30 max-w-sm">
          <CheckCircle className="w-5 h-5 shrink-0 text-white" />
          <span className="text-xs sm:text-sm font-bold tracking-wide">{successToast}</span>
        </div>
      )}

      {/* Custom Student Deletion Confirm Modal */}
      {studentToDelete && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
          <div className="bg-white rounded-[32px] w-full max-w-md border border-slate-200/50 shadow-2xl p-6.5 text-center overflow-hidden relative">
            <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-100">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-lg sm:text-xl uppercase tracking-wide">
              Hapus Data Kesiswaan?
            </h3>
            <p className="text-slate-500 text-xs sm:text-sm mt-2.5 leading-relaxed">
              Apakah Anda benar-benar yakin ingin menghapus data siswa <strong className="font-extrabold text-[#1e3a8a]">{studentToDelete.name}</strong> (NISN: {studentToDelete.nisn})? Perubahan ini bersifat permanen dan tidak dapat dibatalkan.
            </p>
            <div className="flex items-center justify-center gap-3.5 mt-6.5">
              <button
                type="button"
                onClick={() => setStudentToDelete(null)}
                className="px-5 py-2.5 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-xl text-xs sm:text-sm font-bold cursor-pointer transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmDeleteStudent}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 cursor-pointer shadow-md shadow-rose-500/10 active:scale-[0.98] transition-all"
              >
                <Trash2 className="w-4 h-4" />
                <span>Ya, Hapus Data</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Reset Database Confirm Modal */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
          <div className="bg-white rounded-[32px] w-full max-w-md border border-slate-200/50 shadow-2xl p-6.5 text-center overflow-hidden relative">
            <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-100">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-lg sm:text-xl uppercase tracking-wide">
              Reset Basis Data?
            </h3>
            <p className="text-slate-500 text-xs sm:text-sm mt-2.5 leading-relaxed">
              Tindakan ini akan mengembalikan seluruh basis data siswa ke berkas bawaan simulasi awal. Semua perubahan, penambahan, dan penghapusan data kesiswaan buatan Anda akan terhapus total.
            </p>
            <div className="flex items-center justify-center gap-3.5 mt-6.5">
              <button
                type="button"
                onClick={() => setIsResetConfirmOpen(false)}
                className="px-5 py-2.5 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-xl text-xs sm:text-sm font-bold cursor-pointer transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmResetToDefault}
                className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 cursor-pointer shadow-md shadow-amber-500/10 active:scale-[0.98] transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Ya, Reset Sekarang</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
