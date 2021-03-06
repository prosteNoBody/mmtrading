import React from 'react';
import styled from 'styled-components';

import TradeLinkEditor from "./TradeLinkEditor";
import CreditEditor from "./CreditEditor";

const Container = styled.div`
  grid-area: main-content;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
    
  padding: 2rem;
  
  background: rgb(247,247,247);
  background: radial-gradient(circle, rgba(247,247,247,1) 0%, rgba(230,230,230,1) 100%);
`;

const OfferEditor = () => {
    return (
        <Container>
            <TradeLinkEditor/>
            <CreditEditor/>
        </Container>
    );
};

export default OfferEditor;