import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  html {
    box-sizing: border-box;
    height: 100%;
    width: 100%;
  }
  * {
    box-sizing: inherit;
    margin: 0;
    padding: 0;
    /* word-break: keep-all;   // 문단으로 끊어져서 줄바꿈 됨 */
    word-break: break-all;
  }
  button {
    background: none;
    color: inherit;
    border: none;
    padding: 0;
    font: inherit;
    cursor: pointer;
    outline: inherit;
  }
  li:not(.custom-list-item) {
    list-style: none;
  }
  a {
    text-decoration: none;
  }
  .ck-editor__editable {
    max-height: 500px;
  }
`;

export default GlobalStyle;