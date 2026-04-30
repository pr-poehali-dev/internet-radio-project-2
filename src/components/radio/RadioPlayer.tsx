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

const TIME_COLORS = {
  morning: ['#ff9a3c', '#ffcc70', '#ff6b6b', '#ffd93d'],
  day:     ['#00d2ff', '#3a7bd5', '#00c9ff', '#92fe9d'],
  evening: ['#ff6b35', '#f7c59f', '#ff4757', '#ff6348'],
  night:   ['#a855f7', '#6366f1', '#ec4899', '#8b5cf6'],
};

const WaveCircle = ({
  isPlaying,
  audioData,
  analyserRef,
  timeOfDay,
}: {
  isPlaying: boolean;
  audioData: number[];
  analyserRef: React.MutableRefObject<AnalyserNode | null>;
  timeOfDay: keyof typeof TIME_COLORS;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const phaseRef = useRef(0);
  const rippleRef = useRef<{ r: number; alpha: number }[]>([]);
  const lastRmsRef = useRef(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const cx = W / 2;
    const cy = H / 2;
    const maxR = Math.min(cx, cy) - 4;
    const colors = TIME_COLORS[timeOfDay];

    ctx.clearRect(0, 0, W, H);

    let rms = 0;
    if (analyserRef.current && isPlaying) {
      const buf = new Uint8Array(analyserRef.current.frequencyBinCount);
      analyserRef.current.getByteFrequencyData(buf);
      const sum = buf.reduce((a, b) => a + b, 0);
      rms = sum / buf.length / 255;
    } else if (isPlaying && audioData.length) {
      rms = audioData.reduce((a, b) => a + b, 0) / audioData.length;
    }

    if (isPlaying && rms - lastRmsRef.current > 0.18) {
      rippleRef.current.push({ r: maxR * 0.55, alpha: 0.7 });
    }
    lastRmsRef.current = rms;

    rippleRef.current = rippleRef.current
      .map(rp => ({ r: rp.r + 1.8, alpha: rp.alpha - 0.012 }))
      .filter(rp => rp.alpha > 0);

    rippleRef.current.forEach(rp => {
      ctx.beginPath();
      ctx.arc(cx, cy, rp.r, 0, Math.PI * 2);
      ctx.strokeStyle = `${colors[0]}${Math.round(rp.alpha * 255).toString(16).padStart(2, '0')}`;
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    const BARS = 120;
    const baseR = maxR * 0.52;
    const phase = phaseRef.current;

    for (let i = 0; i < BARS; i++) {
      const angle = (i / BARS) * Math.PI * 2 - Math.PI / 2;
      const dataIdx = Math.floor((i / BARS) * audioData.length);
      const audioLevel = isPlaying ? (audioData[dataIdx] || 0) : 0;

      const wave1 = Math.sin(angle * 3 + phase) * 0.15;
      const wave2 = Math.cos(angle * 5 - phase * 1.3) * 0.08;
      const wave3 = Math.sin(angle * 2 + phase * 0.7) * 0.06;

      const barLen = isPlaying
        ? (maxR - baseR) * (0.15 + audioLevel * 0.72 + wave1 + wave2 + wave3)
        : (maxR - baseR) * (0.05 + wave1 * 0.3 + 0.04);

      const x1 = cx + Math.cos(angle) * baseR;
      const y1 = cy + Math.sin(angle) * baseR;
      const x2 = cx + Math.cos(angle) * (baseR + barLen);
      const y2 = cy + Math.sin(angle) * (baseR + barLen);

      const colorIdx = Math.floor((i / BARS) * colors.length);
      const colorNext = colors[(colorIdx + 1) % colors.length];
      const grad = ctx.createLinearGradient(x1, y1, x2, y2);
      grad.addColorStop(0, colors[colorIdx] + 'aa');
      grad.addColorStop(1, colorNext + 'ff');

      const glow = isPlaying ? 0.6 + audioLevel * 0.4 : 0.25;
      ctx.save();
      ctx.shadowColor = colors[colorIdx];
      ctx.shadowBlur = isPlaying ? 8 + audioLevel * 18 : 3;
      ctx.globalAlpha = glow;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = grad;
      ctx.lineWidth = isPlaying ? 1.5 + audioLevel * 1.5 : 1;
      ctx.lineCap = 'round';
      ctx.stroke();
      ctx.restore();
    }

    const innerGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, baseR);
    innerGrad.addColorStop(0, colors[0] + (isPlaying ? '22' : '0a'));
    innerGrad.addColorStop(0.6, colors[2] + (isPlaying ? '18' : '08'));
    innerGrad.addColorStop(1, 'transparent');
    ctx.beginPath();
    ctx.arc(cx, cy, baseR, 0, Math.PI * 2);
    ctx.fillStyle = innerGrad;
    ctx.fill();

    if (isPlaying) {
      const pulseR = baseR * (0.85 + rms * 0.15);
      ctx.beginPath();
      ctx.arc(cx, cy, pulseR, 0, Math.PI * 2);
      ctx.strokeStyle = colors[1] + '55';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    phaseRef.current += isPlaying ? 0.025 : 0.006;
    rafRef.current = requestAnimationFrame(draw);
  }, [isPlaying, audioData, analyserRef, timeOfDay]);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      width={280}
      height={280}
      className="w-full h-full rounded-full"
      style={{ display: 'block' }}
    />
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
      <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
        <div className="space-y-4 sm:space-y-6">
          <div className="space-y-2">
            <Badge className="gradient-primary">{currentTrack.genre}</Badge>
            <h2 className="text-2xl sm:text-4xl font-heading font-bold break-words">{currentTrack.title}</h2>
            <p className="text-base sm:text-xl text-muted-foreground">{currentTrack.artist}</p>
          </div>

          <div className="flex items-center gap-3 pt-2 sm:pt-4">
            <Button 
              size="lg" 
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full gradient-primary glow-box hover:scale-110 transition-transform shrink-0"
              onClick={togglePlay}
            >
              <Icon name={isPlaying ? "Pause" : "Play"} size={24} />
            </Button>
            <Button size="lg" variant="outline" className="rounded-full">
              <Icon name="Heart" size={20} />
            </Button>
            <Button size="lg" variant="outline" className="rounded-full">
              <Icon name="Share2" size={20} />
            </Button>
          </div>

          <div className="space-y-3">
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
        </div>

        <div className="flex items-center justify-center">
          <div className="relative w-64 h-64 sm:w-72 sm:h-72">
            <div className="absolute inset-0 rounded-full bg-card/60 backdrop-blur-xl border border-primary/20" />
            <div className="absolute inset-0 rounded-full overflow-hidden">
              <WaveCircle
                isPlaying={isPlaying}
                audioData={audioData}
                analyserRef={analyserRef}
                timeOfDay={timeOfDay}
              />
            </div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <div
                  className={`text-5xl sm:text-6xl font-heading font-bold transition-all duration-500 select-none ${
                    isPlaying ? 'glow-neon scale-110' : 'opacity-40 scale-100'
                  }`}
                  style={{ animation: isPlaying ? 'float-rotate 8s ease-in-out infinite' : 'none' }}
                >
                  {isPlaying ? '♪' : '♫'}
                </div>
                {isPlaying && (
                  <div
                    className="mt-2 text-xs font-semibold text-primary tracking-widest"
                    style={{ animation: 'pulse-glow 2s ease-in-out infinite' }}
                  >
                    ON AIR
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default RadioPlayer;
