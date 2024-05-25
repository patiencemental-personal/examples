import React, { memo, useEffect, useState } from 'react';
import styled, { css } from 'styled-components'; 
import color from '../../styles/color';
import font from '../../styles/font';
import media from '../../styles/media';

const GO_FIRST_PAGE = 'f';
const GO_LAST_PAGE = 'l';
const GO_PREV_PAGE = 'p';
const GO_NEXT_PAGE = 'n';

const Pagination = memo(({ loading, currentPage, lastPage, onChange }) => {
  const [displayPageList, setDisplayPageList] = useState([]);

  useEffect(() => {
    const nextDisplayPageList = [];

    [2, 1].forEach(index => {
      const prevDisplayPage = currentPage - index;
      if (prevDisplayPage >= 1) nextDisplayPageList.push(prevDisplayPage);
    });

    nextDisplayPageList.push(currentPage);

    [1, 2].forEach(index => {
      const nextDisplayPage = currentPage + index;
      if (nextDisplayPage <= lastPage) nextDisplayPageList.push(nextDisplayPage);
    });

    setDisplayPageList(nextDisplayPageList);
  }, [currentPage, lastPage]);

  const changePage = (page) => {
    if (page === currentPage) return ;
    
    let nextPage = null;
    switch (page) {
      case GO_FIRST_PAGE:
        nextPage = 1;
        break;
      case GO_LAST_PAGE:
        nextPage = lastPage;
        break;
      case GO_PREV_PAGE:
        nextPage = currentPage - 1;
        break;
      case GO_NEXT_PAGE:
        nextPage = currentPage + 1;
        break;
      default:
        nextPage = page;
    }

    if (nextPage > lastPage || nextPage < 1 || nextPage === currentPage) return ;
    onChange(nextPage);
  };

  if (loading) return ;
  return (
    <PaginationContainer>
      <List>
        <ArrowStyle onClick={() => changePage(GO_FIRST_PAGE)}>
          <button><i className="fa-solid fa-angles-left"></i></button>
        </ArrowStyle>
        <ArrowStyle onClick={() => changePage(GO_PREV_PAGE)}>
          <button><i className="fa-solid fa-angle-left"></i></button>
        </ArrowStyle>
        {/* <ArrowStyle visible={currentPage !== 1} onClick={() => changePage(GO_FIRST_PAGE)}>
          <button><i className="fa-solid fa-angles-left"></i></button>
        </ArrowStyle>
        <ArrowStyle visible={currentPage !== 1} onClick={() => changePage(GO_PREV_PAGE)}>
          <button><i className="fa-solid fa-angle-left"></i></button>
        </ArrowStyle> */}
        {
          displayPageList.map((displayPage, index) => {
            return (
              <PageNumber 
                key={index}
                active={currentPage === displayPage}
                onClick={() => changePage(displayPage)} 
              >{displayPage}</PageNumber>
            );
          })
        }
        {/* <ArrowStyle visible={currentPage !== lastPage} onClick={() => changePage(GO_NEXT_PAGE)}>
          <button><i className="fa-solid fa-angle-right"></i></button>
        </ArrowStyle>
        <ArrowStyle visible={currentPage !== lastPage} onClick={() => changePage(GO_LAST_PAGE)}>
          <button><i className="fa-solid fa-angles-right"></i></button>
        </ArrowStyle> */}
        <ArrowStyle onClick={() => changePage(GO_NEXT_PAGE)}>
          <button><i className="fa-solid fa-angle-right"></i></button>
        </ArrowStyle>
        <ArrowStyle onClick={() => changePage(GO_LAST_PAGE)}>
          <button><i className="fa-solid fa-angles-right"></i></button>
        </ArrowStyle>
      </List>
    </PaginationContainer>
  );
});

const PaginationContainer = styled.div`
  text-align: center;
`;

const List = styled.ul`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  &:first-child {
    border-radius: 5px 0 0 5px;
  };
  &:last-child {
    border-radius: 0 5px 5px 0;
  };
`;

const ListItem = styled.li`
  background-color: ${color.whiteSmoke};
  font-size: 0.7rem;
  width: 20px;
  height: 20px;
  line-height: 20px;
  border: 1px solid #ddd;
  color: #999999;
  background: #f5f4f9;
  cursor: pointer;
  &:hover {
    font-weight: ${font.weight.semiBold};
    color: ${color.commonDark};
  }
  button {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  };
  ${media.small} {
    font-size: 0.5rem;
    width: 15px;
    height: 15px;
    line-height: 15px;
  }
`;

const ArrowStyle = styled(ListItem)`
  /* display: ${props => props.visible ? 'block' : 'none'}; */
  display: block;
`;

const PageNumber = styled(ListItem)`
  display: flex;
  justify-content: center;
  align-items: center;
  ${props => 
    props.active && css`
    background: #c3c2cd;
    color: #333333;
    font-weight: 600;
  `};
`;

export default Pagination;