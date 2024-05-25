import { client } from './client';
const API_URL = '/communication';

export async function getNotice(competition_index) { // 공지사항 GET API
  try {
    const response = await client.get(`${API_URL}/notice?competition_index=${competition_index}`);
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
  }
};

export async function getQuestion(competition_index) { // 문의사항 GET API
  try {
    const response = await client.get(`${API_URL}/question?competition_index=${competition_index}`);
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
  }
};

export async function getQuestionReply(competition_index) { // 문의사항 답글 GET API
  try {
    const response = await client.get(`${API_URL}/question/reply?competition_index=${competition_index}`);
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
  }
};

export async function postQuestion(competition_index, body, image) { // 문의사항 POST API
  try {
    let formData = new FormData();
    if (image !== null) {
      formData.append("file", image);
    }
    let data = {
      competition_index: competition_index,
      body: body
    };
    formData.append("reqBody", JSON.stringify(data));

    const response = await client.post(`${API_URL}/question`,
      formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      }
    });
    if (response.status === 201) {
      return response.status;
    } else {
      return 0;
    }
  } catch (error) {
  }
};

export async function getScrim(competition_index) { // 스크림 GET API
  try {
    const response = await client.get(`${API_URL}/scrim?competition_index=${competition_index}`);
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
  }
};

export async function getScrimReply(competition_index) { // 스크림 답급 GET API
  try {
    const response = await client.get(`${API_URL}/scrim/reply?competition_index=${competition_index}`);
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
  }
};

export async function postScrim(competition_index, body, image) { // 스크림 POST API
  try {
    let formData = new FormData();
    if (image !== null) {
      formData.append("file", image);
    }
    let data = {
      competition_index: competition_index,
      body: body
    };
    formData.append("reqBody", JSON.stringify(data));

    const response = await client.post(`${API_URL}/scrim`,
      formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      }
    });
    if (response.status === 201) {
      return response.status;
    } else {
      return 0;
    }
  } catch (error) {
  }
};

export async function postScrimReply(competition_index, scrim_index, body, image) { // 스크림 딥글 POST API
  try {
    let formData = new FormData();
    if (image !== null) {
      formData.append("file", image);
    }
    let data = {
      competition_index: competition_index,
      scrim_index: scrim_index,
      body: body
    };
    formData.append("reqBody", JSON.stringify(data));

    const response = await client.post(`${API_URL}/scrim/reply`,
      formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      }
    });
    if (response.status === 201) {
      return response.status;
    } else {
      return 0;
    }
  } catch (error) {
  }
};

export async function getRecruit(competition_index) { // 구인구직 GET API
  try {
    const response = await client.get(`${API_URL}/recruit?competition_index=${competition_index}`);
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
  }
};

export async function getRecruitReply(competition_index) { // 구인구직 답글 GET API
  try {
    const response = await client.get(`${API_URL}/recruit/reply?competition_index=${competition_index}`);
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
  }
};

export async function postRecruit(competition_index, body, image) { // 구인구직 작성 POST API
  try {
    let formData = new FormData();
    if (image !== null) {
      formData.append("file", image);
    }
    let data = {
      competition_index: competition_index,
      body: body
    };
    formData.append("reqBody", JSON.stringify(data));

    const response = await client.post(`${API_URL}/recruit`,
      formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      }
    });
    if (response.status === 201) {
      return response.status;
    } else {
      return 0;
    }
  } catch (error) {
  }
};

export async function postRecruitReply(competition_index, recruit_index, body, image) { // 구인구직 답글 작성 POST API
  try {
    let formData = new FormData();
    if (image !== null) {
      formData.append("file", image);
    }
    let data = {
      competition_index: competition_index,
      recruit_index: recruit_index,
      body: body
    };
    formData.append("reqBody", JSON.stringify(data));

    const response = await client.post(`${API_URL}/recruit/reply`,
      formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      }
    });
    if (response.status === 201) {
      return response.status;
    } else {
      return 0;
    }
  } catch (error) {
  }
};