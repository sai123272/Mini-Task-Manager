import React, { useState } from 'react';
import AuthPage from './pages/AuthPage';
import TaskListPage from './pages/TaskListPage';
import { getCurrentToken } from './api';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!getCurrentToken());

  function handleLogout() {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    window.location.reload();
  }

  return isAuthenticated ? <TaskListPage onLogout={handleLogout} /> : <AuthPage onLogin={() => setIsAuthenticated(true)} />;
}
