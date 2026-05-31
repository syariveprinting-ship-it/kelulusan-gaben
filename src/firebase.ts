import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously, signOut } from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  deleteDoc, 
  collection, 
  writeBatch,
  getDocFromServer
} from "firebase/firestore";
import firebaseConfig from "../firebase-applet-config.json";
import { Student, SchoolConfig } from "./types";

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId); /* CRITICAL: The app will break without this line */
export const auth = getAuth();

// Test connection strictly on initial boot
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, "test", "connection"));
  } catch (error) {
    if (error instanceof Error && error.message.includes("offline")) {
      console.error("Please check your Firebase configuration or internet connection.");
    }
  }
}

// Error Hanlder Utility per Guidelines
export enum OperationType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  LIST = "list",
  GET = "get",
  WRITE = "write",
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error("Firestore Error: ", JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Admin Auth Bridge
export async function loginAdminAnonymously(): Promise<boolean> {
  try {
    await signInAnonymously(auth);
    return true;
  } catch (error) {
    console.error("Auth login failed:", error);
    return false;
  }
}

export async function logoutAdmin(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Auth logout failed:", error);
  }
}

// FETCH Student records from Firestore
export async function fetchAllStudents(): Promise<Student[]> {
  const pathName = "students";
  try {
    const snapshot = await getDocs(collection(db, pathName));
    const list: Student[] = [];
    snapshot.forEach(docSnap => {
      list.push(docSnap.data() as Student);
    });
    return list;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, pathName);
    return [];
  }
}

// GET Single Student record by NISN
export async function fetchStudentByNisn(nisn: string): Promise<Student | null> {
  const cleanId = nisn.trim();
  const pathName = `students/${cleanId}`;
  try {
    const docSnap = await getDoc(doc(db, "students", cleanId));
    if (docSnap.exists()) {
      return docSnap.data() as Student;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, pathName);
    return null;
  }
}

// Set/Update single Student record
export async function saveStudentDoc(student: Student): Promise<void> {
  const cleanId = student.nisn.trim();
  const pathName = `students/${cleanId}`;
  try {
    await setDoc(doc(db, "students", cleanId), student);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, pathName);
  }
}

// Bulk Add/Overwrite Students in Batch
export async function bulkWriteStudents(students: Student[]): Promise<void> {
  const pathName = "students (batch)";
  try {
    const batch = writeBatch(db);
    students.forEach(student => {
      const cleanId = student.nisn.trim();
      const ref = doc(db, "students", cleanId);
      batch.set(ref, student);
    });
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, pathName);
  }
}

// Delete single Student
export async function deleteStudentDoc(nisn: string): Promise<void> {
  const cleanId = nisn.trim();
  const pathName = `students/${cleanId}`;
  try {
    await deleteDoc(doc(db, "students", cleanId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, pathName);
  }
}

// FETCH School Settings Config
export async function fetchSchoolConfig(fallback: SchoolConfig): Promise<SchoolConfig> {
  const pathName = "config/school";
  try {
    const docSnap = await getDoc(doc(db, "config", "school"));
    if (docSnap.exists()) {
      return docSnap.data() as SchoolConfig;
    } else {
      // Inception payload: store fallback in firestore on initial setup
      await setDoc(doc(db, "config", "school"), fallback);
      return fallback;
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, pathName);
    return fallback;
  }
}

// SAVE School Settings Config
export async function saveSchoolConfig(config: SchoolConfig): Promise<void> {
  const pathName = "config/school";
  try {
    await setDoc(doc(db, "config", "school"), config);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, pathName);
  }
}
