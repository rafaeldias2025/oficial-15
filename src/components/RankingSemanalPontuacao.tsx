import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Award, Crown } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface RankingItem {
  user_id: string;
  nome: string;
  pontos: number[];
  total_pontos: number;
  media_semanal: number;
}

interface RankingSemanalPontuacaoProps {
  dados: RankingItem[];
  isLoading?: boolean;
  userIdAtual?: string;
}

export const RankingSemanalPontuacao: React.FC<RankingSemanalPontuacaoProps> = ({
  dados,
  isLoading = false,
  userIdAtual,
}) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-instituto-orange" />
            Ranking Semanal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-instituto-orange"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getIconePosicao = (posicao: number) => {
    switch (posicao) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-orange-600" />;
      default:
        return <div className="w-6 h-6 flex items-center justify-center text-instituto-dark font-bold">#{posicao}</div>;
    }
  };

  const getCorPosicao = (posicao: number) => {
    switch (posicao) {
      case 1:
        return 'bg-yellow-50 border-yellow-200';
      case 2:
        return 'bg-gray-50 border-gray-200';
      case 3:
        return 'bg-orange-50 border-orange-200';
      default:
        return 'bg-white border-instituto-border';
    }
  };

  const getBadgeCategoria = (media: number) => {
    if (media >= 21) return { texto: 'Excelente', cor: 'bg-green-100 text-green-800' };
    if (media >= 11) return { texto: 'Bom', cor: 'bg-yellow-100 text-yellow-800' };
    return { texto: 'Iniciante', cor: 'bg-red-100 text-red-800' };
  };

  const getIniciais = (nome: string) => {
    return nome
      .split(' ')
      .map(n => n.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-instituto-orange" />
          Ranking Semanal
          <Badge variant="secondary" className="ml-2">
            {dados.length} participantes
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {dados.length > 0 ? (
            dados.map((item, index) => {
              const posicao = index + 1;
              const badge = getBadgeCategoria(item.media_semanal);
              const isUsuarioAtual = item.user_id === userIdAtual;
              
              return (
                <div
                  key={item.user_id}
                  className={`
                    p-4 rounded-lg border-2 transition-all duration-200
                    ${getCorPosicao(posicao)}
                    ${isUsuarioAtual ? 'ring-2 ring-instituto-orange ring-opacity-50' : ''}
                  `}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getIconePosicao(posicao)}
                      
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-instituto-orange text-white text-sm">
                          {getIniciais(item.nome)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div>
                        <h4 className="font-medium text-instituto-dark">
                          {item.nome}
                          {isUsuarioAtual && (
                            <span className="ml-2 text-instituto-orange text-sm font-bold">
                              (Você)
                            </span>
                          )}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge 
                            variant="secondary" 
                            className={`text-xs ${badge.cor} border-0`}
                          >
                            {badge.texto}
                          </Badge>
                          <span className="text-xs text-instituto-dark/60">
                            {item.pontos.length} dias ativos
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-2xl font-bold text-instituto-orange">
                        {item.media_semanal}
                      </div>
                      <div className="text-xs text-instituto-dark/60">
                        média/dia
                      </div>
                      <div className="text-xs text-instituto-dark/40">
                        {item.total_pontos} total
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-instituto-dark/60">
              <Trophy className="w-12 h-12 mx-auto mb-3 text-instituto-dark/40" />
              <p>Nenhum participante no ranking ainda</p>
              <p className="text-sm">Seja o primeiro a completar uma missão!</p>
            </div>
          )}
        </div>
        
        {dados.length > 0 && (
          <div className="mt-6 p-4 bg-instituto-orange/10 rounded-lg">
            <h4 className="font-medium text-instituto-dark mb-2">Como funciona o ranking?</h4>
            <div className="text-sm text-instituto-dark/70 space-y-1">
              <p>• Baseado na média semanal de pontos</p>
              <p>• Atualizado diariamente</p>
              <p>• Apenas usuários ativos aparecem</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RankingSemanalPontuacao;