import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { useAuth } from '@/contexts/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loginVal, setLoginVal] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(loginVal, password);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка входа');
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
          <p className="text-muted-foreground">Войдите, чтобы продолжить</p>
        </div>

        <Card className="bg-card/80 backdrop-blur-xl border-primary/20 p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="login">Email или имя пользователя</Label>
              <Input
                id="login"
                type="text"
                placeholder="your@email.com"
                value={loginVal}
                onChange={e => setLoginVal(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-4 py-3">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full gradient-primary glow-box" disabled={loading}>
              {loading ? <Icon name="Loader2" size={18} className="animate-spin mr-2" /> : <Icon name="LogIn" size={18} className="mr-2" />}
              Войти
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Ещё нет аккаунта?{' '}
            <Link to="/register" className="text-primary hover:underline font-medium">
              Зарегистрироваться
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

export default Login;