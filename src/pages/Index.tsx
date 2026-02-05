import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import RadioHeader from '@/components/radio/RadioHeader';
import RadioPlayer from '@/components/radio/RadioPlayer';
import RadioTabs from '@/components/radio/RadioTabs';
import { Track, Schedule, Podcast, Message } from '@/components/radio/types';

const Index = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([75]);
  const [audioData, setAudioData] = useState<number[]>(new Array(60).fill(0));
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'day' | 'evening' | 'night'>('night');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const RADIO_URL = 'https://myradio24.org/75725';

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setTimeOfDay('morning');
    else if (hour >= 12 && hour < 17) setTimeOfDay('day');
    else if (hour >= 17 && hour < 21) setTimeOfDay('evening');
    else setTimeOfDay('night');
  }, []);

  useEffect(() => {
    audioRef.current = new Audio(RADIO_URL);
    audioRef.current.volume = volume[0] / 100;
    audioRef.current.crossOrigin = 'anonymous';
    
    try {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      analyserRef.current.smoothingTimeConstant = 0.8;
      
      const source = audioContextRef.current.createMediaElementSource(audioRef.current);
      source.connect(analyserRef.current);
      analyserRef.current.connect(audioContextRef.current.destination);
    } catch (error) {
      console.log('Web Audio API недоступен, используется базовая визуализация');
    }
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume[0] / 100;
    }
  }, [volume]);

  const analyzeAudio = () => {
    if (!analyserRef.current || !isPlaying) return;
    
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);
    
    const bars = 60;
    const step = Math.floor(dataArray.length / bars);
    const newAudioData = [];
    
    for (let i = 0; i < bars; i++) {
      const start = i * step;
      const end = start + step;
      const slice = dataArray.slice(start, end);
      const average = slice.reduce((a, b) => a + b, 0) / slice.length;
      newAudioData.push(average / 255);
    }
    
    setAudioData(newAudioData);
    animationFrameRef.current = requestAnimationFrame(analyzeAudio);
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      } else {
        if (audioContextRef.current?.state === 'suspended') {
          audioContextRef.current.resume();
        }
        audioRef.current.play().catch((error) => {
          console.error('Ошибка воспроизведения:', error);
        });
        analyzeAudio();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const currentTrack = {
    title: 'Summer Vibes 2024',
    artist: 'DJ Neon',
    genre: 'Progressive House',
    listeners: 2847
  };

  const tracks: Track[] = [
    { id: 1, title: 'Midnight Energy', artist: 'DJ Pulse', time: '23:45', duration: '5:32' },
    { id: 2, title: 'Electric Dreams', artist: 'Sound Wave', time: '23:39', duration: '4:18' },
    { id: 3, title: 'Neon Nights', artist: 'Beat Master', time: '23:35', duration: '6:05' },
    { id: 4, title: 'Club Anthem', artist: 'DJ Storm', time: '23:29', duration: '5:47' },
    { id: 5, title: 'Bass Drop', artist: 'Frequency', time: '23:23', duration: '4:55' },
  ];

  const schedule: Schedule[] = [
    { id: 1, time: '22:00 - 00:00', dj: 'DJ Neon', genre: 'Progressive House', isLive: true },
    { id: 2, time: '00:00 - 02:00', dj: 'Sound Wave', genre: 'Techno', isLive: false },
    { id: 3, time: '02:00 - 04:00', dj: 'Beat Master', genre: 'Deep House', isLive: false },
    { id: 4, time: '04:00 - 06:00', dj: 'DJ Storm', genre: 'Trance', isLive: false },
  ];

  const podcasts: Podcast[] = [
    { id: 1, title: 'Best of 2024', episode: 'Episode 42', duration: '58:30', plays: '12.5K' },
    { id: 2, title: 'Night Sessions', episode: 'Episode 41', duration: '1:15:20', plays: '8.9K' },
    { id: 3, title: 'Club Mix', episode: 'Episode 40', duration: '45:12', plays: '15.2K' },
  ];

  const messages: Message[] = [
    { id: 1, user: 'Alex', text: 'Огонь трек! 🔥', time: '23:46' },
    { id: 2, user: 'Maria', text: 'DJ Neon лучший!', time: '23:45' },
    { id: 3, user: 'Ivan', text: 'Где можно скачать этот микс?', time: '23:44' },
    { id: 4, user: 'Olga', text: 'Передайте привет DJ Neon', time: '23:43' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <div className="container mx-auto px-4 py-6 space-y-6">
        <RadioHeader 
          currentTrack={currentTrack} 
          timeOfDay={timeOfDay}
          onTimeOfDayChange={setTimeOfDay}
        />
        
        <RadioPlayer 
          currentTrack={currentTrack}
          isPlaying={isPlaying}
          volume={volume}
          audioData={audioData}
          timeOfDay={timeOfDay}
          togglePlay={togglePlay}
          setVolume={setVolume}
          analyserRef={analyserRef}
        />

        <RadioTabs 
          tracks={tracks}
          schedule={schedule}
          podcasts={podcasts}
          messages={messages}
        />

        <footer className="text-center py-8 text-sm text-muted-foreground">
          <div className="flex items-center justify-center gap-6 mb-4">
            <Button variant="ghost" size="sm">О нас</Button>
            <Button variant="ghost" size="sm">Контакты</Button>
            <Button variant="ghost" size="sm">Реклама</Button>
            <Button variant="ghost" size="sm">API</Button>
          </div>
          <p>© 2024 Pulse Radio. Все права защищены.</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;