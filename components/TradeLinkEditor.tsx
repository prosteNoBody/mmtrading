import React, {useEffect, useRef, useState} from 'react';
import { useToasts } from 'react-toast-notifications';
import styled from 'styled-components';

import LazyLoadingButton from "./LazyLoadingButton";
import {useLazyQuery} from "@apollo/react-hooks";
import {gql} from 'apollo-boost';
import {getErrorMessage} from "./helpFunctions";

const Container = styled.div`
  width: 80%;
  padding: 2rem;
  
  display: flex;
  flex-direction: column;
  
  filter: drop-shadow(0 0 0.75rem var(--color-black));
  
  transition: opacity 300ms;
  background: var(--color-arcana);
`;

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

const TradeLinkTitle = styled.div`
  margin-bottom: 1rem;
  
  color: var(--color-white);
  font-size: 2rem;
`;

type Props = {
    action: () => void;
}
type TradeLink = {
    getTradeUrl?: {
        error?: string,
        tradeurl?: string,
        changed?: boolean,
    }
}

const TRADELINK_REQUEST = gql`
query ($tradeUrl: String!){
    getTradeUrl(tradeUrl:$tradeUrl){
        error
        tradeurl
        changed
    }
}`;
const TradeLinkEditor: React.FC<Props> = (props) => {
    const [tradeUrl, setTradeUrl] = useState("");
    const { addToast } = useToasts();
    const inputEl = useRef(null);

    const [getQuery, {loading, error }] = useLazyQuery<TradeLink>(TRADELINK_REQUEST,{
        fetchPolicy: 'network-only',
        onCompleted: (data => {
            if(data) {
                if(data.getTradeUrl?.error) {
                    addToast(getErrorMessage(data.getTradeUrl.error, "There was an error during data request") , {
                        appearance: 'warning',
                        autoDismiss: true,
                    })
                } else if(data.getTradeUrl?.tradeurl) {
                    if(data.getTradeUrl.changed){
                        addToast("Your trade link was successfully updated", {
                            appearance: 'success',
                            autoDismiss: true,
                        })
                    }
                    setTradeUrl(data.getTradeUrl?.tradeurl);
                }
            } else if(error) {
                addToast("There was an error during data request" , {
                    appearance: 'error',
                    autoDismiss: true,
                })
            }
            inputEl.current.focus();
        })
    });

    useEffect(() => {
        refetchData(true)
    },[])

    const tradeLinkUrl = "https://steamcommunity.com/id/me/tradeoffers/privacy#trade_offer_access_url";

    const handleKeyDown = e => {
        if(e.keyCode === 13) {
            refetchData();
        }
    }

    const refetchData = (inital:boolean = false) => {
        if(!inital && tradeUrl === "") {
            inputEl.current.focus();
            addToast("You have to fill your token before sending", {
                appearance: 'warning',
                autoDismiss: true,
            })
        } else {
            getQuery({variables: {tradeUrl}})
        }
    }

    return(
        <Container>
            <TradeLinkTitle>Trade link</TradeLinkTitle>
            <InputUrl ref={inputEl} placeholder="Trade Link" value={tradeUrl} onChange={e => setTradeUrl(e.target.value)} onFocus={e => e.target.select()} onKeyDown={handleKeyDown} disabled={loading}/>
            <LazyLoadingButton isLoading={loading} displayedText={"Update"} action={() => refetchData()}/>
            <TradeLinkUrl href={tradeLinkUrl} target="_blank">Where get trade link?</TradeLinkUrl>
        </Container>
    );
};

export default TradeLinkEditor;