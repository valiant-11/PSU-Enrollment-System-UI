import { useState, useEffect } from "react";
import { Toaster } from "./components/ui/sonner";
import { AuthScreen } from "./components/AuthScreen";
import { MainApp } from "./components/MainApp";

export interface Student {
  studentNumber: string;
  corpEmail: string;
  fullName: string;
  birthdate: string;
  sex: string;
  address: string;
  email: string;
  phone: string;
  course: string;
  yearLevel: string;
  lastSchool: string;
  strand: string;
  yearGraduated: string;
  documents: {
    birthCertificate?: File;
    form137?: File;
    goodMoral?: File;
  };
  enrolledSubjects: string[];
  payments: Array<{
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
  createdAt: string;
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [students, setStudents] = useState<Student[]>([]);

  // Load students from localStorage
  useEffect(() => {
    const storedStudents = localStorage.getItem("psu_students");
    if (storedStudents) {
      setStudents(JSON.parse(storedStudents));
    }

    const storedAuth = localStorage.getItem("psu_current_student");
    if (storedAuth) {
      const student = JSON.parse(storedAuth);
      setCurrentStudent(student);
      setIsAuthenticated(true);
    }
  }, []);

  // Save students to localStorage
  useEffect(() => {
    if (students.length > 0) {
      localStorage.setItem("psu_students", JSON.stringify(students));
    }
  }, [students]);

  const handleLogin = (student: Student) => {
    setCurrentStudent(student);
    setIsAuthenticated(true);
    localStorage.setItem("psu_current_student", JSON.stringify(student));
  };

  const handleRegister = (newStudent: Student) => {
    const updatedStudents = [...students, newStudent];
    setStudents(updatedStudents);
    setCurrentStudent(newStudent);
    setIsAuthenticated(true);
    localStorage.setItem("psu_current_student", JSON.stringify(newStudent));
  };

  const handleLogout = () => {
    setCurrentStudent(null);
    setIsAuthenticated(false);
    localStorage.removeItem("psu_current_student");
  };

  const updateStudent = (updatedStudent: Student) => {
    const updatedStudents = students.map(s => 
      s.studentNumber === updatedStudent.studentNumber ? updatedStudent : s
    );
    setStudents(updatedStudents);
    setCurrentStudent(updatedStudent);
    localStorage.setItem("psu_current_student", JSON.stringify(updatedStudent));
  };

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