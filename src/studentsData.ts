import { Student, SchoolConfig, SubjectGrade } from "./types";

export const SCHOOL_CONFIG: SchoolConfig = {
  name: "SDN GAJAHBENDO BEJI",
  address: "Jl. Raya Gajahbendo No. 12, Gajahbendo, Kec. Beji, Kab. Pasuruan, Jawa Timur, 67154",
  village: "Gajahbendo",
  district: "Beji",
  regency: "Pasuruan",
  province: "Jawa Timur",
  headmasterName: "Hj. SRI UTAMI, S.Pd., M.M.",
  headmasterNip: "196908241991032007",
  releaseDate: "15 Juni 2026",
  announcementTime: "10:00 WIB"
};

export const STUDENTS_DB: Student[] = [
  {
    nisn: "0142859101",
    nis: "1234/2020",
    name: "ADITYA PUTRA PRATAMA",
    birthPlaceDate: "Pasuruan, 12 April 2014",
    status: "LULUS DENGAN PUJIAN",
    serialNumber: "421.2/089/SD-43/2026",
    achievements: [
      "Juara 1 Lomba Matematika Tingkat Kecamatan Beji",
      "Peringkat 1 Umum Kelas 6 SDN Gajahbendo"
    ],
    notes: "Aditya adalah siswa berprestasi tinggi dengan ketertarikan kuat di bidang matematika dan sains. Selalu menunjukkan kedisiplinan dan sopan santun yang luar biasa.",
    grades: [
      { subject: "Pendidikan Agama dan Budi Pekerti", code: "PAIBP", score: 95 },
      { subject: "Pendidikan Pancasila", code: "PP", score: 92 },
      { subject: "Bahasa Indonesia", code: "IND", score: 94 },
      { subject: "Matematika", code: "MAT", score: 98 },
      { subject: "Ilmu Pengetahuan Alam dan Sosial (IPAS)", code: "IPAS", score: 96 },
      { subject: "Seni dan Budaya (Seni Musik/Seni Rupa)", code: "SB", score: 90 },
      { subject: "Pendidikan Jasmani, Olahraga, dan Kesehatan", code: "PJOK", score: 88 },
      { subject: "Bahasa Jawa (Mulok)", code: "JW", score: 91 },
      { subject: "Bahasa Inggris", code: "ENG", score: 93 }
    ]
  },
  {
    nisn: "0139485122",
    nis: "1235/2020",
    name: "AIRIN KHANZA MAULIDA",
    birthPlaceDate: "Sidoarjo, 28 Agustus 2013",
    status: "LULUS DENGAN PUJIAN",
    serialNumber: "421.2/090/SD-43/2026",
    achievements: [
      "Juara 2 Lomba Pidato Bahasa Indonesia Kabupaten Pasuruan",
      "Ketua Kelas 6 SDN Gajahbendo (Tahun Pelajaran 2025/2026)"
    ],
    notes: "Airin memiliki jiwa kepemimpinan yang sangat baik dan bakat berbicara yang persuasif. Ia selalu aktif mendukung kegiatan sekolah.",
    grades: [
      { subject: "Pendidikan Agama dan Budi Pekerti", code: "PAIBP", score: 96 },
      { subject: "Pendidikan Pancasila", code: "PP", score: 95 },
      { subject: "Bahasa Indonesia", code: "IND", score: 97 },
      { subject: "Matematika", code: "MAT", score: 89 },
      { subject: "Ilmu Pengetahuan Alam dan Sosial (IPAS)", code: "IPAS", score: 92 },
      { subject: "Seni dan Budaya (Seni Musik/Seni Rupa)", code: "SB", score: 94 },
      { subject: "Pendidikan Jasmani, Olahraga, dan Kesehatan", code: "PJOK", score: 87 },
      { subject: "Bahasa Jawa (Mulok)", code: "JW", score: 95 },
      { subject: "Bahasa Inggris", code: "ENG", score: 96 }
    ]
  },
  {
    nisn: "0145892015",
    nis: "1236/2020",
    name: "BAGAS DWIKI SURYO",
    birthPlaceDate: "Pasuruan, 05 Desember 2013",
    status: "LULUS",
    serialNumber: "421.2/091/SD-43/2026",
    achievements: [
      "Juara 1 Lomba Sepak Bola Antar-SD Se-Kecamatan Beji",
      "Kapten Tim Sepak Bola SDN Gajahbendo"
    ],
    notes: "Bagas sangat menonjol di bidang olahraga dan memiliki semangat kerja sama tim yang luar biasa. Sangat aktif bergerak dan bugar.",
    grades: [
      { subject: "Pendidikan Agama dan Budi Pekerti", code: "PAIBP", score: 87 },
      { subject: "Pendidikan Pancasila", code: "PP", score: 85 },
      { subject: "Bahasa Indonesia", code: "IND", score: 84 },
      { subject: "Matematika", code: "MAT", score: 80 },
      { subject: "Ilmu Pengetahuan Alam dan Sosial (IPAS)", code: "IPAS", score: 82 },
      { subject: "Seni dan Budaya (Seni Musik/Seni Rupa)", code: "SB", score: 86 },
      { subject: "Pendidikan Jasmani, Olahraga, dan Kesehatan", code: "PJOK", score: 98 },
      { subject: "Bahasa Jawa (Mulok)", code: "JW", score: 83 },
      { subject: "Bahasa Inggris", code: "ENG", score: 81 }
    ]
  },
  {
    nisn: "0141940562",
    nis: "1237/2020",
    name: "CHELSEA AYU LESTARI",
    birthPlaceDate: "Pasuruan, 21 Mei 2014",
    status: "LULUS DENGAN PUJIAN",
    serialNumber: "421.2/092/SD-43/2026",
    achievements: [
      "Juara Harapan 1 Lomba Menggambar Kaligrafi Kabupaten Pasuruan",
      "Anggota Pramuka Siaga Aktif"
    ],
    notes: "Chelsea unggul dalam kreasi seni visual dan keterampilan kerajinan tangan. Pembawaannya tenang dan penuh empati kepada sesama teman.",
    grades: [
      { subject: "Pendidikan Agama dan Budi Pekerti", code: "PAIBP", score: 94 },
      { subject: "Pendidikan Pancasila", code: "PP", score: 91 },
      { subject: "Bahasa Indonesia", code: "IND", score: 92 },
      { subject: "Matematika", code: "MAT", score: 88 },
      { subject: "Ilmu Pengetahuan Alam dan Sosial (IPAS)", code: "IPAS", score: 90 },
      { subject: "Seni dan Budaya (Seni Musik/Seni Rupa)", code: "SB", score: 96 },
      { subject: "Pendidikan Jasmani, Olahraga, dan Kesehatan", code: "PJOK", score: 89 },
      { subject: "Bahasa Jawa (Mulok)", code: "JW", score: 92 },
      { subject: "Bahasa Inggris", code: "ENG", score: 91 }
    ]
  },
  {
    nisn: "0138291040",
    nis: "1238/2020",
    name: "FAHRI RAMADHAN",
    birthPlaceDate: "Gresik, 10 Juli 2013",
    status: "LULUS",
    serialNumber: "421.2/093/SD-43/2026",
    achievements: [
      "Peringkat 2 Kelas 6 SDN Gajahbendo Semester Genap",
      "Juara 3 Lomba Adzan Se-Kecamatan Beji"
    ],
    notes: "Fahri adalah anak yang rajin, agamis, dan berbakti kepada orang tua. Suaranya yang merdu berkontribusi aktif dalam kegiatan ibadah sekolah.",
    grades: [
      { subject: "Pendidikan Agama dan Budi Pekerti", code: "PAIBP", score: 96 },
      { subject: "Pendidikan Pancasila", code: "PP", score: 88 },
      { subject: "Bahasa Indonesia", code: "IND", score: 87 },
      { subject: "Matematika", code: "MAT", score: 90 },
      { subject: "Ilmu Pengetahuan Alam dan Sosial (IPAS)", code: "IPAS", score: 89 },
      { subject: "Seni dan Budaya (Seni Musik/Seni Rupa)", code: "SB", score: 84 },
      { subject: "Pendidikan Jasmani, Olahraga, dan Kesehatan", code: "PJOK", score: 86 },
      { subject: "Bahasa Jawa (Mulok)", code: "JW", score: 87 },
      { subject: "Bahasa Inggris", code: "ENG", score: 85 }
    ]
  },
  {
    nisn: "0147920194",
    nis: "1239/2020",
    name: "GILANG RAMADHAN",
    birthPlaceDate: "Pasuruan, 27 Oktober 2013",
    status: "LULUS",
    serialNumber: "421.2/094/SD-43/2026",
    achievements: [
      "Anggota Tim Kasti SDN Gajahbendo",
      "Juara Kelompok Lomba Berbaris Pramuka"
    ],
    notes: "Gilang sangat ramah, mandiri, dan sigap mengulurkan bantuan. Sangat mahir bersosialisasi dan berteman.",
    grades: [
      { subject: "Pendidikan Agama dan Budi Pekerti", code: "PAIBP", score: 88 },
      { subject: "Pendidikan Pancasila", code: "PP", score: 84 },
      { subject: "Bahasa Indonesia", code: "IND", score: 86 },
      { subject: "Matematika", code: "MAT", score: 82 },
      { subject: "Ilmu Pengetahuan Alam dan Sosial (IPAS)", code: "IPAS", score: 85 },
      { subject: "Seni dan Budaya (Seni Musik/Seni Rupa)", code: "SB", score: 83 },
      { subject: "Pendidikan Jasmani, Olahraga, dan Kesehatan", code: "PJOK", score: 92 },
      { subject: "Bahasa Jawa (Mulok)", code: "JW", score: 82 },
      { subject: "Bahasa Inggris", code: "ENG", score: 80 }
    ]
  }
];

export function findStudentByNisn(nisn: string): Student | undefined {
  return STUDENTS_DB.find((student) => student.nisn === nisn.trim());
}

export function calculateAverage(grades: SubjectGrade[]): number {
  if (grades.length === 0) return 0;
  const sum = grades.reduce((acc, grade) => acc + grade.score, 0);
  return parseFloat((sum / grades.length).toFixed(2));
}

export function getPredikatLabel(avg: number): string {
  if (avg >= 92) return "Sangat Memuaskan (Dengan Pujian)";
  if (avg >= 80) return "Sangat Baik";
  if (avg >= 70) return "Baik";
  return "Cukup";
}

export function getAutomaticTeacherNote(avg: number, name: string): string {
  const formattedName = name ? name.toUpperCase() : "Siswa";
  
  if (avg >= 92) {
    const options = [
      `${formattedName} menunjukkan prestasi akademis yang sangat luar biasa dan konsisten di semua mata pelajaran. Memiliki integritas tinggi, kedisiplinan yang patut dicontoh, serta selalu bersemangat membantu teman-temannya. Terus pertahankan prestasimu di jenjang SMP/MTs!`,
      `Sangat menonjol dalam seluruh aspek akademis dan pembentukan karakter. ${formattedName} selalu fokus, tekun belajar, berperilaku sangat sopan, dan berdedikasi tinggi dalam menyelesaikan setiap kegiatan sekolah. Selamat atas capaian gemilang ini!`,
      `${formattedName} memiliki bakat istimewa dan semangat belajar yang luar biasa. Selalu aktif, kreatif, dan mandiri dalam proses pembelajaran dengan budi pepeti yang sangat agung. Pertahankan kesuksesan ini di sekolah lanjutan nanti!`
    ];
    return options[Math.floor(formattedName.length % options.length)];
  } else if (avg >= 80) {
    const options = [
      `${formattedName} menunjukkan perkembangan karakter yang sangat positif dan hasil belajar yang memuaskan. Aktif berpartisipasi di kelas, tekun menyelesaikan seluruh tugas, serta bersikap ramah kepada guru dan teman. Teruslah bersemangat!`,
      `Menunjukkan kemampuan akademis yang sangat baik, rajin, dan santun dalam kehidupan sehari-hari di sekolah. ${formattedName} mampu bekerja sama dengan baik bersama kelompok diskusi. Pertahankan semangat belajar yang tinggi ini!`,
      `Siswa yang tanggap, sopan, dan memiliki potensi besar. Prestasi belajar ${formattedName} sudah sangat baik, diiringi rasa tanggung jawab yang tinggi terhadap setiap tata tertib sekolah. Semoga sukses di jenjang berikutnya.`
    ];
    return options[Math.floor(formattedName.length % options.length)];
  } else if (avg >= 70) {
    const options = [
      `${formattedName} telah menyelesaikan seluruh proses pembelajaran dengan capaian yang baik dan stabil. Berperilaku sopan dan rajin melaksanakan piket kelas. Tingkatkan terus fokus belajar dan konsentrasi di tingkat SMP/MTs.`,
      `Siswa yang selalu ramah dan menunjukkan perkembangan minat belajar yang baik. ${formattedName} cermat menyimak arahan bimbingan guru. Dengan menambah porsi belajar mandiri, prestasimu akan jauh lebih gemilang di masa depan.`,
      `${formattedName} aktif dalam pembelajaran dan selalu menunjukkan sikap kerja sama yang positif. Hasil belajar yang diperoleh sudah cukup baik. Cobalah untuk lebih fokus pada pembelajaran bidang eksakta di masa depan.`
    ];
    return options[Math.floor(formattedName.length % options.length)];
  } else {
    return `${formattedName} telah menyelesaikan seluruh program sekolah dengan kelakuan yang baik. Diharapkan agar lebih giat berlatih, disiplin mengatur waktu belajar, dan memperbanyak membaca buku di tingkat pendidikan berikutnya.`;
  }
}

