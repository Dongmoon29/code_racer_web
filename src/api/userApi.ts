import axiosInstance from './axiosInstance';

// 사용자 프로필을 가져오는 함수
export const fetchUserProfile = async () => {
  console.log('fetchUserProfile called');
  try {
    const response = await axiosInstance.get('/api/v1/users/profile');
    return response.data.user; // 유저 정보 반환
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      throw new Error('Unauthorized'); // 인증 실패 에러 처리
    }
    throw error; // 기타 에러 처리
  }
};
