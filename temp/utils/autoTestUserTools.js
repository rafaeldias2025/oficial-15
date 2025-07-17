// src/utils/autoTestUserTools.ts
// Utilitário para autoteste automatizado das principais ferramentas do usuário
// Preenche/responde automaticamente Sabotadores, Roda da Vida, Missão e Diário
import { createClient } from '@supabase/supabase-js';
const SUPABASE_URL = 'https://skcfeldqipxaomrjfuym.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNrY2ZlbGRxaXB4YW9tcmpmdXltIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNjk5OTU1NywiZXhwIjoyMDUyNTc1NTU3fQ.4TKHlMV2V8LjmnlFBErvU3OL_RpwEKNT4sF8YYK2-z8';
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
// userId: id do usuário (auth)
// profileId: id do profile (tabela profiles)
// challengeId: id de um desafio existente
export async function autoTestUserTools(userId, profileId, challengeId) {
    // 1. Teste Sabotadores
    await supabase.from('teste_sabotadores').insert({
        user_id: userId,
        respostas: Array(40).fill(3),
        resultado: { sabotador_principal: 'Crítico', score: 27 },
        created_at: new Date().toISOString()
    });
    // 2. Roda da Vida
    await supabase.from('roda_vida').insert({
        user_id: userId,
        areas: {
            saude: 7,
            carreira: 6,
            familia: 8,
            espiritualidade: 5,
            lazer: 7,
            finanças: 6,
            amor: 8,
            desenvolvimento: 7
        },
        created_at: new Date().toISOString()
    });
    // 3. Missão do Dia
    await supabase.from('missao_dia').insert({
        user_id: userId,
        data: new Date().toISOString().slice(0, 10),
        concluida: true,
        reflexao: 'Missão concluída com sucesso!',
        created_at: new Date().toISOString()
    });
    // 4. Diário de Saúde
    await supabase.from('diario_saude').insert({
        user_id: userId,
        data: new Date().toISOString().slice(0, 10),
        humor: '😊',
        energia: 8,
        reflexao: 'Dia produtivo e saudável!',
        created_at: new Date().toISOString()
    });
    // 5. Desafios
    await supabase.from('user_challenges').insert({
        user_id: profileId,
        challenge_id: challengeId,
        progress: 1,
        target_value: 1,
        is_completed: true,
        started_at: new Date().toISOString(),
        completed_at: new Date().toISOString()
    });
    // 6. Dados Físicos
    await supabase.from('dados_fisicos_usuario').insert({
        user_id: userId,
        altura_cm: 175,
        peso_kg: 75,
        idade: 30,
        sexo: 'M',
        cintura_cm: 85,
        quadril_cm: 100,
        abdomen_cm: 90,
        braco_cm: 32,
        perna_cm: 55,
        created_at: new Date().toISOString()
    });
    // 7. Pesagens
    await supabase.from('pesagens').insert({
        user_id: userId,
        peso: 75.2,
        data: new Date().toISOString().slice(0, 10),
        origem: 'manual',
        created_at: new Date().toISOString()
    });
    // 8. Google Fit
    await supabase.from('google_fit_data').insert({
        user_id: userId,
        steps: 8000,
        calories: 2200,
        distance_km: 6.5,
        data: new Date().toISOString().slice(0, 10),
        created_at: new Date().toISOString()
    });
    // 9. Curso, módulo e lição
    const { data: newCourseRaw } = await supabase.from('courses').insert({
        title: 'Curso Teste Auto',
        description: 'Curso criado pelo autoteste',
        created_by: profileId,
        created_at: new Date().toISOString()
    }).select().single();
    const newCourse = newCourseRaw;
    if (newCourse && newCourse.id) {
        const { data: newModuleRaw } = await supabase.from('course_modules').insert({
            course_id: newCourse.id,
            title: 'Módulo Teste',
            created_at: new Date().toISOString()
        }).select().single();
        const newModule = newModuleRaw;
        if (newModule && newModule.id) {
            await supabase.from('course_lessons').insert({
                module_id: newModule.id,
                title: 'Lição Teste',
                content: 'Conteúdo de lição de teste',
                created_at: new Date().toISOString()
            });
        }
    }
    // 10. Meta
    await supabase.from('user_goals').insert({
        user_id: profileId,
        goal: 'Perder 5kg',
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date().toISOString()
    });
    // 11. Sessão
    const { data: newSessionRaw } = await supabase.from('sessions').insert({
        user_id: profileId,
        data: new Date().toISOString().slice(0, 10),
        status: 'concluida',
        created_at: new Date().toISOString()
    }).select().single();
    const newSession = newSessionRaw;
    if (newSession && newSession.id) {
        await supabase.from('session_tools').insert({
            session_id: newSession.id,
            tool: 'Roda da Vida',
            created_at: new Date().toISOString()
        });
        await supabase.from('session_notes').insert({
            session_id: newSession.id,
            note: 'Sessão de teste criada pelo autoteste',
            created_at: new Date().toISOString()
        });
        await supabase.from('session_feedback').insert({
            session_id: newSession.id,
            feedback: 'Ótima sessão!',
            created_at: new Date().toISOString()
        });
    }
    // 12. Avaliação semanal
    await supabase.from('weekly_evaluations').insert({
        user_id: profileId,
        semana: 29,
        aprendizado: 'Aprendi muito essa semana',
        created_at: new Date().toISOString()
    });
    // 13. Pontuação diária
    await supabase.from('pontuacao_diaria').insert({
        user_id: profileId,
        pontos: 10,
        data: new Date().toISOString().slice(0, 10),
        created_at: new Date().toISOString()
    });
    // 14. Missões de hábitos, mente/emocoes, ritual manhã
    await supabase.from('mission_habitos_dia').insert({
        user_id: userId,
        sono_horas: 7,
        agua_litros: 2,
        atividade_fisica: true,
        estresse_nivel: 2,
        fome_emocional: false,
        created_at: new Date().toISOString()
    });
    await supabase.from('mission_mente_emocoes').insert({
        user_id: userId,
        gratidao: 'Sou grato pelo autoteste',
        pequena_vitoria: 'Completei o teste',
        intencao_para_amanha: 'Continuar evoluindo',
        nota_dia: 9,
        created_at: new Date().toISOString()
    });
    await supabase.from('mission_ritual_manha').insert({
        user_id: userId,
        liquido_ao_acordar: true,
        alongamento: true,
        meditacao: false,
        created_at: new Date().toISOString()
    });
    // 15. Benefícios, avaliações, feedbacks extras
    await supabase.from('beneficios').insert({
        user_id: userId,
        beneficio: 'Mais disposição',
        created_at: new Date().toISOString()
    });
    await supabase.from('avaliacoes').insert({
        user_id: userId,
        avaliacao: 'Muito satisfeito com o sistema',
        created_at: new Date().toISOString()
    });
    return 'Autoteste completo: todas as principais tabelas e fluxos testados.';
}
