import { useState } from "react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Card } from "./ui/card";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "./ui/dropdown-menu";
import { 
  GraduationCap, 
  User, 
  BookOpen, 
  CreditCard, 
  Calendar,
  LogOut,
  Menu,
  X,
  RefreshCw,
  Award,
  CheckCircle
} from "lucide-react";
import { Student } from "../App";
import { ProfileScreen } from "./ProfileScreen";
import { EnrollmentPortal } from "./EnrollmentPortal";
import { PaymentPortal } from "./PaymentPortal";
import { SchedulePortal } from "./SchedulePortal";
import { CourseShifting } from "./CourseShifting";
import { GradeViewer } from "./GradeViewer";

interface MainAppProps {
  student: Student;
  onLogout: () => void;
  onUpdateStudent: (student: Student) => void;
}

export function MainApp({ student, onLogout, onUpdateStudent }: MainAppProps) {
  const [activeScreen, setActiveScreen] = useState<"profile" | "enrollment" | "payment" | "schedule" | "course-shifting" | "grades" | "dashboard">("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const menuItems = [
    { id: "dashboard" as const, label: "Dashboard", icon: User },
    { id: "profile" as const, label: "My Profile", icon: User },
    { id: "enrollment" as const, label: "Enrollment", icon: BookOpen },
    { id: "grades" as const, label: "Grades", icon: Award },
    { id: "payment" as const, label: "Payments", icon: CreditCard },
    { id: "schedule" as const, label: "Schedule", icon: Calendar },
    { id: "course-shifting" as const, label: "Course Shifting", icon: RefreshCw },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-card/95">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center shadow-sm">
                <GraduationCap className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="hidden sm:block">
                <h3 className="text-primary font-semibold">PSU Student Portal</h3>
                <p className="text-xs text-muted-foreground">Palawan State University</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Desktop Menu */}
              <nav className="hidden lg:flex items-center gap-2">
                {menuItems.map((item) => (
                  <Button
                    key={item.id}
                    variant={activeScreen === item.id ? "default" : "ghost"}
                    onClick={() => setActiveScreen(item.id)}
                    className="gap-2"
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                ))}
              </nav>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2 px-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {getInitials(student.fullName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden md:block text-left">
                      <p className="text-sm leading-none mb-1 font-medium">{student.fullName}</p>
                      <p className="text-xs text-muted-foreground">{student.studentNumber}</p>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-2">
                    <p className="text-sm font-medium">{student.fullName}</p>
                    <p className="text-xs text-muted-foreground">{student.corpEmail}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setActiveScreen("profile")}>
                    <User className="mr-2 h-4 w-4" />
                    My Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onLogout} className="text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="lg:hidden mt-4 pt-4 border-t border-border space-y-1">
              {menuItems.map((item) => (
                <Button
                  key={item.id}
                  variant={activeScreen === item.id ? "default" : "ghost"}
                  onClick={() => {
                    setActiveScreen(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full justify-start gap-2"
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Button>
              ))}
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {activeScreen === "dashboard" && (
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Welcome Section */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">Welcome, {student.fullName}! 👋</h1>
              <p className="text-muted-foreground">Manage your academic journey at Palawan State University</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-6 space-y-2">
                <p className="text-sm text-muted-foreground">Student Number</p>
                <p className="text-2xl font-bold text-primary">{student.studentNumber}</p>
              </Card>
              <Card className="p-6 space-y-2">
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="text-lg font-semibold break-all">{student.corpEmail}</p>
              </Card>
              <Card className="p-6 space-y-2">
                <p className="text-sm text-muted-foreground">Year Level</p>
                <p className="text-2xl font-bold text-primary">{student.yearLevel}</p>
              </Card>
              <Card className="p-6 space-y-2">
                <p className="text-sm text-muted-foreground">Status</p>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <p className="text-lg font-semibold">Active</p>
                </div>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="p-6 space-y-4">
              <h2 className="text-xl font-bold">Quick Actions</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <Button 
                  variant="outline" 
                  className="flex flex-col items-center gap-2 h-auto py-4"
                  onClick={() => setActiveScreen("enrollment")}
                >
                  <BookOpen className="h-5 w-5" />
                  <span className="text-xs text-center">Enroll</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="flex flex-col items-center gap-2 h-auto py-4"
                  onClick={() => setActiveScreen("grades")}
                >
                  <Award className="h-5 w-5" />
                  <span className="text-xs text-center">Grades</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="flex flex-col items-center gap-2 h-auto py-4"
                  onClick={() => setActiveScreen("schedule")}
                >
                  <Calendar className="h-5 w-5" />
                  <span className="text-xs text-center">Schedule</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="flex flex-col items-center gap-2 h-auto py-4"
                  onClick={() => setActiveScreen("payment")}
                >
                  <CreditCard className="h-5 w-5" />
                  <span className="text-xs text-center">Payment</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="flex flex-col items-center gap-2 h-auto py-4"
                  onClick={() => setActiveScreen("course-shifting")}
                >
                  <RefreshCw className="h-5 w-5" />
                  <span className="text-xs text-center">Shifting</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="flex flex-col items-center gap-2 h-auto py-4"
                  onClick={() => setActiveScreen("profile")}
                >
                  <User className="h-5 w-5" />
                  <span className="text-xs text-center">Profile</span>
                </Button>
              </div>
            </Card>

            {/* Information Card */}
            <Card className="p-6 bg-primary/5 border-primary/20">
              <h3 className="font-semibold text-primary mb-2">📌 Getting Started</h3>
              <p className="text-sm text-muted-foreground">
                Use the menu above or quick actions to navigate through the portal. 
                You can enroll in subjects, view your grades, check your schedule, manage payments, and request course shifting.
              </p>
            </Card>
          </div>
        )}
        {activeScreen === "profile" && (
          <ProfileScreen student={student} onUpdateStudent={onUpdateStudent} />
        )}
        {activeScreen === "enrollment" && (
          <EnrollmentPortal student={student} onUpdateStudent={onUpdateStudent} />
        )}
        {activeScreen === "grades" && (
          <GradeViewer student={student} />
        )}
        {activeScreen === "payment" && (
          <PaymentPortal student={student} onUpdateStudent={onUpdateStudent} />
        )}
        {activeScreen === "schedule" && (
          <SchedulePortal student={student} />
        )}
        {activeScreen === "course-shifting" && (
          <CourseShifting student={student} onUpdateStudent={onUpdateStudent} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border px-6 py-4 mt-auto">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs text-muted-foreground text-center">
            © 2024 Palawan State University. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
