export function bannerDataSortSetting(bannerList) {
  let desktopBanners = [];
  let mobileBanners = [];

  bannerList.forEach(item => {
    if (item.mobile_banner !== null) {
      let imgUrl = `${process.env.REACT_APP_BASE_ORIGIN2}${item.mobile_banner}`;

      if (item.mobile_view_order === null || item.mobile_view_order > 50) {

      } else {
        mobileBanners = [...mobileBanners, Object.assign({
          competitionId: item.competition_index,
          imgUrl: imgUrl,
          bannerIndex: item.mobile_banner_index,
          order: item.mobile_view_order
        })];
      }
      if (item.pc_banner !== null) {
        let imgUrl = `${process.env.REACT_APP_BASE_ORIGIN2}${item.pc_banner}`;
        if (item.pc_view_order === null  || item.pc_view_order > 50) {

        } else {
          desktopBanners = [...desktopBanners, Object.assign({
            competitionId: item.competition_index,
            imgUrl: imgUrl,
            bannerIndex: item.pc_banner_index,
            order: item.pc_view_order
          })];
        }

      }

    } else if (item.pc_banner !== null) {
      let imgUrl = `${process.env.REACT_APP_BASE_ORIGIN2}${item.pc_banner}`;
      if (item.pc_view_order === null || item.pc_view_order > 50) {

      } else {
        desktopBanners = [...desktopBanners, Object.assign({
          competitionId: item.competition_index,
          imgUrl: imgUrl,
          bannerIndex: item.pc_banner_index,
          order: item.pc_view_order
        })];
      }

      if (item.mobile_banner !== null) {
        let imgUrl = `${process.env.REACT_APP_BASE_ORIGIN2}${item.mobile_banner}`;
        if (item.mobile_view_order === null || item.mobile_view_order > 50) {
 
        } else {
          mobileBanners = [...mobileBanners, Object.assign({
            competitionId: item.competition_index,
            imgUrl: imgUrl,
            bannerIndex: item.mobile_banner_index,
            order: item.mobile_view_order
          })];
        }
      }
    }
  });

  mobileBanners.sort(function (b, a) {
    if (a.order === null) {
      return -1;
    } else {
      return a.order > b.order ? -1 : a.order < b.order ? 1 : 0;
    }
  });

  desktopBanners.sort(function (b, a) {
    if (a.order === null) {
      return -1;
    } else {
      return a.order > b.order ? -1 : a.order < b.order ? 1 : 0;
    }
  });

  const result = {
    mobile: [
      // {
      //   bannerIndex: -3,
      //   competitionId: -1,
      //   imgUrl: `${process.env.PUBLIC_URL}/images/banner/mobile_banner_01.png`,
      //   order: 1,
      // },
      // {
      //   bannerIndex: -2,
      //   competitionId: -1,
      //   imgUrl: `${process.env.PUBLIC_URL}/images/banner/mobile_banner_02.jpg`,
      //   order: 1,
      // },
      // {
      //   bannerIndex: -1,
      //   competitionId: -1,
      //   imgUrl: `${process.env.PUBLIC_URL}/images/banner/mobile_banner_03.jpg`,
      //   order: 1,
      // },
      // {
      //   bannerIndex: -0,
      //   competitionId: -1,
      //   imgUrl: `${process.env.PUBLIC_URL}/images/banner/mobile_banner_04.jpg`,
      //   order: 1,
      // },
      ...mobileBanners
    ],
    desktop: [
      // {
      //   bannerIndex: -3,
      //   competitionId: -1,
      //   imgUrl: `${process.env.PUBLIC_URL}/images/banner/web_banner_01.jpg`,
      //   order: 1,
      // },
      // {
      //   bannerIndex: -2,
      //   competitionId: -1,
      //   imgUrl: `${process.env.PUBLIC_URL}/images/banner/web_banner_02.jpg`,
      //   order: 1,
      // },
      // {
      //   bannerIndex: -1,
      //   competitionId: -1,
      //   imgUrl: `${process.env.PUBLIC_URL}/images/banner/web_banner_03.jpg`,
      //   order: 1,
      // },
      // {
      //   bannerIndex: -0,
      //   competitionId: -1,
      //   imgUrl: `${process.env.PUBLIC_URL}/images/banner/web_banner_04.jpg`,
      //   order: 1,
      // },
      ...desktopBanners
    ]
  }

  return result;
}