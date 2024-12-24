'use client';

import { useEffect, useState } from 'react';
import { Users, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { userStore } from '../../../../store/store';
import { createGameRoom, fetchGameRooms } from '@/api/gameApi'; // fetchGameRooms 추가
import { useRouter } from 'next/navigation';
import { fetchUserProfile } from '@/api/userApi';

const GameDashboard = () => {
  const [rooms, setRooms] = useState([]); // 게임방 목록
  const [newRoomName, setNewRoomName] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { user, setUser, clearUser } = userStore();
  const [loading, setLoading] = useState(true);
  const router = useRouter();


  // 사용자 프로필 가져오기
  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!user) {
          const userProfile = await fetchUserProfile();
          setUser(userProfile);
        }
        setLoading(false);
      } catch (error: any) {
        localStorage.removeItem('token');
        clearUser();
        router.push('/login');
        setLoading(false);
      }
    };

    fetchUser();
  }, [user, setUser, clearUser, router]);

  // **게임방 목록 가져오기**
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const data = await fetchGameRooms(); // 게임방 목록 API 호출
        console.log(data);
        setRooms(data); // 상태 업데이트
      } catch (error) {
        console.error('Failed to fetch rooms:', error);
      }
    };

    fetchRooms(); // 컴포넌트 마운트 시 호출
  }, []); // 빈 의존성 배열로 한 번만 실행

  // 게임방 생성 핸들러
  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await createGameRoom(newRoomName);
      console.log(data);
      router.push(`/games/${data.room_id}`); // 새 게임방으로 이동
    } catch (error) {
      alert('create room failed');
    }
  };

  // 게임방 새로고침
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const updatedRooms = await fetchGameRooms(); // 게임방 다시 불러오기
      setRooms(updatedRooms); // 상태 업데이트
    } catch (error) {
      console.error('Failed to refresh rooms:', error);
    }
    setIsRefreshing(false);
  };

  if(!user) {
      router.push('/login');
  }
 
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Game Center</h1>

      <div className="flex flex-col md:flex-row gap-6">
        {/* 사용자 프로필 카드 */}
        <Card className="w-full md:w-1/3">
          <CardHeader>
            <CardTitle>User Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center space-y-4">
              <p className="text-gray-500">@{user?.username}</p>
              <p>{user?.email}</p>
            </div>
          </CardContent>
        </Card>

        {/* 게임 로비 */}
        <div className="w-full md:w-2/3">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Game Lobby</h2>
            <Button onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCw
                className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`}
              />
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>

          {/* 게임방 목록 */}
          <ul className="space-y-4 mb-8">
            {rooms &&
              rooms.map((room) => (
                <li
                  key={room.id}
                  className="border p-4 rounded-lg flex justify-between items-center"
                >
                  <span className="text-lg font-medium">{room.room_name}</span>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="mr-2 h-4 w-4" />
                    <span>{room.users || 0} players</span>
                  </div>
                </li>
              ))}
          </ul>

          {/* 게임방 생성 폼 */}
          <form onSubmit={handleCreateRoom} className="flex space-x-2">
            <Input
              type="text"
              placeholder="Enter room name"
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
              className="flex-grow"
            />
            <Button type="submit">Create Room</Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GameDashboard;
