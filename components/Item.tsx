import React, {useState} from 'react';
import styled from 'styled-components'

const Container = styled.div`
  position: relative;
  
  float: left;
`;
type ContainerProps = {
    rarityColor:string;
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

type ImgPlaceholderProps = {
    display: boolean;
}
const ImgPlaceholder = styled.div`
  display: ${(props:ImgPlaceholderProps) => (props.display ? "flex" : "none")};
  justify-content: center;
  align-items: center;

  width: 120px;
  height: 80px;
  
  background:grey;
  color: whitesmoke;
  
  font-size: 1.5rem;
  
  &::after{
      content: "";
      position: absolute;
      
      width: 100%;
      height: 100%;
      
      background: rgba(255, 255, 255, 0.2);
      
      opacity: 1;
      
      animation: shine 2s infinite ease-out;
  }
  
  @keyframes shine{
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
`;
const WrapHiddenOverflow = styled.div`
  position: relative;
  
  margin: 0.3rem;
  border-radius: 0.5rem;  
  width: 120px;
  height: 80px;
  
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
  transition: transform 200ms;
  transform: translateY(20px) scale(0);
  
  ${WrapHiddenOverflow}:hover ~ &{
    transform: translateY(20px) scale(1);
    transition: transform 200ms 500ms;
  }
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
  
  font-size: 0.8rem;
`;
const LoadingI = styled.i`
  animation: rotate 1.5s infinite ease-in-out;
  
  @keyframes rotate{
    0%{
        transform: rotate(0deg);
    }
    100%{
        transform: rotate(360deg);
    }
  }
`;

type Description = {
    type: string;
    value: string;
    color?: string;
}
type Props = {
    assetid: number;
    imageUrl: string;
    name: string;
    rarity: string;
    color: string;
    descriptions: Description[];
    action:(id:number) => void;
    createDescription: boolean;
}
const Item: React.FC<Props> = (props) => {
    const {assetid,name,rarity,imageUrl,color,descriptions,action,createDescription} = props;

    const createDescriptions = (descriptions) => {
        return descriptions.map((description:Description,index:number) => {
            return <Description key={assetid + index} rarityColor={description.color} dangerouslySetInnerHTML={{__html:description.value}}/>
        });
    };
    const createDetails = () => {
        if(!createDescription)
            return;
        return (
            <Details color={color}>
                <NameTitle>{name}</NameTitle>
                <Divider/>
                <Rarity rarityColor={color}>{rarity}</Rarity>
                <Divider/>
                <div>{createDescriptions(descriptions)}</div>
            </Details>
        )
    };

    return (
        <Container>
            <WrapHiddenOverflow rarityColor={color} onClick={() => action(assetid)}>
                <Img width="120px" height="80px" alt={'item'} src={imageUrl}/>
                {/*<ImgPlaceholder display={loadingImg}><LoadingI aria-hidden className="fas fa-hat-wizard"/></ImgPlaceholder>*/}
                <RarityImg rarityColor={color}>{rarity}</RarityImg>
                <MouseIcon img="/mouseIcon.svg"/>
            </WrapHiddenOverflow>
            {createDetails()}
        </Container>
    )
};

export default Item;