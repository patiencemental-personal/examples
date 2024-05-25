import React, { useCallback, useEffect, useState } from 'react';
import useLoading from '../../hooks/useLoading';
import HomeHeadBlock from './HomeHeadBlock';
import GameMenuSliderBlock from './GameMenuSliderBlock';
import PostListBlock from './PostListBlock';
import Pagination from '../common/Pagination';
import { getCompetitionLastPage, getCompetitionList, getCategoryCompetitionList } from '../../api/competition';
import PhoneContainer from '../common/PhoneContainer';
import useCompetitionStore from '../../stores/useCompetitionStore';
import { useAdminStore } from '../../stores/useAdminStore';

const HomeCompetitionPostContainer = ({ viewportWidth }) => {
  const { setAPIKey } = useAdminStore();
  const logined = useAdminStore((state) => state.logined);
  const logout = useAdminStore((state) => state.logout);
  const { menuIndex, changeMenuIndex } = useCompetitionStore();
  const [selectedGameMenu, setSelectedGameMenu] = useState('전체 대회');
  const [first, setFirst] = useState(true);
  const [type, setType] = useState("Page");
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [competitionList, setCompetitionList] = useState([]);
  const [loading, startLoading, endLoading] = useLoading(false);

  const getList = useCallback(async (firstPage) => {
    try {
      startLoading();
      const page = await getCompetitionLastPage();
      let competitionList;
      if (firstPage !== undefined) {
        competitionList = await getCompetitionList(1);
      } else {
        competitionList = await getCompetitionList(currentPage);
      }
      setLastPage(page);
      if (competitionList !== undefined) {
        setCompetitionList(competitionList);
      } else {
        setCompetitionList([]);
      }
    } finally {
      endLoading();
    }
  }, [currentPage, startLoading, endLoading]);

  const checkList = useCallback(async (menu, firstPage) => {
    let selectedCategoryCompList;
    if (firstPage !== undefined) {
      if (menu === "전체 대회") {
        getList(1);
      } else {
        selectedCategoryCompList = await getCategoryCompetitionList(1, menu);
      }
    } else {
      if (menu === "전체 대회") {
        getList();
      } else {
        selectedCategoryCompList = await getCategoryCompetitionList(currentPage, menu);
      }
    }
    if (selectedCategoryCompList !== undefined) {
      setCompetitionList(selectedCategoryCompList);
    } else {
      setCompetitionList([]);
    }
  }, [getList, currentPage])

  const handleGameMenu = useCallback(async (menu) => {
    setType("Menu");
    setSelectedGameMenu(menu);
    setCurrentPage(1);
    checkList(menu, 1);
  }, [checkList]);

  const handlePagination = useCallback((nextPage) => {
    setType("Page");
    setCurrentPage(nextPage);
  }, []);

  useEffect(() => {
    if (logined) {
      setAPIKey(null);
      logout();
    }
    if (menuIndex !== 0) {
      changeMenuIndex(0);
    }
    if (first) {
      getList();
      setFirst(false);
    }
    if (type === "Page") {
      checkList(selectedGameMenu);
      return;
    }
    if (type === "Menu") {
      return;
    }
  }, [logined, setAPIKey, logout, first, getList, type, checkList, selectedGameMenu, currentPage, menuIndex, changeMenuIndex]);

  return (
    <PhoneContainer>
      <HomeHeadBlock
        selectedGameMenu={selectedGameMenu}
      />
      <GameMenuSliderBlock
        onClick={handleGameMenu}
        viewportWidth={viewportWidth}
      />
      <PostListBlock
        loading={loading}
        competitionList={competitionList}
      />
      <Pagination
        loading={loading}
        currentPage={currentPage}
        lastPage={lastPage}
        onChange={handlePagination}
      />
    </PhoneContainer>
  );
};

export default HomeCompetitionPostContainer;