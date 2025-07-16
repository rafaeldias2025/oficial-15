
import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { format, subDays, isToday } from "date-fns";
import { ptBR } from "date-fns/locale";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Lightbulb, TrendingUp, Droplets, Activity, BedDouble, Weight, Utensils, Info, Check, X, CheckCircle, Sunrise, Sunset } from 'lucide-react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

const humorOptions = [
  { value: "muito_bem", label: "Muito Bem", icon: "😊", score: 5 },
  { value: "bem", label: "Bem", icon: "🙂", score: 4 },
  { value: "neutro", label: "Neutro", icon: "😐", score: 3 },
  { value: "mal", label: "Mal", icon: "😔", score: 2 },
  { value: "muito_mal", label: "Muito Mal", icon: "😢", score: 1 }
];

const getHumorConfig = (humorValue: string) => humorOptions.find(h => h.value === humorValue) || humorOptions[2];

const initialFormState = {
    data: "",
    alimentacao: "", 
    hidratacao: "", 
    atividade_fisica: "", 
    duracao_exercicio: "", 
    humor: "", 
    sono: "", 
    peso: "", 
    observacoes: "",
    bem_estar_matinal: {
        inspiracao: "", descricao_pessoa: "", pessoa_precisa_mim: "",
        tirar_emocional: "", melhor_maneira: "", resultado_evolucao: "",
        lembrete_mentor: "", desafio_crescimento: ""
    },
    resumo_dia: {
        momento_feliz: "", situacao_bem_lidada: "", acao_melhorar_saude: "",
        habito_saudavel: "", evento_grato: ""
    }
};

export default function DiarioSaude() {
    const [entries, setEntries] = useState<any[]>([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isLoading, setIsLoading] = useState(true);

    const selectedEntry = useMemo(() => {
        return entries.find(entry => format(new Date(entry.data), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd'));
    }, [entries, selectedDate]);
    
    const [currentFormData, setCurrentFormData] = useState(initialFormState);

    useEffect(() => {
        // Simulate loading data - replace with actual API calls
        const mockEntries = [
            {
                id: 1,
                data: format(new Date(), 'yyyy-MM-dd'),
                alimentacao: "Café da manhã saudável com frutas",
                hidratacao: 2.5,
                atividade_fisica: "Caminhada",
                duracao_exercicio: 30,
                humor: "bem",
                sono: 8,
                peso: 70.5,
                observacoes: "Dia produtivo",
                bem_estar_matinal: {
                    inspiracao: "Gratidão pela vida",
                    descricao_pessoa: "Determinada",
                    pessoa_precisa_mim: "Minha família",
                    tirar_emocional: "Trabalho excessivo",
                    resultado_evolucao: "Mais energia",
                    lembrete_mentor: "Foque no progresso, não na perfeição",
                    desafio_crescimento: "Meditar 10 minutos"
                },
                resumo_dia: {
                    momento_feliz: "Conversa com amigo",
                    situacao_bem_lidada: "Apresentação no trabalho",
                    acao_melhorar_saude: "Beber mais água",
                    habito_saudavel: "Caminhar pela manhã",
                    evento_grato: "Saúde da família"
                }
            }
        ];
        setEntries(mockEntries);
        setIsLoading(false);
    }, []);
    
    useEffect(() => {
        const baseData = {
            ...initialFormState,
            data: format(selectedDate, 'yyyy-MM-dd'),
        };

        if (selectedEntry) {
            setCurrentFormData({
                ...baseData,
                ...selectedEntry,
                alimentacao: selectedEntry.alimentacao || "",
                hidratacao: selectedEntry.hidratacao !== null ? String(selectedEntry.hidratacao) : "",
                atividade_fisica: selectedEntry.atividade_fisica || "",
                duracao_exercicio: selectedEntry.duracao_exercicio !== null ? String(selectedEntry.duracao_exercicio) : "",
                sono: selectedEntry.sono !== null ? String(selectedEntry.sono) : "",
                peso: selectedEntry.peso !== null ? String(selectedEntry.peso) : "",
                observacoes: selectedEntry.observacoes || "",
                bem_estar_matinal: selectedEntry.bem_estar_matinal || initialFormState.bem_estar_matinal,
                resumo_dia: selectedEntry.resumo_dia || initialFormState.resumo_dia,
            });
        } else {
            setCurrentFormData(baseData);
        }
    }, [selectedEntry, selectedDate]);

    const handleFormChange = (field: string, value: string) => {
        setCurrentFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleNestedFormChange = (section: string, field: string, value: string) => {
        setCurrentFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section as keyof typeof prev] as any,
                [field]: value
            }
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        console.log("Salvando entrada do diário:", currentFormData);
        // Here you would save to your backend/database
        alert("Entrada do diário salva com sucesso!");
    };
    
    const chartData = useMemo(() => {
        const last7Days = Array.from({ length: 7 }).map((_, i) => subDays(new Date(), i)).reverse();
        return last7Days.map(date => {
            const entry = entries.find(e => format(new Date(e.data), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd'));
            const humorConfig = entry ? getHumorConfig(entry.humor) : null;
            return {
                date: format(date, 'dd/MM'),
                Peso: entry?.peso,
                Sono: entry?.sono,
                Humor: humorConfig?.score,
            };
        });
    }, [entries]);

    const motivationalMessage = "Continue registrando para receber insights personalizados!";

    if (isLoading) return <div className="p-6">Carregando...</div>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-6">
            <div className="max-w-7xl mx-auto">
                <Card className="mb-6 bg-blue-50 border-blue-200">
                    <CardContent className="p-4 flex items-center gap-4">
                        <Lightbulb className="w-8 h-8 text-blue-600"/>
                        <div>
                            <h3 className="font-semibold text-blue-800">Dica do Dia</h3>
                            <p className="text-sm text-blue-700">{motivationalMessage}</p>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1 space-y-6">
                        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                            <CardHeader>
                                <CardTitle>Selecione a Data</CardTitle>
                                <CardDescription>Veja ou preencha o diário de um dia específico.</CardDescription>
                            </CardHeader>
                            <CardContent className="flex justify-center">
                                <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} locale={ptBR} disabled={(date) => date > new Date()} className="pointer-events-auto" />
                            </CardContent>
                        </Card>

                        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                            <CardHeader><CardTitle className="flex items-center"><TrendingUp className="mr-2"/>Evolução da Semana</CardTitle></CardHeader>
                            <CardContent>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={chartData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="date" />
                                            <YAxis yAxisId="left" />
                                            <YAxis yAxisId="right" orientation="right" />
                                            <Tooltip />
                                            <Legend />
                                            <Line yAxisId="left" type="monotone" dataKey="Peso" stroke="#8884d8" />
                                            <Line yAxisId="left" type="monotone" dataKey="Sono" stroke="#82ca9d" />
                                            <Line yAxisId="right" type="monotone" dataKey="Humor" stroke="#ffc658" />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>

                    </div>
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                            <CardHeader>
                                <CardTitle>Registro do Dia: {format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <Accordion type="multiple" defaultValue={['item-1', 'item-2', 'item-3']} className="w-full">
                                        <AccordionItem value="item-1">
                                            <AccordionTrigger className="font-semibold text-lg"><Sunrise className="mr-2" /> Bem-Estar Matinal</AccordionTrigger>
                                            <AccordionContent className="space-y-4 pt-4">
                                                <div className="space-y-2">
                                                    <Label>O que me inspira hoje?</Label>
                                                    <Textarea value={currentFormData.bem_estar_matinal.inspiracao} onChange={e => handleNestedFormChange('bem_estar_matinal', 'inspiracao', e.target.value)} />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Se eu pudesse descrever em uma palavra o tipo de pessoa que eu queria ser hoje, eu escolho?</Label>
                                                    <Input value={currentFormData.bem_estar_matinal.descricao_pessoa} onChange={e => handleNestedFormChange('bem_estar_matinal', 'descricao_pessoa', e.target.value)} />
                                                </div>
                                                 <div className="space-y-2">
                                                    <Label>A pessoa que mais precisa de mim hoje é?</Label>
                                                    <Input value={currentFormData.bem_estar_matinal.pessoa_precisa_mim} onChange={e => handleNestedFormChange('bem_estar_matinal', 'pessoa_precisa_mim', e.target.value)} />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>O que poderia tirar meu emocional hoje? E a melhor maneira de isso não acontecer é?</Label>
                                                    <Textarea value={currentFormData.bem_estar_matinal.tirar_emocional} onChange={e => handleNestedFormChange('bem_estar_matinal', 'tirar_emocional', e.target.value)} />
                                                </div>
                                                 <div className="space-y-2">
                                                    <Label>Um resultado que mostra que eu estou evoluindo?</Label>
                                                    <Input value={currentFormData.bem_estar_matinal.resultado_evolucao} onChange={e => handleNestedFormChange('bem_estar_matinal', 'resultado_evolucao', e.target.value)} />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Se eu fosse meu mentor o que diria para eu me lembrar de?</Label>
                                                    <Textarea value={currentFormData.bem_estar_matinal.lembrete_mentor} onChange={e => handleNestedFormChange('bem_estar_matinal', 'lembrete_mentor', e.target.value)} />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Qual desafio fora da minha zona de conforto vou enfrentar hoje para promover meu crescimento?</Label>
                                                    <Input value={currentFormData.bem_estar_matinal.desafio_crescimento} onChange={e => handleNestedFormChange('bem_estar_matinal', 'desafio_crescimento', e.target.value)} />
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                        <AccordionItem value="item-2">
                                            <AccordionTrigger className="font-semibold text-lg"><Activity className="mr-2" /> Saúde e Corpo</AccordionTrigger>
                                            <AccordionContent className="space-y-4 pt-4">
                                                <div className="grid md:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="alimentacao"><Utensils className="inline-block mr-2 w-4 h-4"/>Alimentação</Label>
                                                        <Textarea id="alimentacao" value={currentFormData.alimentacao || ''} onChange={e => handleFormChange('alimentacao', e.target.value)} placeholder="O que você comeu hoje?" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="observacoes">Observações</Label>
                                                        <Textarea id="observacoes" value={currentFormData.observacoes || ''} onChange={e => handleFormChange('observacoes', e.target.value)} placeholder="Como se sentiu, algo diferente?"/>
                                                    </div>
                                                </div>
                                                <div className="grid md:grid-cols-3 gap-4">
                                                    <div className="space-y-2"><Label htmlFor="hidratacao"><Droplets className="inline-block mr-2 w-4 h-4"/>Hidratação (L)</Label><Input id="hidratacao" type="number" step="0.1" value={currentFormData.hidratacao} onChange={e => handleFormChange('hidratacao', e.target.value)} placeholder="2.5" /></div>
                                                    <div className="space-y-2"><Label htmlFor="sono"><BedDouble className="inline-block mr-2 w-4 h-4"/>Sono (h)</Label><Input id="sono" type="number" step="0.5" value={currentFormData.sono} onChange={e => handleFormChange('sono', e.target.value)} placeholder="8" /></div>
                                                    <div className="space-y-2"><Label htmlFor="peso"><Weight className="inline-block mr-2 w-4 h-4"/>Peso (kg)</Label><Input id="peso" type="number" step="0.1" value={currentFormData.peso} onChange={e => handleFormChange('peso', e.target.value)} placeholder="70.5" /></div>
                                                </div>
                                                <div className="grid md:grid-cols-2 gap-4">
                                                    <div className="space-y-2"><Label htmlFor="atividade_fisica"><Activity className="inline-block mr-2 w-4 h-4"/>Atividade Física</Label><Input id="atividade_fisica" value={currentFormData.atividade_fisica || ''} onChange={e => handleFormChange('atividade_fisica', e.target.value)} placeholder="Caminhada, musculação..." /></div>
                                                    <div className="space-y-2"><Label htmlFor="duracao_exercicio">Duração (min)</Label><Input id="duracao_exercicio" type="number" value={currentFormData.duracao_exercicio} onChange={e => handleFormChange('duracao_exercicio', e.target.value)} placeholder="30" /></div>
                                                </div>
                                                <div>
                                                    <Label>Como você se sentiu hoje?</Label>
                                                    <div className="flex flex-wrap gap-2 mt-2">
                                                        {humorOptions.map(opt => <Button key={opt.value} type="button" variant={currentFormData.humor === opt.value ? 'default' : 'outline'} onClick={() => handleFormChange('humor', opt.value)}>{opt.icon} {opt.label}</Button>)}
                                                    </div>
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                        <AccordionItem value="item-3">
                                            <AccordionTrigger className="font-semibold text-lg"><Sunset className="mr-2" /> Resumo do Dia</AccordionTrigger>
                                            <AccordionContent className="space-y-4 pt-4">
                                                <div className="space-y-2">
                                                    <Label>Um momento que realmente me deixou feliz no dia de hoje foi:</Label>
                                                    <Textarea value={currentFormData.resumo_dia.momento_feliz} onChange={e => handleNestedFormChange('resumo_dia', 'momento_feliz', e.target.value)} />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>A situação ou tarefa que lidei bem hoje foi:</Label>
                                                    <Textarea value={currentFormData.resumo_dia.situacao_bem_lidada} onChange={e => handleNestedFormChange('resumo_dia', 'situacao_bem_lidada', e.target.value)} />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Qual foi uma ação que eu tomei hoje para melhorar a minha saúde?</Label>
                                                    <Textarea value={currentFormData.resumo_dia.acao_melhorar_saude} onChange={e => handleNestedFormChange('resumo_dia', 'acao_melhorar_saude', e.target.value)} />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Qual hábito saudável pratiquei hoje?</Label>
                                                    <Textarea value={currentFormData.resumo_dia.habito_saudavel} onChange={e => handleNestedFormChange('resumo_dia', 'habito_saudavel', e.target.value)} />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Qual evento + significativo pelo qual sou grato(a) hoje e por quê?</Label>
                                                    <Textarea value={currentFormData.resumo_dia.evento_grato} onChange={e => handleNestedFormChange('resumo_dia', 'evento_grato', e.target.value)} />
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    </Accordion>
                                    
                                    <div className="flex justify-end pt-4">
                                        <Button type="submit" className="bg-gradient-to-r from-blue-600 to-green-600 text-white">{selectedEntry ? 'Atualizar Registro' : 'Salvar Registro'}</Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
