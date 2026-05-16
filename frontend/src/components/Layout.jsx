import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <div className="relative min-h-screen flex">
      {/* Ambient orbs */}
      <div className="pointer-events-none absolute -top-32 -left-32 w-[480px] h-[480px]
                      bg-brand-600/20 blur-3xl rounded-full animate-float" />
      <div className="pointer-events-none absolute top-1/3 -right-40 w-[420px] h-[420px]
                      bg-fuchsia-600/10 blur-3xl rounded-full animate-float" />

      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className="flex-1 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
