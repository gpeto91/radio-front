import { io } from 'socket.io-client';

const URL = 'http://18.190.113.67:7000';

export const socket = io(URL);