import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

interface Track {
  id: number;
  title: string;
  artist: string;
  time: string;
  duration: string;
}

interface Schedule {
  id: number;
  time: string;
  dj: string;
  genre: string;
  isLive: boolean;
}

interface Podcast {
  id: number;
  title: string;
  episode: string;
  duration: string;
  plays: string;
}

interface Message {
  id: number;
  user: string;
  text: string;
  time: string;
}

const Index = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([75]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const RADIO_URL = 'https://myradio24.org/75725';

  useEffect(() => {
    audioRef.current = new Audio(RADIO_URL);
    audioRef.current.volume = volume[0] / 100;
    
    return () => {
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

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch((error) => {
          console.error('Ошибка воспроизведения:', error);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };
  const [currentTrack] = useState({
    title: 'Summer Vibes 2024',
    artist: 'DJ Neon',
    genre: 'Progressive House',
    listeners: 2847
  });

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
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary via-secondary to-accent opacity-20 blur-3xl animate-pulse" />
                
                <div className="absolute inset-0 rounded-full border-4 border-primary/30 animate-pulse-glow" />
                
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-card/90 to-background/90 backdrop-blur-xl flex items-center justify-center overflow-hidden">
                  <div className="relative w-full h-full flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center justify-center">
                      {[...Array(60)].map((_, i) => {
                        const angle = (i * 360) / 60;
                        const radius = 145;
                        const x = Math.cos((angle * Math.PI) / 180) * radius;
                        const y = Math.sin((angle * Math.PI) / 180) * radius;
                        const baseHeight = 3;
                        const wavePattern = Math.sin(i * 0.3) * 25 + Math.cos(i * 0.15) * 15;
                        const maxHeight = isPlaying ? 50 + wavePattern : baseHeight;
                        const animationSpeed = 0.4 + (i % 5) * 0.08;
                        
                        const hue1 = (262 + (i * 6)) % 360;
                        const hue2 = (291 + (i * 4)) % 360;
                        const hue3 = (320 + (i * 3)) % 360;
                        const hue4 = (19 + (i * 2)) % 360;
                        
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
                              className="w-2 rounded-full transition-all duration-100"
                              style={{
                                height: `${isPlaying ? maxHeight : baseHeight}px`,
                                background: `linear-gradient(180deg, 
                                  hsl(${hue1}deg 90% 65%) 0%, 
                                  hsl(${hue2}deg 85% 60%) 30%,
                                  hsl(${hue3}deg 88% 58%) 60%,
                                  hsl(${hue4}deg 92% 55%) 100%)`,
                                boxShadow: isPlaying 
                                  ? `0 0 15px hsl(${hue1}deg 90% 65% / 0.9),
                                     0 0 25px hsl(${hue2}deg 85% 60% / 0.6),
                                     0 0 35px hsl(${hue3}deg 88% 58% / 0.4)` 
                                  : 'none',
                                animation: isPlaying ? `wave-height ${animationSpeed}s ease-in-out infinite` : 'none',
                                animationDelay: `${i * 0.015}s`,
                                filter: isPlaying ? 'brightness(1.2) saturate(1.3)' : 'brightness(0.7)',
                              }}
                            />
                          </div>
                        );
                      })}
                    </div>
                    
                    <div className="relative z-10 text-center">
                      <div className={`text-6xl font-heading font-bold transition-all duration-500 ${
                        isPlaying ? 'glow-neon scale-110' : 'opacity-50 scale-100'
                      }`}>
                        {isPlaying ? '♪' : '♫'}
                      </div>
                      {isPlaying && (
                        <div className="mt-3 text-sm font-semibold text-primary animate-pulse">
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

        <Tabs defaultValue="history" className="animate-fade-in">
          <TabsList className="grid w-full grid-cols-4 bg-card/80 backdrop-blur-xl">
            <TabsTrigger value="history">История</TabsTrigger>
            <TabsTrigger value="schedule">Расписание</TabsTrigger>
            <TabsTrigger value="podcasts">Подкасты</TabsTrigger>
            <TabsTrigger value="chat">Чат</TabsTrigger>
          </TabsList>

          <TabsContent value="history" className="mt-6">
            <Card className="bg-card/80 backdrop-blur-xl border-primary/20">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-heading font-bold">История треков</h3>
                  <Button variant="outline" size="sm">
                    <Icon name="Search" size={16} className="mr-2" />
                    Поиск
                  </Button>
                </div>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-3">
                    {tracks.map((track, index) => (
                      <div
                        key={track.id}
                        className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted/80 transition-all hover:scale-[1.02] cursor-pointer"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center">
                            <Icon name="Music" size={20} />
                          </div>
                          <div>
                            <p className="font-semibold">{track.title}</p>
                            <p className="text-sm text-muted-foreground">{track.artist}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <span className="text-sm text-muted-foreground">{track.duration}</span>
                          <span className="text-sm text-primary font-semibold">{track.time}</span>
                          <Button size="sm" variant="ghost">
                            <Icon name="MoreVertical" size={16} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="schedule" className="mt-6">
            <Card className="bg-card/80 backdrop-blur-xl border-primary/20">
              <div className="p-6">
                <h3 className="text-2xl font-heading font-bold mb-6">Расписание эфиров</h3>
                <div className="space-y-4">
                  {schedule.map((slot, index) => (
                    <div
                      key={slot.id}
                      className={`p-6 rounded-lg border-2 transition-all hover:scale-[1.02] ${
                        slot.isLive 
                          ? 'border-primary bg-primary/10 glow-box' 
                          : 'border-border bg-muted/30'
                      }`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                            slot.isLive ? 'gradient-primary animate-pulse-glow' : 'bg-muted'
                          }`}>
                            <Icon name="Disc3" size={28} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="text-xl font-heading font-bold">{slot.dj}</h4>
                              {slot.isLive && (
                                <Badge className="gradient-primary">ON AIR</Badge>
                              )}
                            </div>
                            <p className="text-muted-foreground">{slot.genre}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold">{slot.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="podcasts" className="mt-6">
            <Card className="bg-card/80 backdrop-blur-xl border-primary/20">
              <div className="p-6">
                <h3 className="text-2xl font-heading font-bold mb-6">Популярные подкасты</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  {podcasts.map((podcast, index) => (
                    <div
                      key={podcast.id}
                      className="group p-6 rounded-xl bg-gradient-to-br from-muted/50 to-muted/20 border border-border hover:border-primary transition-all hover:scale-105 cursor-pointer"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="w-full aspect-square rounded-lg bg-gradient-accent mb-4 flex items-center justify-center group-hover:glow-box transition-all">
                        <Icon name="Podcast" size={48} />
                      </div>
                      <h4 className="font-heading font-bold text-lg mb-2">{podcast.title}</h4>
                      <p className="text-sm text-muted-foreground mb-4">{podcast.episode}</p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-1">
                          <Icon name="Clock" size={14} />
                          {podcast.duration}
                        </span>
                        <span className="flex items-center gap-1 text-primary">
                          <Icon name="Play" size={14} />
                          {podcast.plays}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="chat" className="mt-6">
            <Card className="bg-card/80 backdrop-blur-xl border-primary/20">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-heading font-bold">Чат слушателей</h3>
                  <Badge variant="outline">
                    <Icon name="Users" size={14} className="mr-1" />
                    1,247 онлайн
                  </Badge>
                </div>
                <ScrollArea className="h-[350px] mb-4">
                  <div className="space-y-3">
                    {messages.map((msg, index) => (
                      <div
                        key={msg.id}
                        className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-all animate-slide-in"
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-bold">{msg.user[0]}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-sm">{msg.user}</span>
                            <span className="text-xs text-muted-foreground">{msg.time}</span>
                          </div>
                          <p className="text-sm">{msg.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Напишите сообщение..."
                    className="flex-1 px-4 py-3 rounded-lg bg-muted/50 border border-border focus:border-primary focus:outline-none transition-colors"
                  />
                  <Button className="gradient-primary glow-box">
                    <Icon name="Send" size={20} />
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

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