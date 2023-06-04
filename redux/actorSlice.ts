import { createSlice } from "@reduxjs/toolkit";
import { AppState } from "./store";

const initialState = {
  actorSearchTermState: null,
};

export const actorSlice = createSlice({
  name: "actorSearch",
  initialState,
  reducers: {
    // Action to set the search term status
    setActorSearchTermState(state, action) {
      state.actorSearchTermState = action.payload;
    },
  },
});

export const { setActorSearchTermState } = actorSlice.actions;

export const selectActorSearchTermState = (state: AppState) =>
  state.actorSearch.actorSearchTermState;

export default actorSlice.reducer;
