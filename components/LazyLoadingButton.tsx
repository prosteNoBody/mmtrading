import React from 'react';
import styled from 'styled-components';

import SvgCircleTail from './SvgCircleTail';

type StyledButtonProps = {
    isLoading: boolean;
    small?: boolean;
}
const StyledButton = styled.button`
  grid-area: submit;
  display: flex;
  justify-content: center;
  align-items: center;
  
  width: ${(props:StyledButtonProps) => props.small ? '50%' : '100%'};
  height: ${(props:StyledButtonProps) => props.small ? '3rem' : '6rem'};
  padding: 2rem;
  margin: auto;
  margin-top: ${(props:StyledButtonProps) => props.small ? '0rem' : '2rem'};
  
  filter: drop-shadow(0 0 0.75rem gray);
  border: none;
  
  border-radius: 8px;
  color: var(--color-white);
  background: var(--color-rare);
  font-size: ${(props:StyledButtonProps) => props.small ? '100%' : '130%'};
  
  transition: all 300ms;
  cursor: ${(props: StyledButtonProps) => props.isLoading ? '' : 'pointer'};
`;

const StyleSvgCircleTail = styled(SvgCircleTail)`
  fill: blue;
`;

type Props = {
    isLoading: boolean;
    displayedText: string;
    action: () => void;
    small?: boolean;
}
const LazyLoadingButton: React.FC<Props> = (props) => {
    const {isLoading, displayedText, action, small} = props;

    return(
        <StyledButton disabled={isLoading} isLoading={isLoading} small={small} onClick={() => {
            if(!isLoading) {
                action();
            }
        }}>
            {isLoading ?
            (<StyleSvgCircleTail/>) :
            displayedText}
        </StyledButton>
    );
};

export default LazyLoadingButton;