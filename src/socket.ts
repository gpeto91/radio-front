import { io } from 'socket.io-client';
import { PROD_URL } from './services/api';

const URL = PROD_URL;

export const socket = io(URL);