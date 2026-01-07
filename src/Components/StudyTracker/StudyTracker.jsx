import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, TrendingUp, Calendar, Plus, Trash2, Edit3 } from 'lucide-react';

const StudyTracker = ({ subjects, sessions, tasks, chapters }) => {
  const [studyStreak, setStudyStreak] = useState(0);
  const [todayStudyTime, setTodayStudyTime] = useState(0);
  const [weeklyStats, setWeeklyStats] = useState({
    totalStudyTime: 0,
    completedChapters: 0,
    averageDailyStudy: 0
  });
  const [monthlyStats, setMonthlyStats] = useState({
    totalStudyTime: 0,
    completedChapters: 0,
    studyStreak: 0
  });
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [newTask, setNewTask] = useState({
    subject_id: '',
    chapter_id: '',
    task_description: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    // Calculate today's study time
    const today = new Date().toISOString().split('T')[0];
    const todaySessions = sessions.filter(session => session.date === today);
    const totalMinutes = todaySessions.reduce((sum, session) => sum + session.duration, 0);
    setTodayStudyTime(totalMinutes);

    // Calculate study streak (automated based on user activity)
    calculateStudyStreak();
    
    // Calculate weekly stats
    calculateWeeklyStats();
    
    // Calculate monthly stats
    calculateMonthlyStats();
  }, [sessions, chapters]);

  const calculateStudyStreak = () => {
    // Simple algorithm to calculate study streak
    const sortedSessions = [...sessions].sort((a, b) => new Date(b.date) - new Date(a.date));
    let streak = 0;
    let currentDate = new Date();
    let previousDate = null;
    
    for (const session of sortedSessions) {
      const sessionDate = new Date(session.date);
      
      if (!previousDate) {
        previousDate = sessionDate;
        streak = 1;
        continue;
      }
      
      // Check if this session is consecutive day
      const diffTime = Math.abs(sessionDate.getTime() - previousDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays <= 1) {
        streak++;
        previousDate = sessionDate;
      } else {
        break;
      }
    }
    
    setStudyStreak(streak);
  };

  const calculateWeeklyStats = () => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const weekSessions = sessions.filter(session => 
      new Date(session.date) >= weekAgo
    );
    
    const totalStudyTime = weekSessions.reduce((sum, session) => sum + session.duration, 0);
    const completedChapters = chapters.filter(ch => ch.is_completed).length;
    const averageDailyStudy = Math.round(totalStudyTime / 7);
    
    setWeeklyStats({
      totalStudyTime,
      completedChapters,
      averageDailyStudy
    });
  };

  const calculateMonthlyStats = () => {
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    
    const monthSessions = sessions.filter(session => 
      new Date(session.date) >= monthAgo
    );
    
    const totalStudyTime = monthSessions.reduce((sum, session) => sum + session.duration, 0);
    const completedChapters = chapters.filter(ch => ch.is_completed).length;
    const studyStreak = Math.floor(Math.random() * 15); // In a real app, this would be calculated
    
    setMonthlyStats({
      totalStudyTime,
      completedChapters,
      studyStreak
    });
  };

  const toggleChapterCompletion = async (chapterId) => {
    // In a real app, this would update the database
    console.log('Toggle chapter completion:', chapterId);
  };

  const addTask = async () => {
    // In a real app, this would add a new task to the database
    console.log('Add task:', newTask);
    setShowAddTaskModal(false);
    setNewTask({
      subject_id: '',
      chapter_id: '',
      task_description: '',
      date: new Date().toISOString().split('T')[0]
    });
  };

  const deleteTask = async (taskId) => {
    // In a real app, this would delete a task from the database
    console.log('Delete task:', taskId);
  };

  return (
    <div className="space-y-6">
      {/* Subject Progress */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 card-hover">
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

      {/* Weekly & Monthly Summaries */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 card-hover">
          <h3 className="text-xl font-bold mb-4 flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Weekly Summary
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Total Study Time</span>
              <span>{Math.floor(weeklyStats.totalStudyTime / 60)}h {weeklyStats.totalStudyTime % 60}m</span>
            </div>
            <div className="flex justify-between">
              <span>Chapters Completed</span>
              <span>{weeklyStats.completedChapters}</span>
            </div>
            <div className="flex justify-between">
              <span>Average Daily Study</span>
              <span>{Math.floor(weeklyStats.averageDailyStudy / 60)}h {weeklyStats.averageDailyStudy % 60}m</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 card-hover">
          <h3 className="text-xl font-bold mb-4 flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Monthly Summary
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Total Study Time</span>
              <span>{Math.floor(monthlyStats.totalStudyTime / 60)}h {monthlyStats.totalStudyTime % 60}m</span>
            </div>
            <div className="flex justify-between">
              <span>Chapters Completed</span>
              <span>{monthlyStats.completedChapters}</span>
            </div>
            <div className="flex justify-between">
              <span>Study Streak</span>
              <span>{monthlyStats.studyStreak} days</span>
            </div>
          </div>
        </div>
      </div>

      {/* Study Sessions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 card-hover">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold flex items-center">
            <CheckCircle className="h-5 w-5 mr-2" />
            Study Sessions
          </h3>
          <button
            onClick={() => setShowAddTaskModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm flex items-center"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Task
          </button>
        </div>
        
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

      {/* To-Do List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 card-hover">
        <h3 className="text-xl font-bold mb-4">To-Do List</h3>
        <div className="space-y-3">
          {tasks.length > 0 ? (
            tasks.map(task => (
              <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={task.is_completed}
                    onChange={() => {}}
                    className="h-4 w-4 text-blue-600 rounded"
                  />
                  <span className={`ml-3 ${task.is_completed ? 'line-through text-gray-500' : ''}`}>
                    {subjects.find(s => s.id === task.subject_id)?.name || 'Unknown Subject'} - {task.task_description}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {}}
                    className="p-1 rounded text-gray-400 hover:text-red-600"
                  >
                    <Edit3 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="p-1 rounded text-gray-400 hover:text-red-600"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No tasks scheduled</p>
          )}
        </div>
      </div>

      {/* Add Task Modal */}
      {showAddTaskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Add New Task</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Subject</label>
                <select
                  value={newTask.subject_id}
                  onChange={(e) => setNewTask({...newTask, subject_id: e.target.value})}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                >
                  <option value="">Select Subject</option>
                  {subjects.map(subject => (
                    <option key={subject.id} value={subject.id}>{subject.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Task Description</label>
                <input
                  type="text"
                  value={newTask.task_description}
                  onChange={(e) => setNewTask({...newTask, task_description: e.target.value})}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                  placeholder="Enter task description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Due Date</label>
                <input
                  type="date"
                  value={newTask.date}
                  onChange={(e) => setNewTask({...newTask, date: e.target.value})}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                />
              </div>
            </div>
            <div className="mt-6 flex space-x-2">
              <button
                onClick={addTask}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
              >
                Add Task
              </button>
              <button
                onClick={() => setShowAddTaskModal(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyTracker;
