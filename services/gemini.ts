
import { QuizData, Difficulty, ChatMessage } from "../types";

// DEFINITION: Local Type object to replace the SDK import.
// This prevents "process is not defined" errors in the browser.
const Type = {
  OBJECT: 'OBJECT',
  STRING: 'STRING',
  ARRAY: 'ARRAY',
  INTEGER: 'INTEGER',
  NUMBER: 'NUMBER'
};

// We define the schema here to pass it to the backend function
const QUIZ_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: "A creative and relevant title for the quiz",
    },
    estimatedTimeMinutes: {
      type: Type.NUMBER,
      description: "Estimated time to complete in minutes",
    },
    questions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.INTEGER },
          text: { type: Type.STRING },
          options: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          correctAnswer: {
            type: Type.STRING,
            description: "Must match exactly one of the strings in the options array",
          },
          explanation: {
            type: Type.STRING,
            description: "Explanation of correct answer and why distractors are wrong",
          },
          difficulty: { type: Type.STRING },
          topicTag: { type: Type.STRING },
        },
        required: ["id", "text", "options", "correctAnswer", "explanation", "difficulty", "topicTag"],
      },
    },
  },
  required: ["title", "questions", "estimatedTimeMinutes"],
};

const SYSTEM_INSTRUCTION = `
You are an expert Quiz Preparation Assistant designed to help students master any subject.
Your goal is to generate high-quality quizzes based on user requests and provided reference materials (documents, slides, videos).

**Question Quality Criteria:**
- Generate questions with 4 options.
- Ensure only ONE correct answer per question.
- Make distractors (wrong options) plausible but clearly incorrect.
- Avoid "All of the above" or "None of the above" unless pedagogically valuable.
- Match difficulty to specified level.
- Questions must be unambiguous and grammatically correct.
- Educational Value: Test understanding, not just memorization.
- **Reference Material:** If files or video links are provided, prioritize generating questions derived directly from that content.

**Output:**
You must output a strictly structured JSON object adhering to the schema provided.
`;

const CHAT_SYSTEM_INSTRUCTION = `
You are a friendly and encouraging AI Tutor called "MindForge AI". 
You help students study, explain complex topics, and can generate mini-questions on the fly.
Keep responses concise, helpful, and motivating. Use emojis occasionally.
If a user asks for a quiz, suggest they use the "Create Quiz" feature for a full experience, but you can provide 1-2 example questions in chat.
`;

// Helper to fetch from Netlify Function
async function callNetlifyGemini(payload: any) {
  // Note: /.netlify/functions/gemini is the standard path for Netlify Functions
  const response = await fetch('/.netlify/functions/gemini', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || `Server error: ${response.status}`);
  }

  return await response.json();
}

export const generateQuiz = async (
  topic: string,
  difficulty: Difficulty,
  count: number,
  files: { inlineData: { data: string; mimeType: string } }[] = [],
  videoLink: string = ""
): Promise<QuizData> => {
  const model = "gemini-2.5-flash";

  let promptText = `
    Create a ${difficulty} level quiz about "${topic}".
    Generate exactly ${count} multiple-choice questions.
  `;

  if (videoLink) {
    promptText += `\n\nReference Material (Video): Please use the content associated with this video link as a key source for the questions: ${videoLink}`;
  }

  if (files.length > 0) {
    promptText += `\n\nReference Material (Documents): Please analyse the attached documents (PDF, Slides, Text) and generate questions specifically testing the knowledge contained within them.`;
  }

  promptText += `
    For each question provide:
    1. The question text.
    2. 4 distinct options.
    3. The exact text of the correct option.
    4. A detailed explanation (2-4 sentences) explaining why the answer is correct and briefly why others are wrong.
    5. A specific subtopic tag.
  `;

  const contents = {
    parts: [
      { text: promptText },
      ...files
    ]
  };

  try {
    // Call the serverless function instead of local SDK
    const data = await callNetlifyGemini({
      model,
      contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: QUIZ_SCHEMA,
      }
    });

    if (!data.text) {
      throw new Error("No response generated from Gemini.");
    }

    return JSON.parse(data.text) as QuizData;
  } catch (error) {
    console.error("Quiz generation failed:", error);
    throw error;
  }
};

export const chatWithTutor = async (history: ChatMessage[], newMessage: string): Promise<string> => {
  try {
    // Convert history to Gemini "contents" format
    const parts = [
      { text: `System: ${CHAT_SYSTEM_INSTRUCTION}` },
      ...history.map(msg => ({
        text: `${msg.senderName}: ${msg.text}`
      })),
      { text: `User: ${newMessage}` }
    ];

    const data = await callNetlifyGemini({
      model: "gemini-2.5-flash",
      contents: { parts },
      config: {
        // Chat usually doesn't need strict JSON schema
      }
    });

    return data.text;
  } catch (error) {
    console.error("Chat error", error);
    return "I'm having trouble connecting right now. Please try again.";
  }
}
