import React, {useEffect, useState} from 'react';
import styled from 'styled-components'

import {OfferType, UserType} from "./Types";

import ItemsManager from "./ItemsManager";
import CopyLink from "./CopyLink";

const Container = styled.div`
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
}
const ToggleButton = styled.div`
  position: relative;
  
  display: flex;
  justify-content: center;
  align-items: center;
  
  flex: 1;
  
  margin-left: .5rem;
  
  padding: 0.25rem;
  
  border: solid 4px var(--color-${(props:ToggleButtonProps) => props.isToggled ? 'ancient' : 'rare'});
  color: var(--color-white);
  
  background: var(--color-${(props:ToggleButtonProps) => props.isToggled ? 'ancient' : 'rare'});
  
  cursor: pointer;
  user-select: none;
  &:after{
    content: '';
    position: absolute;
    
    width: 2rem;
    background: var(--color-white);
    
    top: 0;
    bottom: 0;
    ${(props:ToggleButtonProps) => props.isToggled ? 'left: 0;' : 'right: 0;'}
  }
`;
const ToggleButtonWrapper = styled.div`
  grid-area: toggleButton;
  display: flex;
  justify-content: center;
  align-items: center;
  
  margin: 0 1rem;
  
  color: var(--color-white);
`;

const RelativeContainer = styled.div`
  position: relative;
`;

const ProfileInfoWrapper = styled.div`
  position: relative;
  grid-area: profile;
  display: flex;
  justify-content: center;
  align-items: center;
  
  margin: 1rem;
  padding-bottom: 0.3rem;
  
  color: var(--color-white);
  
  font-size: 1.3rem;
  font-weight: bold;
  text-align: center;
  
  word-break: break-word;
  
  &:after{
    content: "";
    position: absolute;
    bottom: -10px;
    height: 2px;
    width: 60%;
    
    background: grey;
  }
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
 
  background: var(--color-${(props:OverMessageType) => props.isCancel ? 'ancient' : 'arcana'});
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

type Props = {
    offer: OfferType;
    user: UserType;
}
const Offer: React.FC<Props> = (props) => {
    const {offer: {items, id, is_mine, user_id, buyer_id, trade_id, price, date, status}, user: {name, avatar}} = props;

    const [itemsDetails, setItemsDetails] = useState(false);

    const generateOverMessage = () => {
        if(status === -1 || status === -2) {
            return (<OverMessage isCancel={true}>CANCELED</OverMessage>);
        } else if (status === 0 || status === 4) {
            return (<OverMessage isCancel={false}>{status === 0 ? 'BOT WAITING FOR ITEMS' : 'COMPLETED'}</OverMessage>)
        }
    }

    return (
        <Container>
            <SemiContainer>
                <RelativeContainer>
                    <ItemManagerWrapper>
                        <ItemsManager error={items === [] ? null : ""} items={items} action={()=>{}} gridSelector={"inventory"} createDescriptions={itemsDetails} itemSize={"100px"}/>
                    </ItemManagerWrapper>
                    {generateOverMessage()}
                </RelativeContainer>
                <CopyLinkWrapper><CopyLink offerId={id}/></CopyLinkWrapper>
                <DetailsWrapper>
                    <ProfileInfoWrapper>{name} <ProfileImgWrapper><img src={avatar}/></ProfileImgWrapper></ProfileInfoWrapper>
                </DetailsWrapper>
                <ToggleButtonWrapper>Item details: <ToggleButton isToggled={itemsDetails} onClick={() => setItemsDetails(!itemsDetails)}>{itemsDetails ? 'OFF' : 'ON'}</ToggleButton></ToggleButtonWrapper>
            </SemiContainer>
        </Container>
    )
};

export default Offer;