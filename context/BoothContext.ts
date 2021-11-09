import React from "react";
import { Booth } from "../constants/types";

const BoothContext = React.createContext<Booth | null>(null);

export default BoothContext;
