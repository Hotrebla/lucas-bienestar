import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

// Types
export type Category = 'nutrition' | 'training' | 'habits';

export interface Slide {
  title: string;
  content: string;
  illustrationRole: 'chef' | 'coach' | 'zen' | 'motivator';
  illustrationExpression?: 'default' | 'happy' | 'sad' | 'thinking' | 'excited';
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  category: Category;
  xpReward: number;
  slides: Slide[];
  quiz: Question[];
}

export interface UserProfile {
  email: string;
  name: string;
  xp: number;
  level: number;
  hearts: number;
  currentStreak: number;
  maxStreak: number;
  lastActive: string | null;
  history: Record<string, boolean>; // e.g. { 'nutrition_1': true }
}

interface GameContextType {
  user: UserProfile | null;
  lessons: Lesson[];
  activeTab: 'learn' | 'profile' | 'elite';
  currentLesson: Lesson | null;
  activeCategory: Category | null;
  loadingLesson: boolean;
  login: (name: string, email: string) => Promise<void>;
  logout: () => void;
  startLesson: (lessonId: string) => Promise<void>;
  exitLesson: () => void;
  completeLesson: (lessonId: string, heartsRemaining: number) => Promise<void>;
  loseHeart: () => Promise<void>;
  refillHearts: () => Promise<void>;
  setTab: (tab: 'learn' | 'profile' | 'elite') => void;
  setActiveCategory: (category: Category | null) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

// Helper to generate rich educational fallback lessons when offline or fallback is triggered
const generateSmartLocalLesson = (lessonShell: Lesson): { slides: Slide[]; quiz: Question[] } => {
  const titleLower = lessonShell.title.toLowerCase();
  const category = lessonShell.category;

  // Topic specific overrides
  if (titleLower.includes('fuerza') || titleLower.includes('cardio')) {
    return {
      slides: [
        {
          title: "Fuerza vs Cardio: El Equipo Perfecto 🏋️‍♂️🏃‍♂️",
          content: "El entrenamiento de fuerza desarrolla masa muscular y eleva tu metabolismo basal en reposo, mientras que el cardio fortalece tu corazón y tu resistencia pulmonar. ¡Ambos son indispensables y se complementan!",
          illustrationRole: 'coach',
          illustrationExpression: 'excited'
        },
        {
          title: "La Clave de Combinarlos 💡",
          content: "Combinar ejercicios de fuerza con sesiones de cardio evita la pérdida muscular, mejora la sensibilidad a la insulina y optimiza tu salud cardiovascular integral.",
          illustrationRole: 'coach',
          illustrationExpression: 'happy'
        }
      ],
      quiz: [
        {
          id: `q_${lessonShell.id}_1`,
          question: "¿Cuál es el beneficio clave del entrenamiento de fuerza frente al cardio?",
          options: [
            "Desarrollar masa muscular y elevar el metabolismo en reposo",
            "Servir únicamente para sudar durante la sesión",
            "No produce ningún cambio metabólico"
          ],
          correctAnswer: 0,
          explanation: "¡Exacto! Desarrollar músculo aumenta tu consumo calórico diario incluso cuando estás en reposo."
        },
        {
          id: `q_${lessonShell.id}_2`,
          question: "¿Por qué es ideal integrar fuerza y cardio en tu rutina?",
          options: [
            "Porque optimizan tanto la masa muscular como la salud del corazón",
            "Porque debes entrenar obligatoriamente 4 horas al día",
            "Solo el cardio es importante para estar saludable"
          ],
          correctAnswer: 0,
          explanation: "¡Así se hace! La sinergia entre fuerza y cardio crea una condición física completa y sostenible."
        }
      ]
    };
  }

  // Category based smart templates for any topic
  if (category === 'nutrition') {
    return {
      slides: [
        {
          title: `Nutrición Inteligente: ${lessonShell.title} 🥗`,
          content: `Comprender los conceptos de ${lessonShell.title} te permite elegir alimentos con alta densidad nutricional para mantener tu energía constante y alimentar tus células.`,
          illustrationRole: 'chef',
          illustrationExpression: 'happy'
        },
        {
          title: "Principio Científico de Nutrición 🔬",
          content: `La clave de una buena alimentación no es restringir comida ni pasar hambre, sino balancear los macronutrientes esenciales y priorizar ingredientes naturales.`,
          illustrationRole: 'chef',
          illustrationExpression: 'default'
        }
      ],
      quiz: [
        {
          id: `q_${lessonShell.id}_1`,
          question: `¿Cuál es el beneficio principal de estudiar ${lessonShell.title}?`,
          options: [
            "Tomar decisiones informadas para seleccionar alimentos nutritivos",
            "Contar calorías obsesivamente sin importar la calidad del alimento",
            "Eliminar por completo todos los alimentos que me gustan"
          ],
          correctAnswer: 0,
          explanation: `¡Correcto! Entender ${lessonShell.title} nos ayuda a nutrir nuestro cuerpo con alimentos reales de alta calidad.`
        },
        {
          id: `q_${lessonShell.id}_2`,
          question: "¿Cuál es el pilar de una nutrición saludable según Lucas Chef?",
          options: [
            "Priorizar alimentos naturales y balancear los macronutrientes",
            "Hacer dietas extremas y pasar hambre todo el día",
            "Depender solo de suplementos sintéticos"
          ],
          correctAnswer: 0,
          explanation: "¡Exacto! El equilibrio de alimentos reales es la estrategia más efectiva y duradera."
        }
      ]
    };
  }

  if (category === 'training') {
    return {
      slides: [
        {
          title: `Principios de Entrenamiento: ${lessonShell.title} 🏋️‍♂️`,
          content: `Al trabajar en ${lessonShell.title}, estimulas tus fibras musculares y adaptas tu sistema nervioso para ganar fuerza, agilidad y resistencia física.`,
          illustrationRole: 'coach',
          illustrationExpression: 'excited'
        },
        {
          title: "Sobrecarga Progresiva y Descanso 📊",
          content: `El tejido muscular se reconstruye durante la recuperación. Asegura buena técnica, sobrecarga progresiva y un descanso reparador.`,
          illustrationRole: 'coach',
          illustrationExpression: 'default'
        }
      ],
      quiz: [
        {
          id: `q_${lessonShell.id}_1`,
          question: `¿Cuál es el propósito de practicar ${lessonShell.title}?`,
          options: [
            "Mejorar el rendimiento físico y estimular la adaptación muscular",
            "Entrenar sin importar el dolor ni la técnica de ejecución",
            "Solo sirve para cansarse sin obtener resultados"
          ],
          correctAnswer: 0,
          explanation: `¡Muy bien! Aplicar correctamente ${lessonShell.title} estimula el progreso muscular de forma segura.`
        },
        {
          id: `q_${lessonShell.id}_2`,
          question: "¿En qué momento ocurre principalmente la recuperación muscular?",
          options: [
            "Durante el descanso adecuado y la nutrición post-entreno",
            "Únicamente durante los minutos en los que levantamos peso",
            "El músculo no necesita tiempo de descanso"
          ],
          correctAnswer: 0,
          explanation: "¡Eso es! El descanso y los nutrientes son los verdaderos constructores del tejido muscular."
        }
      ]
    };
  }

  // Habits category
  return {
    slides: [
      {
        title: `Hábitos Saludables: ${lessonShell.title} 🧘‍♂️`,
        content: `Crear constancia con ${lessonShell.title} reduce tu fatiga mental. Los pequeños hábitos diarios acumulados generan resultados extraordinarios a largo plazo.`,
        illustrationRole: 'zen',
        illustrationExpression: 'happy'
      },
      {
        title: "La Regla del 1% Diario 💡",
        content: `No busques cambiar toda tu vida en un día. Enfócate en mejorar un 1% cada día y simplificar tu entorno para facilitar tus decisiones positivas.`,
        illustrationRole: 'zen',
        illustrationExpression: 'default'
      }
    ],
    quiz: [
      {
        id: `q_${lessonShell.id}_1`,
        question: `¿Por qué es importante cultivar hábitos alrededor de ${lessonShell.title}?`,
        options: [
          "Porque la constancia diaria genera grandes transformaciones sin agotarte",
          "Porque requiere un esfuerzo monumental imposible de mantener",
          "Los hábitos no influyen en el estilo de vida"
        ],
        correctAnswer: 0,
        explanation: `¡Así se hace! La consistencia en pequeñas acciones con ${lessonShell.title} transforma tu calidad de vida.`
      },
      {
        id: `q_${lessonShell.id}_2`,
        question: "¿Cuál es el consejo principal de Lucas Zen para formar nuevos hábitos?",
        options: [
          "Avanzar con la regla del 1% diario y mantener la constancia",
          "Exigirte resultados inmediatos desde el primer día",
          "Rendirte si un día no cumples con la meta"
        ],
        correctAnswer: 0,
        explanation: "¡Exacto! El progreso continuo del 1% diario vence a la motivación temporal."
      }
    ]
  };
};

// Helper to programmatically generate 150 offline/demo lesson shells
const generateOfflineShells = (): Lesson[] => {
  const categories: Category[] = ['nutrition', 'training', 'habits'];
  const titles = {
    nutrition: [
      'Macronutrientes', 'Proteínas', 'Carbohidratos', 'Grasas', 'Fibra', 
      'Agua', 'Vitaminas', 'Minerales', 'Calorías', 'Metabolismo', 
      'Ingredientes', 'Porciones', 'Azúcares', 'Trans', 'Sodio', 
      'Comida Real', 'Aceites', 'Edulcorantes', 'Compras', 'Plato', 
      'Mano', 'Restaurantes', 'Snacks', 'Hambre', 'Masticación'
    ],
    training: [
      'Fuerza vs Cardio', 'Hipertrofia', 'RIR', 'Calentamiento', 'Sobrecarga', 
      'Frecuencia', 'Descansos', 'ROM', 'Conexión', 'Agujetas', 
      'Sentadilla', 'Peso Muerto', 'Flexiones', 'Remo', 'Planchas', 
      'Zancadas', 'Hombros', 'Pectoral', 'Laterales', 'Bíceps'
    ],
    habits: [
      'Hábitos', 'Atómicos', 'Entorno', 'Asociación', 'Consistencia', 
      'Regla 2 Min', 'Recompensa', 'Registro', 'Voluntad', 'Identidad', 
      'Hambre Emocional', 'Culpa', 'Mindful eating', 'Regla 5 Min', 'Sueño'
    ]
  };

  const list: Lesson[] = [];
  categories.forEach((cat) => {
    const listTitles = titles[cat];
    for (let i = 1; i <= 50; i++) {
      const title = listTitles[(i - 1) % listTitles.length] + ` (Nivel ${i})`;
      list.push({
        id: `${cat}_level_${i}`,
        title,
        description: `Tema de aprendizaje del nivel ${i} para la ruta de ${cat}.`,
        category: cat,
        xpReward: i <= 10 ? 20 : i <= 30 ? 25 : 30,
        slides: [],
        quiz: []
      });
    }
  });
  return list;
};

const OFFLINE_LESSONS = generateOfflineShells();

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('lucas_user_profile');
    return saved ? JSON.parse(saved) : null;
  });
  const [lessons, setLessons] = useState<Lesson[]>(OFFLINE_LESSONS);
  const [activeTab, setTab] = useState<'learn' | 'profile' | 'elite'>('learn');
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [loadingLesson, setLoadingLesson] = useState(false);

  // Sync to local storage for offline fallback
  useEffect(() => {
    if (user) {
      localStorage.setItem('lucas_user_profile', JSON.stringify(user));
    } else {
      localStorage.removeItem('lucas_user_profile');
    }
  }, [user]);

  // Load curriculum from Supabase when user logs in or mounts
  const loadCurriculum = async () => {
    if (!isSupabaseConfigured()) {
      setLessons(OFFLINE_LESSONS);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('lessons_curriculum')
        .select('*')
        .order('sequence_number', { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) {
        const mapped: Lesson[] = data.map((row) => ({
          id: row.id,
          title: row.title,
          description: row.topic,
          category: row.category as Category,
          xpReward: row.difficulty === 'advanced' ? 30 : row.difficulty === 'intermediate' ? 25 : 20,
          slides: [],
          quiz: []
        }));
        setLessons(mapped);
      } else {
        setLessons(OFFLINE_LESSONS);
      }
    } catch (e) {
      console.error('Error cargando currícula de Supabase, usando local:', e);
      setLessons(OFFLINE_LESSONS);
    }
  };

  // Trigger curriculum load on user state change
  useEffect(() => {
    if (user) {
      loadCurriculum();
    }
  }, [user]);

  // Helper to check if Supabase is properly configured in the client
  const isSupabaseConfigured = () => {
    return !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);
  };

  // Login handler with Supabase integration and offline fallback
  const login = async (name: string, email: string) => {
    const todayStr = new Date().toISOString().split('T')[0];
    
    // Default fallback local profile
    const defaultProfile: UserProfile = {
      email,
      name: name || 'Aventurero',
      xp: 0,
      level: 1,
      hearts: 5,
      currentStreak: 1,
      maxStreak: 1,
      lastActive: todayStr,
      history: {},
    };

    if (!isSupabaseConfigured()) {
      setUser(defaultProfile);
      return;
    }

    try {
      // 1. Fetch user profile from Supabase
      const { data: profile, error } = await supabase
        .from('gamification_profiles')
        .select('*')
        .eq('user_email', email)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching Supabase profile:', error.message);
        setUser(defaultProfile);
        return;
      }

      if (profile) {
        // Fetch lesson completion history
        const { data: historyData, error: historyError } = await supabase
          .from('user_lessons_history')
          .select('lesson_id')
          .eq('user_email', email);

        if (historyError) {
          console.error('Error fetching lesson history:', historyError.message);
        }

        const historyObj: Record<string, boolean> = {};
        if (historyData) {
          historyData.forEach((row) => {
            historyObj[row.lesson_id] = true;
          });
        }

        // Handle daily streaks
        let currentStreak = profile.current_streak;
        let maxStreak = profile.max_streak;
        const lastActive = profile.last_active;

        if (lastActive !== todayStr) {
          if (lastActive) {
            const lastActiveDate = new Date(lastActive);
            const todayDate = new Date(todayStr);
            const diffTime = Math.abs(todayDate.getTime() - lastActiveDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 1) {
              currentStreak += 1;
            } else if (diffDays > 1) {
              currentStreak = 1;
            }
          } else {
            currentStreak = 1;
          }

          if (currentStreak > maxStreak) {
            maxStreak = currentStreak;
          }

          // Update streak in DB
          await supabase
            .from('gamification_profiles')
            .update({
              current_streak: currentStreak,
              max_streak: maxStreak,
              last_active: todayStr,
            })
            .eq('user_email', email);
        }

        setUser({
          email: profile.user_email,
          name: profile.user_name,
          xp: profile.xp,
          level: profile.level,
          hearts: profile.hearts,
          currentStreak,
          maxStreak,
          lastActive: todayStr,
          history: historyObj,
        });
      } else {
        // Profile does not exist, insert a new one
        const { data: newProfile, error: createError } = await supabase
          .from('gamification_profiles')
          .insert({
            user_email: email,
            user_name: name || 'Aventurero',
            xp: 0,
            level: 1,
            hearts: 5,
            current_streak: 1,
            max_streak: 1,
            last_active: todayStr,
          })
          .select()
          .single();

        if (createError) {
          console.error('Error creating profile in Supabase:', createError.message);
          setUser(defaultProfile);
        } else if (newProfile) {
          setUser({
            email: newProfile.user_email,
            name: newProfile.user_name,
            xp: newProfile.xp,
            level: newProfile.level,
            hearts: newProfile.hearts,
            currentStreak: newProfile.current_streak,
            maxStreak: newProfile.max_streak,
            lastActive: newProfile.last_active,
            history: {},
          });
        }
      }
    } catch (e) {
      console.error('Supabase connection failed, using local fallback:', e);
      setUser(defaultProfile);
    }
  };

  // Logout handler
  const logout = () => {
    setUser(null);
    setCurrentLesson(null);
    setTab('learn');
  };

  // Start lesson - Dynamic generator with cache database support
  const startLesson = async (lessonId: string) => {
    if (!user) return;
    if (user.hearts <= 0) {
      setTab('elite');
      return;
    }

    setLoadingLesson(true);
    try {
      const lessonShell = lessons.find((l) => l.id === lessonId);
      if (!lessonShell) return;

      // 1. If slides/quiz already cached in React state memory, load immediately
      if (lessonShell.slides.length > 0) {
        setCurrentLesson(lessonShell);
        setLoadingLesson(false);
        return;
      }

      // 2. Fetch from generated_lessons table in Supabase
      if (isSupabaseConfigured()) {
        const { data: cached, error } = await supabase
          .from('generated_lessons')
          .select('slides, quiz')
          .eq('lesson_id', lessonId)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching cached lesson:', error.message);
        }

        if (cached) {
          const fullLesson: Lesson = {
            ...lessonShell,
            slides: cached.slides,
            quiz: cached.quiz,
          };
          // Save in memory
          setLessons((prev) => prev.map((l) => (l.id === lessonId ? fullLesson : l)));
          setCurrentLesson(fullLesson);
          setLoadingLesson(false);
          return;
        }
      }

      // 3. If not cached, invoke Supabase Edge Function to call Vertex AI (Gemini 3.5 Flash)
      // Retrieve prompt/topic details from lessons list
      const topic = lessonShell.description;
      const category = lessonShell.category;
      
      // Calculate difficulty based on index or sequence number
      const seqNum = parseInt(lessonId.split('_level_')[1]) || 1;
      const difficulty = seqNum <= 10 ? 'basic' : seqNum <= 30 ? 'intermediate' : 'advanced';

      try {
        const functionResponse = await supabase.functions.invoke('vertex-ai', {
          body: {
            lessonId,
            topic,
            category,
            difficulty,
          },
        });

        const generated = functionResponse.data;
        if (generated && generated.slides && generated.quiz) {
          const fullLesson: Lesson = {
            ...lessonShell,
            slides: generated.slides,
            quiz: generated.quiz,
          };

          // Cache in Supabase if configured (and not mock)
          if (isSupabaseConfigured() && !functionResponse.error && generated.status !== "mock") {
            await supabase.from('generated_lessons').insert({
              lesson_id: lessonId,
              slides: generated.slides,
              quiz: generated.quiz,
            });
          }

          // Cache in memory and set active
          setLessons((prev) => prev.map((l) => (l.id === lessonId ? fullLesson : l)));
          setCurrentLesson(fullLesson);
        } else {
          throw new Error(functionResponse.error?.message || "No se recibió el JSON de lección esperado.");
        }
      } catch (funcErr) {
        console.warn("Fallo la Edge Function de Supabase. Iniciando fallback local:", funcErr);
        
        // Dynamic Local Generator Fallback with rich educational content
        const smartLesson = generateSmartLocalLesson(lessonShell);

        const fullLesson: Lesson = {
          ...lessonShell,
          slides: smartLesson.slides,
          quiz: smartLesson.quiz,
        };

        // Cache in memory and set active
        setLessons((prev) => prev.map((l) => (l.id === lessonId ? fullLesson : l)));
        setCurrentLesson(fullLesson);
      }
    } catch (e: any) {
      console.error('Error general al iniciar lección:', e);
      alert(`No se pudo iniciar la lección. Detalles: ${e.message || e}`);
    } finally {
      setLoadingLesson(false);
    }
  };

  // Exit lesson midway
  const exitLesson = () => {
    setCurrentLesson(null);
  };

  // Complete lesson successfully, sync with Supabase and calculate streaks/XP
  const completeLesson = async (lessonId: string, heartsRemaining: number) => {
    if (!user) return;

    const lesson = lessons.find((l) => l.id === lessonId);
    if (!lesson) return;

    const alreadyCompleted = !!user.history[lessonId];
    const xpGained = alreadyCompleted ? 5 : lesson.xpReward;
    const newXp = user.xp + xpGained;
    const newLevel = Math.floor(newXp / 100) + 1;

    const todayStr = new Date().toISOString().split('T')[0];
    let newStreak = user.currentStreak;
    let newMaxStreak = user.maxStreak;

    if (user.lastActive !== todayStr) {
      if (user.lastActive) {
        const lastActiveDate = new Date(user.lastActive);
        const todayDate = new Date(todayStr);
        const diffTime = Math.abs(todayDate.getTime() - lastActiveDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          newStreak += 1;
        } else if (diffDays > 1) {
          newStreak = 1;
        }
      } else {
        newStreak = 1;
      }
      
      if (newStreak > newMaxStreak) {
        newMaxStreak = newStreak;
      }
    }

    const updatedUser: UserProfile = {
      ...user,
      xp: newXp,
      level: newLevel,
      hearts: heartsRemaining,
      currentStreak: newStreak,
      maxStreak: newMaxStreak,
      lastActive: todayStr,
      history: {
        ...user.history,
        [lessonId]: true,
      },
    };

    // Update state local
    setUser(updatedUser);
    setCurrentLesson(null);

    // Sync to Supabase
    if (isSupabaseConfigured()) {
      try {
        await supabase
          .from('gamification_profiles')
          .update({
            xp: newXp,
            level: newLevel,
            hearts: heartsRemaining,
            current_streak: newStreak,
            max_streak: newMaxStreak,
            last_active: todayStr,
          })
          .eq('user_email', user.email);

        if (!alreadyCompleted) {
          await supabase
            .from('user_lessons_history')
            .insert({
              user_email: user.email,
              category: lesson.category,
              lesson_id: lessonId,
              xp_gained: xpGained,
            });
        }
      } catch (e) {
        console.error('Error syncing lesson completion to Supabase:', e);
      }
    }
  };

  // Lose a heart (fall on question), sync with Supabase
  const loseHeart = async () => {
    if (!user) return;
    const newHearts = Math.max(0, user.hearts - 1);

    setUser((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        hearts: newHearts,
      };
    });

    if (isSupabaseConfigured()) {
      try {
        await supabase
          .from('gamification_profiles')
          .update({ hearts: newHearts })
          .eq('user_email', user.email);
      } catch (e) {
        console.error('Error updating hearts in Supabase:', e);
      }
    }
  };

  // Refill hearts (from Plan Elite CTA / Demo), sync with Supabase
  const refillHearts = async () => {
    if (!user) return;

    setUser((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        hearts: 5,
      };
    });

    if (isSupabaseConfigured()) {
      try {
        await supabase
          .from('gamification_profiles')
          .update({ hearts: 5 })
          .eq('user_email', user.email);
      } catch (e) {
        console.error('Error refilling hearts in Supabase:', e);
      }
    }
  };

  return (
    <GameContext.Provider
      value={{
        user,
        lessons,
        activeTab,
        currentLesson,
        activeCategory,
        loadingLesson,
        login,
        logout,
        startLesson,
        exitLesson,
        completeLesson,
        loseHeart,
        refillHearts,
        setTab,
        setActiveCategory,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
