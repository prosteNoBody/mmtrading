import React, { ReactNode} from 'react';
import styled from 'styled-components';

type ContainerProps = {
    color: string;
}
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  
  width: 100%;
  height: 4rem;
  
  color: var(--color-white);
  background: var(${(props:ContainerProps) => props.color});
  border: 0 solid var(${(props:ContainerProps) => props.color});
  
  cursor: pointer;
  transition: 200ms;
  &:hover{
    color: var(${(props:ContainerProps) => props.color});
    background: var(--color-white);
    border-width: .3rem;
    
    filter: drop-shadow(0 0 .5rem var(${(props:ContainerProps) => props.color}));
  }
`;

type Props = {
    action: () => void;
    color: string;
    children: ReactNode;
}
const ActionButton: React.FC<Props> = (props) => {
    const {action, color, children} = props;

    return(
        <Container onClick={() => action()} color={color}>
            {children}
        </Container>
    );
};

export default ActionButton;