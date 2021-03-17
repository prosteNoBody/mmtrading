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

const IndexEditor: React.FC = () => {
    const bgImageSrc = Math.random() < 0.5 ? '/bg1.jpg' : '/bg2.jpg';

    return (
        <Container bgSrc={bgImageSrc}>
            <UserGuide/>
        </Container>
    );
};

export default IndexEditor;