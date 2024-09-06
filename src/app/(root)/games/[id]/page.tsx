'use client';
import React, { useEffect, useId, useState } from 'react';
import CodeEditor from '@uiw/react-textarea-code-editor';
import { useParams } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

const IDENTIFIER = uuidv4();

const Game = () => {
  const { id } = useParams<{ id: string }>();
  const [code1, setCode1] = useState(''); // Code for Editor 1
  const [code2, setCode2] = useState(''); // Code for Editor 2
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [codeSubmissionResult, setCodeSubmissionResult] = useState<String>('');
  const identifier = IDENTIFIER;

  const submitCode = async () => {
    const payload = {
      source_code: "console.log('hello world')",
      language_id: 63,
      expected_output: 'something',
    };
    const result = await axios.post(
      'http://localhost:8080/api/v1/code/submit',
      payload
    );
    setCodeSubmissionResult(result.data.stdout);
  };

  useEffect(() => {
    if (!id) return;

    // WebSocket 연결
    const ws = new WebSocket(`ws://localhost:8080/api/v1/games/${id}`);

    ws.onopen = () => {
      console.log('WebSocket 연결 성공');
    };

    // WebSocket에서 메시지를 수신했을 때
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('받은 메시지:', data);

      // 자신이 보낸 메시지가 아니면, code2 업데이트
      if (data.id !== identifier) {
        console.log('----------------TESTING---------------------');
        console.log('data.id ==>', data.id);
        console.log('identifier ==>', identifier);
        setCode2(data.code); // 상대방의 코드를 Editor 2에 반영
      }
    };

    ws.onclose = () => {
      console.log('WebSocket 연결 종료');
    };

    ws.onerror = (error) => {
      console.error('WebSocket 오류:', error);
    };

    setSocket(ws);

    // 컴포넌트 언마운트 시 WebSocket 연결 해제
    return () => {
      ws.close();
    };
  }, [id]);

  useEffect(() => {
    if (!socket) return;

    // code1이 변경되면 서버로 메시지를 보냄
    if (code1) {
      const message = { id: identifier, code: code1 };
      socket.send(JSON.stringify(message));
    }
  }, [code1, socket]);

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 p-4">
        <h1 className="text-lg">Daily Question</h1>
      </header>

      {/* Main content area */}
      <div className="flex flex-1 gap-10">
        {/* Sidebar */}
        <aside className="w-1/4 bg-gray-800 px-6 pb-6 flex flex-col justify-between">
          <div className="h-2/3 overflow-auto text-xs p-4">
            <div className="bg-gray-700 rounded-lg p-2">
              <h2 className="text-xl font-semibold mb-4">
                874. Walking Robot Simulation
              </h2>
              <div>Problem description</div>
            </div>
          </div>
          {/* Run code button */}
          <div className="bg-gray-700 p-4 rounded-lg mt-4">
            <button
              onClick={submitCode}
              className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Run
            </button>
            <div>{codeSubmissionResult ?? ''}</div>
          </div>
        </aside>

        {/* Code Editor Section */}
        <section className="flex-1 p-6 flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
          {/* First code editor window */}
          <div className="flex-1 bg-gray-700 p-4 rounded-lg flex flex-col">
            <h3 className="text-lg font-semibold mb-2">Code Editor 1</h3>
            <CodeEditor
              value={code1}
              language="js"
              placeholder="Please enter your code."
              onChange={(evn) => setCode1(evn.target.value)} // code1 업데이트
              padding={15}
              style={{
                fontSize: 16,
                backgroundColor: '#1e1e1e',
                color: '#fff',
                height: '100%',
              }}
              className="flex-1 rounded-lg"
            />
          </div>

          {/* Second code editor window */}
          <div className="flex-1 bg-gray-700 p-4 rounded-lg flex flex-col">
            <h3 className="text-lg font-semibold mb-2">Code Editor 2</h3>
            <CodeEditor
              readOnly
              value={code2} // 상대방의 코드를 표시
              language="js"
              placeholder="This is read-only code editor."
              padding={15}
              style={{
                fontSize: 16,
                backgroundColor: '#1e1e1e',
                color: '#fff',
                height: '100%',
              }}
              className="flex-1 rounded-lg"
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default Game;
