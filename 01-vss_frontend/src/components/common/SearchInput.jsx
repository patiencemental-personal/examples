import React from 'react';
import styled from 'styled-components';
import color from '../../styles/color';
import media from '../../styles/media';

const SearchInput = ({ onChange, onClick, onKeyPress, value }) => {
  return (
    <SearchBox>
      <Input 
        value={value}
        id="input-search" type="search" placeholder="찾으시는 대회를 검색해주세요"
        onChange={(e) => onChange(e.target.value)} 
        onKeyPress={onKeyPress}
      />
      <button onClick={onClick}>
        <i className="fa-solid fa-magnifying-glass"></i>
      </button>
    </SearchBox>
  );
};

const SearchBox = styled.label`
  position: relative;
  & > button {
    position: absolute;
    top: 50%;
    transform: translatey(-50%);
    right: 1rem;
    border: none;
    cursor: pointer;
  }
`;

const Input = styled.input`
  padding: 0.5rem 1.2rem;
  padding-right: 2.5rem;
  border-radius: 5rem;
  border: none;
  box-shadow: 0px 0px 2px ${color.grey};
  background-color: ${color.whiteSmoke};
  font-size: 0.7rem;
  width: 20rem;
  cursor: pointer;
  &:focus, &:hover {
    outline: none;
    box-shadow: 0px 0px 2px ${color.blushRed};
  }
  ${media.small} {
    font-size: 0.9rem;
  }
`;

export default SearchInput;