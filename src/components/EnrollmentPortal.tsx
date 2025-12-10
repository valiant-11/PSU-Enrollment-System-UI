import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Checkbox } from "./ui/checkbox";
import { Separator } from "./ui/separator";
import { Alert, AlertDescription } from "./ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { AlertTriangle, CheckCircle2, BookOpen, Clock, Users, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { Student } from "../App";
import { supabase } from "../lib/supabaseClient";

interface Subject {
  id: string;
  code: string;
  description: string;
  units: number;
  schedule: string;
  instructor: string;
  slots: number;
  maxSlots: number;
  type: "GE" | "Core" | "Major";
  college: string;
  course: string;
  yearLevel: string;
  prerequisites?: string[];
  semester: "1st Semester" | "2nd Semester" | "Summer";
}

interface EnrollmentPortalProps {
  student: Student;
  onUpdateStudent: (student: Student) => void;
}

export function EnrollmentPortal({ student, onUpdateStudent }: EnrollmentPortalProps) {
  const [allSubjects, setAllSubjects] = useState<Subject[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(student.enrolledSubjects || []);
  const [selectedSemester, setSelectedSemester] = useState("1st Semester");
  const [academicYear, setAcademicYear] = useState("2024-2025");
  const [collegeFilter, setCollegeFilter] = useState("All Colleges");
  const [courseFilter, setCourseFilter] = useState("All Courses");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(true);

  // Load subjects from Supabase on component mount
  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    setIsLoadingSubjects(true);
    try {
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .order('code', { ascending: true });
      
      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      // Map database format to component format
      const mappedSubjects: Subject[] = (data || []).map(s => ({
        id: s.id,
        code: s.code,
        description: s.description,
        units: s.units,
        schedule: s.schedule,
        instructor: s.instructor,
        slots: s.slots,
        maxSlots: s.max_slots,
        type: s.type as "GE" | "Core" | "Major",
        college: s.college,
        course: s.course,
        yearLevel: s.year_level,
        semester: s.semester as "1st Semester" | "2nd Semester" | "Summer",
        prerequisites: s.prerequisites || []
      }));
      
      setAllSubjects(mappedSubjects);
      console.log('Loaded subjects:', mappedSubjects.length);
    } catch (error) {
      console.error('Error loading subjects:', error);
      toast.error("Failed to load subjects", {
        description: "Could not load subjects from database. Please refresh the page."
      });
    } finally {
      setIsLoadingSubjects(false);
    }
  };

  const toggleSubject = (subjectId: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(subjectId)
        ? prev.filter((id) => id !== subjectId)
        : [...prev, subjectId]
    );
  };

  const getSelectedSubjectDetails = () => {
    return allSubjects.filter((s) => selectedSubjects.includes(s.id));
  };

  const getTotalUnits = () => {
    return getSelectedSubjectDetails().reduce((sum, s) => sum + s.units, 0);
  };

  const calculateTotalFee = () => {
    const tuitionPerUnit = 500;
    const miscFees = 2800;
    const labFees = getSelectedSubjectDetails().filter(s => s.type === "Major").length * 1000;
    return (getTotalUnits() * tuitionPerUnit) + miscFees + labFees;
  };

  const handleConfirmEnrollment = async () => {
    if (selectedSubjects.length === 0) {
      toast.error("No subjects selected", {
        description: "Please select at least one subject to enroll.",
      });
      return;
    }

    if (getTotalUnits() > 21) {
      toast.error("Unit limit exceeded", {
        description: "Maximum of 21 units per semester.",
      });
      return;
    }

    setIsLoading(true);

    try {
      const updatedStudent = {
        ...student,
        enrolledSubjects: selectedSubjects,
        payments: [
          ...(student.payments || []),
          {
            date: new Date().toISOString(),
            amount: calculateTotalFee(),
            description: `Tuition - ${selectedSemester} ${academicYear}`
          }
        ]
      };
      onUpdateStudent(updatedStudent);
      
      localStorage.setItem("psu_current_student", JSON.stringify(updatedStudent));
      
      toast.success("Enrollment confirmed!", {
        description: `You have enrolled in ${selectedSubjects.length} subjects (${getTotalUnits()} units). Estimated fee: ₱${calculateTotalFee().toLocaleString()}`,
      });
    } catch (error) {
      console.error("Enrollment error:", error);
      toast.error("Enrollment failed", {
        description: "Could not save your enrollment. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "GE":
        return "bg-blue-100 text-blue-700 hover:bg-blue-200";
      case "Core":
        return "bg-purple-100 text-purple-700 hover:bg-purple-200";
      case "Major":
        return "bg-orange-100 text-orange-700 hover:bg-orange-200";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const isEnrolled = selectedSubjects.length > 0 && 
                     JSON.stringify(selectedSubjects.sort()) === JSON.stringify((student.enrolledSubjects || []).sort());

  const allColleges = ["All Colleges", ...Array.from(new Set(allSubjects.map(s => s.college)))];
  
  const getAvailableCourses = () => {
    if (collegeFilter === "All Colleges") {
      return ["All Courses", ...Array.from(new Set(allSubjects.map(s => s.course)))];
    }
    return ["All Courses", ...Array.from(new Set(allSubjects.filter(s => s.college === collegeFilter).map(s => s.course)))];
  };

  const handleCollegeChange = (value: string) => {
    setCollegeFilter(value);
    setCourseFilter("All Courses");
  };

  const checkPrerequisites = (subject: any): { met: boolean; missing: string[] } => {
    if (!subject.prerequisites || subject.prerequisites.length === 0) {
      return { met: true, missing: [] };
    }

    const passedSubjects = student.enrolledSubjects || [];
    const missingPrereqs = subject.prerequisites.filter((prereqId: string) => {
      return !passedSubjects.includes(prereqId);
    });

    return {
      met: missingPrereqs.length === 0,
      missing: missingPrereqs.map(id => {
        const prereqSubject = allSubjects.find(s => s.id === id);
        return prereqSubject ? prereqSubject.code : id;
      })
    };
  };

  const filteredSubjects = allSubjects.filter(subject => {
    const matchesCollege = collegeFilter === "All Colleges" || subject.college === collegeFilter;
    const matchesCourse = courseFilter === "All Courses" || subject.course === courseFilter;
    const matchesSemester = subject.semester === selectedSemester;
    const notEnrolled = !(student.enrolledSubjects || []).includes(subject.id);
    const prerequisitesMet = checkPrerequisites(subject).met;
    return matchesCollege && matchesCourse && matchesSemester && notEnrolled && prerequisitesMet;
  });

  const isCrossEnrolled = (subject: Subject) => {
    return subject.course !== student.course;
  };

  return (
    <div className="p-6 lg:p-8 bg-background">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Enrollment</h1>
          <p className="text-muted-foreground">Select subjects for Academic Year {academicYear}</p>
        </div>

        {isEnrolled && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              ✓ You are currently enrolled in {student.enrolledSubjects?.length || 0} subjects for {selectedSemester} {academicYear}. 
              You can modify your enrollment below.
            </AlertDescription>
          </Alert>
        )}

        <Card className="p-6 shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Academic Year</label>
              <Select value={academicYear} onValueChange={setAcademicYear}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024-2025">2024-2025</SelectItem>
                  <SelectItem value="2023-2024">2023-2024</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Semester</label>
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
          <div className="lg:col-span-2 space-y-4">
            <Card className="p-6 shadow-md">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-lg">Available Subjects</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4 p-3 bg-secondary/30 rounded-lg">
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground font-medium">Filter by College</label>
                  <Select value={collegeFilter} onValueChange={handleCollegeChange}>
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {allColleges.map(college => (
                        <SelectItem key={college} value={college}>{college}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground font-medium">Filter by Course</label>
                  <Select value={courseFilter} onValueChange={setCourseFilter}>
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableCourses().map(course => (
                        <SelectItem key={course} value={course}>{course}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-3">
                {isLoadingSubjects ? (
                  <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50 animate-pulse" />
                    <p className="text-sm text-muted-foreground">Loading subjects...</p>
                  </div>
                ) : filteredSubjects.length === 0 ? (
                  <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                    <p className="text-sm text-muted-foreground">No subjects available</p>
                    <p className="text-xs text-muted-foreground mt-2">Try adjusting your filters or check back later</p>
                  </div>
                ) : (
                  filteredSubjects.map((subject) => {
                    const isSelected = selectedSubjects.includes(subject.id);
                    const availableSlots = subject.maxSlots - subject.slots;
                    const isFull = availableSlots <= 0;
                    const crossEnroll = isCrossEnrolled(subject);

                    return (
                      <div
                        key={subject.id}
                        className={`border-2 rounded-xl p-4 transition-all ${
                          isSelected
                            ? "border-primary bg-primary/5 shadow-sm"
                            : "border-border bg-card hover:border-primary/30 hover:shadow-sm"
                        } ${isFull ? "opacity-50" : ""}`}
                      >
                        <div className="flex items-start gap-3">
                          <Checkbox
                            id={subject.id}
                            checked={isSelected}
                            onCheckedChange={() => !isFull && toggleSubject(subject.id)}
                            disabled={isFull}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                              <div>
                                <label htmlFor={subject.id} className="cursor-pointer">
                                  <span className="text-primary font-semibold">{subject.code}</span> - {subject.description}
                                </label>
                                {crossEnroll && (
                                  <Badge variant="outline" className="ml-2 text-xs bg-amber-50 text-amber-700 border-amber-300">
                                    Cross-Enrollment
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">{subject.units} units</Badge>
                                <Badge className={getTypeColor(subject.type)}>{subject.type}</Badge>
                              </div>
                            </div>

                            <div className="space-y-2 text-sm text-muted-foreground">
                              {crossEnroll && (
                                <div className="text-xs text-amber-700 bg-amber-50 px-2 py-1 rounded">
                                  {subject.college}
                                </div>
                              )}
                              <div className="flex items-center gap-2">
                                <Clock className="h-3 w-3" />
                                <span>{subject.schedule}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Users className="h-3 w-3" />
                                <span>{subject.instructor}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div 
                                  className={`h-2 w-2 rounded-full ${
                                    availableSlots > 10 
                                      ? "bg-green-500" 
                                      : availableSlots > 5 
                                      ? "bg-yellow-500" 
                                      : "bg-red-500"
                                  }`}
                                />
                                <span className={
                                  availableSlots > 10 
                                  ? "text-green-600" 
                                  : availableSlots > 5 
                                  ? "text-yellow-600" 
                                  : "text-red-600"
                                  }>
                                  {isFull ? "Class Full" : `${availableSlots} slots available`}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="p-6 shadow-md sticky top-24">
              <div className="flex items-center gap-2 mb-4">
                <ShoppingCart className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-lg">Enrollment Summary</h3>
              </div>

              {selectedSubjects.length === 0 ? (
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                  <p className="text-sm text-muted-foreground">
                    No subjects selected yet
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-3 mb-4">
                    {getSelectedSubjectDetails().map((subject) => (
                      <div key={subject.id} className="pb-3 border-b border-border last:border-0">
                        <div className="flex justify-between items-start mb-1">
                          <p className="text-sm font-medium">{subject.code}</p>
                          <Badge variant="outline" className="text-xs">{subject.units} units</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{subject.description}</p>
                      </div>
                    ))}
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between">
                      <p className="text-sm text-muted-foreground">Total Subjects</p>
                      <p className="text-sm font-medium">{selectedSubjects.length}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm text-muted-foreground">Total Units</p>
                      <p className="text-sm font-medium">{getTotalUnits()}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="font-medium">Estimated Fee</p>
                      <p className="text-primary font-semibold">₱{calculateTotalFee().toLocaleString()}</p>
                    </div>
                  </div>

                  {getTotalUnits() > 21 && (
                    <Alert className="mb-4 py-2 px-3 border-red-200 bg-red-50">
                      <AlertTriangle className="h-3 w-3 text-red-600" />
                      <AlertDescription className="text-xs text-red-800">
                        Exceeds maximum units (21)
                      </AlertDescription>
                    </Alert>
                  )}

                  {getTotalUnits() < 12 && getTotalUnits() > 0 && (
                    <Alert className="mb-4 py-2 px-3 border-yellow-200 bg-yellow-50">
                      <AlertTriangle className="h-3 w-3 text-yellow-600" />
                      <AlertDescription className="text-xs text-yellow-800">
                        Below minimum units (12) for full-time status
                      </AlertDescription>
                    </Alert>
                  )}

                  <Button
                    className="w-full"
                    onClick={handleConfirmEnrollment}
                    disabled={getTotalUnits() > 21 || getTotalUnits() === 0 || isLoading}
                  >
                    {isLoading ? "Saving..." : "Confirm Enrollment"}
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full mt-2"
                    onClick={() => setSelectedSubjects([])}
                  >
                    Clear All
                  </Button>
                </>
              )}
            </Card>

            <Card className="p-4 shadow-md bg-secondary/30">
              <p className="text-xs text-muted-foreground mb-2 font-semibold">
                ℹ️ Important:
              </p>
              <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                <li>Minimum: 12 units (full-time)</li>
                <li>Maximum: 21 units per semester</li>
                <li>Enrollment deadline: Jan 15, 2025</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
