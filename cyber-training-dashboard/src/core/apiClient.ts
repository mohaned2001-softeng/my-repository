import axios from 'axios';
import { RegisterState, User } from '../types';
const apiClient = axios.create({
  baseURL: 'http://localhost:8000', // Replace with your backend API URL
  headers: {
    'Content-Type': 'application/json',
  },
});



export const loginAPIClient = async (email: string, password: string) => {
  return await apiClient.post('/auth/login/', {user:{ identifier: email, password }});
}

export const registerAPIClient = async (user:RegisterState) => {
  return await apiClient.post('/auth/register/', { email: user.email, password: user.password,  fullName: user.fullName });
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
  return await apiClient.get('/auth/get-user/', {
    headers: {  
        Authorization: `Bearer ${token}`,
    },
    });
}

export const logoutAPIClient = async (token: string) => {
  return await apiClient.post('/auth/logout/', {}, {
    headers: {  
        Authorization: `Bearer ${token}`,
    },
    });
}
export const editUserAPIClient = async (token: string, fullName: string , bio: string) => {
  return await apiClient.put('/auth/edit-user/', { full_name: fullName, bio }, {
    headers: {      
        Authorization: `Bearer ${token}`,
    },
    });
}

export const setPasswordAPIClient = async (email: string, password: string) => {
  return await apiClient.post('/auth/set-password/', {email, password });
}