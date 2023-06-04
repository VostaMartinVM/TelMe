import React, { useRef, useState } from "react";
import styled from "styled-components";
import Image from "next/image";
import { theme } from "../../styles/defaultTheme";
import { useDispatch } from "react-redux";
import { setMovieSearchTermState } from "../../redux/movieSlice";
import { setActorSearchTermState } from "../../redux/actorSlice";
import { useRouter } from "next/router";

const Searchbar = () => {
  const searchIcon = require("../Icons/searchIcon.png");
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState();
  const router = useRouter();

  const inputRef = useRef(null);

  const handleInputClick = () => {
    inputRef.current.focus();
  };

  const inputChangeHandle = (e) => {
    setSearchTerm(e.target.value);
    onSearch();
  };

  const onSearch = () => {
    if (router.pathname.includes("Actors")) {
      dispatch(setActorSearchTermState(searchTerm));
    } else {
      dispatch(setMovieSearchTermState(searchTerm));
    }
  };

  return (
    <>
      <Container>
        <InputWrap onClick={handleInputClick}>
          <Input
            ref={inputRef}
            type="text"
            placeholder="Search..."
            onChange={inputChangeHandle}
          />
          <button
            onClick={onSearch()}
            style={{ backgroundColor: theme.colors.white, border: "none" }}
          >
            <Image src={searchIcon} width={20} height={20} alt="searchIcon" />
          </button>
        </InputWrap>
      </Container>
    </>
  );
};

export default Searchbar;

const Container = styled.div`
  position: relative;
  display: inline-block;
`;

const InputWrap = styled.div`
  background-color: ${theme.colors.white};
  display: flex;
  align-items: center;
  border-radius: ${theme.spacings.px10};
  height: 40px;
  width: 300px;
  border-color: black;
  border-width: 1px;
  margin-right: 100px;
  position: relative;
  padding-right: ${theme.spacings.px10};
  box-shadow: ${theme.shadows.default};
  &:hover {
    box-shadow: ${theme.shadows.hoverShadow};
    border: 1px black;
  }
`;

const Input = styled.input`
  background-color: white;
  color: black;
  border: none;
  width: 100%;
  height: 100%;
  margin: ${theme.spacings.px10};
  &:focus {
    outline: none;
    border: none;
    box-shadow: none;
  }
`;

const SearchDropdown = styled.div`
  position: absolute;
  background-color: white;
  top: 50px;
  width: 300px;
  border-radius: ${theme.spacings.px10};
  box-shadow: ${theme.shadows.default};
  z-index: 10;
  margin-bottom: 100px;
`;

const DropdownItem = styled.button`
  display: flex;
  position: relative;
  flex-direction: row;
  padding: ${theme.spacings.px10};
  &:hover {
    background-color: ${theme.colors.grey2};
  }
`;
