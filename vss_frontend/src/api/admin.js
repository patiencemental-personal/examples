import { client } from './client';

const API_URL = '/admin';

export async function deleteCompetition(competition_index, api_key) { // 대회 삭제 DELETE API
  try {
    const response = await client.delete(`${API_URL}/competition?competition_index=${competition_index}`, {
      headers: {
        "JWT": api_key,
      }
    });
    return response.status;

  } catch (error) {
    return error.status;
  }
};

export async function deleteMobileBanner(bannerIndexArray, api_key) { // 모바일 배너 삭제 DELETE API
  try {
    const response = await client.delete(`${API_URL}/mobile_banner`, {
      headers: {
        "JWT": api_key,
      },
      data: { banner_index: bannerIndexArray },
    });
    return response.status;
  } catch (error) {
    return error.status;
  }
};

export async function deletePCBanner(bannerIndexArray, api_key) { // PC 배너 삭제 DELETE API
  try {
    const response = await client.delete(`${API_URL}/pc_banner`, {
      headers: {
        "JWT": api_key,
      },
      data: { banner_index: bannerIndexArray },
    });
    return response.status;
  } catch (error) {
    return error.status;
  }
};

export async function putMobilePriority(newBannerPriority, api_key) { // 모바일 배너 우선순위 PUT API
  try {
    const response = await client.put(`${API_URL}/mobile_banner/priority`,
      {
        order: newBannerPriority
      },
      {
        headers: {
          "JWT": api_key,
        }
      });
    return response.status;
  } catch (error) {
    return error.status;
  }
};

export async function putPCPriority(newBannerPriority, api_key) { // PC 배너 우선순위 PUT API
  try {
    const response = await client.put(`${API_URL}/pc_banner/priority`,
      {
        order: newBannerPriority
      },
      {
        headers: {
          "JWT": api_key,
        }
      });
    return response.status;
  } catch (error) {
    return error.status;
  }
};