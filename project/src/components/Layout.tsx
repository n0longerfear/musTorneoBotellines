import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Trophy, Calendar, Users, List } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-indigo-600 text-white p-4">
        <h1 className="text-xl font-bold text-center">Torneo Botellines Mus</h1>
      </header>
      
      <main className="container mx-auto px-4 py-6 mb-20">
        {children}
      </main>
      
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="flex justify-around">
          <Link
            to="/"
            className={`flex flex-col items-center p-2 ${
              location.pathname === '/' ? 'text-indigo-600' : 'text-gray-600'
            }`}
          >
            <Trophy size={24} />
            <span className="text-xs">Inicio</span>
          </Link>
          <Link
            to="/calendar"
            className={`flex flex-col items-center p-2 ${
              location.pathname === '/calendar' ? 'text-indigo-600' : 'text-gray-600'
            }`}
          >
            <Calendar size={24} />
            <span className="text-xs">Calendario</span>
          </Link>
          <Link
            to="/ranking"
            className={`flex flex-col items-center p-2 ${
              location.pathname === '/ranking' ? 'text-indigo-600' : 'text-gray-600'
            }`}
          >
            <Users size={24} />
            <span className="text-xs">Ranking</span>
          </Link>
          <Link
            to="/matches"
            className={`flex flex-col items-center p-2 ${
              location.pathname === '/matches' ? 'text-indigo-600' : 'text-gray-600'
            }`}
          >
            <List size={24} />
            <span className="text-xs">Partidos</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}