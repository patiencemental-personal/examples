export function sortBannerList(competitionList) {
    if(competitionList.length !== 0) {
        competitionList.sort(function (b, a) {
            return a.competition_index > b.competition_index ? -1 : a.competition_index < b.competition_index ? 1 : 0;
          });
          return competitionList;
    }
}