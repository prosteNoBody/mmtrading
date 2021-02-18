import React from 'react';
import styled from 'styled-components'
import { useToasts } from 'react-toast-notifications';

import Link from 'next/link';

const Container = styled.div`
  grid-area: link;
  display: flex;
  justify-content: center;
  align-items: center;
  
  margin: 1rem 0;
  
  padding-right: .5rem;
  
  z-index: 99;
`;

const LinkWrapper = styled.div`
  background: var(--color-immortal);
  color: var(--color-white);
  
  display: flex;
  justify-content: center;
  align-items: center;
  
  padding: 0.3rem;
  
  flex: 1;
  
  user-select: all;
  cursor: pointer;
`;

const IconWrapper = styled.div`
  background: var(--color-immortal);
  color: var(--color-white);
  &:hover{
    color: var(--color-immortal);
    background: var(--color-white);
  }

  margin-left: .5rem;
  margin-right: 0;

  border-radius: 50%;
  padding: 0.4rem;
  display: flex;
  justify-content: center;
  align-items: center;
    
  transition: 100ms;
  user-select: all;
  cursor: pointer;
`;

type Props = {
    offerId?: string;
}

const CopyLink: React.FC<Props> = (props) => {
    const {addToast} = useToasts();
    const offerUrl = "/offer/" + props.offerId;
    const fullUrl = window.location.origin + offerUrl;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(fullUrl)
            .then(() => {
                addToast("Link was successfully copied to your clipboard", {
                    autoDismiss: true,
                    appearance: 'success',
                });
            }).catch(() => {
                addToast("Link wasn't able to be copied to your clipboard", {
                    autoDismiss: true,
                    appearance: 'error',
                })
            })
    }

    return (
        <Container>
            <LinkWrapper>{fullUrl}</LinkWrapper>
            <IconWrapper onClick={copyToClipboard}><i className="far fa-copy"/></IconWrapper>
            <Link href={offerUrl}><IconWrapper><i className="fas fa-share"/></IconWrapper></Link>
        </Container>
    )
};

export default CopyLink;