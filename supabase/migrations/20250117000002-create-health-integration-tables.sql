-- Criar tabela para configuração de integração de saúde
CREATE TABLE public.health_integration_config (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  config JSONB NOT NULL DEFAULT '{
    "appleHealthEnabled": false,
    "googleFitEnabled": false,
    "autoSync": false,
    "syncFrequency": "daily",
    "dataTypes": {
      "weight": true,
      "height": true,
      "bodyComposition": true,
      "activity": false,
      "sleep": false,
      "heartRate": false,
      "bloodPressure": false,
      "nutrition": false
    }
  }',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para registros de dados de saúde
CREATE TABLE public.health_data_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  data_type TEXT NOT NULL CHECK (data_type IN ('weight', 'height', 'body_fat', 'muscle_mass', 'heart_rate', 'blood_pressure', 'steps', 'calories', 'water', 'sleep')),
  value NUMERIC NOT NULL,
  unit TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  source TEXT NOT NULL CHECK (source IN ('apple_health', 'google_fit', 'manual')),
  external_id TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para log de sincronização
CREATE TABLE public.health_sync_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sync_type TEXT NOT NULL CHECK (sync_type IN ('apple_health', 'google_fit', 'manual')),
  records_imported INTEGER NOT NULL DEFAULT 0,
  records_failed INTEGER NOT NULL DEFAULT 0,
  sync_status TEXT NOT NULL CHECK (sync_status IN ('success', 'partial', 'failed')),
  error_message TEXT,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Criar índices para melhor performance
CREATE INDEX idx_health_integration_config_user_id ON public.health_integration_config(user_id);
CREATE INDEX idx_health_data_records_user_id ON public.health_data_records(user_id);
CREATE INDEX idx_health_data_records_timestamp ON public.health_data_records(timestamp);
CREATE INDEX idx_health_data_records_data_type ON public.health_data_records(data_type);
CREATE INDEX idx_health_data_records_source ON public.health_data_records(source);
CREATE INDEX idx_health_data_records_external_id ON public.health_data_records(external_id);
CREATE INDEX idx_health_sync_log_user_id ON public.health_sync_log(user_id);
CREATE INDEX idx_health_sync_log_started_at ON public.health_sync_log(started_at);

-- Criar constraint único para evitar duplicatas
ALTER TABLE public.health_integration_config ADD CONSTRAINT unique_user_config UNIQUE (user_id);
ALTER TABLE public.health_data_records ADD CONSTRAINT unique_external_record UNIQUE (user_id, external_id, source);

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.health_integration_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_data_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_sync_log ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para health_integration_config
CREATE POLICY "Users can view their own health integration config" 
ON public.health_integration_config 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can create their own health integration config" 
ON public.health_integration_config 
FOR INSERT 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own health integration config" 
ON public.health_integration_config 
FOR UPDATE 
USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own health integration config" 
ON public.health_integration_config 
FOR DELETE 
USING (user_id = auth.uid());

-- Políticas RLS para health_data_records
CREATE POLICY "Users can view their own health data records" 
ON public.health_data_records 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can create their own health data records" 
ON public.health_data_records 
FOR INSERT 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own health data records" 
ON public.health_data_records 
FOR UPDATE 
USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own health data records" 
ON public.health_data_records 
FOR DELETE 
USING (user_id = auth.uid());

-- Políticas RLS para health_sync_log
CREATE POLICY "Users can view their own health sync log" 
ON public.health_sync_log 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can create their own health sync log" 
ON public.health_sync_log 
FOR INSERT 
WITH CHECK (user_id = auth.uid());

-- Políticas para admins
CREATE POLICY "Admins can view all health integration config" 
ON public.health_integration_config 
FOR SELECT 
USING (is_admin(auth.uid()));

CREATE POLICY "Admins can view all health data records" 
ON public.health_data_records 
FOR SELECT 
USING (is_admin(auth.uid()));

CREATE POLICY "Admins can view all health sync log" 
ON public.health_sync_log 
FOR SELECT 
USING (is_admin(auth.uid()));

-- Função para atualizar timestamp updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para atualizar updated_at automaticamente
CREATE TRIGGER update_health_integration_config_updated_at
    BEFORE UPDATE ON public.health_integration_config
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_health_data_records_updated_at
    BEFORE UPDATE ON public.health_data_records
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Função para limpar dados antigos (mais de 1 ano)
CREATE OR REPLACE FUNCTION public.cleanup_old_health_data()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM public.health_data_records 
    WHERE timestamp < NOW() - INTERVAL '1 year';
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    DELETE FROM public.health_sync_log 
    WHERE started_at < NOW() - INTERVAL '3 months';
    
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- View para estatísticas de sincronização
CREATE VIEW public.health_sync_stats AS
SELECT 
    user_id,
    sync_type,
    COUNT(*) as total_syncs,
    SUM(records_imported) as total_records_imported,
    SUM(records_failed) as total_records_failed,
    AVG(records_imported) as avg_records_per_sync,
    MAX(started_at) as last_sync_date,
    COUNT(*) FILTER (WHERE sync_status = 'success') as successful_syncs,
    COUNT(*) FILTER (WHERE sync_status = 'failed') as failed_syncs
FROM public.health_sync_log
GROUP BY user_id, sync_type;

-- Habilitar realtime para as tabelas
ALTER PUBLICATION supabase_realtime ADD TABLE public.health_integration_config;
ALTER PUBLICATION supabase_realtime ADD TABLE public.health_data_records;
ALTER PUBLICATION supabase_realtime ADD TABLE public.health_sync_log;

-- Comentários para documentação
COMMENT ON TABLE public.health_integration_config IS 'Configurações de integração com Apple Health e Google Fit por usuário';
COMMENT ON TABLE public.health_data_records IS 'Registros de dados de saúde importados do Apple Health e Google Fit';
COMMENT ON TABLE public.health_sync_log IS 'Log de sincronizações com serviços de saúde externos';
COMMENT ON VIEW public.health_sync_stats IS 'Estatísticas de sincronização por usuário e tipo'; 