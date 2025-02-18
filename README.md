# Textbuddy AI

Textbuddy AI is a powerful web-based tool that allows users to:

- **Detect** the language of a given text.
- **Summarize** text into concise versions.
- **Translate** supported languages into another.

## 🚀 Features

- **Language Detection:** Identify the language of any given text.
- **Text Summarization:** Get a concise summary of long text content.
- **Text Translation:** Translate text between supported languages.

## 🛠️ Setup & Installation

### Prerequisites

- **Google Chrome (v131-136 recommended)**
- **React (Installed via Node.js & npm/yarn)**
- **Experimental Web Platform Features Enabled**
  - Open Chrome and go to `chrome://flags/`
  - Search for `Experimental Web Platform features`
  - Enable the flag and restart Chrome

### Installation Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/textbuddy-ai.git
   cd textbuddy-ai
   ```
2. **Install Dependencies**
   ```bash
   npm install
   ```
3. **Run the Application**
   ```bash
   npm start
   ```

## 🔑 Usage

### Language Detection

```javascript
const detectedLanguage = await window.ai.languageDetector.detect(text);
console.log(`Detected Language: ${detectedLanguage.language}`);
```

### Text Summarization

```javascript
const summarizer = await window.ai.summarizer.create({ model: "gemini" });
await summarizer.ready;
const result = await summarizer.summarize(text, { type: "paragraph" });
console.log(`Summary: ${result.summary}`);
```

### Text Translation

```javascript
const translator = await window.ai.translator.create({
  model: "gemini",
  sourceLanguage: "auto",
  targetLanguage: "es",
});
await translator.ready;
const translatedText = await translator.translate(text);
console.log(`Translated Text: ${translatedText.translation}`);
```

## 🛠 Troubleshooting

- Ensure you're using **Google Chrome (v131-136 recommended).**
- Enable `Experimental Web Platform Features` in `chrome://flags/`.
- Check `console.log(window.ai)` to confirm API availability.
- Make sure your **Origin Trial Token** is added to `index.html`:
  ```html
  <meta http-equiv="origin-trial" content="YOUR_ORIGIN_TRIAL_TOKEN_HERE" />
  ```

## 📜 License

This project is licensed under the **MIT License**.

## 🤝 Contributing

Pull requests and contributions are welcome! Open an issue for suggestions.
