import { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import Image from "next/image";
import { theme } from "../../../styles/defaultTheme";
import DirectorActorDetailsCard from "./DirectorActorDetailsCard";
export const defaultMovieImage = require("../../Icons/defaultImage.svg");
export const defaultPersonImage = require("../../Icons/personIcon.png");

const DirectorActorCard = ({ id, naked }) => {
  const [isDirectorActorInfoVisible, setIsDirectorActorInfoVisible] =
    useState(false);
  const [person, setPerson] = useState();

  const getActorDetails = useCallback(() => {
    const url = `https://api.themoviedb.org/3/person/${id}?language=en-US`;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN}`,
      },
    };

    fetch(url, options)
      .then((res) => res.json())
      .then((json) => setPerson(json))
      .catch((err) => console.error("error:" + err));
  }, [id]);

  useEffect(() => {
    getActorDetails();
  }, []);

  return (
    <>
      <DirectorActorCardWrapper
        naked={naked}
        onClick={() =>
          isDirectorActorInfoVisible
            ? setIsDirectorActorInfoVisible(false)
            : setIsDirectorActorInfoVisible(true)
        }
      >
        <ImageWrapper>
          <Image
            alt="image"
            src={
              person?.profile_path
                ? `https://image.tmdb.org/t/p/w200${person.profile_path}`
                : defaultPersonImage
            }
            fill={true}
            style={{ borderRadius: 65, objectFit: "cover" }}
          />
        </ImageWrapper>
        <DirectorActorInfoWrapper>
          <DirectorActorName>
            {person?.name ?? "Directors name"}
          </DirectorActorName>
          <DirectorActorRole>
            {person?.known_for_department ?? "Director"}
          </DirectorActorRole>
          <DirectorActorBirthDate>
            {person?.birthday
              ? `Born: ${person?.birthday}`
              : "Born: 12th May 1987"}
          </DirectorActorBirthDate>
        </DirectorActorInfoWrapper>
      </DirectorActorCardWrapper>
      <DirectorActorDetailsCard
        visible={isDirectorActorInfoVisible}
        person={person}
      />
    </>
  );
};

export default DirectorActorCard;

const DirectorActorCardWrapper = styled.div`
  border: 2px solid ${theme.colors.grey2};
  background-color: ${theme.colors.white};
  border-radius: ${theme.spacings.px10};
  width: 170px;
  padding: ${theme.spacings.px10};
  display: flex;
  position: relative;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  ${(props) => (!props.naked ? `box-shadow: ${theme.shadows.default}` : ``)};
  transition: transform 0.3s;

  &:hover {
    transform: scale(1.02);
    ${(props) =>
      !props.naked ? `box-shadow: ${theme.shadows.hoverShadow}` : ``};
  }
`;

const ImageWrapper = styled.div`
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;
  background: #b9b9b9;
  border-radius: 65px;
  height: 115px;
  width: 115px;
`;

const DirectorActorInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const DirectorActorName = styled.text`
  padding-top: ${theme.spacings.px10};
  font-size: ${theme.fontSizes.px15};
  font-weight: ${theme.fontWeight.w500};
  align-self: center;
  min-height: 50px;
`;

const DirectorActorRole = styled.text`
  font-size: 8px;
  align-self: center;
  font-weight: ${theme.fontWeight.w500};
`;
const DirectorActorBirthDate = styled.text`
  font-size: ${theme.fontSizes.px12};
  align-self: center;
  margin-top: ${theme.spacings.px10};
`;
