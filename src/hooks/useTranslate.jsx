import { useEffect, useState } from "react";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  dangerouslyAllowBrowser: true,
});

const useTranslate = (sourceText, selectedLanguage) => {
  const [targetText, setTargetText] = useState("");
  const [pronunciationText, setPronunciationText] = useState("");
  const [phoneticPronunciation, setPhoneticPronunciation] = useState("");

  useEffect(() => {
    const handleTranslate = async (sourceText) => {
      try {
        const response = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            {
              role: "user",
              content: `You will be provided with a sentence: "${sourceText}". Your tasks are to:
              - Detect what language the sentence is in.
              - Translate the sentence into ${selectedLanguage}, ensuring the translation avoids any inappropriate or offensive language.
              - Provide the pronunciation in ${selectedLanguage}, using phonetic symbols or simplified characters to ensure accurate pronunciation in Speech Synthesis APIs and that sounds more like human with more accuracy.
              Return only a JSON object in the exact format provided, with no extra symbols or markdown
              {
                "translation": "translated text here",
                "pronunciation": "pronunciation text here",
                "phoneticPronunciation": "phonetic pronunciation text here"
              }`,
            },
          ],
        });

        const data = JSON.parse(response.choices[0].message.content);
        setTargetText(data.translation);
        setPronunciationText(data.pronunciation);
        setPhoneticPronunciation(data.phoneticPronunciation);
        console.log(data.pronunciation)
      } catch (error) {
        console.error("Error translating text:", error);
      }
    };

    if (sourceText.trim()) {
      const timeoutId = setTimeout(() => {
        handleTranslate(sourceText);
      }, 500); // Adjust the delay as needed

      return () => clearTimeout(timeoutId);
    }
  }, [sourceText, selectedLanguage]);

  return { targetText, pronunciationText, phoneticPronunciation };
};

export default useTranslate;
