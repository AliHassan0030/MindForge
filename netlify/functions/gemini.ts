
import { GoogleGenAI } from "@google/genai";

export default async (req: Request) => {
  // Handle Preflight CORS request
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  // Only allow POST
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    // 1. Get the API Key from Netlify Environment Variables
    const apiKey = process.env.API_KEY;
    
    if (!apiKey) {
      console.error("API_KEY is missing in Netlify Environment Variables");
      return new Response(JSON.stringify({ error: "Server configuration error: API Key missing" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    // 2. Parse the frontend request
    const { model, contents, config } = await req.json();

    // 3. Initialize Google AI Client
    const ai = new GoogleGenAI({ apiKey });

    // 4. Generate Content
    const response = await ai.models.generateContent({
      model: model || 'gemini-2.5-flash',
      contents: contents,
      config: config
    });

    // 5. Return result to frontend
    return new Response(JSON.stringify({ text: response.text }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // Allow frontend to read response
      },
    });

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return new Response(JSON.stringify({ error: error.message || "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
