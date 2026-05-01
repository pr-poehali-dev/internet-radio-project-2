import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';
import { useAuth } from '@/contexts/AuthContext';

const GENRES = ['Progressive House', 'Techno', 'Deep House', 'Trance', 'Drum & Bass', 'Ambient', 'Electro', 'Dubstep', 'Future Bass', 'Lo-Fi'];

const AVATAR_COLORS = [
  'from-purple-500 to-pink-500',
  'from-blue-500 to-cyan-500',
  'from-orange-500 to-red-500',
  'from-green-500 to-emerald-500',
  'from-yellow-500 to-orange-500',
];

const Profile = () => {
  const { user, logout, updateProfile, loading } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({
    display_name: user?.display_name || '',
    bio: user?.bio || '',
    favorite_genre: user?.favorite_genre || '',
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center">
        <Icon name="Loader2" size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    navigate('/login');
    return null;
  }

  const avatarColorIdx = user.id % AVATAR_COLORS.length;
  const initials = (user.display_name || user.username).slice(0, 2).toUpperCase();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await updateProfile(form);
      setSuccess('Профиль обновлён!');
      setEditing(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка сохранения');
    } finally {
      setSaving(false);
    }
  };

  const memberSince = user.created_at
    ? new Date(user.created_at).toLocaleDateString('ru-RU', { year: 'numeric', month: 'long' })
    : '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <div className="container mx-auto px-4 py-6 max-w-2xl space-y-6">
        <header className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
            <Icon name="ArrowLeft" size={20} />
            <span className="font-medium">К радио</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
              <Icon name="Radio" size={16} className="text-white" />
            </div>
            <span className="font-heading font-bold glow-neon hidden sm:block">PULSE RADIO</span>
          </div>
        </header>

        <Card className="bg-card/80 backdrop-blur-xl border-primary/20 overflow-hidden">
          <div className="h-28 bg-gradient-to-r from-primary/40 via-purple-500/30 to-pink-500/20 relative">
            <div className="absolute inset-0 opacity-30" style={{
              backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.03) 10px, rgba(255,255,255,0.03) 20px)'
            }} />
          </div>

          <div className="px-6 pb-6">
            <div className="flex items-end justify-between -mt-12 mb-4">
              <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${AVATAR_COLORS[avatarColorIdx]} flex items-center justify-center text-2xl font-bold text-white border-4 border-background shadow-xl glow-box`}>
                {user.avatar_url
                  ? <img src={user.avatar_url} alt="avatar" className="w-full h-full rounded-full object-cover" />
                  : initials}
              </div>
              <div className="flex gap-2 mb-2">
                {!editing ? (
                  <Button variant="outline" size="sm" onClick={() => setEditing(true)} className="gap-2">
                    <Icon name="Pencil" size={14} />
                    Редактировать
                  </Button>
                ) : (
                  <>
                    <Button variant="ghost" size="sm" onClick={() => { setEditing(false); setError(''); }}>Отмена</Button>
                    <Button size="sm" className="gradient-primary gap-2" onClick={handleSave} disabled={saving}>
                      {saving ? <Icon name="Loader2" size={14} className="animate-spin" /> : <Icon name="Check" size={14} />}
                      Сохранить
                    </Button>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-1 mb-4">
              <h2 className="text-2xl font-bold">{user.display_name || user.username}</h2>
              <p className="text-muted-foreground">@{user.username}</p>
              <div className="flex items-center gap-3 text-sm text-muted-foreground flex-wrap">
                <span className="flex items-center gap-1">
                  <Icon name="Mail" size={13} />
                  {user.email}
                </span>
                {memberSince && (
                  <span className="flex items-center gap-1">
                    <Icon name="Calendar" size={13} />
                    С {memberSince}
                  </span>
                )}
              </div>
            </div>

            {user.favorite_genre && !editing && (
              <Badge className="gradient-primary mb-3">{user.favorite_genre}</Badge>
            )}

            {user.bio && !editing && (
              <p className="text-sm text-muted-foreground leading-relaxed">{user.bio}</p>
            )}

            {success && (
              <div className="text-sm text-green-500 bg-green-500/10 border border-green-500/20 rounded-lg px-4 py-3 mt-3">
                {success}
              </div>
            )}
            {error && (
              <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-4 py-3 mt-3">
                {error}
              </div>
            )}
          </div>
        </Card>

        {editing && (
          <Card className="bg-card/80 backdrop-blur-xl border-primary/20 p-6 space-y-5">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Icon name="Pencil" size={16} className="text-primary" />
              Редактирование профиля
            </h3>
            <Separator />

            <div className="space-y-2">
              <Label>Отображаемое имя</Label>
              <Input
                value={form.display_name}
                onChange={e => setForm(p => ({ ...p, display_name: e.target.value }))}
                placeholder="Как вас называть?"
              />
            </div>

            <div className="space-y-2">
              <Label>О себе</Label>
              <Textarea
                value={form.bio}
                onChange={e => setForm(p => ({ ...p, bio: e.target.value }))}
                placeholder="Расскажите о себе..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Любимый жанр</Label>
              <div className="flex flex-wrap gap-2">
                {GENRES.map(g => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setForm(p => ({ ...p, favorite_genre: p.favorite_genre === g ? '' : g }))}
                    className={`px-3 py-1 rounded-full text-sm transition-all border ${
                      form.favorite_genre === g
                        ? 'gradient-primary text-white border-transparent glow-box'
                        : 'border-primary/30 text-muted-foreground hover:border-primary hover:text-primary'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          </Card>
        )}

        <Card className="bg-card/80 backdrop-blur-xl border-primary/20 p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Icon name="Music" size={16} className="text-primary" />
            Активность
          </h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { label: 'Часов прослушано', value: '—' },
              { label: 'Любимых треков', value: '—' },
              { label: 'Запросов в эфир', value: '—' },
            ].map(stat => (
              <div key={stat.label} className="space-y-1">
                <p className="text-2xl font-bold text-primary">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="bg-card/80 backdrop-blur-xl border-destructive/20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Выйти из аккаунта</p>
              <p className="text-sm text-muted-foreground">Завершить текущую сессию</p>
            </div>
            <Button variant="destructive" onClick={handleLogout} className="gap-2">
              <Icon name="LogOut" size={16} />
              Выйти
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
