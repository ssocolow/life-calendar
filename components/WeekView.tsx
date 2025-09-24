import React from 'react';

interface WeekViewProps {
  weekStartDate: Date;
  onDayClick: (dayDate: Date) => void;
  onBack: () => void;
  now: Date;
}

const WeekView: React.FC<WeekViewProps> = ({ weekStartDate, onDayClick, onBack, now }) => {
  const days = Array.from({ length: 7 }).map((_, i) => {
    const dayTimestamp = weekStartDate.getTime() + i * 24 * 60 * 60 * 1000;
    return new Date(dayTimestamp);
  });

  const dayLabels = days.map(d => d.toLocaleDateString(undefined, { weekday: 'short' }));
  
  return (
    <div className="text-white dark:text-white" style={{ color: 'var(--text-primary)' }}>
      <div className="flex justify-between items-center mb-6">
         <h2 className="text-2xl font-bold">
            Week of {weekStartDate.toLocaleDateString()}
         </h2>
         <button onClick={onBack} className="text-gray-400 dark:text-gray-400 hover:text-white dark:hover:text-white transition" style={{ color: 'var(--text-secondary)' }}>&times; Close</button>
      </div>

      <div className="grid grid-cols-7 gap-3 text-center">
        {dayLabels.map((label, index) => (
          <div key={index} className="text-xs text-gray-400 dark:text-gray-400 font-medium" style={{ color: 'var(--text-secondary)' }}>{label}</div>
        ))}
        {days.map((day, index) => {
          const dayStart = new Date(day);
          dayStart.setHours(0,0,0,0);
          
          const nowStartOfDay = new Date(now);
          nowStartOfDay.setHours(0,0,0,0);

          const isPresent = dayStart.getTime() === nowStartOfDay.getTime();
          const isPast = dayStart.getTime() < nowStartOfDay.getTime();

          if (isPresent) {
            const progress = ((now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds()) / 86400) * 100;
            return (
              <div 
                key={index} 
                className="flex flex-col items-center justify-center cursor-pointer group"
                onClick={() => onDayClick(day)}
              >
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center transition-transform duration-150 group-hover:scale-110 bg-gray-700 dark:bg-gray-700 relative overflow-hidden"
                  style={{ backgroundColor: 'var(--bg-tertiary)' }}
                >
                  <div className="absolute bottom-0 left-0 w-full bg-yellow-400" style={{ height: `${progress}%` }} />
                  <span className="relative z-10 text-xl font-bold text-white dark:text-white" style={{ color: 'var(--text-primary)' }}>
                    {day.getDate()}
                  </span>
                </div>
              </div>
            );
          }

          let bgColor = isPast ? 'bg-teal-500 hover:bg-teal-400' : 'bg-gray-700 dark:bg-gray-700 hover:bg-gray-600 dark:hover:bg-gray-600';
          
          return (
            <div 
              key={index} 
              className="flex flex-col items-center justify-center cursor-pointer group"
              onClick={() => onDayClick(day)}
            >
              <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center transition-transform duration-150 group-hover:scale-110 ${bgColor}`}
              >
                <span className="text-xl font-bold text-white dark:text-white mix-blend-overlay" style={{ color: 'var(--text-primary)' }}>
                  {day.getDate()}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeekView;