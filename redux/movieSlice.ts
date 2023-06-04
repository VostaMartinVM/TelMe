import { createSlice } from "@reduxjs/toolkit";
import { AppState } from "./store";

const initialState = {
  movieSearchTermState: null,
};

export const movieSlice = createSlice({
  name: "movieSearch",
  initialState,
  reducers: {
    // Action to set the search term status
    setMovieSearchTermState(state, action) {
      state.movieSearchTermState = action.payload;
    },
  },
});

export const { setMovieSearchTermState } = movieSlice.actions;

export const selectMovieSearchTermState = (state: AppState) =>
  state.movieSearch.movieSearchTermState;

export default movieSlice.reducer;
