import styled from "styled-components";
import React from "react";

const PageBtn = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 2.6rem;
  height: 2.6rem;
  margin: 0.7rem 0.7rem 0;

  color: var(--color-white);
  background: var(--color-arcana);
  
  text-align: center;
  font-weight: bold;
  
  cursor: pointer;
  user-select: none;
`;

const PageBtnActive = styled(PageBtn)`
  color: var(--color-arcana);
  background: var(--color-white);
  border: 3px solid var(--color-arcana);
`;

const generateBtns = (maxPage, pageNumber, setPageNumber) => {
    if(maxPage === 1) return false;
    let res = [];
    for(let i = 1; i <= maxPage;i++){
        if(i === pageNumber) res.push(<PageBtnActive key={i} onClick={() => setPageNumber(i)}>{i}</PageBtnActive>)
        else res.push(<PageBtn key={i} onClick={() => setPageNumber(i)}>{i}</PageBtn>)
    }
    return res;
}

export default generateBtns;