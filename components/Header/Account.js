import React, {useEffect, useCallback, useState, useRef} from "react";
import styled from "styled-components";
import {theme} from "../.././styles/defaultTheme";
import {db} from "../../firebase";
import {useAuth} from "../../useAuth";
import {ref, onValue} from "firebase/database";

const Account = ({handleCloseAccount}) => {
  // AboutUs popup handling
  const popupRef = useRef(null);
  const handleClickOutside = (event) => {
    if (popupRef.current && !popupRef.current.contains(event.target)) {
      handleCloseAccount();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  // Fetch movies handling

  const [currentListMovies, setCurrentListMovies] = useState();
  const [movies, setMovies] = useState([]);
  const [moviesRuntime, setMoviesRuntime] = useState([]);
  const [mostCommonGenres, setMostCommonGenres] = useState([]);

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

          // Calculate the most common genres
          const genresCount = {};
          movieDetails.forEach((movie) => {
            movie.genres.forEach((genre) => {
              if (genresCount[genre.name]) {
                genresCount[genre.name]++;
              } else {
                genresCount[genre.name] = 1;
              }
            });
          });

          const sortedGenres = Object.keys(genresCount).sort(
            (a, b) => genresCount[b] - genresCount[a]
          );
          setMostCommonGenres(sortedGenres.slice(0, 3));

          // Calculate total runtime
          const totalRuntime = movieDetails.reduce((total, movie) => {
            return total + movie.runtime;
          }, 0);

          // Format total runtime in days, hours, and minutes
          const formattedRuntime = {
            days: Math.floor(totalRuntime / 1440),
            hours: Math.floor((totalRuntime % 1440) / 60),
            minutes: totalRuntime % 60,
          };
          setMoviesRuntime(formattedRuntime);
        })
        .catch((err) => console.error("Error fetching movies:", err));
    }
  }, [currentListMovies]);

  useEffect(() => {
    if (currentListMovies && currentListMovies.length > 0) {
      getMovies();
    }
  }, [currentListMovies, getMovies]);

  return (
    <>
      <Backdrop />
      <Container ref={popupRef}>
        <HeaderContainer>
          <H1>Your statistics</H1>
        </HeaderContainer>
        {currentListMovies && currentListMovies.length > 0 ? (
          <>
            <Runtime>
              <H2>Total watchtime:</H2>
              <P>
                {moviesRuntime.days} days, {moviesRuntime.hours} hours,{" "}
                {moviesRuntime.minutes} minutes
              </P>
            </Runtime>
            <Genres>
              <H2>Favorite genres:</H2>

              <Ol>
                {mostCommonGenres.map((genre, index) => (
                  <li key={index}>
                    <P>{genre}</P>
                  </li>
                ))}
              </Ol>
            </Genres>
            <WatchedMovies>
              <H2>Watched movies:</H2>
              <P> {currentListMovies.length}</P>
            </WatchedMovies>
          </>
        ) : (
          <P>
            There are not movies in your Watched list to display any statistics
          </P>
        )}
      </Container>
    </>
  );
};
export default Account;

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

const Runtime = styled.div`
  display: flex;
  align-items: center;
`;
const Genres = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
`;

const Ol = styled.ol`
  list-style-type: decimal;
`;
const WatchedMovies = styled.div`
  display: flex;
  align-items: center;
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

const H2 = styled.h2`
  margin: 0;
  font-size: ${theme.fontSizes.px20};
  font-weight: ${theme.fontWeight.w500};
  color: ${theme.colors.greenDark};
  padding: 0 ${theme.spacings.px20};
`;

const P = styled.p`
  margin: 0;
  font-size: ${theme.fontSizes.px15};
  font-weight: ${theme.fontWeight.w500};
  color: ${theme.colors.black};
`;
