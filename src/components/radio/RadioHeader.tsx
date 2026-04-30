import { useEffect, useRef } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { CurrentTrack } from './types';

interface RadioHeaderProps {
  currentTrack: CurrentTrack;
  timeOfDay: 'morning' | 'day' | 'evening' | 'night';
  onTimeOfDayChange: (time: 'morning' | 'day' | 'evening' | 'night') => void;
}

const RadioHeader = ({ currentTrack, timeOfDay, onTimeOfDayChange }: RadioHeaderProps) => {
  const storiesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://app.vidwidget.ru/n/7c352719-e579-453f-9dfb-e5dac97bffee/';
    script.async = true;
    storiesRef.current?.appendChild(script);
    return () => {
      script.remove();
    };
  }, []);

  const timeOptions: Array<{ value: 'morning' | 'day' | 'evening' | 'night'; icon: string; label: string }> = [
    { value: 'morning', icon: 'Sunrise', label: 'Утро' },
    { value: 'day', icon: 'Sun', label: 'День' },
    { value: 'evening', icon: 'Sunset', label: 'Вечер' },
    { value: 'night', icon: 'Moon', label: 'Ночь' },
  ];

  const cycleTimeOfDay = () => {
    const currentIndex = timeOptions.findIndex(opt => opt.value === timeOfDay);
    const nextIndex = (currentIndex + 1) % timeOptions.length;
    onTimeOfDayChange(timeOptions[nextIndex].value);
  };

  const currentOption = timeOptions.find(opt => opt.value === timeOfDay);
  return (
    <div className="mb-6 animate-fade-in">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-full bg-gradient-primary flex items-center justify-center glow-box">
            <Icon name="Radio" size={20} className="text-white" />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-3xl font-heading font-bold glow-neon truncate">PULSE RADIO</h1>
            <p className="text-xs sm:text-sm text-muted-foreground truncate">Non-stop electronic beats</p>
            <div id="vw_stories" ref={storiesRef} />
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={cycleTimeOfDay}
            className="gap-1 sm:gap-2 hover:scale-105 transition-transform px-2 sm:px-3"
            title="Сменить цветовую схему"
          >
            <Icon name={currentOption?.icon || 'Moon'} size={16} />
            <span className="hidden sm:inline">{currentOption?.label}</span>
          </Button>
          <Badge variant="secondary" className="animate-pulse-glow whitespace-nowrap">
            <div className="w-2 h-2 bg-neon-orange rounded-full mr-1 sm:mr-2" />
            LIVE
          </Badge>
          <div className="flex items-center gap-1 text-sm">
            <Icon name="Users" size={16} />
            <span className="font-semibold">{currentTrack.listeners.toLocaleString()}</span>
          </div>
        </div>
      </header>
    </div>
  );
};

export default RadioHeader;
