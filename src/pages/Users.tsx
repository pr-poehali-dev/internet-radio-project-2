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
      {/* ambient */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-10 blur-3xl"
          style={{ background: 'radial-gradient(circle, #a855f7, transparent)' }} />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-10 blur-3xl"
          style={{ background: 'radial-gradient(circle, #3b82f6, transparent)' }} />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-2xl">

        {/* header */}
        <div className="flex items-center gap-3 mb-8">
          <Link to="/" className="group w-9 h-9 rounded-full border border-white/10 bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
            <Icon name="ArrowLeft" size={16} className="text-muted-foreground group-hover:text-foreground transition-colors" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Слушатели</h1>
            <p className="text-xs text-muted-foreground">Все участники Pulse Radio</p>
          </div>
        </div>

        {/* search */}
        <div className="relative mb-6">
          <Icon name="Search" size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Поиск по имени..."
            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[hsl(var(--card))] border border-white/10 text-sm focus:outline-none focus:border-primary/50 transition-colors placeholder:text-muted-foreground"
          />
        </div>

        {/* list */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            <p className="text-sm text-muted-foreground">Загрузка...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
            <Icon name="Users" size={40} />
            <p className="text-sm">Никого не найдено</p>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground px-1">{filtered.length} {filtered.length === 1 ? 'участник' : 'участников'}</p>
            {filtered.map(u => {
              const [c1, c2] = AVATAR_GRADIENTS[u.id % AVATAR_GRADIENTS.length];
              const initials = (u.display_name || u.username).slice(0, 2).toUpperCase();
              const isMe = user?.id === u.id;
              return (
                <div key={u.id} className="relative flex items-center gap-4 p-4 rounded-2xl border border-white/10 bg-[hsl(var(--card))] hover:border-white/20 transition-all group cursor-pointer"
                  onClick={() => navigate(isMe ? '/profile' : `/user/${u.id}`)}>

                  {/* avatar */}
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-bold text-white shrink-0 overflow-hidden"
                    style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}>
                    {u.avatar_url
                      ? <img src={u.avatar_url} alt="avatar" className="w-full h-full object-cover" />
                      : initials}
                  </div>

                  {/* info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold truncate">{u.display_name || u.username}</span>
                      {isMe && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-medium text-white"
                          style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}>Вы</span>
                      )}
                      {u.favorite_genre && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full border border-white/10 text-muted-foreground">
                          {u.favorite_genre}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">@{u.username}</p>
                    {u.bio && <p className="text-xs text-muted-foreground truncate mt-0.5">{u.bio}</p>}
                  </div>

                  {/* actions */}
                  <div className="flex gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                    {!isMe && user && (
                      <Link to={`/messages/${u.id}`}>
                        <button className="w-9 h-9 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                          title="Написать сообщение">
                          <Icon name="MessageCircle" size={16} className="text-muted-foreground" />
                        </button>
                      </Link>
                    )}
                    {isMe && (
                      <Link to="/profile">
                        <button className="w-9 h-9 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                          title="Мой профиль">
                          <Icon name="User" size={16} className="text-muted-foreground" />
                        </button>
                      </Link>
                    )}
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