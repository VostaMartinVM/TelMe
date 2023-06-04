import Image from "next/image";
import styled from "styled-components";
import MovieCard, { defaultMovieImage } from "../MovieCards/MovieCard";
import { useCallback, useEffect, useState, useRef } from "react";
import MovieReview from "../../MovieReview";
import CustomCarousel from "../../Carousel/Carousel";
import { Dialog } from "@mui/material";
import { theme } from "../../../styles/defaultTheme";

const DirectorActorDetailsCard = ({ visible, person }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [otherWork, setOtherWork] = useState();
  const crossImage = require("../../Icons/closeCross.svg");

  const getOtherWork = useCallback(() => {
    const url = `https://api.themoviedb.org/3/person/${person?.id}/movie_credits?language=en-US`;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN}`,
      },
    };

    fetch(url, options)
      .then((res) => res.json())
      .then((json) => setOtherWork(json.cast))
      .catch((err) => console.error("error:" + err));
  }, [person]);

  useEffect(() => {
    getOtherWork();
    setIsVisible(visible);
  }, [visible, person]);

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

  return (
    <>
      <DialogContainer scroll="body" maxWidth="lg" open={isVisible}>
        <CloseButtonWrapper onClick={() => setIsVisible(false)}>
          <Image alt="cross" src={crossImage} width={29} height={29} />
        </CloseButtonWrapper>
        <div style={{ display: "flex", flexDirection: "column", padding: 60 }}>
          <CoverInfoContainer>
            <ProfileCoverWrapper>
              <Image
                alt="image"
                fill={true}
                style={{ borderRadius: 10, objectFit: "cover" }}
                quality={100}
                src={
                  person?.profile_path
                    ? `https://image.tmdb.org/t/p/w200${person.profile_path}`
                    : defaultMovieImage
                }
              />
            </ProfileCoverWrapper>
            <PersonInfoWrapper>
              <NameContainer>
                <DirectorActorName>
                  {person?.name ?? "Director Name"}
                </DirectorActorName>
              </NameContainer>
              <BirthdateConatainer>
                <text alt="bornLabel" style={{ fontWeight: 700 }}>
                  Born:
                </text>
                <text style={{ marginLeft: 10 }}>
                  {person?.birthday ?? "12 May 1987"}
                </text>
              </BirthdateConatainer>
              {person?.biography ? (
                <>
                  <text
                    alt="AboutLabel"
                    style={{ fontWeight: 700, fontSize: 15, marginTop: 10 }}
                  >
                    About:
                  </text>
                  <AboutDirectorActor>{person?.biography}</AboutDirectorActor>
                </>
              ) : (
                <></>
              )}

              <AverageReviewContainer>
                <text
                  style={{
                    fontWeight: theme.fontWeight.w700,
                    marginRight: theme.spacings.px20,
                  }}
                >
                  Average movie rating:
                </text>
                <MovieReview
                  starDimension={"15px"}
                  rating={person?.popularity}
                />
              </AverageReviewContainer>
            </PersonInfoWrapper>
          </CoverInfoContainer>
          <OtherWorkLabel>
            <text style={{ fontWeight: 700 }}>Other work:</text>
          </OtherWorkLabel>
          {otherWork?.length !== 0 ? (
            <CustomCarousel>
              {otherWork?.map((movie) => (
                <MovieCard key={movie.id} id={movie.id} naked={true} />
              ))}
            </CustomCarousel>
          ) : (
            <text>No work was found</text>
          )}
        </div>
      </DialogContainer>
    </>
  );
};

export default DirectorActorDetailsCard;

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

const CoverInfoContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const ProfileCoverWrapper = styled.div`
  min-height: 500px;
  min-width: 300px;
  background-color: #b9b9b9;
  position: relative;
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
`;

const PersonInfoWrapper = styled.div`
  display: flex;
  flex: 2;
  padding-left: 60px;
  padding-right: 60px;
  flex-direction: column;
`;

const NameContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DirectorActorName = styled.text`
  font-size: xx-large;
  font-weight: 600;
`;

const AboutDirectorActor = styled.text`
  font-size: 15px;
`;

const BirthdateConatainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-end;
  margin-top: ${theme.spacings.px20};
`;

const AverageReviewContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: ${theme.spacings.px20};
`;

const OtherWorkLabel = styled.div`
  margin-top: 70px;
  margin-bottom: ${theme.spacings.px10};
`;
