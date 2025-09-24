import React, { useMemo } from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface YearViewProps {
  birthDate: Date;
  lifeExpectancy: number;
  onWeekClick: (weekIndex: number) => void;
  now: Date;
}

const YearView: React.FC<YearViewProps> = ({ birthDate, lifeExpectancy, onWeekClick, now }) => {
  const { theme } = useTheme();
  const { preLifeYears, lifeYears, postLifeYears, weeksPassed, currentWeek, NUM_PHANTOM_YEARS } = useMemo(() => {
    const NUM_PHANTOM_YEARS_CONST = 16;
    if (isNaN(birthDate.getTime())) return { preLifeYears: [], lifeYears: [], postLifeYears: [], weeksPassed: 0, currentWeek: -1, NUM_PHANTOM_YEARS: NUM_PHANTOM_YEARS_CONST };

    const msInWeek = 1000 * 60 * 60 * 24 * 7;
    const calculatedWeeksPassed = Math.floor((now.getTime() - birthDate.getTime()) / msInWeek);
    const totalWeeks = lifeExpectancy * 52;
    
    const phantomWeekTpl = Array.from({ length: 52 });
    
    const preLifeYearData: { year: number; weeks: unknown[] }[] = [];
    for (let i = 0; i < NUM_PHANTOM_YEARS_CONST; i++) {
        preLifeYearData.push({ year: -(NUM_PHANTOM_YEARS_CONST - i), weeks: phantomWeekTpl });
    }

    const lifeYearData: { year: number; weeks: { weekIndex: number }[] }[] = [];
    for (let year = 0; year < lifeExpectancy; year++) {
      const weeksInYear: { weekIndex: number }[] = [];
      for (let weekInYear = 0; weekInYear < 52; weekInYear++) {
        const weekIndex = year * 52 + weekInYear;
        if (weekIndex < totalWeeks) {
          weeksInYear.push({ weekIndex });
        }
      }
      lifeYearData.push({ year: year, weeks: weeksInYear });
    }

    const postLifeYearData: { year: number; weeks: unknown[] }[] = [];
    for (let i = 0; i < 10; i++) { // Keep post-life years at 10 for balance
        postLifeYearData.push({ year: lifeExpectancy + i, weeks: phantomWeekTpl });
    }

    return { 
        preLifeYears: preLifeYearData,
        lifeYears: lifeYearData,
        postLifeYears: postLifeYearData,
        weeksPassed: calculatedWeeksPassed, 
        currentWeek: calculatedWeeksPassed,
        NUM_PHANTOM_YEARS: NUM_PHANTOM_YEARS_CONST
    };
  }, [birthDate, lifeExpectancy, now]);

  if (!lifeYears.length) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-500 py-20">
        Please enter a valid birth date to see your life map.
      </div>
    );
  }

  const getWeekTooltip = (weekIndex: number): string => {
    const startDate = new Date(birthDate.getTime() + weekIndex * 7 * 24 * 60 * 60 * 1000);
    const endDate = new Date(startDate.getTime() + 6 * 24 * 60 * 60 * 1000);
    return `Week ${weekIndex + 1}: ${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
  };

  const PhantomYearRow = ({ year, ...props }: { year: number; [key: string]: any }) => (
    <div className="flex items-start gap-3">
        <div className="w-8 shrink-0 text-right font-mono text-xs text-gray-500 dark:text-gray-500 pt-px">{year}</div>
        <div className="flex flex-wrap gap-1">
            {Array.from({ length: 52 }).map((_, index) => (
                <div
                    key={`${year}-${index}`}
                    className="w-3 h-3 rounded-sm bg-purple-900/60 dark:bg-purple-900/60"
                />
            ))}
        </div>
    </div>
  );
  
  return (
    <div className="relative flex justify-center">
      {/* Udidnte SVG - Top right of the page */}
      <div className="absolute top-20 right-0 z-10">
        <img src="/udidnte.svg" alt="Udidnte" className="w-[300px] h-auto opacity-80" />
      </div>

      {/* Urhere SVG - Pointing to current flashing week (only in dark mode) */}
      {currentWeek >= 0 && theme === 'dark' && (
        <div className="absolute z-10" style={{
          top: `${100 + (preLifeYears.length * 20) + (Math.floor(currentWeek / 52) * 20) + 10}px`,
          left: `${200 + ((currentWeek % 52) * 16) + 170}px`,
          transform: 'translate(-50%, -50%)'
        }}>
          <img src="/urhere.svg" alt="Urhere" className="w-28 h-auto opacity-100" />
        </div>
      )}

      <div className="inline-block space-y-1">
        {/* Render pre-life phantom years */}
        {preLifeYears.map((yearData) => (
          <PhantomYearRow key={yearData.year} year={yearData.year} />
        ))}

        <div className="w-full h-px bg-green-500 -my-0.5" aria-hidden="true" />
        
        {/* Render life years */}
        {lifeYears.map(({ year, weeks }) => (
          <div key={year} className="flex items-start gap-3">
            <div className="w-8 shrink-0 text-right font-mono text-xs text-gray-500 dark:text-gray-500 pt-px">{year}</div>
            <div className="flex flex-wrap gap-1">
              {weeks.map(({ weekIndex }) => {
                const isPast = weekIndex < weeksPassed;
                const isPresent = weekIndex === currentWeek;
                
                if (isPresent) {
                  return (
                    <div
                      key={weekIndex}
                      title={getWeekTooltip(weekIndex)}
                      onClick={() => onWeekClick(weekIndex)}
                      className="w-3 h-3 rounded-sm cursor-pointer transition-transform duration-150 hover:scale-125 bg-yellow-400 hover:bg-yellow-300 animate-pulse"
                    />
                  );
                }

                const bgColor = isPast 
                  ? 'bg-teal-500 hover:bg-teal-400' 
                  : theme === 'light' 
                    ? 'bg-white border border-gray-300 hover:border-gray-400' 
                    : 'bg-gray-700 hover:bg-gray-600';

                return (
                  <div
                    key={weekIndex}
                    title={getWeekTooltip(weekIndex)}
                    onClick={() => onWeekClick(weekIndex)}
                    className={`w-3 h-3 rounded-sm cursor-pointer transition-transform duration-150 hover:scale-125 ${bgColor}`}
                  />
                );
              })}
            </div>
          </div>
        ))}
        
        <div className="w-full h-px bg-red-500 -my-0.5" aria-hidden="true" />

        {/* Uwonte SVG - Right side under the red line */}
        <div className="absolute right-0 z-10" style={{
          top: `${88 + (preLifeYears.length * 20) + (lifeYears.length * 20) + 40}px`
        }}>
          <img src="/uwonte.svg" alt="Uwonte" className="w-[300px] h-auto opacity-80" />
        </div>

        {/* Render post-life phantom years */}
        {postLifeYears.map((yearData) => (
          <PhantomYearRow key={yearData.year} year={yearData.year} />
        ))}
      </div>
    </div>
  );
};

export default YearView;