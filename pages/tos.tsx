import * as React from "react";
import styled from 'styled-components';
import Head from "next/dist/next-server/lib/head";

import TOS_RULES from '../components/tosText';

const MainContainer = styled.div`
  display: flex;
  align-items: center;
  flex-grow: 1;
  
  margin: 3rem;
`;

const Container = styled.div`
  margin: 3rem 20%;
  padding: 3rem;
  
  border-radius: 1rem;
  background: gainsboro;
  
  border: 1px solid black;
  box-shadow: inset 0 0 .75rem black;
`;
const Title = styled.h1`
  text-align: center;
  
  margin-bottom: 1rem;
`;
const TosLine = styled.div`
  padding: .3rem;
`;

const tos = () => {
    const generateTos = () => {
        return TOS_RULES.map((rule, index) => {
            return <TosLine><strong>{ index + 1 }. </strong>{rule}</TosLine>
        })
    }

    return (
        <MainContainer>
            <Head>
                <title>Terms of Service</title>
            </Head>
            <Container>
                <Title>Terms of Service</Title>
                { generateTos() }
            </Container>
        </MainContainer>
    );
};

export default tos;