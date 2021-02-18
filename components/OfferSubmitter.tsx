import React, {useState} from 'react';
import styled from 'styled-components'
import { useToasts } from 'react-toast-notifications';

import {ItemType} from "./Types";

import ItemsManager from './ItemsManager';
import PriceEditor from './PriceEditor';
import LazyLoadingButton from "./LazyLoadingButton";
import {useLazyQuery} from "@apollo/react-hooks";
import {gql} from "apollo-boost";
import {getErrorMessage} from "./helpFunctions";

const Container = styled.div`
  grid-area: preview;

  margin: 1.5rem 0 0 1.5rem;
  padding: .7rem;
  
  background: var(--color-arcana);
`;

const SemiContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 15rem;
  grid-template-rows: 2fr 3fr 5rem;
  grid-template-areas:
  "inventory profile"
  "inventory price"
  "inventory submit";

  width: 100%;
  height: 100%;
  
  padding: .5rem;
  
  border: 2px dashed var(--color-white);
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
    
    background: var(--color-gray);
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
const SubmitButton = styled.button`
  grid-area: submit;
  display: flex;
  justify-content: center;
  align-items: center;
  
  margin: 1rem;
  padding: .5rem;
  border-radius: 1rem;
  
  background: var(--color-gray);
  color: var(--color-white);
  box-shadow:inset 0 0 10px #AAAAAA;
  
  font-size: 1.5rem;
  font-weight: bold;
  letter-spacing: 0.1rem;
  
  user-select: none;
  cursor: pointer;
`;

type Props = {
    avatar?:string;
    persona?:string;
    items: ItemType[];
    link?: string;
    offerWasCreated: (link:string) => void;
    refetchItems: () => void;
}

type CreateOfferVars = {
    items: Array<string>;
    price: string;
}
type CreateOfferResponse = {
    createOffer?: {
        error?: number;
        success?: boolean;
        link?: string;
    }
}
const CREATE_OFFER__REQUEST = gql`
    query createOffer($items: [String]!, $price: String!){
        createOffer(items: $items, price: $price){
            error
            success
            link
        }
    }
`;

const OfferSubmitter: React.FC<Props> = (props) => {
    const { addToast } = useToasts();
    const {items, avatar, persona, offerWasCreated, refetchItems} = props;
    const [price,setPrice] = useState("");

    const editPrice = (event) => {
        setPrice(event.target.value.replace(",",".").replace(/[^0-9.]/g, ""));

    };

    const generateProfileInfo = (avatar, persona) => {
          if(!avatar || !persona){
              return (
                  <ProfileInfoWrapper>Login to submit offer</ProfileInfoWrapper>
              );
          }
          return (
              <ProfileInfoWrapper>{persona} <ProfileImgWrapper><img src={avatar}/></ProfileImgWrapper></ProfileInfoWrapper>
          )
    };

    const [createOfferQuery, {loading}] = useLazyQuery<CreateOfferResponse, CreateOfferVars>(CREATE_OFFER__REQUEST, {
        fetchPolicy: 'network-only',
        onError: () => {
            addToast("Error while sending items", {
                autoDismiss: true,
                appearance: 'error',
            })
        },
        onCompleted: data => {
            if(data.createOffer?.success) {
                offerWasCreated(data.createOffer.link);
            } else {
                addToast(getErrorMessage(data.createOffer.error, "There was an error while creating offer"), {
                    autoDismiss: true,
                    appearance: 'warning',
                })
            }
        }
    })

    const sendItems = () => {
        if(price !== "" && !Number(price)) {
            return;
        } else if(items.length === 0) {
            setTimeout(() => {
                return addToast("You have to choose item before sending offer", {
                    autoDismiss: true,
                    appearance: 'warning',
                })
            }, 500)
        } else {
            const itemsToSend = items.map(item => {
                return item.assetid.toString();
            })
            setPrice((Math.round(Number(price) * 100)/100).toString());
            createOfferQuery({variables: {items: itemsToSend, price}})
        }
    }

    return (
        <Container>
            <SemiContainer>
                {generateProfileInfo(avatar,persona)}
                <ItemsManager emptyInventoryMessage="Offer preview" items={items} action={()=>{}} gridSelector={"inventory"} createDescriptions={false} itemSize={"80px"}/>
                <PriceEditor price={price ? price : ""} editPrice={editPrice} sendOffer={sendItems}/>
                <LazyLoadingButton small={true} isLoading={loading} displayedText="ODESLAT" action={() => {sendItems()}}/>
            </SemiContainer>
        </Container>
    )
};

export default OfferSubmitter;