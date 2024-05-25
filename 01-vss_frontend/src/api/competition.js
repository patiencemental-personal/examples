import { client } from './client';

const PREFIX_API_URL = '/api'
const FAKER = process.env.REACT_APP_FAKER && process.env.REACT_APP_FAKER === 'true';

const API_URL = '/competition';

async function toDataURL(url) {
  return fetch(url)
    .then((response) => {
      return response.blob();
    })
    .then((blob) => {
      return URL.createObjectURL(blob);
    });
}

export async function getBannerList() { // 대회 배너 리스트 GET API
  try {
    const response = await client.get(`${API_URL}/list/banner`);
    // await new Promise(resolve => setTimeout(resolve, 1000));
    if (response.status === 200) {
      return response.data;
    } else {
      return [];
    }
  } catch (error) {
    return [];
  }
};

export async function getCompetitionLastPage() { // 대회 리스트 마지막 페이지 GET API
  try {
    const response = await client.get(`${API_URL}/list/last-page`);
    // await new Promise(resolve => setTimeout(resolve, 1000));
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
  }
};

export async function getCompetitionList(page) { // 대회 리스트 GET API
  try {
    const response = await client.get(`${API_URL}/list?page=${page}`);
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
  }
};

export async function getCategoryCompetitionList(page, event_category) { // 카테고리 별 대회 리스트 GET API
  try {
    const response = await client.get(`${API_URL}/list-of-category?page=${page}&event_category=${event_category}`);
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
  }
};

export async function searchCompetitionList(page, event_name, event_category) { // 대회 검색 GET API
  try {
    const response = await client.get(`${API_URL}/search-list?page=${page}&event_category=${event_category}&event_name=${event_name}`);
    // await new Promise(resolve => setTimeout(resolve, 1000));
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
  }
};

export async function getCompetitionInfo(competition_index) { // 대회 개요 GET API
  try {
    const response = await client.get(`${API_URL}/?competition_index=${competition_index}`);
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
  }
};

export async function getRuleBookGuide() { // 규정집 GET API
  try {
    const response = await client.get(`${API_URL}/rulebook/guide`);
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    alert("규정집 양식 다운로드 실패");
  }
};

export async function getFixtureGuide() { // 대진표 양식 GET API
  try {
    async function download(url) {
      const a = document.createElement("a");
      a.href = await toDataURL(url);
      a.download = "대진표 양식.jpg";
      a.click();
    }
    const response = await client.get(`${API_URL}/fixture/guide`);
    if (response.status === 200) {
      download(`${process.env.REACT_APP_BASE_ORIGIN2}${response.data}`);
    } else {
      alert("대진표 양식 실패")
    }
  } catch (error) {
    return error.status;
  }
};

export async function getFixture(competition_index) { // 대진표 GET API
  try {
    const response = await client.get(`${API_URL}/fixture?competition_index=${competition_index}`);
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
  }
};

export async function getETCInformation(competition_index) { // 기타사항 GET API
  try {
    const response = await client.get(`${API_URL}/etc-information?competition_index=${competition_index}`);
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
  }
};

export async function getParticipant(competition_index) { // 개인 명단 GET API
  try {
    const response = await client.get(`${API_URL}/individual-participant?competition_index=${competition_index}`);
    if (response.status === 200) {
      return response.data;
    } else {
      return response.status;
    }
  } catch (error) {
    return error.status;
  }
};

export async function getTeamParticipant(competition_index) { // 팀 명단 GET API
  try {
    const response = await client.get(`${API_URL}/group-participant?competition_index=${competition_index}`);
    if (response.status === 200) {
      return response.data;
    } else {
      return response.status;
    }
  } catch (error) {
    return error.status;
  }
};

export async function postApplyGroup(competition_index, game_nickname, name, birth, email, phone, team_name, is_leader, etc_value1, etc_value2, etc_value3, etc_value4) { // 문의사항 POST API
  try {
    let data = null;
    if (etc_value1 === undefined && etc_value2 === undefined && etc_value3 === undefined && etc_value4 === undefined) {
      data = {
        competition_index: competition_index,
        game_nickname: game_nickname,
        name: name,
        birth_YMD: birth,
        email: email,
        phone: phone,
        team_name: team_name,
        is_leader: is_leader,
      };

    } else if (etc_value2 === undefined && etc_value3 === undefined && etc_value4 === undefined) {
      data = {
        competition_index: competition_index,
        game_nickname: game_nickname,
        name: name,
        birth_YMD: birth,
        email: email,
        phone: phone,
        etc_value1: etc_value1.value,
        team_name: team_name,
        is_leader: is_leader,
      };
    } else if (etc_value3 === undefined && etc_value4 === undefined) {
      data = {
        competition_index: competition_index,
        game_nickname: game_nickname,
        name: name,
        birth_YMD: birth,
        email: email,
        phone: phone,
        etc_value1: etc_value1.value,
        etc_value2: etc_value2.value,
        team_name: team_name,
        is_leader: is_leader,
      };

    } else if (etc_value4 === undefined) {
      data = {
        competition_index: competition_index,
        game_nickname: game_nickname,
        name: name,
        birth_YMD: birth,
        email: email,
        phone: phone,
        etc_value1: etc_value1.value,
        etc_value2: etc_value2.value,
        etc_value3: etc_value3.value,
        team_name: team_name,
        is_leader: is_leader,
      };

    } else {
      data = {
        competition_index: competition_index,
        game_nickname: game_nickname,
        name: name,
        birth_YMD: birth,
        email: email,
        phone: phone,
        etc_value1: etc_value1.value,
        etc_value2: etc_value2.value,
        etc_value3: etc_value3.value,
        etc_value4: etc_value4.value,
        team_name: team_name,
        is_leader: is_leader,
      };
    }
    const response = await client.post(`${API_URL}/apply/group`, data);

    if (response.status === 201) {
      return response;
    }
  } catch (error) {
    return error;
  }
};

export async function postApplyIndividual(competition_index, game_nickname, name, birth, email, phone, etc_value1, etc_value2, etc_value3, etc_value4) { // 문의사항 POST API
  try {
    let data = null;
    if (etc_value1 === undefined && etc_value2 === undefined && etc_value3 === undefined && etc_value4 === undefined) {
      data = {
        competition_index: competition_index,
        game_nickname: game_nickname,
        name: name,
        birth_YMD: birth,
        email: email,
        phone: phone,
      };

    } else if (etc_value2 === undefined && etc_value3 === undefined && etc_value4 === undefined) {
      data = {
        competition_index: competition_index,
        game_nickname: game_nickname,
        name: name,
        birth_YMD: birth,
        email: email,
        phone: phone,
        etc_value1: etc_value1.value,
      };
    } else if (etc_value3 === undefined && etc_value4 === undefined) {
      data = {
        competition_index: competition_index,
        game_nickname: game_nickname,
        name: name,
        birth_YMD: birth,
        email: email,
        phone: phone,
        etc_value1: etc_value1.value,
        etc_value2: etc_value2.value,
      };

    } else if (etc_value4 === undefined) {
      data = {
        competition_index: competition_index,
        game_nickname: game_nickname,
        name: name,
        birth_YMD: birth,
        email: email,
        phone: phone,
        etc_value1: etc_value1.value,
        etc_value2: etc_value2.value,
        etc_value3: etc_value3.value,
      };

    } else {
      data = {
        competition_index: competition_index,
        game_nickname: game_nickname,
        name: name,
        birth_YMD: birth,
        email: email,
        phone: phone,
        etc_value1: etc_value1.value,
        etc_value2: etc_value2.value,
        etc_value3: etc_value3.value,
        etc_value4: etc_value4.value,
      };
    }
    const response = await client.post(`${API_URL}/apply/individual`, data);

    if (response.status === 201) {
      return response;
    }
  } catch (error) {
    return error;
  }
};

export async function createCompetition(formData) { // 대회생성 POST API
  const response = await client.post(`${API_URL}`, formData, {
    headers: { "Content-Type": "multipart/form-data", }
  })
  return response
};