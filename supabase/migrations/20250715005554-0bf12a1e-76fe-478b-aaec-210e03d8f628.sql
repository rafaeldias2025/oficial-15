-- Adicionar campos necessários à tabela sessions
ALTER TABLE public.sessions 
ADD COLUMN video_url TEXT,
ADD COLUMN pdf_url TEXT,
ADD COLUMN wheel_tools TEXT[],
ADD COLUMN estimated_time INTEGER,
ADD COLUMN prerequisites TEXT,
ADD COLUMN category TEXT,
ADD COLUMN send_type TEXT DEFAULT 'immediate',
ADD COLUMN scheduled_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN notification_type TEXT DEFAULT 'immediate';