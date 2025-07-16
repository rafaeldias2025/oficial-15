import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(true); // Default to dark theme (Netflix style)

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDark(savedTheme === 'dark');
      document.documentElement.className = savedTheme === 'dark' ? '' : 'light';
    } else {
      // Default to dark theme
      document.documentElement.className = '';
      localStorage.setItem('theme', 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark';
    setIsDark(!isDark);
    document.documentElement.className = newTheme === 'dark' ? '' : 'light';
    localStorage.setItem('theme', newTheme);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="relative smooth-transition hover:bg-accent/20"
    >
      <Sun className={`h-5 w-5 transition-all duration-300 ${isDark ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`} />
      <Moon className={`absolute h-5 w-5 transition-all duration-300 ${isDark ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`} />
      <span className="sr-only">Alternar tema</span>
    </Button>
  );
}