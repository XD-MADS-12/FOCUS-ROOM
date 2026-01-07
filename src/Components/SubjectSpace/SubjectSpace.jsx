import React, { useState, useEffect } from 'react';
import { BookOpen, CheckCircle, AlertCircle, Plus, Trash2, Edit3, Users } from 'lucide-react';

const SubjectSpace = ({ subjects, chapters, notes, onNotesUpdate }) => {
  const [activeSubject, setActiveSubject] = useState(null);
  const [activePaper, setActivePaper] = useState('first');
  const [noteContent, setNoteContent] = useState('');
  const [showAddChapterModal, setShowAddChapterModal] = useState(false);
  const [newChapter, setNewChapter] = useState({
    name: '',
    paper_type: 'first'
  });
  const [leaderboard, setLeaderboard] = useState([
    { id: 1, name: 'Rahim', study_time: 120, streak: 7 },
    { id: 2, name: 'Karim', study_time: 90, streak: 5 },
    { id: 3, name: 'Jahanara', study_time: 150, streak: 10 },
    { id: 4, name: 'Mehedi', study_time: 80, streak: 3 },
    { id: 5, name: 'Sadia', study_time: 110, streak: 6 }
  ]);

  useEffect(() => {
    if (activeSubject) {
      const key = `${activeSubject.id}-${activePaper}`;
      setNoteContent(notes[key] || '');
    }
  }, [activeSubject, activePaper, notes]);

  const handleNoteChange = async (content) => {
    setNoteContent(content);
    
    // In a real app, this would update the database
    console.log('Update notes for subject:', activeSubject.id, 'paper:', activePaper, 'content:', content);
  };

  const toggleChapter = async (chapterId) => {
    // In a real app, this would update the database
    console.log('Toggle chapter:', chapterId);
  };

  const toggleWeakTopic = async (chapterId) => {
    // In a real app, this would update the database
    console.log('Toggle weak topic:', chapterId);
  };

  const addChapter = async () => {
    // In a real app, this would add a new chapter to the database
    console.log('Add chapter:', newChapter);
    setShowAddChapterModal(false);
    setNewChapter({
      name: '',
      paper_type: 'first'
    });
  };

  const deleteChapter = async (chapterId) => {
    // In a real app, this would delete a chapter from the database
    console.log('Delete chapter:', chapterId);
  };

  if (!activeSubject) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Subject Space</h2>
          <div className="flex items-center bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
            <Users className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
            <span className="text-blue-600 dark:text-blue-400">Leaderboard</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects.map(subject => (
            <button
              key={subject.id}
              onClick={() => setActiveSubject(subject)}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 text-left hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700 card-hover"
            >
              <div className="flex items-center">
                <BookOpen className="h-8 w-8 text-blue-600 dark:text-blue-400 mr-3" />
                <h3 className="text-lg font-semibold">{subject.name}</h3>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                {chapters.filter(ch => ch.subject_id === subject.id).length} chapters
              </p>
            </button>
          ))}
        </div>
        
        {/* Leaderboard */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 card-hover">
          <h3 className="text-xl font-bold mb-4 flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Leaderboard
          </h3>
          <div className="space-y-3">
            {leaderboard.map((student, index) => (
              <div key={student.id} className={`flex items-center justify-between p-3 rounded-lg ${
                index === 0 ? 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800' :
                index === 1 ? 'bg-gray-50 dark:bg-gray-700' :
                'bg-white dark:bg-gray-800'
              }`}>
                <div className="flex items-center">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    index === 0 ? 'bg-yellow-400 text-white' :
                    index === 1 ? 'bg-gray-400 text-white' :
                    'bg-blue-400 text-white'
                  }`}>
                    {index + 1}
                  </div>
                  <span className="ml-3 font-medium">{student.name}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm">Study Time: {student.study_time} min</div>
                  <div className="text-sm">Streak: {student.streak} days</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const subjectChapters = chapters.filter(ch => ch.subject_id === activeSubject.id);
  const firstPaperChapters = subjectChapters.filter(ch => ch.paper_type === 'first');
  const secondPaperChapters = subjectChapters.filter(ch => ch.paper_type === 'second');
  const singlePaperChapters = subjectChapters.filter(ch => ch.paper_type === 'single');

  const allChapters = activePaper === 'first' 
    ? firstPaperChapters 
    : activePaper === 'second' 
      ? secondPaperChapters 
      : singlePaperChapters;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveSubject(null)}
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          ← Back to Subjects
        </button>
        <h2 className="text-2xl font-bold">{activeSubject.name} Space</h2>
      </div>

      <div className="flex space-x-2">
        {activeSubject.name === 'ICT' ? (
          <button
            onClick={() => setActivePaper('single')}
            className={`px-4 py-2 rounded-lg font-medium ${
              activePaper === 'single'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Single Paper
          </button>
        ) : (
          <>
            <button
              onClick={() => setActivePaper('first')}
              className={`px-4 py-2 rounded-lg font-medium ${
                activePaper === 'first'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              1st Paper
            </button>
            <button
              onClick={() => setActivePaper('second')}
              className={`px-4 py-2 rounded-lg font-medium ${
                activePaper === 'second'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              2nd Paper
            </button>
          </>
        )}
        
        <button
          onClick={() => setShowAddChapterModal(true)}
          className="ml-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm flex items-center"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Chapter
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 card-hover">
        <h3 className="text-xl font-bold mb-4">Chapter Progress</h3>
        <div className="space-y-2">
          {allChapters.length > 0 ? (
            allChapters.map(chapter => (
              <div key={chapter.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center">
                  <button
                    onClick={() => toggleChapter(chapter.id)}
                    className={`h-5 w-5 rounded border-2 mr-3 ${
                      chapter.is_completed 
                        ? 'bg-green-500 border-green-500' 
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    {chapter.is_completed && <CheckCircle className="h-4 w-4 text-white" />}
                  </button>
                  <span className={chapter.is_completed ? 'line-through text-gray-500' : ''}>
                    {chapter.name}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => toggleWeakTopic(chapter.id)}
                    className={`p-1 rounded ${
                      chapter.weak_topic 
                        ? 'text-red-600 dark:text-red-400' 
                        : 'text-gray-400 hover:text-red-600'
                    }`}
                  >
                    <AlertCircle className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => deleteChapter(chapter.id)}
                    className="p-1 rounded text-gray-400 hover:text-red-600"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No chapters available for this paper</p>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 card-hover">
        <h3 className="text-xl font-bold mb-4">Notes Editor</h3>
        <textarea
          value={noteContent}
          onChange={(e) => handleNoteChange(e.target.value)}
          className="w-full h-64 p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          placeholder="Write your notes here..."
        />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 card-hover">
        <h3 className="text-xl font-bold mb-4">Weak Topics</h3>
        <div className="space-y-2">
          {allChapters.filter(ch => ch.weak_topic).length > 0 ? (
            allChapters.filter(ch => ch.weak_topic).map(chapter => (
              <div key={chapter.id} className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <span>{chapter.name}</span>
                <button className="text-red-600 dark:text-red-400 text-sm">Mark as Reviewed</button>
              </div>
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No weak topics identified yet</p>
          )}
        </div>
      </div>

      {/* Add Chapter Modal */}
      {showAddChapterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Add New Chapter</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Chapter Name</label>
                <input
                  type="text"
                  value={newChapter.name}
                  onChange={(e) => setNewChapter({...newChapter, name: e.target.value})}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                  placeholder="Enter chapter name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Paper Type</label>
                <select
                  value={newChapter.paper_type}
                  onChange={(e) => setNewChapter({...newChapter, paper_type: e.target.value})}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                >
                  <option value="first">1st Paper</option>
                  <option value="second">2nd Paper</option>
                  <option value="single">Single Paper</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex space-x-2">
              <button
                onClick={addChapter}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
              >
                Add Chapter
              </button>
              <button
                onClick={() => setShowAddChapterModal(false)}
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

export default SubjectSpace;
