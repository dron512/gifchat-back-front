import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import RoomList from './pages/RoomList';
import CreateRoom from './pages/CreateRoom.jsx';
import ChatRoom from './pages/ChatRoom';

function App() {
    return (
        <BrowserRouter>
            <nav className="bg-gray-100 p-4 flex gap-4">
                <Link to="/" className="text-blue-600">방 목록</Link>
                <Link to="/create" className="text-blue-600">방 만들기</Link>
            </nav>

            <Routes>
                <Route path="/" element={<RoomList />} />
                <Route path="/create" element={<CreateRoom />} />
                <Route path="/room/:roomId" element={<ChatRoom />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
