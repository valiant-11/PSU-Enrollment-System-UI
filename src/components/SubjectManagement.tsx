import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "./ui/dialog";
import { Checkbox } from "./ui/checkbox";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface Subject {
  id: string;
  code: string;
  description: string;
  units: number;
  type: "GE" | "Core" | "Major";
  prerequisites: string[];
}

export function SubjectManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState("bscs");
  const [selectedYear, setSelectedYear] = useState("1");
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

  const [subjects, setSubjects] = useState<Subject[]>([
    { id: "1", code: "CS101", description: "Introduction to Programming", units: 3, type: "Core", prerequisites: [] },
    { id: "2", code: "MATH101", description: "College Algebra", units: 3, type: "GE", prerequisites: [] },
    { id: "3", code: "CS102", description: "Data Structures", units: 3, type: "Major", prerequisites: ["CS101"] },
    { id: "4", code: "ENG101", description: "English Communication", units: 3, type: "GE", prerequisites: [] },
    { id: "5", code: "CS201", description: "Object-Oriented Programming", units: 3, type: "Major", prerequisites: ["CS101", "CS102"] },
  ]);

  const handleAddSubject = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newSubject: Subject = {
      id: Date.now().toString(),
      code: formData.get("code") as string,
      description: formData.get("description") as string,
      units: parseInt(formData.get("units") as string),
      type: formData.get("type") as "GE" | "Core" | "Major",
      prerequisites: [],
    };
    setSubjects([...subjects, newSubject]);
    setIsDialogOpen(false);
    toast.success("Subject added successfully!");
  };

  const handleDeleteSubject = (id: string) => {
    setSubjects(subjects.filter(s => s.id !== id));
    toast.success("Subject deleted successfully!");
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "GE":
        return "bg-blue-100 text-blue-700 hover:bg-blue-200";
      case "Core":
        return "bg-purple-100 text-purple-700 hover:bg-purple-200";
      case "Major":
        return "bg-primary/10 text-primary hover:bg-primary/20";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1>Subject & Curriculum Management</h1>
            <p className="text-muted-foreground">Manage subjects and curriculum structure</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Subject
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Subject</DialogTitle>
                <DialogDescription>Enter the details of the new subject.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddSubject} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="code">Subject Code</Label>
                    <Input id="code" name="code" placeholder="CS101" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="units">Units</Label>
                    <Input id="units" name="units" type="number" min="1" max="6" defaultValue="3" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input id="description" name="description" placeholder="Subject Title" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select name="type" defaultValue="Core">
                    <SelectTrigger id="type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GE">General Education</SelectItem>
                      <SelectItem value="Core">Core Subject</SelectItem>
                      <SelectItem value="Major">Major Subject</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Prerequisites</Label>
                  <div className="border border-border rounded-lg p-4 max-h-48 overflow-y-auto space-y-2">
                    {subjects.map((subject) => (
                      <div key={subject.id} className="flex items-center space-x-2">
                        <Checkbox id={`prereq-${subject.id}`} />
                        <label htmlFor={`prereq-${subject.id}`} className="text-sm">
                          {subject.code} - {subject.description}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Add Subject</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <Card className="p-6 mb-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Course/Program</Label>
              <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bscs">BS Computer Science</SelectItem>
                  <SelectItem value="bsit">BS Information Technology</SelectItem>
                  <SelectItem value="bsce">BS Civil Engineering</SelectItem>
                  <SelectItem value="bsba">BS Business Administration</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Year Level</Label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1st Year</SelectItem>
                  <SelectItem value="2">2nd Year</SelectItem>
                  <SelectItem value="3">3rd Year</SelectItem>
                  <SelectItem value="4">4th Year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Semester</Label>
              <Select defaultValue="1">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1st Semester</SelectItem>
                  <SelectItem value="2">2nd Semester</SelectItem>
                  <SelectItem value="summer">Summer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Subjects Table */}
        <Card className="shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary">
                <tr>
                  <th className="text-left py-4 px-6">Subject Code</th>
                  <th className="text-left py-4 px-6">Description</th>
                  <th className="text-left py-4 px-6">Units</th>
                  <th className="text-left py-4 px-6">Type</th>
                  <th className="text-left py-4 px-6">Prerequisites</th>
                  <th className="text-left py-4 px-6">Actions</th>
                </tr>
              </thead>
              <tbody>
                {subjects.map((subject) => (
                  <tr key={subject.id} className="border-b border-border hover:bg-secondary/50">
                    <td className="py-4 px-6">{subject.code}</td>
                    <td className="py-4 px-6">{subject.description}</td>
                    <td className="py-4 px-6">{subject.units}</td>
                    <td className="py-4 px-6">
                      <Badge className={getTypeColor(subject.type)}>{subject.type}</Badge>
                    </td>
                    <td className="py-4 px-6">
                      {subject.prerequisites.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {subject.prerequisites.map((prereq) => (
                            <Badge key={prereq} variant="outline" className="text-xs">
                              {prereq}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">None</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteSubject(subject.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Summary */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          <Card className="p-4 shadow-sm">
            <p className="text-sm text-muted-foreground">Total Subjects</p>
            <p className="text-primary mt-1">{subjects.length}</p>
          </Card>
          <Card className="p-4 shadow-sm">
            <p className="text-sm text-muted-foreground">Total Units</p>
            <p className="text-primary mt-1">{subjects.reduce((acc, s) => acc + s.units, 0)}</p>
          </Card>
          <Card className="p-4 shadow-sm">
            <p className="text-sm text-muted-foreground">Major Subjects</p>
            <p className="text-primary mt-1">{subjects.filter(s => s.type === "Major").length}</p>
          </Card>
        </div>
      </div>
    </div>
  );
}