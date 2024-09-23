'use client';

import { useState } from 'react';
import { Users, User, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Initial mock data for game rooms
const initialRooms = [
  { id: 1, name: 'Casual Play', users: 3 },
  { id: 2, name: 'Competitive', users: 5 },
  { id: 3, name: 'Beginners Welcome', users: 2 },
  { id: 4, name: 'Pro Players Only', users: 4 },
];

// Mock user data
const user = {
  name: 'Jane Doe',
  username: 'janedoe',
  email: 'jane@example.com',
  gamesPlayed: 42,
  winRate: '68%',
};

const GameDashboard = () => {
  const [rooms, setRooms] = useState(initialRooms);
  const [newRoomName, setNewRoomName] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (newRoomName.trim()) {
      const newRoom = {
        id: rooms.length + 1,
        name: newRoomName.trim(),
        users: 0,
      };
      setRooms([...rooms, newRoom]);
      setNewRoomName('');
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate an API call to refresh the rooms
    setTimeout(() => {
      const updatedRooms = rooms.map((room) => ({
        ...room,
        users: Math.floor(Math.random() * 10) + 1, // Random number of users between 1 and 10
      }));
      setRooms(updatedRooms);
      setIsRefreshing(false);
    }, 1000); // Simulate a 1-second delay
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Game Center</h1>

      <div className="flex flex-col md:flex-row gap-6">
        {/* User Profile Card */}
        <Card className="w-full md:w-1/3">
          <CardHeader>
            <CardTitle>User Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="w-24 h-24">
                <AvatarImage
                  src="/placeholder.svg?height=96&width=96"
                  alt={user.name}
                />
                <AvatarFallback>
                  <User />
                </AvatarFallback>
              </Avatar>
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <p className="text-gray-500">@{user.username}</p>
              <p>{user.email}</p>
              <div className="flex justify-between w-full">
                <span>Games Played: {user.gamesPlayed}</span>
                <span>Win Rate: {user.winRate}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Game Lobby */}
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

          <ul className="space-y-4 mb-8">
            {rooms.map((room) => (
              <li
                key={room.id}
                className="border p-4 rounded-lg flex justify-between items-center"
              >
                <span className="text-lg font-medium">{room.name}</span>
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="mr-2 h-4 w-4" />
                  <span>{room.users} players</span>
                </div>
              </li>
            ))}
          </ul>

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
