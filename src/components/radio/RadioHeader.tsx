import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { CurrentTrack } from './types';
import { useAuth } from '@/contexts/AuthContext';

const AVATAR_COLORS = [
  'from-purple-500 to-pink-500',
  'from-blue-500 to-cyan-500',
  'from-orange-500 to-red-500',
  'from-green-500 to-emerald-500',
  'from-yellow-500 to-orange-500',
];

interface RadioHeaderProps {
  currentTrack: CurrentTrack;
  timeOfDay: 'morning' | 'day' | 'evening' | 'night';
  onTimeOfDayChange: (time: 'morning' | 'day' | 'evening' | 'night') => void;
}

const MESSAGES_URL = 'https://functions.poehali.dev/adbf63c4-1c95-41c1-a894-a820ce702cea';

const RadioHeader = ({ currentTrack, timeOfDay, onTimeOfDayChange }: RadioHeaderProps) => {
  const storiesRef = useRef<HTMLDivElement>(null);
  const { user, token } = useAuth();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (!token) return;
    const fetchUnread = () => {
      fetch(`${MESSAGES_URL}?action=dialogs`, { headers: { 'X-Auth-Token': token } })
        .then(r => r.json())
        .then(d => {
          const total = (d.dialogs || []).reduce((sum: number, dlg: { unread_count: number }) => sum + dlg.unread_count, 0);
          setUnread(total);
        })
        .catch(() => {});
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 15000);
    return () => clearInterval(interval);
  }, [token]);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://app.vidwidget.ru/n/7c352719-e579-453f-9dfb-e5dac97bffee/';
    script.async = true;
    storiesRef.current?.appendChild(script);
    return () => { script.remove(); };
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
            <h1 className="text-xl sm:text-3xl font-heading font-bold glow-neon truncate">EFIR PLUS</h1>
            <p className="text-xs sm:text-sm text-muted-foreground truncate">Non-stop electronic beats</p>
            <div id="vw_stories" ref={storiesRef} />
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
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
            <Icon name="Headphones" size={16} />
            <span className="font-semibold">{currentTrack.listeners.toLocaleString()}</span>
          </div>

          <Link to="/users" title="Слушатели">
            <button className="relative w-9 h-9 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
              <Icon name="Users" size={16} className="text-muted-foreground" />
              {unread > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center leading-none">
                  {unread > 99 ? '99+' : unread}
                </span>
              )}
            </button>
          </Link>

          {user ? (
            <Link to="/profile">
              <div
                className={`w-9 h-9 rounded-full bg-gradient-to-br ${AVATAR_COLORS[user.id % AVATAR_COLORS.length]} flex items-center justify-center text-sm font-bold text-white border-2 border-primary/40 hover:border-primary transition-all cursor-pointer glow-box hover:scale-105`}
                title={user.display_name || user.username}
              >
                {user.avatar_url
                  ? <img src={user.avatar_url} alt="avatar" className="w-full h-full rounded-full object-cover" />
                  : (user.display_name || user.username).slice(0, 2).toUpperCase()}
              </div>
            </Link>
          ) : (
            <Link to="/login">
              <Button size="sm" className="gradient-primary gap-1 sm:gap-2 px-2 sm:px-4">
                <Icon name="LogIn" size={15} />
                <span className="hidden sm:inline">Войти</span>
              </Button>
            </Link>
          )}
        </div>
      </header>
    </div>
  );
};

export default RadioHeader;