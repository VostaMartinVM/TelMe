import React, {useState, useRef, useEffect, useCallback} from "react";
import styled from "styled-components";
import {theme} from "../styles/defaultTheme";
import Image from "next/image";
import {db} from "../firebase";
import AddList from "../components/AddLists/AddList";
import {useAuth} from "../useAuth";
import {Grid} from "@mui/material";
import MovieCard from "../components/Cards/MovieCards/MovieCard";
import {ref, onValue, remove} from "firebase/database";

const Lists = () => {
  const leftArrowIcon = require("../components/Icons/leftArrowIcon.png");
  const rightArrowIcon = require("../components/Icons/rightArrowIcon.png");
  const plusIcon = require("../components/Icons/plusIcon.png");
  const menuIcon = require("../components/Icons/menuIcon.png");
  const trashIcon = require("../components/Icons/delete.png");

  //List data handling

  const user = useAuth();
  const [allLists, setAllLists] = useState();
  const [allListNames, setAllListNames] = useState();
  const [currentListIndex, setCurrentListIndex] = useState(0);
  const [currentListName, setCurrentListName] = useState("Favorite");
  const [currentListMovies, setCurrentListMovies] = useState();
  const [movies, setMovies] = useState();

  useEffect(() => {
    if (user) {
      const userRef = ref(db, `users/${user.uid}/Lists`);

      const dataListener = onValue(userRef, (snapshot) => {
        const fetchedData = snapshot.val();

        if (fetchedData) {
          const filteredData = Object.keys(fetchedData).reduce(
            (acc, listId) => {
              if (fetchedData[listId].name !== "Watched") {
                acc[listId] = fetchedData[listId];
              }
              return acc;
            },
            {}
          );
          setAllLists(filteredData);

          const listNames = Object.keys(filteredData).map((listId, index) => ({
            name: filteredData[listId].name,
            index,
          }));
          setAllListNames(listNames);

          const favoriteListData = filteredData["Favorite"];
          if (favoriteListData && typeof favoriteListData === "object") {
            const listMovies = Object.keys(favoriteListData)
              .filter((key) => key !== "name")
              .map((key) => favoriteListData[key]);
            setCurrentListMovies(listMovies);
          }
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

  // Current List handling

  const setCurrentList = (listName) => {
    if (allLists) {
      const listData = allLists[listName];
      if (listData && typeof listData === "object") {
        const listMovies = Object.keys(listData)
          .filter((key) => key !== "name")
          .map((key) => listData[key]);
        setCurrentListMovies(listMovies);
        setCurrentListName(listName);
      }
    }
  };

  const goToPrevious = () => {
    const isFirstList = currentListIndex === 0;
    const newIndex =
      isFirstList && allListNames
        ? allListNames.length - 1
        : currentListIndex - 1;
    setCurrentListIndex(newIndex);
    setCurrentList(allListNames[newIndex].name);
  };

  const goToNext = () => {
    const isLastList = currentListIndex === allListNames.length - 1;
    const newIndex = isLastList ? 0 : currentListIndex + 1;
    setCurrentListIndex(newIndex);
    setCurrentList(allListNames[newIndex].name);
  };

  const goToList = (newIndex) => {
    setCurrentListIndex(newIndex);
    setCurrentList(allListNames[newIndex].name);
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

  // AddList us popup handling

  const [addListMenuOpen, setAddListMenuOpen] = useState(false);

  const handleCloseAddList = () => {
    setAddListMenuOpen(false);
  };

  // Delete list

  const deleteList = () => {
    if (allListNames && allListNames.length > 1) {
      const listToDelete = currentListName;
      const previousListIndex =
        currentListIndex === 0 ? allListNames.length - 1 : currentListIndex - 1;
      const previousListName = allListNames[previousListIndex].name;

      // Delete the list from the database
      const userRef = ref(db, `users/${user.uid}/Lists/${listToDelete}`);
      remove(userRef)
        .then(() => {
          // Update the current list index and name
          setCurrentListIndex(previousListIndex);
          setCurrentList(previousListName);
        })
        .catch((error) => {
          console.error("Error deleting list:", error);
        });
    }
  };

  return (
    <>
      <HeaderContainer>
        <H1Container>
          <ArrowWrapper onClick={goToPrevious}>
            <Image
              src={leftArrowIcon}
              width={35}
              height={35}
              alt="leftArrowIcon"
            />
          </ArrowWrapper>
          <div>
            <H1>{allListNames && currentListName}</H1>
          </div>
          <ArrowWrapper onClick={goToNext}>
            <Image
              src={rightArrowIcon}
              width={35}
              height={35}
              alt="rightArrowIcon"
            />
          </ArrowWrapper>
        </H1Container>
        <LeftHContainer>
          <WhiteContainer onClick={deleteList}>
            <Image
              src={trashIcon}
              width={35}
              height={35}
              alt="trashIcon"
            />
          </WhiteContainer>
          <WhiteContainer
            onClick={() => {
              setAddListMenuOpen(true);
            }}
          >
            <Image
              src={plusIcon}
              width={35}
              height={35}
              alt="plusIcon"
            />
          </WhiteContainer>
          <WhiteContainer
            onClick={() => {
              setListMenuOpen(true);
            }}
          >
            <Image
              src={menuIcon}
              width={35}
              height={35}
              alt="menuIcon"
            />
            {ListMenuOpen && (
              <ListMenu ref={listMenuRef}>
                <P>Your lists: </P>
                {allListNames.map((item, index) => (
                  <MenuItem
                    key={index}
                    onClick={() => {
                      goToList(index);
                      setListMenuOpen(false);
                    }}
                  >
                    <MenuText>{item.name}</MenuText>
                  </MenuItem>
                ))}
              </ListMenu>
            )}
          </WhiteContainer>
        </LeftHContainer>
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
                  listNames={allListNames}
                  deleteButton={true}
                  listName={currentListName}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {addListMenuOpen && <AddList handleCloseAddList={handleCloseAddList} />}
    </>
  );
};

export default Lists;

const HeaderContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacings.px20};
`;

const Container = styled.div`
  width: 100%;
  padding: ${theme.spacings.px20};
`;
const H1Container = styled.div`
  position: absolute;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: ${theme.colors.white};
  border-radius: ${theme.spacings.px10};
  padding: ${theme.spacings.px10};
  box-shadow: ${theme.shadows.default};
`;

const LeftHContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: end;
`;

const WhiteContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: ${theme.colors.white};
  border-radius: ${theme.spacings.px10};
  justify-content: space-between;
  padding: ${theme.spacings.px10};
  margin-left: ${theme.spacings.px20};
  box-shadow: ${theme.shadows.default};
  cursor: pointer;
`;

const H1 = styled.h1`
  min-width: 300px;
  text-align: center;
  margin: 0;
  font-size: ${theme.fontSizes.px36};
  font-weight: ${theme.fontWeight.w700};
  color: ${theme.colors.greenDark};
`;

const ListMenu = styled.div`
  position: absolute;
  z-index: 2;
  top: 190px;
  right: 20px;
  background-color: ${theme.colors.white};
  padding: ${theme.spacings.px10} ${theme.spacings.px20};
  width: 250px;
  border-radius: ${theme.spacings.px10};
  box-shadow: ${theme.shadows.default};

  &::before {
    content: "";
    position: absolute;
    top: -10px;
    right: 20px;
    background-color: ${theme.colors.white};
    height: ${theme.spacings.px20};
    width: ${theme.spacings.px20};
    transform: rotate(45deg);
    border-top: 1px solid #f2f2f2;
    border-left: 1px solid #f2f2f2;
  }
`;

const MenuItem = styled.div`
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

const ArrowWrapper = styled.div`
  cursor: pointer;
`;
