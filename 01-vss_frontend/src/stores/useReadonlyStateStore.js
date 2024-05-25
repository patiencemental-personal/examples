import create from 'zustand';

export const useGameListStore = create(() => ({
  gameList: [ 
    '리그오브레전드', '스타크래프트', 
    '피파온라인4', '카트라이더', 
    '카트라이더 러쉬 플러스', '배틀그라운드', '배틀그라운드M',
    '오버워치2', '서든어택', '발로란트', '기타',
  ]
}));