import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import color from '../../styles/color';
import font from '../../styles/font';
import media from '../../styles/media';

const Footer = () => {
  return (
    <AppFooter>
      <FooterContainer>
        <FooterItem>
          <div className="footer-item-header footer-item-header-first">
            <figure>
              <a target="_blank" href="https://www.e-sko.com" rel="noreferrer">
                <img className="cooperation-logo" src={`${process.env.PUBLIC_URL}/images/app-logo.png`} alt="App Logo" />
              </a>
            </figure>
            <H4>브이에스에스지지</H4>
          </div>
          <div className="footer-item-body">
            <p><a target="_blank" href="https://www.e-sko.com" rel="noreferrer">이스포츠코리아</a></p>
            <p>대표자: 손윤호</p>
            <p>이메일: natural0334@naver.com</p>
            <p>사업자 번호: 239-75-00227</p>
            <p>통신판매업신고번호: 2022-경북경산-1016</p>
            <Link to='/terms'><p>서비스 이용약관 및 개인정보 수집 ⦁ 이용 동의</p></Link>
          </div>
        </FooterItem>
        <FooterItem>
          <h4 className="footer-item-header">Address</h4>
          <div className="footer-item-body">
            <p>경상북도 경산시 하양읍 하양로 13-13</p>
            <p>Glocal Hub A동 103호</p>
          </div>
        </FooterItem>
        <FooterItem>
          <h4 className="footer-item-header">Follow Me</h4>
          <div className="footer-item-body">
          <p>E스포츠 대회 / 게임 행사 문의</p>
          <p><a target="_blank" href="https://www.e-sko.com" rel="noreferrer">www.e-sko.com</a></p>
          <p>E스포츠 대회 / 게임행사 블로그</p>
          <p><a target="_blank" href="https://blog.naver.com/esko1027/" rel="noreferrer">blog.naver.com/esko1027</a></p>
          </div>
        </FooterItem>
        <FooterItem>
          <h4 className="footer-item-header">Questions</h4>
          <div className="footer-item-body">
            <p>비즈니스 및 사용자 피드백 문의</p>
            <p>natural0334@naver.com</p>
            <p>전화번호 070-4580-7164</p>
          </div>
        </FooterItem>
      </FooterContainer>
      <p className='copyright'>
        Copyright © 2022 E-Sports Korea. All rights reserved.
      </p>
    </AppFooter>
  );
};

const H4 = styled.h4`
  a {
    color: white;
  }
`;

const AppFooter = styled.footer`
  background-color: ${color.commonDark};
  color: white;
  font-size: 0.8rem;
  .copyright {
    margin-bottom: 1.5rem;
    text-align: center;
    font-size: 0.7rem;
    font-weight: 300;
    opacity: .5;
  }
  bottom: 0;
`;

const FooterContainer = styled.footer`
  width: 80%;
  padding: 1rem;
  margin: 1.5rem 5% 2rem 15%;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  ${media.custom(1620)} {
    width: 85%;
    margin: 1.5rem 3.5% 2rem 11.5%;
  }
  ${media.custom(1420)} {
    width: 70%;
    margin: 1.5rem 15% 2rem 15%;
  }
`;

const FooterItem = styled.div`
  flex: 1 1 25%;
  p a {
    color: ${color.white};
    font-weight: ${font.weight.regular};
    padding-bottom: 3.2px;
    :hover {
      color: ${color.grey};
    }
  }
  p {
    color: ${color.white};
    font-weight: ${font.weight.regular};
    padding-bottom: 5px;
  };
  figure {
    margin-bottom: 10px;
  };
  .footer-item-header {
    padding-bottom: 16px;
    height: 120px;
    display: flex;
    align-items: flex-end;
  };
  .footer-item-header-first {
    flex-direction: column;
    justify-content: flex-end;
    align-items: flex-start;
  };
  .cooperation-logo {
    width: 64px;
    height: 64px;
    /* border-radius: 50%; */
    margin-right: 8px;
  };
  .icon-button {
    font-size: 2rem;
    color: ${color.white};
    margin-right: 0.5rem;
  };
  ${media.custom(1420)} {
    flex: 1 1 50%;
    text-align: center;
    .cooperation-logo {
      margin-right: 0;
    }
    .footer-item-header {
      padding-bottom: 16px;
      height: 120px;
      display: flex;
      justify-content: center;
    };
    .footer-item-header-first {
      justify-content: flex-end;
      align-items: center;
    };
  }
  ${media.small} {
    flex: 1 1 100%;
    .footer-item-header:not(.footer-item-header-first) {
      margin-top: 2rem;
      height: auto;
    }
  }
  ${media.large} {
    margin: 0;
    .footer-item-header {
      justify-content: center;
    };
    .footer-item-body {
      text-align: center;
    };    
  };
`;


export default Footer;