import React from 'react';
import styled, { css } from 'styled-components';
import color from '../../styles/color';

const TermHtmlViewer = ({html, blockStyles}) => {
  return (
    <Block styles={blockStyles}>
      <Html dangerouslySetInnerHTML={{ __html: html }} />
    </Block>
  );
};

const Block = styled.div`
  box-shadow: 0 5px 7px 1px ${color.grey};
  ${props => css`${props.styles}`}
`;

const Html = styled.div`
  color: ${color.stoneGrey};
  padding: 1rem;
  word-wrap:break-word;
  * {
    /* p.a, li.a, div.a { */
    margin-bottom: 10px;
    letter-spacing: 1px;
    line-height: 1.2rem;
    text-align:justify;
    text-justify:inter-ideograph;
    line-height:103%;
    text-autospace: none;
    word-break:break-all;
    font-size:10.0pt;
    font-family:"함초롬바탕",serif;
  }
`;

export default TermHtmlViewer;