import { useState, useEffect } from 'react';
import axios from 'axios';

// 환경변수 로드 (Vite 방식)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

function App() {
  const [notes, setNotes] = useState([]);
  const [form, setForm] = useState({ nickname: '', content: '', emoji: '🌊' });

  // 데이터 불러오기
  const fetchNotes = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/notes`);
      // 최신순 정렬 (ID 역순)
      setNotes(res.data.sort((a, b) => b.id - a.id));
    } catch (err) {
      console.error("API Error:", err);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nickname || !form.content) return;
    try {
      await axios.post(`${API_URL}/api/notes`, form);
      setForm({ ...form, content: '' }); // 닉네임, 이모지는 유지
      fetchNotes();
    } catch (err) {
      alert("전송 실패! 백엔드 연결을 확인하세요.");
    }
  };

  return (
    <div className="min-h-screen p-8 font-sans text-gray-800">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-5xl font-extrabold text-white drop-shadow-md mb-2">
            🌊 WaveNote
          </h1>
          <p className="text-white/80 text-lg">PADO 배포 테스트용 방명록</p>
        </header>

        {/* 입력 폼 */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-xl mb-10">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 md:flex-row">
            <select 
              className="p-3 rounded-xl border border-gray-200 text-2xl"
              value={form.emoji}
              onChange={(e) => setForm({...form, emoji: e.target.value})}
            >
              <option>🌊</option><option>🔥</option><option>🚀</option><option>💖</option><option>🍀</option>
            </select>
            <input 
              type="text" 
              placeholder="닉네임"
              className="p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-400"
              value={form.nickname}
              onChange={(e) => setForm({...form, nickname: e.target.value})}
            />
            <input 
              type="text" 
              placeholder="하고 싶은 말을 남겨보세요!"
              className="flex-1 p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-400"
              value={form.content}
              onChange={(e) => setForm({...form, content: e.target.value})}
            />
            <button 
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md transform active:scale-95"
            >
              기록하기
            </button>
          </form>
        </div>

        {/* 메시지 리스트 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note) => (
            <div key={note.id} className="bg-white/90 backdrop-blur rounded-2xl p-6 shadow-lg hover:-translate-y-1 transition-transform duration-200">
              <div className="flex justify-between items-start mb-2">
                <span className="text-4xl">{note.emoji}</span>
                <span className="text-xs text-gray-400">#{note.id}</span>
              </div>
              <p className="text-gray-700 text-lg font-medium mb-4 break-words">
                {note.content}
              </p>
              <div className="text-right">
                <span className="text-sm text-blue-500 font-bold bg-blue-50 px-2 py-1 rounded-lg">
                  by {note.nickname}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;