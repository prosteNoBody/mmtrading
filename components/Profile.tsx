import React, { useState, useEffect} from 'react';
import Link from 'next/link';
import styled from 'styled-components'

import DropdownMenu from './DropdownMenu';

const Container = styled.div`
  position: relative;
  
  margin-left: auto;
  
  user-select: none;
`;

const SectionProfile = styled.div`
  display: flex;
  align-content: center;
  align-items: center;
  padding: 1rem;
  
  height: 100%;
  
  color: var(--color-black);
  border-left: ${(props:Open) => props ? 1 : 1.5}rem solid var(--color-mythical);
  
  text-align: center;
  font-size: 1.5rem;
  
  cursor: pointer;
  transition: 300ms;
  
  &:hover{
    border-left-width: 1rem;
  }
`;

const SectionProfileImg = styled.img`
  border-radius: 50%;
  
  border: 4px solid lightskyblue;
  
  overflow: hidden;
  transform: scale(0.8);
  filter: drop-shadow(0 0 .3rem lightskyblue);
`;

const SectionProfileArrow = styled.div`
  margin: ${(props:Open) => (props.open ? '1.5rem 0.75rem 1.5rem 0.75rem' : '1rem 0.5rem 1rem 0.5rem')};
  
  transform-origin: center;
  transform: rotate(${(props:Open) => (props.open ? '180deg' : '0deg')});
  transition: transform 300ms, margin 300ms;
  
  ${SectionProfile}:hover &{
    margin: 1.5rem 0.75rem 1.5rem 0.75rem;
  }
`;

interface Open{
    open?:boolean;
}

type Props = {
    user?: User;
}
type User = {
    avatar?:string;
    name?:string;
    credit?:number;
}
const Profile: React.FC<Props> = (props) => {
    const {avatar,name,credit} = props.user;
    const [isOpen,setIsOpen] = useState(false);
    let node = null;

    const callback = (e) => {
        if(node && !node.contains(e.target)){
            setIsOpen(false);
        }
    };
    useEffect(() => {
        document.body.addEventListener('click',callback);

        return (() => {
            document.body.removeEventListener('click',callback);
        })
    });


    return (
        <Container ref={element => node = element}>
            <SectionProfile open={isOpen} onClick={() => setIsOpen(!isOpen)}>
                Profile
                <SectionProfileArrow open={isOpen}><i aria-hidden className="fas fa-angle-down"/></SectionProfileArrow>
                <SectionProfileImg alt="profile-picture" src={avatar}/>
            </SectionProfile>
            <DropdownMenu persona={name} credit={credit} isOpen={isOpen}/>
        </Container>
    )
};

export default Profile;