// src/socket.js
import { io } from 'socket.io-client';

const socket = io('http://localhost:8005/room', {
    path: '/socket.io',// 기본값이라서 생략가능
});

export default socket;
