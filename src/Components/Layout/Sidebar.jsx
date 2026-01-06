import React from 'react';
import { BarChart3, CheckCircle, Calendar, Target, Settings, User, LogOut } from 'lucide-react';
import { supabase } from '../../utils/supabaseClient'; // Remove .jsx extension

const Sidebar = ({ activeTab, setActiveTab, session, onEnterFocusMode }) => {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'tracker', label: 'Study Tracker', icon: CheckCircle },
    { id: 'planner', label: 'Study Planner', icon: Calendar },
    { id: 'subjects', label: 'Subject Space', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="w-full md:w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-screen fixed md:relative z-10">
      <div className="p-6">
        <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-8">HSC Focus Room</h1>
        
        <nav className="space-y-2">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center px-3 py-2.5 rounded-lg text-left transition-colors ${
                activeTab === item.id
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.label}
            </button>
          ))}
          
          <button
            onClick={onEnterFocusMode}
            className="w-full flex items-center px-3 py-2.5 rounded-lg text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <Target className="h-5 w-5 mr-3" />
            Focus Mode
          </button>
        </nav>

        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
              {session.user.user_metadata?.full_name?.charAt(0) || session.user.email.charAt(0)}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {session.user.user_metadata?.full_name || session.user.email}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">HSC Student</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center px-3 py-2.5 rounded-lg text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <LogOut className="h-5 w-5 mr-3" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
