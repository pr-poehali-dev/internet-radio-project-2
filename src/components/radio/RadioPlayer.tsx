import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { CurrentTrack } from './types';

interface RadioPlayerProps {
  currentTrack: CurrentTrack;
  isPlaying: boolean;
  volume: number[];
  audioData: number[];
  timeOfDay: 'morning' | 'day' | 'evening' | 'night';
  togglePlay: () => void;
  setVolume: (value: number[]) => void;
  analyserRef: React.MutableRefObject<AnalyserNode | null>;
}

const RadioPlayer = ({ 
  currentTrack, 
  isPlaying, 
  volume, 
  audioData, 
  timeOfDay,
  togglePlay, 
  setVolume,
  analyserRef
}: RadioPlayerProps) => {
  return (
    <Card className="bg-card/80 backdrop-blur-xl border-primary/20 p-8 animate-fade-in glow-box">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <Badge className="gradient-primary">{currentTrack.genre}</Badge>
            <h2 className="text-4xl font-heading font-bold">{currentTrack.title}</h2>
            <p className="text-xl text-muted-foreground">{currentTrack.artist}</p>
          </div>

          <div className="flex items-center gap-3 pt-4">
            <Button 
              size="lg" 
              className="w-16 h-16 rounded-full gradient-primary glow-box hover:scale-110 transition-transform"
              onClick={togglePlay}
            >
              <Icon name={isPlaying ? "Pause" : "Play"} size={28} />
            </Button>
            <Button size="lg" variant="outline" className="rounded-full">
              <Icon name="Heart" size={20} />
            </Button>
            <Button size="lg" variant="outline" className="rounded-full">
              <Icon name="Share2" size={20} />
            </Button>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <Icon name="Volume2" size={20} className="text-primary" />
              <Slider 
                value={volume} 
                onValueChange={setVolume}
                max={100}
                step={1}
                className="flex-1"
              />
              <span className="text-sm font-semibold w-12 text-right">{volume[0]}%</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <div className="relative w-80 h-80">
            <div 
              className="absolute inset-0 rounded-full bg-gradient-to-r from-primary via-secondary to-accent opacity-20 blur-3xl"
              style={{
                animation: isPlaying ? 'ripple 4s ease-in-out infinite, color-shift 8s ease-in-out infinite' : 'none'
              }}
            />
            
            <div 
              className="absolute inset-4 rounded-full bg-gradient-to-r from-primary/20 via-accent/20 to-secondary/20 blur-2xl"
              style={{
                animation: isPlaying ? 'ripple 3s ease-in-out infinite reverse' : 'none',
                animationDelay: '0.5s'
              }}
            />
            
            <div 
              className="absolute inset-0 rounded-full border-4 border-primary/30"
              style={{
                animation: isPlaying ? 'float-rotate 20s linear infinite, pulse-glow 3s ease-in-out infinite' : 'pulse-glow 3s ease-in-out infinite'
              }}
            />
            
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-card/90 to-background/90 backdrop-blur-xl flex items-center justify-center overflow-hidden">
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="absolute inset-0 flex items-center justify-center">
                  {[...Array(60)].map((_, i) => {
                    const angle = (i * 360) / 60;
                    const radius = 145;
                    const x = Math.cos((angle * Math.PI) / 180) * radius;
                    const y = Math.sin((angle * Math.PI) / 180) * radius;
                    const baseHeight = 3;
                    
                    const audioLevel = audioData[i] || 0;
                    const wavePattern = Math.sin(i * 0.3) * 25 + Math.cos(i * 0.15) * 15;
                    const audioBoost = audioLevel * 60;
                    const maxHeight = isPlaying ? 50 + wavePattern + audioBoost : baseHeight;
                    const animationSpeed = 0.4 + (i % 5) * 0.08;
                    
                    const timeColors = {
                      morning: { base: 45, spread: 30 },
                      day: { base: 180, spread: 40 },
                      evening: { base: 15, spread: 25 },
                      night: { base: 262, spread: 60 }
                    };
                    
                    const colorScheme = timeColors[timeOfDay];
                    const hue1 = (colorScheme.base + (i * 6)) % 360;
                    const hue2 = (colorScheme.base + colorScheme.spread + (i * 4)) % 360;
                    const hue3 = (colorScheme.base + colorScheme.spread * 2 + (i * 3)) % 360;
                    const hue4 = (colorScheme.base + colorScheme.spread * 3 + (i * 2)) % 360;
                    
                    return (
                      <div
                        key={i}
                        className="absolute origin-bottom"
                        style={{
                          left: '50%',
                          top: '50%',
                          transform: `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${angle + 90}deg)`,
                        }}
                      >
                        <div
                          className="w-2 rounded-full transition-all"
                          style={{
                            height: `${isPlaying ? maxHeight : baseHeight}px`,
                            background: `linear-gradient(180deg, 
                              hsl(${hue1}deg 90% 65%) 0%, 
                              hsl(${hue2}deg 85% 60%) 30%,
                              hsl(${hue3}deg 88% 58%) 60%,
                              hsl(${hue4}deg 92% 55%) 100%)`,
                            boxShadow: isPlaying 
                              ? `0 0 ${15 + audioLevel * 20}px hsl(${hue1}deg 90% 65% / ${0.9 + audioLevel * 0.1}),
                                 0 0 ${25 + audioLevel * 30}px hsl(${hue2}deg 85% 60% / 0.6),
                                 0 0 ${35 + audioLevel * 40}px hsl(${hue3}deg 88% 58% / 0.4)` 
                              : 'none',
                            animation: !analyserRef.current && isPlaying ? `wave-height ${animationSpeed}s ease-in-out infinite` : 'none',
                            animationDelay: `${i * 0.015}s`,
                            filter: isPlaying ? `brightness(${1.2 + audioLevel * 0.3}) saturate(${1.3 + audioLevel * 0.5}) blur(0.3px)` : 'brightness(0.7)',
                            transitionDuration: analyserRef.current ? '150ms' : '300ms',
                            transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
                
                <div className="relative z-10 text-center">
                  <div 
                    className={`text-6xl font-heading font-bold transition-all duration-500 ${
                      isPlaying ? 'glow-neon scale-110' : 'opacity-50 scale-100'
                    }`}
                    style={{
                      animation: isPlaying ? 'float-rotate 8s ease-in-out infinite' : 'none'
                    }}
                  >
                    {isPlaying ? '♪' : '♫'}
                  </div>
                  {isPlaying && (
                    <div 
                      className="mt-3 text-sm font-semibold text-primary"
                      style={{
                        animation: 'pulse-glow 2s ease-in-out infinite'
                      }}
                    >
                      ON AIR
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default RadioPlayer;