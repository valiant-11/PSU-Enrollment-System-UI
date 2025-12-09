# ✅ DEMO DATA SETUP - AUTO-GENERATED UUIDs (FINAL VERSION)

**CORRECTED: Removed `is_active` from students table (column doesn't exist)**

---

## 🚀 How to Use:

1. Go to Supabase Dashboard → SQL Editor
2. Create new query
3. Copy ALL the SQL below
4. Paste into the editor
5. Click "RUN"
6. Done! ✅

---

## 📋 COMPLETE SQL - COPY ALL OF THIS

```sql
-- ============================================
-- DEMO DATA SETUP FOR PSU ENROLLMENT SYSTEM
-- ============================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. INSERT USERS (with auto-generated UUIDs)
-- ============================================

-- Admin User
INSERT INTO public.users (email, role, full_name, is_active)
VALUES ('admin@psu.edu.ph', 'admin', 'Admin User', true)
ON CONFLICT(email) DO NOTHING;

-- Faculty User
INSERT INTO public.users (email, role, full_name, is_active)
VALUES ('faculty1@psu.edu.ph', 'faculty', 'Dr. Maria Santos', true)
ON CONFLICT(email) DO NOTHING;

-- Registrar User
INSERT INTO public.users (email, role, full_name, is_active)
VALUES ('registrar@psu.edu.ph', 'registrar', 'Registrar Office', true)
ON CONFLICT(email) DO NOTHING;

-- Student User 1
INSERT INTO public.users (email, role, full_name, is_active)
VALUES ('student1@psu.edu.ph', 'student', 'Juan Dela Cruz', true)
ON CONFLICT(email) DO NOTHING;

-- Student User 2
INSERT INTO public.users (email, role, full_name, is_active)
VALUES ('student2@psu.edu.ph', 'student', 'Maria Garcia', true)
ON CONFLICT(email) DO NOTHING;

-- ============================================
-- 2. INSERT COURSES
-- ============================================

INSERT INTO public.courses (course_code, course_name, description, duration_years, department, is_active)
VALUES 
  ('CS101', 'Bachelor of Science in Computer Science', 'A comprehensive program in computer science fundamentals and applications', 4, 'College of Science', true),
  ('ENG101', 'Bachelor of Science in Electronics Engineering', 'Electronics engineering program with advanced circuit design', 4, 'College of Engineering', true),
  ('BUS101', 'Bachelor of Science in Business Administration', 'Business management and entrepreneurship program', 4, 'College of Business', true)
ON CONFLICT(course_code) DO NOTHING;

-- ============================================
-- 3. INSERT SUBJECTS
-- ============================================

-- CS101 Subjects - 1st Year, 1st Semester
INSERT INTO public.subjects (subject_code, subject_name, description, units, year_level, semester, course_id, is_active)
SELECT 'CS1-101', 'Introduction to Programming', 'Learn programming fundamentals using Python', 3, '1st Year', '1st Semester', c.id, true
FROM courses c WHERE c.course_code = 'CS101'
ON CONFLICT(subject_code) DO NOTHING;

INSERT INTO public.subjects (subject_code, subject_name, description, units, year_level, semester, course_id, is_active)
SELECT 'CS1-102', 'Discrete Mathematics', 'Fundamentals of discrete mathematics for CS', 3, '1st Year', '1st Semester', c.id, true
FROM courses c WHERE c.course_code = 'CS101'
ON CONFLICT(subject_code) DO NOTHING;

-- CS101 Subjects - 1st Year, 2nd Semester
INSERT INTO public.subjects (subject_code, subject_name, description, units, year_level, semester, course_id, is_active)
SELECT 'CS1-201', 'Data Structures', 'Understanding arrays, linked lists, trees, and graphs', 4, '1st Year', '2nd Semester', c.id, true
FROM courses c WHERE c.course_code = 'CS101'
ON CONFLICT(subject_code) DO NOTHING;

INSERT INTO public.subjects (subject_code, subject_name, description, units, year_level, semester, course_id, is_active)
SELECT 'CS1-202', 'Digital Logic', 'Boolean algebra and digital circuit design', 3, '1st Year', '2nd Semester', c.id, true
FROM courses c WHERE c.course_code = 'CS101'
ON CONFLICT(subject_code) DO NOTHING;

-- ENG101 Subjects
INSERT INTO public.subjects (subject_code, subject_name, description, units, year_level, semester, course_id, is_active)
SELECT 'ENG1-101', 'Circuit Analysis', 'AC and DC circuit analysis fundamentals', 4, '1st Year', '1st Semester', c.id, true
FROM courses c WHERE c.course_code = 'ENG101'
ON CONFLICT(subject_code) DO NOTHING;

-- ============================================
-- 4. CREATE STUDENTS (linked to Users)
-- FIXED: Removed is_active column (doesn't exist in students table)
-- ============================================

-- Student 1: Juan Dela Cruz
INSERT INTO public.students (user_id, student_number, corp_email, full_name, birthdate, sex, address, personal_email, phone, course_id, year_level, last_school, strand, year_graduated, enrollment_status)
SELECT u.id, 'PSU-2024-001', 'juan.delacruz@psu.edu.ph', u.full_name, '2005-03-15', 'Male', '123 Main St, Palawan', 'juan.personal@email.com', '09123456789', c.id, '1st Year', 'Palawan National High School', 'STEM', '2023', 'active'
FROM users u, courses c
WHERE u.email = 'student1@psu.edu.ph' AND c.course_code = 'CS101'
ON CONFLICT(student_number) DO NOTHING;

-- Student 2: Maria Garcia
INSERT INTO public.students (user_id, student_number, corp_email, full_name, birthdate, sex, address, personal_email, phone, course_id, year_level, last_school, strand, year_graduated, enrollment_status)
SELECT u.id, 'PSU-2024-002', 'maria.garcia@psu.edu.ph', u.full_name, '2005-07-22', 'Female', '456 Oak Ave, Palawan', 'maria.personal@email.com', '09198765432', c.id, '1st Year', 'Santo Nino High School', 'STEM', '2023', 'active'
FROM users u, courses c
WHERE u.email = 'student2@psu.edu.ph' AND c.course_code = 'ENG101'
ON CONFLICT(student_number) DO NOTHING;

-- ============================================
-- 5. CREATE ENROLLMENTS (Students enroll in subjects)
-- ============================================

-- Juan enrolls in CS subjects
INSERT INTO public.student_enrollments (student_id, subject_id, semester, academic_year, status)
SELECT s.id, sub.id, '1st Semester', '2024-2025', 'enrolled'
FROM students s, subjects sub, courses c
WHERE s.student_number = 'PSU-2024-001' AND sub.subject_code = 'CS1-101' AND sub.course_id = c.id
ON CONFLICT DO NOTHING;

INSERT INTO public.student_enrollments (student_id, subject_id, semester, academic_year, status)
SELECT s.id, sub.id, '1st Semester', '2024-2025', 'enrolled'
FROM students s, subjects sub, courses c
WHERE s.student_number = 'PSU-2024-001' AND sub.subject_code = 'CS1-102' AND sub.course_id = c.id
ON CONFLICT DO NOTHING;

-- Maria enrolls in ENG subjects
INSERT INTO public.student_enrollments (student_id, subject_id, semester, academic_year, status)
SELECT s.id, sub.id, '1st Semester', '2024-2025', 'enrolled'
FROM students s, subjects sub, courses c
WHERE s.student_number = 'PSU-2024-002' AND sub.subject_code = 'ENG1-101' AND sub.course_id = c.id
ON CONFLICT DO NOTHING;

-- ============================================
-- 6. CREATE ENROLLMENT APPROVALS
-- ============================================

INSERT INTO public.enrollment_approvals (student_enrollment_id, student_id, status, requested_at)
SELECT se.id, se.student_id, 'approved', NOW()
FROM student_enrollments se
WHERE se.status = 'enrolled'
ON CONFLICT DO NOTHING;

-- ============================================
-- 7. ADD SAMPLE GRADES
-- ============================================

INSERT INTO public.grades (student_id, subject_id, student_enrollment_id, grade, remarks, recorded_by, recorded_at)
SELECT s.id, sub.id, se.id, '1.5', 'Good performance', (SELECT id FROM users WHERE email = 'faculty1@psu.edu.ph'), NOW()
FROM students s, subjects sub, student_enrollments se
WHERE s.student_number = 'PSU-2024-001' AND sub.subject_code = 'CS1-101' AND se.student_id = s.id AND se.subject_id = sub.id
ON CONFLICT DO NOTHING;

INSERT INTO public.grades (student_id, subject_id, student_enrollment_id, grade, remarks, recorded_by, recorded_at)
SELECT s.id, sub.id, se.id, '1.25', 'Excellent work', (SELECT id FROM users WHERE email = 'faculty1@psu.edu.ph'), NOW()
FROM students s, subjects sub, student_enrollments se
WHERE s.student_number = 'PSU-2024-001' AND sub.subject_code = 'CS1-102' AND se.student_id = s.id AND se.subject_id = sub.id
ON CONFLICT DO NOTHING;

-- ============================================
-- 8. ADD SAMPLE PAYMENTS
-- ============================================

INSERT INTO public.payments (student_id, amount, payment_method, status, reference_number, description, payment_date)
SELECT s.id, 5000.00, 'online', 'completed', 'REF-' || LPAD((RANDOM() * 1000000)::int::text, 6, '0'), 'Tuition Payment - 1st Semester 2024-2025', NOW() - INTERVAL '10 days'
FROM students s WHERE s.student_number = 'PSU-2024-001'
ON CONFLICT DO NOTHING;

INSERT INTO public.payments (student_id, amount, payment_method, status, reference_number, description, payment_date)
SELECT s.id, 5000.00, 'online', 'completed', 'REF-' || LPAD((RANDOM() * 1000000)::int::text, 6, '0'), 'Tuition Payment - 1st Semester 2024-2025', NOW() - INTERVAL '5 days'
FROM students s WHERE s.student_number = 'PSU-2024-002'
ON CONFLICT DO NOTHING;

-- ============================================
-- 9. VERIFY DATA WAS INSERTED
-- ============================================

-- Check users
SELECT 'Users' as table_name, COUNT(*) as total_records FROM users WHERE role IN ('admin', 'student', 'faculty', 'registrar')
UNION ALL
-- Check courses
SELECT 'Courses', COUNT(*) FROM courses WHERE is_active = true
UNION ALL
-- Check subjects
SELECT 'Subjects', COUNT(*) FROM subjects WHERE is_active = true
UNION ALL
-- Check students
SELECT 'Students', COUNT(*) FROM students
UNION ALL
-- Check enrollments
SELECT 'Enrollments', COUNT(*) FROM student_enrollments
UNION ALL
-- Check grades
SELECT 'Grades', COUNT(*) FROM grades
UNION ALL
-- Check payments
SELECT 'Payments', COUNT(*) FROM payments;
```

---

## ✅ What Gets Created:

```
✅ 5 Users
   - 1 Admin (admin@psu.edu.ph)
   - 1 Faculty (faculty1@psu.edu.ph)
   - 1 Registrar (registrar@psu.edu.ph)
   - 2 Students (student1@, student2@)

✅ 3 Courses
   - Computer Science
   - Electronics Engineering
   - Business Administration

✅ 5 Subjects
   - 4 CS subjects
   - 1 ENG subject

✅ 2 Students (linked to users)
   - Juan Dela Cruz (CS major)
   - Maria Garcia (ENG major)

✅ 3 Enrollments
   - Juan → CS subjects
   - Maria → ENG subject

✅ 2 Grades
   - Juan's grades for 2 subjects

✅ 2 Payments
   - Payment from each student
```

---

## 🧪 After Running:

You can immediately login with:

```
Admin:
  Email: admin@psu.edu.ph
  Password: (set in your auth system)

Student 1:
  Email: student1@psu.edu.ph
  Password: (set in your auth system)

Student 2:
  Email: student2@psu.edu.ph
  Password: (set in your auth system)
```

---

## ⚠️ If You Get Any Errors:

### Error: "duplicate key value violates unique constraint"
**Solution:** The data already exists. Just run the verification query to check.

### Error: "column does not exist"
**Solution:** Column name doesn't match your schema. This version is corrected.

### Error: "relation does not exist"
**Solution:** Make sure the database schema is created first.

---

## 📊 Verify It Worked:

Run this query to check:

```sql
-- See all demo data
SELECT 'Users' as "Data Type", COUNT(*) as "Count" FROM users WHERE email LIKE '%@psu.edu.ph'
UNION ALL
SELECT 'Courses', COUNT(*) FROM courses
UNION ALL
SELECT 'Subjects', COUNT(*) FROM subjects
UNION ALL
SELECT 'Students', COUNT(*) FROM students
UNION ALL
SELECT 'Enrollments', COUNT(*) FROM student_enrollments
UNION ALL
SELECT 'Grades', COUNT(*) FROM grades
UNION ALL
SELECT 'Payments', COUNT(*) FROM payments;
```

Expected result:
```
Data Type       | Count
----------------|-------
Users           | 5
Courses         | 3
Subjects        | 5
Students        | 2
Enrollments     | 3
Grades          | 2
Payments        | 2
```

---

## 🎯 Next Steps:

1. ✅ Run this SQL (final corrected version)
2. ✅ Verify data appears
3. ✅ Test login with `student1@psu.edu.ph`
4. ✅ Test admin with `admin@psu.edu.ph`
5. ✅ Try enrolling in a subject
6. ✅ Test admin approval

---

**This version matches your actual database schema!** ✅
