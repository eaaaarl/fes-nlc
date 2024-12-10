export interface QuestionScore {
  rating: number;
  normalizedValue: number;
}

export interface CategoryBreakdown {
  averageRating: string;
  normalizedValue: string;
  weightedAverage: string;
  weight: string;
}

export interface FacultyEvaluationResult {
  facultyId: string;
  facultyName: string;
  facultyDepartment: string;
  totalEvaluators: number;
  breakdown: Record<string, CategoryBreakdown>;
  totalScore: string;
}

export interface DashboardStats {
  totalUsers: number;
  totalFaculty: number;
  totalStudents: number;
  totalSubjects: number;
  totalEvaluated: number;
  currentSemester: string;
}
