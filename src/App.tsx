import React, { useState, useEffect } from "react";
import BackgroundDecoration from "./components/BackgroundDecoration";
import Confetti from "./components/Confetti";
import SKLSheet from "./components/SKLSheet";
import AdminPanel from "./components/AdminPanel";
import { SCHOOL_CONFIG, STUDENTS_DB } from "./studentsData";
import { Student, SchoolConfig } from "./types";
import { 
  testConnection, 
  fetchAllStudents, 
  fetchSchoolConfig, 
  bulkWriteStudents, 
  deleteStudentDoc,
  fetchStudentByNisn,
  auth
} from "./firebase";
import { 
  Search, 
  GraduationCap, 
  Sparkles, 
  School, 
  Award, 
  BookOpen, 
  TrendingUp, 
  PhoneCall, 
  AlertCircle, 
  FileCheck2,
  Users,
  Lock,
  CloudLightning
} from "lucide-react";

export default function App() {
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem("SDN_STUDENTS_DB");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return STUDENTS_DB;
  });

  const [schoolConfig, setSchoolConfig] = useState<SchoolConfig>(() => {
    const saved = localStorage.getItem("SDN_SCHOOL_CONFIG");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return SCHOOL_CONFIG;
  });

  const [isFirebaseSyncing, setIsFirebaseSyncing] = useState(true);

  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [nisnInput, setNisnInput] = useState("");
  const [searchedStudent, setSearchedStudent] = useState<Student | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [isCelebrating, setIsCelebrating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function initFirebaseData() {
      try {
        await testConnection();
        // Load custom config from Firebase (allowed for unauthenticated users)
        const cloudConfig = await fetchSchoolConfig(SCHOOL_CONFIG);
        setSchoolConfig(cloudConfig);
        localStorage.setItem("SDN_SCHOOL_CONFIG", JSON.stringify(cloudConfig));
        
        // Fetch student database for all devices (including mobile HP) on initial boot to keep in sync
        const cloudStudents = await fetchAllStudents();
        if (cloudStudents.length > 0) {
          setStudents(cloudStudents);
          localStorage.setItem("SDN_STUDENTS_DB", JSON.stringify(cloudStudents));
        } else {
          // If Firestore is empty (e.g., initial boot/reset), and admin is logged in
          if (auth.currentUser) {
            await bulkWriteStudents(students);
          }
        }
      } catch (err) {
        console.error("Gagal inisialisasi basis data kesiswaan:", err);
      } finally {
        setIsFirebaseSyncing(false);
      }
    }
    initFirebaseData();

    // Listen for auth state changes to dynamically load full students list when signed in as admin
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setIsFirebaseSyncing(true);
        try {
          const cloudStudents = await fetchAllStudents();
          if (cloudStudents.length === 0) {
            // First run setup by Admin
            await bulkWriteStudents(students);
            localStorage.setItem("SDN_STUDENTS_DB", JSON.stringify(students));
          } else {
            setStudents(cloudStudents);
            localStorage.setItem("SDN_STUDENTS_DB", JSON.stringify(cloudStudents));
          }
        } catch (err) {
          console.error("Gagal sinkronisasi data kesiswaan admin:", err);
        } finally {
          setIsFirebaseSyncing(false);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const saveStudents = async (updated: Student[]) => {
    setIsSubmitting(true);
    try {
      // Find deleted records
      const previousNisns = students.map(s => s.nisn);
      const updatedNisns = updated.map(s => s.nisn);
      const deletedNisns = previousNisns.filter(nisn => !updatedNisns.includes(nisn));
      
      // Execute deletions
      for (const dNisn of deletedNisns) {
        await deleteStudentDoc(dNisn);
      }
      
      // Save updated and newly added student documents
      await bulkWriteStudents(updated);
      
      setStudents(updated);
      localStorage.setItem("SDN_STUDENTS_DB", JSON.stringify(updated));
      
      // Keep active search details updated
      if (searchedStudent) {
        const live = updated.find(s => s.nisn === searchedStudent.nisn);
        setSearchedStudent(live || null);
      }
    } catch (e) {
      console.error("Gagal mensinkronisasikan ke Firestore:", e);
      alert("Koneksi internet bermasalah. Gagal menyimpan perubahan ke server cloud.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Form Submission/Verification Process via Direct Firestore Single Search (Zero-Trust Compliant)
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    
    const preparedNisn = nisnInput.trim();
    
    // Validations
    if (!preparedNisn) {
      setErrorMsg("Silakan masukkan Nomor Induk Siswa Nasional (NISN) Anda.");
      return;
    }

    if (!/^\d+$/.test(preparedNisn)) {
      setErrorMsg("NISN hanya boleh mengandung angka.");
      return;
    }

    if (preparedNisn.length !== 10) {
      setErrorMsg("NISN resmi harus berjumlah tepat 10 digit.");
      return;
    }

    setIsSubmitting(true);

    // Fetch the single document by NISN from Firestore (permitted for everyone under Firestore secure get rules)
    fetchStudentByNisn(preparedNisn)
      .then((cloudStudent) => {
        if (cloudStudent) {
          setSearchedStudent(cloudStudent);
          setErrorMsg("");
          
          // Trigger congratulations confetti if the student is successful (LULUS)
          if (cloudStudent.status.startsWith("LULUS")) {
            setIsCelebrating(true);
            setTimeout(() => setIsCelebrating(false), 8000);
          }
        } else {
          // Fallback to local state just in case there is a connection glitch or they are using local data
          const localStudent = students.find(s => s.nisn === preparedNisn);
          if (localStudent) {
            setSearchedStudent(localStudent);
            setErrorMsg("");
            if (localStudent.status.startsWith("LULUS")) {
              setIsCelebrating(true);
              setTimeout(() => setIsCelebrating(false), 8000);
            }
          } else {
            setErrorMsg("Siswa dengan Nomor NISN tersebut tidak terdaftar di SDN Gajahbendo Beji. Coba periksa kembali digit angka atau hubungi Admin sekolah.");
            setSearchedStudent(null);
          }
        }
      })
      .catch((err) => {
        console.error("Gagal mencari data dari Firestore:", err);
        // Robust fallback to local cache
        const localStudent = students.find(s => s.nisn === preparedNisn);
        if (localStudent) {
          setSearchedStudent(localStudent);
          setErrorMsg("");
          if (localStudent.status.startsWith("LULUS")) {
            setIsCelebrating(true);
            setTimeout(() => setIsCelebrating(false), 8000);
          }
        } else {
          setErrorMsg("Gagal memproses pencarian (Koneksi bermasalah). Silakan periksa jaringan internet Anda.");
          setSearchedStudent(null);
        }
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const handleResetSearch = () => {
    setSearchedStudent(null);
    setNisnInput("");
    setErrorMsg("");
    setIsCelebrating(false);
  };

  return (
    <div className="relative min-h-screen flex flex-col font-sans select-text select-none text-slate-800 pb-12 overflow-x-hidden">
      
      {/* Background Graphic Decoration Layers */}
      <BackgroundDecoration />

      {/* Confetti Explosion Component */}
      <Confetti active={isCelebrating} />

      {/* Floating Sparkles & Soft Ambient Lights */}
      <div className="absolute top-[5%] left-[2%] w-[20vw] h-[20vw] rounded-full bg-blue-300/10 blur-3xl" />
      <div className="absolute bottom-[10%] right-[2%] w-[25vw] h-[25vw] rounded-full bg-amber-200/10 blur-3xl" />

      {/* Main Container */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex-grow flex flex-col items-center justify-center pt-6 sm:pt-12">
        
        {searchedStudent ? (
          /* SECTION 1: SEARCH RESULT DETAIL DISPLAY SHEET */
          <div className="w-full flex justify-center py-2">
            <SKLSheet 
              student={searchedStudent} 
              school={schoolConfig} 
              onBack={handleResetSearch} 
            />
          </div>
        ) : (
          /* SECTION 2: HOMEPAGE SEARCH VIEW & PORTAL INFRASTRUCTURE */
          <div className="w-full max-w-2xl flex flex-col items-center justify-center animate-fade-in">
            
            {/* School Logo Shield & Tiny Badge */}
            <div className="mb-4 inline-flex items-center gap-2 bg-[#1e3a8a] text-white py-1.5 px-4 rounded-full text-xs font-bold tracking-[0.2em] uppercase shadow-sm">
              <GraduationCap className="w-4 h-4 text-amber-300" />
              Kelulusan Kelas VI SD
            </div>

            {/* Main Center Titles in Clean Minimalism Theme */}
            <div className="text-center mb-10">
              <h2 className="text-[#1e3a8a] text-xs sm:text-sm font-bold tracking-[0.25em] uppercase mb-3">
                Portal Kelulusan Resmi
              </h2>
              <h1 className="text-3xl sm:text-4.5xl md:text-5xl font-black text-[#1e3a8a] tracking-tight leading-tight mb-2 uppercase">
                {schoolConfig.name}
              </h1>
              <p className="text-blue-600/70 font-semibold text-sm sm:text-base max-w-xl mx-auto mt-2">
                Selamat Datang di Sistem Informasi Pengumuman Kelulusan Kelas 6
              </p>
            </div>

            {/* Central NISN Query Card Form with Clean Minimalism styling */}
            <div className="w-full bg-white/60 backdrop-blur-md rounded-[40px] p-8 sm:p-10 border border-white/80 shadow-[0_32px_64px_-16px_rgba(30,58,138,0.1)] mb-8 relative">
              <div className="absolute top-0 right-10 -translate-y-1/2 p-2 bg-amber-400 text-slate-900 rounded-2xl shadow-md rotate-3 flex items-center gap-1 text-[10px] font-bold">
                <Sparkles className="w-3 h-3 text-slate-950 animate-bounce" />
                <span>Format Resmi NISN</span>
              </div>

              <h3 className="text-lg font-extrabold text-[#1e3a8a] mb-2 flex items-center gap-2 justify-center sm:justify-start">
                <FileCheck2 className="w-5 h-5 text-blue-600" />
                Cek Status Kelulusan
              </h3>
              <p className="text-blue-900/60 text-xs sm:text-sm mb-6 leading-relaxed">
                Silakan masukkan 10 digit <strong>Nomor Induk Siswa Nasional (NISN)</strong> Anda di bawah ini untuk melihat hasil kelulusan dan mencetak dokumen resmi.
              </p>

              {/* Input Form with verification details */}
              <form onSubmit={handleSearch} className="space-y-5">
                <div className="relative">
                  <input
                    type="text"
                    maxLength={10}
                    value={nisnInput}
                    onChange={(e) => {
                      // Only allow digits
                      const val = e.target.value.replace(/\D/g, "");
                      setNisnInput(val);
                      if (errorMsg) setErrorMsg("");
                    }}
                    placeholder="Masukkan NISN Siswa"
                    className="w-full px-6 py-4.5 rounded-2xl border-2 border-blue-100 bg-white shadow-xs focus:border-blue-500 focus:ring-4 focus:ring-blue-100/50 outline-none text-center text-lg font-bold text-blue-900 transition-all placeholder:text-blue-300"
                    id="input-nisn"
                  />
                  <div className="absolute right-4.5 inset-y-0 flex items-center print:hidden">
                    <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                      {nisnInput.length}/10
                    </span>
                  </div>
                </div>

                {/* Validation Error Message Box */}
                {errorMsg && (
                  <div className="flex items-start gap-2.5 p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs sm:text-sm animate-fade-in">
                    <AlertCircle className="w-5 h-5 shrink-0 text-rose-500 mt-0.5" />
                    <div className="text-left">
                      <span className="font-bold">Terjadi Kesalahan:</span> {errorMsg}
                    </div>
                  </div>
                )}

                {/* Submit query button - solid vibrant blue with absolutely no transparency */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4.5 bg-[#1e40af] hover:bg-[#1d4ed8] text-white rounded-2xl font-bold text-lg shadow-lg shadow-blue-200/50 transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer pt-4"
                  id="btn-search-nisn"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/60 border-t-white rounded-full animate-spin" />
                      <span>Memproses Basis Data Kesiswaan...</span>
                    </div>
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      <span>Cek Status Kelulusan</span>
                    </>
                  )}
                </button>
                <p className="text-center text-xs text-blue-400 italic">Pastikan NISN yang Anda masukkan sudah benar.</p>
              </form>

              {/* Minimal Trust Seals from the Clean Minimalism theme */}
              <div className="mt-8 pt-6 border-t border-blue-50 flex items-center justify-center gap-8">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mb-2">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1e40af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  </div>
                  <span className="text-[10px] uppercase tracking-wider font-bold text-blue-900/40">Resmi & Akurat</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mb-2">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1e40af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </div>
                  <span className="text-[10px] uppercase tracking-wider font-bold text-blue-900/40">Privasi Terjamin</span>
                </div>
              </div>

            </div>

             {/* School Contact Footer Support */}
            <footer className="w-full text-center py-4 text-xs text-slate-500 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-slate-200/50 mt-4">
              <div className="flex flex-col items-center md:items-start gap-1">
                <p className="font-semibold text-slate-400">
                  &copy; 2026 {schoolConfig.name}. Kesiswaan & Kurikulum.
                </p>
                {isFirebaseSyncing ? (
                  <span className="inline-flex items-center gap-1.5 text-[10px] text-blue-500 font-semibold bg-blue-50/50 px-2.5 py-0.5 rounded-full border border-blue-100/40 animate-pulse">
                    <span className="w-1 h-1 rounded-full bg-blue-500 animate-ping"></span>
                    Menghubungkan cloud kesiswaan...
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-semibold bg-emerald-50/40 px-2.5 py-0.5 rounded-full border border-emerald-100/25">
                    <CloudLightning className="w-3 h-3 text-emerald-500 animate-pulse" />
                    Cloud Aktif & Tersinkronisasi
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center justify-center gap-4 text-slate-500">
                <div className="flex items-center gap-2">
                  <PhoneCall className="w-3.5 h-3.5 text-blue-500 inline" />
                  <span>Bantuan Teknis: <strong>085732996700</strong></span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAdminOpen(true)}
                  className="px-3.5 py-1.5 bg-blue-50/70 hover:bg-blue-100/80 text-[#1e40af] text-[11px] font-extrabold rounded-lg border border-blue-100/45 cursor-pointer flex items-center gap-1.5 transition-all shadow-xs"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Portal Admin</span>
                </button>
              </div>
            </footer>

          </div>
        )}

      </main>

      {/* Admin Panel Floating Dashboard */}
      {isAdminOpen && (
        <AdminPanel
          students={students}
          onSaveStudents={saveStudents}
          onClose={() => setIsAdminOpen(false)}
          defaultDb={STUDENTS_DB}
        />
      )}
    </div>
  );
}
