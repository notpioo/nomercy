import { Crown, Star, Gamepad2, Trophy, Heart, Clock, Users, Medal, Eye } from 'lucide-react';

const communityMembers = [
  {
    name: 'ProGamer_X',
    title: 'Tournament Champion',
    bio: '3-time tournament winner and content creator with over 500K followers. Specializes in FPS and strategy games.',
    wins: '127',
    viewers: '45K',
    icon: Crown,
    color: 'from-gaming-purple to-gaming-blue',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=250'
  },
  {
    name: 'StreamQueen',
    title: 'Content Creator',
    bio: 'Rising star in the streaming world. Known for entertaining gameplay and educational content across multiple genres.',
    followers: '89K',
    hours: '1.2K',
    icon: Star,
    color: 'from-gaming-blue to-gaming-green',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=250'
  },
  {
    name: 'NightRider',
    title: 'Team Captain',
    bio: 'Leader of the legendary Phoenix Squad. Master strategist with unmatched leadership skills in team-based competitions.',
    teamSize: '5',
    rank: '#3',
    icon: Gamepad2,
    color: 'from-gaming-green to-gaming-amber',
    image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=250'
  }
];

export function CommunitySection() {
  return (
    <section id="community" className="py-20 bg-gaming-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-gaming-green to-gaming-amber bg-clip-text text-transparent">
              Join The Legends
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Meet the champions, streamers, and rising stars of our gaming community
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {communityMembers.map((member, index) => {
            const IconComponent = member.icon;
            return (
              <div 
                key={index}
                className="bg-gradient-to-br from-gaming-deep/70 to-gaming-dark/70 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-gaming-purple/50 transition-all duration-300"
              >
                <img 
                  src={member.image} 
                  alt={`${member.title} gaming setup`}
                  className="w-full h-48 object-cover rounded-xl mb-4" 
                />
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`w-12 h-12 bg-gradient-to-br ${member.color} rounded-full flex items-center justify-center`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{member.name}</h3>
                    <p className="text-gaming-purple text-sm">{member.title}</p>
                  </div>
                </div>
                <p className="text-gray-300 text-sm mb-4">{member.bio}</p>
                <div className="flex justify-between text-sm">
                  {member.wins && (
                    <>
                      <span className="text-gaming-green">
                        <Trophy className="w-4 h-4 inline mr-1" />
                        {member.wins} Wins
                      </span>
                      <span className="text-gaming-blue">
                        <Eye className="w-4 h-4 inline mr-1" />
                        {member.viewers} Viewers
                      </span>
                    </>
                  )}
                  {member.followers && (
                    <>
                      <span className="text-gaming-green">
                        <Heart className="w-4 h-4 inline mr-1" />
                        {member.followers} Followers
                      </span>
                      <span className="text-gaming-amber">
                        <Clock className="w-4 h-4 inline mr-1" />
                        {member.hours} Hours
                      </span>
                    </>
                  )}
                  {member.teamSize && (
                    <>
                      <span className="text-gaming-purple">
                        <Users className="w-4 h-4 inline mr-1" />
                        {member.teamSize} Team Size
                      </span>
                      <span className="text-gaming-amber">
                        <Medal className="w-4 h-4 inline mr-1" />
                        {member.rank} Global Rank
                      </span>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Community Stats */}
        <div className="bg-gradient-to-r from-gaming-purple/20 to-gaming-blue/20 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white mb-2">Community Growth</h3>
            <p className="text-gray-300">Our community is growing stronger every day</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-gaming-purple mb-2">+250</div>
              <div className="text-gray-400 text-sm">Daily Joins</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gaming-blue mb-2">12.5K</div>
              <div className="text-gray-400 text-sm">Matches Today</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gaming-green mb-2">3.2K</div>
              <div className="text-gray-400 text-sm">Online Now</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gaming-amber mb-2">45</div>
              <div className="text-gray-400 text-sm">Countries</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
