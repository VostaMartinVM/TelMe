import React from "react";
import styled from "styled-components";
import StarRatings from "react-star-ratings";
import { theme } from "../styles/defaultTheme";
import Image from "next/image";

const MovieReview = ({ rating, starDimension }) => {
  const starImage = require("../components/Icons/reviewStar.svg");
  return (
    <Container>
      <StarsContainer>
        {rating ? (
          <StarRatings
            rating={rating / 2}
            starRatedColor={theme.colors.reviewStarYellow}
            starEmptyColor="grey"
            name={rating}
            starDimension={starDimension}
            starSpacing="1px"
          />
        ) : (
          <Image src={starImage} height={15} width={15} alt="star" />
        )}
      </StarsContainer>
      <NumberContainer style={{ fontSize: starDimension }}>
        {rating ? Math.round(rating * 10) / 10 : "0.0"}
      </NumberContainer>
    </Container>
  );
};

export default MovieReview;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background: #ffffff;
`;

const StarsContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const NumberContainer = styled.text`
  display: flex;
  padding-left: 5px;
  align-items: center;
`;
