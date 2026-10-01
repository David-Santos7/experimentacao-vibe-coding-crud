import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";

export function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex min-h-16 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <a
            href="/users"
            className="text-lg font-extrabold tracking-tight text-slate-950 focus-visible:rounded focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none"
          >
            CRUD<span className="text-blue-700">TCC</span>
          </a>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <Outlet />
      </main>
      <Toaster richColors position="top-right" closeButton />
    </div>
  );
}
