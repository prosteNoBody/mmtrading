import React from 'react';
import { useToasts } from 'react-toast-notifications';
import styled from 'styled-components';
import { useRouter } from 'next/router';

import LazyLoadingButton from "./LazyLoadingButton";
import {useLazyQuery} from "@apollo/react-hooks";
import {gql} from 'apollo-boost';
import {getErrorMessage} from "./helpFunctions";

const Container = styled.div`
  padding: 2rem;
  
  display: flex;
  flex-direction: column;
  
  filter: drop-shadow(0 0 0.75rem var(--color-black));
  
  transition: opacity 300ms;
  background: var(--color-arcana);
`;

const Title = styled.div`
  margin-bottom: 1rem;
  
  color: var(--color-white);
  font-size: 2rem;
`;

const BtnsWrapper = styled.div`
  display: flex;
  justify-content: space-around;
`;

const LazyButtonWrapper = styled.div`
  width: 33%;
`;

type CreditResponse = {
    getCredit?: {
        error?: string,
        success?: boolean,
        credit?: number,
    }
}

const CREDIT_REQUEST = gql`
query ($option: Int!){
    getCredit(option:$option){
        error
        success
        credit
    }
}`;
const CreditEditor: React.FC = () => {
    const { addToast } = useToasts();
    const router = useRouter();

    const [getQuery, {loading}] = useLazyQuery<CreditResponse>(CREDIT_REQUEST,{
        fetchPolicy: 'network-only',
        onCompleted: data => {
            if(data) {
                if(data.getCredit?.error) {
                    addToast(getErrorMessage(data.getCredit.error, "There was an error during data request") , {
                        appearance: 'warning',
                        autoDismiss: true,
                    })
                } else if(data.getCredit?.success) {
                    addToast(`Credit was successfully added, your balance is: ${data.getCredit.credit}€`, {
                        appearance: 'success',
                        autoDismiss: true,
                    })
                    router.replace(window.location.pathname).then();
                }
            }
        },
        onError: () => {
            addToast("There was an error during data request" , {
                appearance: 'error',
                autoDismiss: true,
            })
        }
    });

    const refetchData = (option:number) => {
        getQuery({variables: {option}})
    }

    return(
        <Container>
            <Title>Get Credit</Title>
            <BtnsWrapper>
                <LazyButtonWrapper>
                    <LazyLoadingButton small isLoading={loading} displayedText={"Get 5€"} action={() => refetchData(1)}/>
                </LazyButtonWrapper>
                <LazyButtonWrapper>
                    <LazyLoadingButton small isLoading={loading} displayedText={"Get 25€"} action={() => refetchData(2)}/>
                </LazyButtonWrapper>
                <LazyButtonWrapper>
                    <LazyLoadingButton small isLoading={loading} displayedText={"Get 50€"} action={() => refetchData(3)}/>
                </LazyButtonWrapper>
            </BtnsWrapper>
        </Container>
    );
};

export default CreditEditor;