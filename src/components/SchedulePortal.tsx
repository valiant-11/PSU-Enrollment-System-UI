import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Calendar, Clock, MapPin, User, CalendarX } from "lucide-react";
import { Student } from "../App";
import { allSubjects } from "../data/subjects";

interface ScheduleBlock {
  subject: string;
  code: string;
  instructor: string;
  room: string;
  day: number;
  startTime: number;
  endTime: number;
  color: string;
  type: string;
}

interface SchedulePortalProps {
  student: Student;
}

export function SchedulePortal({ student }: SchedulePortalProps) {
  // Parse schedules from enrolled subjects
  const parseSchedule = (schedule: string): { day: number; startTime: number; endTime: number }[] => {
    const result: { day: number; startTime: number; endTime: number }[] = [];
    
    // Parse schedule like "MWF 9:00-10:00 AM" or "TTh 1:00-2:30 PM"
    const dayMap: Record<string, number[]> = {
      'M': [1],
      'T': [2],
      'W': [3],
      'Th': [4],
      'F': [5],
      'MW': [1, 3],
      'MWF': [1, 3, 5],
      'TTh': [2, 4],
      'Sat': [6]
    };
    
    const parts = schedule.split(' ');
    const daysPart = parts[0];
    const timePart = parts.slice(1).join(' ');
    
    // Extract days
    const days = dayMap[daysPart] || [];
    
    // Extract time
    const timeMatch = timePart.match(/(\d+):(\d+)-(\d+):(\d+)\s*(AM|PM)/);
    if (timeMatch) {
      const [_, startHour, startMin, endHour, endMin, period] = timeMatch;
      let start = parseInt(startHour);
      let end = parseInt(endHour);
      
      if (period === 'PM' && start !== 12) start += 12;
      if (period === 'PM' && end !== 12) end += 12;
      if (period === 'AM' && start === 12) start = 0;
      if (period === 'AM' && end === 12) end = 0;
      
      const startTime = start + parseInt(startMin) / 60;
      const endTime = end + parseInt(endMin) / 60;
      
      days.forEach(day => {
        result.push({ day, startTime, endTime });
      });
    }
    
    return result;
  };

  // Generate schedule blocks from enrolled subjects
  const enrolledSubjectIds = student.enrolledSubjects || [];
  const enrolledSubjectDetails = allSubjects.filter(s => enrolledSubjectIds.includes(s.id));
  
  const scheduleBlocks: ScheduleBlock[] = [];
  const colors = ['bg-blue-500', 'bg-purple-500', 'bg-orange-500', 'bg-green-500', 'bg-pink-500', 'bg-teal-500', 'bg-indigo-500', 'bg-red-500'];
  
  enrolledSubjectDetails.forEach((subject, index) => {
    const color = colors[index % colors.length];
    const schedules = parseSchedule(subject.schedule);
    
    schedules.forEach(sch => {
      scheduleBlocks.push({
        subject: subject.description,
        code: subject.code,
        instructor: subject.instructor,
        room: `Room ${100 + index}`,
        day: sch.day,
        startTime: sch.startTime,
        endTime: sch.endTime,
        color,
        type: subject.type
      });
    });
  });

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const hours = Array.from({ length: 11 }, (_, i) => i + 7); // 7 AM to 5 PM

  const formatTime = (hour: number) => {
    const h = Math.floor(hour);
    const m = (hour % 1) * 60;
    const period = h >= 12 ? "PM" : "AM";
    const displayHour = h > 12 ? h - 12 : h === 0 ? 12 : h;
    return `${displayHour}:${m === 0 ? "00" : m} ${period}`;
  };

  const getBlockPosition = (block: ScheduleBlock) => {
    const top = ((block.startTime - 7) * 100) + 1;
    const height = (block.endTime - block.startTime) * 100 - 2;
    return { top, height };
  };

  // Get unique subjects for the list
  const uniqueSubjects = Array.from(
    new Map(scheduleBlocks.map(block => [block.code, block])).values()
  );

  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1>My Schedule</h1>
          <p className="text-muted-foreground">Academic Year 2024-2025 • 1st Semester</p>
        </div>

        {/* Subject List */}
        <Card className="p-6 shadow-md">
          <h3 className="mb-4">Enrolled Subjects</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {uniqueSubjects.map((block) => (
              <div 
                key={block.code}
                className="p-4 rounded-lg border-2 border-border hover:border-primary/50 transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-primary mb-1">{block.code}</p>
                    <p className="text-sm">{block.subject}</p>
                  </div>
                  <Badge className={`${
                    block.type === "Major" 
                      ? "bg-orange-100 text-orange-700" 
                      : block.type === "Core"
                      ? "bg-purple-100 text-purple-700"
                      : "bg-blue-100 text-blue-700"
                  }`}>
                    {block.type}
                  </Badge>
                </div>
                <div className="space-y-1 text-xs text-muted-foreground mt-3">
                  <div className="flex items-center gap-2">
                    <User className="h-3 w-3" />
                    <span>{block.instructor}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3 w-3" />
                    <span>{block.room}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Weekly Timetable */}
        <Card className="shadow-md overflow-hidden">
          <div className="p-4 bg-secondary border-b border-border">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <h3>Weekly Schedule</h3>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <div className="min-w-[900px]">
              {/* Header */}
              <div className="grid grid-cols-6 border-b border-border bg-secondary/50">
                <div className="p-3 border-r border-border">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </div>
                {days.map((day) => (
                  <div key={day} className="p-3 border-r border-border last:border-r-0 text-center">
                    <p className="text-sm">{day}</p>
                  </div>
                ))}
              </div>

              {/* Timetable Grid */}
              <div className="relative">
                {/* Time slots */}
                {hours.map((hour) => (
                  <div key={hour} className="grid grid-cols-6 border-b border-border" style={{ height: "100px" }}>
                    <div className="p-2 border-r border-border bg-secondary/20">
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
                      left: `${((dayIndex + 1) * 100) / 6}%`,
                      width: `${100 / 6}%`,
                    }}
                  >
                    {scheduleBlocks
                      .filter((block) => block.day === dayIndex + 1)
                      .map((block, blockIndex) => {
                        const { top, height } = getBlockPosition(block);
                        return (
                          <div
                            key={`${block.code}-${blockIndex}`}
                            className={`absolute ${block.color} text-white rounded-lg p-2 m-1 shadow-lg hover:shadow-xl transition-shadow overflow-hidden cursor-pointer`}
                            style={{
                              top: `${top}px`,
                              height: `${height}px`,
                              left: "4px",
                              right: "4px",
                            }}
                          >
                            <p className="text-xs mb-1">{block.code}</p>
                            <p className="text-xs opacity-90 mb-1">{block.subject}</p>
                            <p className="text-xs opacity-75">{block.room}</p>
                            <p className="text-xs opacity-75 mt-1">
                              {formatTime(block.startTime)} - {formatTime(block.endTime)}
                            </p>
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
        <div className="flex flex-wrap gap-4 justify-center">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-500 rounded"></div>
            <p className="text-sm text-muted-foreground">Major Subject</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-purple-500 rounded"></div>
            <p className="text-sm text-muted-foreground">Core Subject</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-pink-500 rounded"></div>
            <p className="text-sm text-muted-foreground">GE Subject</p>
          </div>
        </div>
      </div>
    </div>
  );
}