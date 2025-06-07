import { useState } from 'react';
import { Menu, Gamepad2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils'

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav className="fixed top-0 w-full z-40 bg-gaming-dark/95 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-gaming-purple to-gaming-blue rounded-lg flex items-center justify-center">
              <Gamepad2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">GameCommunity</span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('home')}
              className="hover:text-gaming-purple transition-colors"
            >
              Home
            </button>
            <button 
              onClick={() => scrollToSection('features')}
              className="hover:text-gaming-purple transition-colors"
            >
              Features
            </button>
            <button 
              onClick={() => scrollToSection('community')}
              className="hover:text-gaming-purple transition-colors"
            >
              Community
            </button>
            <button 
              onClick={() => scrollToSection('join')}
              className="hover:text-gaming-purple transition-colors"
            >
              Join
            </button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="md:hidden p-2 hover:bg-white/10"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gaming-deep/95 backdrop-blur-md border-t border-white/10">
          <div className="px-4 py-4 space-y-3">
            <button 
              onClick={() => scrollToSection('home')}
              className="block py-2 hover:text-gaming-purple transition-colors w-full text-left"
            >
              Home
            </button>
            <button 
              onClick={() => scrollToSection('features')}
              className="block py-2 hover:text-gaming-purple transition-colors w-full text-left"
            >
              Features
            </button>
            <button 
              onClick={() => scrollToSection('community')}
              className="block py-2 hover:text-gaming-purple transition-colors w-full text-left"
            >
              Community
            </button>
            <button 
              onClick={() => scrollToSection('join')}
              className="block py-2 hover:text-gaming-purple transition-colors w-full text-left"
            >
              Join
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}