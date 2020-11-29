import React, {ReactNode} from "react";
import Link from "next/link";
import styled from "styled-components";
import {useRouter} from "next/router";

type SectionContentProps = {
    color: string;
    bold: boolean;
}
const SectionContent = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 12rem;
  height: 100%;
  padding: 1rem;
  
  color: var(--color-black);
  border-right: 10px solid var(${(props:SectionContentProps) => props.color});
  border-bottom: 0 solid var(${(props:SectionContentProps) => props.color});
  border-top: 0 solid var(${(props:SectionContentProps) => props.color});
  
  letter-spacing: 0.05rem;
  text-align: center;
  font-size: 1.5rem;
  font-weight: ${(props:SectionContentProps) => props.bold ? 'bold' : 'normal'};
  
  transition: 300ms;
  cursor: pointer;
  user-select: none;
  
  &:hover{
    border-right-width: 20px;
    border-bottom-width: 3px;
    border-top-width: 3px;
  }
`;
type Props = {
    href?: string;
    color?: string;
    children: ReactNode;
}
const Section: React.FC<Props> = (props) => {
    const {href, color, children} = props;
    const router = useRouter();

    if(href){
        return (
            <>
                <Link href={href}><SectionContent color={color} bold={(router.pathname == href)}>{children}</SectionContent></Link>
            </>
        )
    }
    return (
        <>
            <SectionContent color={color} bold={(router.pathname == href)}>{children}</SectionContent>
        </>
    )
};

export default Section;