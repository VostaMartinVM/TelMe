import React, {useEffect, useCallback, useState} from "react";
import styled from "styled-components";
import {theme} from "../styles/defaultTheme";
import {db} from "../firebase";
import {useAuth} from "../useAuth";
import {Grid} from "@mui/material";
import MovieCard from "../components/Cards/MovieCards/MovieCard";
import {ref, onValue} from "firebase/database";

const Watched = () => {
  //List data handling
  const [currentListMovies, setCurrentListMovies] = useState();
  const [movies, setMovies] = useState([]);

  const user = useAuth();

  useEffect(() => {
    if (user) {
      const userRef = ref(db, `users/${user.uid}/Lists/Watched`);

      const dataListener = onValue(userRef, (snapshot) => {
        const fetchedData = snapshot.val();

        if (fetchedData && typeof fetchedData === "object") {
          const listMovies = Object.keys(fetchedData)
            .filter((key) => key !== "name")
            .map((key) => fetchedData[key]);
          setCurrentListMovies(listMovies);
        }
      });

      return () => {
        dataListener();
      };
    }
  }, [user]);

  const getMovies = useCallback(() => {
    if (currentListMovies && currentListMovies.length > 0) {
      const movieDataPromises = currentListMovies.map((movieId) => {
        const url = `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`;
        const options = {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN}`,
          },
        };

        return fetch(url, options)
          .then((res) => res.json())
          .catch((err) => {
            console.error(`Error fetching movie with ID ${movieId}:`, err);
            return null;
          });
      });

      Promise.all(movieDataPromises)
        .then((results) => {
          const movieDetails = results.filter((result) => result !== null);
          setMovies(movieDetails);
        })
        .catch((err) => console.error("Error fetching movies:", err));
    }
  }, [currentListMovies]);

  useEffect(() => {
    if (currentListMovies && currentListMovies.length > 0) {
      getMovies();
    }
  }, [currentListMovies]);

  return (
    <>
      <HeaderContainer>
        <H1>Watched movies</H1>
      </HeaderContainer>
      <Container>
        {currentListMovies && currentListMovies.length === 0 ? (
          <p>No movies found</p>
        ) : (
          <Grid
            container
            spacing={8}
          >
            {movies?.map((movie) => (
              <Grid
                item
                xs={12}
                sm={4}
                md={2}
                padding="1rem"
                key={movie.id}
              >
                <MovieCard
                  id={movie.id}
                  deleteButton={true}
                  listName={"Watched"}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </>
  );
};

export default Watched;

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

const Container = styled.div`
  width: 100%;
  padding: ${theme.spacings.px20};
`;
