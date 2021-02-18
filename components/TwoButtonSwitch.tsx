import React, {useEffect, useRef, useState} from 'react';
import styled from 'styled-components';
import {assertValidExecutionArguments} from "graphql/execution/execute";

const Container = styled.div`
  display: flex;

  margin-bottom: 1rem;
  min-width: 30rem;

  border-radius: 2rem;
  background: var(--color-rare);
  
  overflow: hidden;
`;

type SwitchItemProps = {
    isOn: boolean;
}
const SwitchItem = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  
  flex: 1 1 0;
  
  padding: 1.5rem 1rem;
  
  white-space: nowrap;
  font-size: 1.5rem;
  color: var(--color-white);
  background: ${(props: SwitchItemProps) => props.isOn ? 'rgb(0, 0, 0, 0.2)' : ''};
  user-select: none;
  
  cursor: ${(props: SwitchItemProps) => props.isOn ? '' : 'pointer'};
`;

const Divider = styled.div`
  height: 100%;
  width: 2px;
  
  background: var(--color-white);
`;

const RefreshButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  
  padding: 1rem 2rem;
  
  color: var(--color-white);
  font-size: 1.5rem;
  
  cursor: pointer;
  overflow: hidden;
  & i{
    transform: rotate(0deg);
    transition-duration: 300ms;
    transition-delay: 100ms;
    transition-timing-function: ease-out;
  }
  &:hover i{
    transform: rotate(360deg);
  }
  &:active {
    background: rgba(0, 0, 0, 0.2);
  }
`;

type Props = {
    changeSwitch: (boolean) => void;
    isOn: boolean;
    firstSwitchText: string;
    secondSwitchText: string;
    refreshAction?: () => void;
}

const TwoButtonSwitch: React.FC<Props> = (props) => {
    const {changeSwitch, isOn, firstSwitchText, secondSwitchText, refreshAction} = props;

    const changeSwitchTo = (value:boolean) => {
        changeSwitch(value);
    }

    const generateRefreshButton = () => {
        if(refreshAction)
            return (<><RefreshButton onClick={refreshAction}><i aria-hidden className="fas fa-redo"/></RefreshButton><Divider/></>)
    }

    return(
        <Container>
            <SwitchItem isOn={isOn} onClick={() => changeSwitchTo(true)}>
                {firstSwitchText}
            </SwitchItem>
            <Divider/>
            {generateRefreshButton()}
            <SwitchItem isOn={!isOn} onClick={() => changeSwitchTo(false)}>
                {secondSwitchText}
            </SwitchItem>
        </Container>
    );
};

export default TwoButtonSwitch;