import { Link, Outlet, useLocation } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-stone-800 font-sans selection:bg-stone-200">
      <header className="max-w-3xl mx-auto px-6 py-12 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <Clock className="w-5 h-5 text-stone-400 group-hover:text-stone-800 transition-colors" />
          <span className="font-serif text-xl tracking-tight font-medium text-stone-700 group-hover:text-stone-900 transition-colors">Future Mail</span>
        </Link>
        <nav>
          <Link
            to="/create"
            className={cn(
              "text-sm font-medium px-4 py-2 rounded-full transition-all duration-300",
              location.pathname === '/create' 
                ? "bg-stone-800 text-[#FDFBF7]" 
                : "text-stone-500 hover:text-stone-900 hover:bg-stone-100"
            )}
          >
            Viết thư tới tương lai
          </Link>
        </nav>
      </header>
      <main className="max-w-3xl mx-auto px-6 pb-24">
        <Outlet />
      </main>
    </div>
  );
}
