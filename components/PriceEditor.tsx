import React, {useEffect, useState} from "react";
import styled from 'styled-components'

const Container = styled.div`
  grid-area: price;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Wrapper = styled.div`
  position: relative;
`;
const PriceInput = styled.input`
  font-size: 3.5rem;
  text-align: center;
  
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
  
  color: grey;
  
  font-size: 2rem;
  
  user-select: none;
`;

type Props = {
    price: number | string;
    editPrice: (event) => void;
}
const PriceEditor: React.FC<Props> = (props) => {
    const {price,editPrice} = props;

    return (
        <Container>
            <Wrapper>
                <PriceInput size={1} value={price} onChange={(e) => editPrice(e)} placeholder={'0'}/>
                <CurrencySign>€</CurrencySign>
            </Wrapper>
        </Container>
    )
};

export default PriceEditor;