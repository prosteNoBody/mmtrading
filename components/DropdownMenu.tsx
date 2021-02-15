import React, { useState, useEffect} from 'react';
import Link from 'next/link';
import styled from 'styled-components'

import {OpenType} from './Types';

const ContainerTranslate = styled.div`
    width: inherit;
    
    transform: translate(-2rem,1.5rem);
`;
const Container = styled.div`  
    position: absolute;
    display: flex;
    flex-direction: column;
    
    padding: 0.5rem 1rem;
    width: 100%;
    
    background: var(--color-white);
    
    z-index: auto;
    filter: drop-shadow(0 0 .2rem var(--color-black));
    transform-origin: top;
    transform: translateX(${(props:OpenType) => (props.open ? '0' : '20rem')});
    opacity: ${(props:OpenType) => (props.open ? '1' : '0')};
    transition: transform 400ms ease-out, opacity 300ms ease-out;
`;

const DropdownItem = styled.div`
    display: flex;
    justify-content: center;
    
    padding: 1.3rem;
    margin-top: 0.75rem;
    
    background: var(--color-white);
    color: var(${(props:DropdownItemProps) => props.color});
    border: 4px solid var(${(props:DropdownItemProps) => props.color});
    
    word-break: break-word;
    text-align: center;
    user-select: text;
    text-transform: uppercase;
    
    transition: 200ms;
    &:hover{
        filter:  drop-shadow(0 0 .5rem var(${(props:DropdownItemProps) => props.color}));
    }
`;

const DropdownItemLogout = styled(DropdownItem)`
  margin-bottom: 0.75rem;
  
  background: var(${(props:DropdownItemProps) => props.color});
  color: var(--color-white);
  
  user-select: none;
  cursor: pointer;
  
  &:hover{
    background: var(--color-white);
    color: var(${(props:DropdownItemProps) => props.color});
    border-width: 4px 10px;
    
    font-weight: bold;
  }
`;
interface DropdownItemProps{
    color:string;
}

type Props = {
    persona: string;
    credit: number;
    isOpen: boolean;
}
const DropdownMenu: React.FC<Props> = (props) => {
    const {persona,credit, isOpen} = props;


    return (
        <ContainerTranslate>
            <Container open={isOpen}>
                <DropdownItem color={'--color-arcana'}>{persona}</DropdownItem>
                <DropdownItem color={'--color-rare'}>Credit: {credit}€</DropdownItem>
                <Link href={"/auth/logout"}><DropdownItemLogout color={'--color-ancient'}>Log Out</DropdownItemLogout></Link>
            </Container>
        </ContainerTranslate>
    )
};

export default DropdownMenu;