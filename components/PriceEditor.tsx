import React, {useEffect, useState} from "react";
import styled from 'styled-components'
import {sendData} from "next/dist/next-server/server/api-utils";

const Container = styled.div`
  grid-area: price;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Wrapper = styled.div`
  position: relative;
  width: 80%;
`;
const PriceInput = styled.input`
  font-size: 3.5rem;
  text-align: center;
  
  margin: auto;
  width: 100%;
  
  color: var(--color-white);
  background: none;
  outline: #4B69FF;
  border: none;
  outline: none;
  
  cursor: pointer;
`;
const CurrencySign = styled.div`
  position: absolute;
  bottom: 0;
  right: -1rem;
  
  color: var(--color-gray);
  
  font-size: 2rem;
  
  user-select: none;
`;

type Props = {
    price: number | string;
    editPrice: (event) => void;
    sendOffer: () => void;
}
const PriceEditor: React.FC<Props> = (props) => {
    const {price, editPrice, sendOffer} = props;

    const handleKeyDown = e => {
        if(e.keyCode === 13) {
            sendOffer();
        }
    }

    return (
        <Container>
            <Wrapper>
                <PriceInput size={1} value={price} onChange={(e) => editPrice(e)} placeholder={'0'} onKeyDown={handleKeyDown}/>
                <CurrencySign>€</CurrencySign>
            </Wrapper>
        </Container>
    )
};

export default PriceEditor;