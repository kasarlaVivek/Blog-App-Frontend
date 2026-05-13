import React, { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store/globalStore.js';
import axios from "axios";
import { toast } from "react-hot-toast";
// Import the styles from your common file
import { formCard, formTitle, labelClass, inputClass, formGroup, submitBtn } from '../styles/common.js';

function Register() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const { err, loading, setErr, setLoading } = useAuth();


  const userRegister = async (newUser) => {
    setLoading(true);
    setErr(null);
    
    let { role, profileImgUrl, ...userObj } = newUser;
    let roleLower = role.toLowerCase();
    
    try {
      let resObj;
      if (selectedFile) {
        // If an image is selected, we MUST send FormData (multipart/form-data)
        const formData = new FormData();
        Object.keys(userObj).forEach((key) => {
          formData.append(key, userObj[key]);
        });
        formData.append("profileImgUrl", selectedFile);
        formData.append("role", role);
        
        resObj = await axios.post(`https://blog-app-backend-1-ry1p.onrender.com/${roleLower}-api/users`, formData);
      } else {
        // If no image is selected, send plain JSON.
        // This bypasses the need for multer on the remote backend, fixing the 400 error for Authors.
        const jsonData = {
          ...userObj,
          role: role
        };
        
        resObj = await axios.post(`https://blog-app-backend-1-ry1p.onrender.com/${roleLower}-api/users`, jsonData, {
          headers: { "Content-Type": "application/json" }
        });
      }

      if (resObj && (resObj.status === 201 || resObj.status === 200)) {
        toast.success("Registration successful! Please login.");
        navigate('/login');
      }
    } catch (err) {
      setErr(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  // cleanup(remove preview image fron browser memory)
  useEffect(()=>{
    return()=>{
      if(preview){
        URL.revokeObjectURL(preview);
      }
    }
  },[preview])


  return (
    <div className='min-h-screen bg-gray-200 pt-20 pb-5'>
      <div className={formCard}>
        <h2 className={formTitle}>Create Account</h2>

        {err && <p className="text-red-500 text-sm text-center mb-4">{err}</p>}

        <form onSubmit={handleSubmit(userRegister)}>

          {/* Role Selection */}
          <div className={formGroup}>
            <label className={labelClass}>Select Role</label>
            <div className="flex gap-4 items-center py-2">
              <label className="flex items-center text-sm text-[#1d1d1f] cursor-pointer">
                <input type="radio" value="USER" {...register("role", { required: "Role is required" })} className="mr-2" />
                User
              </label>
              <label className="flex items-center text-sm text-[#1d1d1f] cursor-pointer">
                <input type="radio" value="AUTHOR" {...register("role", { required: "Role is required" })} className="mr-2" />
                Author
              </label>
            </div>
            {errors.role && <p className="text-red-500 text-[10px] mt-1">{errors.role.message}</p>}
          </div>

          <div className={formGroup}>
            <label className={labelClass}>First Name</label>
            <input type="text" {...register("firstName", { required: "First name is required" })} placeholder='John' className={inputClass} />
            {errors.firstName && <p className="text-red-500 text-[10px] mt-1">{errors.firstName.message}</p>}
          </div>

          <div className={formGroup}>
            <label className={labelClass}>Last Name</label>
            <input type="text" {...register("lastName")} placeholder='Doe' className={inputClass} />
          </div>

          <div className={formGroup}>
            <label className={labelClass}>Email Address</label>
            <input type="email" {...register("email", {
              required: "Email is required",
              pattern: { value: /^\S+@\S+$/i, message: "Invalid email format" }
            })} placeholder='name@example.com' className={inputClass} />
            {errors.email && <p className="text-red-500 text-[10px] mt-1">{errors.email.message}</p>}
          </div>

          <div className={formGroup}>
            <label className={labelClass}>Password</label>
            <input type="password" {...register("password", {
              required: "Password is required",
              minLength: { value: 6, message: "Minimum 6 characters" }
            })} placeholder='••••••••' className={inputClass} />
            {errors.password && <p className="text-red-500 text-[10px] mt-1">{errors.password.message}</p>}
          </div>

          <div className={formGroup}>
            <label className={labelClass}>Profile Image URL</label>
            <input
              type="file"
              accept="image/png, image/jpeg"
              onChange={(e) => {

                //get image file
                const file = e.target.files[0];
                // validation for image format
                if (file) {
                  if (!["image/jpeg", "image/png"].includes(file.type)) {
                    setErr("Only JPG or PNG allowed");
                    return;
                  }
                  //validation for file size
                  if (file.size > 2 * 1024 * 1024) {
                    setErr("File size must be less than 2MB");
                    return;
                  }
                  //Converts file → temporary browser URL(create preview URL)
                  const previewUrl = URL.createObjectURL(file);
                  setPreview(previewUrl);
                  setSelectedFile(file);
                  setErr(null);
                }

              }} />
            {preview && (
              <div className="mt-3 flex justify-center">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-24 h-24 object-cover rounded-full border"
                />
              </div>
            )}
          </div>

          <button
            className={submitBtn}
            type='submit'
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
