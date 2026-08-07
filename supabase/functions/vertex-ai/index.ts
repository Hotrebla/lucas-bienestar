// SUPABASE EDGE FUNCTION: vertex-ai
// Servidor de Deno seguro para consultar a Vertex AI (Google Cloud) o Google AI Studio (Gemini) usando Gemini 3.5 Flash de forma privada.
// Desplegar ejecutando: supabase functions deploy vertex-ai

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { create, Header, Payload } from "https://deno.land/x/djwt@v2.8/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Helper para obtener el Access Token de Google Cloud mediante Service Account
async function getAccessToken(clientEmail: string, privateKey: string): Promise<string> {
  // Limpiar y formatear la clave privada PEM de forma robusta con Regex
  const cleanKey = privateKey.replace(/\\n/g, '\n');
  const match = cleanKey.match(/-----BEGIN PRIVATE KEY-----([\s\S]*?)-----END PRIVATE KEY-----/);
  if (!match) {
    throw new Error("Formato de clave privada inválido: No se encontró la cabecera/pie PEM.");
  }
  const pemContents = match[1].replace(/[^A-Za-z0-9+/=]/g, '');
  
  // Convertir clave base64 a ArrayBuffer (formato PKCS8)
  const binaryDerString = atob(pemContents);
  let binaryDer = new Uint8Array(binaryDerString.length);
  for (let i = 0; i < binaryDerString.length; i++) {
    binaryDer[i] = binaryDerString.charCodeAt(i);
  }

  // Asegurar que el buffer DER PKCS8 tenga la longitud exacta (1218 bytes) para Web Crypto API
  if (binaryDer.length > 1218) {
    binaryDer = binaryDer.subarray(0, 1218);
  }

  // Importar clave con Web Crypto API
  const cryptoKey = await crypto.subtle.importKey(
    "pkcs8",
    binaryDer,
    {
      name: "RSASSA-PKCS1-v1_5",
      hash: "SHA-256",
    },
    false,
    ["sign"]
  );

  const jwtHeader: Header = { alg: "RS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const jwtPayload: Payload = {
    iss: clientEmail,
    scope: "https://www.googleapis.com/auth/cloud-platform",
    aud: "https://oauth2.googleapis.com/token",
    exp: now + 3600,
    iat: now,
  };

  // Firmar la aserción JWT
  const assertion = await create(jwtHeader, jwtPayload, cryptoKey);

  // Solicitar Access Token a Google OAuth2
  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${assertion}`,
  });

  if (!tokenResponse.ok) {
    const errText = await tokenResponse.text();
    throw new Error(`Google OAuth2 Token request failed: ${errText}`);
  }

  const tokenData = await tokenResponse.json();
  return tokenData.access_token;
}

function extractValidJson(text: string): string {
  const start = text.indexOf('{');
  if (start === -1) return text;
  
  let braceCount = 0;
  let inString = false;
  let escape = false;
  
  for (let i = start; i < text.length; i++) {
    const char = text[i];
    if (escape) {
      escape = false;
      continue;
    }
    if (char === '\\') {
      escape = true;
      continue;
    }
    if (char === '"') {
      inString = !inString;
      continue;
    }
    if (!inString) {
      if (char === '{') {
        braceCount++;
      } else if (char === '}') {
        braceCount--;
        if (braceCount === 0) {
          return text.substring(start, i + 1);
        }
      }
    }
  }
  return text;
}

serve(async (req) => {
  // Manejo de peticiones CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { lessonId, topic, category, difficulty } = await req.json()

    if (!topic || !category) {
      throw new Error("topic y category son requeridos.");
    }

    // 1. Obtener claves y secretos configurados en Supabase
    const geminiApiKey = Deno.env.get("GEMINI_API_KEY"); // Google AI Studio (Bypass directo)
    const gcpProjectId = Deno.env.get("GCP_PROJECT_ID");
    const gcpClientEmail = Deno.env.get("GCP_CLIENT_EMAIL");
    const gcpPrivateKey = Deno.env.get("GCP_PRIVATE_KEY");
    const gcpRegion = Deno.env.get("GCP_REGION") || "asia-northeast1";
    const gcpModel = Deno.env.get("GCP_MODEL_NAME") || "gemini-3.5-flash"; // Por defecto usa la versión insignia del 2026

    // Lucas Avatar Role name
    const roleName = category === "training" ? "coach" : category === "habits" ? "zen" : "chef";
    const roleTitle = category === "training" ? "Lucas Coach 🏋️‍♂️" : category === "habits" ? "Lucas Zen 🧘‍♂️" : "Lucas Chef 👨‍🍳";

    // Si no hay ninguna credencial configurada, devolvemos mock data de prueba
    const hasGoogleAI = !!geminiApiKey;
    const hasVertexAI = !!(gcpProjectId && gcpPrivateKey && gcpClientEmail);

    if (!hasGoogleAI && !hasVertexAI) {
      console.warn("Ninguna credencial de IA configurada. Utilizando Mock Data.");
      
      const mockResult = {
        status: "mock",
        slides: [
          {
            title: `¡Bienvenido al tema: ${topic}!`,
            content: `Hoy vamos a aprender sobre ${topic}. Este contenido está en nivel ${difficulty || 'básico'}. Mantente atento a los consejos de ${roleTitle}.`,
            illustrationRole: roleName,
            illustrationExpression: "happy"
          },
          {
            title: "Consejo Práctico 💡",
            content: `Recuerda aplicar esto de forma diaria para construir consistencia. Los pequeños cambios del 1% hacen grandes transformaciones a largo plazo.`,
            illustrationRole: roleName,
            illustrationExpression: "default"
          }
        ],
        quiz: [
          {
            id: `q_${lessonId}_1`,
            question: `¿Cuál es el beneficio principal de estudiar ${topic}?`,
            options: [
              "Tomar decisiones informadas y consistentes sobre mis hábitos de bienestar.",
              "Solo sirve para ganar puntos de experiencia en el juego.",
              "No tiene ningún impacto práctico en el día a día."
            ],
            correctAnswer: 0,
            explanation: "¡Correcto! Comprender la teoría nos ayuda a tomar mejores decisiones prácticas en nuestra salud."
          },
          {
            id: `q_${lessonId}_2`,
            question: `¿Qué nivel de dificultad tiene esta lección?`,
            options: [
              "Avanzado",
              "Básico / Intermedio",
              `Nivel: ${difficulty || 'básico'}`
            ],
            correctAnswer: 2,
            explanation: `Exacto. Esta lección ha sido configurada en la dificultad: ${difficulty || 'básico'}.`
          }
        ]
      };

      return new Response(
        JSON.stringify(mockResult),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 2. Prompt estructurado para Gemini
    const systemPrompt = `Eres Lucas, un experto en bienestar, salud y fitness de la academia "Bienestar Sin Excusas" (BSE).
Tus características según tu rol actual:
- Tu rol en esta lección: ${roleTitle} (${roleName}).
- Debes redactar la teoría de forma súper amigable, directa, empática y motivadora, al estilo de un tutor de Duolingo (explicaciones sencillas de entender pero con base científica).
- Dificultad de la lección: ${difficulty || 'basic'}. Adapta el tecnicismo a esta dificultad.
- Al final debes proveer un quiz de evaluación interactivo.

Debes responder ÚNICAMENTE con un objeto JSON válido (sin formato markdown \`\`\`json ni texto adicional) que contenga la estructura exacta de lección descrita en el esquema de abajo.`;

    const userPrompt = `Genera el contenido de aprendizaje para la lección sobre el tema: "${topic}".
Esquema JSON esperado:
{
  "slides": [
    {
      "title": "Título corto y llamativo",
      "content": "Contenido teórico de 2 a 3 líneas máx (conciso y directo). Usa emojis de vez en cuando.",
      "illustrationRole": "${roleName}",
      "illustrationExpression": "default" (o 'happy', 'sad', 'thinking', 'excited')
    }
  ],
  "quiz": [
    {
      "id": "q1",
      "question": "Pregunta de opción múltiple directa",
      "options": ["Opción A", "Opción B", "Opción C"],
      "correctAnswer": 0 (índice de la respuesta correcta),
      "explanation": "Explicación breve de por qué esta es la respuesta correcta en la voz de Lucas."
    }
  ]
}

Genera exactamente entre 2 y 3 diapositivas (slides) y 2 preguntas de quiz.`;

    let resultJson: any = null;

    if (hasGoogleAI) {
      console.log("Generando con Google AI Studio (GEMINI_API_KEY)...");
      const googleAiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${gcpModel}:generateContent?key=${geminiApiKey}`;

      const aiResponse = await fetch(googleAiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                { text: `${systemPrompt}\n\n${userPrompt}` }
              ]
            }
          ],
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.3,
          }
        })
      });

      if (!aiResponse.ok) {
        const errText = await aiResponse.text();
        throw new Error(`Google AI Studio API request failed: ${errText}`);
      }

      const responseData = await aiResponse.json();
      const aiText = responseData.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!aiText) {
        throw new Error("No se recibió respuesta de texto desde Google AI Studio.");
      }
      let cleanedText = aiText.trim();
      cleanedText = extractValidJson(cleanedText);
      try {
        resultJson = JSON.parse(cleanedText);
      } catch (parseErr: any) {
        throw new Error(`Error parseando JSON generado por la IA: ${parseErr.message}. Texto recibido: ${aiText}`);
      }
      
    } else {
      console.log("Generando con Vertex AI (Service Account)...");
      // 2. Autenticación con Google Cloud OAuth2
      const token = await getAccessToken(gcpClientEmail!, gcpPrivateKey!);

      // 3. Llamada a Vertex AI API (Gemini 3.5 Flash)
      const vertexUrl = `https://${gcpRegion}-aiplatform.googleapis.com/v1/projects/${gcpProjectId}/locations/${gcpRegion}/publishers/google/models/${gcpModel}:generateContent`;

      const vertexResponse = await fetch(vertexUrl, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                { text: `${systemPrompt}\n\n${userPrompt}` }
              ]
            }
          ],
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.3,
          }
        })
      });

      if (!vertexResponse.ok) {
        const errText = await vertexResponse.text();
        throw new Error(`Vertex AI API request failed: ${errText}`);
      }

      const responseData = await vertexResponse.json();
      const aiText = responseData.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!aiText) {
        throw new Error("No se recibió respuesta de texto desde Vertex AI.");
      }
      let cleanedText = aiText.trim();
      cleanedText = extractValidJson(cleanedText);
      try {
        resultJson = JSON.parse(cleanedText);
      } catch (parseErr: any) {
        throw new Error(`Error parseando JSON generado por la IA: ${parseErr.message}. Texto recibido: ${aiText}`);
      }
    }

    return new Response(
      JSON.stringify(resultJson),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: any) {
    console.error("Error in Edge Function:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }), 
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
