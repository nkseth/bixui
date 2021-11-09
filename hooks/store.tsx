import { createTypedHooks } from "easy-peasy";
import { StoreModel } from "../constants/store";

export const { useStoreActions, useStoreState, useStoreDispatch, useStore } =
   createTypedHooks<StoreModel>();
