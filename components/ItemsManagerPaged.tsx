import React, {useEffect, useState} from 'react';
import styled from 'styled-components';

import {ItemType} from "./Types";

import ItemsManager from './ItemsManager';
import LoadingIcon from "./LoadingIcon";
import {generateBtns} from "./helpFunctions";

type ContainerProps = {
    gridSelector:string;
}
const Container = styled.div`
  grid-area: ${(props: ContainerProps) => props.gridSelector};
  
  display: flex;
  flex-direction: column;
  align-items: stretch;
`;
const StyledItemManager = styled(ItemsManager)`
`;
const PageBtnContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  
  z-index: 2;
`;

type Props = {
    isLoading?: boolean;
    error?: string;
    items:ItemType[];
    action:(id:number) => void;
    gridSelector: string;
    createDescriptions: boolean;
    itemsPerPage: number;
}
const ItemsManagerPaged: React.FC<Props> = (props) => {
    const {items,action,gridSelector, createDescriptions, itemsPerPage} = props;
    const isLoading = props.isLoading || false;
    const error = props.error || null;

    const [pageNumber, setPageNumber] = useState(1);
    let activeItems:ItemType[] = items.slice((pageNumber - 1) * itemsPerPage, pageNumber * itemsPerPage);
    let maxPage = Math.ceil(items.length/itemsPerPage);

    if(maxPage < pageNumber){
        if(maxPage > 0 && maxPage !== pageNumber) setPageNumber(maxPage);
        else if(1 !== pageNumber) setPageNumber(1);
    }

    return (
        <Container gridSelector={gridSelector}>
            <StyledItemManager isLoading={isLoading} error={error} items={activeItems} action={action} gridSelector={'null'} createDescriptions={createDescriptions}/>
            <PageBtnContainer>{generateBtns(maxPage, pageNumber, setPageNumber)}</PageBtnContainer>
        </Container>
    );
};

export default ItemsManagerPaged;