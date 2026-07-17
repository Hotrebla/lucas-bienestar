const url = 'https://szknxzcdlrnrotkdcufd.supabase.co/functions/v1/vertex-ai';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6a254emNkbHJucm90a2RjdWZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIxNDkzNDIsImV4cCI6MjA5NzcyNTM0Mn0.IGiLGgSJdBJoNbnZkk2q2ihC-UwvCmw8lS_BmYSGEgo';

async function test() {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${anonKey}`
      },
      body: JSON.stringify({
        lessonId: "nutrition_1",
        topic: "Los Macronutrientes",
        category: "nutrition",
        difficulty: "basic"
      })
    });
    
    console.log('Status Code:', res.status);
    const json = await res.json();
    console.log('Response JSON:', JSON.stringify(json, null, 2));
  } catch (err) {
    console.error('Fetch Error:', err);
  }
}

test();
