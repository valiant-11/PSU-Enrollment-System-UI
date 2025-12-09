import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Alert, AlertDescription } from "./ui/alert";
import { Badge } from "./ui/badge";
import { AlertCircle, CheckCircle2, Clock, RefreshCw, FileText } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { Student } from "../App";

interface CourseShiftingProps {
  student: Student;
  onUpdateStudent: (student: Student) => void;
}

export function CourseShifting({ student, onUpdateStudent }: CourseShiftingProps) {
  const [formData, setFormData] = useState({
    toCollege: "",
    toCourse: "",
    reason: "",
    academicPerformance: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // College to courses mapping
  const collegeCoursesMap: Record<string, string[]> = {
    "College of Computer Studies": [
      "BS Computer Science",
      "BS Information Technology"
    ],
    "College of Engineering, Architecture & Technology": [
      "BS Civil Engineering",
      "BS Architecture"
    ],
    "College of Business & Accountancy": [
      "BS Accountancy",
      "BS Business Administration"
    ],
    "College of Arts & Communication": [
      "BS Communication"
    ],
    "College of Social Sciences": [
      "BS Social Sciences"
    ],
    "College of Hospitality & Tourism": [
      "BS Hospitality Management"
    ],
    "College of Nursing & Health Sciences": [
      "BS Nursing"
    ],
    "College of Education": [
      "BS Physical Education"
    ]
  };

  const colleges = Object.keys(collegeCoursesMap);
  const availableCourses = formData.toCollege ? collegeCoursesMap[formData.toCollege] : [];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => {
      // Reset course when college changes
      if (field === "toCollege") {
        return { ...prev, [field]: value, toCourse: "" };
      }
      return { ...prev, [field]: value };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.toCollege || !formData.toCourse || !formData.reason || !formData.academicPerformance) {
      toast.error("Please fill all required fields");
      return;
    }

    if (formData.toCourse === student.course) {
      toast.error("Please select a different course");
      return;
    }

    setIsSubmitting(true);

    // Simulate admin approval process
    toast.loading("Submitting shifting request...", { id: "shifting" });

    setTimeout(() => {
      toast.loading("Admin is reviewing your request...", { id: "shifting" });

      setTimeout(() => {
        const updatedStudent: Student = {
          ...student,
          shiftingRequest: {
            fromCourse: student.course,
            toCourse: formData.toCourse,
            reason: `${formData.reason}\n\nAcademic Performance: ${formData.academicPerformance}`,
            status: "pending",
            requestedAt: new Date().toISOString(),
          },
        };

        onUpdateStudent(updatedStudent);

        toast.success("Shifting request submitted!", {
          id: "shifting",
          description: "Your request is pending admin approval. You will be notified once reviewed.",
          duration: 5000,
        });

        setIsSubmitting(false);
        setFormData({ toCollege: "", toCourse: "", reason: "", academicPerformance: "" });
      }, 2000);
    }, 2000);
  };

  const handleSimulateApproval = () => {
    if (!student.shiftingRequest) return;

    toast.loading("Admin is approving your request...", { id: "approval" });

    setTimeout(() => {
      const updatedStudent: Student = {
        ...student,
        course: student.shiftingRequest!.toCourse,
        shiftingRequest: {
          ...student.shiftingRequest!,
          status: "approved",
        },
      };

      onUpdateStudent(updatedStudent);

      toast.success("Shifting request approved!", {
        id: "approval",
        description: `You have been transferred to ${student.shiftingRequest!.toCourse}`,
        duration: 5000,
      });
    }, 2000);
  };

  const handleCancelRequest = () => {
    const updatedStudent: Student = {
      ...student,
      shiftingRequest: undefined,
    };

    onUpdateStudent(updatedStudent);
    toast.success("Shifting request cancelled");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "approved":
        return "bg-green-100 text-green-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "approved":
        return <CheckCircle2 className="h-4 w-4" />;
      case "rejected":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1>Course Shifting</h1>
          <p className="text-muted-foreground">Request to transfer to a different program</p>
        </div>

        {/* Current Course Info */}
        <Card className="p-6 shadow-md">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3>Current Program</h3>
              <p className="text-sm text-muted-foreground">Your enrolled course information</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-secondary/30 rounded-lg">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Course</p>
              <p className="text-sm">{student.course}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Year Level</p>
              <p className="text-sm">{student.yearLevel}</p>
            </div>
          </div>
        </Card>

        {/* Existing Shifting Request */}
        {student.shiftingRequest && (
          <Card className="p-6 shadow-md border-2 border-primary/20">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <RefreshCw className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3>Shifting Request Status</h3>
                  <p className="text-xs text-muted-foreground">
                    Submitted on {new Date(student.shiftingRequest.requestedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <Badge className={getStatusColor(student.shiftingRequest.status)}>
                <span className="flex items-center gap-1">
                  {getStatusIcon(student.shiftingRequest.status)}
                  {student.shiftingRequest.status.charAt(0).toUpperCase() + student.shiftingRequest.status.slice(1)}
                </span>
              </Badge>
            </div>

            <div className="space-y-3">
              <div className="p-4 bg-secondary/30 rounded-lg space-y-2">
                <div>
                  <p className="text-xs text-muted-foreground">From</p>
                  <p className="text-sm">{student.shiftingRequest.fromCourse}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">To</p>
                  <p className="text-sm">{student.shiftingRequest.toCourse}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Reason</p>
                  <p className="text-sm whitespace-pre-line">{student.shiftingRequest.reason}</p>
                </div>
              </div>

              {student.shiftingRequest.status === "pending" && (
                <Alert className="border-yellow-200 bg-yellow-50">
                  <Clock className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-yellow-800">
                    Your request is currently under review by the admin. This typically takes 2-3 business days.
                  </AlertDescription>
                </Alert>
              )}

              {student.shiftingRequest.status === "approved" && (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    Your shifting request has been approved! Your course has been updated to {student.shiftingRequest.toCourse}.
                  </AlertDescription>
                </Alert>
              )}

              {student.shiftingRequest.status === "rejected" && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    Your shifting request was not approved. Please contact the registrar's office for more information.
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex gap-2">
                {student.shiftingRequest.status === "pending" && (
                  <>
                    <Button
                      variant="outline"
                      onClick={handleSimulateApproval}
                      className="flex-1"
                    >
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Simulate Approval (Demo)
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleCancelRequest}
                      className="flex-1"
                    >
                      Cancel Request
                    </Button>
                  </>
                )}
                {student.shiftingRequest.status !== "pending" && (
                  <Button
                    variant="outline"
                    onClick={handleCancelRequest}
                    className="w-full"
                  >
                    Clear Status
                  </Button>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* Shifting Request Form */}
        {!student.shiftingRequest && (
          <Card className="p-6 shadow-md">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <RefreshCw className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3>Submit Shifting Request</h3>
                <p className="text-sm text-muted-foreground">Fill out the form to request a course transfer</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Alert className="border-blue-200 bg-blue-50">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800 text-xs">
                  <strong>Important:</strong> Shifting requests are subject to admin approval. Make sure to provide valid reasons for your request.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label htmlFor="toCollege">New College *</Label>
                <Select value={formData.toCollege} onValueChange={(value) => handleInputChange("toCollege", value)}>
                  <SelectTrigger id="toCollege">
                    <SelectValue placeholder="Select college" />
                  </SelectTrigger>
                  <SelectContent>
                    {colleges.map(college => (
                      <SelectItem key={college} value={college}>{college}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="toCourse">New Course/Program *</Label>
                <Select 
                  value={formData.toCourse} 
                  onValueChange={(value) => handleInputChange("toCourse", value)}
                  disabled={!formData.toCollege}
                >
                  <SelectTrigger id="toCourse">
                    <SelectValue placeholder={formData.toCollege ? "Select course" : "Select college first"} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCourses.map(course => (
                      <SelectItem key={course} value={course}>{course}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="academicPerformance">Academic Performance/GPA *</Label>
                <Input
                  id="academicPerformance"
                  placeholder="e.g., 1.75 GPA"
                  value={formData.academicPerformance}
                  onChange={(e) => handleInputChange("academicPerformance", e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">Provide your current GPA or academic standing</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Reason for Shifting *</Label>
                <Textarea
                  id="reason"
                  placeholder="Explain why you want to shift to the new course..."
                  value={formData.reason}
                  onChange={(e) => handleInputChange("reason", e.target.value)}
                  className="min-h-[120px] resize-none"
                  required
                />
                <p className="text-xs text-muted-foreground">Minimum 50 characters</p>
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isSubmitting || formData.reason.length < 50}
              >
                {isSubmitting ? "Submitting..." : "Submit Shifting Request"}
              </Button>
            </form>
          </Card>
        )}

        {/* Guidelines */}
        <Card className="p-6 shadow-md bg-secondary/30">
          <h4 className="mb-3">Shifting Guidelines</h4>
          <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
            <li>Students must have completed at least one semester in their current course</li>
            <li>Minimum GPA requirement of 2.0 for shifting</li>
            <li>Shifting is allowed only once per academic year</li>
            <li>Some courses may require additional entrance examinations</li>
            <li>Processing time is typically 2-3 business days</li>
            <li>Approved students must settle any pending fees before transfer</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}