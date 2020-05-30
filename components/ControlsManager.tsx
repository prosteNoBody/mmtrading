import React from 'react';
import styled from 'styled-components';

import ActionButton from './ActionButton';

const Container = styled.div`
  grid-area: controls;
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-direction: column;
  
  margin: 0 1rem;
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
            <ActionButton action={refreshAction} color={'--color-rare'}>
                <i aria-hidden className="fas fa-redo"/>
            </ActionButton>
            <ActionButton action={fullAction} color={'--color-arcana'}>
                <i aria-hidden className="fas fa-long-arrow-alt-right"/>
            </ActionButton>
            <ActionButton action={emptyAction} color={'--color-ancient'}>
                <i aria-hidden className="fas fa-long-arrow-alt-left"/>
            </ActionButton>
        </Container>
    );
};

export default ControlsManager;