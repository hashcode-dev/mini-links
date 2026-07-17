import { Link } from 'react-router-dom';
import clsx from 'clsx';

interface LogoProps {
  className?: string;
}

export default function Logo({ className }: LogoProps) {
  return (
    <Link to="/" className={clsx("flex items-center gap-2 group", className)}>
      {/* Animated Logo SVG */}
      <div className="relative w-8 h-8 flex items-center justify-center">
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Outer ring */}
          <circle
            cx="16"
            cy="16"
            r="14"
            stroke="url(#gradient1)"
            strokeWidth="2"
            className="group-hover:animate-spin"
          />

          {/* Inner link shape */}
          <path
            d="M10 16C10 12.686 12.686 10 16 10C19.314 10 22 12.686 22 16"
            stroke="url(#gradient2)"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
            className="opacity-75 group-hover:opacity-100 transition-opacity"
          />

          {/* Arrow indicating link */}
          <path
            d="M20 14L22 16L20 18"
            stroke="url(#gradient2)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Dot indicator */}
          <circle
            cx="16"
            cy="22"
            r="1.5"
            fill="url(#gradient2)"
            className="opacity-60 group-hover:opacity-100 transition-opacity"
          />

          <defs>
            <linearGradient id="gradient1" x1="0" y1="0" x2="32" y2="32">
              <stop offset="0%" stopColor="#2a9fb8" />
              <stop offset="100%" stopColor="#1a7f8c" />
            </linearGradient>
            <linearGradient id="gradient2" x1="0" y1="0" x2="32" y2="32">
              <stop offset="0%" stopColor="#2a9fb8" />
              <stop offset="100%" stopColor="#0f5a66" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Brand Text */}
      <div className="flex flex-col leading-tight">
        <span className="text-lg font-bold tracking-tight font-display text-navy dark:text-white group-hover:text-primary dark:group-hover:text-teal-400 transition-colors">
          Mini
        </span>
        <span className="text-xs font-semibold tracking-wider text-primary dark:text-teal-400 uppercase">
          Links
        </span>
      </div>
    </Link>
  );
}
