import React, {useEffect, useState} from 'react';
import styled from 'styled-components'
import Item from './Item';
import axios from 'axios';

const Wrapper = styled.div`
    background:black;
    color:white;
    border-radius:20px;
    display:flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    padding: 2em;
    max-width:75%;
    margin: 0 auto;
    height:270px;
    overflow-y: scroll;
    
    ::-webkit-scrollbar {
        width: 10px;
    }
    ::-webkit-scrollbar-track {
        background: #f1f1f1; 
    }
    ::-webkit-scrollbar-thumb {
        background: #888; 
    }
    ::-webkit-scrollbar-thumb:hover {
        background: #555; 
    }
`;

const SendBtn = styled.button`
    display:inline-block;
    color:white;
    background:blue;
    cursor:pointer;
    border-radius:20px;
    padding: 1em;
    width:15%;
    outline:none;
    `;

type Item = {
    index:number;
    assetid: number;
    name: string;
    icon_url: string;
    rarity: string;
    color: string;
}

type Data = {
    inventory?:Item[];
    error?:string;
}

const InventoryManager: React.FC = () => {
    const [loading,setLoading] = useState(true);
    const [error,setError] = useState("");
    const [refresh,setRefresh] = useState(true);

    const [inventory,setInventory] = useState<Item[]>([]);
    const [inventoryItems,setInvetoryItems] = useState<Item[]>([]);
    const [pickedItems,setPickedItems] = useState<Item[]>([]);

    useEffect(() => {
        setLoading(true);
        let unmounted = false;
        axios.get<Data>('http://localhost:3000/api/inventory')
            .then( ({data}) => {
                const {error,inventory} = data;
                if(!unmounted){
                    if(error){
                        setError(error);
                    }else{
                        setInventory(sortItems(inventory));
                        setInvetoryItems(sortItems(inventory));
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
        return array.sort((itema,itemb)=>(itema.index < itemb.index) ? 1 : -1);
    };
    const refreshItems = () => {
        setLoading(true);
        setPickedItems([]);
        setInvetoryItems([]);
        setInventory([]);

        setError("");
        setRefresh(!refresh);
    };
    const emptyInventory = () => {
        setInvetoryItems([]);
        setPickedItems([...inventory]);
    };
    const emptyPicked = () => {
        setPickedItems([]);
        setInvetoryItems([...inventory]);
    };
    const moveToPicked = (id:number) => {
        setPickedItems([...inventory.filter(item => item.assetid === id),...pickedItems]);
        setInvetoryItems(inventoryItems.filter(item => item.assetid !== id));
    };
    const moveToInventory = (id:number) => {
        setInvetoryItems(sortItems([...inventory.filter(item => item.assetid === id),...inventoryItems]));
        setPickedItems(pickedItems.filter(item => item.assetid !== id));
    };

    const createItem = (item:Item,action) => {
        return <Item key={item.assetid} assetid={item.assetid} image={item.icon_url} name={item.name} rarity={item.rarity} color={item.color} action={action}/>
    };

    return (
        <div style={{textAlign:"center"}}>
            <Wrapper>{!pickedItems[0] ? "EMPTY" :
                pickedItems.map(item => {
                    return createItem(item,moveToInventory);
            })}</Wrapper>
            <SendBtn onClick={()=>{emptyInventory()}}>ALL-IN</SendBtn>
            <SendBtn onClick={()=>{emptyPicked()}}>CLEAR</SendBtn>
            <SendBtn>Odeslat</SendBtn>
            <SendBtn onClick={()=>{refreshItems()}}>REFRESH</SendBtn>
            <Wrapper>{error ? error :
                (loading ? "Loading..." :
                    (!inventoryItems[0] ? "EMPTY" :
                        inventoryItems.map(item => {
                            return createItem(item, moveToPicked);
            })))}</Wrapper>
        </div>
    );
};

export default InventoryManager;