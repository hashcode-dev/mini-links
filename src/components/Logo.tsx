import { Link } from 'react-router-dom';
import { Link2 } from 'lucide-react';
import clsx from 'clsx';

interface LogoProps {
  className?: string;
}

export default function Logo({ className }: LogoProps) {
  return (
    <Link to="/" className={clsx("flex items-center space-x-3 group", className)}>
      <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-sm group-hover:bg-blue-700 transition-colors">
        <Link2 size={18} strokeWidth={2.5} />
      </div>
      <span className="text-xl font-bold text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">
        Mini Links
      </span>
    </Link>
  );
}

