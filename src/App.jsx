import { useState } from "react";
import Layout from "./ui/Layout";
import styled from "styled-components";
import { Toaster } from "react-hot-toast";

const StyledApp = styled.div`
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem 5rem 0rem;

  @media (max-width: 550px) {
    padding: 1rem 2rem 0rem;
  }
`;

const Header = styled.div`
  text-align: center;
`;
function App() {
  return (
    <>
      <StyledApp>
        <Header>
          <h2>TextBuddy</h2>
          <p>
            Your go-to buddy for detecting languages, summarizing long texts,
            and translating with ease!
          </p>
        </Header>
        <Layout />
      </StyledApp>
      <Toaster
        position="top-center"
        gutter={12}
        containerStyle={{ margin: "8px" }}
        toastOptions={{
          success: {
            duration: 2000,
          },
          error: {
            duration: 5000,
          },

          style: {
            fontSize: "16px",
            maxWidth: "500px",
            padding: "16px 24px",
            backgroundColor: "var(--color-secondary-1)",
          },
        }}
      />
    </>
  );
}

export default App;
