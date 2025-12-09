import { Users, UserCheck, DollarSign, BookOpen, Home, GraduationCap, Calendar, FileText } from "lucide-react";
import { StatsCard } from "./StatsCard";
import { Card } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";

export function AdminDashboard() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-card border-r border-border p-6">
        <div className="mb-8">
          <h2 className="text-primary">Palawan State University</h2>
          <p className="text-xs text-muted-foreground mt-1">Admin Portal</p>
        </div>
        
        <nav className="space-y-1">
          {[
            { icon: Home, label: "Home", active: true },
            { icon: Users, label: "Students" },
            { icon: BookOpen, label: "Subjects" },
            { icon: GraduationCap, label: "Curriculum" },
            { icon: UserCheck, label: "Enrollment" },
            { icon: DollarSign, label: "Payments" },
            { icon: Calendar, label: "Scheduling" },
            { icon: FileText, label: "Reports" },
          ].map((item) => (
            <button
              key={item.label}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                item.active
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-secondary text-foreground"
              }`}
            >
              <item.icon className="h-4 w-4" />
              <span className="text-sm">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="mb-6">
          <h1>Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, Administrator</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Students"
            value="2,456"
            icon={Users}
            trend={{ value: "+12% from last month", isPositive: true }}
          />
          <StatsCard
            title="Enrolled Students"
            value="1,892"
            icon={UserCheck}
            trend={{ value: "+8% from last month", isPositive: true }}
          />
          <StatsCard
            title="Unpaid Balances"
            value="₱450,000"
            icon={DollarSign}
            trend={{ value: "-5% from last month", isPositive: true }}
          />
          <StatsCard
            title="Active Classes"
            value="156"
            icon={BookOpen}
            trend={{ value: "+3 new classes", isPositive: true }}
          />
        </div>

        {/* Quick Actions & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6 shadow-sm">
            <h3 className="mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Users className="mr-2 h-4 w-4" />
                Add New Student
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <BookOpen className="mr-2 h-4 w-4" />
                Create Subject
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Class
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" />
                Generate Report
              </Button>
            </div>
          </Card>

          <Card className="p-6 shadow-sm">
            <h3 className="mb-4">Recent Enrollments</h3>
            <div className="space-y-4">
              {[
                { name: "Maria Santos", id: "PSU-2024-123456", time: "2 hours ago" },
                { name: "Juan Reyes", id: "PSU-2024-123457", time: "4 hours ago" },
                { name: "Ana Garcia", id: "PSU-2024-123458", time: "6 hours ago" },
                { name: "Pedro Cruz", id: "PSU-2024-123459", time: "1 day ago" },
              ].map((student) => (
                <div key={student.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <p className="text-sm">{student.name}</p>
                    <p className="text-xs text-muted-foreground">{student.id}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">{student.time}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
