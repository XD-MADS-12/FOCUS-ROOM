import React, { useState } from 'react';
import { User, Mail, Lock, Moon, Sun, LogOut, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../../utils/supabaseClient';

const Settings = ({ session }) => {
  const [darkMode, setDarkMode] = useState(session.user.user_metadata?.dark_mode || false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [updateForm, setUpdateForm] = useState({
    name: session.user.user_metadata?.full_name || '',
    email: session.user.email
  });
  const [message, setMessage] = useState('');

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: updateForm.name,
          dark_mode: darkMode
        }
      });
      
      if (error) throw error;
      setMessage('Profile updated successfully!');
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      setMessage('New passwords do not match');
      return;
    }
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordForm.newPassword
      });
      
      if (error) throw error;
      setMessage('Password changed successfully!');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      });
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Settings</h2>
      
      {message && (
        <div className={`p-4 rounded-lg ${
          message.includes('successfully') 
            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200' 
            : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200'
        }`}>
          {message}
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 card-hover">
        <h3 className="text-xl font-bold mb-4">Profile Information</h3>
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Full Name</label>
            <input
              type="text"
              value={updateForm.name}
              onChange={(e) => setUpdateForm({...updateForm, name: e.target.value})}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={updateForm.email}
              readOnly
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700"
            />
          </div>
          <div className="flex items-center justify-between">
            <span>Dark Mode</span>
            <button
              type="button"
              onClick={() => setDarkMode(!darkMode)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                darkMode ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  darkMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
          >
            Update Profile
          </button>
        </form>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 card-hover">
        <h3 className="text-xl font-bold mb-4">Change Password</h3>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Current Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-gray-400"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">New Password</label>
            <input
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Confirm New Password</label>
            <input
              type="password"
              value={passwordForm.confirmNewPassword}
              onChange={(e) => setPasswordForm({...passwordForm, confirmNewPassword: e.target.value})}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
          >
            Change Password
          </button>
        </form>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 card-hover">
        <h3 className="text-xl font-bold mb-4">Account</h3>
        <div className="space-y-4">
          <div className="flex items-center">
            <User className="h-5 w-5 mr-3" />
            <div>
              <div className="font-medium">{session.user.user_metadata?.full_name || session.user.email}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{session.user.email}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg flex items-center justify-center"
          >
            <LogOut className="h-4 w-4 inline mr-2" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
