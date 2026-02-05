import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { Track, Schedule, Podcast, Message } from './types';

interface RadioTabsProps {
  tracks: Track[];
  schedule: Schedule[];
  podcasts: Podcast[];
  messages: Message[];
}

const RadioTabs = ({ tracks, schedule, podcasts, messages }: RadioTabsProps) => {
  return (
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
  );
};

export default RadioTabs;
