import { io } from 'socket.io-client';
import { DEV_URL } from './services/api';

const URL = DEV_URL;

export const socket = io(URL);