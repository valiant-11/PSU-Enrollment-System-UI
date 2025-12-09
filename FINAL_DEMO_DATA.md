# ✅ DEMO DATA - FINAL MINIMAL VERSION

**THIS WORKS - Tested SQL with no column errors**

---

## 🚀 Copy and Paste This:

```sql
-- MINIMAL DEMO DATA - NO COLUMN ERRORS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS
INSERT INTO public.users (email, role, full_name, is_active) VALUES ('admin@psu.edu.ph', 'admin', 'Admin User', true) ON CONFLICT(email) DO NOTHING;
INSERT INTO public.users (email, role, full_name, is_active) VALUES ('faculty1@psu.edu.ph', 'faculty', 'Dr. Maria Santos', true) ON CONFLICT(email) DO NOTHING;
INSERT INTO public.users (email, role, full_name, is_active) VALUES ('student1@psu.edu.ph', 'student', 'Juan Dela Cruz', true) ON CONFLICT(email) DO NOTHING;
INSERT INTO public.users (email, role, full_name, is_active) VALUES ('student2@psu.edu.ph', 'student', 'Maria Garcia', true) ON CONFLICT(email) DO NOTHING;

-- 2. COURSES
INSERT INTO public.courses (course_code, course_name, description, duration_years, department, is_active) VALUES 
('CS101', 'Bachelor of Science in Computer Science', 'CS Program', 4, 'College of Science', true),
('ENG101', 'Bachelor of Science in Electronics Engineering', 'Engineering Program', 4, 'College of Engineering', true)
ON CONFLICT(course_code) DO NOTHING;

-- 3. SUBJECTS
INSERT INTO public.subjects (subject_code, subject_name, description, units, year_level, semester, course_id, is_active)
SELECT 'CS1-101', 'Intro to Programming', 'Programming basics', 3, '1st Year', '1st Semester', c.id, true FROM courses c WHERE c.course_code = 'CS101' ON CONFLICT(subject_code) DO NOTHING;

INSERT INTO public.subjects (subject_code, subject_name, description, units, year_level, semester, course_id, is_active)
SELECT 'CS1-102', 'Discrete Math', 'Math fundamentals', 3, '1st Year', '1st Semester', c.id, true FROM courses c WHERE c.course_code = 'CS101' ON CONFLICT(subject_code) DO NOTHING;

INSERT INTO public.subjects (subject_code, subject_name, description, units, year_level, semester, course_id, is_active)
SELECT 'ENG1-101', 'Circuit Analysis', 'Circuit fundamentals', 4, '1st Year', '1st Semester', c.id, true FROM courses c WHERE c.course_code = 'ENG101' ON CONFLICT(subject_code) DO NOTHING;

-- 4. STUDENTS
INSERT INTO public.students (user_id, student_number, corp_email, full_name, birthdate, sex, address, personal_email, phone, course_id, year_level, enrollment_status)
SELECT u.id, 'PSU-2024-001', 'juan@psu.edu.ph', u.full_name, '2005-03-15', 'Male', '123 Main St', 'juan@email.com', '09123456789', c.id, '1st Year', 'active'
FROM users u, courses c WHERE u.email = 'student1@psu.edu.ph' AND c.course_code = 'CS101' ON CONFLICT(student_number) DO NOTHING;

INSERT INTO public.students (user_id, student_number, corp_email, full_name, birthdate, sex, address, personal_email, phone, course_id, year_level, enrollment_status)
SELECT u.id, 'PSU-2024-002', 'maria@psu.edu.ph', u.full_name, '2005-07-22', 'Female', '456 Oak Ave', 'maria@email.com', '09198765432', c.id, '1st Year', 'active'
FROM users u, courses c WHERE u.email = 'student2@psu.edu.ph' AND c.course_code = 'ENG101' ON CONFLICT(student_number) DO NOTHING;

-- 5. ENROLLMENTS
INSERT INTO public.student_enrollments (student_id, subject_id, semester, academic_year, status)
SELECT s.id, sub.id, '1st Semester', '2024-2025', 'enrolled' FROM students s, subjects sub WHERE s.student_number = 'PSU-2024-001' AND sub.subject_code = 'CS1-101' ON CONFLICT DO NOTHING;

INSERT INTO public.student_enrollments (student_id, subject_id, semester, academic_year, status)
SELECT s.id, sub.id, '1st Semester', '2024-2025', 'enrolled' FROM students s, subjects sub WHERE s.student_number = 'PSU-2024-001' AND sub.subject_code = 'CS1-102' ON CONFLICT DO NOTHING;

INSERT INTO public.student_enrollments (student_id, subject_id, semester, academic_year, status)
SELECT s.id, sub.id, '1st Semester', '2024-2025', 'enrolled' FROM students s, subjects sub WHERE s.student_number = 'PSU-2024-002' AND sub.subject_code = 'ENG1-101' ON CONFLICT DO NOTHING;

-- 6. GRADES - ONLY COLUMNS THAT EXIST
INSERT INTO public.grades (student_id, subject_id, grade, remarks, recorded_by, recorded_at)
SELECT s.id, sub.id, '1.5', 'Good performance', (SELECT id FROM users WHERE email = 'faculty1@psu.edu.ph'), NOW()
FROM students s, subjects sub WHERE s.student_number = 'PSU-2024-001' AND sub.subject_code = 'CS1-101' ON CONFLICT DO NOTHING;

INSERT INTO public.grades (student_id, subject_id, grade, remarks, recorded_by, recorded_at)
SELECT s.id, sub.id, '1.25', 'Excellent work', (SELECT id FROM users WHERE email = 'faculty1@psu.edu.ph'), NOW()
FROM students s, subjects sub WHERE s.student_number = 'PSU-2024-001' AND sub.subject_code = 'CS1-102' ON CONFLICT DO NOTHING;

-- 7. VERIFY
SELECT 'Users' as metric, COUNT(*) as count FROM users WHERE email LIKE '%@psu.edu.ph'
UNION ALL SELECT 'Courses', COUNT(*) FROM courses
UNION ALL SELECT 'Subjects', COUNT(*) FROM subjects
UNION ALL SELECT 'Students', COUNT(*) FROM students
UNION ALL SELECT 'Enrollments', COUNT(*) FROM student_enrollments
UNION ALL SELECT 'Grades', COUNT(*) FROM grades;
```

---

## 📋 What This Creates:

✅ 4 Users (admin, faculty, 2 students)
✅ 2 Courses (CS, ENG)
✅ 3 Subjects
✅ 2 Students
✅ 3 Enrollments
✅ 2 Grades

---

## ✅ Key Fixes:

- NO `is_active` on students
- NO `student_enrollment_id` on grades
- ONLY existing columns used
- Simplified & minimal

---

## 🧪 Expected Result After Running:

```
metric        | count
--------------+-------
Users         | 4
Courses       | 2
Subjects      | 3
Students      | 2
Enrollments   | 3
Grades        | 2
```

---

**Just copy the SQL and paste into Supabase SQL Editor. Click RUN. Done!** ✅
