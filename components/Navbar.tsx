import React, {useState} from 'react';
import Link from 'next/link';
import styled from 'styled-components'

const Container = styled.div`
  grid-area: navbar;
  display: flex;
  align-items: stretch;
  
  width: 100%;
  height: 100%;

  background: #222b3b;
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

const SectionProfileArrow = styled.div`
  margin: 1rem 0.5rem 1rem 0.5rem;
  
  transform-origin: center;
  transform: rotate(${(props:Open) => (props.open ? '180deg' : '0deg')});
  transition: transform 300ms;
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

interface Open{
    open?:boolean;
}
const ProfileInfo = styled.div`  
    position: absolute;
    display: ${(props:Open) => (props.open ? 'flex' : 'none')};
    flex-direction: column;
    
    padding: 0.5rem 1rem;
    width: 100%;
    border-radius: 1rem;
    
    background: dimgrey;
    
    z-index: 2;
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
    
    font-weight: bold;
    text-transform: uppercase;
    
    user-select: text;
`;

const ProfileInfoItemLogout = styled(ProfileInfoItem)`
  margin-bottom: 0.5rem;
  
  background: none;
  color: red;
  border: 2px solid lightgrey;
  
  user-select: none;
  cursor: pointer;
`;

const Credit = styled.div`
  color: gold;
  
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

    return (
        <Container>
            <Link href={"/"}><Section>MMtrading</Section></Link>
            <Link href={"/dashboard"}><Section>Dashboard</Section></Link>
            <Link href={"/offers"}><Section>Offers</Section></Link>
            <Link href={"/faq"}><Section>F.A.Q.</Section></Link>
            <Profile>
                <SectionProfile onClick={() => setIsOpen(!isOpen)}>
                    Profile
                    <SectionProfileArrow open={isOpen}><i aria-hidden className="fas fa-angle-down"/></SectionProfileArrow>
                    <SectionProfileImg alt="profile-picture" src={avatar}/>
                </SectionProfile>
                <ProfileInfo open={isOpen}>
                    <ProfileInfoItem>{persona}</ProfileInfoItem>
                    <ProfileInfoItem>Credit: <Credit>{credit}</Credit></ProfileInfoItem>
                    <Link href={"/auth/logout"}><ProfileInfoItemLogout>Log Out</ProfileInfoItemLogout></Link>
                </ProfileInfo>
            </Profile>
        </Container>
    )
};

export default Navbar;