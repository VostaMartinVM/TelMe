import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import { movieSlice } from "./movieSlice";
import { actorSlice } from "./actorSlice";

const makeStore = () =>
  configureStore({
    reducer: {
      [movieSlice.name]: movieSlice.reducer,
      [actorSlice.name]: actorSlice.reducer,
    },
    devTools: true,
  });

export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore["getState"]>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action
>;

export const store = makeStore();
