import React, { useState, useEffect} from 'react';
import Link from 'next/link';
import styled from 'styled-components'

import {UserType} from './Types';

import Profile from './Profile';
import Section from './Section';

const Container = styled.div`
  position: relative;
  grid-area: navbar;
  display: flex;
  align-items: stretch;
  
  width: 100%;
  height: 100%;
  
  background: var(--color-white);
  
  filter: drop-shadow(0 0 0.75rem var(--color-black));
  z-index: 2;
`;
const SteamLoginWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  
  margin-left: auto;
  margin-right: 2rem;
  
  cursor: pointer;
`;

type Props = {
    user?: UserType;
}

const Navbar: React.FC<Props> = (props) => {
    return (
        <Container>
            <Section href={"/"} color={"--color-ancient"}>MMtrading</Section>
            <Section href={"/dashboard"} color={"--color-arcana"}>Dashboard</Section>
            <Section href={"/offers"} color={"--color-immortal"}>Offers</Section>
            <Section href={"/settings"} color={"--color-rare"}>Settings</Section>
            {props.user
                ?
                (<Profile user={props.user}/>)
                :
                (<SteamLoginWrapper><Link href={"/auth/login"}>
                    <img alt={"steamLogin"} src="https://steamcommunity-a.akamaihd.net/public/images/signinthroughsteam/sits_01.png" width="180" height="35"/>
                </Link></SteamLoginWrapper>)}
        </Container>
    )
};

export default Navbar;