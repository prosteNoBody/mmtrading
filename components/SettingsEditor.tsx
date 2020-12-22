import React, {useEffect, useState} from 'react';
import styled from 'styled-components';

import {useQuery} from "@apollo/react-hooks";
import {gql} from 'apollo-boost';

import TradeLinkEditor from "./TradeLinkEditor";

const Container = styled.div`
  grid-area: main-content;
  display: flex;
  justify-content: center;
  align-items: center;
    
  padding: 2rem;
  
  background: rgb(247,247,247);
  background: radial-gradient(circle, rgba(247,247,247,1) 0%, rgba(230,230,230,1) 100%);
`;

const OfferEditor = () => {
    return (
        <Container>
            <TradeLinkEditor action={() => {}}/>
        </Container>
    );
};

export default OfferEditor;