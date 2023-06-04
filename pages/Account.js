import React, {useState} from "react";
import styled from "styled-components";
import {theme} from "../styles/defaultTheme";

const Account = () => {
  return (
    <Container>
      <h2>Account</h2>
    </Container>
  );
};
export default Account;

const Container = styled.div`
  width: 100%;
  padding: ${theme.spacings.px20};
`;
