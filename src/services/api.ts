import axios from "axios";

export const DEV_URL = "http://localhost:8000";
export const PROD_URL = "http://18.231.20.132:8000";

export const api = axios.create({ baseURL: PROD_URL });