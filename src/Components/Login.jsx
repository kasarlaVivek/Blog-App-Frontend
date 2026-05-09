import React, { useEffect } from 'react';
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import {  useAuth } from '../store/globalStore.js';
import { formCard, formTitle, labelClass, inputClass, formGroup, submitBtn } from '../styles/common.js';
import axios from 'axios';
import toast from 'react-hot-toast';

function Login() {
  const { handleSubmit, register, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const err = useAuth((state)=>state.err)
  const loading = useAuth((state)=>state.loading)
  const isAuthenticated = useAuth((state)=>state.isAuthenticated)
  const login = useAuth((state)=>state.login)
  const currentUser = useAuth((state)=>state.currentUser)

  const loginUser = async (data) => {
    await login(data);
  };

useEffect(() => {
  // Only navigate if both are true and stable
  if (isAuthenticated && currentUser?.role) {
    // Standardize to lowercase to match typical Route paths
    const rolePath = currentUser.role.toLowerCase();
    toast.success("log in success")
    navigate(`/${rolePath}-dashboard`);
  }
}, [isAuthenticated, currentUser, navigate]);


  return (
    <div className='min-h-screen bg-gray-200 pt-40'>
      <div className={formCard}>
        <h2 className={formTitle}>Sign In</h2>
        
        {/* Global Error Message from Zustand */}
        {err && <p className="text-red-500 text-sm text-center mb-4">{err}</p>}
        
        <form onSubmit={handleSubmit(loginUser)}>
          <div className={formGroup}>
            <label className={labelClass}>Email Address</label>
            <input 
              type="email" 
              {...register("email", {
                required: "Email is required",
                pattern: { value: /^\S+@\S+$/i, message: "Invalid email format" }
              })} 
              placeholder='name@example.com' 
              className={inputClass} 
            />
            {errors.email && <p className="text-red-500 text-[10px] mt-1">{errors.email.message}</p>}
          </div>
          
          <div className={formGroup}>
            <label className={labelClass}>Password</label>
            <input 
              type="password" 
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Minimum 6 characters" }
              })} 
              placeholder='••••••••' 
              className={inputClass} 
            />
            {errors.password && <p className="text-red-500 text-[10px] mt-1">{errors.password.message}</p>}
          </div>

          <button 
            className={`${submitBtn} disabled:opacity-50`} 
            type='submit' 
            disabled={loading}
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>
        
        <p className="text-center text-[#6e6e73] text-xs mt-6">
          Don't have an account? <span className="text-[#0066cc] cursor-pointer" onClick={() => navigate('/register')}>Register</span>
        </p>
      </div>
    </div>
  );
}

export default Login;
