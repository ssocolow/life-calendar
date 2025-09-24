import React, { useMemo } from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface HeaderProps {
  birthDate: string;
  onBirthDateChange: (date: string) => void;
  lifeExpectancy: number;
  onLifeExpectancyChange: (age: number) => void;
}

const Header: React.FC<HeaderProps> = ({
  birthDate,
  onBirthDateChange,
  lifeExpectancy,
  onLifeExpectancyChange,
}) => {
  const { theme } = useTheme();

  const birthDateObj = useMemo(() => {
    if (!birthDate || !/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) return null;
    const parts = birthDate.split('-');
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const d = new Date(year, month, day);
    // Check for invalid dates like 2023-02-30
    if (d.getFullYear() === year && d.getMonth() === month && d.getDate() === day) {
        return d;
    }
    return null;
  }, [birthDate]);

  const deathDate = useMemo(() => {
    if (!birthDateObj) return null;
    const d = new Date(birthDateObj);
    d.setFullYear(d.getFullYear() + lifeExpectancy);
    return d;
  }, [birthDateObj, lifeExpectancy]);

  return (
    <header className={`absolute inset-x-0 z-10 text-center pointer-events-none ${theme === 'light' ? 'top-0 -top-2 pt-2 sm:pt-3 md:pt-4' : 'top-0 pt-4 sm:pt-6 md:pt-8'}`}>
      <div className={`flex flex-col items-center ${theme === 'light' ? 'gap-3' : 'gap-6'}`}>
          <div className={theme === 'light' ? 'bg-white/90 backdrop-blur-sm rounded-lg px-6 py-4 shadow-lg' : ''}>
            <h1 className={`text-4xl sm:text-5xl font-bold tracking-tight ${theme === 'light' ? 'text-black drop-shadow-sm' : 'text-white'}`}>
              Life Calendar
            </h1>
            <p className={`mt-3 text-xl italic max-w-2xl ${theme === 'light' ? 'text-black drop-shadow-sm' : 'text-gray-200'}`}>
              "Teach us to number our days, that we may gain a heart of wisdom"
            </p>
          </div>

          <div className="w-full max-w-xs space-y-3 rounded-lg bg-gray-800/50 dark:bg-gray-800/50 p-4 border border-gray-700 dark:border-gray-700 pointer-events-auto shadow-lg dark:shadow-lg" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
            <div className="flex items-center justify-between">
              <label htmlFor="birthdate" className="text-base font-medium text-gray-300 dark:text-gray-300" style={{ color: 'var(--text-primary)' }}>Birthday</label>
              <input
                id="birthdate"
                type="date"
                value={birthDate}
                onChange={(e) => onBirthDateChange(e.target.value)}
                className="bg-gray-700 dark:bg-gray-700 rounded-md focus:ring-2 focus:ring-teal-500 focus:outline-none text-base p-1.5 border-gray-600 dark:border-gray-600 border"
                style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)', borderColor: 'var(--border-color)' }}
                aria-label="Your birth date"
              />
            </div>
            <div className="flex items-center justify-between">
              <label htmlFor="lifespan" className="text-base font-medium text-gray-300 dark:text-gray-300" style={{ color: 'var(--text-primary)' }}>Expectancy</label>
               <input
                id="lifespan"
                type="number"
                value={lifeExpectancy}
                onChange={(e) => {
                    const age = parseInt(e.target.value, 10);
                    if (!isNaN(age) && age >= 1 && age <= 120) {
                        onLifeExpectancyChange(age);
                    }
                }}
                min="1"
                max="120"
                className="bg-gray-700 dark:bg-gray-700 rounded-md focus:ring-2 focus:ring-teal-500 focus:outline-none text-base p-1.5 border-gray-600 dark:border-gray-600 border w-24 text-center"
                style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)', borderColor: 'var(--border-color)' }}
                aria-label="Your life expectancy"
              />
            </div>
            <div className="flex items-center justify-between">
                <label className="text-base font-medium text-gray-300 dark:text-gray-300" style={{ color: 'var(--text-primary)' }}>Deathday</label>
                <div className="flex items-center justify-center h-[38px]">
                     <span className="text-base text-white dark:text-white font-semibold text-center" style={{ color: 'var(--text-primary)' }}>
                        {deathDate ? deathDate.toLocaleDateString() : '---'}
                    </span>
                </div>
            </div>
          </div>
      </div>
    </header>
  );
};

export default Header;