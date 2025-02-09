const fetch = require("node-fetch");

exports.handler = async function(event, context) {
    const apiKey = process.env.OPENAI_API_KEY;

    const prompts = [
        "Write a deeply romantic love letter using poetic language. Avoid using names, 'husband,' or 'wife.' You may use general terms of endearment like 'my love' or 'darling.'",
        "Compose a poetic and heartfelt love letter filled with admiration. Do not mention 'husband' or 'wife,' but use universal love expressions.",
        "Create a passionate and emotional love letter for a soulmate, avoiding specific personal names.",
        "Write a nostalgic love letter that reflects on years of love and memories without specifying relationship titles.",
        "Express unconditional love in a beautifully written letter, using terms like 'my love' and 'dearest' instead of relationship labels."
    ];

    let randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];

    try {
        console.log("Sending request to OpenAI API...");
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{ role: "system", content: randomPrompt }],
                max_tokens: 200,
                temperature: 0.9
            })
        });

        if (!response.ok) {
            console.error(`OpenAI API Error: ${response.status} - ${response.statusText}`);
            throw new Error(`OpenAI API Error: ${response.status}`);
        }

        const data = await response.json();
        let loveLetter = data.choices[0].message.content.trim();

        // 🛑 Filter out specific words
        const bannedWords = ["husband", "wife", "your name"];
        const regex = new RegExp(`\\b(${bannedWords.join("|")})\\b`, "gi");
        loveLetter = loveLetter.replace(regex, "my love");

        console.log("Filtered Love Letter:", loveLetter);

        return {
            statusCode: 200,
            body: JSON.stringify({ text: loveLetter })
        };
    } catch (error) {
        console.error("Error fetching AI-generated love letter:", error);
        return { statusCode: 500, body: JSON.stringify({ error: "Failed to fetch love letter" }) };
    }
};
