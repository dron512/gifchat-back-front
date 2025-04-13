import {useEffect, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import axios from 'axios';
import socket from '../socket';


export default function RoomList() {
    const [rooms, setRooms] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // 방 목록 불러오기 (Axios)
    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const res = await axios.get('/rooms'); // ⚠️ 서버 꺼져 있으면 여기서 catch
                if (res.data.rooms) {
                    setRooms(res.data.rooms);
                } else {
                    setError('데이터 형식이 올바르지 않습니다.');
                }
            } catch (err) {
                console.warn('서버 연결 실패:', err.message);
                setError('서버와 연결할 수 없습니다. 목록을 불러오지 못했습니다.');
                setRooms([]); // 빈 배열로 fallback
            }
        };

        fetchRooms();
    }, []);

    // 소켓 이벤트
    useEffect(() => {
        socket.on('newRoom', (data) => {
            setRooms((prev) => [...prev, data]);
        });

        socket.on('removeRoom', (id) => {
            setRooms((prev) => prev.filter((room) => room._id !== id));
        });

        return () => {
            socket.off('newRoom');
            socket.off('removeRoom');
        };
    }, []);

    // 방 입장 처리
    const handleJoin = (room) => {
        if (room.password) {
            const password = prompt('비밀번호를 입력하세요');
            navigate(`/room/${room._id}?password=${password}`);
        } else {
            navigate(`/room/${room._id}`);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">GIF 채팅방</h1>
            <fieldset className="border p-4">
                <legend className="font-semibold">채팅방 목록</legend>

                {error && (
                    <div className="text-red-500 mb-2">
                        ⚠️ {error}
                    </div>
                )}

                {rooms.length === 0 && !error && (
                    <div className="text-gray-500 mb-4">등록된 방이 없습니다.</div>
                )}

                {rooms.length > 0 && (
                    <table className="w-full mt-2 border">
                        <thead>
                        <tr className="bg-gray-100">
                            <th className="p-2 border">방 제목</th>
                            <th className="p-2 border">종류</th>
                            <th className="p-2 border">허용 인원</th>
                            <th className="p-2 border">방장</th>
                            <th className="p-2 border">입장</th>
                        </tr>
                        </thead>
                        <tbody>
                        {rooms.map((room) => (
                            <tr key={room._id}>
                                <td className="p-2 border">{room.title}</td>
                                <td className="p-2 border">{room.password ? '비밀방' : '공개방'}</td>
                                <td className="p-2 border">{room.max}</td>
                                <td className="p-2 border" style={{color: room.owner}}>{room.owner}</td>
                                <td className="p-2 border">
                                    <button
                                        className="bg-blue-500 text-white px-2 py-1 rounded"
                                        onClick={() => handleJoin(room)}
                                    >
                                        입장
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}

                <div className="mt-4">
                    <Link to="/create" className="text-blue-600 underline">채팅방 생성</Link>
                </div>
            </fieldset>
        </div>
    );
}
