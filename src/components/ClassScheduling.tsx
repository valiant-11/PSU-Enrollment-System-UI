import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Plus } from "lucide-react";

interface ScheduleBlock {
  id: string;
  subject: string;
  code: string;
  instructor: string;
  room: string;
  day: number;
  startTime: number;
  endTime: number;
  color: string;
}

export function ClassScheduling() {
  const scheduleBlocks: ScheduleBlock[] = [
    {
      id: "1",
      subject: "Data Structures",
      code: "CS201",
      instructor: "Dr. Cruz",
      room: "CS Lab 1",
      day: 1,
      startTime: 9,
      endTime: 10.5,
      color: "bg-blue-500",
    },
    {
      id: "2",
      subject: "Data Structures",
      code: "CS201",
      instructor: "Dr. Cruz",
      room: "CS Lab 1",
      day: 3,
      startTime: 9,
      endTime: 10.5,
      color: "bg-blue-500",
    },
    {
      id: "3",
      subject: "Data Structures",
      code: "CS201",
      instructor: "Dr. Cruz",
      room: "CS Lab 1",
      day: 5,
      startTime: 9,
      endTime: 10.5,
      color: "bg-blue-500",
    },
    {
      id: "4",
      subject: "OOP",
      code: "CS202",
      instructor: "Prof. Santos",
      room: "CS Lab 2",
      day: 2,
      startTime: 13,
      endTime: 14.5,
      color: "bg-purple-500",
    },
    {
      id: "5",
      subject: "OOP",
      code: "CS202",
      instructor: "Prof. Santos",
      room: "CS Lab 2",
      day: 4,
      startTime: 13,
      endTime: 14.5,
      color: "bg-purple-500",
    },
    {
      id: "6",
      subject: "Discrete Math",
      code: "MATH201",
      instructor: "Dr. Reyes",
      room: "Room 301",
      day: 1,
      startTime: 10.5,
      endTime: 12,
      color: "bg-green-500",
    },
    {
      id: "7",
      subject: "Discrete Math",
      code: "MATH201",
      instructor: "Dr. Reyes",
      room: "Room 301",
      day: 3,
      startTime: 10.5,
      endTime: 12,
      color: "bg-green-500",
    },
    {
      id: "8",
      subject: "Discrete Math",
      code: "MATH201",
      instructor: "Dr. Reyes",
      room: "Room 301",
      day: 5,
      startTime: 10.5,
      endTime: 12,
      color: "bg-green-500",
    },
    {
      id: "9",
      subject: "Technical Writing",
      code: "ENG201",
      instructor: "Prof. Garcia",
      room: "Room 205",
      day: 2,
      startTime: 15,
      endTime: 16.5,
      color: "bg-orange-500",
    },
    {
      id: "10",
      subject: "Technical Writing",
      code: "ENG201",
      instructor: "Prof. Garcia",
      room: "Room 205",
      day: 4,
      startTime: 15,
      endTime: 16.5,
      color: "bg-orange-500",
    },
  ];

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const hours = Array.from({ length: 13 }, (_, i) => i + 7); // 7 AM to 7 PM

  const formatTime = (hour: number) => {
    const h = Math.floor(hour);
    const m = (hour % 1) * 60;
    const period = h >= 12 ? "PM" : "AM";
    const displayHour = h > 12 ? h - 12 : h === 0 ? 12 : h;
    return `${displayHour}:${m === 0 ? "00" : m} ${period}`;
  };

  const getBlockPosition = (block: ScheduleBlock) => {
    const top = ((block.startTime - 7) * 80) + 1;
    const height = (block.endTime - block.startTime) * 80 - 2;
    return { top, height };
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1>Class Scheduling</h1>
            <p className="text-muted-foreground">View and manage class schedules</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Schedule
          </Button>
        </div>

        {/* Filters */}
        <Card className="p-6 mb-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm">Academic Year</label>
              <Select defaultValue="2024-2025">
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
              <label className="text-sm">Semester</label>
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

            <div className="space-y-2">
              <label className="text-sm">Course</label>
              <Select defaultValue="bscs">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Courses</SelectItem>
                  <SelectItem value="bscs">BS Computer Science</SelectItem>
                  <SelectItem value="bsit">BS Information Technology</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm">Year Level</label>
              <Select defaultValue="2">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  <SelectItem value="1">1st Year</SelectItem>
                  <SelectItem value="2">2nd Year</SelectItem>
                  <SelectItem value="3">3rd Year</SelectItem>
                  <SelectItem value="4">4th Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Weekly Timetable */}
        <Card className="shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <div className="min-w-[1200px]">
              {/* Header */}
              <div className="grid grid-cols-7 border-b border-border bg-secondary">
                <div className="p-4 border-r border-border">
                  <p className="text-sm">Time</p>
                </div>
                {days.map((day) => (
                  <div key={day} className="p-4 border-r border-border last:border-r-0">
                    <p className="text-center">{day}</p>
                  </div>
                ))}
              </div>

              {/* Timetable Grid */}
              <div className="relative">
                {/* Time slots */}
                {hours.map((hour, hourIndex) => (
                  <div key={hour} className="grid grid-cols-7 border-b border-border" style={{ height: "80px" }}>
                    <div className="p-2 border-r border-border bg-secondary/30">
                      <p className="text-xs text-muted-foreground">{formatTime(hour)}</p>
                    </div>
                    {days.map((day, dayIndex) => (
                      <div
                        key={`${day}-${hour}`}
                        className="border-r border-border last:border-r-0 hover:bg-secondary/30 transition-colors"
                      />
                    ))}
                  </div>
                ))}

                {/* Schedule blocks */}
                {days.map((day, dayIndex) => (
                  <div
                    key={`blocks-${day}`}
                    className="absolute top-0"
                    style={{
                      left: `${((dayIndex + 1) * 100) / 7}%`,
                      width: `${100 / 7}%`,
                    }}
                  >
                    {scheduleBlocks
                      .filter((block) => block.day === dayIndex + 1)
                      .map((block) => {
                        const { top, height } = getBlockPosition(block);
                        return (
                          <div
                            key={block.id}
                            className={`absolute ${block.color} text-white rounded-lg p-2 m-1 shadow-md cursor-pointer hover:shadow-lg transition-shadow overflow-hidden`}
                            style={{
                              top: `${top}px`,
                              height: `${height}px`,
                              left: "4px",
                              right: "4px",
                            }}
                          >
                            <p className="text-xs mb-1">{block.code}</p>
                            <p className="text-xs opacity-90">{block.subject}</p>
                            <p className="text-xs opacity-75 mt-1">{block.room}</p>
                            <p className="text-xs opacity-75">{block.instructor}</p>
                          </div>
                        );
                      })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <p className="text-sm text-muted-foreground">Major Subject</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-purple-500 rounded"></div>
            <p className="text-sm text-muted-foreground">Core Subject</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <p className="text-sm text-muted-foreground">GE Subject</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-500 rounded"></div>
            <p className="text-sm text-muted-foreground">Elective</p>
          </div>
        </div>
      </div>
    </div>
  );
}
