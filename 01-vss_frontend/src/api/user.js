import { client } from './client';

const API_URL = '/user';
// User Controller
export async function loginManager(competition_index, password) { // 로그인
    try {
        const body = {
            "competition_index": competition_index,
            "password": password
        };
        const response = await client.post(`${API_URL}/login/manager`, body);
        if (response.status === 200) {
            return response.data;
        } else {
            return response.data; // login failed
        }
    } catch (error) {
        return "login failed";
    }
};

export async function emailAuthCode(email) { // 이메일 인증 코드 받기
    const data = { email }
    const response = await client.post(`${API_URL}/email`, data);
    return response;
};


// {
//     "authentication_key": "string",
//     "email": "string"
//   }
export async function emailAuthCodeConfirm(data) { // 이메일 인증 코드 확인
    const response = await client.post(`${API_URL}/email/confirm`, data);
    return response;
}

export async function updatePassword(payload) { // 비밀번호 수정
    const { email, password, competitionId } = payload;
    const response = await client.put(`${API_URL}/password?competition_index=${competitionId}`, {
        email, password
    });
    return response;
}

export async function loginMaster(password) { // 마스터 사용자 로그인
    const response = await client.post(`${API_URL}/login/admin`, { password });
    return response
}