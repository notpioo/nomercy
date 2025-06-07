import { useState } from 'react';
import { Gamepad2, Download, Menu, X, Users, Trophy, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePWA } from '@/hooks/use-pwa';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isInstallable, installApp } = usePWA();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Gamepad2 className="w-8 h-8 text-purple-400" />
            <h1 className="text-xl font-bold text-white">GameCommunity</h1>
          </div>
          
          <nav className="hidden md:flex space-x-6">
            <a href="#home" className="text-white hover:text-purple-400 transition-colors">Home</a>
            <a href="#about" className="text-white hover:text-purple-400 transition-colors">About</a>
            <a href="#join" className="text-white hover:text-purple-400 transition-colors">Join</a>
          </nav>

          <div className="flex items-center space-x-4">
            {isInstallable && (
              <Button 
                onClick={installApp}
                className="hidden md:flex bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
              >
                <Download className="w-4 h-4 mr-2" />
                Install App
              </Button>
            )}
            
            <button 
              className="md:hidden text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-black/30 backdrop-blur-sm border-t border-white/10">
            <nav className="px-4 py-4 space-y-2">
              <a href="#home" className="block text-white hover:text-purple-400 py-2">Home</a>
              <a href="#about" className="block text-white hover:text-purple-400 py-2">About</a>
              <a href="#join" className="block text-white hover:text-purple-400 py-2">Join</a>
              {isInstallable && (
                <Button 
                  onClick={installApp}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white mt-2"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Install App
                </Button>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section id="home" className="px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Bergabung dengan 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
              {" "}Komunitas Gaming
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Tempat para gamer berkumpul, berbagi pengalaman, dan berkompetisi bersama. 
            Mari level up bareng-bareng!
          </p>
          <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 text-lg rounded-lg">
            Gabung Sekarang
          </Button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-4 py-16 bg-black/20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <Users className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-white">5,000+</h3>
              <p className="text-gray-300">Member Aktif</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <Trophy className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-white">100+</h3>
              <p className="text-gray-300">Tournament</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <Star className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-white">50+</h3>
              <p className="text-gray-300">Game Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
            Tentang Komunitas Kami
          </h2>
          <p className="text-lg text-gray-300 mb-8">
            GameCommunity adalah platform yang menghubungkan para gamer Indonesia. 
            Kami menyediakan tempat untuk berbagi tips, strategi, dan pengalaman gaming. 
            Dari casual gamer hingga pro player, semua welcome di sini!
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            <div className="bg-white/5 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-3">🎮 Game Populer</h3>
              <p className="text-gray-300">Mobile Legends, Valorant, PUBG Mobile, Free Fire, dan masih banyak lagi</p>
            </div>
            <div className="bg-white/5 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-3">🏆 Tournament Rutin</h3>
              <p className="text-gray-300">Ikuti tournament mingguan dengan hadiah menarik untuk para juara</p>
            </div>
          </div>
        </div>
      </section>

      {/* Join Section */}
      <section id="join" className="px-4 py-20 bg-black/20">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
            Siap Bergabung?
          </h2>
          <p className="text-lg text-gray-300 mb-8">
            Daftar sekarang dan jadilah bagian dari komunitas gaming terbesar Indonesia!
          </p>
          <div className="space-y-4">
            <Button className="w-full md:w-auto bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 text-lg rounded-lg">
              Join Discord Server
            </Button>
            <div className="text-gray-400">
              atau follow social media kami untuk update terbaru
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/30 border-t border-white/10 px-4 py-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Gamepad2 className="w-6 h-6 text-purple-400" />
            <span className="text-lg font-bold text-white">GameCommunity</span>
          </div>
          <p className="text-gray-400 text-sm">
            © 2024 GameCommunity. Made with ❤️ for Indonesian Gamers
          </p>
        </div>
      </footer>
    </div>
  );
}
