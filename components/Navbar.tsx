import React, { useState, useEffect} from 'react';
import Link from 'next/link';
import styled from 'styled-components'

const Container = styled.div`
  position: relative;
  grid-area: navbar;
  display: flex;
  align-items: stretch;
  
  width: 100%;
  height: 100%;

  background: #222b3b;
  
  z-index: 2;
`;

const Section = styled.div`
  padding: 1rem;
  
  color: antiquewhite;
  border-right: 2px solid antiquewhite;
  
  text-align: center;
  font-size: 1.5rem;
  
  line-height: 3rem;
  cursor: pointer;
`;

const SectionProfile = styled(Section)`
  display: flex;
  align-content: center;
  align-items: center;
  
  height: 100%;
  
  border-right: none;
`;

const SectionProfileImg = styled.img`
  border-radius: 50%;
  
  border: 2px solid lightskyblue;
  
  overflow: hidden;
  transform: scale(0.8);
`;

const Profile = styled.div`
  position: relative;
  
  margin-left: auto;
  
  user-select: none;
`;

const SectionProfileArrow = styled.div`
  margin: ${(props:Open) => (props.open ? '1.5rem 1rem 1.5rem 1rem' : '1rem 0.5rem 1rem 0.5rem')};
  
  transform-origin: center;
  transform: rotate(${(props:Open) => (props.open ? '180deg' : '0deg')}) scale(${(props:Open) => (props.open ? '1.1' : '1')});
  transition: transform 300ms, margin 150ms ease-in;
  
  ${SectionProfile}:hover &{
    margin: 1.5rem 1rem 1.5rem 1rem;
    transform: rotate(${(props:Open) => (props.open ? '180deg' : '0deg')})  scale(1.1);
  }
`;

interface Open{
    open?:boolean;
}
const ProfileInfo = styled.div`  
    position: absolute;
    display: flex;
    flex-direction: column;
    
    padding: 0.5rem 1rem;
    width: 100%;
    border-radius: 1rem;
    
    background: dimgrey;
    
    z-index: auto;
    transform-origin: top;
    transform: translateX(${(props:Open) => (props.open ? '0' : '20rem')});
    transition: transform 400ms ease-out;
`;
const ProfileInfoTranslate = styled.div`
    width: inherit;
    
    transform: translate(-2rem,0.5rem);
`;

const ProfileInfoItem = styled.div`
    display: flex;
    justify-content: center;
    
    padding: 1.3rem;
    margin-top: 0.5rem;
    border-radius: 1rem;
    
    background: black;
    color: lightgrey;
    
    word-break: break-word;
    text-align: center;
    font-weight: bold;
    text-transform: uppercase;
`;

const ProfileInfoItemLogout = styled(ProfileInfoItem)`
  margin-bottom: 0.5rem;
  
  background: none;
  color: red;
  border: 2px solid lightgrey;
  
  user-select: none;
  cursor: pointer;
`;

interface Color{
    color?:string;
}
const CopyContent = styled.div`
  color: ${(props: Color) => props.color ? props.color : 'black'};
  
  user-select: text;
`;

type Props = {
    user: User;
}
type User = {
    avatar:string;
    persona:string;
    credit:number;
}


const Navbar: React.FC<Props> = (user) => {
    const {avatar,persona,credit} = user.user;
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
        <Container>
            <Link href={"/"}><Section>MMtrading</Section></Link>
            <Link href={"/dashboard"}><Section>Dashboard</Section></Link>
            <Link href={"/offers"}><Section>Offers</Section></Link>
            <Link href={"/faq"}><Section>F.A.Q.</Section></Link>
            <Profile ref={element => node = element}>
                <SectionProfile onClick={() => setIsOpen(!isOpen)}>
                    Profile
                    <SectionProfileArrow open={isOpen}><i aria-hidden className="fas fa-angle-down"/></SectionProfileArrow>
                    <SectionProfileImg alt="profile-picture" src={avatar}/>
                </SectionProfile>
                <ProfileInfoTranslate>
                    <ProfileInfo open={isOpen}>
                        <ProfileInfoItem><CopyContent color={'lightblue'}>{persona}</CopyContent></ProfileInfoItem>
                        <ProfileInfoItem>Credit: <CopyContent color={'gold'}>{credit}</CopyContent></ProfileInfoItem>
                        <Link href={"/auth/logout"}><ProfileInfoItemLogout>Log Out</ProfileInfoItemLogout></Link>
                    </ProfileInfo>
                </ProfileInfoTranslate>
            </Profile>
        </Container>
    )
};

export default Navbar;