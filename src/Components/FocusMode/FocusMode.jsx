import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Target } from 'lucide-react';

const FocusMode = ({ subjects, onExit }) => {
  const [timerMode, setTimerMode] = useState('pomodoro');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [currentSubject, setCurrentSubject] = useState(null);
  const [showSound, setShowSound] = useState(false);
  const [soundType, setSoundType] = useState('rain');
  
  const timerRef = useRef(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      // Auto-complete current subject study session
      if (currentSubject) {
        // In a real app, this would log the study session
        console.log('Completed study session for:', currentSubject.name);
      }
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isRunning, timeLeft, currentSubject]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = (mode) => {
    let minutes = 25;
    if (mode === 'long') minutes = 50;
    if (mode === 'custom') minutes = 45; // Default custom time
    setTimeLeft(minutes * 60);
    setIsRunning(true);
    setTimerMode(mode);
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    let minutes = 25;
    if (timerMode === 'long') minutes = 50;
    if (timerMode === 'custom') minutes = 45;
    setTimeLeft(minutes * 60);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <button
        onClick={onExit}
        className="absolute top-4 right-4 text-white hover:text-gray-300"
      >
        Exit Focus Mode
      </button>

      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">Focus Mode</h1>
        <p className="text-gray-400">Eliminate distractions and focus on your studies</p>
      </div>

      <div className="bg-gray-900 rounded-2xl p-8 mb-8 text-center">
        <div className="text-6xl font-mono mb-4">{formatTime(timeLeft)}</div>
        <div className="text-xl mb-6">
          {currentSubject ? `Studying: ${currentSubject.name}` : 'Select a subject to start'}
        </div>
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => toggleTimer()}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-medium"
          >
            {isRunning ? <Pause className="h-5 w-5 inline mr-2" /> : <Play className="h-5 w-5 inline mr-2" />}
            {isRunning ? 'Pause' : 'Start'}
          </button>
          <button
            onClick={() => resetTimer()}
            className="bg-gray-600 hover:bg-gray-700 px-6 py-3 rounded-lg font-medium"
          >
            <RotateCcw className="h-5 w-5 inline mr-2" />
            Reset
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl">
        {subjects.map(subject => (
          <button
            key={subject.id}
            onClick={() => setCurrentSubject(subject)}
            className={`p-4 rounded-lg border-2 transition-all ${
              currentSubject?.id === subject.id
                ? 'border-blue-500 bg-blue-500/20'
                : 'border-gray-700 hover:border-gray-600'
            }`}
          >
            <div className="font-medium">{subject.name}</div>
          </button>
        ))}
      </div>

      <div className="mt-8 flex space-x-4">
        <button
          onClick={() => setShowSound(!showSound)}
          className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg"
        >
          {showSound ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
        </button>
        <select
          value={soundType}
          onChange={(e) => setSoundType(e.target.value)}
          className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
        >
          <option value="rain">Rain Sound</option>
          <option value="white">White Noise</option>
          <option value="forest">Forest</option>
        </select>
        
        <div className="flex space-x-2">
          <button
            onClick={() => startTimer('pomodoro')}
            className={`px-4 py-2 rounded-lg ${
              timerMode === 'pomodoro' ? 'bg-blue-600' : 'bg-gray-700'
            }`}
          >
            25 Min
          </button>
          <button
            onClick={() => startTimer('long')}
            className={`px-4 py-2 rounded-lg ${
              timerMode === 'long' ? 'bg-blue-600' : 'bg-gray-700'
            }`}
          >
            50 Min
          </button>
          <button
            onClick={() => startTimer('custom')}
            className={`px-4 py-2 rounded-lg ${
              timerMode === 'custom' ? 'bg-blue-600' : 'bg-gray-700'
            }`}
          >
            Custom
          </button>
        </div>
      </div>
    </div>
  );
};

export default FocusMode;
