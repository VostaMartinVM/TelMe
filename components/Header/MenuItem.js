import React, {useState} from "react";
import Image from "next/image";
import styled from "styled-components";
import {theme} from "../../styles/defaultTheme";

function MenuItem(props) {
  const {menuItemImage, text} = props;

  return (
    <Container>
      <Image
        src={menuItemImage}
        width={20}
        height={20}
        alt="menuIcon"
      />
      <MenuText>{text}</MenuText>
    </Container>
  );
}

export default MenuItem;

const Container = styled.li`
  display: flex;
  align-items: center;
  justify-content: start;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    box-shadow: 0 4px 4px -2px rgba(0, 0, 0, 0.15);
    transform: scale(1.03);
  }
`;

const MenuText = styled.p`
  max-width: 100px;
  padding-left: ${theme.spacings.px20};
  font-weight: ${theme.fontWeight.w500};
`;
