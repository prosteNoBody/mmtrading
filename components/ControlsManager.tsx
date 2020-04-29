import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  grid-area: controls;
  display: flex;
  flex-direction: column;
  margin: 1rem;
`;


const Icon = styled.div`
  color: whitesmoke;
  transform: rotate(0deg);
  transition: transform 250ms;
`;
const Button = styled.button`
  width: 80%;
  padding: 1rem 0.5rem;
  margin: 1rem;
  border: 2px solid deepskyblue;
  background: cadetblue;
  cursor: pointer;
  &:hover ${Icon}{
    transform: rotate(360deg);
  }
`;

type Props = {
    refreshAction:() => void;
    emptyAction:() => void;
    fullAction:() => void;
}
const ControlsManager: React.FC<Props> = (props) => {
    const {refreshAction,emptyAction,fullAction} = props;

    return (
        <Container>
            <Button onClick={()=>refreshAction()}><Icon><i aria-hidden className="fas fa-redo"/></Icon></Button>
            <Button onClick={()=>fullAction()}><Icon><i aria-hidden className="fas fa-long-arrow-alt-right"/></Icon></Button>
            <Button onClick={()=>emptyAction()}><Icon><i aria-hidden className="fas fa-long-arrow-alt-left"/></Icon></Button>
        </Container>
    );
};

export default ControlsManager;