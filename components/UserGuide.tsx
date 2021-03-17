import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  position: relative;

  display: flex;
  justify-content: center;
  width: 70rem;
  height: 16rem;
  
  padding: 2rem;
  
  background: #E5E5E5;
  font-weight: lighter;
  
  z-index: 2;
`;

const UserGuide: React.FC = () => {
    return (
        <Container>
            <h1>How to use MMTrading?</h1>
        </Container>
    );
};

export default UserGuide;