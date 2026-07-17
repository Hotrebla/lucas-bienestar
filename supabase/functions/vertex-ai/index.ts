// SUPABASE EDGE FUNCTION: vertex-ai
// Servidor de Deno seguro para consultar a Vertex AI (Google Cloud) usando Gemini 3.5 Flash de forma privada.
// Desplegar ejecutando: supabase functions deploy vertex-ai

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { create, Header, Payload } from "https://deno.land/x/djwt@v2.8/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Helper para obtener el Access Token de Google Cloud mediante Service Account
async function getAccessToken(clientEmail: string, privateKey: string): Promise<string> {
  // Limpiar y formatear la clave privada PEM
  const cleanKey = privateKey.replace(/\\n/g, '\n');
  const pemHeader = "-----BEGIN PRIVATE KEY-----";
  const pemFooter = "-----END PRIVATE KEY-----";
  
  let pemContents = cleanKey;
  if (cleanKey.includes(pemHeader)) {
    pemContents = cleanKey.substring(pemHeader.length, cleanKey.length - pemFooter.length);
  }
  pemContents = pemContents.replace(/\s/g, '');
  
  // Convertir clave base64 a ArrayBuffer (formato PKCS8)
  const binaryDerString = atob(pemContents);
  const binaryDer = new Uint8Array(binaryDerString.length);
  for (let i = 0; i < binaryDerString.length; i++) {
    binaryDer[i] = binaryDerString.charCodeAt(i);
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

    // 1. Obtener credenciales de Google Cloud desde los secretos de Supabase
    const gcpProjectId = Deno.env.get("GCP_PROJECT_ID");
    const gcpClientEmail = Deno.env.get("GCP_CLIENT_EMAIL");
    const gcpPrivateKey = Deno.env.get("GCP_PRIVATE_KEY");
    const gcpRegion = Deno.env.get("GCP_REGION") || "us-central1";
    const gcpModel = Deno.env.get("GCP_MODEL_NAME") || "gemini-3.5-flash"; // Default to July 2026 model

    // Lucas Avatar Role name
    const roleName = category === "training" ? "coach" : category === "habits" ? "zen" : "chef";
    const roleTitle = category === "training" ? "Lucas Coach 🏋️‍♂️" : category === "habits" ? "Lucas Zen 🧘‍♂️" : "Lucas Chef 👨‍🍳";

    // Si no están las credenciales configuradas, devolvemos mock data dinámico de prueba
    if (!gcpProjectId || !gcpPrivateKey || !gcpClientEmail) {
      console.warn("Vertex AI no configurado. Utilizando Mock Data.");
      
      // Crear contenido de lección estático simulado de prueba
      const mockResult = {
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

    // 2. Autenticación con Google Cloud OAuth2
    const token = await getAccessToken(gcpClientEmail, gcpPrivateKey);

    // 3. Prompt estructurado para Gemini 3.5 Flash
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

    // 4. Llamada a Vertex AI API (Gemini 3.5 Flash)
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
    
    // Obtener el texto del JSON retornado por la IA
    const aiText = responseData.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!aiText) {
      throw new Error("No se recibió respuesta de texto desde Vertex AI.");
    }

    // Parsear el JSON generado por Gemini
    const resultJson = JSON.parse(aiText.trim());

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
