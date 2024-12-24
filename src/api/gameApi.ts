import axiosInstance from './axiosInstance';

export const createGameRoom = async (roomName: string) => {
  try {
    const response = await axiosInstance.post('/api/v1/games', {
      room_name: roomName,
    });
    return response;
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      throw new Error('Unauthorized');
    }
    throw error;
  }
};

export const fetchGameRooms = async () => {
  console.log('fetchGameRooms called');
  try {
    // 서버 API 요청
    const response = await axiosInstance.get('/api/v1/games');
    console.log('response ===>', response);

    // 응답 데이터 반환
    return response.data.rooms;
  } catch (error: any) {
    // 인증 에러 처리
    if (error.response && error.response.status === 401) {
      throw new Error('Unauthorized'); // 인증 실패
    }

    // 기타 에러 처리
    throw new Error(
      error.response?.data?.error || 'Failed to fetch game rooms'
    );
  }
};
