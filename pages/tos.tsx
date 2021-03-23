import * as React from "react";
import {useState} from "react";
import styled from 'styled-components';
import Head from "next/dist/next-server/lib/head";

import TOS from '../components/tosText';

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

const LanguageContainer = styled.div`
  position: fixed;
  bottom: 10px;
  right: 10px;
  
  display: flex;
`;

type LanguageSelectProps = {
    selected: boolean;
}
const LanguageSelect = styled.div`
  margin: 0 10px;
  color: ${(props: LanguageSelectProps) => props.selected ? 'grey' : 'darkgrey'};
  
  text-decoration: ${(props: LanguageSelectProps) => props.selected ? 'none' : 'underline'};
  cursor: ${(props: LanguageSelectProps) => props.selected ? 'default' : 'pointer'};
  
  &:hover {
    color: grey;
  }
`;

const tos = () => {
    const [language, setLanguage] = useState('en');

    const generateTos = () => {
        return TOS[language].map((rule, index) => {
            return <TosLine><strong>{ index + 1 }. </strong>{rule}</TosLine>
        });
    }

    return (
        <>
            <MainContainer>
                <Head>
                    <title>Terms of Service</title>
                </Head>
                <Container>
                    <Title>Terms of Service</Title>
                    { generateTos() }
                </Container>
            </MainContainer>
            <LanguageContainer>
                <LanguageSelect onClick={() => setLanguage('en')} selected={language === 'en'}>EN</LanguageSelect>
                <LanguageSelect onClick={() => setLanguage('cs')} selected={language === 'cs'}>CZ</LanguageSelect>
            </LanguageContainer>
        </>
    );
};

export default tos;