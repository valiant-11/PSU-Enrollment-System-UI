import { supabase } from '../supabase';

// ==========================================
// STUDENT AUTHENTICATION & PROFILE
// ==========================================

export async function getStudentUser(email: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .eq('role', 'student')
    .single();
  return { data, error };
}

export async function createStudentUser(email: string, fullName: string) {
  const { data, error } = await supabase
    .from('users')
    .insert([{
      email,
      full_name: fullName,
      role: 'student',
      is_active: true
    }])
    .select()
    .single();
  return { data, error };
}

export async function getStudentProfile(userId: string) {
  const { data, error } = await supabase
    .from('students')
    .select('*, courses(id, course_code, course_name, duration_years)')
    .eq('user_id', userId)
    .single();
  return { data, error };
}

export async function updateStudentProfile(studentId: string, updates: any) {
  const { data, error } = await supabase
    .from('students')
    .update(updates)
    .eq('id', studentId)
    .select()
    .single();
  return { data, error };
}

// ==========================================
// STUDENT ENROLLMENT PORTAL
// ==========================================

export async function getAvailableSubjects(courseId: string, yearLevel: string, semester: string) {
  const { data, error } = await supabase
    .from('subjects')
    .select('*')
    .eq('course_id', courseId)
    .eq('year_level', yearLevel)
    .eq('semester', semester)
    .eq('is_active', true);
  return { data, error };
}

export async function getStudentCurrentEnrollments(studentId: string, academicYear: string) {
  const { data, error } = await supabase
    .from('student_enrollments')
    .select(`
      id,
      semester,
      academic_year,
      status,
      subjects(
        id,
        subject_code,
        subject_name,
        units,
        year_level
      ),
      enrollment_approvals(
        id,
        status,
        requested_at
      )
    `)
    .eq('student_id', studentId)
    .eq('academic_year', academicYear)
    .order('semester', { ascending: true });
  return { data, error };
}

export async function enrollInSubject(studentId: string, subjectId: string, semester: string, academicYear: string) {
  // Create enrollment
  const { data: enrollmentData, error: enrollmentError } = await supabase
    .from('student_enrollments')
    .insert([{
      student_id: studentId,
      subject_id: subjectId,
      semester,
      academic_year: academicYear,
      status: 'enrolled'
    }])
    .select()
    .single();

  if (enrollmentError) return { data: null, error: enrollmentError };

  // Create approval record (will be pending)
  await supabase
    .from('enrollment_approvals')
    .insert([{
      student_enrollment_id: enrollmentData.id,
      student_id: studentId,
      status: 'pending'
    }]);

  return { data: enrollmentData, error: null };
}

export async function dropSubject(enrollmentId: string) {
  const { data, error } = await supabase
    .from('student_enrollments')
    .update({ status: 'dropped' })
    .eq('id', enrollmentId)
    .select()
    .single();
  return { data, error };
}

export async function getEnrollmentStatus(enrollmentId: string) {
  const { data, error } = await supabase
    .from('student_enrollments')
    .select(`
      id,
      status,
      subjects(subject_code, subject_name),
      enrollment_approvals(
        id,
        status,
        rejection_reason,
        processed_at
      )
    `)
    .eq('id', enrollmentId)
    .single();
  return { data, error };
}

// ==========================================
// STUDENT GRADES & ACADEMIC RECORDS
// ==========================================

export async function getStudentGrades(studentId: string) {
  const { data, error } = await supabase
    .from('grades')
    .select(`
      id,
      grade,
      remarks,
      recorded_at,
      subjects(
        id,
        subject_code,
        subject_name,
        units
      ),
      student_enrollments(
        id,
        semester,
        academic_year
      )
    `)
    .eq('student_id', studentId)
    .order('recorded_at', { ascending: false });
  return { data, error };
}

export async function getGradesBySemester(studentId: string, academicYear: string, semester: string) {
  const { data, error } = await supabase
    .from('grades')
    .select(`
      id,
      grade,
      remarks,
      subjects(
        subject_code,
        subject_name,
        units
      )
    `)
    .eq('student_id', studentId)
    .eq('student_enrollments.academic_year', academicYear)
    .eq('student_enrollments.semester', semester);
  return { data, error };
}

export async function getStudentTranscript(studentId: string) {
  const { data, error } = await supabase
    .from('grades')
    .select(`
      id,
      grade,
      remarks,
      subjects(
        subject_code,
        subject_name,
        units,
        year_level
      ),
      student_enrollments(
        semester,
        academic_year
      )
    `)
    .eq('student_id', studentId)
    .order('recorded_at', { ascending: false });
  return { data, error };
}

// ==========================================
// STUDENT PAYMENT & FEES
// ==========================================

export async function recordStudentPayment(studentId: string, amount: number, paymentMethod: string, referenceNumber?: string, description?: string) {
  const { data, error } = await supabase
    .from('payments')
    .insert([{
      student_id: studentId,
      amount,
      payment_method: paymentMethod,
      reference_number: referenceNumber,
      description,
      status: 'completed',
      payment_date: new Date().toISOString()
    }])
    .select()
    .single();
  return { data, error };
}

export async function getStudentPayments(studentId: string) {
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('student_id', studentId)
    .order('payment_date', { ascending: false });
  return { data, error };
}

export async function getPaymentHistory(studentId: string, academicYear?: string) {
  let query = supabase
    .from('payments')
    .select('*')
    .eq('student_id', studentId);

  if (academicYear) {
    // Note: You might need to add academic_year field to payments table
    query = query.eq('description', `Tuition for ${academicYear}`);
  }

  const { data, error } = await query.order('payment_date', { ascending: false });
  return { data, error };
}

export async function getPaymentStats(studentId: string) {
  const { data, error } = await supabase
    .from('payments')
    .select('amount')
    .eq('student_id', studentId)
    .eq('status', 'completed');

  if (error) return { totalPaid: 0, paymentCount: 0, error };

  const totalPaid = data?.reduce((sum, p) => sum + p.amount, 0) || 0;
  return { totalPaid, paymentCount: data?.length || 0, error: null };
}

// ==========================================
// STUDENT DOCUMENTS
// ==========================================

export async function uploadStudentDocument(studentId: string, documentType: string, fileUrl: string, filePath: string) {
  const { data, error } = await supabase
    .from('documents')
    .insert([{
      student_id: studentId,
      document_type: documentType,
      file_url: fileUrl,
      file_path: filePath,
      is_verified: false,
      upload_date: new Date().toISOString()
    }])
    .select()
    .single();
  return { data, error };
}

export async function getStudentDocuments(studentId: string) {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('student_id', studentId)
    .order('upload_date', { ascending: false });
  return { data, error };
}

export async function getDocumentByType(studentId: string, documentType: string) {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('student_id', studentId)
    .eq('document_type', documentType)
    .single();
  return { data, error };
}

export async function deleteDocument(documentId: string) {
  const { error } = await supabase
    .from('documents')
    .delete()
    .eq('id', documentId);
  return { error };
}

// ==========================================
// COURSE SHIFTING
// ==========================================

export async function requestCourseShift(studentId: string, fromCourseId: string, toCourseId: string, reason: string) {
  const { data, error } = await supabase
    .from('shifting_requests')
    .insert([{
      student_id: studentId,
      from_course_id: fromCourseId,
      to_course_id: toCourseId,
      reason,
      status: 'pending',
      requested_at: new Date().toISOString()
    }])
    .select()
    .single();
  return { data, error };
}

export async function getStudentShiftingRequest(studentId: string) {
  const { data, error } = await supabase
    .from('shifting_requests')
    .select(`
      *,
      from_course:courses!from_course_id(course_code, course_name),
      to_course:courses!to_course_id(course_code, course_name)
    `)
    .eq('student_id', studentId)
    .order('requested_at', { ascending: false })
    .limit(1)
    .single();
  return { data, error };
}

export async function getAllShiftingRequests(studentId: string) {
  const { data, error } = await supabase
    .from('shifting_requests')
    .select(`
      *,
      from_course:courses!from_course_id(course_code, course_name),
      to_course:courses!to_course_id(course_code, course_name)
    `)
    .eq('student_id', studentId)
    .order('requested_at', { ascending: false });
  return { data, error };
}

// ==========================================
// CLASS SCHEDULE
// ==========================================

export async function getStudentSchedule(studentId: string, academicYear: string) {
  const { data, error } = await supabase
    .from('student_enrollments')
    .select(`
      id,
      semester,
      status,
      subjects(
        id,
        subject_code,
        subject_name,
        units,
        year_level
      )
    `)
    .eq('student_id', studentId)
    .eq('academic_year', academicYear)
    .eq('status', 'enrolled')
    .order('semester', { ascending: true });
  return { data, error };
}

// ==========================================
// COURSES AVAILABLE
// ==========================================

export async function getAllCourses() {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('is_active', true)
    .order('course_code', { ascending: true });
  return { data, error };
}

export async function getCourseById(courseId: string) {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('id', courseId)
    .single();
  return { data, error };
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

export async function getTotalEnrolledUnits(studentId: string, academicYear: string, semester: string) {
  const { data, error } = await supabase
    .from('student_enrollments')
    .select(`
      subjects(
        units
      )
    `)
    .eq('student_id', studentId)
    .eq('academic_year', academicYear)
    .eq('semester', semester)
    .eq('status', 'enrolled');

  if (error) return { totalUnits: 0, error };

  const totalUnits = data?.reduce((sum: number, se: any) => {
    return sum + (se.subjects?.units || 0);
  }, 0) || 0;

  return { totalUnits, error: null };
}

export async function getStudentStats(studentId: string) {
  // Get enrollment count
  const { data: enrollments } = await supabase
    .from('student_enrollments')
    .select('id', { count: 'exact', head: true })
    .eq('student_id', studentId)
    .eq('status', 'enrolled');

  // Get payment stats
  const { data: payments } = await supabase
    .from('payments')
    .select('amount')
    .eq('student_id', studentId)
    .eq('status', 'completed');

  // Get grades count
  const { data: grades } = await supabase
    .from('grades')
    .select('id', { count: 'exact', head: true })
    .eq('student_id', studentId);

  const totalPaid = payments?.reduce((sum, p) => sum + p.amount, 0) || 0;

  return {
    enrollmentCount: enrollments?.length || 0,
    totalPaid,
    paymentCount: payments?.length || 0,
    gradeCount: grades?.length || 0
  };
}
