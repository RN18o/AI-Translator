import { useEffect, useState } from "react";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: "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",
  dangerouslyAllowBrowser: "true",
});

const useTranslate = (sourceText, selectedLanguage) => {
  const [targetText, setTargetText] = useState("");

  useEffect(() => {
    const handleTranslate = async (sourceText) => {
      try {
        const response = await groq.chat.completions.create({
          messages: [
            {
              role: "user",
              content: `You will be provided with a sentence. This sentence: 
              ${sourceText}. Your tasks are to:
              - Detect what language the sentence is in
              - Translate the sentence into ${selectedLanguage}
              Do not return anything other than the translated sentence.`,
            },
          ],
          model: "llama3-8b-8192",
        });

        if (
          response.choices &&
          response.choices[0] &&
          response.choices[0].message &&
          response.choices[0].message.content
        ) {
          const data = response.choices[0].message.content;
          setTargetText(data);
        } else {
          setTargetText("");
        }
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

  return targetText;
};

export default useTranslate;

// import Groq from "groq-sdk";

// const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// export async function main() {
//   const chatCompletion = await getGroqChatCompletion();
//   // Print the completion returned by the LLM.
//   console.log(chatCompletion.choices[0]?.message?.content || "");
// }

// export async function getGroqChatCompletion() {
//   return groq.chat.completions.create({
//     messages: [
//       {
//         role: "user",
//         content: "Explain the importance of fast language models",
//       },
//     ],
//     model: "llama3-8b-8192",
//   });
// }
