import { useState } from "react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { FileUpload } from "./FileUpload";
import { Progress } from "./ui/progress";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { CalendarIcon, User } from "lucide-react";
import { toast } from "sonner@2.0.3";

export function StudentRegistration() {
  const [progress, setProgress] = useState(0);
  const [studentId, setStudentId] = useState("");
  const [date, setDate] = useState<Date>();

  const generateStudentId = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(100000 + Math.random() * 900000);
    return `PSU-${year}-${random}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = generateStudentId();
    setStudentId(newId);
    setProgress(100);
    toast.success("Registration submitted successfully!", {
      description: `Your Student ID: ${newId}`,
    });
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return "";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <User className="h-8 w-8 text-primary" />
            <h1>Student Registration</h1>
          </div>
          <p className="text-muted-foreground">Palawan State University</p>
        </div>

        {progress > 0 && (
          <div className="mb-6">
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2 text-center">
              {progress}% Complete
            </p>
          </div>
        )}

        {studentId && (
          <Card className="p-6 mb-6 bg-primary/5 border-primary/20">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Your Student ID</p>
              <p className="text-primary">{studentId}</p>
            </div>
          </Card>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="p-6 shadow-sm">
            <h3 className="mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="fullname">Full Name</Label>
                <Input id="fullname" placeholder="Juan Dela Cruz" required />
              </div>

              <div className="space-y-2">
                <Label>Birthdate</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start bg-input-background"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? formatDate(date) : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sex">Sex</Label>
                <Select>
                  <SelectTrigger id="sex" className="bg-input-background">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" placeholder="Street, Barangay, City, Province" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="student@psu.edu.ph" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" placeholder="+63 912 345 6789" required />
              </div>
            </div>
          </Card>

          <Card className="p-6 shadow-sm">
            <h3 className="mb-4">Academic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="lastschool">Last School Attended</Label>
                <Input id="lastschool" placeholder="School Name" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="strand">Strand</Label>
                <Select>
                  <SelectTrigger id="strand" className="bg-input-background">
                    <SelectValue placeholder="Select strand" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="stem">STEM</SelectItem>
                    <SelectItem value="abm">ABM</SelectItem>
                    <SelectItem value="humss">HUMSS</SelectItem>
                    <SelectItem value="gas">GAS</SelectItem>
                    <SelectItem value="tvl">TVL</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="yeargrad">Year Graduated</Label>
                <Input id="yeargrad" type="number" placeholder="2024" required />
              </div>
            </div>
          </Card>

          <Card className="p-6 shadow-sm">
            <h3 className="mb-4">Required Documents</h3>
            <div className="space-y-4">
              <FileUpload label="Birth Certificate" />
              <FileUpload label="Form 137 (Report Card)" />
              <FileUpload label="Good Moral Certificate" />
            </div>
          </Card>

          <Button type="submit" className="w-full" size="lg">
            Submit Registration
          </Button>
        </form>
      </div>
    </div>
  );
}
