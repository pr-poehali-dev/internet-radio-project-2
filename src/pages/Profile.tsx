import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { useAuth } from '@/contexts/AuthContext';

const GENRES = ['Progressive House', 'Techno', 'Deep House', 'Trance', 'Drum & Bass', 'Ambient', 'Electro', 'Dubstep', 'Future Bass', 'Lo-Fi'];

const AVATAR_GRADIENTS = [
  ['#a855f7', '#ec4899'],
  ['#3b82f6', '#06b6d4'],
  ['#f97316', '#ef4444'],
  ['#22c55e', '#10b981'],
  ['#eab308', '#f97316'],
];

const Profile = () => {
  const { user, logout, updateProfile, uploadAvatar, loading } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({
    display_name: user?.display_name || '',
    bio: user?.bio || '',
    favorite_genre: user?.favorite_genre || '',
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[hsl(var(--background))] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-muted-foreground text-sm">Загрузка профиля...</p>
        </div>
      </div>
    );
  }

  if (!user) { navigate('/login'); return null; }

  const [c1, c2] = AVATAR_GRADIENTS[user.id % AVATAR_GRADIENTS.length];
  const initials = (user.display_name || user.username).slice(0, 2).toUpperCase();

  const handleLogout = async () => { await logout(); navigate('/'); };

  const handleSave = async () => {
    setSaving(true); setError(''); setSuccess('');
    try {
      await updateProfile(form);
      setSuccess('Профиль обновлён!');
      setEditing(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка сохранения');
    } finally { setSaving(false); }
  };

  const memberSince = user.created_at
    ? new Date(user.created_at).toLocaleDateString('ru-RU', { year: 'numeric', month: 'long' })
    : '';

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarUploading(true);
    setError('');
    try {
      await uploadAvatar(file);
      setSuccess('Фото обновлено!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки');
    } finally {
      setAvatarUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] relative overflow-hidden">
      {/* ambient blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ background: `radial-gradient(circle, ${c1}, transparent)` }} />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full opacity-15 blur-3xl"
          style={{ background: `radial-gradient(circle, ${c2}, transparent)` }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5 blur-3xl"
          style={{ background: `radial-gradient(circle, ${c1}, ${c2})` }} />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-xl">

        {/* topbar */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/" className="group flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <div className="w-8 h-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
              <Icon name="ArrowLeft" size={15} />
            </div>
            <span className="text-sm font-medium">К радио</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}>
              <Icon name="Radio" size={13} className="text-white" />
            </div>
            <span className="font-heading font-bold text-sm tracking-widest" style={{ color: c1 }}>PULSE RADIO</span>
          </div>
        </div>

        {/* hero card */}
        <div className="relative rounded-3xl overflow-hidden mb-4"
          style={{ background: 'hsl(var(--card))' }}>

          {/* banner */}
          <div className="h-32 relative overflow-hidden">
            <div className="absolute inset-0" style={{
              background: `linear-gradient(135deg, ${c1}60, ${c2}40, transparent)`,
            }} />
            <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: `radial-gradient(circle at 20% 50%, ${c1} 0%, transparent 50%), radial-gradient(circle at 80% 20%, ${c2} 0%, transparent 40%)`
            }} />
            {/* waveform decoration */}
            <svg className="absolute bottom-0 left-0 right-0 w-full opacity-30" height="40" viewBox="0 0 400 40" preserveAspectRatio="none">
              <path d="M0,20 Q20,5 40,20 T80,20 T120,20 T160,20 T200,20 T240,20 T280,20 T320,20 T360,20 T400,20" fill="none" stroke="white" strokeWidth="1.5"/>
              <path d="M0,25 Q25,8 50,25 T100,25 T150,25 T200,25 T250,25 T300,25 T350,25 T400,25" fill="none" stroke="white" strokeWidth="1"/>
            </svg>
          </div>

          {/* avatar row */}
          <div className="px-6 pb-6">
            <div className="flex items-end justify-between -mt-10 mb-5">
              <div className="relative group">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-xl font-bold text-white shadow-2xl border-2 border-white/10 overflow-hidden"
                  style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}>
                  {user.avatar_url
                    ? <img src={user.avatar_url} alt="avatar" className="w-full h-full object-cover" />
                    : initials}
                  {/* upload overlay */}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={avatarUploading}
                    className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl cursor-pointer"
                  >
                    {avatarUploading
                      ? <Icon name="Loader2" size={20} className="text-white animate-spin" />
                      : <Icon name="Camera" size={20} className="text-white" />}
                    <span className="text-white text-[10px] mt-1 font-medium">
                      {avatarUploading ? 'Загрузка...' : 'Изменить'}
                    </span>
                  </button>
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-500 border-2 border-[hsl(var(--card))]" />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>

              <div className="flex gap-2 pb-1">
                {!editing ? (
                  <button
                    onClick={() => setEditing(true)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border border-white/10 bg-white/5 hover:bg-white/10 transition-all text-muted-foreground hover:text-foreground"
                  >
                    <Icon name="Pencil" size={13} />
                    Изменить
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setEditing(false); setError(''); }}
                      className="px-3 py-2 rounded-xl text-sm border border-white/10 bg-white/5 hover:bg-white/10 transition-all text-muted-foreground"
                    >
                      Отмена
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
                      style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}
                    >
                      {saving ? <Icon name="Loader2" size={13} className="animate-spin" /> : <Icon name="Check" size={13} />}
                      Сохранить
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* name & meta */}
            <div className="space-y-1 mb-4">
              <h1 className="text-2xl font-bold tracking-tight">{user.display_name || user.username}</h1>
              <p className="text-sm font-medium" style={{ color: c1 }}>@{user.username}</p>
            </div>

            {user.bio && !editing && (
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">{user.bio}</p>
            )}

            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                <Icon name="Mail" size={11} />
                {user.email}
              </span>
              {memberSince && (
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                  <Icon name="CalendarDays" size={11} />
                  С {memberSince}
                </span>
              )}
              {(user.favorite_genre || form.favorite_genre) && !editing && (
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium text-white"
                  style={{ background: `linear-gradient(135deg, ${c1}80, ${c2}80)`, border: `1px solid ${c1}40` }}>
                  <Icon name="Music2" size={11} />
                  {user.favorite_genre}
                </span>
              )}
            </div>

            {success && (
              <div className="mt-4 flex items-center gap-2 text-sm text-green-400 bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3">
                <Icon name="CheckCircle" size={15} />
                {success}
              </div>
            )}
            {error && (
              <div className="mt-4 flex items-center gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                <Icon name="AlertCircle" size={15} />
                {error}
              </div>
            )}
          </div>
        </div>

        {/* edit form */}
        {editing && (
          <div className="rounded-3xl border border-white/10 bg-[hsl(var(--card))] p-6 space-y-5 mb-4 animate-fade-in">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1 h-5 rounded-full" style={{ background: `linear-gradient(${c1}, ${c2})` }} />
              <h3 className="font-semibold">Редактирование</h3>
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground uppercase tracking-wider">Отображаемое имя</Label>
              <Input
                value={form.display_name}
                onChange={e => setForm(p => ({ ...p, display_name: e.target.value }))}
                placeholder="Как вас называть?"
                className="bg-white/5 border-white/10 rounded-xl focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground uppercase tracking-wider">О себе</Label>
              <Textarea
                value={form.bio}
                onChange={e => setForm(p => ({ ...p, bio: e.target.value }))}
                placeholder="Расскажите о себе..."
                rows={3}
                className="bg-white/5 border-white/10 rounded-xl focus:border-primary resize-none"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-xs text-muted-foreground uppercase tracking-wider">Любимый жанр</Label>
              <div className="flex flex-wrap gap-2">
                {GENRES.map(g => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setForm(p => ({ ...p, favorite_genre: p.favorite_genre === g ? '' : g }))}
                    className="px-3 py-1.5 rounded-xl text-xs font-medium transition-all border"
                    style={form.favorite_genre === g
                      ? { background: `linear-gradient(135deg, ${c1}, ${c2})`, borderColor: 'transparent', color: 'white' }
                      : { background: 'transparent', borderColor: 'rgba(255,255,255,0.1)', color: 'hsl(var(--muted-foreground))' }
                    }
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { icon: 'Headphones', label: 'Часов', value: '—' },
            { icon: 'Heart', label: 'Треков', value: '—' },
            { icon: 'Mic2', label: 'Запросов', value: '—' },
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

        {/* logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-between px-5 py-4 rounded-2xl border border-white/10 bg-[hsl(var(--card))] hover:bg-red-500/10 hover:border-red-500/30 transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
              <Icon name="LogOut" size={16} className="text-red-400" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-red-400">Выйти из аккаунта</p>
              <p className="text-xs text-muted-foreground">Завершить текущую сессию</p>
            </div>
          </div>
          <Icon name="ChevronRight" size={16} className="text-muted-foreground group-hover:text-red-400 transition-colors" />
        </button>

      </div>
    </div>
  );
};

export default Profile;