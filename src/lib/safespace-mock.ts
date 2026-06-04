export type Source = {
  chunk_text: string;
  source: string;
  section: string;
  confidence: number;
};

export type ContextAccumulated = {
  symptoms: string[];
  triggers: string[];
  duration: string;
  severity: string;
};

export type ChatMetadata = {
  language: string;
  emotion: string;
  intent: string;
  confidence_scores: { language: number; emotion: number; intent: number };
  sources: Source[];
  is_crisis: boolean;
  context_accumulated: ContextAccumulated;
};

export type ChatResponse = { response: string; metadata: ChatMetadata };

const CRISIS_KEYWORDS = [
  "kill myself", "suicide", "end it all", "can't do this anymore",
  "cant do this anymore", "want to die", "hurt myself", "no reason to live",
  "give up on life",
];

const EMOTION_MAP: { keyword: string; emotion: string }[] = [
  { keyword: "anxious", emotion: "fear" },
  { keyword: "anxiety", emotion: "fear" },
  { keyword: "worried", emotion: "fear" },
  { keyword: "scared", emotion: "fear" },
  { keyword: "panic", emotion: "fear" },
  { keyword: "stress", emotion: "fear" },
  { keyword: "overwhelm", emotion: "fear" },
  { keyword: "sad", emotion: "sadness" },
  { keyword: "down", emotion: "sadness" },
  { keyword: "lonely", emotion: "sadness" },
  { keyword: "depress", emotion: "sadness" },
  { keyword: "hopeless", emotion: "sadness" },
  { keyword: "angry", emotion: "anger" },
  { keyword: "frustrated", emotion: "anger" },
  { keyword: "furious", emotion: "anger" },
  { keyword: "happy", emotion: "joy" },
  { keyword: "great", emotion: "joy" },
  { keyword: "better", emotion: "joy" },
  { keyword: "thank", emotion: "gratitude" },
];

export function emotionEmoji(emotion: string): string {
  const map: Record<string, string> = {
    fear: "😨",
    sadness: "😢",
    anger: "😤",
    joy: "😊",
    gratitude: "💝",
    neutral: "😐",
    greeting: "👋",
  };
  return map[emotion] ?? "😐";
}

export function emotionLabel(emotion: string): string {
  const map: Record<string, string> = {
    fear: "Anxiety",
    sadness: "Sadness",
    anger: "Anger",
    joy: "Joy",
    gratitude: "Gratitude",
    neutral: "Neutral",
    greeting: "Greeting",
  };
  return map[emotion] ?? emotion;
}

export function intentLabel(intent: string): string {
  const map: Record<string, string> = {
    greeting: "Greeting",
    gratitude: "Gratitude",
    asking_mental_health_question: "Health Question",
    sharing_experience: "Sharing",
    crisis_help_needed: "Crisis — Help Needed",
  };
  return map[intent] ?? intent;
}

function detectIntent(text: string): string {
  const t = text.toLowerCase().trim();
  if (/^(hi|hello|hey|good (morning|evening|afternoon))/.test(t)) return "greeting";
  if (t.includes("thank")) return "gratitude";
  if (t.includes("?") || /^(how|what|why|when|where|can|should|do|is)\b/.test(t)) {
    return "asking_mental_health_question";
  }
  return "sharing_experience";
}

function detectEmotion(text: string): { emotion: string; confidence: number } {
  const t = text.toLowerCase();
  for (const { keyword, emotion } of EMOTION_MAP) {
    if (t.includes(keyword)) return { emotion, confidence: 0.82 + Math.random() * 0.14 };
  }
  return { emotion: "neutral", confidence: 0.7 + Math.random() * 0.2 };
}

function isCrisis(text: string): boolean {
  const t = text.toLowerCase();
  return CRISIS_KEYWORDS.some((k) => t.includes(k));
}

const RESPONSES = {
  crisis: `I'm really glad you reached out, and I'm concerned about what you've shared. What you're feeling matters, and you deserve immediate support from someone trained to help right now.

Please consider using one of the resources below — you don't have to face this alone, and there are people who genuinely want to listen.`,
  anxiety: `I hear you — work-related anxiety is incredibly common and very manageable. A few evidence-based things often help: **box breathing** (inhale 4, hold 4, exhale 4, hold 4), the **5-4-3-2-1 grounding** exercise, and creating one small non-negotiable recovery moment in your day.

Would you like to talk through what triggers feel most acute right now?`,
  sadness: `Thank you for trusting me with this. Sadness can feel especially heavy when it lingers. One thing that often helps is gently distinguishing the *story* your mind is telling from the *feeling* in your body — they're related, but they aren't the same thing.

What does today look like for you so far?`,
  sleep: `Trouble sleeping during stressful periods is your nervous system asking for help winding down. A few things research supports well: a consistent wind-down routine about 45 minutes before bed, no screens in the last 30, and a "worry dump" — writing down everything spinning in your head so your mind can release it.

Would breathing exercises or a wind-down ritual be more useful right now?`,
  greeting: `Hello — I'm SafeSpace. This is a calm place to talk through whatever's on your mind. There's no right or wrong way to start. How are you feeling today?`,
  gratitude: `You're so welcome. I'm really glad it helped. Take good care of yourself — I'm here whenever you'd like to talk again.`,
  anger: `That sounds genuinely frustrating, and it makes sense that you'd feel that way. Anger often points to something important — a boundary, a value, or an unmet need. Before problem-solving, it can help to just name what you're protecting.

What feels most violated or unfair in this for you?`,
  default: `Thank you for sharing that with me. I want to make sure I understand what you're going through. Could you tell me a little more about how this has been showing up for you — when it tends to feel strongest, or what makes it easier?`,
};

function pickResponse(text: string, crisis: boolean): string {
  if (crisis) return RESPONSES.crisis;
  const t = text.toLowerCase().trim();
  if (/^(hi|hello|hey)/.test(t)) return RESPONSES.greeting;
  if (t.includes("thank")) return RESPONSES.gratitude;
  if (t.includes("sleep") || t.includes("insomnia")) return RESPONSES.sleep;
  if (t.includes("anxious") || t.includes("anxiety") || t.includes("stress") || t.includes("overwhelm") || t.includes("panic")) return RESPONSES.anxiety;
  if (t.includes("sad") || t.includes("down") || t.includes("lonely") || t.includes("depress") || t.includes("hopeless")) return RESPONSES.sadness;
  if (t.includes("angry") || t.includes("frustrated") || t.includes("furious")) return RESPONSES.anger;
  return RESPONSES.default;
}

const SOURCE_POOL: Source[] = [
  { chunk_text: "Anxiety management techniques include diaphragmatic breathing, progressive muscle relaxation, and cognitive reframing of catastrophic thoughts...", source: "Psychology Today Guide", section: "Cognitive Behavioral Therapy", confidence: 0.92 },
  { chunk_text: "Progressive muscle relaxation involves tensing and releasing muscle groups in sequence to reduce somatic tension...", source: "Counseling Dataset", section: "Relaxation Techniques", confidence: 0.88 },
  { chunk_text: "Sleep hygiene practices include maintaining a consistent schedule, limiting screen exposure, and creating a wind-down routine...", source: "Mental Health Foundation", section: "Sleep & Recovery", confidence: 0.94 },
  { chunk_text: "The 5-4-3-2-1 grounding technique uses sensory awareness to interrupt anxiety spirals and return attention to the present...", source: "Clinical Psychology Review", section: "Grounding Practices", confidence: 0.9 },
  { chunk_text: "Workplace stress correlates strongly with perceived lack of control; small autonomy rituals can buffer this effect...", source: "Workplace Wellness Journal", section: "Occupational Stress", confidence: 0.87 },
  { chunk_text: "Compassionate self-talk reduces depressive symptom intensity in studies of adults experiencing moderate sadness...", source: "Journal of Positive Psychology", section: "Self-Compassion", confidence: 0.89 },
  { chunk_text: "Anger is frequently a signal of unmet needs or violated values; naming the underlying need reduces reactivity...", source: "Emotion-Focused Therapy Manual", section: "Working with Anger", confidence: 0.86 },
];

function pickSources(text: string): Source[] {
  const t = text.toLowerCase();
  const picks: Source[] = [];
  if (t.includes("sleep") || t.includes("insomnia")) picks.push(SOURCE_POOL[2]);
  if (t.includes("anxious") || t.includes("anxiety") || t.includes("stress") || t.includes("panic")) {
    picks.push(SOURCE_POOL[0], SOURCE_POOL[3]);
  }
  if (t.includes("work") || t.includes("deadline")) picks.push(SOURCE_POOL[4]);
  if (t.includes("sad") || t.includes("down") || t.includes("depress")) picks.push(SOURCE_POOL[5]);
  if (t.includes("angry") || t.includes("frustrated")) picks.push(SOURCE_POOL[6]);
  if (picks.length === 0) picks.push(SOURCE_POOL[0], SOURCE_POOL[1]);
  return Array.from(new Set(picks)).slice(0, 3);
}

function extractContext(text: string, prev: ContextAccumulated): ContextAccumulated {
  const t = text.toLowerCase();
  const symptoms = new Set(prev.symptoms);
  const triggers = new Set(prev.triggers);
  if (t.includes("anxious") || t.includes("anxiety")) symptoms.add("anxiety");
  if (t.includes("overwhelm") || t.includes("stress")) symptoms.add("stress");
  if (t.includes("sleep") || t.includes("insomnia")) symptoms.add("insomnia");
  if (t.includes("sad") || t.includes("depress")) symptoms.add("low mood");
  if (t.includes("panic")) symptoms.add("panic");
  if (t.includes("tired") || t.includes("fatigue") || t.includes("exhaust")) symptoms.add("fatigue");
  ["work", "deadline", "presentation", "relationship", "family", "school", "money", "finances"].forEach((tr) => {
    if (t.includes(tr)) triggers.add(tr);
  });
  let duration = prev.duration;
  if (!duration) {
    if (t.match(/(\d+)\s*(week|month|day)/)) duration = t.match(/(\d+)\s*(week|month|day)s?/)![0];
    else if (t.includes("week")) duration = "past few weeks";
    else if (t.includes("month")) duration = "past month";
    else if (t.includes("lately") || t.includes("recently")) duration = "recent";
  }
  return {
    symptoms: Array.from(symptoms),
    triggers: Array.from(triggers),
    duration,
    severity: prev.severity || (symptoms.size >= 3 ? "moderate-high" : "moderate"),
  };
}

export const EMPTY_CONTEXT: ContextAccumulated = {
  symptoms: [],
  triggers: [],
  duration: "",
  severity: "",
};

// Keep all your types (Source, ContextAccumulated, ChatMetadata, ChatResponse) up here...

export async function ChatApi(
  message: string,
  prevContext: ContextAccumulated,
): Promise<ChatResponse> {
  // If using Vite proxy (recommended below), this path stays relative.
  // Otherwise, use your full backend URL: "https://your-api.com/chat"
  const BACKEND_URL = "http://127.0.0.1:8000/v1/chat"; 

  try {
    const response = await fetch(BACKEND_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // Send the user message and the accumulated context to the backend
      body: JSON.stringify({ 
        message: message, 
        //context: prevContext 
      }),
    });

    if (!response.ok) {
      throw new Error(`Backend error: ${response.status} ${response.statusText}`);
    }

    // The backend should return a JSON object matching the ChatResponse type
    const data: ChatResponse = await response.json();
    return data;
    
  } catch (error) {
    console.error("Failed to connect to SafeSpace backend:", error);
    await new Promise((r) => setTimeout(r, 1100 + Math.random() * 700));



    const crisis = isCrisis(message);

    const { emotion, confidence } = detectEmotion(message);

    const intent = crisis ? "crisis_help_needed" : detectIntent(message);

    const sources = crisis ? [] : pickSources(message);



    return {
      response: pickResponse(message, crisis),
      metadata: {
        language: "en",
        emotion: crisis ? "sadness" : emotion,
        intent,
        confidence_scores: {
          language: 0.98,
          emotion: crisis ? 0.93 : confidence,
          intent: 0.91 + Math.random() * 0.07,
        },
        sources,
        is_crisis: crisis,
        context_accumulated: extractContext(message, prevContext),
      },
    };
    return {
      response: "I'm having trouble connecting to my servers right now. Please try again in a moment.",
      metadata: {
        language: "en",
        emotion: "neutral",
        intent: "error",
        confidence_scores: { language: 0, emotion: 0, intent: 0 },
        sources: [],
        is_crisis: false,
        context_accumulated: prevContext,
      }
    };
  }
}