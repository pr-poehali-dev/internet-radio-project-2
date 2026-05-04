import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface Ad {
  id: number;
  label: string;
  title: string;
  description: string;
  cta: string;
  url: string;
  gradient: string;
  icon: string;
  tag?: string;
}

const ADS: Ad[] = [
  {
    id: 1,
    label: 'Реклама',
    title: 'Yamaha MX61',
    description: 'Профессиональный синтезатор для музыкантов. Скидка 20% до конца месяца.',
    cta: 'Смотреть предложение',
    url: '#',
    gradient: 'from-violet-600/20 to-purple-900/30',
    icon: 'Music2',
    tag: '−20%',
  },
  {
    id: 2,
    label: 'Реклама',
    title: 'Pioneer DJ CDJ-3000',
    description: 'Флагманский медиаплеер для клубного DJ. Бесплатная доставка по России.',
    cta: 'Узнать цену',
    url: '#',
    gradient: 'from-orange-600/20 to-pink-900/30',
    icon: 'Disc3',
    tag: 'Хит',
  },
  {
    id: 3,
    label: 'Реклама',
    title: 'Студия звукозаписи «Efir»',
    description: 'Запись трека под ключ от 3 000 ₽. Профессиональное оборудование и мастеринг.',
    cta: 'Записаться',
    url: '#',
    gradient: 'from-cyan-600/20 to-blue-900/30',
    icon: 'Mic2',
  },
];

type BannerVariant = 'horizontal' | 'sidebar';

interface AdBannerProps {
  variant?: BannerVariant;
  adIndex?: number;
}

const AdBanner = ({ variant = 'horizontal', adIndex = 0 }: AdBannerProps) => {
  const [dismissed, setDismissed] = useState(false);
  const ad = ADS[adIndex % ADS.length];

  if (dismissed) return null;

  if (variant === 'horizontal') {
    return (
      <div
        className={`relative rounded-xl border border-primary/10 bg-gradient-to-r ${ad.gradient} backdrop-blur-sm overflow-hidden group`}
      >
        <div className="flex items-center gap-3 sm:gap-5 p-3 sm:p-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-xl bg-primary/20 border border-primary/20 flex items-center justify-center">
            <Icon name={ad.icon} size={24} className="text-primary" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] text-muted-foreground/60 uppercase tracking-widest">
                {ad.label}
              </span>
              {ad.tag && (
                <Badge className="text-[10px] px-1.5 py-0 bg-primary/30 text-primary border-primary/30 h-4">
                  {ad.tag}
                </Badge>
              )}
            </div>
            <p className="font-heading font-bold text-sm sm:text-base leading-tight truncate">
              {ad.title}
            </p>
            <p className="text-xs text-muted-foreground leading-snug mt-0.5 hidden sm:block line-clamp-1">
              {ad.description}
            </p>
          </div>

          <a
            href={ad.url}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 text-xs sm:text-sm font-semibold text-primary hover:text-primary/80 transition-colors whitespace-nowrap flex items-center gap-1 group-hover:underline"
          >
            <span className="hidden sm:inline">{ad.cta}</span>
            <span className="sm:hidden">Открыть</span>
            <Icon name="ExternalLink" size={13} />
          </a>
        </div>

        <button
          onClick={() => setDismissed(true)}
          className="absolute top-2 right-2 text-muted-foreground/40 hover:text-muted-foreground transition-colors"
          aria-label="Закрыть"
        >
          <Icon name="X" size={13} />
        </button>
      </div>
    );
  }

  return (
    <div
      className={`relative rounded-xl border border-primary/10 bg-gradient-to-b ${ad.gradient} backdrop-blur-sm overflow-hidden p-4 sm:p-5`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] text-muted-foreground/60 uppercase tracking-widest">
          {ad.label}
        </span>
        {ad.tag && (
          <Badge className="text-[10px] px-1.5 py-0 bg-primary/30 text-primary border-primary/30 h-4">
            {ad.tag}
          </Badge>
        )}
      </div>
      <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/20 flex items-center justify-center mb-3">
        <Icon name={ad.icon} size={22} className="text-primary" />
      </div>
      <p className="font-heading font-bold text-base mb-1">{ad.title}</p>
      <p className="text-xs text-muted-foreground mb-4 leading-snug">{ad.description}</p>
      <a
        href={ad.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition-colors hover:underline"
      >
        {ad.cta}
        <Icon name="ExternalLink" size={12} />
      </a>

      <button
        onClick={() => setDismissed(true)}
        className="absolute top-2 right-2 text-muted-foreground/40 hover:text-muted-foreground transition-colors"
        aria-label="Закрыть"
      >
        <Icon name="X" size={13} />
      </button>
    </div>
  );
};

export default AdBanner;