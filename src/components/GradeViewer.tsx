import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Award, BookOpen, TrendingUp, FileText } from "lucide-react";
import { Student } from "../App";
import { useState } from "react";

interface GradeViewerProps {
  student: Student;
}

interface SubjectGrade {
  code: string;
  description: string;
  units: number;
  grade: string;
  remarks: string;
  instructor: string;
}

export function GradeViewer({ student }: GradeViewerProps) {
  const [selectedSemester, setSelectedSemester] = useState("1st Semester");
  const [selectedAY, setSelectedAY] = useState("2024-2025");

  // Mock grades - will be empty for 1st year students without grades yet
  const grades: Record<string, SubjectGrade[]> = {
    "2024-2025-1st Semester": [],
    "2024-2025-2nd Semester": [],
    "2023-2024-1st Semester": [],
    "2023-2024-2nd Semester": [],
  };

  const currentKey = `${selectedAY}-${selectedSemester}`;
  const currentGrades = grades[currentKey] || [];

  const calculateGWA = (gradesList: SubjectGrade[]) => {
    if (gradesList.length === 0) return "N/A";
    
    const totalPoints = gradesList.reduce((sum, subject) => {
      const gradeValue = parseFloat(subject.grade);
      return sum + (gradeValue * subject.units);
    }, 0);
    
    const totalUnits = gradesList.reduce((sum, subject) => sum + subject.units, 0);
    
    return (totalPoints / totalUnits).toFixed(2);
  };

  const getGradeColor = (grade: string) => {
    const numGrade = parseFloat(grade);
    if (numGrade >= 1.0 && numGrade <= 1.5) return "text-green-600";
    if (numGrade > 1.5 && numGrade <= 2.5) return "text-blue-600";
    if (numGrade > 2.5 && numGrade <= 3.0) return "text-yellow-600";
    return "text-red-600";
  };

  const getRemarksBadge = (remarks: string) => {
    if (remarks === "Passed") {
      return <Badge className="bg-green-100 text-green-700 hover:bg-green-200">Passed</Badge>;
    }
    return <Badge className="bg-red-100 text-red-700 hover:bg-red-200">Failed</Badge>;
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1>Grade Viewer</h1>
          <p className="text-muted-foreground">View your academic performance and grades</p>
        </div>

        {/* Student Info */}
        <Card className="p-6 shadow-md">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Student Number</p>
              <p className="text-sm">{student.studentNumber}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Student Name</p>
              <p className="text-sm">{student.fullName}</p>
            </div>
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

        {/* Filters */}
        <Card className="p-6 shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm">Academic Year</label>
              <Select value={selectedAY} onValueChange={setSelectedAY}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024-2025">2024-2025</SelectItem>
                  <SelectItem value="2023-2024">2023-2024</SelectItem>
                  <SelectItem value="2022-2023">2022-2023</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm">Semester</label>
              <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1st Semester">1st Semester</SelectItem>
                  <SelectItem value="2nd Semester">2nd Semester</SelectItem>
                  <SelectItem value="Summer">Summer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Grades Table */}
          <div className="lg:col-span-2">
            <Card className="p-6 shadow-md">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="h-5 w-5 text-primary" />
                <h3>Grades for {selectedSemester} {selectedAY}</h3>
              </div>

              {currentGrades.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                  <p className="text-muted-foreground mb-2">
                    No grades available yet
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Grades will appear here once they are released by your instructors
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b-2 border-border">
                      <tr>
                        <th className="text-left py-3 px-2">Code</th>
                        <th className="text-left py-3 px-2">Subject</th>
                        <th className="text-center py-3 px-2">Units</th>
                        <th className="text-center py-3 px-2">Grade</th>
                        <th className="text-center py-3 px-2">Remarks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentGrades.map((subject, index) => (
                        <tr key={index} className="border-b border-border last:border-0">
                          <td className="py-3 px-2 text-sm text-primary">{subject.code}</td>
                          <td className="py-3 px-2 text-sm">
                            <p>{subject.description}</p>
                            <p className="text-xs text-muted-foreground">{subject.instructor}</p>
                          </td>
                          <td className="py-3 px-2 text-sm text-center">{subject.units}</td>
                          <td className={`py-3 px-2 text-center ${getGradeColor(subject.grade)}`}>
                            {subject.grade}
                          </td>
                          <td className="py-3 px-2 text-center">
                            {getRemarksBadge(subject.remarks)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </div>

          {/* Summary */}
          <div className="space-y-4">
            <Card className="p-6 shadow-md">
              <div className="flex items-center gap-2 mb-4">
                <Award className="h-5 w-5 text-primary" />
                <h3>Summary</h3>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-secondary/30">
                  <p className="text-xs text-muted-foreground mb-1">Semester GWA</p>
                  <p className="text-2xl">{calculateGWA(currentGrades)}</p>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <p className="text-sm text-muted-foreground">Total Units</p>
                    <p className="text-sm">
                      {currentGrades.reduce((sum, s) => sum + s.units, 0)}
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-sm text-muted-foreground">Subjects Taken</p>
                    <p className="text-sm">{currentGrades.length}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-sm text-muted-foreground">Passed</p>
                    <p className="text-sm text-green-600">
                      {currentGrades.filter(s => s.remarks === "Passed").length}
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-sm text-muted-foreground">Failed</p>
                    <p className="text-sm text-red-600">
                      {currentGrades.filter(s => s.remarks === "Failed").length}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-4 shadow-md bg-blue-50 border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                <h4 className="text-blue-800">Grading System</h4>
              </div>
              <div className="space-y-1 text-xs text-blue-700">
                <p>1.0 - 1.5: Excellent</p>
                <p>1.6 - 2.5: Good</p>
                <p>2.6 - 3.0: Passing</p>
                <p>5.0: Failed</p>
                <p className="mt-2"><strong>Passing Grade: 3.0</strong></p>
              </div>
            </Card>

            <Card className="p-4 shadow-md bg-secondary/30">
              <p className="text-xs text-muted-foreground mb-2">
                <strong>Note:</strong>
              </p>
              <p className="text-xs text-muted-foreground">
                Grades are posted by instructors after the semester ends. 
                If you have concerns about your grades, please contact your instructor or the registrar's office.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
