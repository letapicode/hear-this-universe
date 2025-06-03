
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface ListeningSession {
  id: string;
  contentId: string;
  contentTitle: string;
  contentAuthor: string;
  startTime: Date;
  endTime?: Date;
  duration: number;
  progressSeconds: number;
  completed: boolean;
}

export const useListeningHistory = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState<ListeningSession[]>([]);
  const [currentSession, setCurrentSession] = useState<ListeningSession | null>(null);

  // Load history from localStorage
  useEffect(() => {
    if (!user) return;
    
    const savedHistory = localStorage.getItem(`listening_history_${user.id}`);
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        setHistory(parsed);
      } catch (error) {
        console.error('Failed to load listening history:', error);
      }
    }
  }, [user]);

  // Save history to localStorage
  const saveHistory = (newHistory: ListeningSession[]) => {
    if (!user) return;
    localStorage.setItem(`listening_history_${user.id}`, JSON.stringify(newHistory));
    setHistory(newHistory);
  };

  const startSession = (content: any) => {
    if (!user || !content) return;

    const session: ListeningSession = {
      id: Date.now().toString(),
      contentId: content.id,
      contentTitle: content.title,
      contentAuthor: content.author,
      startTime: new Date(),
      duration: 0,
      progressSeconds: 0,
      completed: false
    };

    setCurrentSession(session);
  };

  const updateSession = (progressSeconds: number, isCompleted: boolean = false) => {
    if (!currentSession) return;

    const updatedSession = {
      ...currentSession,
      progressSeconds,
      completed: isCompleted,
      duration: Date.now() - currentSession.startTime.getTime()
    };

    setCurrentSession(updatedSession);
  };

  const endSession = () => {
    if (!currentSession) return;

    const finishedSession = {
      ...currentSession,
      endTime: new Date(),
      duration: Date.now() - currentSession.startTime.getTime()
    };

    const newHistory = [finishedSession, ...history.slice(0, 49)]; // Keep last 50 sessions
    saveHistory(newHistory);
    setCurrentSession(null);
  };

  const getSessionStats = () => {
    const totalTime = history.reduce((sum, session) => sum + session.duration, 0);
    const completedBooks = history.filter(session => session.completed).length;
    const averageSessionTime = history.length > 0 ? totalTime / history.length : 0;

    return {
      totalListeningTime: totalTime,
      completedBooks,
      totalSessions: history.length,
      averageSessionTime
    };
  };

  return {
    history,
    currentSession,
    startSession,
    updateSession,
    endSession,
    getSessionStats
  };
};
