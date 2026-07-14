'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  GraduationCap, 
  Calendar, 
  BookOpen, 
  CheckCircle, 
  FileText,
  Camera,
  Save,
  X,
  AlertCircle
} from 'lucide-react';
import { apiFetch } from '@/app/utils/api';

interface StudentProfile {
  id: number;
  name: string;
  email: string;
  age: number;
  phone: string;
  address: string;
  username: string;
}

export default function MyProfilePage() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Editable form states
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formAddress, setFormAddress] = useState('');

  // UI state for image & toast
  const [avatar, setAvatar] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | '' }>({ message: '', type: '' });
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
  }>({});

  // Read-only Academic states
  const [username, setUsername] = useState('student');
  const [role, setRole] = useState('Student');

  useEffect(() => {
    const name = localStorage.getItem('username') || 'student';
    const storedRole = localStorage.getItem('role') || 'STUDENT';
    setUsername(name);
    setRole(storedRole.charAt(0).toUpperCase() + storedRole.slice(1).toLowerCase());

    // Load custom profile picture from localStorage if present
    const savedAvatar = localStorage.getItem(`profileAvatar_${name}`);
    if (savedAvatar) {
      setAvatar(savedAvatar);
    }

    // Fetch profile details from backend database
    apiFetch<StudentProfile>(`/api/students/profile/${name}`)
      .then((data: StudentProfile) => {
        setProfile(data);
        // Initialize form fields
        setFormName(data.name || '');
        setFormEmail(data.email || '');
        setFormPhone(data.phone || '');
        setFormAddress(data.address || '');
      })
      .catch((err) => {
        console.error(err);
        showToast('Failed to connect to profile database.', 'error');
      })
      .finally(() => setLoading(false));
  }, []);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast({ message: '', type: '' });
    }, 4000);
  };

  // Avatar upload change trigger
  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      showToast('Image size must be less than 2MB.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64Data = reader.result as string;
      setAvatar(base64Data);
      localStorage.setItem(`profileAvatar_${username}`, base64Data);
      showToast('Profile photo updated successfully!', 'success');
    };
    reader.readAsDataURL(file);
  };

  const handleEditToggle = () => {
    setErrors({});
    setIsEditMode(true);
  };

  const handleCancel = () => {
    if (profile) {
      // Revert values to current database record
      setFormName(profile.name || '');
      setFormEmail(profile.email || '');
      setFormPhone(profile.phone || '');
      setFormAddress(profile.address || '');
    }
    setErrors({});
    setIsEditMode(false);
  };

  const validateForm = (): boolean => {
    const tempErrors: typeof errors = {};

    // 1. Full Name: Must not be empty. Minimum length of 3 characters. (Error: "Full name is required.")
    if (!formName.trim() || formName.trim().length < 3) {
      tempErrors.name = 'Full name is required.';
    }

    // 2. Email Address: Must follow a strict email format standard. (Error: "Please enter a valid email address.")
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!formEmail.trim() || !emailRegex.test(formEmail)) {
      tempErrors.email = 'Please enter a valid email address.';
    }

    // 3. Phone Number: Must accept valid digits only (allowing optional '+' symbol prefix) and match Sri Lankan/global lengths. Cannot contain alphabetic text. (Error: "Please enter a valid phone number.")
    const cleanedPhone = formPhone.replace(/[\s-]/g, '');
    const phoneRegex = /^\+?\d{7,15}$/;
    if (!formPhone.trim() || !phoneRegex.test(cleanedPhone)) {
      tempErrors.phone = 'Please enter a valid phone number.';
    }

    // 4. Home Address: Must not be left blank. (Error: "Home address is required.")
    if (!formAddress.trim()) {
      tempErrors.address = 'Home address is required.';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSave = async () => {
    if (!profile) return;

    if (!validateForm()) {
      return;
    }

    try {
      const updatedData = await apiFetch<StudentProfile>('/api/profile/update', {
        method: 'PUT',
        body: {
          ...profile,
          name: formName,
          email: formEmail,
          phone: formPhone,
          address: formAddress
        }
      });

      setProfile(updatedData);
      setErrors({});
      showToast('PROFILE UPDATED SUCCESSFULLY! 🎉', 'success');
      setIsEditMode(false);
    } catch (err) {
      console.error(err);
      showToast('Failed to save profile changes.', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400 text-sm font-semibold mt-4">Loading student profile...</p>
      </div>
    );
  }

  const initials = formName
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'S';

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      
      {/* Toast Alert Banner */}
      {toast.message && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-4 rounded-2xl shadow-xl border flex items-center gap-3 text-xs font-black uppercase tracking-widest transition-all duration-300 animate-in fade-in slide-in-from-top-4 ${
          toast.type === 'success' 
            ? 'bg-emerald-600 text-white border-transparent shadow-emerald-600/20' 
            : 'bg-rose-600 text-white border-transparent shadow-rose-600/20'
        }`}>
          {toast.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Hidden File Input */}
      <input 
        type="file"
        ref={fileInputRef}
        onChange={handleAvatarChange}
        accept="image/*"
        className="hidden"
      />

      {/* Profile Header Card */}
      <div className="bg-white border border-slate-200/85 rounded-[2rem] p-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-blue-500/10 border-b border-slate-100" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-end gap-6 mt-12">
          
          {/* Avatar Upload Container */}
          <div 
            onClick={handleAvatarClick}
            className="w-28 h-28 rounded-full border-4 border-white bg-slate-100 flex items-center justify-center overflow-hidden shadow-md relative group cursor-pointer"
          >
            {avatar ? (
              <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-blue-500 flex items-center justify-center">
                <span className="text-4xl font-extrabold text-white">{initials}</span>
              </div>
            )}
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[9px] font-bold uppercase tracking-wider">
              <Camera className="w-5 h-5 mb-1" />
              Upload
            </div>
          </div>
          
          {/* Student Identity */}
          <div className="flex-1 text-center md:text-left mb-2">
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">{formName || username}</h1>
            <p className="text-[#5c4fe5] font-extrabold text-xs uppercase tracking-widest mt-1">{role} Account</p>
          </div>
          
          {/* Form Action Controls */}
          <div className="mb-2">
            {!isEditMode ? (
              <button 
                onClick={handleEditToggle}
                className="px-5 py-3 bg-[#4f46e5] hover:bg-[#5c4fe5] text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center uppercase tracking-wider"
              >
                <FileText className="w-4.5 h-4.5 mr-2" />
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-3">
                <button 
                  onClick={handleSave}
                  className="px-5 py-3 bg-emerald-650 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center uppercase tracking-wider"
                >
                  <Save className="w-4.5 h-4.5 mr-2" />
                  Save Changes
                </button>
                <button 
                  onClick={handleCancel}
                  className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-250 border-slate-200 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center"
                >
                  <X className="w-4.5 h-4.5 mr-2" />
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Forms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* EDITABLE PERSONAL INFORMATION FORM */}
        <div className="bg-white border border-slate-200/80 rounded-[2rem] p-8 shadow-sm">
          <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center">
            <User className="w-5 h-5 mr-2.5 text-[#5c4fe5]" /> Personal Information
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Full Name</label>
              <div className="relative mt-1.5">
                <input 
                  type="text"
                  disabled={!isEditMode}
                  value={formName}
                  onChange={(e) => {
                    setFormName(e.target.value);
                    if (errors.name) setErrors(prev => ({ ...prev, name: undefined }));
                  }}
                  placeholder="e.g. Nethmi Umesha"
                  className={`w-full bg-slate-50 border ${
                    errors.name ? 'border-rose-500 focus:ring-rose-500/10 focus:border-rose-450' : 'border-slate-250'
                  } text-slate-850 font-semibold text-sm rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all ${
                    !isEditMode ? 'bg-slate-100/60 text-slate-700 cursor-not-allowed border-slate-200' : ''
                  }`}
                />
                <User className="w-4.5 h-4.5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
              </div>
              {errors.name && (
                <p className="text-rose-500 text-xs font-semibold mt-1 pl-1 flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Email Address</label>
              <div className="relative mt-1.5">
                <input 
                  type="email"
                  disabled={!isEditMode}
                  value={formEmail}
                  onChange={(e) => {
                    setFormEmail(e.target.value);
                    if (errors.email) setErrors(prev => ({ ...prev, email: undefined }));
                  }}
                  placeholder="e.g. nethmi@auraedu.com"
                  className={`w-full bg-slate-50 border ${
                    errors.email ? 'border-rose-500 focus:ring-rose-500/10 focus:border-rose-450' : 'border-slate-250'
                  } text-slate-850 font-semibold text-sm rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all ${
                    !isEditMode ? 'bg-slate-100/60 text-slate-700 cursor-not-allowed border-slate-200' : ''
                  }`}
                />
                <Mail className="w-4.5 h-4.5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
              </div>
              {errors.email && (
                <p className="text-rose-500 text-xs font-semibold mt-1 pl-1 flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Phone Number</label>
              <div className="relative mt-1.5">
                <input 
                  type="text"
                  disabled={!isEditMode}
                  value={formPhone}
                  onChange={(e) => {
                    setFormPhone(e.target.value);
                    if (errors.phone) setErrors(prev => ({ ...prev, phone: undefined }));
                  }}
                  placeholder="e.g. +94 77 123 4567"
                  className={`w-full bg-slate-50 border ${
                    errors.phone ? 'border-rose-500 focus:ring-rose-500/10 focus:border-rose-450' : 'border-slate-250'
                  } text-slate-850 font-semibold text-sm rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all ${
                    !isEditMode ? 'bg-slate-100/60 text-slate-700 cursor-not-allowed border-slate-200' : ''
                  }`}
                />
                <Phone className="w-4.5 h-4.5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
              </div>
              {errors.phone && (
                <p className="text-rose-500 text-xs font-semibold mt-1 pl-1 flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.phone}
                </p>
              )}
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Home Address</label>
              <div className="relative mt-1.5 font-medium">
                <textarea 
                  rows={3}
                  disabled={!isEditMode}
                  value={formAddress}
                  onChange={(e) => {
                    setFormAddress(e.target.value);
                    if (errors.address) setErrors(prev => ({ ...prev, address: undefined }));
                  }}
                  placeholder="e.g. 123 Campus Drive, Tech City, ST 12345"
                  className={`w-full bg-slate-50 border ${
                    errors.address ? 'border-rose-500 focus:ring-rose-500/10 focus:border-rose-450' : 'border-slate-200'
                  } text-slate-850 font-semibold text-sm rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all ${
                    !isEditMode ? 'bg-slate-100/60 text-slate-700 cursor-not-allowed border-slate-200' : ''
                  }`}
                />
                <MapPin className="w-4.5 h-4.5 text-slate-500 absolute left-4 top-4" />
              </div>
              {errors.address && (
                <p className="text-rose-500 text-xs font-semibold mt-1 pl-1 flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.address}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* LOCKED ACADEMIC DETAILS FORM */}
        <div className="bg-white border border-slate-200/80 rounded-[2rem] p-8 shadow-sm">
          <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center">
            <GraduationCap className="w-5 h-5 mr-2.5 text-blue-500" /> Academic Details (Locked)
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">User ID</label>
              <div className="relative mt-1.5">
                <input 
                  type="text"
                  readOnly
                  disabled
                  value={profile ? `ID-${profile.id}` : 'ID-...'}
                  className="w-full bg-slate-100/80 border border-slate-200/70 text-slate-700 font-bold text-sm rounded-xl pl-11 pr-4 py-3 cursor-not-allowed"
                />
                <User className="w-4.5 h-4.5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2 opacity-80" />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Role</label>
              <div className="relative mt-1.5">
                <input 
                  type="text"
                  readOnly
                  disabled
                  value={role}
                  className="w-full bg-slate-100/80 border border-slate-200/70 text-slate-700 font-bold text-sm rounded-xl pl-11 pr-4 py-3 cursor-not-allowed"
                />
                <BookOpen className="w-4.5 h-4.5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2 opacity-80" />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Enrollment Date</label>
              <div className="relative mt-1.5">
                <input 
                  type="text"
                  readOnly
                  disabled
                  value="September 1, 2023"
                  className="w-full bg-slate-100/80 border border-slate-200/70 text-slate-700 font-bold text-sm rounded-xl pl-11 pr-4 py-3 cursor-not-allowed"
                />
                <Calendar className="w-4.5 h-4.5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2 opacity-80" />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Academic Status</label>
              <div className="relative mt-1.5">
                <input 
                  type="text"
                  readOnly
                  disabled
                  value={`Active ${role}`}
                  className="w-full bg-slate-100/80 border border-slate-200/70 text-emerald-600 text-sm rounded-xl pl-11 pr-4 py-3 cursor-not-allowed font-extrabold"
                />
                <CheckCircle className="w-4.5 h-4.5 text-emerald-600 absolute left-4 top-1/2 -translate-y-1/2 opacity-90" />
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
