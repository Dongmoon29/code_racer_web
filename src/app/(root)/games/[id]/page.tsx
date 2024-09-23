'use client';
import React, { useEffect, useState } from 'react';
import CodeEditor from '@uiw/react-textarea-code-editor';
import { useParams } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { languages } from '@/const/languages';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
      source_code: code1,
      language_id: languages['JavaScript'],
    };
    const result = await axios.post(
      'http://localhost:8080/api/v1/code/submit',
      payload
    );
    setCodeSubmissionResult(result.data.stdout);
  };

  useEffect(() => {
    if (!id) return;

    const ws = new WebSocket(`ws://localhost:8080/api/v1/games/${id}`);

    ws.onopen = () => {};

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.id !== identifier) {
        setCode2(data.code);
      }
    };

    ws.onclose = () => {};

    ws.onerror = (error) => {};

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [id]);

  useEffect(() => {
    if (!socket) {
      return;
    }

    if (code1) {
      const message = { id: identifier, code: code1 };
      socket.send(JSON.stringify(message));
    }
  }, [code1, socket, identifier]);

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 p-4">
        <h1 className="text-lg">Daily Question</h1>
      </header>

      {/* Main content area */}
      <div className="flex flex-1 gap-10">
        {/* Sidebar */}
        <aside className="w-1/4 bg-gray-800 p-3 flex flex-col justify-between">
          <Card className="h-2/3 overflow-auto text-xs p-4 bg-gray-700 rounded-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold mb-4 text-gray-50">
                874. Walking Robot Simulation
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-50">
              <div>Problem description goes here...</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-700 p-4 rounded-lg mt-4">
            <Button onClick={submitCode} className="w-full" variant="outline">
              Run Code
            </Button>
            <div className="mt-4">{codeSubmissionResult ?? ''}</div>
          </Card>
        </aside>

        {/* Code Editor Section */}
        <section className="flex-1 p-6 flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
          {/* First code editor window */}
          <Card className="flex-1 bg-gray-700 p-4 rounded-lg flex flex-col">
            <CardHeader>
              <CardTitle className="text-lg font-semibold mb-2 text-gray-50">
                Code Editor 1
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <CodeEditor
                value={code1}
                onChange={(evn) => setCode1(evn.target.value)}
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
            </CardContent>
          </Card>

          {/* Second code editor window */}
          <Card className="flex-1 bg-gray-700 p-4 rounded-lg flex flex-col">
            <CardHeader>
              <CardTitle className="text-gray-50 text-lg font-semibold mb-2">
                Code Editor 2
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
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
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default Game;
