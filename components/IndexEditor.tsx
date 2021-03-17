import React from 'react';
import styled from 'styled-components';
import UserGuide from "./UserGuide";

type ContainerProp = {
    bgSrc: string;
}
const Container = styled.div`
  position: relative;

  grid-area: main-content;
  display: flex;
  justify-content: center;
  align-items: center;
  
  background: url(${(props:ContainerProp) => props.bgSrc})no-repeat center center fixed;
  background-size: cover;
  
  &:after{
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    
    background: rgba(0, 0, 0, 0.3);
    background: radial-gradient(circle, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.8) 100%);
  }
`;
const THEMES = [
    {
        bg: '/bg1.jpg',
        color: 'ancient'
    },
    {
        bg: '/bg2.jpg',
        color: 'rare'
    },
    {
        bg: '/bg3.jpg',
        color: 'deepgreen'
    },
    {
        bg: '/bg4.jpg',
        color: 'mythical'
    },
];
const IndexEditor: React.FC = () => {
    const themeStyle = THEMES[Math.floor(Math.random() * THEMES.length)];

    return (
        <Container bgSrc={themeStyle.bg}>
            <UserGuide themeColor={themeStyle.color}/>
        </Container>
    );
};

export default IndexEditor;