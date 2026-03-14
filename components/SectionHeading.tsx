import type { ReactNode } from 'react';

type Props = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  children?: ReactNode;
};

export function SectionHeading({ eyebrow, title, subtitle, align = 'left', children }: Props) {
  return (
    <div className={`section-heading ${align === 'center' ? 'text-center' : 'text-left'}`}>
      <span className="eyebrow">{eyebrow}</span>
      <h2 className="section-title">{title}</h2>
      {subtitle ? <p className="section-subtitle">{subtitle}</p> : null}
      {children}
    </div>
  );
}
