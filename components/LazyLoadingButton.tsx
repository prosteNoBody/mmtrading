import React from 'react';
import styled from 'styled-components';

import SvgCircleTail from './SvgCircleTail';

type StyledButtonProps = {
    isLoading: boolean;
    isDisable?: boolean;
    small?: boolean;
    bottomAlign?: boolean;
}
const StyledButton = styled.button`
  grid-area: submit;
  display: flex;
  justify-content: center;
  align-items: center;
  
  width: ${(props:StyledButtonProps) => props.small ? '70%' : '100%'};
  height: ${(props:StyledButtonProps) => props.small ? '3rem' : '6rem'};
  padding: 2rem;
  margin: auto;
  ${(props:StyledButtonProps) => props.bottomAlign ? 'margin-top:auto' : props.small ? 'margin-top: 0rem;' : 'margin-top: 2rem'};
  margin-bottom: ${(props:StyledButtonProps) => props.bottomAlign ? '0' : 'auto'};
  
  filter: drop-shadow(0 0 0.75rem var(--color-gray));
  border: none;
  
  border-radius: 8px;
  color: var(--color-white);
  background: var(--color-rare);
  font-size: ${(props:StyledButtonProps) => props.small ? '1rem' : '1.3rem'};
  
  opacity: ${(props: StyledButtonProps) => props.isLoading || props.isDisable ? 0.7 : 1};
  transition: all 300ms;
  cursor: ${(props: StyledButtonProps) => props.isLoading || props.isDisable ? 'default' : 'pointer'};
`;

const StyleSvgCircleTail = styled(SvgCircleTail)`
  fill: blue;
`;

type Props = {
    isLoading: boolean;
    isDisable?: boolean;
    displayedText: string;
    action: () => void;
    small?: boolean;
    bottomAlign?: boolean;
}
const LazyLoadingButton: React.FC<Props> = (props) => {
    const {isLoading, displayedText, action, small, isDisable, bottomAlign} = props;

    return(
        <StyledButton disabled={isLoading || isDisable} isLoading={isLoading || isDisable} small={small} bottomAlign={bottomAlign} onClick={() => {
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