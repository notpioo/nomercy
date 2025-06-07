import { Trophy, Users, GraduationCap, Radio, Smartphone, Shield } from 'lucide-react';
import { ArrowRight } from 'lucide-react';

const features = [
  {
    icon: Trophy,
    title: 'Tournaments',
    description: 'Compete in weekly tournaments across multiple games. Win prizes, earn recognition, and climb the global leaderboards.',
    color: 'from-gaming-purple to-gaming-blue',
    hoverColor: 'hover:border-gaming-purple/50',
    textColor: 'text-gaming-purple'
  },
  {
    icon: Users,
    title: 'Team Building',
    description: 'Find your perfect squad with our advanced matchmaking system. Create lasting friendships and dominate together.',
    color: 'from-gaming-blue to-gaming-green',
    hoverColor: 'hover:border-gaming-blue/50',
    textColor: 'text-gaming-blue'
  },
  {
    icon: GraduationCap,
    title: 'Skill Development',
    description: 'Access exclusive training content, coaching sessions, and strategy guides from professional gamers.',
    color: 'from-gaming-green to-gaming-amber',
    hoverColor: 'hover:border-gaming-green/50',
    textColor: 'text-gaming-green'
  },
  {
    icon: Radio,
    title: 'Live Streaming',
    description: 'Stream your gameplay directly to the community. Build your audience and become the next gaming superstar.',
    color: 'from-gaming-amber to-gaming-purple',
    hoverColor: 'hover:border-gaming-amber/50',
    textColor: 'text-gaming-amber'
  },
  {
    icon: Smartphone,
    title: 'Mobile App',
    description: 'Stay connected on the go with our PWA. Native app experience with offline capabilities and push notifications.',
    color: 'from-gaming-purple to-gaming-blue',
    hoverColor: 'hover:border-gaming-purple/50',
    textColor: 'text-gaming-purple'
  },
  {
    icon: Shield,
    title: 'Anti-Cheat',
    description: 'Fair play guaranteed with our advanced anti-cheat system. Clean, competitive environment for all players.',
    color: 'from-gaming-blue to-gaming-green',
    hoverColor: 'hover:border-gaming-blue/50',
    textColor: 'text-gaming-blue'
  }
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-gradient-to-b from-gaming-dark to-gaming-deep">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-gaming-purple to-gaming-blue bg-clip-text text-transparent">
              Epic Features
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discover what makes our gaming community the ultimate destination for gamers worldwide
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div 
                key={index}
                className={`group bg-gradient-to-br from-gaming-deep/50 to-gaming-dark/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8 ${feature.hoverColor} transition-all duration-300 hover:transform hover:scale-105`}
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:animate-pulse`}>
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">{feature.title}</h3>
                <p className="text-gray-300 mb-6">{feature.description}</p>
                <div className={`flex items-center ${feature.textColor} font-semibold`}>
                  <span>Learn More</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
