
import React, { useEffect, useState } from 'react';
import { getResults, clearResults } from '../services/storageService';
import { StudentResult } from '../types';
import { ArrowLeft, Trash2 } from 'lucide-react';

interface Props {
  onBack: () => void;
}

const AdminDashboard: React.FC<Props> = ({ onBack }) => {
  const [results, setResults] = useState<StudentResult[]>([]);

  useEffect(() => {
    setResults(getResults().reverse());
  }, []);

  const handleClear = () => {
    if (confirm('Bạn có chắc chắn muốn xóa toàn bộ dữ liệu học sinh?')) {
      clearResults();
      setResults([]);
    }
  };

  const getBadgeColor = (type: string) => {
      switch(type) {
          case 'HOLLAND': return 'bg-orange-100 text-orange-700';
          case 'IQ': return 'bg-blue-100 text-blue-700';
          case 'EQ': return 'bg-pink-100 text-pink-700';
          case 'DISC': return 'bg-red-100 text-red-700';
          default: return 'bg-purple-100 text-purple-700';
      }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto bg-white min-h-screen font-sans">
      <div className="flex justify-between items-center mb-8">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-600 font-bold hover:text-teal-600">
          <ArrowLeft size={20} /> Quay lại
        </button>
        <h1 className="text-2xl font-extrabold text-gray-800">Quản lý kết quả GenYou</h1>
        <button onClick={handleClear} className="flex items-center gap-2 text-red-500 bg-red-50 px-4 py-2 rounded-lg font-bold hover:bg-red-100">
          <Trash2 size={18} /> Xóa dữ liệu
        </button>
      </div>

      <div className="overflow-x-auto shadow-lg rounded-xl border border-gray-100">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-4 px-6 text-left text-sm font-bold text-gray-500 uppercase tracking-wider">Thời gian</th>
              <th className="py-4 px-6 text-left text-sm font-bold text-gray-500 uppercase tracking-wider">Học sinh</th>
              <th className="py-4 px-6 text-left text-sm font-bold text-gray-500 uppercase tracking-wider">Loại Test</th>
              <th className="py-4 px-6 text-left text-sm font-bold text-gray-500 uppercase tracking-wider">Kết quả chính</th>
              <th className="py-4 px-6 text-left text-sm font-bold text-gray-500 uppercase tracking-wider">Chi tiết</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {results.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-4 px-6 text-sm text-gray-600">
                  {new Date(r.timestamp).toLocaleString('vi-VN')}
                </td>
                <td className="py-4 px-6">
                    <span className="block font-bold text-gray-800">{r.name}</span>
                    <span className="text-xs text-gray-400 font-mono">{r.studentId}</span>
                </td>
                <td className="py-4 px-6">
                    <span className={`px-2 py-1 rounded-md text-xs font-bold ${getBadgeColor(r.type)}`}>
                        {r.type}
                    </span>
                </td>
                <td className="py-4 px-6">
                  {r.type === 'HOLLAND' && <span className="font-black text-orange-600 text-lg">{r.hollandCode}</span>}
                  {r.type === 'MBTI' && <span className="font-black text-purple-600 text-lg">{r.mbtiType}</span>}
                  {r.type === 'IQ' && <span className="font-black text-blue-600 text-lg">{r.iqClassification}</span>}
                  {r.type === 'EQ' && <span className="font-black text-pink-600 text-lg">{r.eqClassification}</span>}
                  {r.type === 'DISC' && <span className="font-black text-red-600 text-lg">{r.discType}</span>}
                </td>
                <td className="py-4 px-6 text-xs text-gray-500 font-mono">
                  {r.type === 'HOLLAND' && r.hollandScores && (
                      <>R:{r.hollandScores.R} I:{r.hollandScores.I} A:{r.hollandScores.A} <br/> S:{r.hollandScores.S} E:{r.hollandScores.E} C:{r.hollandScores.C}</>
                  )}
                  {r.type === 'MBTI' && r.mbtiScores && (
                      <>E:{r.mbtiScores.E} I:{r.mbtiScores.I} ...</>
                  )}
                  {r.type === 'IQ' && (
                      <span className="font-bold text-gray-700">Điểm: {r.iqScore}/14</span>
                  )}
                  {r.type === 'EQ' && (
                      <span className="font-bold text-gray-700">Điểm: {r.eqScore}/70</span>
                  )}
                  {r.type === 'DISC' && r.discScores && (
                      <span className="font-bold text-gray-700">D:{r.discScores.D} I:{r.discScores.I} S:{r.discScores.S} C:{r.discScores.C}</span>
                  )}
                </td>
              </tr>
            ))}
            {results.length === 0 && (
              <tr>
                <td colSpan={5} className="py-12 text-center text-gray-400">
                  Chưa có dữ liệu.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
