import React from 'react';
import { WheelTool } from './WheelTool';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface SessionToolsProps {
  sessionId: string;
  userId: string;
  isSessionActive: boolean;
  availableTools: string[];
}

export const SessionTools: React.FC<SessionToolsProps> = ({
  sessionId,
  userId,
  isSessionActive,
  availableTools
}) => {
  const tools = [
    {
      id: 'energia_vital',
      name: 'Roda da Energia Vital',
      description: 'Avalie seu equilíbrio energético em 4 dimensões fundamentais'
    },
    {
      id: 'roda_vida',
      name: 'Roda da Vida',
      description: 'Analise os 5 pilares que sustentam sua vida'
    },
    {
      id: 'saude_energia',
      name: 'Roda da Saúde e Energia',
      description: 'Diagnóstico completo dos seus hábitos de saúde'
    }
  ];

  const filteredTools = tools.filter(tool => availableTools.includes(tool.id));

  if (filteredTools.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            <p>Nenhuma ferramenta foi configurada para esta sessão.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (filteredTools.length === 1) {
    const tool = filteredTools[0];
    return (
      <WheelTool
        wheelType={tool.id as 'energia_vital' | 'roda_vida' | 'saude_energia'}
        sessionId={sessionId}
        userId={userId}
        isSessionActive={isSessionActive}
      />
    );
  }

  return (
    <Tabs defaultValue={filteredTools[0].id} className="w-full">
      <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${filteredTools.length}, 1fr)` }}>
        {filteredTools.map((tool) => (
          <TabsTrigger key={tool.id} value={tool.id}>
            {tool.name}
          </TabsTrigger>
        ))}
      </TabsList>
      
      {filteredTools.map((tool) => (
        <TabsContent key={tool.id} value={tool.id} className="mt-6">
          <div className="mb-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{tool.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{tool.description}</p>
              </CardHeader>
            </Card>
          </div>
          
          <WheelTool
            wheelType={tool.id as 'energia_vital' | 'roda_vida' | 'saude_energia'}
            sessionId={sessionId}
            userId={userId}
            isSessionActive={isSessionActive}
          />
        </TabsContent>
      ))}
    </Tabs>
  );
};