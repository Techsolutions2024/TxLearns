import { useState, useRef } from 'react';

export default function Practice() {
  const [recording, setRecording] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [feedbackAudio, setFeedbackAudio] = useState(null);
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    audioChunks.current = [];
    mediaRecorder.current = new MediaRecorder(stream);
    mediaRecorder.current.ondataavailable = (e) => audioChunks.current.push(e.data);
    mediaRecorder.current.onstop = sendAudio;
    mediaRecorder.current.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorder.current.stop();
    setRecording(false);
  };

  const sendAudio = async () => {
    const blob = new Blob(audioChunks.current, { type: 'audio/webm' });
    const formData = new FormData();
    formData.append('audio', blob, 'recording.webm');
    formData.append('transcript', 'The global economy is shifting rapidly due to technological advancements.');

    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/api/analyze`, {
      method: 'POST',
      body: formData
    });

    const data = await res.json();
    setFeedback(data.feedback);
    setFeedbackAudio(data.feedbackAudio);
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Luyện nói tiếng Anh</h1>
      <p className="mb-2">Câu mẫu: <i>The global economy is shifting rapidly due to technological advancements.</i></p>
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={recording ? stopRecording : startRecording}
      >
        {recording ? 'Dừng ghi' : 'Bắt đầu ghi âm'}
      </button>
      {feedback && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold">Phản hồi từ AI:</h2>
          <p className="mb-2">{feedback}</p>
          <audio controls src={feedbackAudio} />
        </div>
      )}
    </div>
  );
}
