import React from 'react';
import styled from 'styled-components'
import { useToasts } from 'react-toast-notifications';

const Container = styled.div`
  grid-area: link;
  display: flex;
  justify-content: center;
  align-items: center;
  
  margin: 1rem 0;
  
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

const CopyIconWrapper = styled.div`
  background: var(--color-immortal);
  color: var(--color-white);
  &:hover{
    color: var(--color-immortal);
    background: var(--color-white);
  }

  margin-left: .5rem;
  margin-right: 1rem;

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
    const offerUrl = window.location.host + "/offer/" + props.offerId;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(offerUrl)
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
            <LinkWrapper>{offerUrl}</LinkWrapper>
            <CopyIconWrapper onClick={copyToClipboard}><i className="far fa-copy"/></CopyIconWrapper>
        </Container>
    )
};

export default CopyLink;