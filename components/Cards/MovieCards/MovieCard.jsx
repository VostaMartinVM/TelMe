import {useCallback, useEffect, useState} from "react";
import styled from "styled-components";
import MovieReview from "../../MovieReview";
import Image from "next/image";
import {theme} from "../../../styles/defaultTheme";
import MovieDetailsCard from "./MovieDetailsCard";
import {remove, ref} from "firebase/database";
import {db} from "../../../firebase";
import {useAuth} from "../../../useAuth";
export const defaultMovieImage = require("../../Icons/defaultImage.svg");

const MovieCard = ({id, deleteButton, listName, naked}) => {
  const [isMovieInfoVisible, setIsMovieInfoVisible] = useState(false);
  const [movieDetails, setMovieDetails] = useState();
  const trashIcon = require("../../Icons/delete.png");
  const user = useAuth();

  const getDetails = useCallback(() => {
    const url = `https://api.themoviedb.org/3/movie/${id}?language=en-US`;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN}`,
      },
    };

    fetch(url, options)
      .then((res) => res.json())
      .then((json) => setMovieDetails(json))
      .catch((err) => console.error("error:" + err));
  }, [id]);

  useEffect(() => {
    getDetails();
  }, [id]);

  const formatYearPublished = () => {
    const year = movieDetails?.release_date?.toString();
    if (!year) {
      return "2010";
    }
    return year?.slice(0, 4);
  };

  // Delete from list

  const deleteFromList = () => {
    if (listName && id) {
      const movieList = listName;
      const movieId = id;

      const userRef = ref(
        db,
        `users/${user.uid}/Lists/${movieList}/${movieId}`
      );
      remove(userRef).catch((error) => {
        console.error("Error deleting list:", error);
      });
    }
  };

  return (
    <>
      <MovieCardWrapper
        naked={naked}
        onClick={() =>
          isMovieInfoVisible
            ? setIsMovieInfoVisible(false)
            : setIsMovieInfoVisible(true)
        }
      >
        <ImageWrapper>
          {deleteButton && (
            <DeleteButton onClick={deleteFromList}>
              <Image
                alt="delete button"
                width={20}
                height={20}
                src={trashIcon}
              />
            </DeleteButton>
          )}

          <Image
            alt="image"
            fill={true}
            style={{borderRadius: 10, objectFit: "cover"}}
            src={
              movieDetails?.poster_path
                ? `https://image.tmdb.org/t/p/w500${movieDetails?.poster_path}`
                : defaultMovieImage
            }
          />
        </ImageWrapper>
        <MovieInfoWrapper>
          <MovieTittle>{movieDetails?.title ?? "Test title"}</MovieTittle>
          <MovieReview
            rating={movieDetails?.vote_average}
            starDimension="15px"
          />
          <YearDurationContainer>
            <YearDurationWrapper>
              <text style={{fontSize: 12, color: "#989898"}}>
                {formatYearPublished()}
              </text>
            </YearDurationWrapper>
            <YearDurationWrapper>
              <text style={{fontSize: 12, color: "#989898"}}>
                {movieDetails?.runtime ? `${movieDetails?.runtime}m` : "136m"}
              </text>
            </YearDurationWrapper>
          </YearDurationContainer>
        </MovieInfoWrapper>
      </MovieCardWrapper>
      <MovieDetailsCard
        visible={isMovieInfoVisible}
        title={movieDetails?.title}
        rating={movieDetails?.vote_average}
        productionYear={formatYearPublished()}
        duration={movieDetails?.runtime}
        picture={movieDetails?.poster_path}
        description={movieDetails?.overview}
        id={movieDetails?.id}
      />
    </>
  );
};

export default MovieCard;

const MovieCardWrapper = styled.div`
  border: 2px solid ${theme.colors.grey2};
  border-radius: ${theme.spacings.px10};
  width: 170px;
  padding: ${theme.spacings.px10};
  display: flex;
  position: relative;
  flex-direction: column;
  justify-content: center;
  background-color: ${theme.colors.white};
  ${(props) =>
    !props.naked ? `box-shadow: ${theme.shadows.default}` : `margin: 20px 0`};
  transition: transform 0.3s;
  padding: 10px;
  cursor: pointer;

  &:hover {
    transform: scale(1.02);
    ${(props) =>
      !props.naked ? `box-shadow: ${theme.shadows.hoverShadow}` : ``};
  }
`;

const ImageWrapper = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  justify-content: center;
  background: #b9b9b9;
  border-radius: ${theme.spacings.px10};
  height: 150px;
`;

const MovieTittle = styled.text`
  padding-top: ${theme.spacings.px10};
  font-size: ${theme.fontSizes.px15};
  font-weight: ${theme.fontWeight.w500};
  height: 50px;
  text-overflow: ellipsis;
  overflow: hidden;
  width: 100px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
`;

const MovieInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const YearDurationContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  margin-top: ${theme.spacings.px5};
`;

const YearDurationWrapper = styled.div`
  padding: 0px ${theme.spacings.px5} 2px ${theme.spacings.px5};
  border: 1px solid #e1e1e1;
  border-radius: ${theme.spacings.px20};
  min-width: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const DeleteButton = styled.div`
  position: absolute;
  right: 5px;
  top: 5px;
  z-index: 1;
  opacity: 0.5;
  transition: all 0.3s;

  &:hover {
    opacity: 1;
    transform: scale(1.1);
  }
`;
