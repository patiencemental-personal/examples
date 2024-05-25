import React, { useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import color from '../../../styles/color';
import font from '../../../styles/font';
import { usePopupStore } from '../../../stores/usePopupStore';
import popupType from '../../../lib/popupType';
import Parser from 'html-react-parser';
import { decode } from 'html-entities';

const Introduction = ({ data }) => {
  const [ruleBook, setRuleBook] = useState(null);

  const openPopup = usePopupStore((state) => state.open);
  const closePopup = usePopupStore((state) => state.close);

  const getRuleBookInfo = useCallback(async () => {
    setRuleBook(`${process.env.REACT_APP_BASE_ORIGIN2}${data.rulebook}`);
  }, [data])

  const downloadFile = useCallback(async () => {
    if(data.rulebook){
      const url = ruleBook;
      const download = document.createElement('a');
      download.href = url;
      download.target = '_blank';
      download.setAttribute('download', "대회 규정집");
      download.setAttribute('type', 'application/json');
      download.click();
    } else {
      openPopup({
        type: popupType.MESSAGE,
        props: {
          message: `등록된 대회규정집이 없습니다.`,
          buttons: [
            {
              name: '확인',
              onClick: () => {
                closePopup();
              }
            }
          ]
        }
      })
    }   
  }, [data, ruleBook, openPopup, closePopup]);

  useEffect(() => {
    getRuleBookInfo();
  }, [getRuleBookInfo])

  return (
    <React.Fragment>
      <Content>
        {
          data && Parser(decode(data.body))
        }
        <br />
      </Content>
      <Bottom>
        {
          ruleBook &&
          <div><button onClick={downloadFile}>대회 규정집</button></div>
        }
      </Bottom>
    </React.Fragment>
  );
};

const Content = styled.div`
  padding: 1.2rem;
  border-top: 3px solid ${color.blushRed};
  border-bottom: 3px solid ${color.blushRed};
  text-align: center;
`;

const Bottom = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1.6rem 0;
  div {
    width: 200px;
    text-align: center;
  };
  button {
    box-shadow: 0 1px 5px 1px ${color.grey};
    background-color: ${color.checkGreen};
    color: white;
    border-radius: 5px;
    width: inherit;
    letter-spacing: 0.1rem;
    font-weight: ${font.weight.semiBold};
    padding: 0.6rem 1rem;
  };
`;

export default Introduction;