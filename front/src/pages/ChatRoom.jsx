import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import socket from '../socket';

export default function ChatRoom() {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const [chats, setChats] = useState([]);
    const [chatText, setChatText] = useState('');
    const [gifFile, setGifFile] = useState(null);
    const chatListRef = useRef(null);

    // 채팅 내역 불러오기
    useEffect(() => {
        axios.get(`/room/${roomId}/chats`)
            .then(res => {
                setChats(res.data.chats || []);
            })
            .catch(err => {
                alert('채팅 내역을 불러오는 데 실패했습니다.');
                console.error(err);
            });
    }, [roomId]);

    // 소켓 연결 및 이벤트
    useEffect(() => {
        socket.emit('join', roomId);

        socket.on('join', (data) => {
            setChats(prev => [...prev, { user: 'system', chat: data.chat }]);
        });

        socket.on('exit', (data) => {
            setChats(prev => [...prev, { user: 'system', chat: data.chat }]);
        });

        socket.on('chat', (data) => {
            setChats(prev => [...prev, data]);
        });

        return () => {
            socket.emit('leave', roomId);
            socket.off('join');
            socket.off('exit');
            socket.off('chat');
        };
    }, [roomId]);

    // 채팅 자동 스크롤
    useEffect(() => {
        chatListRef.current?.scrollTo(0, chatListRef.current.scrollHeight);
    }, [chats]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!chatText && !gifFile) {
            alert('메시지나 GIF를 입력해주세요.');
            return;
        }

        const formData = new FormData();
        formData.append('roomId', roomId);
        if (chatText) formData.append('chat', chatText);
        if (gifFile) formData.append('gif', gifFile);

        try {
            await axios.post('/chat', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setChatText('');
            setGifFile(null);
        } catch (err) {
            alert('전송 실패');
            console.error(err);
        }
    };

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">채팅방: {roomId}</h1>
            <button
                onClick={() => navigate('/')}
                className="text-blue-600 underline mb-4 inline-block"
            >
                방 나가기
            </button>

            <fieldset className="border p-4 mb-4">
                <legend className="font-semibold">채팅 내용</legend>
                <div
                    ref={chatListRef}
                    className="max-h-80 overflow-y-scroll space-y-2"
                >
                    {chats.map((chat, idx) => {
                        if (chat.user === 'system') {
                            return (
                                <div key={idx} className="text-center text-gray-500 text-sm">
                                    {chat.chat}
                                </div>
                            );
                        }

                        return (
                            <div
                                key={idx}
                                className={`p-2 rounded ${
                                    chat.user === '나' ? 'bg-blue-100 text-right' : 'bg-gray-100'
                                }`}
                            >
                                <div className="text-sm font-bold" style={{ color: chat.user }}>
                                    {chat.user}
                                </div>
                                {chat.gif ? (
                                    <img src={`/gif/${chat.gif}`} alt="GIF" className="mt-1 max-w-xs" />
                                ) : (
                                    <div className="mt-1">{chat.chat}</div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </fieldset>

            <form onSubmit={handleSubmit} className="flex gap-2 items-center">
                <label htmlFor="gif" className="text-sm">GIF 올리기</label>
                <input
                    type="file"
                    id="gif"
                    accept="image/gif"
                    onChange={(e) => setGifFile(e.target.files[0])}
                />
                <input
                    type="text"
                    value={chatText}
                    onChange={(e) => setChatText(e.target.value)}
                    placeholder="메시지를 입력하세요"
                    className="flex-1 border p-2 rounded"
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    전송
                </button>
            </form>
        </div>
    );
}
