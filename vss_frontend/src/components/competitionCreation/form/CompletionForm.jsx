import React from 'react';
import styled from 'styled-components';
import font from '../../../styles/font';
import color from '../../../styles/color';
import media from '../../../styles/media';

const CompletionForm = ({nextStep, createdCompetitionTitle}) => {
  return (
    <React.Fragment>
      <Block>
        <p className='title'>{createdCompetitionTitle}</p>
        <p className='subTitle'>대회 생성이 완료되었습니다!</p>
      </Block>
      <ButtonsBlock>
        <Button onClick={nextStep}>메인으로</Button>
      </ButtonsBlock>
    </React.Fragment>
  );
};

const Block = styled.div`
  text-align: center;
  font-weight: ${font.weight.bold};
  p.title {
    font-size: 2.5rem;
    margin-top: 3rem;
  }
  p.subTitle {
    font-size: 1.3rem;
    margin-top: 2rem;
  }
  ${media.custom(1600)} {
    p.title {
      font-size: 2rem;
    }
    p.subTitle {
      font-size: 1.1rem;
    }
  }
  ${media.custom(900)} {
    p.title {
      font-size: 1.4rem;
    }
  }
`

const ButtonsBlock = styled.section`
  position: relative;
  top: 8rem;
  width: 66%;
  margin: 0 auto;
  display: flex;
  justify-content: center;
`;

const Button = styled.button`
  border-radius: 8px;
  font-size: 1.3rem;
  font-weight: ${font.weight.semiBold};
  width: 130px;
  height: 50px;
  background-color: ${color.blushRed};
  color: ${color.white};
  margin: auto 1rem;
  letter-spacing: 0.1rem;
  transition: .2s;
  &:hover {
    opacity: .9;
  };
`;

export default CompletionForm;