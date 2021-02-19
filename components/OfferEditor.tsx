import React, {useEffect, useState} from 'react';
import { useToasts } from 'react-toast-notifications';
import styled from 'styled-components';
import { useRouter } from 'next/router';

import {ItemType} from './Types';

import {useLazyQuery, useQuery} from "@apollo/react-hooks";
import {gql} from 'apollo-boost';

import ItemsManagerPaged from "./ItemsManagerPaged";
import ItemsManager from './ItemsManager';
import ControlsManager from './ControlsManager';
import OfferSubmitter from './OfferSubmitter';
import {getErrorMessage} from "./helpFunctions";

const Container = styled.div`
  grid-area: main-content;
  display: grid;
  grid-template-columns: 1fr 8rem 1fr;
  grid-template-rows: 3fr 20rem;
  grid-template-areas:
  "inventory controls offer"
  "inventory preview preview";
  
  padding: 2rem;
  
  background: rgb(247,247,247);
  background: radial-gradient(circle, rgba(247,247,247,1) 0%, rgba(230,230,230,1) 100%);
`;
type RespondData = {
    inventory?: {
        error?: string,
        items: ItemType[]
    };
}

type Props = {
    persona: string;
    avatar: string;
}
type TradeLink = {
    getTradeUrl?: {
        error?: string,
        tradeurl?: string,
        changed?: boolean,
    }
}

const TRADE_LINK_REQUEST = gql`
    {
        getTradeUrl{
            error
            tradeurl
        }
    }
`
const ITEM_REQUEST = gql`
    {
        inventory{
            error
            items{
                index
                assetid
                name
                icon_url
                rarity
                color
                descriptions{
                    type
                    value
                }
            }
        }
    }
`;
const OfferEditor: React.FC<Props> = (props) => {
    const { addToast } = useToasts();
    const router = useRouter();
    const {persona,avatar} = props;
    const [errorMessage,setErrorMessage] = useState("");

    const [inventory,setInventory] = useState<ItemType[]>([]);
    const [inventoryItems,setInventoryItems] = useState<ItemType[]>([]);
    const [offerItems,setOfferItems] = useState<ItemType[]>([]);

    const [getItemsQuery, {loading}] = useLazyQuery<RespondData>(ITEM_REQUEST, {
        fetchPolicy: "network-only",
        onCompleted: data => {
            if(data.inventory.error)
                setErrorMessage(data.inventory.error);
            if(data.inventory.items){
                setErrorMessage(null);
                setInventory(data.inventory.items);
                setInventoryItems(sortItems(data.inventory.items));
                setOfferItems([]);
            }
        },
        onError: () => {
            setErrorMessage("We were unable to get inventory data from server.");
        }
    })

    useQuery<TradeLink>(TRADE_LINK_REQUEST,{
        fetchPolicy: 'network-only',
        onCompleted: data => {
            if(data.getTradeUrl?.error) {
                addToast(getErrorMessage(data.getTradeUrl.error, "There was an error during data request") , {
                    appearance: 'warning',
                    autoDismiss: true,
                })
            } else if(typeof data.getTradeUrl?.tradeurl === 'string' && data.getTradeUrl.tradeurl === "") {
                addToast("You need to set trade url in settings before trading items", {
                    autoDismiss: true,
                    appearance: 'error',
                })
            }
        },
        onError: () => {
            addToast("Error occur when fetching data from server", {
                autoDismiss: true,
                appearance: 'error',
            })
        }
    });


    useEffect(() => {
        getItemsQuery();
    },[]);

    const sortItems = (array:ItemType[]) => {
        return array.sort((itemA,itemB)=>(itemA.index < itemB.index) ? 1 : -1);
    };
    const refreshItems = () => {
        setOfferItems([]);
        setInventoryItems([]);
        getItemsQuery()
    };
    const emptyInventory = () => {
        setInventoryItems([]);
        setOfferItems([...inventory]);
    };
    const emptyOffer = () => {
        setOfferItems([]);
        setInventoryItems([...inventory]);
    };

    const moveToOffer = (id:number) => {
        setOfferItems([...inventory.filter(item => item.assetid === id),...offerItems]);
        setInventoryItems(inventoryItems.filter(item => item.assetid !== id));
    };
    const moveToInventory = (id:number) => {
        setInventoryItems(sortItems([...inventory.filter(item => item.assetid === id),...inventoryItems]));
        setOfferItems(offerItems.filter(item => item.assetid !== id));
    };
    const redirectAfterCreatingOffer = (link) => {
        addToast("Offer was succesfully created, bot will send you offer soon", {
            autoDismiss: true,
            appearance: 'success',
        });
        setOfferItems([]);
        setInventoryItems([]);
        router.push('/offer/' + link).then();
    }

    return (
        <Container>
            <ItemsManagerPaged isLoading={loading} error={errorMessage} items={inventoryItems} action={moveToOffer} gridSelector={'inventory'} createDescriptions={true} itemsPerPage={100}/>
            <ItemsManager items={offerItems} action={moveToInventory} gridSelector={'offer'} createDescriptions={true} itemSize={'100px'}/>
            <ControlsManager refreshAction={refreshItems} emptyAction={emptyOffer} fullAction={emptyInventory}/>
            <OfferSubmitter items={offerItems} persona={persona} avatar={avatar} offerWasCreated={redirectAfterCreatingOffer} refetchItems={refreshItems}/>
        </Container>
    );
};

export default OfferEditor;