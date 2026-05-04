import { useEffect, useRef, useCallback } from 'react';
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

const TIME_WAVE_COLORS = {
  morning: [['#ff9a3c', '#ffcc70'], ['#ff6b6b', '#ffd93d'], ['#ffaa44', '#ff8c00']],
  day:     [['#00d2ff', '#3a7bd5'], ['#00c9ff', '#92fe9d'], ['#0088cc', '#00cc88']],
  evening: [['#ff6b35', '#f7c59f'], ['#ff4757', '#ff6348'], ['#cc3300', '#ff7755']],
  night:   [['#a855f7', '#6366f1'], ['#ec4899', '#8b5cf6'], ['#7c3aed', '#db2777']],
};

const WaveBanner = ({
  isPlaying,
  audioData,
  analyserRef,
  timeOfDay,
  currentTrack,
  togglePlay,
}: {
  isPlaying: boolean;
  audioData: number[];
  analyserRef: React.MutableRefObject<AnalyserNode | null>;
  timeOfDay: keyof typeof TIME_WAVE_COLORS;
  currentTrack: CurrentTrack;
  togglePlay: () => void;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const phaseRef = useRef(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const colors = TIME_WAVE_COLORS[timeOfDay];

    ctx.clearRect(0, 0, W, H);

    let rms = 0;
    if (analyserRef.current && isPlaying) {
      const buf = new Uint8Array(analyserRef.current.frequencyBinCount);
      analyserRef.current.getByteFrequencyData(buf);
      rms = buf.reduce((a, b) => a + b, 0) / buf.length / 255;
    } else if (isPlaying && audioData.length) {
      rms = audioData.reduce((a, b) => a + b, 0) / audioData.length;
    }

    const phase = phaseRef.current;
    const amp = isPlaying ? H * (0.18 + rms * 0.18) : H * 0.12;

    const waveDefs = [
      { yBase: H * 0.35, amp: amp * 1.1, freq: 1.4, phaseShift: 0,      alpha: 0.85, colors: colors[0] },
      { yBase: H * 0.55, amp: amp * 0.9, freq: 1.8, phaseShift: 1.2,    alpha: 0.75, colors: colors[1] },
      { yBase: H * 0.72, amp: amp * 1.3, freq: 1.1, phaseShift: 2.5,    alpha: 0.65, colors: colors[2] },
    ];

    waveDefs.forEach(({ yBase, amp: wAmp, freq, phaseShift, alpha, colors: wColors }) => {
      const grad = ctx.createLinearGradient(0, 0, W, 0);
      grad.addColorStop(0, wColors[0] + 'cc');
      grad.addColorStop(0.5, wColors[1] + 'dd');
      grad.addColorStop(1, wColors[0] + 'cc');

      ctx.beginPath();
      ctx.moveTo(0, H);

      for (let x = 0; x <= W; x += 4) {
        const t = x / W;
        const y = yBase
          + Math.sin(t * Math.PI * 2 * freq + phase + phaseShift) * wAmp
          + Math.sin(t * Math.PI * 3.3 * freq - phase * 0.7 + phaseShift) * wAmp * 0.4
          + Math.cos(t * Math.PI * 1.6 * freq + phase * 0.5) * wAmp * 0.25;
        ctx.lineTo(x, y);
      }

      ctx.lineTo(W, H);
      ctx.closePath();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.globalAlpha = 1;
    });

    phaseRef.current += isPlaying ? 0.022 + rms * 0.03 : 0.007;
    rafRef.current = requestAnimationFrame(draw);
  }, [isPlaying, audioData, analyserRef, timeOfDay]);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [draw]);

  return (
    <div className="relative w-full overflow-hidden rounded-2xl" style={{ height: 220 }}>
      <canvas
        ref={canvasRef}
        width={900}
        height={220}
        className="absolute inset-0 w-full h-full"
        style={{ display: 'block' }}
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 pointer-events-none">
        <button
          onClick={togglePlay}
          className="pointer-events-auto w-14 h-14 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
          style={{ backdropFilter: 'blur(4px)' }}
        >
          <Icon name={isPlaying ? 'Pause' : 'Play'} size={26} className="text-gray-800 ml-0.5" />
        </button>
        {isPlaying && (
          <div className="text-center mt-1 drop-shadow-lg">
            <p className="text-white font-semibold text-sm leading-tight">{currentTrack.title || currentTrack.genre}</p>
            <p className="text-white/80 text-xs">{currentTrack.artist}</p>
          </div>
        )}
      </div>
    </div>
  );
};

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
    <Card className="bg-card/80 backdrop-blur-xl border-primary/20 p-4 sm:p-8 animate-fade-in glow-box">
      <div className="space-y-6">
        <WaveBanner
          isPlaying={isPlaying}
          audioData={audioData}
          analyserRef={analyserRef}
          timeOfDay={timeOfDay}
          currentTrack={currentTrack}
          togglePlay={togglePlay}
        />

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Badge className="gradient-primary">{currentTrack.genre}</Badge>
            <p className="text-sm text-muted-foreground">{currentTrack.artist}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" className="rounded-full">
              <Icon name="Heart" size={18} />
            </Button>
            <Button size="sm" variant="outline" className="rounded-full">
              <Icon name="Share2" size={18} />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Icon name="Volume2" size={20} className="text-primary shrink-0" />
          <Slider 
            value={volume} 
            onValueChange={setVolume}
            max={100}
            step={1}
            className="flex-1"
          />
          <span className="text-sm font-semibold w-10 text-right shrink-0">{volume[0]}%</span>
        </div>
      </div>
    </Card>
  );
};

export default RadioPlayer;
