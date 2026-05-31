import React from "react";
import { Student, SchoolConfig } from "../types";
import { calculateAverage, getPredikatLabel } from "../studentsData";
import { ArrowLeft, Award, CheckCircle2, User, Calendar, Hash, GraduationCap } from "lucide-react";

interface SKLSheetProps {
  student: Student;
  school: SchoolConfig;
  onBack: () => void;
}

export default function SKLSheet({ student, school, onBack }: SKLSheetProps) {
  const averageGrade = calculateAverage(student.grades);

  return (
    <div className="w-full max-w-4xl mx-auto z-10 animate-fade-in relative">
      
      {/* Return back header (No download or print buttons) */}
      <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/70 backdrop-blur-md p-5 rounded-3xl border border-blue-50 shadow-sm">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={onBack}
            className="p-3 bg-white text-slate-600 hover:text-blue-600 rounded-full shadow-xs hover:shadow-sm border border-slate-100 transition-all duration-200 cursor-pointer"
            title="Kembali ke Pencarian"
            id="btn-back-to-search"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              Hasil Pengumuman Kelulusan
            </h2>
            <p className="text-xs text-slate-500">
              Pernyataan kelulusan resmi untuk NISN: <span className="font-mono font-bold text-blue-600">{student.nisn}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-blue-800 px-4 py-2 bg-blue-50/50 rounded-full border border-blue-105/30">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Sistem Kelulusan Mandiri</span>
        </div>
      </div>

      {/* Modern Status Celebration Banner */}
      <div className="mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-500 via-teal-600 to-blue-600 text-white p-6 sm:p-8 shadow-md relative">
        <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-10 overflow-hidden pointer-events-none">
          <Award className="w-full h-full -rotate-12 translate-x-8 translate-y-8" />
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <div className="p-3.5 bg-white/15 rounded-2xl border border-white/10 shrink-0">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
            <div>
              <span className="inline-block px-3 py-0.5 bg-white/15 rounded-full text-[10px] font-bold uppercase tracking-widest mb-2 border border-white/5">
                Status Kelulusan Siswa
              </span>
              <h1 className="text-2xl sm:text-3.5xl font-black tracking-tight uppercase leading-none">
                {student.status}
              </h1>
              <p className="text-emerald-50/90 text-xs sm:text-sm mt-3.5 max-w-xl leading-relaxed">
                Selamat kepada <span className="font-extrabold underline">{student.name}</span> atas selesainya masa studi pendidikan dasar 6 tahun di {school.name} dengan pencapaian yang membanggakan.
              </p>
            </div>
          </div>

          {/* Large average score badge in the right corner of the banner */}
          <div className="flex flex-col items-center justify-center shrink-0 bg-white/15 backdrop-blur-md px-6 py-4.5 rounded-2.5xl border border-white/10 text-center min-w-[155px]">
            <span className="text-[10px] text-emerald-100 uppercase tracking-widest font-extrabold">Rata-Rata Nilai</span>
            <span className="text-4xl sm:text-5xl font-mono font-black mt-1.5 tracking-tight text-white">{averageGrade}</span>
            <span className="text-[9px] text-emerald-50 font-bold mt-1.5 uppercase bg-white/10 px-2.5 py-0.5 rounded-md">
              {getPredikatLabel(averageGrade).split(" (")[0]}
            </span>
          </div>
        </div>
      </div>

      {/* Modern Centered Student Information Layout */}
      <div className="max-w-xl mx-auto w-full">
        
        {/* Student Profile Card */}
        <div className="bg-white/80 backdrop-blur-sm p-6 sm:p-8 rounded-[32px] border border-slate-100 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#1e3a8a] uppercase tracking-wider mb-5 flex items-center justify-center gap-2">
              <User className="w-4 h-4 text-blue-500" />
              Profil Lengkap Siswa
            </h3>

            {/* Simulated Avatar Badge */}
            <div className="mb-6 flex flex-col items-center justify-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-50 to-indigo-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-3 shadow-inner animate-pulse-slow">
                <GraduationCap className="w-10 h-10 text-blue-500" />
              </div>
              <h2 className="text-center font-black text-slate-800 text-sm sm:text-base md:text-lg leading-snug uppercase tracking-wide px-2">
                {student.name}
              </h2>
              <p className="text-xs text-slate-400 font-medium mt-1 font-mono">NIS: {student.nis}</p>
            </div>

            {/* Credentials Info Details */}
            <div className="space-y-4 text-xs sm:text-sm">
              <div className="flex items-center justify-between p-3.5 bg-slate-50/50 rounded-xl border border-slate-100/50">
                <span className="text-slate-400 font-medium flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5 text-blue-400" /> NISN
                </span>
                <span className="font-mono font-bold text-slate-800">{student.nisn}</span>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-slate-50/50 rounded-xl border border-slate-100/50">
                <span className="text-slate-400 font-medium flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-blue-400" /> Tempat, Tgl Lahir
                </span>
                <span className="font-semibold text-slate-800">{student.birthPlaceDate}</span>
              </div>
            </div>
          </div>

          <div className="mt-7 pt-5 border-t border-slate-100 text-center">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Satuan Pendidikan</span>
            <span className="text-xs font-extrabold text-blue-900 mt-1 block">{school.name}</span>
          </div>
        </div>

      </div>

    </div>
  );
}
