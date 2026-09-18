import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from 'react';
import { Link } from 'react-router-dom';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface BaseProps {
  variant?: Variant;
  size?: Size;
  children?: ReactNode;
  className?: string;
}

type NativeButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'children' | 'className'
>;

type NativeLinkProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  'children' | 'className'
>;

interface ButtonProps extends BaseProps, NativeButtonProps {
  to?: never;
}

interface LinkButtonProps extends BaseProps, NativeLinkProps {
  to: string;
  onClick?: never;
  type?: never;
}

type Props = ButtonProps | LinkButtonProps;

const variants: Record<Variant, string> = {
  primary:
    'bg-teal-600 text-white hover:bg-teal-700 active:bg-teal-800 shadow-sm shadow-teal-600/20',

  secondary:
    'bg-navy-800 text-white hover:bg-navy-900 active:bg-navy-950 shadow-sm',

  outline:
    'border-2 border-navy-200 text-navy-800 hover:bg-navy-50 hover:border-navy-300',

  ghost:
    'text-navy-700 hover:bg-navy-50',

  danger:
    'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-sm',
};

const sizes: Record<Size, string> = {
  sm: 'px-4 py-2 text-sm rounded-lg',
  md: 'px-5 py-2.5 text-sm rounded-lg',
  lg: 'px-7 py-3.5 text-base rounded-xl',
};

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}: Props) {
  const classes = [
    'inline-flex items-center justify-center gap-2',
    'font-semibold transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-teal-500/40',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    variants[variant],
    sizes[size],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if ('to' in props && props.to) {
    const { to, ...rest } = props as LinkButtonProps;

    return (
      <Link to={to} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  const buttonProps = props as ButtonProps;

  return (
    <button className={classes} {...buttonProps}>
      {children}
    </button>
  );
}