import { DateToSystemTimezoneSetter } from "node_modules/date-fns/parse/_lib/Setter";

export interface Lab {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  category: string;
  image: string;
  writeupUrl: string;
  skills: string[];
  estimatedTime: string;
}

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  created_at: Date;
  is_verified: boolean;
}

export interface RegisterState {
  email: string;
  password: string;
  fullName: string;
}
export interface LabProgress {
  id: string;
  user_id: string;
  lab_id: string;
  status: 'not_started' | 'in_progress' | 'completed';
  started_at: string | null;
  completed_at: string | null;
}
