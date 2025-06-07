import { Rocket, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function HeroSection() {
  const scrollToJoin = () => {
    const element = document.getElementById('join');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      <div className="absolute inset-0 bg-gradient-to-br from-gaming-deep/50 to-gaming-dark"></div>
      
      {/* Gaming background animation */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-16 h-16 bg-gaming-purple rounded-full animate-float"></div>
        <div className="absolute top-3/4 right-1/4 w-12 h-12 bg-gaming-blue rounded-full animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-1/4 left-1/3 w-8 h-8 bg-gaming-green rounded-full animate-float" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold">
              <span className="bg-gradient-to-r from-gaming-purple via-gaming-blue to-gaming-green bg-clip-text text-transparent">
                Level Up Your
              </span>
              <br />
              <span className="text-white">Gaming Experience</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto">
              Join the ultimate gaming community where legends are born. Connect with players, compete in tournaments, and dominate the leaderboards.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              onClick={scrollToJoin}
              className="group bg-gradient-to-r from-gaming-purple to-gaming-blue hover:from-gaming-blue hover:to-gaming-purple px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl animate-glow"
            >
              <Rocket className="w-5 h-5 mr-2" />
              Join Community
            </Button>
            <Button 
              variant="outline"
              className="border-2 border-white/20 hover:border-gaming-purple px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:bg-gaming-purple/10"
            >
              <Play className="w-5 h-5 mr-2" />
              Watch Trailer
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
            <div className="text-center">
              <div className="text-3xl font-bold text-gaming-purple">15K+</div>
              <div className="text-gray-400">Active Members</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gaming-blue">200+</div>
              <div className="text-gray-400">Tournaments</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gaming-green">50+</div>
              <div className="text-gray-400">Games Supported</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gaming-amber">$100K+</div>
              <div className="text-gray-400">Prize Pool</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
