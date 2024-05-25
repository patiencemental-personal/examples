import React from 'react';
import styled from 'styled-components';
import color from '../../styles/color';
import font from '../../styles/font';
import { useNavigate } from 'react-router-dom';
import routePathMap from '../../route/path';
import zIndex from '../../styles/zIndex';
import media from '../../styles/media';
import { useAdminStore } from '../../stores/useAdminStore';
import { useMasterStore } from '../../stores/useMasterStore';
import useWindowResize from '../../hooks/useWindowResize';

const Header = ({ headerRightButtons }) => {

  const navigate = useNavigate();
  const name = useAdminStore((state) => state.name)
  const adminName = useMasterStore((state) => state.name)
  const viewportWidth = useWindowResize()

  return (
    <AppHeader>
      <Block>
        <img
          src={`${process.env.PUBLIC_URL}/images/app-logo.png`}
          alt="App Logo"
          onClick={() => navigate(`/${routePathMap.HOME.INDEX}`)}
        />
        <Right>
        {
          headerRightButtons && headerRightButtons.map((item) => {
            if (item.name === 'logined') {
              if(item.type === 'admin') {
                return (
                  <LogoutButtonItem
                    key={item.id}
                    onClick={item.handleClick}
                  >
                    <p className='logout'>설정</p>
                    <p className='welcome'>{adminName}{viewportWidth < 550 ? '님' : '님 반갑습니다!'}</p>
                  </LogoutButtonItem>
                );
              } else if(item.type === 'admin_logined') {
                return (
                  <LogoutButtonItem
                    key={item.id}
                    onClick={item.handleClick}
                  >
                    <p className='logout'>로그아웃</p>
                    <p className='welcome'>{adminName}{viewportWidth < 550 ? '님' : '님 반갑습니다!'}</p>
                  </LogoutButtonItem>
                );
              } else {
                return (
                  <LogoutButtonItem
                    key={item.id}
                    onClick={item.handleClick}
                  >
                    <p className='logout'>로그아웃</p>
                    <p className='welcome'>{name}{viewportWidth < 550 ? '님' : '님 반갑습니다!'}</p>
                  </LogoutButtonItem>
                );
              }
            } else {
              return (
                <HeaderButtonItem
                  key={item.id}
                  onClick={item.handleClick}
                >{item.name}</HeaderButtonItem>
              );
            }
          })
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
  ${media.mobile} {
    margin-right: 0;
    margin-left: 0;
    width: 100%;
  };
`;

const Right = styled.span`
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
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

const HeaderButtonItem = styled.button`
  background-color: ${color.white};
  color: ${color.dark};
  font-weight: ${font.weight.bold};
  margin-left: 0.2rem;
  padding: 1rem 0 1rem 1rem;
  font-size: 0.8rem;
  cursor: pointer;
  &:hover {
    opacity: .6;
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

export default Header;