import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { useAuth } from '@/contexts/AuthContext';

const MESSAGES_URL = 'https://functions.poehali.dev/adbf63c4-1c95-41c1-a894-a820ce702cea';
const USERS_URL = 'https://functions.poehali.dev/79ddd4af-923d-475e-b4c4-fd83609807ea';

const AVATAR_GRADIENTS = [
  ['#a855f7', '#ec4899'],
  ['#3b82f6', '#06b6d4'],
  ['#f97316', '#ef4444'],
  ['#22c55e', '#10b981'],
  ['#eab308', '#f97316'],
];

interface Msg {
  id: number;
  sender_id: number;
  receiver_id: number;
  text: string;
  is_read: boolean;
  created_at: string;
}

interface UserInfo {
  id: number;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
}

const Messages = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const bottomRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [other, setOther] = useState<UserInfo | null>(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    if (!userId) return;

    Promise.all([
      fetch(`${USERS_URL}?action=get&id=${userId}`).then(r => r.json()),
      fetch(`${MESSAGES_URL}?action=chat&user_id=${userId}`, {
        headers: { 'X-Auth-Token': token }
      }).then(r => r.json()),
    ]).then(([uData, mData]) => {
      if (uData.id) setOther(uData);
      setMessages(mData.messages || []);
    }).finally(() => setLoading(false));
  }, [userId, token]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Poll every 5s
  useEffect(() => {
    if (!token || !userId) return;
    const interval = setInterval(() => {
      fetch(`${MESSAGES_URL}?action=chat&user_id=${userId}`, {
        headers: { 'X-Auth-Token': token }
      }).then(r => r.json()).then(d => setMessages(d.messages || []));
    }, 5000);
    return () => clearInterval(interval);
  }, [token, userId]);

  const handleSend = async () => {
    if (!text.trim() || !token || !userId || sending) return;
    setSending(true);
    const body = text.trim();
    setText('');
    try {
      const r = await fetch(`${MESSAGES_URL}?action=send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Auth-Token': token },
        body: JSON.stringify({ user_id: parseInt(userId), text: body }),
      });
      const msg = await r.json();
      if (msg.id) setMessages(prev => [...prev, msg]);
    } finally {
      setSending(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  if (!user) return null;

  const otherGrad = other ? AVATAR_GRADIENTS[other.id % AVATAR_GRADIENTS.length] : ['#a855f7', '#ec4899'];
  const otherInitials = other ? (other.display_name || other.username).slice(0, 2).toUpperCase() : '??';

  const formatTime = (s: string) => {
    const d = new Date(s);
    return d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (s: string) => {
    const d = new Date(s);
    const today = new Date();
    const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
    if (d.toDateString() === today.toDateString()) return 'Сегодня';
    if (d.toDateString() === yesterday.toDateString()) return 'Вчера';
    return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
  };

  // Group by date
  const grouped: { date: string; msgs: Msg[] }[] = [];
  messages.forEach(m => {
    const date = formatDate(m.created_at);
    const last = grouped[grouped.length - 1];
    if (last && last.date === date) last.msgs.push(m);
    else grouped.push({ date, msgs: [m] });
  });

  return (
    <div className="h-screen bg-[hsl(var(--background))] flex flex-col overflow-hidden">
      {/* topbar */}
      <div className="shrink-0 border-b border-white/10 bg-[hsl(var(--card))]/80 backdrop-blur px-4 py-3 flex items-center gap-3">
        <Link to="/users" className="w-8 h-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
          <Icon name="ArrowLeft" size={15} className="text-muted-foreground" />
        </Link>

        {other ? (
          <>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold text-white overflow-hidden shrink-0"
              style={{ background: `linear-gradient(135deg, ${otherGrad[0]}, ${otherGrad[1]})` }}>
              {other.avatar_url
                ? <img src={other.avatar_url} alt="avatar" className="w-full h-full object-cover" />
                : otherInitials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">{other.display_name || other.username}</p>
              <p className="text-xs text-muted-foreground">@{other.username}</p>
            </div>
          </>
        ) : (
          <div className="w-9 h-9 rounded-xl bg-white/10 animate-pulse" />
        )}

        <Link to="/" className="w-8 h-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors" title="К радио">
          <Icon name="Radio" size={14} className="text-muted-foreground" />
        </Link>
      </div>

      {/* messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${otherGrad[0]}30, ${otherGrad[1]}30)` }}>
              <Icon name="MessageCircle" size={28} style={{ color: otherGrad[0] }} />
            </div>
            <p className="text-sm font-medium">Начните диалог</p>
            <p className="text-xs text-center max-w-[200px]">Напишите первое сообщение {other ? (other.display_name || other.username) : ''}у</p>
          </div>
        ) : (
          grouped.map(group => (
            <div key={group.date}>
              <div className="flex justify-center my-4">
                <span className="text-[10px] text-muted-foreground px-3 py-1 rounded-full bg-white/5 border border-white/10">
                  {group.date}
                </span>
              </div>
              {group.msgs.map((m, i) => {
                const isMe = m.sender_id === user.id;
                const prevMsg = group.msgs[i - 1];
                const showAvatar = !isMe && (!prevMsg || prevMsg.sender_id !== m.sender_id);
                return (
                  <div key={m.id} className={`flex gap-2 mb-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
                    {!isMe && (
                      <div className="w-7 h-7 shrink-0 mt-auto">
                        {showAvatar && (
                          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold text-white overflow-hidden"
                            style={{ background: `linear-gradient(135deg, ${otherGrad[0]}, ${otherGrad[1]})` }}>
                            {other?.avatar_url
                              ? <img src={other.avatar_url} alt="avatar" className="w-full h-full object-cover" />
                              : otherInitials}
                          </div>
                        )}
                      </div>
                    )}
                    <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      isMe
                        ? 'rounded-br-sm text-white'
                        : 'rounded-bl-sm bg-[hsl(var(--card))] border border-white/10'
                    }`}
                      style={isMe ? { background: `linear-gradient(135deg, ${otherGrad[0]}, ${otherGrad[1]})` } : {}}>
                      <p className="break-words">{m.text}</p>
                      <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-white/60' : 'text-muted-foreground'}`}>
                        {formatTime(m.created_at)}
                        {isMe && (
                          <span className="ml-1">{m.is_read ? '✓✓' : '✓'}</span>
                        )}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* input */}
      <div className="shrink-0 border-t border-white/10 bg-[hsl(var(--card))]/80 backdrop-blur px-4 py-3">
        {!token ? (
          <p className="text-center text-sm text-muted-foreground">
            <Link to="/login" className="text-primary underline">Войдите</Link>, чтобы писать сообщения
          </p>
        ) : (
          <div className="flex gap-2 items-end">
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Написать сообщение..."
              rows={1}
              className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm resize-none focus:outline-none focus:border-primary/50 transition-colors placeholder:text-muted-foreground max-h-32"
              style={{ minHeight: '48px' }}
            />
            <button
              onClick={handleSend}
              disabled={!text.trim() || sending}
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shrink-0 transition-all hover:opacity-90 disabled:opacity-40"
              style={{ background: `linear-gradient(135deg, ${otherGrad[0]}, ${otherGrad[1]})` }}
            >
              {sending
                ? <Icon name="Loader2" size={18} className="animate-spin" />
                : <Icon name="Send" size={18} />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
