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
  const formData = new FormData(); 
  formData.append('title', labData.title);
  formData.append('description', labData.description);
  formData.append('difficulty', labData.difficulty);
  formData.append('category', labData.category);
  formData.append('image', labData.image);
  formData.append('writeup_url', labData.writeup_url);
  formData.append('estimated_time', labData.estimated_time.toString());
  formData.append('skills', JSON.stringify(labData.skills));
  return await apiClient.post('/lab/add-lab/', formData , {
    headers:{
      "Content-Type": "multipart/form-data",
      Authorization:`Bearer ${token}`
    }
  });
}


export const updateLabAPIClient = async (token: string, labId: string, labData: Lab) => {
  const formData = new FormData();
  formData.append('title', labData.title);
  formData.append('description', labData.description);
  formData.append('difficulty', labData.difficulty);
  formData.append('category', labData.category);
  if (labData.image instanceof File) {
    formData.append('image', labData.image);
  }
  formData.append('writeup_url', labData.writeup_url);
  formData.append('estimated_time', labData.estimated_time.toString());
  formData.append('skills', JSON.stringify(labData.skills));
  formData.append('id', labData.id || '');
  return await apiClient.put(`/lab/edit-lab/${labId}/`, formData , {
    headers: {
      'Content-Type': 'multipart/form-data',
       Authorization: `Bearer ${token}`,
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


export const refreshTokenAPIClient = async (refreshToken: string) => {
  console.log("client refresh token")
  return await apiClient.post('/auth/refresh-token/', { refresh_token: refreshToken });
}