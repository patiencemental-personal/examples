import React from 'react';
import styled from 'styled-components';
import color from '../../styles/color';
import font from '../../styles/font';
import { useNavigate } from 'react-router-dom';
import routePathMap from '../../route/path';
import zIndex from '../../styles/zIndex';
import media from '../../styles/media';
import { useMasterStore } from '../../stores/useMasterStore';

const MasterHeader = ({ headerLeftMenu, headerRightButtons }) => {

  const navigate = useNavigate();
  const adminName = useMasterStore((state) => state.name)

  return (
    <AppHeader>
      <Block>
        <Left>
          {
            headerLeftMenu?.map((item) => (
              <li 
                key={item.id} 
                className={item.active ? 'active' : ''}
                onClick={() => {
                  if (!item.active) {
                    navigate(item.to)
                  }
                }}
              >
                {item.name}
              </li>
            ))
          }
        </Left>
        <img
          src={`${process.env.PUBLIC_URL}/images/app-logo.png`}
          alt="App Logo"
          onClick={() => navigate(`/${routePathMap.HOME.INDEX}`)}
        />
        <Right>
        {
          headerRightButtons && headerRightButtons.map((item) => (
            <LogoutButtonItem
              key={item.id}
              onClick={item.handleClick}
            >
              <p className='logout'>로그아웃</p>
              <p className='welcome'>{adminName}님 반갑습니다!</p>
            </LogoutButtonItem>
          ))
        }
        </Right> 
      </Block>
    </AppHeader>
  );
};

const AppHeader = styled.header`
  position: sticky;
  top: 0;
  z-index: ${zIndex.header};
  background-color: ${color.white};
  text-align: center;
  padding: 5px 0;
  img {
    height: 50px;
    width: 60px;
    cursor: pointer;
  };
  border-bottom: 1px solid lightgrey;
  ${media.mobile} {
    padding: 5px 0;
    img {
      height: 40px;
      width: 50px;
      cursor: pointer;
    };
  }
`;

const Block = styled.div`
  min-width: 250px;
  margin: 0 auto;
  text-align: center;
  width: 66%;
  display: inline-block;
  position: relative;
  color: ${color.white};
  border: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  ${media.mobile} {
    margin-right: 0;
    margin-left: 0;
    width: 100%;
  };
`;

const Left = styled.div`
  color: black;
  display: flex;
  padding-left: 0.5rem;
  li {
    margin-right: 3px;
    padding: 0.5rem 1rem;
    font-size: 1.1rem;
    font-weight: 900;
    border-radius: 5px;
    transition: .2s;
    cursor: pointer;
  }
  li:hover, li.active {
    color: white;
    background-color: ${color.blushRed};
  }
`

const Right = styled.span`
  button {
    font-weight: 900;
    font-size: 16px;
  }
  ${media.mobile} {
    right: 10px;
    button {
      font-size: 12px;
      font-weight: 600;
    } 
  }
`;

const LogoutButtonItem = styled.div`
  background-color: ${color.white};
  text-align: right;
  cursor: pointer;
  .logout {
    color: ${color.stoneGrey};
    border-bottom: 2px solid ${color.blushRed};
    display: inline-block;
    padding-bottom: 2px;
    margin-bottom: 2px;
  };
  .welcome {
    color: ${color.thickDark};
    font-weight: ${font.weight.bold};
  };
`;

export default MasterHeader;