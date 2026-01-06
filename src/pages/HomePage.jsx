import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Sidebar from '../components/Layout/Sidebar.jsx'; // Added .jsx extension
import Dashboard from '../components/Dashboard/Dashboard.jsx';
import StudyTracker from '../components/StudyTracker/StudyTracker.jsx';
import StudyPlanner from '../components/StudyPlanner/StudyPlanner.jsx';
import SubjectSpace from '../components/SubjectSpace/SubjectSpace.jsx';
import FocusMode from '../components/FocusMode/FocusMode.jsx';
import Settings from '../components/Settings/Settings.jsx';
import { supabase } from '../utils/supabaseClient.jsx';

const HomePage = ({ session }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userSubjects, setUserSubjects] = useState([]);
  const [userChapters, setUserChapters] = useState([]);
  const [userSessions, setUserSessions] = useState([]);
  const [userTasks, setUserTasks] = useState([]);
  const [userNotes, setUserNotes] = useState({});
  const [loading, setLoading] = useState(true);
  const [showFocusMode, setShowFocusMode] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, [session]);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      // Fetch subjects
      const {  subjects, error: subjectsError } = await supabase
        .from('subjects')
        .select('*')
        .eq('user_id', session.user.id);

      if (subjectsError) throw subjectsError;

      // Fetch chapters
      const {  chapters, error: chaptersError } = await supabase
        .from('chapters')
        .select('*')
        .in('subject_id', subjects.map(s => s.id));

      if (chaptersError) throw chaptersError;

      // Fetch study sessions
      const {  sessions, error: sessionsError } = await supabase
        .from('study_sessions')
        .select('*')
        .eq('user_id', session.user.id);

      if (sessionsError) throw sessionsError;

      // Fetch daily tasks
      const {  tasks, error: tasksError } = await supabase
        .from('daily_tasks')
        .select('*')
        .eq('user_id', session.user.id);

      if (tasksError) throw tasksError;

      // Fetch notes
      const {  notes, error: notesError } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', session.user.id);

      if (notesError) throw notesError;

      setUserSubjects(subjects);
      setUserChapters(chapters);
      setUserSessions(sessions);
      setUserTasks(tasks);
      setUserNotes(notes.reduce((acc, note) => {
        acc[`${note.subject_id}-${note.paper_type}`] = note.content;
        return acc;
      }, {}));

    } catch (error) {
      console.error('Error fetching user ', error);
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    return <Navigate to="/auth" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your study plan...</p>
        </div>
      </div>
    );
  }

  if (showFocusMode) {
    return <FocusMode subjects={userSubjects} onExit={() => setShowFocusMode(false)} />;
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard 
          subjects={userSubjects} 
          sessions={userSessions} 
          tasks={userTasks} 
          chapters={userChapters}
        />;
      case 'tracker':
        return <StudyTracker 
          subjects={userSubjects} 
          sessions={userSessions} 
          tasks={userTasks} 
          chapters={userChapters}
        />;
      case 'planner':
        return <StudyPlanner 
          subjects={userSubjects} 
          tasks={userTasks} 
          chapters={userChapters}
        />;
      case 'subjects':
        return <SubjectSpace 
          subjects={userSubjects} 
          chapters={userChapters} 
          notes={userNotes}
          onNotesUpdate={fetchUserData}
        />;
      case 'settings':
        return <Settings session={session} />;
      default:
        return <Dashboard 
          subjects={userSubjects} 
          sessions={userSessions} 
          tasks={userTasks} 
          chapters={userChapters}
        />;
    }
  };

  return (
    <div className={`min-h-screen ${session.user.user_metadata?.dark_mode ? 'dark' : ''}`}>
      <div className="flex flex-col md:flex-row">
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          session={session}
          onEnterFocusMode={() => setShowFocusMode(true)}
        />
        <main className="flex-1 p-6">
          {renderActiveTab()}
        </main>
      </div>
    </div>
  );
};

export default HomePage;
