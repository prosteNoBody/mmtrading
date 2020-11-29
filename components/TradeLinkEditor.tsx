import React, {useEffect, useState} from 'react';
import { useToasts } from 'react-toast-notifications';
import Link from "next/link";
import styled from 'styled-components';

import LazyLoadingButton from "./LazyLoadingButton";

const Container = styled.div`
  width: 80%;
  padding: 2rem;
  
  display: flex;
  flex-direction: column;
  
  filter: drop-shadow(0 0 0.75rem var(--color-black));
  
  opacity: ${(props: ContainerProps) => props.isLoading ? 0.7 : 1};
  transition: opacity 300ms;
  background: var(--color-arcana);
`;

type ContainerProps = {
    isLoading: boolean;
}
const InputUrl = styled.input`
  font-family: inherit; /* 1 */
  font-size: 110%; /* 1 */
  line-height: 1.5; /* 1 */
  margin: 0; /* 2 */

  color: #AAA;
  padding: 1.5rem 2rem;
  border-radius: 0.2rem;
  background-color: rgb(255, 255, 255);
  border: none;
  width: 100%;
  display: block;
  border-bottom: 0.3rem solid transparent;
  transition: all 300ms;
  text-align: center;
  filter: drop-shadow(0 0 0.75rem darkgrey);
  
  ::placeholder{
    color: #AAA;
  }
  
`;

const TradeLinkUrl = styled.a`
  align-self: flex-end;
  
  width: auto;
  padding: 1rem;
  margin-top: 2rem;
  border-radius: 0.2rem;
  
  color: var(--color-white);
  background: var(--color-immortal);
  
  text-decoration: none;
  text-underline: none;
`;

type Props = {
    action: () => void;
}
const TradeLinkEditor: React.FC<Props> = (props) => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const { addToast } = useToasts();
    useEffect(() => {
        updateUrl();
    }, [])

    const tradeLinkUrl = "https://steamcommunity.com/id/me/tradeoffers/privacy#trade_offer_access_url";

    const updateUrl = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
        },3000)
    }

    return(
        <Container isLoading={isLoading}>
            <InputUrl placeholder="Trade Link" onFocus={e => e.target.select()} disabled={isLoading}/>
            <LazyLoadingButton isLoading={isLoading} displayedText={"Update"} action={updateUrl}/>
            <TradeLinkUrl href={tradeLinkUrl} target="_blank">Where get trade link?</TradeLinkUrl>
        </Container>
    );
};

export default TradeLinkEditor;