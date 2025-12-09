import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Alert, AlertDescription } from "./ui/alert";
import { AlertTriangle, CheckCircle, ShoppingCart } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface Subject {
  id: string;
  code: string;
  description: string;
  units: number;
  schedule: string;
  instructor: string;
  slots: number;
  maxSlots: number;
  prerequisites: string[];
  conflicts?: string[];
}

export function EnrollmentScreen() {
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [confirmedEnrollment, setConfirmedEnrollment] = useState(false);

  const availableSubjects: Subject[] = [
    {
      id: "1",
      code: "CS201",
      description: "Data Structures and Algorithms",
      units: 3,
      schedule: "MWF 9:00-10:30 AM",
      instructor: "Dr. Juan Dela Cruz",
      slots: 35,
      maxSlots: 40,
      prerequisites: ["CS101"],
    },
    {
      id: "2",
      code: "CS202",
      description: "Object-Oriented Programming",
      units: 3,
      schedule: "TTh 1:00-2:30 PM",
      instructor: "Prof. Maria Santos",
      slots: 28,
      maxSlots: 40,
      prerequisites: ["CS101"],
    },
    {
      id: "3",
      code: "MATH201",
      description: "Discrete Mathematics",
      units: 3,
      schedule: "MWF 10:30-12:00 PM",
      instructor: "Dr. Pedro Reyes",
      slots: 30,
      maxSlots: 35,
      prerequisites: ["MATH101"],
    },
    {
      id: "4",
      code: "ENG201",
      description: "Technical Writing",
      units: 3,
      schedule: "TTh 3:00-4:30 PM",
      instructor: "Prof. Ana Garcia",
      slots: 25,
      maxSlots: 30,
      prerequisites: [],
    },
    {
      id: "5",
      code: "CS203",
      description: "Database Management Systems",
      units: 3,
      schedule: "MWF 1:00-2:30 PM",
      instructor: "Dr. Carlos Mendoza",
      slots: 2,
      maxSlots: 40,
      prerequisites: ["CS101", "CS201"],
      conflicts: ["MATH201"],
    },
  ];

  const completedSubjects = ["CS101", "MATH101", "ENG101"];

  const toggleSubject = (subjectId: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(subjectId)
        ? prev.filter((id) => id !== subjectId)
        : [...prev, subjectId]
    );
  };

  const getSelectedSubjectDetails = () => {
    return availableSubjects.filter((s) => selectedSubjects.includes(s.id));
  };

  const getTotalUnits = () => {
    return getSelectedSubjectDetails().reduce((sum, s) => sum + s.units, 0);
  };

  const hasPrerequisiteIssues = (subject: Subject) => {
    return subject.prerequisites.some((prereq) => !completedSubjects.includes(prereq));
  };

  const hasScheduleConflict = (subject: Subject) => {
    if (!subject.conflicts) return false;
    return selectedSubjects.some((id) => {
      const selected = availableSubjects.find((s) => s.id === id);
      return selected && subject.conflicts?.includes(selected.code);
    });
  };

  const handleConfirmEnrollment = () => {
    setConfirmedEnrollment(true);
    toast.success("Enrollment confirmed!", {
      description: `You have enrolled in ${selectedSubjects.length} subjects (${getTotalUnits()} units)`,
    });
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1>Enrollment</h1>
          <p className="text-muted-foreground">Select subjects for enrollment - Academic Year 2024-2025</p>
        </div>

        {confirmedEnrollment && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Your enrollment has been confirmed. Please proceed to the Cashier's Office for payment.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Available Subjects */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="p-6 shadow-sm">
              <h3 className="mb-4">Available Subjects</h3>
              <div className="space-y-3">
                {availableSubjects.map((subject) => {
                  const hasPrereqIssue = hasPrerequisiteIssues(subject);
                  const hasConflict = hasScheduleConflict(subject);
                  const isFull = subject.slots >= subject.maxSlots;
                  const isDisabled = hasPrereqIssue || isFull;

                  return (
                    <div
                      key={subject.id}
                      className={`border rounded-lg p-4 transition-colors ${
                        selectedSubjects.includes(subject.id)
                          ? "border-primary bg-primary/5"
                          : "border-border bg-card"
                      } ${isDisabled ? "opacity-50" : ""}`}
                    >
                      <div className="flex items-start gap-3">
                        <Checkbox
                          id={subject.id}
                          checked={selectedSubjects.includes(subject.id)}
                          onCheckedChange={() => !isDisabled && toggleSubject(subject.id)}
                          disabled={isDisabled}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <label htmlFor={subject.id} className="cursor-pointer">
                                <span className="text-primary">{subject.code}</span> -{" "}
                                {subject.description}
                              </label>
                              <p className="text-sm text-muted-foreground mt-1">
                                {subject.instructor} • {subject.schedule}
                              </p>
                            </div>
                            <Badge variant="outline">{subject.units} units</Badge>
                          </div>

                          <div className="flex items-center gap-2 text-xs">
                            <span className={subject.slots < subject.maxSlots * 0.5 ? "text-green-600" : subject.slots < subject.maxSlots ? "text-yellow-600" : "text-red-600"}>
                              {subject.maxSlots - subject.slots} slots available
                            </span>
                            {subject.prerequisites.length > 0 && (
                              <>
                                <span className="text-muted-foreground">•</span>
                                <span className="text-muted-foreground">
                                  Prereq: {subject.prerequisites.join(", ")}
                                </span>
                              </>
                            )}
                          </div>

                          {hasPrereqIssue && (
                            <Alert className="mt-2 py-2 px-3 border-yellow-200 bg-yellow-50">
                              <AlertTriangle className="h-3 w-3 text-yellow-600" />
                              <AlertDescription className="text-xs text-yellow-800">
                                Missing prerequisites
                              </AlertDescription>
                            </Alert>
                          )}

                          {hasConflict && (
                            <Alert className="mt-2 py-2 px-3 border-red-200 bg-red-50">
                              <AlertTriangle className="h-3 w-3 text-red-600" />
                              <AlertDescription className="text-xs text-red-800">
                                Schedule conflict detected
                              </AlertDescription>
                            </Alert>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Enrollment Cart */}
          <div className="space-y-4">
            <Card className="p-6 shadow-sm sticky top-8">
              <div className="flex items-center gap-2 mb-4">
                <ShoppingCart className="h-5 w-5 text-primary" />
                <h3>Enrollment Summary</h3>
              </div>

              {selectedSubjects.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No subjects selected yet
                </p>
              ) : (
                <>
                  <div className="space-y-3 mb-4">
                    {getSelectedSubjectDetails().map((subject) => (
                      <div key={subject.id} className="pb-3 border-b border-border last:border-0">
                        <div className="flex justify-between items-start mb-1">
                          <p className="text-sm">{subject.code}</p>
                          <p className="text-sm text-muted-foreground">{subject.units} units</p>
                        </div>
                        <p className="text-xs text-muted-foreground">{subject.description}</p>
                      </div>
                    ))}
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <p className="text-sm">Total Subjects:</p>
                      <p className="text-sm">{selectedSubjects.length}</p>
                    </div>
                    <div className="flex justify-between">
                      <p>Total Units:</p>
                      <p className="text-primary">{getTotalUnits()}</p>
                    </div>
                  </div>

                  {getTotalUnits() > 24 && (
                    <Alert className="mb-4 py-2 px-3 border-yellow-200 bg-yellow-50">
                      <AlertTriangle className="h-3 w-3 text-yellow-600" />
                      <AlertDescription className="text-xs text-yellow-800">
                        Exceeds maximum units (24)
                      </AlertDescription>
                    </Alert>
                  )}

                  <Button
                    className="w-full"
                    onClick={handleConfirmEnrollment}
                    disabled={confirmedEnrollment || getTotalUnits() > 24}
                  >
                    {confirmedEnrollment ? "Enrollment Confirmed" : "Confirm Enrollment"}
                  </Button>

                  {!confirmedEnrollment && (
                    <Button
                      variant="outline"
                      className="w-full mt-2"
                      onClick={() => setSelectedSubjects([])}
                    >
                      Clear All
                    </Button>
                  )}
                </>
              )}
            </Card>

            <Card className="p-4 shadow-sm">
              <p className="text-xs text-muted-foreground">
                <strong>Note:</strong> Maximum of 24 units per semester. Make sure all prerequisites are completed.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
