export interface SalaryRating {
  score: number;
  feedback: string;
  marketRange: string;
  recommendation: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  posted: string;
  description: string;
  requirements: string[];
  tags: string[];
  salaryRating?: SalaryRating;
}

export interface ResumeData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
  };
  experience: Array<{
    title: string;
    company: string;
    duration: string;
    description: string;
  }>;
  education: Array<{
    degree: string;
    school: string;
    year: string;
  }>;
  skills: string[];
}

export interface RatingResult {
  overallScore: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  matchPercentage: number;
  skillsMatch: string[];
  missingSkills: string[];
}


