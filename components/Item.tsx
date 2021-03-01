import React, {useEffect, useState} from 'react';
import styled from 'styled-components'
import {ItemType} from "./Types";

const Container = styled.div`
  position: relative;
  
  float: left;
`;
type ContainerProps = {
    rarityColor:string;
    size?: string;
}
type MouseIconProps = {
    img: string;
}
const MouseIcon = styled.div`
  display: none;
  position: absolute;
  top: 0;
  right: 0;
  
  margin: 5px;
  border-radius: 50%;
  
  border: 1px solid var(--color-white)AA;
  background-color: var(--color-white);
  -webkit-mask: url(${(props:MouseIconProps) => (props.img)}) no-repeat center;
  mask: url(${(props:MouseIconProps) => (props.img)}) no-repeat center;
  
  height: 35px;
  width: 25px;
`;
const RarityImg = styled.div`
  display: none;
  position: absolute;
  bottom: 0;
  
  padding: 0.2rem;
  width: 100%;
  
  background: rgba(0,0,0,0.7);
  color: #${(props: ContainerProps) => props.rarityColor};
  
  text-align: center;
  
  user-select: none;
`;
const Rarity = styled.div`
  color: #${(props: ContainerProps) => props.rarityColor};
  font-size: 0.9rem;
`;
const Img = styled.img`
  vertical-align: bottom;
`;
const WrapHiddenOverflow = styled.div`
  position: relative;
  
  margin: 0.3rem;
  border-radius: 0.5rem;  
  width: ${(props:ContainerProps) => props.size || '120px'};
  height: ${(props:ContainerProps) => props.size ? (Number(props.size.substr(0,3))/3*2) + "px" : '79px'};
  
  border: 2px solid #${(props:ContainerProps) => props.rarityColor};
  
  overflow: hidden;
  cursor: pointer;
  
  &:hover ${RarityImg}{
    display: block;
  }
  &:hover ${MouseIcon}{
    display: block;
  }
`;

type DetailsProps = {
    color: string;
    open: boolean;
};
const Details = styled.div`
  position: absolute;
  left: -50%;
  
  width: 200%;
  border-radius: 0.5rem;
  padding: 1rem;
  
  border: 3px solid #${(props:DetailsProps) => (props.color)};
  background: #fff;
  
  text-align: center;
  
  z-index: 2;
  transform-origin: top;
  transition: transform 200ms;
  transform: ${(props:DetailsProps) => props.open ? 'translateY(20px) scale(1)' : 'translateY(20px) scale(0)'};

  &::before{
    content: "";
    position: absolute;
    left: 50%;
    top: -10px;
    
    width: 0;
    height: 0;
    
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-bottom: 10px solid #${(props:DetailsProps) => (props.color)};
    
    transform: translateX(-50%);
  }
  &::after{
    content: "";
    position: absolute;
    left: 50%;
    top: -5px;
    
    width: 0;
    height: 0;
    
    border-left: 7px solid transparent;
    border-right: 7px solid transparent;
    border-bottom: 7px solid #fff;
    
    transform: translateX(-50%);
  }
`;
const Divider = styled.div`
  width: 100%;
  margin: 1rem 0;
  
  border-top:1px solid #1e1e1e;
`;
const NameTitle = styled.div`
  font-weight: bold;
  font-size: 1.1rem;
`;
const Description = styled.div`
  margin: 0.3rem 0;
  
  color: #${(props: ContainerProps) => props.rarityColor};
  
  text-align: left;
  
  font-size: 0.8rem;
`;
type Props = {
    item: ItemType;
    action:(id:number) => void;
    createDescription: boolean;
    itemSize?: string;
}
const Item: React.FC<Props> = (props) => {
    const {item: {assetid, name, color, descriptions, rarity, icon_url},action,createDescription, itemSize} = props;
    const [detailOpen, setDetailOpen] = useState(false);
    let node = null;

    const handleClick = e => {
        if (e.nativeEvent.which === 3) {
            e.preventDefault();
            e.stopPropagation();
            setDetailOpen(!detailOpen);
        }
    }

    const callback = (e) => {
        if(node && !node.contains(e.target)){
            setDetailOpen(false);
        }
    };
    useEffect(() => {
        document.body.addEventListener('mousedown',callback);

        return (() => {
            document.body.removeEventListener('mousedown',callback);
        })
    });


    const createDescriptions = (descriptions) => {
        return descriptions.map((description,index:number) => {
            return <Description key={assetid + index} rarityColor={description.color} dangerouslySetInnerHTML={{
                __html:description.value.replace(/color: rgb\(255, 255, 255\)/gm, 'rgb(0, 0, 0)')
            }}/>
        });
    };
    const createDetails = () => {
        if(!createDescription)
            return;
        return (
            <Details color={color} open={detailOpen}>
                <NameTitle>{name}</NameTitle>
                <Divider/>
                <Rarity rarityColor={color}>{rarity}</Rarity>
                <Divider/>
                <>{createDescriptions(descriptions)}</>
            </Details>
        )
    };

    return (
        <Container ref={element => node = element} onMouseDown={handleClick} onContextMenu={(e) => {e.preventDefault()}}>
            <WrapHiddenOverflow onClick={() => action(assetid)} rarityColor={color} size={itemSize}>
                <Img width={itemSize || "120px"} alt={'item'} src={icon_url}/>
                {/*<ImgPlaceholder display={loadingImg}><LoadingI aria-hidden className="fas fa-hat-wizard"/></ImgPlaceholder>*/}
                <RarityImg rarityColor={color}>{rarity}</RarityImg>
                {createDescription ? <MouseIcon img="/mouseIcon.svg"/> : ''}
            </WrapHiddenOverflow>
            {createDetails()}
        </Container>
    )
};

export default Item;