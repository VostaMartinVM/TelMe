import React from "react";
import Image from "next/image";
import {theme} from "../../styles/defaultTheme";
import styled from "styled-components";

function AccountInput(props) {
  const {imageSrc, imageAlt, placeholder, type, name, handleChange} = props;

  return (
    <>
      <InputField>
        <Image
          src={imageSrc}
          width={20}
          height={20}
          alt={imageAlt}
        />
        <Input
          type={type}
          placeholder={placeholder}
          name={name}
          onChange={handleChange}
        ></Input>
      </InputField>
    </>
  );
}

export default AccountInput;

const InputField = styled.div`
  border-radius: ${theme.spacings.px10};
  border-color: ${theme.colors.trueBlack};
  border-width: 1px;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: ${theme.spacings.px10} ${theme.spacings.px20};
  margin-bottom: ${theme.spacings.px20};
  box-shadow: ${theme.shadows.default};
`;

const Input = styled.input`
  color: black;
  font-size: ${theme.spacings.px20};
  font-weight: ${theme.fontWeight.w500};
  background-color: ${theme.colors.white};
  border: none;
  margin-left: ${theme.spacings.px20};
  &::placeholder {
    color: ${theme.colors.grey};
    opacity: 0.5;
    font-weight: ${theme.fontWeight.w300};
  }

  &:focus {
    outline: none;
    border: none;
    box-shadow: none;
  }
`;
