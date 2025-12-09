import { useState, useEffect } from "react";
import { Toaster } from "./components/ui/sonner";
import { AuthScreen } from "./components/AuthScreen";
import { MainApp } from "./components/MainApp";
import { getStudentUser, getStudentProfile } from "./lib/studentDb";

export interface Student {
  // From Supabase users table
  id?: string;
  email: string;
  fullName: string;
  role?: string;

  // From Supabase students table
  studentNumber: string;
  corpEmail: string;
  birthdate: string;
  sex: string;
  address: string;
  phone: string;
  course: string;
  courseId?: string;
  yearLevel: string;
  lastSchool: string;
  strand: string;
  yearGraduated: string;
  enrollmentStatus?: string;

  // UI-specific fields
  documents?: {
    birthCertificate?: File;
    form137?: File;
    goodMoral?: File;
  };
  enrolledSubjects?: string[];
  payments?: Array<{
    date: string;
    amount: number;
    description: string;
  }>;
  shiftingRequest?: {
    fromCourse: string;
    toCourse: string;
    reason: string;
    status: "pending" | "approved" | "rejected";
    requestedAt: string;
  };
  createdAt?: string;
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<Student[]>([]);

  // Load student from session on app start
  useEffect(() => {
    const loadStudentSession = async () => {
      try {
        // Try loading from Supabase
        const storedEmail = localStorage.getItem("psu_student_email");
        const storedUserId = localStorage.getItem("psu_student_user_id");

        if (storedEmail && storedUserId) {
          // Fetch student profile from Supabase
          const { data: studentData, error } = await getStudentProfile(storedUserId);

          if (studentData && !error) {
            const student: Student = {
              id: studentData.id,
              email: storedEmail,
              fullName: studentData.full_name,
              studentNumber: studentData.student_number,
              corpEmail: studentData.corp_email,
              birthdate: studentData.birthdate || "",
              sex: studentData.sex || "",
              address: studentData.address || "",
              phone: studentData.phone || "",
              course: studentData.courses?.course_name || "",
              courseId: studentData.course_id,
              yearLevel: studentData.year_level || "",
              lastSchool: studentData.last_school || "",
              strand: studentData.strand || "",
              yearGraduated: studentData.year_graduated || "",
              enrollmentStatus: studentData.enrollment_status || "active"
            };

            setCurrentStudent(student);
            setIsAuthenticated(true);
          }
        } else {
          // Fallback to localStorage (for development)
          const storedAuth = localStorage.getItem("psu_current_student");
          if (storedAuth) {
            const student = JSON.parse(storedAuth);
            setCurrentStudent(student);
            setIsAuthenticated(true);
          }
        }
      } catch (error) {
        console.error("Error loading student session:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStudentSession();
  }, []);

  // Save students to localStorage (development fallback)
  useEffect(() => {
    if (students.length > 0) {
      localStorage.setItem("psu_students", JSON.stringify(students));
    }
  }, [students]);

  const handleLogin = (student: Student) => {
    setCurrentStudent(student);
    setIsAuthenticated(true);

    // Save to Supabase session
    if (student.id) {
      localStorage.setItem("psu_student_email", student.email);
      localStorage.setItem("psu_student_user_id", student.id);
    }

    // Also save to localStorage for fallback
    localStorage.setItem("psu_current_student", JSON.stringify(student));
  };

  const handleRegister = (newStudent: Student) => {
    const updatedStudents = [...students, newStudent];
    setStudents(updatedStudents);
    setCurrentStudent(newStudent);
    setIsAuthenticated(true);

    // Save to localStorage
    localStorage.setItem("psu_current_student", JSON.stringify(newStudent));

    // If Supabase IDs available, save them too
    if (newStudent.id) {
      localStorage.setItem("psu_student_email", newStudent.email);
      localStorage.setItem("psu_student_user_id", newStudent.id);
    }
  };

  const handleLogout = () => {
    setCurrentStudent(null);
    setIsAuthenticated(false);
    localStorage.removeItem("psu_current_student");
    localStorage.removeItem("psu_student_email");
    localStorage.removeItem("psu_student_user_id");
  };

  const updateStudent = (updatedStudent: Student) => {
    const updatedStudents = students.map((s) =>
      s.studentNumber === updatedStudent.studentNumber ? updatedStudent : s
    );
    setStudents(updatedStudents);
    setCurrentStudent(updatedStudent);
    localStorage.setItem("psu_current_student", JSON.stringify(updatedStudent));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          <p className="mt-4 text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Toaster position="top-right" />

      {!isAuthenticated ? (
        <AuthScreen
          onLogin={handleLogin}
          onRegister={handleRegister}
          students={students}
        />
      ) : (
        <MainApp
          student={currentStudent!}
          onLogout={handleLogout}
          onUpdateStudent={updateStudent}
        />
      )}
    </div>
  );
}
