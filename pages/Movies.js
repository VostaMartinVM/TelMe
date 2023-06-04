import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import MovieCard from "../components/Cards/MovieCards/MovieCard";
import { theme } from "../styles/defaultTheme";
import { Button, Grid } from "@mui/material";
import { useSelector } from "react-redux";
import { selectMovieSearchTermState } from "../redux/movieSlice";
import Image from "next/image";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [searchedMovies, setSearchedMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [pageCount, setPageCount] = useState(1);
  const [genreId, setGenreId] = useState("");
  const [filteredMovies, setFilteredMovies] = useState();
  const searchTermState = useSelector(selectMovieSearchTermState);

  const leftArrowIcon = require("../components/Icons/leftArrowIcon.png");
  const rightArrowIcon = require("../components/Icons/rightArrowIcon.png");

  const getMovies = useCallback(() => {
    const url = `https://api.themoviedb.org/3/movie/popular?language=en-US&page=${pageCount}`;
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
        setMovies(json.results);
      })
      .catch((err) => console.error("error:" + err));
  }, [pageCount]);

  const movieSearch = useCallback((searchQuery) => {
    const url = `https://api.themoviedb.org/3/search/movie?query=${searchQuery}&include_adult=false&language=en-US`;
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
        setSearchedMovies(json.results);
      })
      .catch((err) => console.error("error:" + err));
  });

  const getSortedMovies = () => {
    const url = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_genres=${genreId}&page=${pageCount}`;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN}`,
      },
    };

    fetch(url, options)
      .then((res) => res.json())
      .then((json) => setFilteredMovies(json.results))
      .catch((err) => console.error("error:" + err));
  };

  const getGenres = () => {
    const url = "https://api.themoviedb.org/3/genre/movie/list?language=en";
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN}`,
      },
    };

    fetch(url, options)
      .then((res) => res.json())
      .then((json) => setGenres(json.genres))
      .catch((err) => console.error("error:" + err));
  };

  useEffect(() => {
    if (searchTermState) {
      movieSearch(searchTermState);
      setPageCount(1);
    } else {
      setSearchedMovies([]);
    }
    getGenres();
    if (genreId) {
      getSortedMovies();
    } else {
      getMovies();
    }
  }, [searchTermState, pageCount, genreId]);

  const handleChange = (event) => {
    setGenreId(event.target.value);
  };

  return (
    <Container>
      <GenreHeaderContainer>
        <FormControl sx={{ m: 1, minWidth: 170 }} size="small">
          <InputLabel id="demo-select-small-label">Genre</InputLabel>
          <Select
            MenuProps={{
              PaperProps: { style: { maxHeight: 500 } },
            }}
            labelId="demo-select-small-label"
            id="demo-select-small"
            value={genreId}
            label="Genre"
            onChange={handleChange}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {genres?.map((genre) => (
              <MenuItem key={genre.id} value={genre.id}>
                {genre.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <HeaderContainer>
          <H1>Movies</H1>
        </HeaderContainer>
      </GenreHeaderContainer>
      <Grid container>
        {searchedMovies?.length !== 0
          ? searchedMovies?.map((movie) => (
              <Grid item xs={12} sm={4} md={2} padding="1rem" key={movie.id}>
                <MovieCard id={movie.id} />
              </Grid>
            ))
          : genreId
          ? filteredMovies?.map((movie) => (
              <Grid item xs={12} sm={4} md={2} padding="1rem" key={movie.id}>
                <MovieCard id={movie.id} />
              </Grid>
            ))
          : movies?.map((movie) => (
              <Grid item xs={12} sm={4} md={2} padding="1rem" key={movie.id}>
                <MovieCard id={movie.id} />
              </Grid>
            ))}
      </Grid>
      {searchedMovies?.length === 0 ? (
        <PageCounterContainer>
          <PageCountItem
            onClick={() =>
              pageCount !== 1 ? setPageCount(pageCount - 1) : setPageCount(1)
            }
          >
            <Image
              width={15}
              height={15}
              src={leftArrowIcon}
              alt="leftArrowIcon"
            />
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
            <Image
              width={15}
              height={15}
              src={rightArrowIcon}
              alt="rightArrowIcon"
            />
          </PageCountItem>
        </PageCounterContainer>
      ) : (
        <></>
      )}
    </Container>
  );
};
export default Movies;

const Container = styled.div`
  width: 100%;
  padding: ${theme.spacings.px20} ${theme.spacings.px20} ${theme.spacings.px20}
    0px;
`;

const GenreHeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
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
  margin-left: -150px;
`;
