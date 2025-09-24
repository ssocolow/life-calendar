import React from 'react';

interface DayViewProps {
  dayDate: Date;
  onBack: () => void;
  onHourClick: (hourDate: Date) => void;
  now: Date;
}

const DayView: React.FC<DayViewProps> = ({ dayDate, onBack, onHourClick, now }) => {
  const hours = Array.from({ length: 24 }).map((_, i) => i);
  
  const nowStartOfDay = new Date(now);
  nowStartOfDay.setHours(0, 0, 0, 0);
  
  const dayStart = new Date(dayDate);
  dayStart.setHours(0,0,0,0);

  const isToday = dayStart.getTime() === nowStartOfDay.getTime();
  const isPastDay = dayStart.getTime() < nowStartOfDay.getTime();
  const currentHour = now.getHours();

  return (
    <div className="text-white dark:text-white" style={{ color: 'var(--text-primary)' }}>
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-2xl font-bold">
          {dayDate.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </h2>
        <button onClick={onBack} className="text-gray-400 dark:text-gray-400  hover:text-white dark:hover:text-white  transition">&larr; Back to Week</button>
      </div>
      <p className="text-gray-400 dark:text-gray-400  mb-4 text-sm uppercase tracking-wider">Hours</p>

      <div className="grid grid-cols-6 sm:grid-cols-8 gap-3">
        {hours.map(hour => {
          const hourDate = new Date(dayDate);
          hourDate.setHours(hour, 0, 0, 0);
          
          let isPresent = false;
          let bgColor = 'bg-gray-700 dark:bg-gray-700  hover:bg-gray-600 dark:hover:bg-gray-600 ';

          if (isPastDay) {
            bgColor = 'bg-teal-500 hover:bg-teal-400';
          } else if (isToday) {
            if (hour < currentHour) {
              bgColor = 'bg-teal-500 hover:bg-teal-400';
            } else if (hour === currentHour) {
              isPresent = true;
            }
          }

          if (isPresent) {
            const progress = ((now.getMinutes() * 60 + now.getSeconds()) / 3600) * 100;
            return (
              <div
                key={hour}
                title={`Hour: ${hour}:00 - ${hour}:59`}
                onClick={() => onHourClick(hourDate)}
                className="aspect-square rounded-md flex items-center justify-center cursor-pointer transition-transform duration-150 hover:scale-110 bg-gray-700 dark:bg-gray-700  relative overflow-hidden"
              >
                <div className="absolute bottom-0 left-0 w-full bg-yellow-400" style={{ height: `${progress}%` }} />
                <span className="relative z-10 text-sm font-semibold text-white dark:text-white ">
                  {hour.toString().padStart(2, '0')}
                </span>
              </div>
            );
          }

          return (
            <div
              key={hour}
              title={`Hour: ${hour}:00 - ${hour}:59`}
              onClick={() => onHourClick(hourDate)}
              className={`aspect-square rounded-md flex items-center justify-center cursor-pointer transition-transform duration-150 hover:scale-110 ${bgColor}`}
            >
              <span className="text-sm font-semibold text-white dark:text-white ">
                {hour.toString().padStart(2, '0')}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DayView;