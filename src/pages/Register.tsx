import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { useAuth } from '@/contexts/AuthContext';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', display_name: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) { setError('Пароли не совпадают'); return; }
    setLoading(true);
    try {
      await register(form.username, form.email, form.password, form.display_name || form.username);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка регистрации');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center glow-box">
              <Icon name="Radio" size={22} className="text-white" />
            </div>
            <h1 className="text-3xl font-heading font-bold glow-neon">PULSE RADIO</h1>
          </div>
          <p className="text-muted-foreground">Создайте свой аккаунт</p>
        </div>

        <Card className="bg-card/80 backdrop-blur-xl border-primary/20 p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="username">Имя пользователя *</Label>
                <Input
                  id="username"
                  placeholder="dj_neon"
                  value={form.username}
                  onChange={set('username')}
                  required
                  autoFocus
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="display_name">Отображаемое имя</Label>
                <Input
                  id="display_name"
                  placeholder="DJ Neon"
                  value={form.display_name}
                  onChange={set('display_name')}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={form.email}
                onChange={set('email')}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Пароль *</Label>
              <Input
                id="password"
                type="password"
                placeholder="Минимум 6 символов"
                value={form.password}
                onChange={set('password')}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm">Повторите пароль *</Label>
              <Input
                id="confirm"
                type="password"
                placeholder="••••••••"
                value={form.confirm}
                onChange={set('confirm')}
                required
              />
            </div>

            {error && (
              <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-4 py-3">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full gradient-primary glow-box mt-2" disabled={loading}>
              {loading ? <Icon name="Loader2" size={18} className="animate-spin mr-2" /> : <Icon name="UserPlus" size={18} className="mr-2" />}
              Создать аккаунт
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Уже есть аккаунт?{' '}
            <Link to="/login" className="text-primary hover:underline font-medium">
              Войти
            </Link>
          </div>
        </Card>

        <div className="text-center">
          <Link to="/" className="text-sm text-muted-foreground hover:text-primary flex items-center justify-center gap-1">
            <Icon name="ArrowLeft" size={14} />
            Вернуться к радио
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
