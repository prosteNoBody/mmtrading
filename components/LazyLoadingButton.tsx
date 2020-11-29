import React from 'react';
import styled from 'styled-components';

import SvgCircleTail from './SvgCircleTail';

type StyledButtonProps = {
    isLoading: boolean;
}
const StyledButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  
  width: 100%;
  height: 6rem;
  padding: 2rem;
  margin-top: 2rem;
  
  filter: drop-shadow(0 0 0.75rem gray);
  border: none;
  
  border-radius: 8px;
  color: var(--color-white);
  background: var(--color-rare);
  
  font-size: 130%;
  
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
}
const LazyLoadingButton: React.FC<Props> = (props) => {
    const {isLoading, displayedText, action} = props;

    return(
        <StyledButton disabled={isLoading} isLoading={isLoading} onClick={() => {
            if(!isLoading)
                action();
        }}>
            {isLoading ?
            (<StyleSvgCircleTail/>) :
            displayedText}
        </StyledButton>
    );
};

export default LazyLoadingButton;