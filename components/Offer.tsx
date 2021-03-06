import React, { useState} from 'react';
import styled from 'styled-components'
import { useToasts } from 'react-toast-notifications';

import {OfferType} from "./Types";
import OFFER_STATE from '../server/types/OfferState';
import {INITIAL_OFFER_CANCEL_TIME, ITEMS_TRADE_BAN_EXPIRE} from '../server/config';

import {useLazyQuery} from "@apollo/react-hooks";
import {gql} from 'apollo-boost';

import ItemsManager from "./ItemsManager";
import CopyLink from "./CopyLink";
import LazyLoadingButton from "./LazyLoadingButton";

import {getErrorMessage} from "./helpFunctions";

const Container = styled.div`
  position: relative;
  margin-bottom: 3rem;
  padding: .5rem;
  
  background: var(--color-arcana);
`;

const SemiContainer = styled.div`
  display: grid;

  grid-template-columns: 3fr 1fr;
  grid-template-rows: 1fr 3rem;
  grid-template-areas: 
  "items details"
  "link toggleButton";
  
  padding: 1rem;
  
  border: 2px dashed var(--color-white);
`;

type ToggleButtonProps = {
    isToggled: boolean;
    isDisable: boolean;
}
const ToggleButton = styled.div`
  position: relative;
  
  display: flex;
  justify-content: center;
  align-items: center;
  
  flex: 1;
  
  margin-left: .5rem;
  
  padding: 0.25rem;
  
  font-size: 0.8rem;
  font-weight: bold;
  
  border: solid 4px var(--color-${(props:ToggleButtonProps) => props.isDisable ? 'gray' : props.isToggled ? 'ancient' : 'rare'});
  color: var(--color-white);
  
  background: var(--color-${(props:ToggleButtonProps) => props.isDisable ? 'gray' : props.isToggled ? 'ancient' : 'rare'});
  
  cursor: ${(props:ToggleButtonProps) => props.isDisable ? 'default' : 'pointer'};
  user-select: none;
  &:after{
    content: '';
    position: absolute;
    
    width: 1rem;
    background: white;
    
    top: 0;
    bottom: 0;
    ${(props:ToggleButtonProps) => props.isToggled ? 'left: 0;' : 'right: 0;'}
  }
  @media (max-width: 1150px) {
    font-size: .7rem;
    &:after{
      width: 0.2rem;
    }
  }
`;
const ToggleButtonWrapper = styled.div`
  grid-area: toggleButton;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  
  margin: 0 1rem;
  
  font-size: 1.5rem;
  
  color: var(--color-white);
  
  @media (max-width: 1250px) {
    font-size: 1rem;
  }
`;

const ToggleButtonWrapperWrapper = styled.div`
  width: 100%;
  
  display: flex;
  justify-content: center;
  align-items: center;
`;

const RelativeContainer = styled.div`
  position: relative;
`;

const DescriptionTitle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  
  margin-top: .5rem;
  margin-bottom: 0.2rem;
  
  text-align: center;
  letter-spacing: 1px;
  font-size: 1.2rem;
  font-weight: bold;
  
  color: var(--color-white);
`;

const PriceWrapper = styled.div`
  color: var(--color-white);

  position: relative;
  
  align-self: center;
  
  display: flex;
  justify-content: center;
  align-items: center;
  
  margin: 0 1rem;
  
  font-size: 2.5rem;
  
  &::after{
    content: '€';
    position: absolute;
    bottom: 0.25rem;
    right: -1rem;
    font-size: 1.2rem;
    
    color: var(--color-gray);
  }
`;

const BottomSeparator = styled.div`
  &:after{
    content: "";
    position: absolute;
    bottom: -10px;
    height: 2px;
    width: 60%;
    
    background: var(--color-gray);
  }
`;

type ColorStyleProps = {
    color: string;
}
const StatusWrapper = styled(BottomSeparator)`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  
  margin: .7rem;
  margin-top: 0;
  padding-bottom: 0.3rem;

  text-align: center;
  font-size: 1.3rem;
  font-weight: bold;

  color: var(--color-${(props: ColorStyleProps) => props.color});
`;

const DateWrapper = styled(BottomSeparator)`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  
  margin: .7rem;
  margin-top: 0;
  padding-bottom: 0.3rem;
  
  font-size: 1.3rem;
  font-weight: bold;
  
  color: var(--color-${(props: ColorStyleProps) => props.color});
`;

const ProfileInfoWrapper = styled(BottomSeparator)`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  
  margin: .7rem;
  margin-top: .1rem;
  padding-bottom: 0.3rem;
  
  color: var(--color-white);
  
  font-size: 1.3rem;
  font-weight: bold;
  text-align: center;
  
  word-break: break-word;
`;

const ProfileImgWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  
  margin-left: 1rem;
  height: 3rem;
  width: 3rem;
  border-radius: 50%;
  
  border: 2px solid var(--color-rare);
  
  filter: drop-shadow(0 0 .4rem var(--color-rare));
  overflow: hidden;
`;

const DetailsWrapper = styled.div`
  grid-area: details;

  display: flex;
  flex-direction: column;
`;

type OverMessageType = {
    isCancel: boolean;
}
const OverMessage = styled.div`
  position: absolute;
  top: 50%;
  right: 0;
  
  display: flex;
  justify-content: center;
  align-items: center;
  
  padding: 1rem;
  width: 100%;
  height: 20%;
 
  background: var(--color-${(props:OverMessageType) => props.isCancel ? 'ancient' : 'deepgreen'});
  color: white;
  
  transform: translateY(-50%);
`;
const ItemManagerWrapper = styled.div`
  min-height: 25rem;
  display: flex;
`;
const CopyLinkWrapper = styled.div`
  grid-area: link;
`;

const TradeReferenceWrapper = styled.div`
  position: absolute;
  top: .5rem;
  right: .5rem;
  
  display: flex;
  
  padding: .5rem;
  
  color: var(--color-white);
  background: var(--color-deepgreen);
  filter: drop-shadow(0 0 .2rem var(--color-black));
  font-weight: bold;
  
  user-select: none;
  cursor: pointer;
`;

const LeftMargin = styled.div`
  margin-left: .5rem;
`;

const OFFER_STATE_VALUES = {
    [OFFER_STATE.USER_WITHDRAW] : {
        text: 'Owner withdraw',
        color: 'ancient',
    },[OFFER_STATE.OFFER_CANCELED] : {
        text: 'Offer canceled',
        color: 'ancient',
    },[OFFER_STATE.INITIAL_CREATE] : {
        text: 'INITIAL CREATE',
        color: 'immortal',
    },[OFFER_STATE.BOT_HOLDING] : {
        text: 'TRADE BAN HOLD',
        color: 'immortal',
    },[OFFER_STATE.BOT_READY] : {
        text: 'Offer ready',
        color: 'deepgreen',
    },[OFFER_STATE.BUYER_PAY] : {
        text: 'Buyer pays',
        color: 'deepgreen',
    },[OFFER_STATE.COMPLETED] : {
        text: 'Offer completed',
        color: 'deepgreen',
    },
}

const OFFER_REQUESTS = {
    USER_WITHDRAW: 'withdrawOffer',
    BUYER_WITHDRAW: 'withdrawBoughtItems',
    BUY_OFFER: 'buyOffer',
}
const generateGQLRequest = (method, offerId) => {
    return gql`
        {
            ${method}(offerid: "${offerId}") {
                error
                success
            }
        }
    `;
}

const STEAM_OFFER_LINK = "https://steamcommunity.com/tradeoffer/"

type Props = {
    offer: OfferType;
    reloadOffer: () => void;
}

const Offer: React.FC<Props> = (props) => {
    const {offer: {items, id, is_mine, is_buyer, owner: {name, avatar}, trade_id, price, date, status}, reloadOffer} = props;
    const [itemsDetails, setItemsDetails] = useState(false);
    const {addToast} = useToasts();

    let actionText = "NO ACTION";
    let method:string;
    let disableAction = false;
    if(status === OFFER_STATE.BOT_READY || (status === OFFER_STATE.BUYER_PAY && is_buyer)) {
        if(status === OFFER_STATE.BOT_READY && is_mine) {
            actionText = "CANCEL";
            method = OFFER_REQUESTS.USER_WITHDRAW;
        } else if(status === OFFER_STATE.BOT_READY) {
            actionText = "BUY";
            method = OFFER_REQUESTS.BUY_OFFER;
        } else if(status === OFFER_STATE.BUYER_PAY && is_buyer) {
            actionText = "WITHDRAW";
            method = OFFER_REQUESTS.BUYER_WITHDRAW;
        }
    } else {
        disableAction = true;
    }

    const [getQuery, {loading}] = useLazyQuery(generateGQLRequest(method, id),{
        fetchPolicy: 'network-only',
        onCompleted: (data => {
            if(data) {
                const {withdrawOffer, withdrawBoughtItems, buyOffer} = data;
                let activeData;
                switch (method) {
                    case OFFER_REQUESTS.USER_WITHDRAW:
                        activeData = withdrawOffer;
                        break;
                    case OFFER_REQUESTS.BUYER_WITHDRAW:
                        activeData = withdrawBoughtItems;
                        break;
                    case OFFER_REQUESTS.BUY_OFFER:
                        activeData = buyOffer;
                        break;
                }
                const {error, success} = activeData;
                if(error) {
                    addToast(getErrorMessage(error, "There was an error during data request") , {
                        appearance: 'warning',
                        autoDismiss: true,
                    })
                } else if(success) {
                    let successMsg = "Action was successfully finished"
                    switch (method) {
                        case OFFER_REQUESTS.USER_WITHDRAW:
                        case OFFER_REQUESTS.BUYER_WITHDRAW:
                            successMsg = "Withdraw offer was created";
                            break;
                        case OFFER_REQUESTS.BUY_OFFER:
                            successMsg = "Offer was bought successfully";
                            reloadOffer();
                            break;
                    }
                    addToast(successMsg , {
                        appearance: 'success',
                        autoDismiss: true,
                    })
                    reloadOffer();
                }
            }
        }),
        onError: () => {
            addToast("There was an error during data request" , {
                appearance: 'error',
                autoDismiss: true,
            })
        }
    });

    const generateOverMessage = () => {
        if(status === OFFER_STATE.OFFER_CANCELED || status === OFFER_STATE.USER_WITHDRAW) {
            return (<OverMessage isCancel={true}>CANCELED</OverMessage>);
        } else if (status === OFFER_STATE.INITIAL_CREATE || status === OFFER_STATE.COMPLETED) {
            return (<OverMessage isCancel={false}>{status === 0 ? 'BOT WAITING FOR ITEMS' : 'COMPLETED'}</OverMessage>)
        }
    }

    const generateStatus = () => {
        const offerValue = OFFER_STATE_VALUES[status];
        return (<StatusWrapper color={offerValue.color}>{offerValue.text.toUpperCase()}</StatusWrapper>)
    }

    const generateTimeTitle = () => {
        let timeTitle = "DATE:";
        switch (status) {
            case OFFER_STATE.OFFER_CANCELED:
            case OFFER_STATE.USER_WITHDRAW:
                timeTitle = "CANCEL:";
                break;
            case OFFER_STATE.INITIAL_CREATE:
                timeTitle = "EXPIRE:";
                break;
            case OFFER_STATE.BOT_HOLDING:
                timeTitle = "TRADE BAN EXPIRE:";
                break;
            case OFFER_STATE.BOT_READY:
                timeTitle = "OFFER READY SINCE:";
                break;
            case OFFER_STATE.BUYER_PAY:
            case OFFER_STATE.COMPLETED:
                timeTitle = "OFFER WAS COMPLETED:";
                break;
        }

        return (<DescriptionTitle>{timeTitle}</DescriptionTitle>)
    }

    const generateTime = () => {
        let time = '';
        let color = '';
        const d = new Date(date);
        if(status === OFFER_STATE.INITIAL_CREATE) {
            color = "ancient";
            time = 'in ' + Math.ceil((d.getTime() + INITIAL_OFFER_CANCEL_TIME * 1000 * 60 - new Date().getTime()) / 1000 / 60).toString() + ' minute/s';
        } else if(status === OFFER_STATE.BOT_HOLDING) {
            color = "immortal";
            time = 'in ' + Math.ceil((d.getTime() + ITEMS_TRADE_BAN_EXPIRE * 1000 * 60 * 60 * 24 - new Date().getTime()) / 1000 / 60 / 60 / 24).toString() + ' day/s';
        } else {
            color = "white";
            const c = d => {return d < 10 ? '0' + d : d};
            time = [c(d.getDate()), c(d.getMonth() + 1), c(d.getFullYear())].join('.');
        }

        return (<DateWrapper color={color}>{time}</DateWrapper>)
    }

    const generateItemsDetailButton = () => {
        return (<ToggleButtonWrapper>
            <ToggleButtonWrapperWrapper>
                Item details:
                <ToggleButton
                    isDisable={items.length === 0}
                    isToggled={!itemsDetails}
                    onClick={() => {
                        if (items.length !== 0) setItemsDetails(!itemsDetails)
                    }}>
                    {items.length === 0 ? 'DISABLED' : !itemsDetails ? 'OFF' : 'ON'}
                </ToggleButton>
            </ToggleButtonWrapperWrapper>
        </ToggleButtonWrapper>)
    }

    const openSteamOffer = () => {
        const url = STEAM_OFFER_LINK + trade_id;
        window.open(url, '_blank');
    }

    const action = () => {
        getQuery();
    }

    return (
        <Container>
            <SemiContainer>
                {trade_id && <TradeReferenceWrapper onClick={openSteamOffer}>Trade link<LeftMargin><i className="fas fa-share"/></LeftMargin></TradeReferenceWrapper>}
                <RelativeContainer>
                    <ItemManagerWrapper>
                        <ItemsManager error={items === [] ? null : ""} items={items} action={()=>{}} gridSelector={"inventory"} createDescriptions={itemsDetails} itemSize={"100px"}/>
                    </ItemManagerWrapper>
                    {generateOverMessage()}
                </RelativeContainer>
                <CopyLinkWrapper><CopyLink offerId={id}/></CopyLinkWrapper>
                <DetailsWrapper>
                    <DescriptionTitle>OWNER:</DescriptionTitle>
                    <ProfileInfoWrapper>{name} <ProfileImgWrapper><img src={avatar} alt="profile"/></ProfileImgWrapper></ProfileInfoWrapper>
                    <DescriptionTitle>STATUS:</DescriptionTitle>
                    {generateStatus()}
                    {generateTimeTitle()}
                    {generateTime()}
                    <DescriptionTitle>PRICE:</DescriptionTitle>
                    <PriceWrapper>{price}</PriceWrapper>
                    <LazyLoadingButton isLoading={loading} isDisable={disableAction ?? true} displayedText={actionText} action={action} small={true} bottomAlign={true}/>
                </DetailsWrapper>
                {generateItemsDetailButton()}
            </SemiContainer>
        </Container>
    )
};

export default Offer;