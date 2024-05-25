import { getCompetitionInfo } from "../api/competition";

export async function PCBannerDataSetting(bannerInfo) {
    let competitionNameData = [];
    let newBannerData = [];

    for (let i in bannerInfo) {
        if (bannerInfo[i].pc_banner_index !== null) {
          const compeInfo = await getCompetitionInfo(bannerInfo[i].competition_index);
          if (compeInfo !== undefined) {
            competitionNameData = [...competitionNameData, {
              "index": bannerInfo[i].pc_banner_index,
              "url": `${process.env.REACT_APP_BASE_ORIGIN2}${bannerInfo[i].pc_banner}`,
              "title": compeInfo[0].event_name,
              "order": bannerInfo[i].pc_view_order,
              "check": false
            }];
          }
  
          newBannerData = [...newBannerData, {
            "index": bannerInfo[i].pc_banner_index,
            "url": `${process.env.REACT_APP_BASE_ORIGIN2}${bannerInfo[i].pc_banner}`,
            "order": bannerInfo[i].pc_view_order,
          }];
        }
      }
    return [competitionNameData, newBannerData];
  }

export async function MobileBannerDataSetting(bannerInfo) {
    let competitionNameData = [];
    let newBannerData = [];

    for (let i in bannerInfo) {
      if (bannerInfo[i].mobile_banner_index !== null) {
        const compeInfo = await getCompetitionInfo(bannerInfo[i].competition_index);
        if (compeInfo !== undefined) {
          competitionNameData = [...competitionNameData, {
            "index": bannerInfo[i].mobile_banner_index,
            "url": `${process.env.REACT_APP_BASE_ORIGIN2}${bannerInfo[i].mobile_banner}`,
            "title": compeInfo[0].event_name,
            "order": bannerInfo[i].mobile_view_order,
            "check": false
          }];
        }

        newBannerData = [...newBannerData, {
          "index": bannerInfo[i].mobile_banner_index,
          "url": `${process.env.REACT_APP_BASE_ORIGIN2}${bannerInfo[i].mobile_banner}`,
          "order": bannerInfo[i].mobile_view_order,
        }];
      }
    }
  return [competitionNameData, newBannerData];
}

export function Order_Or_NotOrder_BannerData(bannerInfo) {
  let orderBannerData = [];
  let notOrderBannerData = [];
  for (let i in bannerInfo) {
    if (bannerInfo[i].order === null || bannerInfo[i].order > 50) {
      notOrderBannerData = [...notOrderBannerData, bannerInfo[i]];
    } else {
      orderBannerData = [...orderBannerData, {
        "index": bannerInfo[i].index,
        "url": bannerInfo[i].url,
        "title": bannerInfo[i].title,
        "order": bannerInfo[i].order,
        "check": true
      }];
    }
  }
  orderBannerData.sort(function (b, a) {
    return a.order > b.order ? -1 : a.order < b.order ? 1 : 0;
  });
  return [orderBannerData, notOrderBannerData];
}