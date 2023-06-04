import React, {useRef, useEffect} from "react";
import styled from "styled-components";
import {theme} from "../../styles/defaultTheme";

const AboutUs = ({handleCloseAboutUs}) => {
  // AboutUs popup handling
  const popupRef = useRef(null);
  const handleClickOutside = (event) => {
    if (popupRef.current && !popupRef.current.contains(event.target)) {
      handleCloseAboutUs();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  return (
    <>
      <Backdrop />
      <Container ref={popupRef}>
        <HeaderContainer>
          <H1>About us</H1>
        </HeaderContainer>
        <p>
          TelMe is a school project that is focused on cloud systems. The
          purpose of this project is a website where user can look through
          movies, check information about them, add these movies to their{" "}
          <b>Favorite</b> list or <b>Watched</b> list if their already seen this
          specific movies or they can create their own specific lists for
          different categories of movies. They can also seen some statistics
          about their watched movies in the profile popup window. This
          application uses Firebase for its backend serveces, Vercel for
          deployment and TMdb for movies and actors information
        </p>
      </Container>
    </>
  );
};
export default AboutUs;

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

const H1 = styled.h1`
  text-align: center;
  position: relative;
  margin: 0;
  font-size: ${theme.fontSizes.px36};
  font-weight: ${theme.fontWeight.w700};
  color: ${theme.colors.greenDark};
  padding: 0 ${theme.spacings.px20};
  border-bottom: 1px solid rgba(0, 0, 0, 0.5);
`;

const HeaderContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: ${theme.spacings.px20};
`;
