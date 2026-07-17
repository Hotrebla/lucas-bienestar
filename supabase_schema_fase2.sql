-- SCHEMA FOR FASE 2: CURRÍCULA DE 50 LECCIONES E IA (VERTEX AI)
-- Ejecuta este script en el SQL Editor de tu proyecto en Supabase para crear las nuevas tablas.

-- 1. Tabla de la Currícula Estructurada (150 lecciones)
CREATE TABLE IF NOT EXISTS public.lessons_curriculum (
  id TEXT PRIMARY KEY, -- ej: 'nutrition_level_1', 'training_level_5'
  category TEXT NOT NULL, -- 'nutrition' | 'training' | 'habits'
  sequence_number INTEGER NOT NULL, -- orden progresivo (1 al 50)
  title TEXT NOT NULL, -- título de la lección
  topic TEXT NOT NULL, -- temas clave detallados que guían a la IA
  difficulty TEXT DEFAULT 'basic' NOT NULL, -- 'basic' | 'intermediate' | 'advanced'
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT unique_category_seq UNIQUE (category, sequence_number)
);

-- 2. Tabla de Caché de Lecciones Generadas por IA
CREATE TABLE IF NOT EXISTS public.generated_lessons (
  lesson_id TEXT PRIMARY KEY REFERENCES public.lessons_curriculum(id) ON DELETE CASCADE,
  slides JSONB NOT NULL, -- Diapositivas generadas [{title, content, illustrationExpression}]
  quiz JSONB NOT NULL, -- Quizzes generados [{question, options, correctAnswer, explanation}]
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Habilitar RLS (Row Level Security)
ALTER TABLE public.lessons_curriculum ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generated_lessons ENABLE ROW LEVEL SECURITY;

-- 4. Crear Políticas de Acceso Público
CREATE POLICY "Permitir lectura pública de currícula" 
  ON public.lessons_curriculum FOR SELECT 
  USING (true);

CREATE POLICY "Permitir lectura pública de lecciones generadas" 
  ON public.generated_lessons FOR SELECT 
  USING (true);

CREATE POLICY "Permitir guardado público de lecciones generadas" 
  ON public.generated_lessons FOR INSERT 
  WITH CHECK (true);
