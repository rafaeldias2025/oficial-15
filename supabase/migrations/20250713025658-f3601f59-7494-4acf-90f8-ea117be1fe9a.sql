-- Adicionar novos campos à tabela missao_dia
ALTER TABLE public.missao_dia 
ADD COLUMN liquido_ao_acordar text,
ADD COLUMN pratica_conexao text,
ADD COLUMN energia_ao_acordar integer,
ADD COLUMN sono_horas integer,
ADD COLUMN agua_litros text,
ADD COLUMN atividade_fisica boolean,
ADD COLUMN estresse_nivel integer,
ADD COLUMN fome_emocional boolean,
ADD COLUMN pequena_vitoria text,
ADD COLUMN intencao_para_amanha text,
ADD COLUMN nota_dia integer;