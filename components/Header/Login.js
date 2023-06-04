import React, {useRef, useState, useEffect} from "react";
import styled from "styled-components";
import AccountInput from "./AccountInput";
import {useRouter} from "next/router";
import Image from "next/image";
import {theme} from "../../styles/defaultTheme";
import {auth} from "../../firebase";
import {signInWithEmailAndPassword} from "firebase/auth";

const Login = ({handleCloseLogin}) => {
  const emailIcon = require("../Icons/emailIcon.png");
  const keyIcon = require("../Icons/keyIcon.png");
  const closeIcon = require("../Icons/closeIcon.png");

  // Login handling

  const [fields, setFields] = useState({
    email: "",
    password: "",
  });

  const loginFunction = async () => {
    try {
      await signInWithEmailAndPassword(auth, fields.email, fields.password);
      setErrorMsgDisplay(false);
      router.push("/");
      handleCloseLogin();
    } catch (error) {
      setErrorMsgDisplay(true);
    }
  };

  const handleChange = (event) => {
    const {name, value} = event.target;
    setFields((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const [errorMsgDisplay, setErrorMsgDisplay] = useState(false);

  // Login popup handling

  const popupRef = useRef(null);
  const handleClickOutside = (event) => {
    if (popupRef.current && !popupRef.current.contains(event.target)) {
      handleCloseLogin();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  // Redirection to Create account page

  const router = useRouter();
  function openCreateAccountPage() {
    router.push("/CreateAccount");
  }

  return (
    <>
      <Backdrop />
      <Container ref={popupRef}>
        <TopSection>
          <Headers>
            <H2>Login</H2>
            <P>Sign in to your account</P>
          </Headers>
          <Image
            onClick={handleCloseLogin}
            src={closeIcon}
            width={20}
            height={20}
            alt="closeWindow"
          />
        </TopSection>
        <InputContainer>
          <AccountInput
            imageSrc={emailIcon}
            imageAlt={"Email icon"}
            placeholder={"Email"}
            type={"text"}
            handleChange={handleChange}
            name={"email"}
          ></AccountInput>
          <AccountInput
            imageSrc={keyIcon}
            imageAlt={"Key icon"}
            placeholder={"Password"}
            type={"password"}
            name={"password"}
            handleChange={handleChange}
          ></AccountInput>
          {errorMsgDisplay && <ErrorP>Incorrect username or password</ErrorP>}
          <CreateAccountButton onClick={loginFunction}>
            Login
          </CreateAccountButton>
          <LoginButton onClick={openCreateAccountPage}>
            Register New Account
          </LoginButton>
        </InputContainer>
      </Container>
    </>
  );
};
export default Login;

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1;
`;

const Container = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  background-color: white;
  padding: ${theme.spacings.px20};
  border-radius: ${theme.spacings.px10};
`;

const TopSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
`;

const Headers = styled.div`
  display: flex;
  flex-direction: column;
`;

const H2 = styled.h2`
  color: ${theme.colors.greenDark};
  font-size: ${theme.fontSizes.px36};
  font-weight: ${theme.fontWeight.w700};
  margin: 0;
`;

const P = styled.p`
  color: ${theme.colors.black};
  font-size: ${theme.fontSizes.px15};
  font-weight: ${theme.fontWeight.w500};
  margin-bottom: ${theme.spacings.px20};
  margin-top: 0;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: ${theme.spacings.px10};
`;

const CreateAccountButton = styled.div`
  width: 100%;
  color: ${theme.colors.white};
  background-color: ${theme.colors.greenDark};
  font-size: ${theme.fontSizes.px20};
  font-weight: ${theme.fontWeight.w500};
  padding: ${theme.spacings.px10};
  text-align: center;
  border-radius: ${theme.spacings.px10};
  margin-bottom: ${theme.spacings.px20};
  box-shadow: ${theme.shadows.default};

  &:hover {
    box-shadow: ${theme.shadows.hoverShadow};
  }
`;

const LoginButton = styled.div`
  width: 100%;
  color: ${theme.colors.grey};
  background-color: ${theme.colors.white};
  font-size: ${theme.spacings.px20};
  font-weight: ${theme.fontWeight.w500};
  padding: ${theme.spacings.px10};
  text-align: center;
  border-radius: ${theme.spacings.px10};
  box-shadow: ${theme.shadows.default};
  &:hover {
    box-shadow: ${theme.shadows.hoverShadow};
  }
`;

const ErrorP = styled.p`
  color: red;
  font-size: ${theme.fontSizes.px15};
  font-weight: ${theme.fontWeight.w500};
  margin-bottom: ${theme.spacings.px20};
  margin-top: 0;
  align-self: center;
`;
