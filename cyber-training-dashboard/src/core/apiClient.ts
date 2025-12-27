import axios from 'axios';
import { AddLabState, Lab, RegisterState, User } from '../types';
import { jwtDecode } from 'jwt-decode';
import { Fullscreen } from 'lucide-react';
const apiClient = axios.create({
  baseURL: 'http://localhost:8000', // Replace with your backend API URL
  headers: {
    'Content-Type': 'application/json',
  },
});

type LabLike = AddLabState | Lab;

const prepareLabRequest = (labData: LabLike, includeId = false) => {
  const basePayload: Record<string, unknown> = {
    title: labData.title,
    description: labData.description,
    difficulty: labData.difficulty,
    category: labData.category,
    writeup_url: labData.writeup_url ?? '',
    estimated_time: labData.estimated_time,
    skills: Array.isArray(labData.skills) ? labData.skills : [],
  };

  if (includeId && 'id' in labData) {
    basePayload.id = labData.id;
  }

  if (labData.image instanceof File) {
    const formData = new FormData();
    Object.entries(basePayload).forEach(([key, value]) => {
      if (value === undefined || value === null) {
        return;
      }
      if (key === 'skills') {
        formData.append(key, JSON.stringify(value));
        return;
      }
      if (key === 'estimated_time' && typeof value === 'number') {
        formData.append(key, value.toString());
        return;
      }
      formData.append(key, String(value));
    });
    formData.append('image', labData.image);
    return { body: formData, isMultipart: true } as const;
  }

  return {
    body: {
      ...basePayload,
      image: null,
    },
    isMultipart: false,
  } as const;
};

export const loginAPIClient = async (email: string, password: string) => {
  return await apiClient.post('/auth/login/', {identifier: email, password });
}

export const registerAPIClient = async (user:User) => {
  return await apiClient.post('/auth/register/', { email: user.email, password: user.password,  fullName: user.full_name });
}

export const sendOTPAPIClient = async (email: string) => {
  return await apiClient.post('/auth/send-otp/', { email });
}

export const sendForgotPasswordOTPAPIClient = async (email: string) => {
  return await apiClient.post('/auth/forgot-password/send-otp/', { email });
}

export const verifyOTPAPIClient = async (user: string, otpCode: string) => {
  return await apiClient.post('/auth/verify-otp/', { email:user, otp: otpCode });
}

export const getUserAPIClient = async (token: string) => {
  return await apiClient.get('/auth/user/', {
    headers: {  
        Authorization: `Bearer ${token}`,
    },
    });
}

export const logoutAPIClient = async (refresh_token: string , access_token: string)  => {
  return await apiClient.post('/auth/logout/', {refresh_token}, {
    headers:{
      Authorization: `Bearer ${access_token}`,
    }
  });
}
export const editUserAPIClient = async (access_token: string,email:string,  fullName: string , bio: string , avatar_url: string) => {
  return await apiClient.put('/auth/edit-user/', { full_name: fullName, email,  bio, avatar_url:"" }, {
    headers: { 
        'Content-Type': 'application/json',    
        Authorization: `Bearer ${access_token}`,
    },
    });
}

export const setPasswordAPIClient = async (email: string, password: string , confirmPassword: string) => {
  return await apiClient.post('/auth/set-password/', {email, password, confirm_password:confirmPassword });
}

export const addLabAPIClient = async (token: string, labData: AddLabState) => {
  const { body, isMultipart } = prepareLabRequest(labData);
  return await apiClient.post('/lab/add-lab/', body , {
    headers:{
      Authorization:`Bearer ${token}`,
      'Content-Type': isMultipart ? 'multipart/form-data' : 'application/json',
    }
  });
}


export const updateLabAPIClient = async (token: string, labId: string, labData: Lab) => {
  const { body, isMultipart } = prepareLabRequest(labData, true);
  return await apiClient.put(`/lab/edit-lab/${labId}/`, body , {
    headers: {
       Authorization: `Bearer ${token}`,
       'Content-Type': isMultipart ? 'multipart/form-data' : 'application/json',
    },
  });
}

export const deleteLabAPIClient = async (token: string, labId: string) => {
  return await apiClient.delete(`/lab/delete-lab/${labId}/`,  { 
    headers: { Authorization: `Bearer ${token}` } });
}

export const getAllLabsAPIClient = async () => {
  return await apiClient.get('/lab/fetch-labs/');
}


export const getTeacherLabsAPIClient = async ( token: string) => {
  return await apiClient.get(`/lab/fetch-teacher-labs/`, {
    headers: { 'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  });
}
export const isTokenValidAPIClient = (token : string) => {
   try{
    const decoded = jwtDecode<{ exp: number }>(token);
    const currentTime = Date.now() / 1000; // in seconds
    return decoded.exp > currentTime;
   }catch(err){
    return false; 
   }
}

export const deleteAllLabsAPIClient = async (token: string) => {
  return await apiClient.delete('/lab/delete-all-labs/',  { 
    headers: { Authorization: `Bearer ${token}` } });
}
export const refreshTokenAPIClient = async (refreshToken: string) => {
  console.log("client refresh token")
  return await apiClient.post('/auth/refresh-token/', { refresh_token: refreshToken });
}