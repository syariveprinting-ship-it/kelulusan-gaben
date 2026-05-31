export interface SubjectGrade {
  subject: string;
  code: string;
  score: number;
}

export interface Student {
  nisn: string;
  nis: string;
  name: string;
  photoUrl?: string;
  birthPlaceDate: string;
  status: "LULUS" | "LULUS DENGAN PUJIAN" | "TIDAK LULUS";
  serialNumber: string; // Nomor Surat Keterangan Kelulusan
  grades: SubjectGrade[];
  notes?: string;
  achievements?: string[];
}

export interface SchoolConfig {
  name: string;
  address: string;
  village: string;
  district: string;
  regency: string;
  province: string;
  headmasterName: string;
  headmasterNip: string;
  releaseDate: string;
  announcementTime: string;
}
