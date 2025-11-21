import { useState } from 'react';
import './App.css';
import FloatingBackground from './components/FloatingBackground';
import Header from './components/Header';
import RecetasSection from './components/Recetas/RecetasSection';
import PokemonsSection from './components/Pokemon/PokemonsSection';
import EconomiaSection from './components/Economia/EconomiaSection';
import Footer from './components/Footer';

export default function App() {
  const [expandedSection, setExpandedSection] = useState(null);

  const handleToggle = (sectionKey) => {
    setExpandedSection((prev) => (prev === sectionKey ? null : sectionKey));
  };

  return (
    <>
      <div className="min-h-screen relative overflow-hidden text-white">
        <FloatingBackground />

        <div className="relative z-10 flex flex-col min-h-screen">
          <Header/>

          <main className="flex-1 w-full px-4 pt-16 pb-10">
            <div className="w-full flex flex-col items-center gap-6 md:gap-6">
              <RecetasSection
                className="mb-6 md:mb-8" 
                isExpanded={expandedSection === 'recetas'}
                onToggle={() => handleToggle('recetas')}
                onCollapse={() => setExpandedSection(null)}
              />
              <PokemonsSection
                className="mb-6 md:mb-8" 
                isExpanded={expandedSection === 'pokemons'}
                onToggle={() => handleToggle('pokemons')}
                onCollapse={() => setExpandedSection(null)}
              />
              <EconomiaSection
                className="mb-6 md:mb-8" 
                isExpanded={expandedSection === 'economia'}
                onToggle={() => handleToggle('economia')}
                onCollapse={() => setExpandedSection(null)}
              />
            </div>
          </main>

        </div>
      </div>
      <footer><Footer/></footer>
    </>

  );
}
