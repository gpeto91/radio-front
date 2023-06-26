import axios from "axios";

export const DEV_URL = "http://localhost:7000";
export const PROD_URL = "http://18.190.113.67:7000";

export const api = axios.create({ baseURL: DEV_URL });