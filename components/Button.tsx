import type { ComponentPropsWithoutRef } from 'react';

const cx = (...classes: Array<string | undefined>) => classes.filter(Boolean).join(' ');

export function Button({ className, ...props }: ComponentPropsWithoutRef<'button'>) {
  return <button className={cx('btn-base btn-gradient', className)} {...props} />;
}

export function LinkButton({ className, ...props }: ComponentPropsWithoutRef<'a'>) {
  return <a className={cx('btn-base btn-gradient', className)} {...props} />;
}