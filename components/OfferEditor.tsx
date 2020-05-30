import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import axios from 'axios';

import ItemsManager from './ItemsManager';
import ControlsManager from './ControlsManager';
import OfferSubmitter from './OfferSubmitter';

const Container = styled.div`
  grid-area: offer-manager;
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
type Description = {
    type: string;
    value: string;
    color?: string;
}

type Item = {
    index:number;
    assetid: number;
    name: string;
    icon_url: string;
    rarity: string;
    color: string;
    descriptions: Description[];
}

type RespondData = {
    data: {
        error?:string;
        inventory?: {
            error?: string,
            items: Item[]
        };
    };
}

type Props = {
    persona: string;
    avatar: string;
}
const OfferEditor: React.FC<Props> = (props) => {
    const {persona,avatar} = props;
    const [loading,setLoading] = useState(true);
    const [error,setError] = useState("");
    const [refresh,setRefresh] = useState(true);

    const [inventory,setInventory] = useState<Item[]>([]);
    const [inventoryItems,setInventoryItems] = useState<Item[]>([]);
    const [offerItems,setOfferItems] = useState<Item[]>([]);

    // useEffect(() => {
    //     const script = document.createElement('script');
    //     script.src = "/test.js";
    //     document.body.appendChild(script);
    // },[]);

    useEffect(() => {
        setLoading(true);
        let unmounted = false;
        axios.post<RespondData>('http://localhost:3000/api',{
            query:`
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
                                color
                            }
                        }
                    }
                }
            `
        })
            .then( (respond) => {
                const {data} = respond.data;
                if(!unmounted){
                    if(data.error){
                        setError(data.error);
                    }else{
                        if(data.inventory.error){
                            setError(data.inventory.error);
                        }
                        else{
                            setInventory(sortItems(data.inventory.items));
                            setInventoryItems(sortItems(data.inventory.items));
                        }
                    }
                }
            })
            .catch(e=>{
                console.log(e);
                if(!unmounted){
                    setError("We are unable to contact server.");
                }
            })
            .finally(()=>{
                if(!unmounted){
                    setLoading(false);
                }
            });
        return () => {unmounted = true};
    },[refresh]);


    const sortItems = (array:Item[]) => {
        return array.sort((itemA,itemB)=>(itemA.index < itemB.index) ? 1 : -1);
    };
    const refreshItems = () => {
        setLoading(true);
        setOfferItems([]);
        setInventoryItems([]);
        setInventory([]);

        setError("");
        setRefresh(!refresh);
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

    return (
        <Container>
            <ItemsManager isLoading={loading} error={error} items={inventoryItems} action={moveToOffer} gridSelector={'inventory'} createDescriptions={true}/>
            <ItemsManager items={offerItems} action={moveToInventory} gridSelector={'offer'} createDescriptions={true}/>
            <ControlsManager refreshAction={refreshItems} emptyAction={emptyOffer} fullAction={emptyInventory}/>
            <OfferSubmitter items={offerItems} persona={persona} avatar={avatar}/>
        </Container>
    );
};

export default OfferEditor;