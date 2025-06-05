import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Luyện nói tiếng Anh AI</h1>
        <p className="mb-6">Đọc đoạn văn, nhận phản hồi giọng nói từ AI.</p>
        <Link href="/practice">
          <button className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700">
            Bắt đầu luyện tập
          </button>
        </Link>
      </div>
    </main>
  );
}
