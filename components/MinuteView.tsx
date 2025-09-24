import React from 'react';

interface MinuteViewProps {
  minuteDate: Date;
  onBack: () => void;
  now: Date;
}

const MinuteView: React.FC<MinuteViewProps> = ({ minuteDate, onBack, now }) => {
  const isCurrentMinute = Math.floor(minuteDate.getTime() / 60000) === Math.floor(now.getTime() / 60000);
  const currentSecond = now.getSeconds();

  const seconds = Array.from({ length: 60 }).map((_, i) => i);

  return (
    <div className="text-white dark:text-white ">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl sm:text-2xl font-bold">
         {minuteDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
        </h2>
        <button onClick={onBack} className="text-gray-400 dark:text-gray-400  hover:text-white dark:hover:text-white  transition">&larr; Back to Hour</button>
      </div>
      <p className="text-gray-400 dark:text-gray-400  mb-4 text-sm uppercase tracking-wider">Seconds</p>

      <div className="grid grid-cols-10 gap-1.5 sm:gap-2">
        {seconds.map(second => {
          const secondDate = new Date(minuteDate);
          secondDate.setSeconds(second, 0);

          let bgColor = 'bg-gray-700 dark:bg-gray-700 ';
          let extraClasses = '';
          
          if (secondDate < now) {
            bgColor = 'bg-teal-500';
          }
          if (isCurrentMinute && second === currentSecond) {
            bgColor = 'bg-yellow-400';
            extraClasses = 'animate-pulse';
          }

          return (
            <div
              key={second}
              title={`Second: ${second}`}
              className={`aspect-square rounded-md flex items-center justify-center ${bgColor} ${extraClasses}`}
            >
              <span className="text-sm font-semibold text-white dark:text-white ">
                {second.toString().padStart(2, '0')}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MinuteView;