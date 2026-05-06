import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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

interface UserItem {
  id: number;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  favorite_genre: string | null;
  created_at: string;
}

const Users = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch(`${USERS_URL}?action=list`)
      .then(r => r.json())
      .then(d => setUsers(d.users || []))
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    return !q || (u.display_name || u.username).toLowerCase().includes(q) || u.username.toLowerCase().includes(q);
  });

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] relative overflow-hidden">
      {/* ambient blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-60 -right-60 w-[500px] h-[500px] rounded-full opacity-[0.07] blur-3xl"
          style={{ background: 'radial-gradient(circle, #a855f7, transparent)' }} />
        <div className="absolute top-1/2 -left-60 w-[400px] h-[400px] rounded-full opacity-[0.07] blur-3xl"
          style={{ background: 'radial-gradient(circle, #3b82f6, transparent)' }} />
        <div className="absolute -bottom-40 right-1/4 w-[350px] h-[350px] rounded-full opacity-[0.05] blur-3xl"
          style={{ background: 'radial-gradient(circle, #ec4899, transparent)' }} />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-2xl">

        {/* header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/" className="group w-10 h-10 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center hover:bg-primary/20 hover:border-primary/40 transition-all">
            <Icon name="ArrowLeft" size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
          </Link>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-heading font-bold tracking-tight glow-neon">Слушатели</h1>
              {!loading && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-primary/20 border border-primary/30 text-[11px] font-semibold text-primary">
                  {users.length}
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">Все участники Efir Plus</p>
          </div>
        </div>

        {/* search */}
        <div className="relative mb-6">
          <Icon name="Search" size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Найти по имени или нику..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[hsl(var(--card))] border border-white/10 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-muted-foreground"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
              <Icon name="X" size={14} />
            </button>
          )}
        </div>

        {/* list */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="relative w-14 h-14">
              <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
              <div className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            </div>
            <p className="text-sm text-muted-foreground">Загружаем участников...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-muted-foreground">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
              <Icon name="Users" size={28} className="opacity-50" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium">Никого не найдено</p>
              {search && <p className="text-xs mt-1 opacity-60">Попробуй другой запрос</p>}
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {search && (
              <p className="text-xs text-muted-foreground px-1 mb-3">
                Найдено: {filtered.length}
              </p>
            )}
            {filtered.map((u, index) => {
              const [c1, c2] = AVATAR_GRADIENTS[u.id % AVATAR_GRADIENTS.length];
              const initials = (u.display_name || u.username).slice(0, 2).toUpperCase();
              const isMe = user?.id === u.id;
              return (
                <div
                  key={u.id}
                  className="relative flex items-center gap-4 p-4 rounded-2xl border border-white/8 bg-[hsl(var(--card))] hover:border-primary/30 hover:bg-white/[0.03] transition-all group cursor-pointer"
                  style={{ animationDelay: `${index * 40}ms` }}
                  onClick={() => navigate(isMe ? '/profile' : `/user/${u.id}`)}
                >
                  {/* glow on hover */}
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                    style={{ boxShadow: `0 0 0 1px ${c1}22, inset 0 0 20px ${c1}08` }} />

                  {/* avatar */}
                  <div className="relative shrink-0">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-bold text-white overflow-hidden"
                      style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}>
                      {u.avatar_url
                        ? <img src={u.avatar_url} alt="avatar" className="w-full h-full object-cover" />
                        : initials}
                    </div>
                    {isMe && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-green-400 border-2 border-[hsl(var(--card))]" />
                    )}
                  </div>

                  {/* info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm truncate">{u.display_name || u.username}</span>
                      {isMe && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold text-white leading-none"
                          style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}>Вы</span>
                      )}
                      {u.favorite_genre && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full border border-white/10 bg-white/5 text-muted-foreground leading-none">
                          {u.favorite_genre}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">@{u.username}</p>
                    {u.bio && <p className="text-xs text-muted-foreground/70 truncate mt-0.5 italic">{u.bio}</p>}
                  </div>

                  {/* actions */}
                  <div className="flex gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                    {!isMe && user && (
                      <Link to={`/messages/${u.id}`}>
                        <button className="w-9 h-9 rounded-xl border border-white/10 bg-white/5 hover:bg-primary/20 hover:border-primary/40 flex items-center justify-center transition-all"
                          title="Написать сообщение">
                          <Icon name="MessageCircle" size={15} className="text-muted-foreground group-hover:text-primary" />
                        </button>
                      </Link>
                    )}
                    {isMe && (
                      <Link to="/profile">
                        <button className="w-9 h-9 rounded-xl border border-white/10 bg-white/5 hover:bg-primary/20 hover:border-primary/40 flex items-center justify-center transition-all"
                          title="Мой профиль">
                          <Icon name="User" size={15} className="text-muted-foreground" />
                        </button>
                      </Link>
                    )}
                    <div className="w-9 h-9 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center">
                      <Icon name="ChevronRight" size={15} className="text-muted-foreground/50" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;
