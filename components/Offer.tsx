import React, {useEffect, useState} from 'react';
import styled from 'styled-components'

import {OfferType} from "./Types";

import ItemsManager from "./ItemsManager";
import CopyLink from "./CopyLink";

const Container = styled.div`
  margin-bottom: 3rem;
  padding: .5rem;
  
  background: var(--color-arcana);
`;

const SemiContainer = styled.div`
  display: grid;

  grid-template-columns: 3fr 1fr;
  grid-template-rows: 1fr 3rem;
  grid-template-areas: 
  "items details"
  "link details";
  
  padding: 1rem;
  
  border: 2px dashed var(--color-white);
`;


const RelativeContainer = styled.div`
  position: relative;
`;

const OverMessage = styled.div`
  position: absolute;
  top: 50%;
  right: 0;
  
  display: flex;
  justify-content: center;
  align-items: center;
  
  padding: 1rem;
  width: 100%;
  height: 20%;
  
  background: green;
  color: white;
  
  transform: translateY(-50%);
`;
const ItemManagerWrapper = styled.div`
  min-height: 25rem;
  display: flex;
`;
const CopyLinkWrapper = styled.div`
  grid-area: link;
`;

type Props = {
    offer: OfferType;
    detail: boolean;
}
const Offer: React.FC<Props> = (props) => {
    const {offer: {items, id, buyer_id, trade_id, price, date, status}, detail} = props;



    return (
        <Container>
            <SemiContainer>
                <RelativeContainer>
                    <ItemManagerWrapper>
                        <ItemsManager error={items === [] ? null : ""} items={items} action={()=>{}} gridSelector={"inventory"} createDescriptions={false} itemSize={"80px"}/>
                    </ItemManagerWrapper>
                    <OverMessage>OverText</OverMessage>
                </RelativeContainer>
                <CopyLinkWrapper><CopyLink offerId={id}/></CopyLinkWrapper>
            </SemiContainer>
        </Container>
    )
};

export default Offer;