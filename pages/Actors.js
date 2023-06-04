import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { theme } from "../styles/defaultTheme";
import { Grid } from "@mui/material";
import DirectorActorCard from "../components/Cards/DirectorActorCards/DirectorActorCard";
import { selectActorSearchTermState } from "../redux/actorSlice";
import { useSelector } from "react-redux";
import Image from "next/image";

const Actors = () => {
  const [trendingActors, setTrendingActors] = useState();
  const [searchedActors, setSearchedActors] = useState();
  const searchTermState = useSelector(selectActorSearchTermState);
  const [pageCount, setPageCount] = useState(1);

  const leftArrowIcon = require("../components/Icons/leftArrowIcon.png");
  const rightArrowIcon = require("../components/Icons/rightArrowIcon.png");

  const getDirectors = useCallback(() => {
    const url = `https://api.themoviedb.org/3/trending/person/week?language=en-US&page=${pageCount}`;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN}`,
      },
    };

    fetch(url, options)
      .then((res) => res.json())
      .then((json) => setTrendingActors(json.results))
      .catch((err) => console.error("error:" + err));
  }, [pageCount]);

  const searchActors = useCallback((searchTerm) => {
    const url = `https://api.themoviedb.org/3/search/person?query=${searchTerm}&include_adult=false&language=en-US&page=1`;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN}`,
      },
    };

    fetch(url, options)
      .then((res) => res.json())
      .then((json) => setSearchedActors(json.results))
      .catch((err) => console.error("error:" + err));
  });

  useEffect(() => {
    if (searchTermState) {
      searchActors(searchTermState);
      setPageCount(1);
    } else {
      setSearchedActors([]);
    }
    getDirectors();
  }, [searchTermState, pageCount]);

  return (
    <Container>
      <HeaderContainer>
        <H1>Actors</H1>
      </HeaderContainer>
      <Grid container>
        {searchedActors?.length !== 0
          ? searchedActors
              ?.filter((director) => director.known_for_department === "Acting")
              .map((movie) => (
                <Grid item xs={12} sm={4} md={2} padding="1rem" key={movie.id}>
                  <DirectorActorCard id={movie.id} />
                </Grid>
              ))
          : trendingActors
              ?.filter((director) => director.known_for_department === "Acting")
              .map((movie) => (
                <Grid item xs={12} sm={4} md={2} padding="1rem" key={movie.id}>
                  <DirectorActorCard id={movie.id} />
                </Grid>
              ))}
      </Grid>
      {searchedActors?.length === 0 ? (
        <PageCounterContainer>
          <PageCountItem
            onClick={() =>
              pageCount !== 1 ? setPageCount(pageCount - 1) : setPageCount(1)
            }
          >
            <Image width={15} height={15} src={leftArrowIcon} alt="left" />
          </PageCountItem>
          {pageCount !== 1 ? (
            <PageCountItem
              onClick={() => {
                setPageCount(pageCount - 1);
              }}
            >
              <text>{pageCount - 1}</text>
            </PageCountItem>
          ) : (
            <></>
          )}

          <PageCountItem
            selected={true}
            onClick={() => {
              setPageCount(pageCount);
            }}
          >
            <text>{pageCount}</text>
          </PageCountItem>
          <PageCountItem
            onClick={() => {
              setPageCount(pageCount + 1);
            }}
          >
            <text>{pageCount + 1}</text>
          </PageCountItem>
          <PageCountItem
            onClick={() => {
              setPageCount(pageCount + 2);
            }}
          >
            <text>{pageCount + 2}</text>
          </PageCountItem>
          <PageCountItem onClick={() => setPageCount(pageCount + 1)}>
            <Image width={15} height={15} src={rightArrowIcon} alt="right" />
          </PageCountItem>
        </PageCounterContainer>
      ) : (
        <></>
      )}
    </Container>
  );
};
export default Actors;

const Container = styled.div`
  width: 100%;
  padding: ${theme.spacings.px20};
`;

const PageCounterContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: ${theme.spacings.px20};
  padding-bottom: ${theme.spacings.px20};
`;

const PageCountItem = styled.button`
  padding: ${theme.spacings.px10};
  background-color: ${(props) =>
    props.selected ? theme.colors.grey : theme.colors.grey2};
  border-radius: ${theme.spacings.px5};
  margin: ${theme.spacings.px5};
  border: 1px solid ${theme.colors.borderColor};
  min-width: 40px;
  &:hover {
    background-color: ${theme.colors.beige};
  }
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
