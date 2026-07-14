'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Settings, 
  Shield, 
  Moon, 
  Volume2, 
  CheckCircle, 
  Save, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Camera, 
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

export default function SettingsPage() {
  const [activeSubTab, setActiveSubTab] = useState('profile'); // Default tab is 'profile'
  
  // Profile state variables
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
  }>({});

  // General settings state variables
  const [username, setUsername] = useState('Student');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  
  // Alert toast states
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | '' }>({ message: '', type: '' });

  // Security password state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [securityLoading, setSecurityLoading] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('username') || 'Student';
    setUsername(user);

    // Load custom profile picture from localStorage if present
    const savedAvatar = localStorage.getItem(`profileAvatar_${user}`);
    if (savedAvatar) {
      setAvatar(savedAvatar);
    }

    const fetchProfileData = async () => {
      setProfileLoading(true);
      try {
        const data = await apiFetch<StudentProfile>(`/api/students/profile/${user}`);
        if (data) {
          setProfile(data);
          setFormName(data.name || '');
          setFormEmail(data.email || '');
          setFormPhone(data.phone || '');
          setFormAddress(data.address || '');
        }
      } catch (err) {
        console.error('Error fetching profile records:', err);
      } finally {
        setProfileLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast({ message: '', type: '' });
    }, 4000);
  };

  // Avatar Upload Handlers
  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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

  const handleCancelProfileEdit = () => {
    if (profile) {
      setFormName(profile.name || '');
      setFormEmail(profile.email || '');
      setFormPhone(profile.phone || '');
      setFormAddress(profile.address || '');
    }
    setErrors({});
    setIsEditMode(false);
  };

  const validateProfileForm = (): boolean => {
    const tempErrors: typeof errors = {};

    if (!formName.trim() || formName.trim().length < 3) {
      tempErrors.name = 'Full name is required.';
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!formEmail.trim() || !emailRegex.test(formEmail)) {
      tempErrors.email = 'Please enter a valid email address.';
    }

    const cleanedPhone = formPhone.replace(/[\s-]/g, '');
    const phoneRegex = /^\+?\d{7,15}$/;
    if (!formPhone.trim() || !phoneRegex.test(cleanedPhone)) {
      tempErrors.phone = 'Please enter a valid phone number.';
    }

    if (!formAddress.trim()) {
      tempErrors.address = 'Home address is required.';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    if (!validateProfileForm()) return;

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

      if (updatedData) {
        setProfile(updatedData);
        setErrors({});
        showToast('Profile details updated successfully! 🎉', 'success');
        setIsEditMode(false);
      }
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Failed to update profile details.', 'error');
    }
  };

  // General Preferences save
  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Preferences updated successfully! 🎉', 'success');
  };

  // Security password update handler
  const handleSaveSecurity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      showToast('Please fill out all password fields.', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('Passwords do not match.', 'error');
      return;
    }

    setSecurityLoading(true);
    // Simulating password save API endpoint
    setTimeout(() => {
      setNewPassword('');
      setConfirmPassword('');
      setSecurityLoading(false);
      showToast('Password credentials updated successfully!', 'success');
    }, 1500);
  };

  const initials = formName
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'U';

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-4xl mx-auto p-4 relative">
      
      {/* Toast popup */}
      {toast.message && (
        <div className={`fixed top-6 right-6 z-55 z-50 p-4 rounded-xl shadow-lg border flex items-center gap-3 text-xs font-black uppercase tracking-wider animate-bounce ${
          toast.type === 'success' 
            ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
            : 'bg-rose-50 text-rose-500 border-rose-100'
        }`}>
          {toast.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Hidden file input */}
      <input 
        type="file"
        ref={fileInputRef}
        onChange={handleAvatarChange}
        accept="image/*"
        className="hidden"
      />

      {/* Title block */}
      <div className="flex items-center gap-4 pb-4 border-b border-slate-200">
        <div className="w-12 h-12 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center text-[#5c4fe5] shadow-sm">
          <Settings className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-800">Portal Settings</h2>
          <p className="text-xs text-slate-400 mt-0.5">Customize your personal profile and account credentials</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Sub-navigation Menu */}
        <div className="flex flex-col gap-2">
          <button 
            onClick={() => setActiveSubTab('profile')}
            className={`w-full text-left px-5 py-3.5 font-bold text-xs rounded-xl border transition-all uppercase tracking-wider ${
              activeSubTab === 'profile'
                ? 'bg-indigo-50 text-indigo-650 border-indigo-100'
                : 'border-transparent text-slate-500 hover:bg-slate-50'
            }`}
          >
            My Profile
          </button>
          <button 
            onClick={() => setActiveSubTab('general')}
            className={`w-full text-left px-5 py-3.5 font-bold text-xs rounded-xl border transition-all uppercase tracking-wider ${
              activeSubTab === 'general'
                ? 'bg-indigo-50 text-indigo-650 border-indigo-100'
                : 'border-transparent text-slate-500 hover:bg-slate-50'
            }`}
          >
            General Preferences
          </button>
          <button 
            onClick={() => setActiveSubTab('security')}
            className={`w-full text-left px-5 py-3.5 font-bold text-xs rounded-xl border transition-all uppercase tracking-wider ${
              activeSubTab === 'security'
                ? 'bg-indigo-50 text-indigo-650 border-indigo-100'
                : 'border-transparent text-slate-500 hover:bg-slate-50'
            }`}
          >
            Security & Login
          </button>
        </div>

        {/* Right Tab Content Card */}
        <div className="md:col-span-2 bg-white border border-slate-200/80 rounded-[2.2rem] p-8 shadow-sm">
          
          {/* TAB 1: MY PROFILE */}
          {activeSubTab === 'profile' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-4 border-b border-slate-100 pb-4">
                <h3 className="text-lg font-black text-slate-800 flex items-center">
                  <User className="w-5 h-5 mr-2 text-[#5c4fe5]" /> Personal Profile
                </h3>
                
                {/* Form Controls */}
                {!isEditMode ? (
                  <button 
                    onClick={() => setIsEditMode(true)}
                    className="px-4.5 py-2 bg-[#5c4fe5] hover:bg-[#4c3ce0] text-white font-bold text-xs rounded-xl shadow-md uppercase tracking-wider transition-all"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button 
                      onClick={handleSaveProfile}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md uppercase tracking-wider transition-all"
                    >
                      Save
                    </button>
                    <button 
                      onClick={handleCancelProfileEdit}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              {profileLoading ? (
                <div className="text-center py-12 text-slate-400 font-semibold animate-pulse">Loading profile records...</div>
              ) : (
                <div className="space-y-6">
                  {/* Photo container */}
                  <div className="flex items-center gap-5 bg-slate-50 border border-slate-150 p-4 rounded-2xl">
                    <div 
                      onClick={handleAvatarClick}
                      className="w-16 h-16 rounded-full border bg-white flex items-center justify-center overflow-hidden shadow-inner relative group cursor-pointer"
                    >
                      {avatar ? (
                        <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-blue-500 flex items-center justify-center">
                          <span className="text-xl font-black text-white">{initials}</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[8px] font-bold uppercase tracking-wider">
                        <Camera className="w-4 h-4 mb-0.5" /> Change
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-extrabold text-slate-800">{formName || username}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Click photo to upload new avatar</p>
                    </div>
                  </div>

                  {/* Form inputs */}
                  <form onSubmit={handleSaveProfile} className="space-y-4">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
                      <div className="relative mt-1.5">
                        <input 
                          type="text"
                          disabled={!isEditMode}
                          value={formName}
                          onChange={(e) => {
                            setFormName(e.target.value);
                            if (errors.name) setErrors(prev => ({ ...prev, name: undefined }));
                          }}
                          className={`w-full bg-slate-50 border ${
                            errors.name ? 'border-rose-500 focus:ring-rose-500/10' : 'border-slate-200'
                          } text-slate-750 font-semibold text-sm rounded-xl pl-11 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all ${
                            !isEditMode ? 'bg-slate-100/60 text-slate-500 cursor-not-allowed' : ''
                          }`}
                        />
                        <User className="w-4.5 h-4.5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                      </div>
                      {errors.name && <p className="text-rose-500 text-xs font-semibold mt-1 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{errors.name}</p>}
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                      <div className="relative mt-1.5">
                        <input 
                          type="email"
                          disabled={!isEditMode}
                          value={formEmail}
                          onChange={(e) => {
                            setFormEmail(e.target.value);
                            if (errors.email) setErrors(prev => ({ ...prev, email: undefined }));
                          }}
                          className={`w-full bg-slate-50 border ${
                            errors.email ? 'border-rose-500 focus:ring-rose-500/10' : 'border-slate-200'
                          } text-slate-750 font-semibold text-sm rounded-xl pl-11 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all ${
                            !isEditMode ? 'bg-slate-100/60 text-slate-500 cursor-not-allowed' : ''
                          }`}
                        />
                        <Mail className="w-4.5 h-4.5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                      </div>
                      {errors.email && <p className="text-rose-500 text-xs font-semibold mt-1 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{errors.email}</p>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Phone Number</label>
                        <div className="relative mt-1.5">
                          <input 
                            type="text"
                            disabled={!isEditMode}
                            value={formPhone}
                            onChange={(e) => {
                              setFormPhone(e.target.value);
                              if (errors.phone) setErrors(prev => ({ ...prev, phone: undefined }));
                            }}
                            className={`w-full bg-slate-50 border ${
                              errors.phone ? 'border-rose-500 focus:ring-rose-500/10' : 'border-slate-200'
                            } text-slate-750 font-semibold text-sm rounded-xl pl-11 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all ${
                              !isEditMode ? 'bg-slate-100/60 text-slate-500 cursor-not-allowed' : ''
                            }`}
                          />
                          <Phone className="w-4.5 h-4.5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                        </div>
                        {errors.phone && <p className="text-rose-500 text-xs font-semibold mt-1 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{errors.phone}</p>}
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Age (Read Only)</label>
                        <div className="relative mt-1.5">
                          <input 
                            type="text"
                            disabled
                            value={profile ? `${profile.age} years old` : '...'}
                            className="w-full bg-slate-100/60 border border-slate-200 text-slate-500 font-semibold text-sm rounded-xl pl-11 pr-4 py-2.5 cursor-not-allowed"
                          />
                          <User className="w-4.5 h-4.5 text-slate-450 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 opacity-70" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Home Address</label>
                      <div className="relative mt-1.5">
                        <textarea 
                          rows={2}
                          disabled={!isEditMode}
                          value={formAddress}
                          onChange={(e) => {
                            setFormAddress(e.target.value);
                            if (errors.address) setErrors(prev => ({ ...prev, address: undefined }));
                          }}
                          className={`w-full bg-slate-50 border ${
                            errors.address ? 'border-rose-500 focus:ring-rose-500/10' : 'border-slate-200'
                          } text-slate-750 font-semibold text-sm rounded-xl pl-11 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all ${
                            !isEditMode ? 'bg-slate-100/60 text-slate-500 cursor-not-allowed' : ''
                          }`}
                        />
                        <MapPin className="w-4.5 h-4.5 text-slate-400 absolute left-4 top-4" />
                      </div>
                      {errors.address && <p className="text-rose-500 text-xs font-semibold mt-1 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{errors.address}</p>}
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: GENERAL PREFERENCES */}
          {activeSubTab === 'general' && (
            <div className="space-y-6">
              <h3 className="text-lg font-black text-slate-800 flex items-center border-b border-slate-100 pb-3">
                General Preferences
              </h3>

              <form onSubmit={handleSaveGeneral} className="space-y-6">
                {/* Dark mode toggle */}
                <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <Moon className="w-5 h-5 text-slate-500" />
                    <div>
                      <p className="text-sm font-semibold text-slate-800">AuraEdu Dark Mode</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Experimental dark portal design</p>
                    </div>
                  </div>
                  <input 
                    type="checkbox"
                    checked={darkMode}
                    onChange={() => setDarkMode(!darkMode)}
                    className="w-10 h-5 bg-slate-200 rounded-full appearance-none cursor-pointer checked:bg-indigo-600 relative transition-colors duration-200 before:content-[''] before:absolute before:h-4 before:w-4 before:rounded-full before:bg-white before:top-0.5 before:left-0.5 before:transition-transform before:duration-200 checked:before:translate-x-5"
                  />
                </div>

                {/* Email alerts toggle */}
                <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <Volume2 className="w-5 h-5 text-slate-500" />
                    <div>
                      <p className="text-sm font-semibold text-slate-800">Email Notifications</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Get alerts for registration status approvals</p>
                    </div>
                  </div>
                  <input 
                    type="checkbox"
                    checked={notificationsEnabled}
                    onChange={() => setNotificationsEnabled(!notificationsEnabled)}
                    className="w-10 h-5 bg-slate-200 rounded-full appearance-none cursor-pointer checked:bg-indigo-600 relative transition-colors duration-200 before:content-[''] before:absolute before:h-4 before:w-4 before:rounded-full before:bg-white before:top-0.5 before:left-0.5 before:transition-transform before:duration-200 checked:before:translate-x-5"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#5c4fe5] hover:bg-[#4c3ce0] text-white font-bold py-3 px-4 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md shadow-indigo-100"
                >
                  <Save className="w-4 h-4" /> Save Preferences
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: SECURITY & CREDENTIALS */}
          {activeSubTab === 'security' && (
            <div className="space-y-6">
              <h3 className="text-lg font-black text-slate-800 flex items-center border-b border-slate-100 pb-3">
                <Shield className="w-5 h-5 mr-2 text-[#5c4fe5]" /> Security & Credentials
              </h3>

              <form onSubmit={handleSaveSecurity} className="space-y-5">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">New Password</label>
                  <input 
                    type="password" 
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="mt-1.5 block w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Confirm Password</label>
                  <input 
                    type="password" 
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="mt-1.5 block w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-750 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={securityLoading}
                  className="w-full bg-[#5c4fe5] hover:bg-[#4c3ce0] text-white font-bold py-3 px-4 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md shadow-indigo-100 disabled:opacity-50"
                >
                  {securityLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Update Password
                </button>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
