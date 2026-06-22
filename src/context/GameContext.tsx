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
  login: (name: string, email: string) => Promise<void>;
  logout: () => void;
  startLesson: (lessonId: string) => void;
  exitLesson: () => void;
  completeLesson: (lessonId: string, heartsRemaining: number) => Promise<void>;
  loseHeart: () => Promise<void>;
  refillHearts: () => Promise<void>;
  setTab: (tab: 'learn' | 'profile' | 'elite') => void;
  setActiveCategory: (category: Category | null) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

// Initial Static Lesson Data (MVP)
const MVP_LESSONS: Lesson[] = [
  {
    id: 'nutrition_macros',
    title: 'Los Macronutrientes Básicos',
    description: 'Aprende la función de las proteínas, carbohidratos y grasas en tu cuerpo.',
    category: 'nutrition',
    xpReward: 20,
    slides: [
      {
        title: '¡Hola! Soy Lucas Chef 👨‍🍳',
        content: 'Hoy aprenderemos qué son los macronutrientes. Tu cuerpo necesita tres grandes grupos de nutrientes para funcionar y rendir al máximo: Proteínas, Carbohidratos y Grasas. ¡Vamos a verlos!',
        illustrationRole: 'chef',
        illustrationExpression: 'happy',
      },
      {
        title: 'Proteínas: Los Ladrillos 🧱',
        content: 'Las proteínas reparan tus músculos y tejidos. Se encuentran en el pollo, huevo, pescados, legumbres y lácteos. Si quieres mantener tu masa muscular activa, ¡las proteínas son tus mejores aliadas!',
        illustrationRole: 'chef',
        illustrationExpression: 'default',
      },
      {
        title: 'Carbohidratos: La Gasolina ⚡',
        content: 'Son la fuente principal de energía rápida para tu cuerpo y cerebro. Los encuentras en la avena, arroz, papas, frutas y pan. ¡No les tengas miedo! Te ayudan a entrenar con fuerza.',
        illustrationRole: 'chef',
        illustrationExpression: 'excited',
      },
      {
        title: 'Grasas Saludables: Los Reguladores 🥑',
        content: 'Las grasas regulan tus hormonas y protegen tus órganos. El aguacate, los frutos secos, el aceite de oliva y la yema de huevo son excelentes fuentes. ¡Son vitales para tu salud hormonal!',
        illustrationRole: 'chef',
        illustrationExpression: 'default',
      },
    ],
    quiz: [
      {
        id: 'q_n1_1',
        question: '¿Cuál es la función principal de las proteínas en el cuerpo?',
        options: [
          'Darnos energía súper rápida e inmediata.',
          'Reparar y construir tejidos y masa muscular.',
          'Amortiguar los golpes en los órganos.',
        ],
        correctAnswer: 1,
        explanation: 'Las proteínas actúan como "ladrillos", reparando las fibras musculares rotas durante el día y el ejercicio.',
      },
      {
        id: 'q_n1_2',
        question: '¿Qué alimento es una excelente fuente de carbohidratos saludables?',
        options: [
          'La pechuga de pollo.',
          'El aceite de oliva.',
          'La avena.',
        ],
        correctAnswer: 2,
        explanation: 'La avena es un carbohidrato complejo de excelente calidad que aporta energía de absorción lenta y fibra.',
      },
      {
        id: 'q_n1_3',
        question: '¿Es verdad que debemos eliminar las grasas por completo para perder peso?',
        options: [
          'Sí, las grasas son malas y nos engordan.',
          'No, las grasas saludables son vitales para la salud hormonal y celular.',
        ],
        correctAnswer: 1,
        explanation: '¡Falso! Tu cuerpo necesita grasas para regular las hormonas y absorber ciertas vitaminas. Modera la porción, pero no las elimines.',
      },
    ],
  },
  {
    id: 'nutrition_labels',
    title: 'Lectura Inteligente de Etiquetas',
    description: 'Domina las compras de supermercado identificando la trampa de los ingredientes.',
    category: 'nutrition',
    xpReward: 30,
    slides: [
      {
        title: 'De compras con Lucas 🛒',
        content: '¿Sabías que muchos productos etiquetados como "saludables" o "fit" en realidad están llenos de azúcar y grasas trans? Hoy aprenderemos a leer la etiqueta nutricional como un profesional.',
        illustrationRole: 'chef',
        illustrationExpression: 'thinking',
      },
      {
        title: 'Regla 1: La lista de ingredientes 🔍',
        content: 'Los ingredientes se listan de mayor a menor cantidad. Si el primer o segundo ingrediente es azúcar, jarabe de maíz o harina refinada, ¡ese producto no es tan saludable como parece!',
        illustrationRole: 'chef',
        illustrationExpression: 'default',
      },
      {
        title: 'Regla 2: El tamaño de la porción 📦',
        content: 'Ojo: la tabla nutricional suele mostrar los datos *por porción*, no por empaque completo. Si un empaque trae 3 porciones y te lo comes entero, ¡debes multiplicar todas las calorías y azúcar por 3!',
        illustrationRole: 'chef',
        illustrationExpression: 'excited',
      },
    ],
    quiz: [
      {
        id: 'q_n2_1',
        question: '¿En qué orden aparecen los ingredientes en la etiqueta?',
        options: [
          'De menor a mayor peso.',
          'En orden alfabético.',
          'De mayor a menor cantidad/peso.',
        ],
        correctAnswer: 2,
        explanation: 'Los ingredientes se ordenan según su peso en la fórmula. El primero de la lista es el que contiene en mayor cantidad.',
      },
      {
        id: 'q_n2_2',
        question: 'Si una galleta tiene 150 kcal por porción y el paquete contiene 2 porciones, ¿cuántas kcal comes si terminas el paquete?',
        options: [
          '150 kcal.',
          '300 kcal.',
          '450 kcal.',
        ],
        correctAnswer: 1,
        explanation: 'Exacto: 150 kcal x 2 porciones = 300 kcal en total. ¡Siempre revisa el número de porciones por empaque!',
      },
    ],
  },
  {
    id: 'training_strength',
    title: 'Fuerza Básica: RIR e Intensidad',
    description: 'Aprende cómo estimular el músculo sin llegar a lesionarte.',
    category: 'training',
    xpReward: 25,
    slides: [
      {
        title: '¡Entrena con Lucas Coach! 🏋️‍♂️',
        content: '¡A sudar! Para que tus músculos se fortalezcan, deben esforzarse. No basta con levantar pesas sin sentir nada, pero tampoco hay que lesionarse. Aquí entra la intensidad y un concepto clave: el RIR.',
        illustrationRole: 'coach',
        illustrationExpression: 'happy',
      },
      {
        title: '¿Qué es el RIR? 🤔',
        content: 'RIR significa "Repeticiones en Reserva" (Reps in Reserve). Mide qué tan cerca estás de no poder hacer ninguna repetición más. Un RIR de 2 significa que hiciste un set y pudiste haber hecho exactamente 2 repeticiones adicionales antes de fallar.',
        illustrationRole: 'coach',
        illustrationExpression: 'thinking',
      },
      {
        title: 'El rango eficiente 🔥',
        content: 'Para ganar fuerza y tonificar, la ciencia demuestra que debes entrenar con un RIR de entre 1 y 3. Si terminas una serie sintiendo que podías hacer 10 repeticiones más, ¡el peso es muy ligero!',
        illustrationRole: 'coach',
        illustrationExpression: 'excited',
      },
    ],
    quiz: [
      {
        id: 'q_t1_1',
        question: '¿Qué significa RIR 2 en entrenamiento?',
        options: [
          'Que debo descansar 2 minutos entre series.',
          'Que terminé mi serie quedándome a 2 repeticiones del fallo muscular.',
          'Que debo hacer solo 2 repeticiones en total.',
        ],
        correctAnswer: 1,
        explanation: 'Un RIR de 2 indica intensidad efectiva: te esfuerzas lo suficiente pero guardas 2 repeticiones en reserva para evitar fatiga extrema.',
      },
      {
        id: 'q_t1_2',
        question: 'Si terminas una serie de sentadillas sintiendo que podías hacer 15 repeticiones más sin parar, ¿qué deberías hacer?',
        options: [
          'Subir el peso o la intensidad para estar en un rango retador.',
          'Dejar el peso igual para no cansarte.',
          'Hacer menos series.',
        ],
        correctAnswer: 0,
        explanation: 'Si la intensidad es muy baja, los músculos no reciben el estímulo necesario para adaptarse y fortalecerse. Incrementa el peso gradualmente.',
      },
    ],
  },
  {
    id: 'habits_sleep',
    title: 'Higiene del Sueño e Hidratación',
    description: 'Los dos pilares invisibles para acelerar tu recuperación.',
    category: 'habits',
    xpReward: 20,
    slides: [
      {
        title: 'Entra en calma con Lucas Zen 🧘‍♂️',
        content: '¡Namasté! Puedes entrenar duro y comer perfecto, pero si no duermes y no te hidratas, tu cuerpo no se recuperará. Hoy veremos cómo mejorar el descanso nocturno.',
        illustrationRole: 'zen',
        illustrationExpression: 'happy',
      },
      {
        title: 'El poder del descanso 😴',
        content: 'Durante el sueño profundo, tu cuerpo libera hormonas de recuperación muscular y limpia las toxinas cerebrales. Intenta dormir de 7 a 8 horas de calidad diarias, apagando pantallas 30 minutos antes.',
        illustrationRole: 'zen',
        illustrationExpression: 'default',
      },
      {
        title: 'Hidratación Inteligente 💧',
        content: 'Estar deshidratado solo un 2% reduce tu fuerza en el gimnasio y altera tu digestión. Bebe agua constantemente. Una buena regla es observar tu orina: debe ser de color amarillo claro o transparente.',
        illustrationRole: 'zen',
        illustrationExpression: 'excited',
      },
    ],
    quiz: [
      {
        id: 'q_h1_1',
        question: '¿Por qué es importante apagar pantallas antes de acostarse?',
        options: [
          'Para ahorrar batería en el teléfono.',
          'Porque la luz azul interrumpe la producción de melatonina (hormona del sueño).',
          'No influye en nada en la calidad del sueño.',
        ],
        correctAnswer: 1,
        explanation: 'La luz azul de pantallas le dice a tu cerebro que aún es de día, retrasando el sueño profundo y afectando tu descanso celular.',
      },
      {
        id: 'q_h1_2',
        question: '¿Cuál es el mejor indicador diario de tu nivel de hidratación?',
        options: [
          'La cantidad de sudor al entrenar.',
          'El color de tu orina (debe ser amarillo claro/transparente).',
          'La resequedad de tus labios.',
        ],
        correctAnswer: 1,
        explanation: 'El color de la orina es una guía directa y sencilla. Si es oscura, necesitas tomar agua de inmediato.',
      },
    ],
  },
  {
    id: 'nutrition_portions',
    title: 'Control de Porciones y Salidas',
    description: 'Aprende a medir tus porciones con tu mano y a elegir en restaurantes.',
    category: 'nutrition',
    xpReward: 25,
    slides: [
      {
        title: 'Porciones con Lucas Chef 👨‍🍳',
        content: '¡No necesitas pesar tu comida en todos lados! Tu mano es una herramienta excelente y portátil para medir porciones estés donde estés. Vamos a ver cómo usarla.',
        illustrationRole: 'chef',
        illustrationExpression: 'happy',
      },
      {
        title: 'La Regla de la Mano 🖐️',
        content: '1. Proteína: Del tamaño de tu palma. 2. Carbohidratos: Una porción cabe en el cuenco de tu mano. 3. Verduras: Del tamaño de tu puño cerrado. 4. Grasas: Del tamaño de tu pulgar. ¡Fácil y práctico!',
        illustrationRole: 'chef',
        illustrationExpression: 'excited',
      },
      {
        title: 'Comiendo fuera de casa 🍽️',
        content: 'Cuando salgas a restaurantes, recuerda: pide siempre los aderezos o salsas por separado para controlar la grasa añadida, y bebe un vaso de agua antes de comer para mejorar la saciedad.',
        illustrationRole: 'chef',
        illustrationExpression: 'default',
      },
    ],
    quiz: [
      {
        id: 'q_n3_1',
        question: 'Según la regla de la mano, ¿cómo se mide la porción sugerida de proteínas?',
        options: [
          'Del tamaño de tu puño cerrado.',
          'Del tamaño y grosor de la palma de tu mano.',
          'Del tamaño de tu dedo pulgar.',
        ],
        correctAnswer: 1,
        explanation: 'La palma de tu mano (sin contar los dedos) equivale aproximadamente a una porción de 85-110g de proteína magra.',
      },
      {
        id: 'q_n3_2',
        question: '¿Cuál es una estrategia inteligente para comer saludable en un restaurante?',
        options: [
          'Pedir las salsas y aderezos por separado para dosificarlos tú mismo.',
          'Comer muy rápido para llenarte antes.',
          'Evitar beber agua durante la comida.',
        ],
        correctAnswer: 0,
        explanation: 'Los aderezos suelen tener calorías ocultas. Pedirlos por separado te permite disfrutar de la comida controlando la cantidad de grasa.',
      },
    ],
  },
  {
    id: 'training_biomechanics',
    title: 'Biomecánica: Evita Lesiones',
    description: 'Aprende a realizar sentadillas y flexiones de forma segura.',
    category: 'training',
    xpReward: 30,
    slides: [
      {
        title: 'Entrena seguro con Lucas Coach 🏋️‍♂️',
        content: '¡La técnica lo es todo! Hacer ejercicio con mala postura no solo reduce tus resultados, sino que te expone a lesiones. Hoy veremos dos movimientos muy comunes.',
        illustrationRole: 'coach',
        illustrationExpression: 'thinking',
      },
      {
        title: 'La Sentadilla Perfecta 🦵',
        content: 'Al hacer sentadillas, mantén la espalda recta y el pecho erguido. Inicia el movimiento empujando la cadera hacia atrás (como sentándote en una silla) y evita que tus rodillas colapsen hacia adentro.',
        illustrationRole: 'coach',
        illustrationExpression: 'default',
      },
      {
        title: 'Flexiones (Push-ups) sin dolor 🦾',
        content: 'En las flexiones, no abras los codos a 90 grados hacia los lados (forma de T), ya que daña tus hombros. Mantén tus codos a unos 45 grados de tu torso (forma de flecha) para empujar con fuerza y seguridad.',
        illustrationRole: 'coach',
        illustrationExpression: 'excited',
      },
    ],
    quiz: [
      {
        id: 'q_t2_1',
        question: '¿Qué error común debemos evitar en las rodillas al hacer sentadillas?',
        options: [
          'Que las rodillas bajen más de 90 grados.',
          'Que las rodillas colapsen hacia adentro (valgo de rodilla).',
          'Mantener las rodillas alineadas con la punta de los pies.',
        ],
        correctAnswer: 1,
        explanation: 'El colapso de rodillas hacia adentro pone mucha tensión en tus ligamentos. Empújalas hacia afuera alineándolas con tus pies.',
      },
      {
        id: 'q_t2_2',
        question: '¿Cuál es el mejor ángulo recomendado para los codos al hacer flexiones de pecho?',
        options: [
          'Totalmente abiertos a 90 grados (forma de T).',
          'A unos 45 grados respecto al torso (forma de flecha).',
          'Pegados al 100% tocando las costillas.',
        ],
        correctAnswer: 1,
        explanation: 'La posición a 45 grados es la más anatómica y segura para el hombro, reclutando eficientemente el pectoral y tríceps.',
      },
    ],
  },
  {
    id: 'habits_emotional',
    title: 'Ansiedad y Hambre Emocional',
    description: 'Aprende a diferenciar el hambre real de los antojos por estrés.',
    category: 'habits',
    xpReward: 30,
    slides: [
      {
        title: 'Manejo del apetito con Lucas Zen 🧘‍♂️',
        content: '¿Comes cuando estás aburrido, estresado o triste? Eso es hambre emocional. Hoy aprenderemos a diferenciarla del hambre física real para tomar el control de tus hábitos.',
        illustrationRole: 'zen',
        illustrationExpression: 'thinking',
      },
      {
        title: 'Física vs. Emocional ⚖️',
        content: 'El hambre física aparece gradualmente, se siente en el estómago y se satisface con cualquier comida saludable. El hambre emocional aparece de golpe, exige un antojo específico (azúcar, harinas) y suele generar culpa después.',
        illustrationRole: 'zen',
        illustrationExpression: 'default',
      },
      {
        title: 'La Regla de los 5 Minutos ⏱️',
        content: 'Cuando sientas un antojo repentino, detente y toma un vaso con agua. Espera 5 minutos haciendo otra actividad (caminar, respirar). Si el antojo desaparece, era sed o aburrimiento. ¡Sé consciente!',
        illustrationRole: 'zen',
        illustrationExpression: 'excited',
      },
    ],
    quiz: [
      {
        id: 'q_h2_1',
        question: '¿Qué característica define al hambre emocional?',
        options: [
          'Aparece de forma lenta y gradual.',
          'Aparece de golpe y exige un antojo ultra-específico (ej: chocolate, papas fritas).',
          'Se satisface comiendo un plato de brócoli o manzana.',
        ],
        correctAnswer: 1,
        explanation: 'El hambre emocional no busca nutrición, busca confort. Por eso exige comida altamente palatable (azúcar/grasa) de forma inmediata.',
      },
      {
        id: 'q_h2_2',
        question: '¿En qué consiste la regla de los 5 minutos ante un antojo?',
        options: [
          'Comer el antojo en menos de 5 minutos.',
          'Tomar agua, esperar 5 minutos haciendo otra actividad y reevaluar si es hambre real.',
          'Esperar 5 minutos antes de volver a comer tu plato de almuerzo.',
        ],
        correctAnswer: 1,
        explanation: 'Esta pausa interrumpe la respuesta automática de comer por impulso, dándole tiempo al cerebro para calmar la ansiedad.',
      },
    ],
  }
];

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('lucas_user_profile');
    return saved ? JSON.parse(saved) : null;
  });
  const [activeTab, setTab] = useState<'learn' | 'profile' | 'elite'>('learn');
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);

  // Sync to local storage for offline fallback
  useEffect(() => {
    if (user) {
      localStorage.setItem('lucas_user_profile', JSON.stringify(user));
    } else {
      localStorage.removeItem('lucas_user_profile');
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

  // Start lesson
  const startLesson = (lessonId: string) => {
    if (!user) return;
    if (user.hearts <= 0) {
      setTab('elite');
      return;
    }
    const lesson = MVP_LESSONS.find((l) => l.id === lessonId);
    if (lesson) {
      setCurrentLesson(lesson);
    }
  };

  // Exit lesson midway
  const exitLesson = () => {
    setCurrentLesson(null);
  };

  // Complete lesson successfully, sync with Supabase and calculate streaks/XP
  const completeLesson = async (lessonId: string, heartsRemaining: number) => {
    if (!user) return;

    const lesson = MVP_LESSONS.find((l) => l.id === lessonId);
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
        lessons: MVP_LESSONS,
        activeTab,
        currentLesson,
        activeCategory,
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
