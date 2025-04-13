import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function CreateRoom() {
    const [title, setTitle] = useState('');
    const [max, setMax] = useState(10);
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title || max < 2) {
            alert('방 제목과 인원을 확인해주세요.');
            return;
        }

        try {
            await axios.post('/api/room', {
                title,
                max,
                password: password || undefined, // 빈 문자열이면 undefined로
            });

            alert('채팅방이 생성되었습니다!');
            navigate('/'); // 방 목록으로 이동
        } catch (err) {
            console.error(err);
            alert('방 생성에 실패했습니다.');
        }
    };

    return (
        <div className="p-6">
            <fieldset className="border p-4 max-w-md mx-auto">
                <legend className="font-semibold text-xl mb-4">채팅방 생성</legend>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            type="text"
                            name="title"
                            placeholder="방 제목"
                            className="border p-2 w-full"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <input
                            type="number"
                            name="max"
                            placeholder="수용 인원(최소 2명)"
                            className="border p-2 w-full"
                            min={2}
                            value={max}
                            onChange={(e) => setMax(parseInt(e.target.value, 10))}
                            required
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            name="password"
                            placeholder="비밀번호(없으면 공개방)"
                            className="border p-2 w-full"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="bg-green-600 text-white px-4 py-2 rounded"
                        >
                            생성
                        </button>
                    </div>
                </form>
            </fieldset>
        </div>
    );
}
