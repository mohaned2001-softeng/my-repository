import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { RegisterState, User } from '@/types';
import ForgotPasswordPage from './ForgotPasswordPage';

interface AuthFormProps {
  onSuccess: () => void;
}

const getErrorMessage = (error: unknown) => {
  if (typeof error === 'string') return error;
  if (typeof error === 'object' && error !== null) {
    const maybeError = error as {
      message?: string;
      response?: {
        data?: {
          detail?: string;
          message?: string;
        };
      };
    };
    return maybeError.response?.data?.detail || maybeError.response?.data?.message || maybeError.message || 'An error occurred';
  }
  return 'An error occurred';
};

const AuthForm: React.FC<AuthFormProps> = ({ onSuccess }) => {
  const initialUser:User = {
    email: '',
    password: '',
    full_name: '',
    avatar_url: null,
    bio: null,
    role:'',
    created_at: new Date(),
    id: '',
    is_verified: false,
   
  }
  const [user, setUser] = useState<User | null>(initialUser);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setUserPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, sendOTP, sendForgotPasswordOTP, verifyOTP, setPassword } = useAuth();
  const [isOTP, setIsOTP] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [resetStep, setResetStep] = useState<'otp' | 'password' | null>(null);
  const [resetPassword, setResetPassword] = useState('');
  const [resetConfirmPassword, setResetConfirmPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // Forgot password flow
      if (isForgotPassword) {
        if (resetStep === 'otp') {
          // Verify OTP for password reset
          const response = await verifyOTP(resetEmail, otpCode);
          if (response.status === 200) {
            setResetStep('password');
            setOtpCode('');
          }
          return;
        } else if (resetStep === 'password') {
          // Validate passwords match
          if (resetPassword !== resetConfirmPassword) {
            setError('Passwords do not match.');
            return;
          }
          // Send new password
          const response = await setPassword(resetEmail, resetPassword ,resetConfirmPassword);
          if (response.status === 200) {
            setIsForgotPassword(false);
            setResetStep(null);
            setResetEmail('');
            setResetPassword('');
            setResetConfirmPassword('');
            onSuccess();
          }
          return;
        }
      }

      // OTP verification for registration
      if (isOTP) {
        const response = await verifyOTP(user.email, otpCode);
        if (response.status === 200) {
          setIsOTP(false);
          setOtpCode('');
          onSuccess();
        }
        return;
      }

      if (isLogin) {
        await signIn(user.email, user.password);
        onSuccess();
      } else {
        const response = await signUp(user);
        if (response.status === 201) {
          setIsOTP(true);
          await sendOTP(user.email);
        }
      }
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleModeSwitch = () => {
    setIsLogin(!isLogin);
    setIsOTP(false);
    setOtpCode('');
    setError('');
  };

  // Forgot password view logic
  if (isForgotPassword) {
    return (
      <div className="min-h-screen bg-[#0A0E27] pt-20 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-[#111827] rounded-2xl p-8 border border-gray-800">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Forgot Password</h2>
              <p className="text-gray-400">{resetStep === 'otp' ? 'Enter the OTP sent to your email' : 'Set a new password'}</p>
            </div>
            {error && <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-400 text-sm">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              {resetStep === null && (
                <>
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Email</label>
                    <input
                      type="email"
                      required
                      value={resetEmail}
                      onChange={e => setResetEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-[#0A0E27] border border-gray-700 rounded-lg text-white focus:border-red-500 focus:outline-none"
                      placeholder="you@example.com"
                    />
                  </div>
                  <button
                    type="button"
                    disabled={loading || !resetEmail}
                    className="w-full py-4 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
                    onClick={async () => {
                      setError('');
                      setLoading(true);
                      try {
                        await sendForgotPasswordOTP(resetEmail);
                        setResetStep('otp');
                      } catch (error) {
                        setError(getErrorMessage(error));
                      } finally {
                        setLoading(false);
                      }
                    }}
                  >
                    {loading ? 'Sending OTP...' : 'Send OTP'}
                  </button>
                </>
              )}
              {resetStep === 'otp' && (
                <>
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">OTP Code</label>
                    <input
                      type="text"
                      required
                      value={otpCode}
                      onChange={e => setOtpCode(e.target.value)}
                      className="w-full px-4 py-3 bg-[#0A0E27] border border-gray-700 rounded-lg text-white focus:border-red-500 focus:outline-none"
                      placeholder="Enter OTP code"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
                  >
                    {loading ? 'Verifying...' : 'Verify OTP'}
                  </button>
                </>
              )}
              {resetStep === 'password' && (
                <>
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">New Password</label>
                    <input
                      type="password"
                      required
                      value={resetPassword}
                      onChange={e => setResetPassword(e.target.value)}
                      minLength={6}
                      className="w-full px-4 py-3 bg-[#0A0E27] border border-gray-700 rounded-lg text-white focus:border-red-500 focus:outline-none"
                      placeholder="Min 6 characters"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Confirm Password</label>
                    <input
                      type="password"
                      required
                      value={resetConfirmPassword}
                      onChange={e => setResetConfirmPassword(e.target.value)}
                      minLength={6}
                      className="w-full px-4 py-3 bg-[#0A0E27] border border-gray-700 rounded-lg text-white focus:border-red-500 focus:outline-none"
                      placeholder="Confirm your password"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
                  >
                    {loading ? 'Resetting...' : 'Set New Password'}
                  </button>
                </>
              )}
            </form>
            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setIsForgotPassword(false);
                  setResetStep(null);
                  setResetEmail('');
                  setResetPassword('');
                  setResetConfirmPassword('');
                  setError('');
                }}
                className="text-gray-400 hover:text-red-400 transition-colors"
              >
                Back to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main auth form view
  return (
    <div className="min-h-screen bg-[#0A0E27] pt-20 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-[#111827] rounded-2xl p-8 border border-gray-800">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">{isOTP ? 'OTP Verification' : isLogin ? 'Welcome Back' : 'Create Account'}</h2>
            <p className="text-gray-400">{isOTP ? 'Enter the OTP sent to your email or phone' : isLogin ? 'Sign in to access your labs' : 'Join Cyber Academy today'}</p>
          </div>
          {error && <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-400 text-sm">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isOTP ? (
              <>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">OTP Code</label>
                  <input
                    type="text"
                    required
                    value={otpCode}
                    onChange={e => setOtpCode(e.target.value)}
                    className="w-full px-4 py-3 bg-[#0A0E27] border border-gray-700 rounded-lg text-white focus:border-red-500 focus:outline-none"
                    placeholder="Enter OTP code"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
                >
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </button>
              </>
            ) : (
              <>
                {!isLogin && (
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Full Name</label>
                    <input type="text" value={user.full_name} onChange={e => setUser({ ...user, full_name: e.target.value })} required
                      className="w-full px-4 py-3 bg-[#0A0E27] border border-gray-700 rounded-lg text-white focus:border-red-500 focus:outline-none" placeholder="Enter your name" />
                  </div>
                )}
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Email</label>
                  <input type="email" value={user.email} onChange={e => setUser({ ...user, email: e.target.value })} required
                    className="w-full px-4 py-3 bg-[#0A0E27] border border-gray-700 rounded-lg text-white focus:border-red-500 focus:outline-none" placeholder="you@example.com" />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Password</label>
                  <input type="password" value={user.password} onChange={e => setUser({ ...user, password: e.target.value })} required minLength={6}
                    className="w-full px-4 py-3 bg-[#0A0E27] border border-gray-700 rounded-lg text-white focus:border-red-500 focus:outline-none" placeholder="Min 6 characters" />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full py-4 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white font-semibold rounded-lg transition-colors">
                  {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
                </button>
                <br/>
                <button className={"w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-semibold rounded-lg transition-colors"}>continue with Google</button>
              </>
            )}
          </form>
          {!isOTP && (
            <div className="mt-6 text-center flex flex-col gap-2">
              <button onClick={handleModeSwitch} className="text-gray-400 hover:text-red-400 transition-colors">
                {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
              </button>
              {isLogin && (
                <button
                  className="text-gray-400 hover:text-red-400 transition-colors text-sm"
                  onClick={async () => {
                    setIsForgotPassword(true);
                    setResetStep(null);
                    setResetEmail('');
                    setResetPassword('');
                    setResetConfirmPassword('');
                    setError('');
                  }}
                >
                  Forgot Password?
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
