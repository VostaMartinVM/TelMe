import React, {useState} from "react";
import styled from "styled-components";
import ProfileDropdown from "./ProfileDropdown";
import Searchbar from "./Searchbar";
import {theme} from "../../styles/defaultTheme";

const Header = () => {
  return (
    <>
      <Container>
        <Searchbar />
        <ProfileDropdown></ProfileDropdown>
      </Container>
    </>
  );
};

export default Header;

const Container = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${theme.spacings.px20} 30px ${theme.spacings.px20} 20px;
`;
