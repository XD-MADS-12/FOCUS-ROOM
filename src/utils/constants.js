export const SUBJECTS = [
  { id: 1, name: 'Bangla', papers: ['first', 'second'] },
  { id: 2, name: 'English', papers: ['first', 'second'] },
  { id: 3, name: 'Physics', papers: ['first', 'second'] },
  { id: 4, name: 'Chemistry', papers: ['first', 'second'] },
  { id: 5, name: 'Higher Math', papers: ['first', 'second'] },
  { id: 6, name: 'Biology', papers: ['first', 'second'] },
  { id: 7, name: 'ICT', papers: ['single'] }
];

export const TIMER_MODES = {
  POMODORO: { name: 'pomodoro', duration: 25 * 60, label: 'Pomodoro (25 min)' },
  LONG: { name: 'long', duration: 50 * 60, label: 'Long Session (50 min)' },
  CUSTOM: { name: 'custom', duration: 45 * 60, label: 'Custom (45 min)' }
};
