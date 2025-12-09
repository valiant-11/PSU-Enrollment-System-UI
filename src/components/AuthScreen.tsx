import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { GraduationCap, Mail } from "lucide-react";
import { toast } from "sonner";
import { RegistrationForm } from "./RegistrationForm";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp";
import { supabase } from "../supabase";

interface AuthPageProps {
  onLogin: (student: any) => void;
}

export function AuthPage({ onLogin }: AuthPageProps) {
  const [loginStep, setLoginStep] = useState<"email" | "otp">("email");
  const [loginEmail, setLoginEmail] = useState("");

  const [generatedOTP, setGeneratedOTP] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  // STEP 1 → Send OTP
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Verify if student exists
    const { data: student, error } = await supabase
      .from("students")
      .select("*")
      .eq("corp_email", loginEmail)
      .single();

    if (!student) {
      toast.error("Account not found", {
        description: "No account is registered with this email.",
      });
      setLoading(false);
      return;
    }

    // Generate OTP
    const newOTP = generateOTP();
    setGeneratedOTP(newOTP);
    setLoginStep("otp");

    toast.success("OTP sent!", {
      description: `Verification code sent to ${loginEmail}. (Demo OTP: ${newOTP})`,
      duration: 10000,
    });

    setLoading(false);
  };

  // STEP 2 → Verify OTP
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    if (otp !== generatedOTP) {
      toast.error("Invalid OTP", {
        description: "The code you entered is incorrect.",
      });
      return;
    }

    // Fetch latest student data
    const { data: student } = await supabase
      .from("students")
      .select("*")
      .eq("corp_email", loginEmail)
      .single();

    toast.success("Login successful!", {
      description: `Welcome, ${student.full_name}!`,
    });

    onLogin(student);
  };

  const handleBackToEmail = () => {
    setLoginStep("email");
    setOtp("");
    setGeneratedOTP("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-background via-background to-secondary/30">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        
        {/* BRANDING */}
        <div className="text-center lg:text-left space-y-6">
          <div className="inline-flex items-center gap-4 mb-6">
            <div className="h-20 w-20 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
              <GraduationCap className="h-12 w-12 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-primary">Palawan State University</h1>
              <p className="text-muted-foreground">Student Portal</p>
            </div>
          </div>

          <div className="space-y-4">
            <h2>Welcome to PSU Enrollment System</h2>
            <p className="text-muted-foreground max-w-md">
              Access your academic records, enroll in subjects, manage payments, and view your class schedules.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-md">
            <Card className="p-4 border-2">
              <p className="text-2xl text-primary mb-1">24/7</p>
              <p className="text-sm text-muted-foreground">Access Anytime</p>
            </Card>
            <Card className="p-4 border-2">
              <p className="text-2xl text-primary mb-1">100%</p>
              <p className="text-sm text-muted-foreground">Secure Platform</p>
            </Card>
          </div>
        </div>

        {/* AUTH SIDE */}
        <Card className="p-8 shadow-2xl border-2">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            {/* LOGIN TAB */}
            <TabsContent value="login">
              {loginStep === "email" ? (
                // STEP 1 — Enter email
                <form onSubmit={handleSendOTP} className="space-y-6">
                  <div className="text-center mb-6">
                    <h3>Student Login</h3>
                    <p className="text-sm text-muted-foreground">
                      Enter your PSU corporate email
                    </p>
                  </div>

                  {/* EMAIL */}
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="email"
                        placeholder="202380378@psu.palawan.edu.ph"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <Button type="submit" size="lg" className="w-full" disabled={loading}>
                    {loading ? "Sending..." : "Send OTP"}
                  </Button>
                </form>
              ) : (
                // STEP 2 — Enter OTP
                <form onSubmit={handleVerifyOTP} className="space-y-6">
                  <div className="text-center mb-6">
                    <h3>Verify OTP</h3>
                    <p className="text-sm text-muted-foreground">
                      Enter the 6-digit code sent to {loginEmail}
                    </p>
                  </div>

                  {/* OTP */}
                  <div className="space-y-2">
                    <Label>One-Time Password</Label>
                    <div className="flex justify-center">
                      <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                  </div>

                  <Button type="submit" size="lg" className="w-full">
                    Verify & Login
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={handleBackToEmail}
                  >
                    Back to Email
                  </Button>
                </form>
              )}
            </TabsContent>

            {/* REGISTER TAB */}
            <TabsContent value="register">
              <RegistrationForm onRegister={(student) => onLogin(student)} />
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
