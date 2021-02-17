import React, {useEffect, useState} from 'react';
import styled from 'styled-components';

import {ItemType, OfferType, UserType} from "./Types";

import LoadingIcon from "./LoadingIcon";
import Offer from "./Offer";

type ContainerProps = {
    gridSelector?:string;
}
const Container = styled.div`
  grid-area: ${(props: ContainerProps) => props.gridSelector || ''};
  
  display: flex;
  flex-direction: column;
  align-items: stretch;
  
  width: 100%;
  
  flex: 1;
  
  padding: 2rem;
  
  background: rgb(28,28,28);
  background: radial-gradient(circle, rgba(45,45,45,1) 0%, rgba(28,28,28,1) 100%);
  filter: drop-shadow(0 0 .75rem grey);
  
  overflow-y: scroll;
  overflow-x: hidden;
  
  ::-webkit-scrollbar {
      width: 10px;
  }
  ::-webkit-scrollbar-track {
      background: #f1f1f1; 
  }
  ::-webkit-scrollbar-thumb {
      background: #888; 
  }
  ::-webkit-scrollbar-thumb:hover {
      background: #555; 
  }
`;

const OffersContainer = styled.div`
  height: 30rem;
`;

const InsideText = styled.div`
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;

  flex: 1;

  color: grey;
  
  text-align: center;
  font-size: 200%;
  user-select: none;
`;

const BottomPadding = styled.div`
  width: 100%;
  
  padding-bottom: 2rem;
`;

type Props = {
    isLoading?: boolean;
    error?: string;
    offers: OfferType[];
    offersPerPage?: number;
    user: UserType;
}
const OffersManager: React.FC<Props> = (props) => {
    const {offers, offersPerPage, user} = props;
    const isLoading = props.isLoading || false;
    const error = props.error || false;

    const createOffer = (offer:OfferType) => {
        return <Offer key={offer.id} offer={offer} user={user}/>
    };

    const generateOffers = () => {
        if(isLoading) return <InsideText>Loading... <LoadingIcon/></InsideText>;
        else if(error) return <InsideText>{error}</InsideText>;
        else if(offers.length === 0) return <InsideText>No offers</InsideText>
        return offers.map((offer) => createOffer(offer))
    };

    return (
        <Container>
            {generateOffers()}
        </Container>
    );
};

export default OffersManager;