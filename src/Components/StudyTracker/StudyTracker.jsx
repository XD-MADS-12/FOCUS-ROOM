import React, { useState } from 'react';
import { CheckCircle, Clock, TrendingUp } from 'lucide-react';

const StudyTracker = ({ subjects, sessions, tasks, chapters }) => {
  const [selectedSubject, setSelectedSubject] = useState(null);

  const calculateWeeklyStats = () => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const weekSessions = sessions.filter(session => 
      new Date(session.date) >= weekAgo
    );
    
    const totalStudyTime = weekSessions.reduce((sum, session) => sum + session.duration, 0);
    const completedTasks = tasks.filter(task => 
      new Date(task.date) >= weekAgo && task.is_completed
    ).length;
    
    return {
      totalStudyTime,
      completedTasks,
      averageDailyStudy: Math.round(totalStudyTime / 7)
    };
  };

  const calculateMonthlyStats = () => {
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    
    const monthSessions = sessions.filter(session => 
      new Date(session.date) >= monthAgo
    );
    
    const totalStudyTime = monthSessions.reduce((sum, session) => sum + session.duration, 0);
    const completedTasks = tasks.filter(task => 
      new Date(task.date) >= monthAgo && task.is_completed
    ).length;
    
    return {
      totalStudyTime,
      completedTasks,
      studyStreak: Math.floor(Math.random() * 15) // Simplified for demo
    };
  };

  const weeklyStats = calculateWeeklyStats();
  const monthlyStats = calculateMonthlyStats();

  const toggleChapterCompletion = async (chapterId) => {
    // In a real app, this would update the database
    console.log('Toggle chapter completion:', chapterId);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
        <h3 className="text-xl font-bold mb-4">Subject Progress</h3>
        <div className="space-y-4">
          {subjects.map(subject => {
            const subjectChapters = chapters.filter(ch => ch.subject_id === subject.id);
            const completed = subjectChapters.filter(ch => ch.is_completed).length;
            const progress = subject.total_chapters > 0 ? Math.round((completed / subject.total_chapters) * 100) : 0;
            
            return (
              <div key={subject.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{subject.name}</span>
                  <span className="text-sm text-gray-500">{completed}/{subject.total_chapters} chapters</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {subjectChapters.slice(0, 4).map(chapter => (
                    <button
                      key={chapter.id}
                      onClick={() => toggleChapterCompletion(chapter.id)}
                      className={`px-3 py-1 rounded-full text-sm ${
                        chapter.is_completed
                          ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                      }`}
                    >
                      {chapter.name}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
          <h3 className="text-xl font-bold mb-4">Weekly Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Total Study Time</span>
              <span>{Math.floor(weeklyStats.totalStudyTime / 60)}h {weeklyStats.totalStudyTime % 60}m</span>
            </div>
            <div className="flex justify-between">
              <span>Chapters Completed</span>
              <span>{weeklyStats.completedTasks}</span>
            </div>
            <div className="flex justify-between">
              <span>Average Daily Study</span>
              <span>{Math.floor(weeklyStats.averageDailyStudy / 60)}h {weeklyStats.averageDailyStudy % 60}m</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
          <h3 className="text-xl font-bold mb-4">Monthly Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Total Study Time</span>
              <span>{Math.floor(monthlyStats.totalStudyTime / 60)}h {monthlyStats.totalStudyTime % 60}m</span>
            </div>
            <div className="flex justify-between">
              <span>Chapters Completed</span>
              <span>{monthlyStats.completedTasks}</span>
            </div>
            <div className="flex justify-between">
              <span>Study Streak</span>
              <span>{monthlyStats.studyStreak} days</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
        <h3 className="text-xl font-bold mb-4">Study Sessions</h3>
        <div className="space-y-3">
          {sessions.slice(0, 5).map(session => (
            <div key={session.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <p className="font-medium">
                  {subjects.find(s => s.id === session.subject_id)?.name || 'Unknown Subject'}
                </p>
                <p className="text-sm text-gray-500">{session.date}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">{session.duration} minutes</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudyTracker;
