
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Trophy, 
  Target, 
  Star, 
  Calendar, 
  Users, 
  CheckCircle, 
  Clock,
  Award,
  Flame,
  Heart
} from "lucide-react";
import { useChallenges } from '@/hooks/useChallenges';
import { useUserPoints } from '@/hooks/useUserPoints';

export default function Desafios() {
  const [selectedTab, setSelectedTab] = useState("ativos");
  const { challenges, userChallenges, completedChallenges, loading, joinChallenge, updateChallengeProgress } = useChallenges();
  const { userPoints } = useUserPoints();

  const getCategoryColor = (categoria: string) => {
    switch (categoria) {
      case "biologico": return "bg-blue-100 text-blue-800";
      case "psicologico": return "bg-purple-100 text-purple-800";
      case "nutricional": return "bg-green-100 text-green-800";
      case "familiar_social": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getNivelColor = (nivel: string) => {
    switch (nivel) {
      case "iniciante": return "bg-green-100 text-green-800";
      case "intermediario": return "bg-yellow-100 text-yellow-800";
      case "avancado": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Desafios e Conquistas
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Transforme sua jornada em um jogo divertido e motivador
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-yellow-400 to-yellow-500 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm font-medium">Pontos Totais</p>
                  <p className="text-2xl font-bold">{userPoints?.total_points?.toLocaleString() || '0'}</p>
                </div>
                <Star className="w-8 h-8 text-yellow-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Desafios Completos</p>
                  <p className="text-2xl font-bold">{completedChallenges.length}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Desafios Ativos</p>
                  <p className="text-2xl font-bold">{userChallenges.length}</p>
                </div>
                <Award className="w-8 h-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm font-medium">Sequência</p>
                  <p className="text-2xl font-bold">{userPoints?.current_streak || 0} dias</p>
                </div>
                <Flame className="w-8 h-8 text-red-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8 bg-white rounded-lg p-1 shadow-sm">
          <Button
            variant={selectedTab === "ativos" ? "default" : "ghost"}
            onClick={() => setSelectedTab("ativos")}
            className="flex-1"
          >
            <Target className="w-4 h-4 mr-2" />
            Desafios Ativos
          </Button>
          <Button
            variant={selectedTab === "completos" ? "default" : "ghost"}
            onClick={() => setSelectedTab("completos")}
            className="flex-1"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Completos
          </Button>
          <Button
            variant={selectedTab === "conquistas" ? "default" : "ghost"}
            onClick={() => setSelectedTab("conquistas")}
            className="flex-1"
          >
            <Trophy className="w-4 h-4 mr-2" />
            Conquistas
          </Button>
        </div>

        {/* Content */}
        {selectedTab === "ativos" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Desafios Disponíveis */}
            {challenges.filter(challenge => !userChallenges.some(uc => uc.challenge_id === challenge.id)).map((challenge) => (
              <Card key={challenge.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-2xl">{challenge.icon}</div>
                    <Badge className={getNivelColor(challenge.level)}>
                      {challenge.level}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{challenge.title}</CardTitle>
                  <p className="text-sm text-gray-600">{challenge.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Badge className={getCategoryColor(challenge.category)}>
                        {challenge.category}
                      </Badge>
                      <div className="flex items-center gap-1 text-yellow-600">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="font-semibold">{challenge.points}</span>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full" 
                      onClick={() => joinChallenge(challenge.id, challenge.duration_days)}
                      disabled={loading}
                    >
                      {loading ? 'Participando...' : 'Participar do Desafio'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Desafios Ativos do Usuário */}
            {userChallenges.map((userChallenge) => (
              <Card key={userChallenge.id} className="hover:shadow-lg transition-shadow border-blue-200">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-2xl">{userChallenge.challenge?.icon}</div>
                    <Badge className={getNivelColor(userChallenge.challenge?.level || '')}>
                      {userChallenge.challenge?.level}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{userChallenge.challenge?.title}</CardTitle>
                  <p className="text-sm text-gray-600">{userChallenge.challenge?.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progresso</span>
                        <span>{userChallenge.progress}/{userChallenge.target_value}</span>
                      </div>
                      <Progress value={(userChallenge.progress / userChallenge.target_value) * 100} className="h-2" />
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <Badge className={getCategoryColor(userChallenge.challenge?.category || '')}>
                        {userChallenge.challenge?.category}
                      </Badge>
                      <div className="flex items-center gap-1 text-yellow-600">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="font-semibold">{userChallenge.challenge?.points}</span>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full" 
                      onClick={() => updateChallengeProgress(userChallenge.id, userChallenge.progress + 1)}
                      disabled={loading || userChallenge.is_completed}
                    >
                      {userChallenge.is_completed ? 'Completado!' : 'Avançar Progresso'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {selectedTab === "completos" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedChallenges.map((userChallenge) => (
              <Card key={userChallenge.id} className="bg-green-50 border-green-200">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-2xl">{userChallenge.challenge?.icon}</div>
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <CardTitle className="text-lg">{userChallenge.challenge?.title}</CardTitle>
                  <p className="text-sm text-gray-600">{userChallenge.challenge?.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Badge className={getCategoryColor(userChallenge.challenge?.category || '')}>
                        {userChallenge.challenge?.category}
                      </Badge>
                      <div className="flex items-center gap-1 text-yellow-600">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="font-semibold">{userChallenge.challenge?.points}</span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      Completado em: {userChallenge.completed_at ? new Date(userChallenge.completed_at).toLocaleDateString() : ''}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {selectedTab === "conquistas" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
              <CardContent className="p-6">
                <div className="text-4xl mb-3">🎯</div>
                <h3 className="font-semibold mb-2">Primeiro Passo</h3>
                <p className="text-sm text-gray-600">Complete seu primeiro desafio</p>
                <Badge className="mt-3 bg-yellow-100 text-yellow-800">
                  Em breve
                </Badge>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
