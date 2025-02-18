import toast from "react-hot-toast";
import { getLanguageName } from "../util/FormatLangCode";

export async function detectLanguage({
  inputValue,
  setDetectedLanguage,
  setError,
}) {
  if (!("ai" in window) || !("languageDetector" in window.ai)) {
    toast.error("Language Detection API is not supported in this browser.");
    setError("Language Detection API is not supported in this browser.");
    return;
  }

  try {
    const detector = await window.ai.languageDetector.create();
    await detector.ready;

    const result = await detector.detect(inputValue);
    setDetectedLanguage(result?.[0]?.detectedLanguage || "Unknown");
    setError("");
  } catch (err) {
    setError("Error detecting language.");
    toast.error("Having trouble detecting language");
    console.error(err);
  }
}

export async function summarizeText({
  submittedText,
  setSummaryText,
  setError,
  setAiResponse,
  setIsLoadingSum,
}) {
  if (!("ai" in window) || !("summarizer" in window.ai)) {
    toast.error("Summarizer API is not supported in this browser.");
    setError("Summarizer API is not supported in this browser.");
    return;
  }

  try {
    console.log("Creating summarize session...");
    setAiResponse(`Summarizing...`);
    setIsLoadingSum(true);

    const summarizer = await window.ai.summarizer.create();
    await summarizer.ready;

    const result = await summarizer.summarize(submittedText, {
      type: "paragraph",
    });
    console.log("summary Result:", result);
    setIsLoadingSum(false);
    setAiResponse(result || "No summary available.");
    setError("");
  } catch (err) {
    setIsLoadingSum(false);
    toast.error("Sorry, Unable to summarize the text");
    setError("Error generating summary.");
    console.error(err);
  }
}

export async function translateText({
  text,
  targetLang,
  detectedLanguage,
  setIsLoadingTranslate,
  setShowResponse,
}) {
  if (detectedLanguage === targetLang) {
    toast.error(
      "Source and target languages are the same. No translation needed."
    );
    setShowResponse(false);
    return null;
  }

  if (!("ai" in window) || !("translator" in window.ai)) {
    toast.error("Translator API is not supported in this browser.");

    setShowResponse(false);
    return null;
  }

  try {
    const capabilities = await window.ai.translator.capabilities();

    if (
      capabilities.languagePairAvailable(detectedLanguage, targetLang) === "no"
    ) {
      toast.error(
        `Translation from ${getLanguageName(
          detectedLanguage
        )} to ${getLanguageName(targetLang)} is not currently supported.`
      );
      setShowResponse(false);
      return null;
    }

    setIsLoadingTranslate(true);
    const translator = await window.ai.translator.create({
      model: "gemini",
      sourceLanguage: detectedLanguage,
      targetLanguage: targetLang,
    });

    await translator.ready;

    const result = await translator.translate(text);
    setIsLoadingTranslate(false);

    if (!result || typeof result !== "string" || result.trim() === "") {
      console.error(
        "Gemini API returned an unexpected or empty result:",
        result
      );
      toast.error(
        "Translation failed. Please try again or choose a different language."
      );

      setShowResponse(false);
      return null;
    }

    return result;
  } catch (err) {
    setIsLoadingTranslate(false);
    console.error("Translation Error:", err);
    setShowResponse(false);

    if (err !== "Language pair not supported") {
      toast.error("Translation failed. Please try again later.");
    }

    return null;
  }
}
