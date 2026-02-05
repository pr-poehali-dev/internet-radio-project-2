import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { CurrentTrack } from './types';

interface RadioHeaderProps {
  currentTrack: CurrentTrack;
}

const RadioHeader = ({ currentTrack }: RadioHeaderProps) => {
  return (
    <header className="flex items-center justify-between mb-8 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center glow-box">
          <Icon name="Radio" size={24} className="text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-heading font-bold glow-neon">PULSE RADIO</h1>
          <p className="text-sm text-muted-foreground">Non-stop electronic beats</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
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
  );
};

export default RadioHeader;
