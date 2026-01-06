import React from 'react';
import { BarChart3, CheckCircle, Calendar, Target, Settings, User, LogOut } from 'lucide-react';
import { supabase } from '../../utils/supabaseClient';

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
    <div className="w-full md:w-64 bg-gray-900 text-white h-screen fixed md:relative z-10 shadow-lg">
      <div className="p-6">
        <h1 className="text-xl font-bold text-blue-400 mb-8 flex items-center">
          <span className="mr-2">📚</span>
          HSC Focus Room
        </h1>
        
        <nav className="space-y-2">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center px-3 py-3 rounded-lg text-left transition-all duration-300 ${
                activeTab === item.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'hover:bg-gray-800 text-gray-200'
              }`}
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.label}
            </button>
          ))}
          
          <button
            onClick={onEnterFocusMode}
            className="w-full flex items-center px-3 py-3 rounded-lg text-left text-red-400 hover:bg-gray-800 transition-all duration-300"
          >
            <Target className="h-5 w-5 mr-3" />
            Focus Mode
          </button>
        </nav>

        <div className="mt-8 pt-6 border-t border-gray-700">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
              {session.user.user_metadata?.full_name?.charAt(0) || session.user.email.charAt(0)}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">
                {session.user.user_metadata?.full_name || session.user.email}
              </p>
              <p className="text-xs text-gray-400">HSC Student</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center px-3 py-3 rounded-lg text-left text-red-400 hover:bg-gray-800 transition-all duration-300"
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
