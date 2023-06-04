import Image from "next/image";
import styled from "styled-components";
import MovieCard, {defaultMovieImage} from "./MovieCard";
import {useCallback, useEffect, useState, useRef} from "react";
import MovieReview from "../../MovieReview";
import CustomCarousel from "../../Carousel/Carousel";
import {Dialog} from "@mui/material";
import {theme} from "../../../styles/defaultTheme";
import DirectorActorCard from "../DirectorActorCards/DirectorActorCard";
import {db} from "../../../firebase";
import {onValue, ref, update} from "firebase/database";
import {useAuth} from "../../../useAuth";

const MovieDetailsCard = ({
  visible,
  title,
  rating,
  productionYear,
  duration,
  picture,
  description,
  id,
}) => {
  const crossImage = require("../../Icons/closeCross.svg");
  const fullHeart = require("../../Icons/fullHeart.png");
  const emptyHeart = require("../../Icons/greyHeart.png");
  const watchedIcon = require("../../Icons/watched.png");
  const notWatchedIcon = require("../../Icons/notWatched.png");

  const user = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [cast, setCast] = useState();
  const [crew, setCrew] = useState();
  const [directors, setDirectors] = useState([]);
  const [producers, setProducers] = useState([]);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [notIncludedInLists, setNotIncludedInLists] = useState([]);
  const [watched, setWatched] = useState();
  const [favorite, setFavorite] = useState();

  const getCredentials = useCallback(() => {
    const url = `https://api.themoviedb.org/3/movie/${id}/credits`;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN}`,
      },
    };

    fetch(url, options)
      .then((res) => res.json())
      .then((json) => {
        setCast(json.cast);
        setCrew(json.crew);
      })
      .catch((err) => console.error("error:" + err));
  }, [id]);

  const getSimilarMovies = useCallback(() => {
    const url = `https://api.themoviedb.org/3/movie/${id}/similar?language=en-US&page=1`;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN}`,
      },
    };

    fetch(url, options)
      .then((res) => res.json())
      .then((json) => setSimilarMovies(json.results))
      .catch((err) => console.error("error:" + err));
  }, [id]);

  useEffect(() => {
    getCredentials();
    getDirectors();
    getProducers();
    getSimilarMovies();
    setIsVisible(visible);
  }, [visible, id]);

  const getDirectors = () => {
    const directorsTemp = [];
    crew?.map((crewMember) =>
      crewMember.known_for_department === "Directing" &&
      !directorsTemp.includes(crewMember.name) &&
      directorsTemp.length <= 5
        ? directorsTemp.push(crewMember.name)
        : {}
    );
    setDirectors(directorsTemp);
  };

  const getProducers = () => {
    const producersTemp = [];
    crew?.map((crewMember) =>
      crewMember.known_for_department === "Production" &&
      !producersTemp.includes(crewMember.name) &&
      producersTemp.length <= 5
        ? producersTemp?.push(crewMember.name)
        : {}
    );
    setProducers(producersTemp);
  };

  //ListMenu menu handling
  const [ListMenuOpen, setListMenuOpen] = useState(false);
  const listMenuRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (listMenuRef.current && !listMenuRef.current.contains(event.target)) {
        setListMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [listMenuRef]);

  // Add movie to a list

  const handleSubmit = async (listInfoName) => {
    const movieId = id;
    const listName = listInfoName;
    const documentData = {
      [movieId]: movieId,
    };

    await update(ref(db, `users/${user.uid}/Lists/${listName}`), documentData);
  };

  // Handle click outside

  const popupRef = useRef(null);
  const handleClickOutside = (event) => {
    if (popupRef.current && !popupRef.current.contains(event.target)) {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  // Handle lists displaying

  useEffect(() => {
    if (user) {
      const userRef = ref(db, `users/${user.uid}/Lists`);
      const movieId = id;

      const fetchListNames = onValue(userRef, (snapshot) => {
        try {
          const lists = snapshot.val();
          const filteredListNames = Object.values(lists)
            .filter((list) => !Object.values(list).includes(movieId))
            .map((list) => list.name);

          const isFavoriteListIncluded = filteredListNames.includes("Favorite");
          console.log(filteredListNames, "su confused", isFavoriteListIncluded);
          setFavorite(!isFavoriteListIncluded);

          const isWatchedListIncluded = filteredListNames.includes("Watched");
          setWatched(!isWatchedListIncluded);

          const excludedLists = ["Favorite", "Watched"];
          const finalListNames = filteredListNames.filter(
            (name) => !excludedLists.includes(name)
          );

          setNotIncludedInLists(finalListNames);
        } catch (error) {
          console.error(error);
        }
      });

      return () => {
        fetchListNames();
      };
    }
  }, [user, id]);

  return (
    <>
      <DialogContainer
        scroll="body"
        maxWidth="lg"
        open={isVisible}
      >
        <CloseButtonWrapper onClick={() => setIsVisible(false)}>
          <Image
            alt="cross"
            src={crossImage}
            width={29}
            height={29}
          />
        </CloseButtonWrapper>
        <MovieCoverWrapper>
          <Image
            alt="image"
            fill={true}
            style={{borderRadius: 10, objectFit: "cover"}}
            src={
              `https://image.tmdb.org/t/p/w500${picture}` ?? defaultMovieImage
            }
          />
        </MovieCoverWrapper>
        <MovieInfoWrapper>
          <TitleReviewContainer>
            <TitleRatingHeader>
              <MovieTitle>{title ?? "Movie title"}</MovieTitle>
              <MovieReview
                rating={rating}
                starDimension={"25px"}
              />
            </TitleRatingHeader>

            <LeftSide>
              {notIncludedInLists && (
                <>
                  {watched ? (
                    <WhiteWrapper>
                      <Image
                        alt="watched"
                        src={watchedIcon}
                        width={15}
                        height={15}
                      />
                    </WhiteWrapper>
                  ) : (
                    <WhiteWrapper
                      onClick={() => {
                        handleSubmit("Watched");
                        setWatched(true);
                      }}
                    >
                      <Image
                        alt="notWatched"
                        src={notWatchedIcon}
                        width={15}
                        height={15}
                      />
                    </WhiteWrapper>
                  )}
                  {favorite ? (
                    <WhiteWrapper>
                      <Image
                        alt="watched"
                        src={fullHeart}
                        width={15}
                        height={15}
                      />
                    </WhiteWrapper>
                  ) : (
                    <WhiteWrapper
                      onClick={() => {
                        handleSubmit("Favorite");
                        setFavorite(true);
                      }}
                    >
                      <Image
                        alt="notWatched"
                        src={emptyHeart}
                        width={15}
                        height={15}
                      />
                    </WhiteWrapper>
                  )}
                  <AddMovieButton
                    onClick={() => {
                      setListMenuOpen(true);
                    }}
                  >
                    Add to list
                  </AddMovieButton>
                  {ListMenuOpen && (
                    <ListMenu ref={listMenuRef}>
                      <P>Your lists: </P>
                      {notIncludedInLists.length === 0 ? (
                        <p>There are no lists without this movie</p>
                      ) : (
                        notIncludedInLists.map((item, index) => (
                          <MenuItem
                            key={index}
                            onClick={() => {
                              setListMenuOpen(false);
                              handleSubmit(item);
                            }}
                          >
                            <MenuText>{item}</MenuText>
                          </MenuItem>
                        ))
                      )}
                    </ListMenu>
                  )}
                </>
              )}
            </LeftSide>
          </TitleReviewContainer>
          <text
            alt="descriptionLabel"
            style={{fontWeight: 700, fontSize: 15, marginTop: 10}}
          >
            Description:
          </text>
          <MovieDescription>{description ?? "No description"}</MovieDescription>
          <YearTimePgContainer>
            <YearDurationWrapper>
              <text style={{fontSize: 15, color: "#989898"}}>
                {productionYear ?? 2010}
              </text>
            </YearDurationWrapper>
            <YearDurationWrapper>
              <text style={{fontSize: 15, color: "#989898"}}>
                {`${duration}m` ?? "136m"}
              </text>
            </YearDurationWrapper>
            <YearDurationWrapper>
              <text style={{fontSize: 15, color: "#989898"}}>18+</text>
            </YearDurationWrapper>
          </YearTimePgContainer>
          <ProducersDirectorsContainer>
            <text
              alt="directorsLabel"
              style={{
                fontWeight: 700,
                fontSize: 15,
                marginRight: theme.spacings.px10,
              }}
            >
              Directors:
            </text>
            {directors?.length !== 0 ? (
              directors?.map((director) => (
                <text
                  key={director}
                  style={{marginRight: theme.spacings.px5}}
                >{`${director},`}</text>
              ))
            ) : (
              <text>No directors</text>
            )}
          </ProducersDirectorsContainer>
          <ProducersDirectorsContainer>
            <text
              alt="producersLabel"
              style={{
                fontWeight: 700,
                fontSize: 15,
                marginRight: theme.spacings.px10,
              }}
            >
              Producers:
            </text>
            {producers?.length !== 0 ? (
              producers?.map((producer) => (
                <text
                  key={producer}
                  style={{marginRight: theme.spacings.px5}}
                >{`${producer}, `}</text>
              ))
            ) : (
              <text>No producers</text>
            )}
          </ProducersDirectorsContainer>
          <CastLabel>
            <text style={{fontWeight: 700}}>Cast:</text>
          </CastLabel>
          {cast?.length === 0 && !cast ? (
            <text>No cast found</text>
          ) : (
            <CustomCarousel>
              {cast?.map((actor) => (
                <DirectorActorCard
                  key={actor.id}
                  id={actor.id}
                />
              ))}
            </CustomCarousel>
          )}
          <CastLabel style={{marginTop: theme.spacings.px30}}>
            <text style={{fontWeight: 700}}>Other movies like that:</text>
          </CastLabel>
          {similarMovies?.length !== 0 ? (
            <CustomCarousel>
              {similarMovies?.map((movie) => (
                <MovieCard
                  key={movie.id}
                  id={movie.id}
                  naked={true}
                />
              ))}
            </CustomCarousel>
          ) : (
            <text>No similar work found</text>
          )}
        </MovieInfoWrapper>
      </DialogContainer>
    </>
  );
};

export default MovieDetailsCard;

const DialogContainer = styled(Dialog)`
  border-radius: 10px;
`;
const CloseButtonWrapper = styled.div`
  width: 29px;
  height: 29px;
  position: absolute;
  right: 0;
  margin-top: 20px;
  margin-right: 20px;
`;

const MovieCoverWrapper = styled.div`
  background-color: #b9b9b9;
  height: 350px;
  min-width: 700px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  margin: 60px 60px 0px 60px;
`;

const MovieInfoWrapper = styled.div`
  padding-left: 60px;
  padding-right: 60px;
  padding-bottom: 60px;
  display: flex;
  flex-direction: column;
`;

const TitleReviewContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 30px;
`;

const TitleRatingHeader = styled.div`
  display: flex;
  align-items: center;
`;

const AddMovieButton = styled.button`
  width: 100%;
  color: ${theme.colors.white};
  background-color: ${theme.colors.greenDark};
  font-size: ${theme.fontSizes.px20};
  font-weight: ${theme.fontWeight.w500};
  padding: ${theme.spacings.px5};
  text-align: center;
  border-radius: ${theme.spacings.px10};
  box-shadow: ${theme.shadows.default};

  &:hover {
    box-shadow: ${theme.shadows.hoverShadow};
  }
`;

const MovieTitle = styled.text`
  font-size: xx-large;
  font-weight: 600;
  margin-right: ${theme.spacings.px30};
`;

const MovieDescription = styled.text`
  font-size: 15px;
`;

const YearTimePgContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 20px;
  margin-bottom: 35px;
`;

const YearDurationWrapper = styled.div`
  padding: 0px 5px 2px 5px;
  border: 1px solid #e1e1e1;
  border-radius: 15px;
  margin-right: 10px;
  min-width: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ProducersDirectorsContainer = styled.div`
  display: flex;
  width: 100%;
  margin-top: 5px;
`;

const CastLabel = styled.div`
  margin-top: 5px;
  margin-bottom: 10px;
`;

const ListMenu = styled.div`
  position: absolute;
  z-index: 10;
  top: 500px;
  right: 60px;
  background-color: ${theme.colors.white};
  padding: ${theme.spacings.px10} ${theme.spacings.px20};
  width: 250px;
  border-radius: ${theme.spacings.px10};
  box-shadow: ${theme.shadows.default};

  &::before {
    content: "";
    position: absolute;
    top: -10px;
    right: 40px;
    background-color: ${theme.colors.white};
    height: ${theme.spacings.px20};
    width: ${theme.spacings.px20};
    transform: rotate(45deg);
    border-top: 1px solid #f2f2f2;
    border-left: 1px solid #f2f2f2;
  }
`;

const MenuItem = styled.div`
  align-items: center;
  justify-content: start;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
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

const P = styled.p`
  font-size: ${theme.fontSizes.px20};
  font-weight: ${theme.fontWeight.w700};
  text-align: center;
  margin: 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
`;

const WhiteWrapper = styled.div`
  display: flex;
  align-items: center;
  background-color: ${theme.colors.white};
  border-radius: ${theme.spacings.px10};
  justify-content: space-between;
  padding: ${theme.spacings.px10};
  margin-right: ${theme.spacings.px20};
  box-shadow: ${theme.shadows.default};
  cursor: pointer;
`;

const LeftSide = styled.div`
  display: flex;
  align-items: center;
`;
