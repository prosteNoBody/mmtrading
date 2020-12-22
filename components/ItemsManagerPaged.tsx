import React, {useEffect, useState} from 'react';
import styled from 'styled-components';

import ItemsManager from './ItemsManager';
import LoadingIcon from "./LoadingIcon";

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
const PageBtn = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 2.6rem;
  height: 2.6rem;
  margin: 0.7rem 0.7rem 0;

  color: var(--color-white);
  background: var(--color-arcana);
  
  text-align: center;
  font-weight: bold;
  
  cursor: pointer;
  user-select: none;
`;

const PageBtnActive = styled(PageBtn)`
  color: var(--color-arcana);
  background: var(--color-white);
  border: 3px solid var(--color-arcana);
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
type Props = {
    isLoading?: boolean;
    error?: string;
    items:Item[];
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
    let activeItems:Item[] = items.slice((pageNumber - 1) * itemsPerPage, pageNumber * itemsPerPage);
    let maxPage = Math.ceil(items.length/itemsPerPage);

    if(maxPage < pageNumber){
        if(maxPage > 0 && maxPage !== pageNumber) setPageNumber(maxPage);
        else if(1 !== pageNumber) setPageNumber(1);
    }

    const generateBtns = () => {
        if(maxPage === 1) return false;
        let res = [];
        for(let i = 1; i <= maxPage;i++){
            if(i === pageNumber) res.push(<PageBtnActive key={i} onClick={() => setPageNumber(i)}>{i}</PageBtnActive>)
            else res.push(<PageBtn key={i} onClick={() => setPageNumber(i)}>{i}</PageBtn>)
        }
        return res;
    }

    return (
        <Container gridSelector={gridSelector}>
            <StyledItemManager isLoading={isLoading} error={error} items={activeItems} action={action} gridSelector={'null'} createDescriptions={createDescriptions}/>
            <PageBtnContainer>{generateBtns()}</PageBtnContainer>
        </Container>
    );
};

export default ItemsManagerPaged;