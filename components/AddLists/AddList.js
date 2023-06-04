import React, {useRef, useState, useEffect} from "react";
import styled from "styled-components";
import Image from "next/image";
import {theme} from "../../styles/defaultTheme";
import {db} from "../../firebase";
import {ref, update} from "firebase/database";
import {useAuth} from "../../useAuth";

const AddList = ({handleCloseAddList}) => {
  const closeCross = require("../Icons/closeCross.svg");

  // AddList popup handling

  const popupRef = useRef(null);
  const handleClickOutside = (event) => {
    if (popupRef.current && !popupRef.current.contains(event.target)) {
      handleCloseAddList();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  // User list handling
  const user = useAuth();
  const [inputData, setInputData] = useState("");

  const handleInputChange = (event) => {
    setInputData(event.target.value);
  };

  const handleSubmit = async () => {
    if (user) {
      const documentId = inputData;
      const documentData = {
        [documentId]: {
          name: documentId,
        },
      };
      await update(ref(db, `users/${user.uid}/Lists`), documentData);
    }
  };

  return (
    <>
      <Container ref={popupRef}>
        <TopSection>
          <H2>Login</H2>
          <Image
            onClick={handleCloseAddList}
            src={closeCross}
            width={40}
            height={40}
            alt="closeCross"
          />
        </TopSection>
        <InputWrapper>
          <P>List name:</P>
          <Input
            type="text"
            onChange={handleInputChange}
          ></Input>
        </InputWrapper>
        <CreateButton
          onClick={() => {
            handleSubmit();
            handleCloseAddList();
          }}
        >
          Create List
        </CreateButton>
      </Container>
    </>
  );
};
export default AddList;

const Container = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  background-color: white;
  padding: ${theme.spacings.px20};
  border-radius: ${theme.spacings.px10};
  box-shadow: ${theme.shadows.default};
`;

const TopSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
`;

const H2 = styled.h2`
  color: ${theme.colors.greenDark};
  font-size: ${theme.fontSizes.px36};
  font-weight: ${theme.fontWeight.w700};
  margin: 0;
`;

const P = styled.p`
  color: ${theme.colors.black};
  font-size: ${theme.fontSizes.px20};
  font-weight: ${theme.fontWeight.w500};
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-items: center;
  align-items: center;
  padding: ${theme.spacings.px10};
`;

const Input = styled.input`
  color: black;
  height: 40px;
  font-size: ${theme.spacings.px20};
  font-weight: ${theme.fontWeight.w500};
  background-color: ${theme.colors.white};
  border: none;
  margin-left: ${theme.spacings.px20};
  border-bottom: 1px solid rgba(0, 0, 0, 0.15);
  &::placeholder {
    color: ${theme.colors.grey};
    opacity: 0.5;
    font-weight: ${theme.fontWeight.w300};
  }

  &:focus {
    outline: none;
  }
`;

const CreateButton = styled.div`
  width: 100%;
  color: ${theme.colors.white};
  background-color: ${theme.colors.beige};
  font-size: ${theme.spacings.px20};
  font-weight: ${theme.fontWeight.w700};
  padding: ${theme.spacings.px10};
  text-align: center;
  border-radius: ${theme.spacings.px10};
  box-shadow: ${theme.shadows.default};
  &:hover {
    box-shadow: ${theme.shadows.hoverShadow};
  }
`;
