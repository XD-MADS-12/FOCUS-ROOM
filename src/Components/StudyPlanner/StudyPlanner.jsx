import React, { useState, useEffect } from 'react';
import { Calendar, Target, Clock, AlertCircle } from 'lucide-react';

const StudyPlanner = ({ subjects, tasks, chapters }) => {
  const [examCountdown, setExamCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [userTasks, setUserTasks] = useState([]);

  useEffect(() => {
    // Calculate exam countdown
    const targetDate = new Date();
    targetDate.setMonth(targetDate.getMonth() + 7);
    const diff = targetDate.getTime() - new Date().getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    setExamCountdown({ days, hours, minutes, seconds });
    
    // Initialize user tasks
    setUserTasks(tasks);
  }, [tasks]);

  const generateStudyPlan = () => {
    // Generate a 7-month study plan
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
    const plan = [];
    
    for (let i = 0; i < 7; i++) {
      const month = months[i];
      const days = Math.ceil(210 / 7) - i * 5; // Distribute days across months
      
      plan.push({
        month,
        days,
        subjects: subjects.map(subject => {
          const subjectChapters = chapters.filter(ch => ch.subject_id === subject.id);
          const remaining = subject.total_chapters - subjectChapters.filter(ch => ch.is_completed).length;
          const chaptersPerMonth = Math.ceil(remaining / 7);
          
          return {
            ...subject,
            remaining,
            chaptersPerMonth
          };
        })
      });
    }
    
    return plan;
  };

  const studyPlan = generateStudyPlan();

  const addTask = (task) => {
    // Add a new task to the user's task list
    const newTask = {
      id: Date.now(),
      ...task,
      is_completed: false,
      date: new Date().toISOString().split('T')[0]
    };
    
    setUserTasks([...userTasks, newTask]);
  };

  const toggleTaskCompletion = (taskId) => {
    // Toggle task completion status
    setUserTasks(userTasks.map(task => 
      task.id === taskId ? { ...task, is_completed: !task.is_completed } : task
    ));
  };

  const upcomingTasks = userTasks.filter(task => 
    new Date(task.date) >= new Date() && !task.is_completed
  ).slice(0, 5);

  const priorityTasks = userTasks.filter(task => 
    new Date(task.date) >= new Date() && !task.is_completed
  ).sort((a, b) => {
    // Prioritize by urgency (sooner dates first)
    return new Date(a.date) - new Date(b.date);
  }).slice(0, 3);

  return (
    <div className="space-y-6">
      {/* 7-Month Study Plan */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 card-hover">
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <Calendar className="h-5 w-5 mr-2" />
          7-Month Study Plan
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-7 gap-2 mb-6">
          {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'].map((month, index) => (
            <div key={month} className="text-center p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <div className="font-medium">{month}</div>
              <div className="text-sm text-gray-500">{studyPlan[index]?.days || 0} days</div>
            </div>
          ))}
        </div>
        
        <div className="space-y-3">
          {studyPlan[selectedMonth]?.subjects.map(subject => (
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

      {/* Upcoming Tasks */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 card-hover">
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

      {/* Exam Countdown */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 card-hover">
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

      {/* Priority Tasks */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 card-hover">
        <h3 className="text-xl font-bold mb-4">Priority Tasks</h3>
        <div className="space-y-3">
          {priorityTasks.length > 0 ? (
            priorityTasks.map(task => (
              <div key={task.id} className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <div>
                  <p className="font-medium text-yellow-800 dark:text-yellow-200">
                    {subjects.find(s => s.id === task.subject_id)?.name || 'Unknown Subject'}
                  </p>
                  <p className="text-sm">Highest priority - {task.task_description}</p>
                </div>
                <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm">
                  Mark as Done
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No priority tasks identified</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudyPlanner;
