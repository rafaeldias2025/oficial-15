import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PublicRanking } from '@/components/PublicRanking';
import { RankingNotifications } from '@/components/RankingNotifications';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Home, Trophy, ArrowRight } from 'lucide-react';
import ThemeToggle from '@/components/netflix/ThemeToggle';

const PublicRankingPage = () => {
  const [timeFilter, setTimeFilter] = useState<'week' | 'month' | 'all'>('week');

  return (
    <div className="min-h-screen bg-netflix-dark">
      {/* Header */}
      <header className="bg-netflix-card border-b border-netflix-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link to="/" className="text-instituto-orange hover:opacity-90 transition-opacity">
                <Home className="w-6 h-6" />
              </Link>
              <h1 className="text-2xl font-bold text-netflix-text flex items-center gap-2">
                <Trophy className="w-7 h-7 text-instituto-orange" />
                Ranking dos Campeões
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Link to="/auth">
                <Button className="bg-instituto-orange hover:bg-instituto-orange/90">
                  Participar
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Ranking Principal */}
          <div className="lg:col-span-2">
            <PublicRanking 
              timeFilter={timeFilter}
              onTimeFilterChange={setTimeFilter}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Filtros */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Filtrar por Período</h3>
                <div className="flex flex-col gap-2">
                  {[
                    { id: 'week', label: 'Esta Semana' },
                    { id: 'month', label: 'Este Mês' },
                    { id: 'all', label: 'Geral' }
                  ].map((filter) => (
                    <Button
                      key={filter.id}
                      variant={timeFilter === filter.id ? 'default' : 'outline'}
                      className={`w-full justify-start ${
                        timeFilter === filter.id 
                          ? 'bg-instituto-orange hover:bg-instituto-orange/90' 
                          : ''
                      }`}
                      onClick={() => setTimeFilter(filter.id as 'week' | 'month' | 'all')}
                    >
                      {filter.label}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Notificações */}
            <Card>
              <CardContent className="p-6">
                <RankingNotifications />
              </CardContent>
            </Card>

            {/* Call to Action */}
            <Card className="bg-gradient-to-r from-instituto-orange/20 to-instituto-purple/20 border-none">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">Faça Parte do Ranking!</h3>
                <p className="text-muted-foreground mb-4">
                  Participe da nossa comunidade, complete desafios e conquiste seu lugar no pódio.
                </p>
                <Link to="/auth">
                  <Button className="w-full bg-instituto-orange hover:bg-instituto-orange/90">
                    Jornada Radical
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PublicRankingPage; 