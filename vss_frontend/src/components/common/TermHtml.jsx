import React from 'react'
import styled from 'styled-components';
import color from '../../styles/color';
import termHtml from './../../lib/terms/termHtml';

export default function TermHtml({ height = '395px' }) {
  return (
    <Html height={height} dangerouslySetInnerHTML={{ __html: termHtml }} />
  )
}

const Html = styled.div`
  height: ${props => props.height};
  overflow: auto;
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