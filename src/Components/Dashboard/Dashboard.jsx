import React, { useState, useEffect } from 'react';
import { Target, Clock, TrendingUp, Calendar, BookOpen, AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = ({ subjects, sessions, tasks, chapters }) => {
  const [studyStreak, setStudyStreak] = useState(0);
  const [todayStudyTime, setTodayStudyTime] = useState(0);
  const [examCountdown, setExamCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    // Calculate today's study time
    const today = new Date().toISOString().split('T')[0];
    const todaySessions = sessions.filter(session => session.date === today);
    const totalMinutes = todaySessions.reduce((sum, session) => sum + session.duration, 0);
    setTodayStudyTime(totalMinutes);

    // Calculate study streak (simplified for demo)
    setStudyStreak(Math.floor(Math.random() * 10));

    // Calculate exam countdown (simplified for demo)
    const targetDate = new Date();
    targetDate.setMonth(targetDate.getMonth() + 7);
    const diff = targetDate.getTime() - new Date().getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    setExamCountdown({ days, hours, minutes, seconds });
  }, [sessions]);

  const getMotivationMessage = () => {
    const messages = [
      "Every chapter you complete brings you closer to your dreams!",
      "Consistency is the key to success - keep going!",
      "You're doing amazing! Just 7 months to go!",
      "Small steps every day lead to big achievements!",
      "Believe in yourself - you've got this!"
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  // Prepare data for chart
  const chartData = subjects.map(subject => {
    const subjectChapters = chapters.filter(ch => ch.subject_id === subject.id);
    const completed = subjectChapters.filter(ch => ch.is_completed).length;
    const progress = subject.total_chapters > 0 ? Math.round((completed / subject.total_chapters) * 100) : 0;
    
    return {
      name: subject.name,
      progress: progress,
      completed: completed,
      total: subject.total_chapters
    };
  });

  const todayTasks = tasks.filter(task => {
    const today = new Date().toISOString().split('T')[0];
    return task.date === today;
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Study Streak</p>
              <p className="text-3xl font-bold">{studyStreak} days</p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Today's Study Time</p>
              <p className="text-3xl font-bold">{Math.floor(todayStudyTime / 60)}h {todayStudyTime % 60}m</p>
            </div>
            <Clock className="h-8 w-8 text-green-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100">Days Left</p>
              <p className="text-3xl font-bold">{examCountdown.days}</p>
            </div>
            <Calendar className="h-8 w-8 text-orange-200" />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <Target className="h-5 w-5 mr-2" />
          Today's Study Plan
        </h3>
        <div className="space-y-3">
          {todayTasks.length > 0 ? (
            todayTasks.map(task => (
              <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={task.is_completed}
                    readOnly
                    className="h-4 w-4 text-blue-600 rounded"
                  />
                  <span className={`ml-3 ${task.is_completed ? 'line-through text-gray-500' : ''}`}>
                    {task.task_description}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No tasks scheduled for today</p>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
        <h3 className="text-xl font-bold mb-4">Subject Progress Overview</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="progress" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6">
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-2" />
          <p className="text-yellow-800 dark:text-yellow-200">{getMotivationMessage()}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
