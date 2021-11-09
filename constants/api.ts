import axios from "axios";

import { API_URI } from "./variables";

const api = axios.create({
   baseURL: API_URI,
   headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
   },
});

export default api;
