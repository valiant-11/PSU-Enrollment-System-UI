import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { User, Mail, Phone, MapPin, FileText, Edit2, Save, X } from "lucide-react";
import { toast } from "sonner@2.0.3";

export function StudentProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [email, setEmail] = useState("maria.santos@psu.edu.ph");
  const [phone, setPhone] = useState("+63 912 345 6789");

  const handleSave = () => {
    setIsEditing(false);
    toast.success("Profile updated successfully!");
  };

  const studentData = {
    id: "PSU-2024-123456",
    name: "Maria Santos",
    course: "Bachelor of Science in Computer Science",
    yearLevel: "2nd Year",
    status: "Enrolled",
    address: "123 Main St, Puerto Princesa, Palawan",
    birthdate: "January 15, 2004",
    sex: "Female",
  };

  const academicHistory = [
    { semester: "1st Semester 2024-2025", gpa: "1.75", units: 21, status: "Ongoing" },
    { semester: "2nd Semester 2023-2024", gpa: "1.50", units: 21, status: "Completed" },
    { semester: "1st Semester 2023-2024", gpa: "1.65", units: 18, status: "Completed" },
  ];

  const documents = [
    { name: "Birth Certificate", uploaded: true },
    { name: "Form 137", uploaded: true },
    { name: "Good Moral Certificate", uploaded: true },
    { name: "Medical Certificate", uploaded: false },
  ];

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h1>Student Profile</h1>
          <p className="text-muted-foreground">View and manage student information</p>
        </div>

        {/* Header Card */}
        <Card className="p-6 mb-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-10 w-10 text-primary" />
              </div>
              <div>
                <h2>{studentData.name}</h2>
                <p className="text-muted-foreground mb-2">{studentData.id}</p>
                <div className="flex gap-2">
                  <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                    {studentData.yearLevel}
                  </Badge>
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-200">
                    {studentData.status}
                  </Badge>
                </div>
              </div>
            </div>
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)} variant="outline">
                <Edit2 className="h-4 w-4 mr-2" />
                Edit Contact
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button onClick={handleSave} size="sm">
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button onClick={() => setIsEditing(false)} variant="outline" size="sm">
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Personal Information */}
          <Card className="p-6 shadow-sm lg:col-span-2">
            <h3 className="mb-4">Personal Information</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Birthdate</p>
                  <p className="text-sm">{studentData.birthdate}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Sex</p>
                  <p className="text-sm">{studentData.sex}</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground mb-1">Address</p>
                  <p className="text-sm">{studentData.address}</p>
                </div>
              </div>

              <Separator />

              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                {isEditing ? (
                  <div className="flex-1">
                    <Label htmlFor="email" className="text-xs">Email</Label>
                    <Input
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                ) : (
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground mb-1">Email</p>
                    <p className="text-sm">{email}</p>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                {isEditing ? (
                  <div className="flex-1">
                    <Label htmlFor="phone" className="text-xs">Phone Number</Label>
                    <Input
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                ) : (
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground mb-1">Phone Number</p>
                    <p className="text-sm">{phone}</p>
                  </div>
                )}
              </div>

              <Separator />

              <div>
                <p className="text-xs text-muted-foreground mb-1">Course</p>
                <p className="text-sm">{studentData.course}</p>
              </div>
            </div>
          </Card>

          {/* Documents */}
          <Card className="p-6 shadow-sm">
            <h3 className="mb-4">Uploaded Documents</h3>
            <div className="space-y-3">
              {documents.map((doc) => (
                <div key={doc.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm">{doc.name}</p>
                  </div>
                  {doc.uploaded ? (
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-200 text-xs">
                      Uploaded
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs">
                      Pending
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Academic History */}
        <Card className="p-6 mt-6 shadow-sm">
          <h3 className="mb-4">Academic History</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4">Semester</th>
                  <th className="text-left py-3 px-4">GPA</th>
                  <th className="text-left py-3 px-4">Units</th>
                  <th className="text-left py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {academicHistory.map((record, index) => (
                  <tr key={index} className="border-b border-border last:border-0">
                    <td className="py-3 px-4">{record.semester}</td>
                    <td className="py-3 px-4">{record.gpa}</td>
                    <td className="py-3 px-4">{record.units}</td>
                    <td className="py-3 px-4">
                      <Badge
                        className={
                          record.status === "Ongoing"
                            ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }
                      >
                        {record.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
