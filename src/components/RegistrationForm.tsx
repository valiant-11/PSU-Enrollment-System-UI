import { useState } from "react";
import { supabase } from "../supabase";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { toast } from "sonner";

interface RegistrationFormProps {
  onRegister: (student: any) => void;
}

export function RegistrationForm({ onRegister }: RegistrationFormProps) {
  const [loading, setLoading] = useState(false);

  const [studentNumber, setStudentNumber] = useState("");
  const [fullName, setFullName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [course, setCourse] = useState("");
  const [yearLevel, setYearLevel] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const corpEmail = `${studentNumber}@psu.palawan.edu.ph`.toLowerCase();

    // 1. Check if student number or email already exists
    const { data: existing, error: existingError } = await supabase
      .from("students")
      .select("*")
      .or(`student_number.eq.${studentNumber},corp_email.eq.${corpEmail}`);

    if (existing && existing.length > 0) {
      toast.error("Account already exists", {
        description: "Student number or corporate email is already registered.",
      });
      setLoading(false);
      return;
    }

    // 2. Insert new student
    const { data, error } = await supabase
      .from("students")
      .insert([
        {
          student_number: studentNumber,
          corp_email: corpEmail,
          full_name: fullName,
          birthdate: birthday,
          course_id: course,
          year_level: yearLevel,
        },
      ])
      .select()
      .single();

    if (error) {
      toast.error("Registration failed", {
        description: error.message,
      });
      setLoading(false);
      return;
    }

    toast.success("Registration successful!", {
      description: "Your student account has been created.",
    });

    setLoading(false);
    onRegister(data); // send student data back to App
  };

  return (
    <form onSubmit={handleRegister} className="space-y-6">
      <Card className="p-6 border-2 shadow-md">
        <h3 className="text-xl font-semibold mb-4">Student Registration</h3>

        {/* Student Number */}
        <div className="space-y-2">
          <Label>Student Number</Label>
          <Input
            type="text"
            placeholder="202380378"
            value={studentNumber}
            onChange={(e) => setStudentNumber(e.target.value)}
            required
          />
          <p className="text-xs text-muted-foreground">
            Your PSU email will be generated automatically.
          </p>
        </div>

        {/* Full Name */}
        <div className="space-y-2">
          <Label>Full Name</Label>
          <Input
            type="text"
            placeholder="Juan Dela Cruz"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>

        {/* Birthday */}
        <div className="space-y-2">
          <Label>Birthday</Label>
          <Input
            type="date"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
            required
          />
        </div>

        {/* Course */}
        <div className="space-y-2">
          <Label>Course</Label>
          <Input
            type="text"
            placeholder="BSIT / BSCS / BSHM / etc."
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            required
          />
        </div>

        {/* Year Level */}
        <div className="space-y-2">
          <Label>Year Level</Label>
          <Input
            type="text"
            placeholder="1st Year / 2nd Year / etc."
            value={yearLevel}
            onChange={(e) => setYearLevel(e.target.value)}
            required
          />
        </div>

        <Button
          type="submit"
          className="w-full mt-4"
          size="lg"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </Button>
      </Card>
    </form>
  );
}
