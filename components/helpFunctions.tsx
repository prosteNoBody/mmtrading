import styled from "styled-components";
import React from "react";

type PageBtnProps = {
    topPaging: boolean;
}
const PageBtn = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 2.6rem;
  height: 2.6rem;
  margin: ${(props: PageBtnProps) => props.topPaging ? '0 .7rem .7rem 0' : '0.7rem 0.7rem 0 0'};

  color: var(--color-white);
  background: var(--color-arcana);
  
  text-align: center;
  font-weight: bold;
  
  cursor: pointer;
  user-select: none;
`;

const PageBtnContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  
  z-index: 2;
`;

const PageBtnActive = styled(PageBtn)`
  color: var(--color-arcana);
  background: var(--color-white);
  border: 3px solid var(--color-arcana);
`;

const generateBtns = (maxPage, pageNumber, setPageNumber, topPaging = false) => {
    if(maxPage === 1) return false;
    let res = [];
    for(let i = 1; i <= maxPage;i++){
        if(i === pageNumber) res.push(<PageBtnActive key={i} onClick={() => setPageNumber(i)} topPaging={topPaging}>{i}</PageBtnActive>)
        else res.push(<PageBtn key={i} onClick={() => setPageNumber(i)} topPaging={topPaging}>{i}</PageBtn>)
    }
    return (<PageBtnContainer>{res}</PageBtnContainer>);
}

const getErrorMessage = (errorCode, defaultMsg) => {
    let errorMsg = defaultMsg;
    switch (Number(errorCode)) {
        case 1:
            errorMsg = "You are required to be logged in! Please re/login first"
            break;
        case 2:
            errorMsg = "Your trade url is invalid"
            break;
        case 3:
            errorMsg = "You cannot use this action for this offer"
            break;
        case 4:
            errorMsg = "There was problem with items in this offer"
            break;
        case 5:
            errorMsg = "You already have active withdraw trade"
            break;
        case 6:
            errorMsg = "Bot wasn't able to create trade, please try it later"
            break;
        case 7:
            errorMsg = "We cannot find this offer"
            break;
        case 8:
            errorMsg = "You cannot buy your own offer"
            break;
        case 9:
            errorMsg = "You didn't choose any items"
            break;
        case 10:
            errorMsg = "You need to set valid trade url"
            break;
        case 11:
            errorMsg = "There was problem with your items/inventory"
            break;
        case 12:
            errorMsg = "You have to enter valid price"
            break;
        case 13:
            errorMsg = "There was problem in sending you an offer, check if you don't have VAC/Trade ban"
            break;
        case 14:
            errorMsg = "You can have only one waiting offer at the time"
            break;
        case 15:
            errorMsg = "There was problem in fetching your offer/s"
            break;
        case 16:
            errorMsg = "This is already your url"
            break;
        case 17:
            errorMsg = "Url is invalid"
            break;
        case 18:
            errorMsg = "Token you provide is not valid"
            break;
        case 19:
            errorMsg = "This offer is currently being withdraw by owner"
            break;
        case 20:
            errorMsg = "You don't have enough credit for this offer"
            break;
    }
    return errorMsg;
}

export {generateBtns, getErrorMessage};