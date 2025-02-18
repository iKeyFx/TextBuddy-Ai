const languageMap = {
  en: "English",
  pt: "Portuguese",
  es: "Spanish",
  ru: "Russian",
  tr: "Turkish",
  fr: "French",
  de: "German",
  it: "Italian",
  nl: "Dutch",
  pl: "Polish",
  ar: "Arabic",
  zh: "Chinese",
  ja: "Japanese",
  ko: "Korean",
  hi: "Hindi",
};

export const getLanguageName = (code) => {
  if (!code) return "Unknown";

  const normalizedCode = code.toLowerCase();

  const mainCode = normalizedCode.split("-")[0];
  return languageMap[mainCode] || code;
};
