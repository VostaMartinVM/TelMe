import Navbar from "../components/Navbar/Navbar";
import styled, { ThemeProvider } from "styled-components";
import "styled-components";
import "../styles/globals.css";
import Header from "../components/Header/Header";
import GlobalStyle from "../styles/global";
import { theme } from "../styles/defaultTheme";
import { AuthProvider } from "../Auth";
import { store } from "../redux/store";
import { Provider } from "react-redux";
import { useRouter } from "next/router";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  if (router.pathname.includes("CreateAccount")) {
    return <Component {...pageProps} />;
  }

  return (
    <AuthProvider>
      <Provider store={store}>
        <Container>
          <Navbar />
          <ThemeProvider theme={theme}>
            <BodyContainer>
              <GlobalStyle />
              <Header />
              <Component {...pageProps} />
            </BodyContainer>
          </ThemeProvider>
        </Container>
      </Provider>
    </AuthProvider>
  );
}

export default MyApp;

const Container = styled.div`
  width: 100%;
  display: flex;
  background-color: #e0e0e0;
`;

const BodyContainer = styled.div`
  flex-direction: column;
  display: flex;
  width: 100%;
  height: 100%;
  margin-left: 250px;
  align-items: center;
  justify-content: center;
`;
