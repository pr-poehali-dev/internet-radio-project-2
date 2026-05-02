import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { useAuth } from '@/contexts/AuthContext';

const USERS_URL = 'https://functions.poehali.dev/79ddd4af-923d-475e-b4c4-fd83609807ea';

const AVATAR_GRADIENTS = [
  ['#a855f7', '#ec4899'],
  ['#3b82f6', '#06b6d4'],
  ['#f97316', '#ef4444'],
  ['#22c55e', '#10b981'],
  ['#eab308', '#f97316'],
];

interface UserInfo {
  id: number;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  favorite_genre: string | null;
  created_at: string;
}

const UserProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    fetch(`${USERS_URL}?action=get&id=${userId}`)
      .then(r => r.json())
      .then(d => { if (d.id) setProfile(d); })
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[hsl(var(--background))] flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[hsl(var(--background))] flex flex-col items-center justify-center gap-4 text-muted-foreground">
        <Icon name="UserX" size={40} />
        <p>Пользователь не найден</p>
        <Link to="/users" className="text-sm text-primary underline">Вернуться к списку</Link>
      </div>
    );
  }

  const isMe = user?.id === profile.id;
  const [c1, c2] = AVATAR_GRADIENTS[profile.id % AVATAR_GRADIENTS.length];
  const initials = (profile.display_name || profile.username).slice(0, 2).toUpperCase();
  const memberSince = profile.created_at
    ? new Date(profile.created_at).toLocaleDateString('ru-RU', { year: 'numeric', month: 'long' })
    : '';

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] relative overflow-hidden">
      {/* ambient blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ background: `radial-gradient(circle, ${c1}, transparent)` }} />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full opacity-15 blur-3xl"
          style={{ background: `radial-gradient(circle, ${c2}, transparent)` }} />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-xl">

        {/* topbar */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/users" className="group flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <div className="w-8 h-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
              <Icon name="ArrowLeft" size={15} />
            </div>
            <span className="text-sm font-medium">Слушатели</span>
          </Link>
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}>
              <Icon name="Radio" size={13} className="text-white" />
            </div>
            <span className="font-heading font-bold text-sm tracking-widest hidden sm:block" style={{ color: c1 }}>PULSE RADIO</span>
          </Link>
        </div>

        {/* hero card */}
        <div className="rounded-3xl overflow-hidden mb-4" style={{ background: 'hsl(var(--card))' }}>
          {/* banner */}
          <div className="h-32 relative overflow-hidden">
            <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${c1}60, ${c2}40, transparent)` }} />
            <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: `radial-gradient(circle at 20% 50%, ${c1} 0%, transparent 50%), radial-gradient(circle at 80% 20%, ${c2} 0%, transparent 40%)`
            }} />
            <svg className="absolute bottom-0 left-0 right-0 w-full opacity-30" height="40" viewBox="0 0 400 40" preserveAspectRatio="none">
              <path d="M0,20 Q20,5 40,20 T80,20 T120,20 T160,20 T200,20 T240,20 T280,20 T320,20 T360,20 T400,20" fill="none" stroke="white" strokeWidth="1.5"/>
              <path d="M0,25 Q25,8 50,25 T100,25 T150,25 T200,25 T250,25 T300,25 T350,25 T400,25" fill="none" stroke="white" strokeWidth="1"/>
            </svg>
          </div>

          {/* avatar + actions */}
          <div className="px-6 pb-6">
            <div className="flex items-end justify-between -mt-10 mb-5">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-xl font-bold text-white shadow-2xl border-2 border-white/10 overflow-hidden"
                  style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}>
                  {profile.avatar_url
                    ? <img src={profile.avatar_url} alt="avatar" className="w-full h-full object-cover" />
                    : initials}
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-500 border-2 border-[hsl(var(--card))]" />
              </div>

              {/* action buttons */}
              <div className="flex gap-2 pb-1">
                {isMe ? (
                  <Link to="/profile">
                    <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border border-white/10 bg-white/5 hover:bg-white/10 transition-all text-muted-foreground hover:text-foreground">
                      <Icon name="Pencil" size={13} />
                      Редактировать
                    </button>
                  </Link>
                ) : user ? (
                  <Link to={`/messages/${profile.id}`}>
                    <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                      style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}>
                      <Icon name="MessageCircle" size={13} />
                      Написать
                    </button>
                  </Link>
                ) : (
                  <Link to="/login">
                    <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border border-white/10 bg-white/5 hover:bg-white/10 transition-all text-muted-foreground">
                      <Icon name="LogIn" size={13} />
                      Войти
                    </button>
                  </Link>
                )}
              </div>
            </div>

            {/* name */}
            <div className="space-y-1 mb-4">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold tracking-tight">{profile.display_name || profile.username}</h1>
                {isMe && (
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium text-white"
                    style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}>Вы</span>
                )}
              </div>
              <p className="text-sm font-medium" style={{ color: c1 }}>@{profile.username}</p>
            </div>

            {profile.bio && (
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">{profile.bio}</p>
            )}

            {/* meta pills */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              {memberSince && (
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                  <Icon name="CalendarDays" size={11} />
                  С {memberSince}
                </span>
              )}
              {profile.favorite_genre && (
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium text-white"
                  style={{ background: `linear-gradient(135deg, ${c1}80, ${c2}80)`, border: `1px solid ${c1}40` }}>
                  <Icon name="Music2" size={11} />
                  {profile.favorite_genre}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* stats placeholder */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: 'Headphones', label: 'Часов', value: '—' },
            { icon: 'Heart', label: 'Треков', value: '—' },
            { icon: 'Music2', label: 'Жанров', value: profile.favorite_genre ? '1' : '—' },
          ].map(s => (
            <div key={s.label} className="rounded-2xl border border-white/10 bg-[hsl(var(--card))] p-4 flex flex-col items-center gap-2">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${c1}30, ${c2}30)`, border: `1px solid ${c1}30` }}>
                <Icon name={s.icon} size={16} style={{ color: c1 }} />
              </div>
              <p className="text-xl font-bold">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default UserProfile;
