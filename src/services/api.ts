import axios from "axios";

export const DEV_URL = "http://localhost:8000";
export const PROD_URL = "https://guarani-radio.ddns.net";

export const api = axios.create({ baseURL: PROD_URL });