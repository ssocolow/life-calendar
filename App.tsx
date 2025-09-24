import React, { useState, useMemo, useEffect } from 'react';
import YearView from './components/YearView';
import WeekView from './components/WeekView';
import DayView from './components/DayView';
import HourView from './components/HourView';
import MinuteView from './components/MinuteView';
import Header from './components/Header';
import ThemeToggle from './components/ThemeToggle';
import { ThemeProvider } from './contexts/ThemeContext';
import { ModalContentType } from './types';

const AppContent: React.FC = () => {
  // Get a date 30 years ago as the default
  const getDefaultBirthDate = (): string => {
    return '2003-08-15';
  };

  // Load from localStorage or use defaults
  const getInitialBirthDate = (): string => {
    const saved = localStorage.getItem('lifecal-birthdate');
    return saved || getDefaultBirthDate();
  };

  const getInitialLifeExpectancy = (): number => {
    const saved = localStorage.getItem('lifecal-lifeexpectancy');
    return saved ? parseInt(saved, 10) : 100;
  };

  const [birthDate, setBirthDate] = useState<string>(getInitialBirthDate());
  const [lifeExpectancy, setLifeExpectancy] = useState<number>(getInitialLifeExpectancy());
  const [modalContent, setModalContent] = useState<ModalContentType>(null);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Save birth date to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('lifecal-birthdate', birthDate);
  }, [birthDate]);

  // Save life expectancy to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('lifecal-lifeexpectancy', lifeExpectancy.toString());
  }, [lifeExpectancy]);


  const birthDateObj = useMemo(() => {
    if (!birthDate || !/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) {
      return new Date(NaN);
    }
    const parts = birthDate.split('-');
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
    const day = parseInt(parts[2], 10);
    
    // Use local time to create a date at midnight, avoiding timezone shifts from UTC.
    const localDate = new Date(year, month, day);

    // Check if the created date is valid and matches the input parts.
    // This handles cases like '2023-02-30'.
    if (localDate.getFullYear() !== year || localDate.getMonth() !== month || localDate.getDate() !== day) {
        return new Date(NaN);
    }
    return localDate;
  }, [birthDate]);

  const handleWeekClick = (weekIndex: number) => {
    if (isNaN(birthDateObj.getTime())) return;
    const weekStartDate = new Date(birthDateObj.getTime() + weekIndex * 7 * 24 * 60 * 60 * 1000);
    setModalContent({ type: 'WEEK', date: weekStartDate });
  };

  const handleDayClick = (dayDate: Date) => {
    setModalContent({ type: 'DAY', date: dayDate });
  };

  const handleHourClick = (hourDate: Date) => {
    setModalContent({ type: 'HOUR', date: hourDate });
  };
  
  const handleMinuteClick = (minuteDate: Date) => {
    setModalContent({ type: 'MINUTE', date: minuteDate });
  };
  
  const handleBackFromDay = () => {
      if(modalContent && modalContent.type === 'DAY') {
          // Find the start of the week for the current day
          const dateCopy = new Date(modalContent.date);
          const dayOfWeek = dateCopy.getDay();
          const diff = dateCopy.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // adjust when day is sunday
          const weekStartDate = new Date(dateCopy.setDate(diff));
          weekStartDate.setHours(0,0,0,0);
          setModalContent({ type: 'WEEK', date: weekStartDate });
      }
  };

  const handleBackFromHour = () => {
    if (modalContent && modalContent.type === 'HOUR') {
      const dayDate = new Date(modalContent.date);
      dayDate.setHours(0, 0, 0, 0);
      setModalContent({ type: 'DAY', date: dayDate });
    }
  };

  const handleBackFromMinute = () => {
    if (modalContent && modalContent.type === 'MINUTE') {
      const hourDate = new Date(modalContent.date);
      hourDate.setMinutes(0, 0, 0);
      setModalContent({ type: 'HOUR', date: hourDate });
    }
  };


  return (
    <div className="min-h-screen bg-gray-900 dark:bg-gray-900 text-gray-300 dark:text-gray-300 font-sans" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <div className="relative">
        <Header 
          birthDate={birthDate}
          onBirthDateChange={setBirthDate}
          lifeExpectancy={lifeExpectancy}
          onLifeExpectancyChange={setLifeExpectancy}
        />
        <ThemeToggle />
        <main className="px-4 sm:px-6 md:px-8 pb-4 sm:pb-6 md:pb-8">
          <YearView
            birthDate={birthDateObj}
            lifeExpectancy={lifeExpectancy}
            onWeekClick={handleWeekClick}
            now={now}
          />
        </main>
      </div>

      {/* Modal */}
      {modalContent && (
        <div 
            className="fixed inset-0 bg-black/70 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity duration-300"
            onClick={() => setModalContent(null)}
        >
          <div 
            className="bg-gray-800 dark:bg-gray-800 rounded-xl shadow-2xl p-6 md:p-8 w-full max-w-lg transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale" style={{ backgroundColor: 'var(--bg-secondary)' }}
            onClick={(e) => e.stopPropagation()}
          >
            {modalContent.type === 'WEEK' && (
              <WeekView 
                weekStartDate={modalContent.date} 
                onDayClick={handleDayClick} 
                onBack={() => setModalContent(null)}
                now={now}
              />
            )}
            {modalContent.type === 'DAY' && (
              <DayView 
                dayDate={modalContent.date} 
                onBack={handleBackFromDay}
                onHourClick={handleHourClick}
                now={now}
             />
            )}
            {modalContent.type === 'HOUR' && (
              <HourView
                hourDate={modalContent.date}
                onBack={handleBackFromHour}
                onMinuteClick={handleMinuteClick}
                now={now}
              />
            )}
            {modalContent.type === 'MINUTE' && (
              <MinuteView
                minuteDate={modalContent.date}
                onBack={handleBackFromMinute}
                now={now}
              />
            )}
          </div>
        </div>
      )}
      <style>{`
        @keyframes fade-in-scale {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fade-in-scale {
          animation: fade-in-scale 0.2s forwards;
        }
      `}</style>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;