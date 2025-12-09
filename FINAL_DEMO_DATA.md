# ✅ DEMO DATA - STEP BY STEP

**Run each step one at a time - NOW WITH CORRECT GRADE COLUMNS!**

---

## 📋 Step 1: CREATE EXTENSION

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

✅ Run this first

---

## 📋 Step 2: INSERT USERS

```sql
INSERT INTO public.users (email, role, full_name, is_active) VALUES ('admin@psu.edu.ph', 'admin', 'Admin User', true) ON CONFLICT(email) DO NOTHING;
INSERT INTO public.users (email, role, full_name, is_active) VALUES ('faculty1@psu.edu.ph', 'faculty', 'Dr. Maria Santos', true) ON CONFLICT(email) DO NOTHING;
INSERT INTO public.users (email, role, full_name, is_active) VALUES ('student1@psu.edu.ph', 'student', 'Juan Dela Cruz', true) ON CONFLICT(email) DO NOTHING;
INSERT INTO public.users (email, role, full_name, is_active) VALUES ('student2@psu.edu.ph', 'student', 'Maria Garcia', true) ON CONFLICT(email) DO NOTHING;
```

✅ Run this

---

## 📋 Step 3: INSERT COURSES

```sql
INSERT INTO public.courses (course_code, course_name, description, duration_years, department, is_active) VALUES 
('CS101', 'Bachelor of Science in Computer Science', 'CS Program', 4, 'College of Science', true),
('ENG101', 'Bachelor of Science in Electronics Engineering', 'Engineering Program', 4, 'College of Engineering', true)
ON CONFLICT(course_code) DO NOTHING;
```

✅ Run this

---

## 📋 Step 4: INSERT SUBJECTS (CS1-101)

```sql
INSERT INTO public.subjects (subject_code, subject_name, description, units, year_level, semester, course_id, is_active)
SELECT 'CS1-101', 'Intro to Programming', 'Programming basics', 3, '1st Year', '1st Semester', c.id, true 
FROM courses c WHERE c.course_code = 'CS101' 
ON CONFLICT(subject_code) DO NOTHING;
```

✅ Run this

---

## 📋 Step 5: INSERT SUBJECTS (CS1-102)

```sql
INSERT INTO public.subjects (subject_code, subject_name, description, units, year_level, semester, course_id, is_active)
SELECT 'CS1-102', 'Discrete Math', 'Math fundamentals', 3, '1st Year', '1st Semester', c.id, true 
FROM courses c WHERE c.course_code = 'CS101' 
ON CONFLICT(subject_code) DO NOTHING;
```

✅ Run this

---

## 📋 Step 6: INSERT SUBJECTS (ENG1-101)

```sql
INSERT INTO public.subjects (subject_code, subject_name, description, units, year_level, semester, course_id, is_active)
SELECT 'ENG1-101', 'Circuit Analysis', 'Circuit fundamentals', 4, '1st Year', '1st Semester', c.id, true 
FROM courses c WHERE c.course_code = 'ENG101' 
ON CONFLICT(subject_code) DO NOTHING;
```

✅ Run this

---

## 📋 Step 7: INSERT STUDENT 1 (Juan)

```sql
INSERT INTO public.students (user_id, student_number, corp_email, full_name, birthdate, sex, address, personal_email, phone, course_id, year_level, enrollment_status)
SELECT u.id, 'PSU-2024-001', 'juan@psu.edu.ph', u.full_name, '2005-03-15', 'Male', '123 Main St', 'juan@email.com', '09123456789', c.id, '1st Year', 'active'
FROM users u, courses c WHERE u.email = 'student1@psu.edu.ph' AND c.course_code = 'CS101' 
ON CONFLICT(student_number) DO NOTHING;
```

✅ Run this

---

## 📋 Step 8: INSERT STUDENT 2 (Maria)

```sql
INSERT INTO public.students (user_id, student_number, corp_email, full_name, birthdate, sex, address, personal_email, phone, course_id, year_level, enrollment_status)
SELECT u.id, 'PSU-2024-002', 'maria@psu.edu.ph', u.full_name, '2005-07-22', 'Female', '456 Oak Ave', 'maria@email.com', '09198765432', c.id, '1st Year', 'active'
FROM users u, courses c WHERE u.email = 'student2@psu.edu.ph' AND c.course_code = 'ENG101' 
ON CONFLICT(student_number) DO NOTHING;
```

✅ Run this

---

## 📋 Step 9: ENROLL STUDENT 1 - CS1-101

```sql
INSERT INTO public.student_enrollments (student_id, subject_id, semester, academic_year, status)
SELECT s.id, sub.id, '1st Semester', '2024-2025', 'enrolled' 
FROM students s, subjects sub 
WHERE s.student_number = 'PSU-2024-001' AND sub.subject_code = 'CS1-101' 
ON CONFLICT DO NOTHING;
```

✅ Run this

---

## 📋 Step 10: ENROLL STUDENT 1 - CS1-102

```sql
INSERT INTO public.student_enrollments (student_id, subject_id, semester, academic_year, status)
SELECT s.id, sub.id, '1st Semester', '2024-2025', 'enrolled' 
FROM students s, subjects sub 
WHERE s.student_number = 'PSU-2024-001' AND sub.subject_code = 'CS1-102' 
ON CONFLICT DO NOTHING;
```

✅ Run this

---

## 📋 Step 11: ENROLL STUDENT 2 - ENG1-101

```sql
INSERT INTO public.student_enrollments (student_id, subject_id, semester, academic_year, status)
SELECT s.id, sub.id, '1st Semester', '2024-2025', 'enrolled' 
FROM students s, subjects sub 
WHERE s.student_number = 'PSU-2024-002' AND sub.subject_code = 'ENG1-101' 
ON CONFLICT DO NOTHING;
```

✅ Run this

---

## 📋 Step 12: ADD GRADE - Juan CS1-101

```sql
INSERT INTO public.grades (student_id, subject_id, enrollment_id, grade, remarks)
SELECT s.id, sub.id, se.id, '1.5', 'Good performance'
FROM students s, subjects sub, student_enrollments se
WHERE s.student_number = 'PSU-2024-001' 
  AND sub.subject_code = 'CS1-101' 
  AND se.student_id = s.id 
  AND se.subject_id = sub.id
ON CONFLICT DO NOTHING;
```

✅ Run this

---

## 📋 Step 13: ADD GRADE - Juan CS1-102

```sql
INSERT INTO public.grades (student_id, subject_id, enrollment_id, grade, remarks)
SELECT s.id, sub.id, se.id, '1.25', 'Excellent work'
FROM students s, subjects sub, student_enrollments se
WHERE s.student_number = 'PSU-2024-001' 
  AND sub.subject_code = 'CS1-102' 
  AND se.student_id = s.id 
  AND se.subject_id = sub.id
ON CONFLICT DO NOTHING;
```

✅ Run this

---

## 📋 Step 14: VERIFY DATA

```sql
SELECT 'Users' as metric, COUNT(*) as count FROM users WHERE email LIKE '%@psu.edu.ph'
UNION ALL SELECT 'Courses', COUNT(*) FROM courses
UNION ALL SELECT 'Subjects', COUNT(*) FROM subjects
UNION ALL SELECT 'Students', COUNT(*) FROM students
UNION ALL SELECT 'Enrollments', COUNT(*) FROM student_enrollments
UNION ALL SELECT 'Grades', COUNT(*) FROM grades;
```

✅ Run this to verify

---

## ✅ Expected Final Result:

```
metric      | count
------------|-------
Users       | 4
Courses     | 2
Subjects    | 3
Students    | 2
Enrollments | 3
Grades      | 2
```

---

## 🔑 Key Fix:

**Grades table requires `enrollment_id`** - it links to the student_enrollments table, not just student + subject.

---

**Run each step one at a time. This version is fully corrected!** 🚀
