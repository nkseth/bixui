import { action, Action, createStore } from "easy-peasy";
import { User } from "./types";

export type StoreModel = {
   authToken: string | null;
   setAuthToken: Action<StoreModel, string | null>;
   user: User | null;
   setUser: Action<StoreModel, User | null>;
};

const store = createStore<StoreModel>({
   authToken: null,
   setAuthToken: action((state, payload) => {
      state.authToken = payload;
   }),
   user: null,
   setUser: action((state, payload) => {
      state.user = payload;
   }),
});

export default store;
