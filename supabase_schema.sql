-- SCHEMA FOR LUCAS - BIENESTAR GAMIFICADO & EDUCATIVO
-- Ejecuta este script en el SQL Editor de tu proyecto en Supabase.

-- 1. Tabla de Perfiles de Gamificación
CREATE TABLE IF NOT EXISTS public.gamification_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email TEXT UNIQUE NOT NULL,
  user_name TEXT NOT NULL,
  xp INTEGER DEFAULT 0 NOT NULL,
  level INTEGER DEFAULT 1 NOT NULL,
  current_streak INTEGER DEFAULT 0 NOT NULL,
  max_streak INTEGER DEFAULT 0 NOT NULL,
  last_active DATE,
  hearts INTEGER DEFAULT 5 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Tabla de Historial de Lecciones Completadas
CREATE TABLE IF NOT EXISTS public.user_lessons_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email TEXT NOT NULL,
  category TEXT NOT NULL, -- 'nutrition', 'training', 'habits'
  lesson_id TEXT NOT NULL, -- ej: 'nutrition_macros'
  xp_gained INTEGER NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT fk_user FOREIGN KEY(user_email) REFERENCES public.gamification_profiles(user_email) ON DELETE CASCADE
);

-- 3. Habilitar RLS (Row Level Security) - Opcional para simplicidad en MVP, pero recomendado
ALTER TABLE public.gamification_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_lessons_history ENABLE ROW LEVEL SECURITY;

-- 4. Crear Políticas de Acceso Público para el MVP (acceso mediante el Anon Key)
-- Nota: En producción, puedes vincular estas tablas a auth.users para máxima seguridad.
CREATE POLICY "Permitir lectura pública de perfiles" 
  ON public.gamification_profiles FOR SELECT 
  USING (true);

CREATE POLICY "Permitir inserción pública de perfiles" 
  ON public.gamification_profiles FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Permitir actualización pública de perfiles" 
  ON public.gamification_profiles FOR UPDATE 
  USING (true);

CREATE POLICY "Permitir lectura pública de historial" 
  ON public.user_lessons_history FOR SELECT 
  USING (true);

CREATE POLICY "Permitir inserción pública de historial" 
  ON public.user_lessons_history FOR INSERT 
  WITH CHECK (true);
