
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { format, startOfWeek, subWeeks, addWeeks } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ArrowLeft, ArrowRight, Save } from 'lucide-react';

interface RatingRowProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

const RatingRow: React.FC<RatingRowProps> = ({ label, value, onChange }) => (
    <div className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50">
        <Label className="text-sm md:text-base">{label}</Label>
        <div className="flex gap-1 md:gap-2">
            {[1, 2, 3, 4, 5].map(v => (
                <Button 
                    key={v}
                    type="button"
                    variant={value === v ? "default" : "outline"}
                    size="sm"
                    className={`h-8 w-8 rounded-full ${value === v ? 'bg-blue-600' : ''}`}
                    onClick={() => onChange(v)}
                >
                    {v}
                </Button>
            ))}
        </div>
    </div>
);

const initialFormState = {
    aprendizado_semana: {},
    avaliacao_desempenho_pessoal: {},
    desempenho_semanal: {},
    objetivos_proxima_semana: ""
};

function AvaliacaoSemanal() {
    const [currentWeek, setCurrentWeek] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
    const [formData, setFormData] = useState<any>(initialFormState);
    const [isLoading, setIsLoading] = useState(false);

    const handleNestedChange = (section: string, field: string, value: any) => {
        setFormData((prev: any) => ({
            ...prev,
            [section]: { ...prev[section], [field]: value }
        }));
    };
    

    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        console.log("Salvando avaliação semanal:", formData);
        // Here you would save to your backend/database
        alert("Avaliação salva com sucesso!");
    };

    const weekLabel = `${format(currentWeek, 'dd/MM/yyyy')} - ${format(addWeeks(currentWeek, 1), 'dd/MM/yyyy')}`;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-6">
            <div className="max-w-4xl mx-auto">
                <Card className="mb-6">
                    <CardHeader className="text-center">
                        <div className="flex justify-between items-start mb-4">

                            <div></div>
                        </div>
                        <CardTitle className="text-2xl md:text-3xl font-bold">Avaliação Semanal</CardTitle>
                        <CardDescription>Reflita sobre sua semana para impulsionar seu progresso.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center justify-between">
                        <Button variant="outline" onClick={() => setCurrentWeek(prev => subWeeks(prev, 1))}>
                            <ArrowLeft className="h-4 w-4 mr-2" /> Anterior
                        </Button>
                        <div className="font-semibold text-center">{weekLabel}</div>
                        <Button variant="outline" onClick={() => setCurrentWeek(prev => addWeeks(prev, 1))}>
                            Próxima <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                    </CardContent>
                </Card>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Aprendizado da Semana</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Textarea placeholder="O melhor acontecimento da semana passada foi..." value={formData.aprendizado_semana?.melhor_acontecimento || ''} onChange={e => handleNestedChange('aprendizado_semana', 'melhor_acontecimento', e.target.value)} />
                            <Textarea placeholder="O maior desafio que enfrentei nessa semana foi..." value={formData.aprendizado_semana?.maior_desafio || ''} onChange={e => handleNestedChange('aprendizado_semana', 'maior_desafio', e.target.value)} />
                            <Textarea placeholder="E se eu fosse meu mentor eu diria para mim..." value={formData.aprendizado_semana?.conselho_mentor || ''} onChange={e => handleNestedChange('aprendizado_semana', 'conselho_mentor', e.target.value)} />
                            <Textarea placeholder="O maior aprendizado que tive sobre mim foi..." value={formData.aprendizado_semana?.maior_aprendizado_sabotador || ''} onChange={e => handleNestedChange('aprendizado_semana', 'maior_aprendizado_sabotador', e.target.value)} />
                            <Textarea placeholder="Qual foi o momento que percebi que estava me sabotando..." value={formData.aprendizado_semana?.momento_percebi_sabotando || ''} onChange={e => handleNestedChange('aprendizado_semana', 'momento_percebi_sabotando', e.target.value)} />
                            <Textarea placeholder="O nome que eu dou para a minha semana é..." value={formData.aprendizado_semana?.nome_semana || ''} onChange={e => handleNestedChange('aprendizado_semana', 'nome_semana', e.target.value)} />
                            <Textarea placeholder="Como eu me sinto agora com relação a minha última semana..." value={formData.aprendizado_semana?.relacao_ultima_semana || ''} onChange={e => handleNestedChange('aprendizado_semana', 'relacao_ultima_semana', e.target.value)} />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Desempenho Semanal (de 1 a 5)</CardTitle>
                            <CardDescription>Dê uma nota para cada área do seu desempenho.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Card>
                                <CardHeader><CardTitle className="text-lg">Saúde</CardTitle></CardHeader>
                                <CardContent className="space-y-2">
                                    <RatingRow label="Minha alimentação está de acordo com meus objetivos." value={formData.desempenho_semanal?.saude_alimentacao_objetivos} onChange={v => handleNestedChange('desempenho_semanal', 'saude_alimentacao_objetivos', v)} />
                                    <RatingRow label="Minha recuperação física e emocional está melhor." value={formData.desempenho_semanal?.saude_recuperacao_fisica} onChange={v => handleNestedChange('desempenho_semanal', 'saude_recuperacao_fisica', v)} />
                                    <RatingRow label="Bebi a quantidade de água todos os dias." value={formData.desempenho_semanal?.saude_bebi_agua} onChange={v => handleNestedChange('desempenho_semanal', 'saude_bebi_agua', v)} />
                                    <RatingRow label="Me sinto com mais energia." value={formData.desempenho_semanal?.saude_mais_energia} onChange={v => handleNestedChange('desempenho_semanal', 'saude_mais_energia', v)} />
                                    <RatingRow label="Raspei a língua todos os dias." value={formData.desempenho_semanal?.saude_raspei_lingua} onChange={v => handleNestedChange('desempenho_semanal', 'saude_raspei_lingua', v)} />
                                </CardContent>
                            </Card>
                            
                            <Card>
                                <CardHeader><CardTitle className="text-lg">Presença</CardTitle></CardHeader>
                                <CardContent className="space-y-2">
                                    <RatingRow label="Eu me mantive focado da maneira que planejei." value={formData.desempenho_semanal?.presenca_focado_planejei} onChange={v => handleNestedChange('desempenho_semanal', 'presenca_focado_planejei', v)} />
                                    <RatingRow label="Minhas atitudes foram intencionais." value={formData.desempenho_semanal?.presenca_atitudes_intencionais} onChange={v => handleNestedChange('desempenho_semanal', 'presenca_atitudes_intencionais', v)} />
                                    <RatingRow label="Eu coloquei atenção na alimentação." value={formData.desempenho_semanal?.presenca_atencao_alimentacao} onChange={v => handleNestedChange('desempenho_semanal', 'presenca_atencao_alimentacao', v)} />
                                    <RatingRow label="Eu tive clareza sobre meus objetivos." value={formData.desempenho_semanal?.presenca_clareza_objetivos} onChange={v => handleNestedChange('desempenho_semanal', 'presenca_clareza_objetivos', v)} />
                                    <RatingRow label="Eu mantive a disciplina e consistência nas minhas tarefas." value={formData.desempenho_semanal?.presenca_disciplina_consistencia} onChange={v => handleNestedChange('desempenho_semanal', 'presenca_disciplina_consistencia', v)} />
                                </CardContent>
                            </Card>
                            
                            <Card>
                                <CardHeader><CardTitle className="text-lg">Físico</CardTitle></CardHeader>
                                <CardContent className="space-y-2">
                                    <RatingRow label="Fui na academia esta semana." value={formData.desempenho_semanal?.fisico_fui_academia} onChange={v => handleNestedChange('desempenho_semanal', 'fisico_fui_academia', v)} />
                                    <RatingRow label="Fiz caminhada e dei meu melhor." value={formData.desempenho_semanal?.fisico_caminhada_melhor} onChange={v => handleNestedChange('desempenho_semanal', 'fisico_caminhada_melhor', v)} />
                                    <RatingRow label="Fiz mobilidade todos os dias." value={formData.desempenho_semanal?.fisico_mobilidade} onChange={v => handleNestedChange('desempenho_semanal', 'fisico_mobilidade', v)} />
                                    <RatingRow label="Tive sono de qualidade." value={formData.desempenho_semanal?.fisico_sono_qualidade} onChange={v => handleNestedChange('desempenho_semanal', 'fisico_sono_qualidade', v)} />
                                    <RatingRow label="Meu condicionamento físico aumentou." value={formData.desempenho_semanal?.fisico_condicionamento_aumentou} onChange={v => handleNestedChange('desempenho_semanal', 'fisico_condicionamento_aumentou', v)} />
                                </CardContent>
                            </Card>
                            
                            <Card>
                                <CardHeader><CardTitle className="text-lg">Profissional</CardTitle></CardHeader>
                                <CardContent className="space-y-2">
                                    <RatingRow label="Li um livro sobre minha área." value={formData.desempenho_semanal?.profissional_li_livro} onChange={v => handleNestedChange('desempenho_semanal', 'profissional_li_livro', v)} />
                                    <RatingRow label="Fiz mais que o combinado." value={formData.desempenho_semanal?.profissional_fiz_mais_combinado} onChange={v => handleNestedChange('desempenho_semanal', 'profissional_fiz_mais_combinado', v)} />
                                    <RatingRow label="Ajudei alguém no trabalho." value={formData.desempenho_semanal?.profissional_ajudei_alguem} onChange={v => handleNestedChange('desempenho_semanal', 'profissional_ajudei_alguem', v)} />
                                    <RatingRow label="Melhorei minha comunicação." value={formData.desempenho_semanal?.profissional_melhorei_trabalho} onChange={v => handleNestedChange('desempenho_semanal', 'profissional_melhorei_trabalho', v)} />
                                    <RatingRow label="Assisti um podcast sobre algum tema da minha área." value={formData.desempenho_semanal?.profissional_assisti_podcast} onChange={v => handleNestedChange('desempenho_semanal', 'profissional_assisti_podcast', v)} />
                                </CardContent>
                            </Card>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Objetivos e Ideias para Aplicar na Próxima Semana</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Textarea placeholder="O que você planeja para a próxima semana?" value={formData.objetivos_proxima_semana || ''} onChange={e => setFormData((prev: any) => ({...prev, objetivos_proxima_semana: e.target.value}))} />
                        </CardContent>
                    </Card>

                    <div className="flex justify-end">
                        <Button type="submit" size="lg" className="bg-gradient-to-r from-blue-600 to-green-600 text-white">
                            <Save className="h-5 w-5 mr-2" />
                            Salvar Avaliação
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AvaliacaoSemanal;
