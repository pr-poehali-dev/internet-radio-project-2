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

  useEffect(() => {
    const widsterSource = document.getElementById('widster-widget');
    const widsterTarget = document.getElementById('widster-container');
    if (widsterSource && widsterTarget) {
      while (widsterSource.childNodes.length > 0) {
        widsterTarget.appendChild(widsterSource.childNodes[0]);
      }
    }
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
    <div className="mb-8 animate-fade-in">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center glow-box">
            <Icon name="Radio" size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-heading font-bold glow-neon">PULSE RADIO</h1>
            <p className="text-sm text-muted-foreground">Non-stop electronic beats</p>
            <div id="vw_stories" ref={storiesRef} />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={cycleTimeOfDay}
            className="gap-2 hover:scale-105 transition-transform"
            title="Сменить цветовую схему"
          >
            <Icon name={currentOption?.icon || 'Moon'} size={16} />
            <span className="hidden sm:inline">{currentOption?.label}</span>
          </Button>
          <Badge variant="secondary" className="animate-pulse-glow">
            <div className="w-2 h-2 bg-neon-orange rounded-full mr-2" />
            LIVE
          </Badge>
          <div className="flex items-center gap-2 text-sm">
            <Icon name="Users" size={16} />
            <span className="font-semibold">{currentTrack.listeners.toLocaleString()}</span>
          </div>
        </div>
      </header>
      <div id="widster-container" className="mt-4" />
    </div>
  );
};

export default RadioHeader;