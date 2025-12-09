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
  const [birthdate, setBirthdate] = useState("");
  const [course, setCourse] = useState("");
  const [yearLevel, setYearLevel] = useState("");
  const [sex, setSex] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [personalEmail, setPersonalEmail] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const corpEmail = `${studentNumber}@psu.palawan.edu.ph`.toLowerCase();

    // 1. Check if student number or email already exists
    const { data: existing } = await supabase
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

    // 2. Insert new student - use correct column names
    const { data, error } = await supabase
      .from("students")
      .insert([
        {
          student_number: studentNumber,
          corp_email: corpEmail,
          full_name: fullName,
          birthdate: birthdate,
          sex: sex || "Not specified",
          address: address || "",
          personal_email: personalEmail || "",
          phone: phone || "",
          year_level: yearLevel,
          enrollment_status: "active",
        },
      ])
      .select()
      .single();

    if (error) {
      toast.error("Registration failed", {
        description: error.message,
      });
      console.error("Registration error:", error);
      setLoading(false);
      return;
    }

    toast.success("Registration successful!", {
      description: "Your student account has been created.",
    });

    setLoading(false);
    onRegister(data);
  };

  return (
    <form onSubmit={handleRegister} className="space-y-4">
      <div className="space-y-3">
        {/* Student Number */}
        <div>
          <Label className="text-sm">Student Number *</Label>
          <Input
            type="text"
            placeholder="202380378"
            value={studentNumber}
            onChange={(e) => setStudentNumber(e.target.value)}
            required
          />
          <p className="text-xs text-muted-foreground mt-1">
            Your PSU email will be auto-generated.
          </p>
        </div>

        {/* Full Name */}
        <div>
          <Label className="text-sm">Full Name *</Label>
          <Input
            type="text"
            placeholder="Juan Dela Cruz"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>

        {/* Birthdate */}
        <div>
          <Label className="text-sm">Birthdate *</Label>
          <Input
            type="date"
            value={birthdate}
            onChange={(e) => setBirthdate(e.target.value)}
            required
          />
        </div>

        {/* Sex */}
        <div>
          <Label className="text-sm">Sex</Label>
          <select
            value={sex}
            onChange={(e) => setSex(e.target.value)}
            className="w-full px-3 py-2 border rounded-md text-sm"
          >
            <option value="">Select sex</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Address */}
        <div>
          <Label className="text-sm">Address</Label>
          <Input
            type="text"
            placeholder="123 Main Street"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        {/* Personal Email */}
        <div>
          <Label className="text-sm">Personal Email</Label>
          <Input
            type="email"
            placeholder="juan@email.com"
            value={personalEmail}
            onChange={(e) => setPersonalEmail(e.target.value)}
          />
        </div>

        {/* Phone */}
        <div>
          <Label className="text-sm">Phone</Label>
          <Input
            type="tel"
            placeholder="09123456789"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        {/* Year Level */}
        <div>
          <Label className="text-sm">Year Level *</Label>
          <Input
            type="text"
            placeholder="1st Year / 2nd Year / etc."
            value={yearLevel}
            onChange={(e) => setYearLevel(e.target.value)}
            required
          />
        </div>
      </div>

      <Button
        type="submit"
        className="w-full"
        size="lg"
        disabled={loading}
      >
        {loading ? "Registering..." : "Register"}
      </Button>
    </form>
  );
}
