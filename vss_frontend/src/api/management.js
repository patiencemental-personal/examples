import { client } from './client';


const API_URL = '/manage';

// Competition Manage Controller
export async function postNotice(competition_index, body, image, api_key) { // 공지사항 작성 POST API
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

    const response = await client.post(`${API_URL}/communication/notice?competition_index=${competition_index}`,
      formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "JWT": api_key,
      }
    });
    if (response.status === 201) {
      return response.status;
    }
  } catch (error) {
    return error.status;
  }
};

export async function postQuestionReply(competition_index, question_index, body, image, api_key) { // 문의사항 답급 작성 POST API
  try {
    let formData = new FormData();
    if (image !== null) {
      formData.append("file", image);
    }
    let data = {
      body: body,
      question_index: question_index,
    };
    formData.append("reqBody", JSON.stringify(data));

    const response = await client.post(`${API_URL}/communication/question-reply?competition_index=${competition_index}`,
      formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "JWT": api_key,
      }
    });
    if (response.status === 201) {
      return response.status;
    }
  } catch (error) {
    return error.status;
  }
};

export async function deleteNotice(competition_index, notice_index, api_key) { // 공지사항 삭제 POST API
  try {
    const response = await client.delete(`${API_URL}/communication/notice?competition_index=${competition_index}&notice_index=${notice_index}`, {
      headers: {
        "JWT": api_key,
      }
    });
    if (response.status === 200) {
      return response.status;
    }
  } catch (error) {
    return error.status;
  }
};

export async function deleteQuestion(competition_index, question_index, api_key) { // 문의사항 삭제 POST API
  try {
    const response = await client.delete(`${API_URL}/communication/question?competition_index=${competition_index}&question_index=${question_index}`, {
      headers: {
        "JWT": api_key,
      }
    });
    if (response.status === 200) {
      return response.status;
    }
  } catch (error) {
    return error.status;
  }
};

export async function deleteQuestionReply(competition_index, question_reply_index, api_key) { // 문의사항 답글 삭제 POST API
  try {
    const response = await client.delete(`${API_URL}/communication/question-reply?competition_index=${competition_index}&question_reply_index=${question_reply_index}`, {
      headers: {
        "JWT": api_key,
      }
    });
    if (response.status === 200) {
      return response.status;
    }
  } catch (error) {
    return error.status;
  }
};

export async function deleteRecruit(competition_index, recruit_index, api_key) { // 구인구직 삭제 POST API
  try {
    const response = await client.delete(`${API_URL}/communication/recruit?competition_index=${competition_index}&recruit_index=${recruit_index}`, {
      headers: {
        "JWT": api_key,
      }
    });
    if (response.status === 200) {
      return response.status;
    }
  } catch (error) {
    return error.status;
  }
};

export async function deleteRecruitReply(competition_index, recruit_reply_index, api_key) { // 구인구직 답글 삭제 POST API
  try {
    const response = await client.delete(`${API_URL}/communication/recruit-reply?competition_index=${competition_index}&recruit_reply_index=${recruit_reply_index}`, {
      headers: {
        "JWT": api_key,
      }
    });
    if (response.status === 200) {
      return response.status;
    }
  } catch (error) {
    return error.status;
  }
};

export async function deleteScrim(competition_index, scrim_index, api_key) { // 스크림 삭제 POST API
  try {
    const response = await client.delete(`${API_URL}/communication/scrim?competition_index=${competition_index}&scrim_index=${scrim_index}`, {
      headers: {
        "JWT": api_key,
      }
    });
    if (response.status === 200) {
      return response.status;
    }
  } catch (error) {
    return error.status;
  }
};

export async function deleteScrimReply(competition_index, scrim_reply_index, api_key) { // 스크림 답글 삭제 POST API
  try {
    const response = await client.delete(`${API_URL}/communication/scrim-reply?competition_index=${competition_index}&scrim_reply_index=${scrim_reply_index}`, {
      headers: {
        "JWT": api_key,
      }
    });
    if (response.status === 200) {
      return response.status;
    }
  } catch (error) {
    return error.status;
  }
};

export async function getManagerTeamParticipant(competition_index, api_key) { // 팀전 참가자 정보 GET API
  try {
    const response = await client.get(`${API_URL}/group-participant?competition_index=${competition_index}`, {
      headers: {
        "JWT": api_key,
      }
    });
    if (response.status === 200) {
      return response.data;
    } else {
      return response.status;
    } 
  } catch (error) {
    return error.status;
  }
};

export async function getManagerTeamParticipantExcelFile(competition_index, api_key, event_name) { // 팀전 참가자 정보 Excel GET API
  try {
    const response = await client.get(`${API_URL}/group-participant/excel?competition_index=${competition_index}`, {
      headers: {
        "JWT": api_key,
      },
      responseType: 'blob',
    });
    if (response.status === 200) {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const download = document.createElement('a');
      download.href = url;
      download.setAttribute('download', `${event_name} 명단리스트.xlsx`);
      download.click();
    }
    return response.status;
  } catch (error) {
    return error.status;
  }
};

export async function getManagerParticipant(competition_index, api_key) { // 개인전 참가자 정보 GET API
  try {
    const response = await client.get(`${API_URL}/individual-participant?competition_index=${competition_index}`, {
      headers: {
        "JWT": api_key,
      }
    });
    if (response.status === 200) {
      return response.data;
    } else {
      return response.status;
    } 
  } catch (error) {
    return error.status;
  }
};

export async function getManagerParticipantExcelFile(competition_index, api_key, event_name) { // 개인전 참가자 정보 Excel GET API
  try {
    const response = await client({
      url: `${API_URL}/individual-participant/excel?competition_index=${competition_index}`,
      method: "GET",
      responseType: 'blob',
      headers: {
        "JWT": api_key,
      }
    });
    if (response.status === 200) {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const download = document.createElement('a');
      download.href = url;
      download.setAttribute('download', `${event_name} 명단리스트.xlsx`);
      download.click();
    }
    return response.status;
  } catch (error) {
    return error.status;
  }
};

// 여기서부터 API 재확인 필요 ****
export async function acceptParticipant(competition_index, participant_index, acceptance, api_key) { // 공지사항 작성 POST API
  try {
    let data = {
      participant_index: participant_index,
      acceptance: acceptance
    };
    const response = await client.put(`${API_URL}/participant?competition_index=${competition_index}`,
      data, {
      headers: {
        "JWT": api_key,
      }
    });
    if (response.status === 201) {
      return response.status;
    }
  } catch (error) {
    return error.status;
  }
};

export async function rejectParticipant(competition_index, participant_index, api_key) { // 공지사항 작성 POST API
  try {
    const response = await client.delete(`${API_URL}/participant?competition_index=${competition_index}&participant_index=${participant_index}`,
      {
        headers: {
          "JWT": api_key,
        }
      });
    if (response.status === 200) {
      return response.status;
    }
  } catch (error) {
    return error.status;
  }
};


export async function getCurrentCompetitionInfo(competition_index, api_key) { // 대회 수정을 위한 정보 요청 API 
  const response = await client.get(`${API_URL}/competition?competition_index=${competition_index}`, {
    headers: {
      "JWT": api_key,
    }
  });
  return response;
}

export async function updateCompetition(formData, api_key, competitionId) { // 대회 수정
  const response = await client.put(`${API_URL}/competition?competition_index=${competitionId}`, formData, {
    headers: {
      "JWT": api_key,
      "Content-Type": "multipart/form-data",
    }
  });
  return response;
}

export async function updatePassword(payload) { // 비밀번호 수정
  const {email, password, apiKey, competitionId} = payload;
  const response = await client.put(`${API_URL}/password?competition_index=${competitionId}`, {
    email, password
  }, {
    headers: { "JWT": apiKey, }
  });
  return response;
}

export async function postFixture(competition_index, body, image, api_key) { // 대진표 작성 POST API
  try {
    let formData = new FormData();
    if (image !== null) {
      formData.append("file", image);
    }
    let data = {
      body: body
    };
    formData.append("reqBody", JSON.stringify(data));

    const response = await client.post(`${API_URL}/competition/fixture?competition_index=${competition_index}`,
      formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "JWT": api_key,
      }
    });

    if (response.status === 201) {
      return response.status;
    }
  } catch (error) {
    return error.status;
  }
};

/**
 * @param {int} competition_index
 * @param {string} apiKey 
 * @param {{
 *   "amount": 0,
 *   "imp_uid": "string",       가맹점 식별코드
 *   "merchant_uid": "string",  주문 번호
 *   "time": "2022-11-23T08:12:42.304Z"
 * }} data 
 * @returns Promise
 */
// export async function recordPaymentHistory(competition_index, apiKey, data) {
//   return await client.post(`${API_URL}/payment/history?competition_index=${competition_index}`, data, {
//     headers: { "JWT": apiKey, }
//   });
// }

/**
 * @param {int} competition_index
 * @param {string} apiKey 
 * @param {{
 *   "amount": 3000,
 *   "title": "string"
 *   "contents": "string",
 *   "imp_uid": "string",      가맹점 식별코드
 *   "merchant_uid": "string", 주문 번호
 *   "participant_index": [],
 *   "time": "2022-12-02T13:01:19.738Z",
 * }} data 
 * @returns Promise
 */
export async function pushSms(competition_index, apiKey, data) {
  return await client.post(`${API_URL}/message/push?competition_index=${competition_index}`, data, {
    headers: { "JWT": apiKey, }
  });
}

export async function getManagerParticipantsData(competition_index, api_key, isTeam = false) {
  const url = `${API_URL}/${isTeam ? 'group' : 'individual'}-participant?competition_index=${competition_index}`
  const headers = { "JWT": api_key };
  const response = await client.get(url, { headers });
  const data = {
    isTeam,
    isTeamFight: isTeam,
    participantsData: isTeam ? response.data : {
      key: { participants: [...response.data] }
    }
  }
  response.data = data;
  return response;
}