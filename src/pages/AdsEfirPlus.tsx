import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

const FORMATS = [
  {
    icon: 'Megaphone',
    title: 'Аудиоролик в эфире',
    duration: '15–60 сек',
    description: 'Ваш ролик звучит в прямом эфире между треками. Охватывает всех слушателей в режиме реального времени.',
    price: 'от 2 000 ₽',
    tag: 'Популярное',
    gradient: 'from-violet-600/15 to-purple-900/20',
    tagColor: 'bg-primary/30 text-primary border-primary/30',
  },
  {
    icon: 'MonitorPlay',
    title: 'Баннер на сайте',
    duration: '7 / 14 / 30 дней',
    description: 'Визуальный баннер в стиле сайта — между плеером и вкладками. Виден на всех устройствах.',
    price: 'от 1 500 ₽',
    tag: 'Новинка',
    gradient: 'from-orange-600/15 to-pink-900/20',
    tagColor: 'bg-accent/30 text-accent border-accent/30',
  },
  {
    icon: 'Mic2',
    title: 'Спонсорство шоу',
    duration: 'Весь эфир передачи',
    description: 'DJ упоминает вас в начале, середине и конце своей программы. Нативная интеграция без раздражения.',
    price: 'от 5 000 ₽',
    tag: 'Максимальный охват',
    gradient: 'from-cyan-600/15 to-blue-900/20',
    tagColor: 'bg-secondary/30 text-secondary border-secondary/30',
  },
  {
    icon: 'Star',
    title: 'Спецпроект',
    duration: 'Индивидуально',
    description: 'Конкурс в эфире с вашим призом, брендированный плейлист, совместная рубрика — всё, что придумаем вместе.',
    price: 'по запросу',
    tag: 'Под ключ',
    gradient: 'from-yellow-600/15 to-orange-900/20',
    tagColor: 'bg-yellow-500/30 text-yellow-400 border-yellow-500/30',
  },
];

const STATS = [
  { value: '12 000+', label: 'слушателей в сутки', icon: 'Headphones' },
  { value: '2 800+', label: 'онлайн в пиковые часы', icon: 'Users' },
  { value: '78%', label: 'возраст 18–45 лет', icon: 'TrendingUp' },
  { value: '3 мин', label: 'среднее время сессии', icon: 'Clock' },
];

const STEPS = [
  { num: '01', title: 'Оставьте заявку', text: 'Напишите нам — расскажите о продукте, бюджете и целях.' },
  { num: '02', title: 'Подберём формат', text: 'Предложим оптимальный вариант под вашу аудиторию и задачи.' },
  { num: '03', title: 'Запустим рекламу', text: 'Разместим ролик или баннер в течение 1–2 рабочих дней.' },
  { num: '04', title: 'Отчёт и статистика', text: 'После кампании пришлём отчёт с охватом и показателями.' },
];

const FAQ = [
  {
    q: 'Нужно ли мне самому делать ролик?',
    a: 'Нет. Наша команда поможет написать текст и записать аудиоролик — просто расскажите, что хотите сказать.',
  },
  {
    q: 'Какая аудитория слушает эфир?',
    a: 'Преимущественно молодёжь и люди среднего возраста (18–45 лет), интересующиеся электронной музыкой, клубной культурой и современными трендами.',
  },
  {
    q: 'Можно ли запустить рекламу на конкретное время?',
    a: 'Да. Вы можете выбрать прайм-тайм (вечер пт–вс) или конкретное шоу с нужной вам аудиторией.',
  },
  {
    q: 'Как быстро выйдет реклама?',
    a: 'Обычно за 1–2 рабочих дня после согласования материалов и оплаты.',
  },
];

const AdRequestModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [form, setForm] = useState({ name: '', contact: '', company: '', format: '', description: '', budget: '' });
  const [sent, setSent] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const body = encodeURIComponent(
      `Имя: ${form.name}\nКонтакт: ${form.contact}\nКомпания: ${form.company}\nФормат: ${form.format}\nБюджет: ${form.budget}\n\nОписание:\n${form.description}`
    );
    window.location.href = `mailto:ads@efirplus.ru?subject=Заявка на рекламу&body=${body}`;
    setSent(true);
  };

  const handleClose = () => {
    setSent(false);
    setForm({ name: '', contact: '', company: '', format: '', description: '', budget: '' });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-card border-primary/20 max-w-lg w-full">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">Оставить заявку на рекламу</DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            Расскажите о своей рекламе — мы свяжемся с вами в течение рабочего дня.
          </DialogDescription>
        </DialogHeader>

        {sent ? (
          <div className="flex flex-col items-center gap-4 py-8 text-center">
            <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center glow-box">
              <Icon name="CheckCheck" size={30} className="text-white" />
            </div>
            <p className="font-heading font-bold text-lg">Заявка отправлена!</p>
            <p className="text-sm text-muted-foreground">Откроется ваш почтовый клиент. Мы ответим в ближайшее время.</p>
            <Button onClick={handleClose} className="gradient-primary glow-box mt-2">Закрыть</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="name">Ваше имя *</Label>
                <Input id="name" name="name" required placeholder="Иван Иванов" value={form.name} onChange={handleChange} className="bg-background/60 border-primary/20 focus:border-primary" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="contact">Телефон или Telegram *</Label>
                <Input id="contact" name="contact" required placeholder="+7 900 000-00-00" value={form.contact} onChange={handleChange} className="bg-background/60 border-primary/20 focus:border-primary" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="company">Компания / бренд</Label>
                <Input id="company" name="company" placeholder="Название бренда" value={form.company} onChange={handleChange} className="bg-background/60 border-primary/20 focus:border-primary" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="format">Формат рекламы</Label>
                <select
                  id="format"
                  name="format"
                  value={form.format}
                  onChange={handleChange}
                  className="w-full h-10 rounded-md border border-primary/20 bg-background/60 px-3 text-sm focus:outline-none focus:border-primary text-foreground"
                >
                  <option value="">Выберите формат</option>
                  <option>Аудиоролик в эфире</option>
                  <option>Баннер на сайте</option>
                  <option>Спонсорство шоу</option>
                  <option>Спецпроект</option>
                  <option>Не определился</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="budget">Бюджет</Label>
              <Input id="budget" name="budget" placeholder="например: до 10 000 ₽" value={form.budget} onChange={handleChange} className="bg-background/60 border-primary/20 focus:border-primary" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description">Описание рекламы *</Label>
              <Textarea
                id="description"
                name="description"
                required
                placeholder="Расскажите о вашем продукте, целевой аудитории, что хотите донести слушателям, есть ли готовый ролик или текст..."
                value={form.description}
                onChange={handleChange}
                rows={5}
                className="bg-background/60 border-primary/20 focus:border-primary resize-none"
              />
            </div>

            <div className="flex gap-3 pt-1">
              <Button type="button" variant="outline" onClick={handleClose} className="border-primary/30 flex-1">
                Отмена
              </Button>
              <Button type="submit" className="gradient-primary glow-box flex-1">
                <Icon name="Send" size={15} className="mr-2" />
                Отправить заявку
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

const AdsEfirPlus = () => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <AdRequestModal open={modalOpen} onClose={() => setModalOpen(false)} />
      <div className="container mx-auto px-4 py-8 max-w-5xl space-y-12">

        {/* Шапка */}
        <div className="flex items-center justify-between">
          <Link to="/" className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1.5 transition-colors">
            <Icon name="ArrowLeft" size={15} />
            К радио
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center glow-box">
              <Icon name="Radio" size={15} className="text-white" />
            </div>
            <span className="font-heading font-bold text-sm glow-neon">EFIR PLUS</span>
          </div>
        </div>

        {/* Hero */}
        <div className="text-center space-y-5 py-6">
          <Badge className="bg-primary/20 text-primary border-primary/30 text-xs px-3 py-1">
            Реклама на радио
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-heading font-bold leading-tight">
            Дотянитесь до&nbsp;аудитории,<br className="hidden sm:block" />
            <span className="glow-neon"> которая слушает</span>
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Efir Plus — онлайн-радио с живой, вовлечённой аудиторией. Мы помогаем брендам и малому бизнесу говорить с людьми там, где они реально проводят время.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Button onClick={() => setModalOpen(true)} className="gradient-primary glow-box w-full sm:w-auto px-8">
              <Icon name="Mail" size={16} className="mr-2" />
              Оставить заявку
            </Button>
            <a href="tel:+78001234567">
              <Button variant="outline" className="border-primary/30 hover:border-primary w-full sm:w-auto px-8">
                <Icon name="Phone" size={16} className="mr-2" />
                Позвонить
              </Button>
            </a>
          </div>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {STATS.map((s) => (
            <Card key={s.label} className="bg-card/80 backdrop-blur-xl border-primary/15 p-4 sm:p-5 text-center">
              <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center mx-auto mb-3">
                <Icon name={s.icon} size={18} className="text-white" />
              </div>
              <p className="text-2xl sm:text-3xl font-heading font-bold glow-neon">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1 leading-snug">{s.label}</p>
            </Card>
          ))}
        </div>

        {/* Форматы */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-heading font-bold mb-2">Форматы рекламы</h2>
          <p className="text-muted-foreground mb-6 text-sm sm:text-base">Выберите подходящий вариант или совместите несколько для максимального эффекта.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FORMATS.map((f) => (
              <Card
                key={f.title}
                className={`bg-gradient-to-br ${f.gradient} border-primary/15 backdrop-blur-xl p-5 sm:p-6 flex flex-col gap-3 hover:border-primary/40 transition-all hover:scale-[1.02]`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="w-11 h-11 rounded-xl bg-primary/20 border border-primary/20 flex items-center justify-center shrink-0">
                    <Icon name={f.icon} size={22} className="text-primary" />
                  </div>
                  <Badge className={`text-[11px] px-2 py-0.5 h-5 ${f.tagColor} shrink-0`}>{f.tag}</Badge>
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base sm:text-lg">{f.title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{f.duration}</p>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">{f.description}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-lg font-heading font-bold text-primary">{f.price}</span>
                  <Button size="sm" variant="outline" className="border-primary/30 hover:border-primary text-xs" onClick={() => setModalOpen(true)}>
                    Заказать
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Как это работает */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-heading font-bold mb-6">Как разместить рекламу</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {STEPS.map((step, i) => (
              <div key={step.num} className="relative">
                <Card className="bg-card/80 backdrop-blur-xl border-primary/15 p-5 h-full">
                  <span className="text-4xl font-heading font-bold text-primary/20 leading-none">{step.num}</span>
                  <h4 className="font-heading font-bold text-base mt-2 mb-1">{step.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.text}</p>
                </Card>
                {i < STEPS.length - 1 && (
                  <div className="hidden md:flex absolute top-1/2 -right-3 -translate-y-1/2 z-10 w-6 h-6 items-center justify-center">
                    <Icon name="ChevronRight" size={18} className="text-primary/40" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-heading font-bold mb-6">Частые вопросы</h2>
          <div className="space-y-3">
            {FAQ.map((item) => (
              <Card key={item.q} className="bg-card/80 backdrop-blur-xl border-primary/15 p-5">
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon name="HelpCircle" size={13} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm sm:text-base mb-1">{item.q}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.a}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20 backdrop-blur-xl p-6 sm:p-10 text-center space-y-4">
          <div className="w-14 h-14 rounded-full gradient-primary flex items-center justify-center mx-auto glow-box">
            <Icon name="Zap" size={26} className="text-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-heading font-bold">Готовы запустить рекламу?</h2>
          <p className="text-muted-foreground max-w-md mx-auto text-sm sm:text-base">
            Напишите нам — обсудим задачу, подберём формат и запустим кампанию уже на этой неделе.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Button onClick={() => setModalOpen(true)} className="gradient-primary glow-box w-full sm:w-auto px-8">
              <Icon name="Mail" size={16} className="mr-2" />
              Оставить заявку
            </Button>
            <a href="https://t.me/efirplus_ads" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="border-primary/30 hover:border-primary w-full sm:w-auto px-8">
                <Icon name="Send" size={16} className="mr-2" />
                Telegram
              </Button>
            </a>
          </div>
        </Card>

        {/* Футер */}
        <div className="text-center py-4 text-xs text-muted-foreground">
          © 2025 Efir Plus. Все права защищены.
          <Link to="/" className="ml-3 hover:text-primary transition-colors">На главную</Link>
        </div>

      </div>
    </div>
  );
};

export default AdsEfirPlus;
