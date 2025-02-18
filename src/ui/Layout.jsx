import { useState } from "react";
import { FaArrowUpLong } from "react-icons/fa6";
import styled from "styled-components";
import {
  detectLanguage,
  summarizeText,
  translateText,
} from "../services/apiAi";
import toast from "react-hot-toast";
import { getLanguageName } from "../util/FormatLangCode";
import SpinnerMini from "./SpinnerMini";

// Styled components remain unchanged...
const Main = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-height: 100vh;
  position: relative;
`;

const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
`;

const OutputContainer = styled.div`
  display: flex;
  flex-direction: column;
  color: var(--color-secondary-1);
  align-self: flex-end;
  max-width: 80%;

  @media (max-width: 550px) {
    align-self: center;
  }
`;

const OutputText = styled.div`
  border: 1px solid var(--color-primary-1);
  border-radius: 8px;
  width: 98%;
  min-height: 80px;
  font-size: 1rem;
  padding: 0.5rem;
  overflow-wrap: break-word;
  white-space: pre-wrap;
  background-color: #000;
`;

const StyledOutputDetails = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;

  p {
    margin: 0;
    font-size: 0.9rem;
  }

  button {
    background-color: var(--color-primary-1);
    color: var(--color-secondary-1);
    border: none;
    border-radius: 4px;
    padding: 0.25rem 0.5rem;
    font-size: 0.9rem;
    cursor: pointer;
    min-width: 80px;

    &:hover {
      color: #000;
    }

    &:disabled {
      cursor: not-allowed;
    }
  }

  .translate-controls {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.5rem;

    select {
      padding: 0.25rem;
      border-radius: 4px;
      border: 1px solid var(--color-primary-1);
    }
  }
`;

const ResponseAContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  max-width: 80%;

  @media (max-width: 550px) {
    align-self: center;
  }
`;

const ResponseText = styled.div`
  border: 1px solid var(--color-primary-1);
  border-radius: 8px;
  width: 100%;
  min-height: 80px;
  font-size: 1rem;
  padding: 0.5rem;
  overflow-wrap: break-word;
  white-space: pre-wrap;
  background-color: #000;
`;

const ContainerInputData = styled.div`
  width: 100%;
  padding: 1rem;
  position: sticky;
  bottom: 0;
`;

const InputContainer = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;

  textarea {
    border: 1px solid var(--color-primary-1);
    border-radius: 8px;
    width: 100%;
    max-width: 1200px;
    min-height: 50px;
    font-size: 1rem;
    padding: 0.75rem 2.5rem 0.75rem 0.75rem;
    resize: none;
  }
`;

const Button = styled.button`
  background-color: var(--color-primary-1);
  border: none;
  border-radius: 50%;
  position: absolute;
  right: 10px;
  bottom: calc(50% - 15px);
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-direction: column;
`;

const StyledIcon = styled(FaArrowUpLong)`
  width: 15px;
  height: 15px;
`;

function Layout() {
  const [inputValue, setInputValue] = useState("");
  const [submittedText, setSubmittedText] = useState("");
  const [detectedLanguage, setDetectedLanguage] = useState(null);
  const [error, setError] = useState(null);
  const [showOutput, setShowOutput] = useState(false);
  const [showResponse, setShowResponse] = useState(false);
  const [aiResponse, setAiResponse] = useState("");
  const [summaryText, setSummaryText] = useState("");
  const [isLoadingSum, setIsLoadingSum] = useState(false);
  const [isLoadingTranslate, setIsLoadingTranslate] = useState(false);

  const shouldShowSummarizeButton = () => {
    return submittedText.length > 150 && detectedLanguage === "en";
  };

  const handleInputSubmit = () => {
    if (!inputValue.trim()) {
      toast.error("Input box is empty");
      setShowOutput(false);
      setShowResponse(false);
      return;
    }

    setSubmittedText(inputValue);
    setInputValue("");
    setShowOutput(true);
    setShowResponse(false);
    detectLanguage({
      inputValue,
      setDetectedLanguage: (langCode) => setDetectedLanguage(langCode),
      setError,
    });
  };

  const handleSummarize = () => {
    if (!submittedText.trim()) {
      toast.error("No text to summarize");
      return;
    }

    summarizeText({
      setSummaryText,
      submittedText,
      setError,
      setAiResponse,
      setIsLoadingSum,
    });

    setShowResponse(true);
  };

  const handleTranslate = async () => {
    if (!submittedText.trim()) {
      toast.error("No text to translate");
      return;
    }

    const targetLanguageElement = document.getElementById("translate");
    const targetLanguageCode = targetLanguageElement.value;
    const targetLanguageName =
      targetLanguageElement.options[targetLanguageElement.selectedIndex].text;
    try {
      console.log(detectedLanguage, targetLanguageCode);
      setAiResponse(`Translating to ${targetLanguageName}...`);
      setShowResponse(true);

      const translation = await translateText({
        detectedLanguage,
        text: submittedText,
        targetLang: targetLanguageCode,
        setIsLoadingTranslate,
        setShowResponse,
      });

      if (translation !== null) {
        setAiResponse(translation);
        setShowResponse(true);
      }
    } catch (error) {
      setShowResponse(false);
    }
  };

  return (
    <Main>
      <Container>
        {showOutput && (
          <OutputContainer>
            <OutputText role="textbox" aria-multiline="true">
              {submittedText}
            </OutputText>
            <div></div>
            <StyledOutputDetails>
              <p>
                Language:{" "}
                {detectedLanguage
                  ? `${getLanguageName(detectedLanguage)} (${detectedLanguage})`
                  : "Detecting..."}
              </p>{" "}
              {shouldShowSummarizeButton() && (
                <button
                  disabled={isLoadingSum || isLoadingTranslate}
                  onClick={handleSummarize}
                >
                  {isLoadingSum ? <SpinnerMini /> : "Summarize"}
                </button>
              )}
              <div className="translate-controls">
                <label htmlFor="translate">Translate to:</label>
                <select name="translate" id="translate">
                  <option value="en">English (en)</option>
                  <option value="pt">Portuguese (pt)</option>
                  <option value="es">Spanish (es)</option>
                  <option value="ru">Russian (ru)</option>
                  <option value="tr">Turkish (tr)</option>
                  <option value="fr">French (fr)</option>
                </select>
                <button
                  disabled={isLoadingTranslate || isLoadingSum}
                  onClick={handleTranslate}
                >
                  {isLoadingTranslate ? <SpinnerMini /> : "Translate"}
                </button>
              </div>
            </StyledOutputDetails>
          </OutputContainer>
        )}

        {showResponse && (
          <ResponseAContainer>
            <ResponseText role="textbox" aria-multiline="true">
              {aiResponse}
            </ResponseText>
          </ResponseAContainer>
        )}
      </Container>
      <ContainerInputData>
        <InputContainer>
          <textarea
            placeholder="Type your text here..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <Button onClick={handleInputSubmit}>
            <StyledIcon />
          </Button>
        </InputContainer>
      </ContainerInputData>
    </Main>
  );
}

export default Layout;
