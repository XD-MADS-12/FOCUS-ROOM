import React, { useState, useEffect } from 'react';
import { Calendar, Target, Clock } from 'lucide-react';

const StudyPlanner = ({ subjects, tasks, chapters }) => {
  const [examCountdown, setExamCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    // Calculate exam countdown (simplified for demo)
    const targetDate = new Date();
    targetDate.setMonth(targetDate.getMonth() + 7);
    const diff = targetDate.getTime() - new Date().getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    setExamCountdown({ days, hours, minutes, seconds });
  }, []);

  const generateStudyPlan = () => {
    // In a real app, this would generate a study plan based on subjects and remaining time
    return subjects.map(subject => {
      const subjectChapters = chapters.filter(ch => ch.subject_id === subject.id);
      const remaining = subject.total_chapters - subjectChapters.filter(ch => ch.is_completed).length;
      const chaptersPerMonth = Math.ceil(remaining / 7);
      
      return {
        ...subject,
        remaining,
        chaptersPerMonth
      };
    });
  };

  const studyPlan = generateStudyPlan();

  const upcomingTasks = tasks.filter(task => 
    new Date(task.date) >= new Date() && !task.is_completed
  ).slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <Calendar className="h-5 w-5 mr-2" />
          7-Month Study Plan
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-7 gap-2 mb-6">
          {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'].map((month, index) => (
            <div key={month} className="text-center p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <div className="font-medium">{month}</div>
              <div className="text-sm text-gray-500">{examCountdown.days - index * 30} days</div>
            </div>
          ))}
        </div>
        
        <div className="space-y-3">
          {studyPlan.map(subject => (
            <div key={subject.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="font-medium">{subject.name}</span>
              <div className="text-right">
                <div className="text-sm text-gray-500">Plan: {subject.chaptersPerMonth} ch/month</div>
                <div className="text-sm">Remaining: {subject.remaining}/{subject.total_chapters}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
        <h3 className="text-xl font-bold mb-4">Upcoming Tasks</h3>
        <div className="space-y-3">
          {upcomingTasks.length > 0 ? (
            upcomingTasks.map(task => (
              <div key={task.id} className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div>
                  <p className="font-medium text-blue-800 dark:text-blue-200">
                    {subjects.find(s => s.id === task.subject_id)?.name || 'Unknown Subject'}
                  </p>
                  <p className="text-sm">{task.task_description}</p>
                </div>
                <div className="text-sm text-gray-500">{task.date}</div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No upcoming tasks scheduled</p>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
        <h3 className="text-xl font-bold mb-4">Exam Countdown</h3>
        <div className="grid grid-cols-4 gap-4 text-center">
          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{examCountdown.days}</div>
            <div className="text-sm text-gray-500">Days</div>
          </div>
          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{examCountdown.hours}</div>
            <div className="text-sm text-gray-500">Hours</div>
          </div>
          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{examCountdown.minutes}</div>
            <div className="text-sm text-gray-500">Minutes</div>
          </div>
          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{examCountdown.seconds}</div>
            <div className="text-sm text-gray-500">Seconds</div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
        <h3 className="text-xl font-bold mb-4">Priority Tasks</h3>
        <div className="space-y-3">
          {studyPlan
            .filter(subject => subject.remaining > 0)
            .sort((a, b) => b.remaining - a.remaining)
            .slice(0, 3)
            .map(subject => (
              <div key={subject.id} className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <div>
                  <p className="font-medium text-yellow-800 dark:text-yellow-200">{subject.name}</p>
                  <p className="text-sm">Highest priority - {subject.remaining} chapters remaining</p>
                </div>
                <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm">
                  Plan Session
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default StudyPlanner;
