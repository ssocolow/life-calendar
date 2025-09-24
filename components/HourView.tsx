import React from 'react';

interface HourViewProps {
  hourDate: Date;
  onMinuteClick: (minuteDate: Date) => void;
  onBack: () => void;
  now: Date;
}

const HourView: React.FC<HourViewProps> = ({ hourDate, onMinuteClick, onBack, now }) => {
  const isCurrentHour = 
    hourDate.getFullYear() === now.getFullYear() &&
    hourDate.getMonth() === now.getMonth() &&
    hourDate.getDate() === now.getDate() &&
    hourDate.getHours() === now.getHours();
    
  const currentMinute = now.getMinutes();

  const minutes = Array.from({ length: 60 }).map((_, i) => i);

  return (
    <div className="text-white dark:text-white ">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl sm:text-2xl font-bold">
          {hourDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })} on {hourDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </h2>
        <button onClick={onBack} className="text-gray-400 dark:text-gray-400  hover:text-white dark:hover:text-white  transition">&larr; Back to Day</button>
      </div>
      <p className="text-gray-400 dark:text-gray-400  mb-4 text-sm uppercase tracking-wider">Minutes</p>

      <div className="grid grid-cols-10 gap-1.5 sm:gap-2">
        {minutes.map(minute => {
          const minuteDate = new Date(hourDate);
          minuteDate.setMinutes(minute, 0, 0);

          if (isCurrentHour && minute === currentMinute) {
            const progress = (now.getSeconds() / 60) * 100;
            return (
               <div
                key={minute}
                title={`Minute: ${minute.toString().padStart(2, '0')}`}
                onClick={() => onMinuteClick(minuteDate)}
                className="aspect-square rounded-md flex items-center justify-center cursor-pointer transition-transform duration-150 hover:scale-110 bg-gray-700 dark:bg-gray-700  relative overflow-hidden"
              >
                <div className="absolute bottom-0 left-0 w-full bg-yellow-400" style={{ height: `${progress}%` }} />
                <span className="relative z-10 text-sm font-semibold text-white dark:text-white ">
                  {minute.toString().padStart(2, '0')}
                </span>
              </div>
            );
          }
          
          const bgColor = minuteDate < now ? 'bg-teal-500 hover:bg-teal-400' : 'bg-gray-700 dark:bg-gray-700  hover:bg-gray-600 dark:hover:bg-gray-600 ';

          return (
            <div
              key={minute}
              title={`Minute: ${minute.toString().padStart(2, '0')}`}
              onClick={() => onMinuteClick(minuteDate)}
              className={`aspect-square rounded-md flex items-center justify-center cursor-pointer transition-transform duration-150 hover:scale-110 ${bgColor}`}
            >
              <span className="text-sm font-semibold text-white dark:text-white ">
                {minute.toString().padStart(2, '0')}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HourView;