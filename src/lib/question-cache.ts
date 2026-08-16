import { get, set } from 'idb-keyval';
import { getBulkQuestionsData } from './bulk-data.functions';

export interface CachedQuestion {
  id: string;
  subtopic_id: string;
  type: 'mcq' | 'msq';
  question_type?: string;
  correct_option_count?: number;
  total_options?: number;
  question_text: string;
  options: string[] | any;
  explanation?: string | null;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface CachedDataPayload {
  version: string;
  courses: any[];
  subtopics: any[];
  questions: CachedQuestion[];
  cachedAt: number;
}

const CACHE_KEY = 'quizforge_question_bank_v1';

export async function getCachedQuestionBank(): Promise<CachedDataPayload | null> {
  try {
    const cached = await get<CachedDataPayload>(CACHE_KEY);
    return cached || null;
  } catch (err) {
    console.warn('IndexedDB read error:', err);
    return null;
  }
}

export async function syncQuestionBankCache(): Promise<CachedDataPayload> {
  const freshData = await getBulkQuestionsData();
  const cached = await getCachedQuestionBank();

  if (!cached || cached.version !== freshData.version) {
    const payload: CachedDataPayload = {
      version: freshData.version,
      courses: freshData.courses,
      subtopics: freshData.subtopics,
      questions: freshData.questions as any,
      cachedAt: Date.now(),
    };
    await set(CACHE_KEY, payload);
    return payload;
  }

  return cached;
}
