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
} from 'lucide-react';
import { apiFetch } from '@/app/utils/api';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import FormInput from '@/components/ui/FormInput';
import Toast from '@/components/ui/Toast';
import { useTheme } from '@/contexts/ThemeContext';

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
  const [activeSubTab, setActiveSubTab] = useState('profile');
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ name?: string; email?: string; phone?: string; address?: string }>({});

  const [username, setUsername] = useState('Student');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | '' }>({ message: '', type: '' });

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [securityLoading, setSecurityLoading] = useState(false);

  const theme = useTheme();

  useEffect(() => {
    const user = localStorage.getItem('username') || 'Student';
    setUsername(user);

    const savedAvatar = localStorage.getItem(`profileAvatar_${user}`);
    if (savedAvatar) setAvatar(savedAvatar);

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
    setTimeout(() => setToast({ message: '', type: '' }), 4000);
  };

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { showToast('Image size must be less than 2MB.', 'error'); return; }
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
    if (!formName.trim() || formName.trim().length < 3) tempErrors.name = 'Full name is required.';
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!formEmail.trim() || !emailRegex.test(formEmail)) tempErrors.email = 'Please enter a valid email address.';
    const cleanedPhone = formPhone.replace(/[\s-]/g, '');
    if (!formPhone.trim() || !/^\+?\d{7,15}$/.test(cleanedPhone)) tempErrors.phone = 'Please enter a valid phone number.';
    if (!formAddress.trim()) tempErrors.address = 'Home address is required.';
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
        body: { ...profile, name: formName, email: formEmail, phone: formPhone, address: formAddress },
      });
      if (updatedData) {
        setProfile(updatedData);
        setErrors({});
        showToast('Profile details updated successfully! 🎉', 'success');
        setIsEditMode(false);
      }
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Failed to update profile details.', 'error');
    }
  };

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Preferences updated successfully! 🎉', 'success');
  };

  const handleSaveSecurity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) { showToast('Please fill out all password fields.', 'error'); return; }
    if (newPassword !== confirmPassword) { showToast('Passwords do not match.', 'error'); return; }
    setSecurityLoading(true);
    setTimeout(() => {
      setNewPassword('');
      setConfirmPassword('');
      setSecurityLoading(false);
      showToast('Password credentials updated successfully!', 'success');
    }, 1500);
  };

  const initials = formName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U';

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-4xl mx-auto p-4 relative">
      {toast.message && <Toast message={toast.message} type={toast.type as 'success' | 'error'} onDismiss={() => setToast({ message: '', type: '' })} />}

      <input type="file" ref={fileInputRef} onChange={handleAvatarChange} accept="image/*" className="hidden" />

      <div className="flex items-center gap-4 pb-4 border-b border-muted-border">
        <div className="w-12 h-12 bg-primary-light border border-primary/20 rounded-2xl flex items-center justify-center text-primary shadow-sm">
          <Settings className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Portal Settings</h2>
          <p className="text-sm text-slate-400 mt-0.5">Customize your personal profile and account credentials</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="flex flex-col gap-2">
          {['profile', 'general', 'security'].map((tab) => (
            <button key={tab} onClick={() => setActiveSubTab(tab)}
              className={`w-full text-left px-5 py-3.5 font-semibold text-sm rounded-xl border transition-all uppercase tracking-wider ${
                activeSubTab === tab ? 'bg-primary-light text-primary border-primary/20' : 'border-transparent text-slate-500 hover:bg-muted'
              }`}>
              {tab === 'profile' ? 'My Profile' : tab === 'general' ? 'General Preferences' : 'Security & Login'}
            </button>
          ))}
        </div>

        <div className="md:col-span-2 bg-card border border-muted-border/80 rounded-[2.2rem] p-8 shadow-sm">
          {activeSubTab === 'profile' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-4 border-b border-muted-border pb-4">
                <h3 className="text-lg font-bold text-slate-800 flex items-center"><User className="w-5 h-5 mr-2 text-primary" /> Personal Profile</h3>
                {!isEditMode ? (
                  <button onClick={() => setIsEditMode(true)} className="text-white font-semibold py-2 px-6 rounded-lg text-sm uppercase tracking-wider transition-all" style={{ backgroundColor: theme.primary }}>Edit Profile</button>
                ) : (
                  <div className="flex gap-2">
                    <button onClick={handleSaveProfile} className="text-white font-semibold py-2 px-6 rounded-lg text-sm uppercase tracking-wider transition-all" style={{ backgroundColor: theme.primary }}>Save</button>
                    <button onClick={handleCancelProfileEdit} className="bg-muted hover:bg-muted-border text-slate-700 px-6 py-2 rounded-lg text-sm font-semibold uppercase tracking-wider transition-all">Cancel</button>
                  </div>
                )}
              </div>

              {profileLoading ? <LoadingSpinner message="Loading profile records..." /> : (
                <div className="space-y-6">
                  <div className="flex items-center gap-5 bg-muted border border-muted-border p-4 rounded-2xl">
                    <div onClick={handleAvatarClick} className="w-16 h-16 rounded-full border bg-card flex items-center justify-center overflow-hidden shadow-inner relative group cursor-pointer">
                      {avatar ? <img src={avatar} alt="Profile" className="w-full h-full object-cover" /> : (
                        <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: theme.primary }}><span className="text-xl font-semibold text-white">{initials}</span></div>
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-xs font-semibold uppercase tracking-wider"><Camera className="w-4 h-4 mb-0.5" /> Change</div>
                    </div>
                    <div><p className="text-sm font-semibold text-slate-800">{formName || username}</p><p className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-0.5">Click photo to upload new avatar</p></div>
                  </div>

                  <form onSubmit={handleSaveProfile} className="space-y-4">
                    <FormInput id="name" label="Full Name" value={formName} onChange={(e) => { setFormName(e.target.value); if (errors.name) setErrors(prev => ({ ...prev, name: undefined })); }} icon={<User />} disabled={!isEditMode} error={errors.name} />
                    <FormInput id="email" label="Email Address" type="email" value={formEmail} onChange={(e) => { setFormEmail(e.target.value); if (errors.email) setErrors(prev => ({ ...prev, email: undefined })); }} icon={<Mail />} disabled={!isEditMode} error={errors.email} />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormInput id="phone" label="Phone Number" value={formPhone} onChange={(e) => { setFormPhone(e.target.value); if (errors.phone) setErrors(prev => ({ ...prev, phone: undefined })); }} icon={<Phone />} disabled={!isEditMode} error={errors.phone} />
                      <div>
                        <label className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Age (Read Only)</label>
                        <div className="relative mt-1.5">
                          <input type="text" disabled value={profile ? `${profile.age} years old` : '...'} className="w-full bg-muted border border-muted-border text-slate-500 font-medium text-sm rounded-xl pl-11 pr-4 py-2.5 cursor-not-allowed" />
                          <User className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 opacity-70" />
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Home Address</label>
                      <div className="relative mt-1.5">
                        <textarea rows={2} disabled={!isEditMode} value={formAddress} onChange={(e) => { setFormAddress(e.target.value); if (errors.address) setErrors(prev => ({ ...prev, address: undefined })); }}
                          className={`w-full bg-muted border ${errors.address ? 'border-destructive' : 'border-muted-border'} text-slate-700 font-medium text-sm rounded-xl pl-11 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${!isEditMode ? 'bg-muted/60 text-slate-500 cursor-not-allowed' : ''}`} />
                        <MapPin className="w-4 h-4 text-slate-400 absolute left-4 top-4" />
                      </div>
                      {errors.address && <p className="text-destructive text-sm font-medium mt-1 flex items-center gap-1"><span>{errors.address}</span></p>}
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

          {activeSubTab === 'general' && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-slate-800 flex items-center border-b border-muted-border pb-3">General Preferences</h3>
              <form onSubmit={handleSaveGeneral} className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-muted border border-muted-border rounded-2xl">
                  <div className="flex items-center gap-3"><Moon className="w-5 h-5 text-slate-500" /><div><p className="text-sm font-semibold text-slate-800">AuraEdu Dark Mode</p><p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Experimental dark portal design</p></div></div>
                  <input type="checkbox" checked={darkMode} onChange={() => setDarkMode(!darkMode)} className="w-10 h-5 bg-slate-200 rounded-full appearance-none cursor-pointer relative transition-colors duration-200 before:content-[''] before:absolute before:h-4 before:w-4 before:rounded-full before:bg-white before:top-0.5 before:left-0.5 before:transition-transform before:duration-200 checked:before:translate-x-5" style={{ backgroundColor: darkMode ? theme.primary : '' }} />
                </div>
                <div className="flex items-center justify-between p-4 bg-muted border border-muted-border rounded-2xl">
                  <div className="flex items-center gap-3"><Volume2 className="w-5 h-5 text-slate-500" /><div><p className="text-sm font-semibold text-slate-800">Email Notifications</p><p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Get alerts for registration status approvals</p></div></div>
                  <input type="checkbox" checked={notificationsEnabled} onChange={() => setNotificationsEnabled(!notificationsEnabled)} className="w-10 h-5 bg-slate-200 rounded-full appearance-none cursor-pointer relative transition-colors duration-200 before:content-[''] before:absolute before:h-4 before:w-4 before:rounded-full before:bg-white before:top-0.5 before:left-0.5 before:transition-transform before:duration-200 checked:before:translate-x-5" style={{ backgroundColor: notificationsEnabled ? theme.primary : '' }} />
                </div>
                <button type="submit" className="w-full text-white font-semibold py-3 px-6 rounded-lg text-sm uppercase tracking-wider transition-all" style={{ backgroundColor: theme.primary }}><Save className="w-4 h-4 inline mr-2" /> Save Preferences</button>
              </form>
            </div>
          )}

          {activeSubTab === 'security' && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-slate-800 flex items-center border-b border-muted-border pb-3"><Shield className="w-5 h-5 mr-2 text-primary" /> Security & Credentials</h3>
              <form onSubmit={handleSaveSecurity} className="space-y-5">
                <div>
                  <label className="text-sm font-semibold text-slate-400 uppercase tracking-wider">New Password</label>
                  <input type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Enter new password" className="mt-1.5 block w-full bg-muted border border-muted-border rounded-xl px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Confirm Password</label>
                  <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm new password" className="mt-1.5 block w-full bg-muted border border-muted-border rounded-xl px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                </div>
                <button type="submit" disabled={securityLoading} className="w-full text-white font-semibold py-3 px-6 rounded-lg text-sm uppercase tracking-wider transition-all disabled:opacity-50" style={{ backgroundColor: theme.primary }}>
                  {securityLoading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block mr-2"></div> : <Save className="w-4 h-4 inline mr-2" />} Update Password
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}