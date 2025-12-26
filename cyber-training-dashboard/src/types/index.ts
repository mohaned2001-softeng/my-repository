export interface Lab {
  id?: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert' | string;
  category: string;
  image?: string | File | null;
  image_url?: string | null;
  writeup_url: string;
  skills?: string[];
  estimated_time: number;
  created_at?: string;
  updated_at?: string;
  author?: string | null;
}

export interface AddLabState extends Omit<Lab, 'id' | 'image_url' | 'updated_at'> { 
   created_at?: string;
}
export interface User {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  created_at: Date;
  password:string;
  is_verified: boolean;
  role: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
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
