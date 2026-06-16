// src/skills/tips/tips-data.ts — NO React imports

export interface TipStep {
  /** 1-based ordinal, must be contiguous 1..n within a tip */
  step: number;
  /** Spanish patient-facing copy */
  text: string;
}

/** Fields shared by every tip regardless of shape */
interface TipBase {
  /** Globally unique, stable kebab id */
  id: string;
  /** Spanish title */
  title: string;
}

/** Paragraph-shaped tip */
export interface TipBody extends TipBase {
  body: string;
  steps?: never;
}

/** Ordered-step-shaped tip */
export interface TipSteps extends TipBase {
  steps: TipStep[];
  body?: never;
}

/** Body XOR steps, enforced at compile time */
export type Tip = TipBody | TipSteps;

export interface TipsCategory {
  id: string;
  title: string;
  icon: string;
  tips: Tip[];
}

/** Type guard: narrows Tip to TipSteps */
export function hasSteps(tip: Tip): tip is TipSteps {
  return Array.isArray((tip as TipSteps).steps);
}

/** Flatten all categories into a single ordered array */
export function getAllTips(data: TipsCategory[]): Tip[] {
  return data.flatMap((c) => c.tips);
}

export const tipsData: TipsCategory[] = [
  {
    id: 'sueno',
    title: 'Sueño',
    icon: 'Moon',
    tips: [
      {
        id: 'sueno-01',
        title: 'Duerme adecuadamente',
        body: 'Dormir adecuadamente es un factor que influye de manera significativa en el funcionamiento cerebral puesto que es durante el sueño que nuestro cerebro lleva a cabo procesos que permiten consolidar y organizar la información.',
      },
    ],
  },
  {
    id: 'atencion',
    title: 'Atención',
    icon: 'Target',
    tips: [
      {
        id: 'atencion-autoinstruccion',
        title: 'Técnica de autoinstrucción verbal',
        steps: [
          { step: 1, text: 'Lee atentamente la instrucción antes de comenzar.' },
          { step: 2, text: 'Estructura la actividad considerando todas las posibilidades de respuesta.' },
          { step: 3, text: 'Centra la atención solo en esa actividad.' },
          { step: 4, text: 'Elige la respuesta correcta justificándola.' },
          { step: 5, text: 'Verificación y autorefuerzo: comprueba tu respuesta y reconoce tu esfuerzo.' },
        ],
      },
      {
        id: 'atencion-material-motivador',
        title: 'Usa material motivador',
        body: 'Utiliza tareas en el ordenador u otros formatos digitales como material motivador para mantener la atención activa durante más tiempo.',
      },
      {
        id: 'atencion-repasar-material',
        title: 'Repasa el material',
        body: 'Repasa el material trabajado antes de avanzar al siguiente contenido para reforzar la atención y consolidar el aprendizaje.',
      },
      {
        id: 'atencion-controlar-distracciones',
        title: 'Controla las distracciones',
        body: 'Identifica y controla las distracciones del entorno antes de comenzar cualquier tarea que requiera concentración sostenida.',
      },
      {
        id: 'atencion-no-interrumpir',
        title: 'No interrumpas las tareas',
        body: 'Evita interrumpir las tareas una vez iniciadas. Completar una actividad de principio a fin entrena la capacidad de atención sostenida.',
      },
      {
        id: 'atencion-periodos-reposo',
        title: 'Periodos de reposo frecuentes',
        body: 'Trabaja en bloques de 45 minutos y descansa 5 minutos. Los periodos de reposo frecuentes permiten mantener un nivel óptimo de atención a lo largo del día.',
      },
      {
        id: 'atencion-cronometro',
        title: 'Usa un cronómetro',
        body: 'Usa cronómetros o temporizadores para delimitar los periodos de trabajo y descanso. Tener un límite de tiempo visible ayuda a mantener el foco.',
      },
      {
        id: 'atencion-vias-sensoriales',
        title: 'Varias vías sensoriales',
        body: 'Usa varias vías sensoriales al estudiar: lee en voz alta, repite en voz alta, escribe a mano y escucha el contenido. Activar más sentidos mejora la atención y la retención.',
      },
      {
        id: 'atencion-dividir-tareas',
        title: 'Divide las tareas extensas',
        body: 'Divide las tareas extensas en fragmentos más pequeños y manejables. Completar cada fragmento genera sensación de logro y mantiene la motivación.',
      },
      {
        id: 'atencion-evitar-cansancio',
        title: 'Evita el cansancio y la fatiga',
        body: 'Evita el cansancio y la fatiga planificando el trabajo en momentos del día en que tu nivel de energía es más alto.',
      },
      {
        id: 'atencion-entorno-sin-estimulos',
        title: 'Evita entornos cargados de estímulos',
        body: 'Trabaja en entornos libres de estímulos innecesarios. Un espacio ordenado y tranquilo facilita la concentración y reduce el esfuerzo atencional.',
      },
      {
        id: 'atencion-gustos-hobbies',
        title: 'Diseña tareas según tus gustos',
        body: 'Diseña o adapta las tareas según tus gustos y hobbies cuando sea posible. Conectar el aprendizaje con intereses personales aumenta la motivación y la atención.',
      },
      {
        id: 'atencion-una-tarea',
        title: 'Una tarea a la vez',
        body: 'Evita la multitarea. Concentrarte en una sola actividad a la vez permite procesar la información de forma más eficiente y reduce los errores.',
      },
    ],
  },
];

/** Flattened ordered sequence used by rotation helpers */
export const allTipsInOrder: Tip[] = tipsData.flatMap((c) => c.tips);
