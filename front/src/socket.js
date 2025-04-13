import { io } from 'socket.io-client';

const socket = io('http://localhost:8005', {
    path: '/socket.io',
    withCredentials: true, // 👈 세션 쿠키 포함
    transports: ['websocket'], // 권장: polling 대신 websocket
});

export default socket;
