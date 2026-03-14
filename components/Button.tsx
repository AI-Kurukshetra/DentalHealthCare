import type { ComponentPropsWithoutRef } from 'react';

const cx = (...classes: Array<string | undefined>) => classes.filter(Boolean).join(' ');

export function Button({ className, ...props }: ComponentPropsWithoutRef<'button'>) {
  return (
    <button
      className={cx(
        'btn-gradient inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] transition-all',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-500',
        className
      )}
      {...props}
    />
  );
}

export function LinkButton({ className, ...props }: ComponentPropsWithoutRef<'a'>) {
  return (
    <a
      className={cx(
        'btn-gradient inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] transition-all',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-500',
        className
      )}
      {...props}
    />
  );
}
