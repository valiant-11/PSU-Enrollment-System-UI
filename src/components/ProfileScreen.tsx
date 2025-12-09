import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { User, Mail, Phone, MapPin, Calendar, FileText, Edit2, Save, X, School } from "lucide-react";
import { toast } from "sonner";
import { Student } from "../App";

interface ProfileScreenProps {
  student: Student;
  onUpdateStudent: (student: Student) => void;
}

export function ProfileScreen({ student, onUpdateStudent }: ProfileScreenProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    email: student.email || "",
    phone: student.phone || "",
    address: student.address || "",
  });

  const handleSave = () => {
    const updatedStudent = {
      ...student,
      email: editedData.email,
      phone: editedData.phone,
      address: editedData.address,
    };
    onUpdateStudent(updatedStudent);
    setIsEditing(false);
    toast.success("Profile updated successfully!");
  };

  const handleCancel = () => {
    setEditedData({
      email: student.email || "",
      phone: student.phone || "",
      address: student.address || "",
    });
    setIsEditing(false);
  };

  const documents = [
    { name: "Birth Certificate", uploaded: false },
    { name: "Form 137", uploaded: false },
    { name: "Good Moral Certificate", uploaded: false },
  ];

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "Not provided";
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="p-6 lg:p-8 bg-background">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-muted-foreground">Manage your personal information</p>
        </div>

        {/* Profile Card */}
        <Card className="p-6 lg:p-8 shadow-md">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-start gap-4">
              <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg">
                <User className="h-10 w-10 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{student.fullName}</h2>
                <p className="text-muted-foreground mb-2">{student.studentNumber}</p>
                <Badge className="bg-green-100 text-green-700 hover:bg-green-200">
                  Active Student
                </Badge>
              </div>
            </div>
            
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)} className="gap-2">
                <Edit2 className="h-4 w-4" />
                Edit Info
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button onClick={handleSave} className="gap-2">
                  <Save className="h-4 w-4" />
                  Save
                </Button>
                <Button onClick={handleCancel} variant="outline" className="gap-2">
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
              </div>
            )}
          </div>

          <Separator className="mb-6" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg mb-4">Personal Information</h3>
              
              <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground mb-1">Date of Birth</p>
                  <p className="font-medium">{student.birthdate || "Not provided"}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors">
                <User className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground mb-1">Sex</p>
                  <p className="font-medium">{student.sex || "Not provided"}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground mb-1">Address</p>
                  {isEditing ? (
                    <Input
                      value={editedData.address}
                      onChange={(e) => setEditedData({ ...editedData, address: e.target.value })}
                      className="mt-1"
                    />
                  ) : (
                    <p className="font-medium">{student.address || "Not provided"}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg mb-4">Contact Information</h3>
              
              <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors">
                <Mail className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground mb-1">Corporate Email</p>
                  <p className="font-medium text-primary break-all">{student.corpEmail}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors">
                <Mail className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground mb-1">Personal Email</p>
                  {isEditing ? (
                    <Input
                      type="email"
                      value={editedData.email}
                      onChange={(e) => setEditedData({ ...editedData, email: e.target.value })}
                      className="mt-1"
                    />
                  ) : (
                    <p className="font-medium break-all">{student.email || "Not provided"}</p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors">
                <Phone className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground mb-1">Phone Number</p>
                  {isEditing ? (
                    <Input
                      type="tel"
                      value={editedData.phone}
                      onChange={(e) => setEditedData({ ...editedData, phone: e.target.value })}
                      className="mt-1"
                    />
                  ) : (
                    <p className="font-medium">{student.phone || "Not provided"}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Academic Background */}
          <Card className="p-6 shadow-md">
            <div className="flex items-center gap-2 mb-4">
              <School className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-lg">Academic Background</h3>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Course/Program</p>
                <p className="font-medium">{student.course || "Not provided"}</p>
              </div>
              <Separator />
              <div>
                <p className="text-xs text-muted-foreground mb-1">Year Level</p>
                <p className="font-medium">{student.yearLevel || "Not provided"}</p>
              </div>
              <Separator />
              <div>
                <p className="text-xs text-muted-foreground mb-1">Last School Attended</p>
                <p className="font-medium">{student.lastSchool || "Not provided"}</p>
              </div>
              <Separator />
              <div>
                <p className="text-xs text-muted-foreground mb-1">Strand/Track</p>
                <p className="font-medium">{student.strand || "Not provided"}</p>
              </div>
              <Separator />
              <div>
                <p className="text-xs text-muted-foreground mb-1">Year Graduated</p>
                <p className="font-medium">{student.yearGraduated || "Not provided"}</p>
              </div>
            </div>
          </Card>

          {/* Documents */}
          <Card className="p-6 shadow-md">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-lg">Submitted Documents</h3>
            </div>
            <div className="space-y-3">
              {documents.map((doc) => (
                <div key={doc.name} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm font-medium">{doc.name}</p>
                  </div>
                  {doc.uploaded ? (
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-200">
                      Verified
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-orange-600 border-orange-600">
                      Pending
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Registration Info */}
        <Card className="p-6 shadow-md bg-primary/5 border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Enrollment Status</p>
              <p className="mt-2 font-semibold text-lg">{student.enrollmentStatus || "Active"}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Student Status</p>
              <Badge className="mt-2 bg-green-100 text-green-700 hover:bg-green-200">
                Active
              </Badge>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
