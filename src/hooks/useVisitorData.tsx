import { useState, useEffect } from 'react';

interface VisitorData {
  sessionProgress: Record<string, number>;
  sessionResponses: Record<string, string[]>;
  completedSessions: string[];
  lastActiveSession?: string;
  timeSpent: number;
  favoriteContent: string[];
}

const VISITOR_DATA_KEY = 'visitor_data';

export const useVisitorData = () => {
  const [visitorData, setVisitorData] = useState<VisitorData>({
    sessionProgress: {},
    sessionResponses: {},
    completedSessions: [],
    timeSpent: 0,
    favoriteContent: [],
  });

  useEffect(() => {
    // Carregar dados salvos do localStorage na inicialização
    const savedData = localStorage.getItem(VISITOR_DATA_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setVisitorData(parsed);
      } catch (error) {
        console.error('Erro ao carregar dados do visitante:', error);
      }
    }
  }, []);

  const saveVisitorData = (newData: Partial<VisitorData>) => {
    const updatedData = { ...visitorData, ...newData };
    setVisitorData(updatedData);
    localStorage.setItem(VISITOR_DATA_KEY, JSON.stringify(updatedData));
  };

  const saveSessionProgress = (sessionId: string, progress: number) => {
    const newProgress = {
      ...visitorData.sessionProgress,
      [sessionId]: progress,
    };
    saveVisitorData({ 
      sessionProgress: newProgress,
      lastActiveSession: sessionId,
    });
  };

  const saveSessionResponse = (sessionId: string, taskIndex: number, response: string) => {
    const currentResponses = visitorData.sessionResponses[sessionId] || [];
    const newResponses = [...currentResponses];
    newResponses[taskIndex] = response;
    
    const updatedSessionResponses = {
      ...visitorData.sessionResponses,
      [sessionId]: newResponses,
    };

    saveVisitorData({ sessionResponses: updatedSessionResponses });
  };

  const completeSession = (sessionId: string) => {
    if (!visitorData.completedSessions.includes(sessionId)) {
      const newCompletedSessions = [...visitorData.completedSessions, sessionId];
      saveVisitorData({ 
        completedSessions: newCompletedSessions,
        sessionProgress: { ...visitorData.sessionProgress, [sessionId]: 100 }
      });
    }
  };

  const addTimeSpent = (minutes: number) => {
    saveVisitorData({ timeSpent: visitorData.timeSpent + minutes });
  };

  const addToFavorites = (contentId: string) => {
    if (!visitorData.favoriteContent.includes(contentId)) {
      const newFavorites = [...visitorData.favoriteContent, contentId];
      saveVisitorData({ favoriteContent: newFavorites });
    }
  };

  const clearVisitorData = () => {
    localStorage.removeItem(VISITOR_DATA_KEY);
    setVisitorData({
      sessionProgress: {},
      sessionResponses: {},
      completedSessions: [],
      timeSpent: 0,
      favoriteContent: [],
    });
  };

  const getVisitorStats = () => {
    const totalSessions = Object.keys(visitorData.sessionProgress).length;
    const avgProgress = totalSessions > 0 
      ? Object.values(visitorData.sessionProgress).reduce((sum, progress) => sum + progress, 0) / totalSessions
      : 0;
    
    return {
      totalSessions,
      completedSessions: visitorData.completedSessions.length,
      avgProgress: Math.round(avgProgress),
      timeSpent: visitorData.timeSpent,
      favoriteCount: visitorData.favoriteContent.length,
      hasData: totalSessions > 0 || visitorData.timeSpent > 0,
    };
  };

  return {
    visitorData,
    saveSessionProgress,
    saveSessionResponse,
    completeSession,
    addTimeSpent,
    addToFavorites,
    clearVisitorData,
    getVisitorStats,
  };
};