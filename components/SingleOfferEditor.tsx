import React, {useEffect, useState} from 'react';
import { useToasts } from 'react-toast-notifications';
import styled from 'styled-components';

import {useLazyQuery} from "@apollo/react-hooks";
import {gql} from 'apollo-boost';

import OffersManager from "./OffersManager";
import {OfferType, UserType} from "./Types";
import {getErrorMessage} from "./helpFunctions";
import LazyLoadingButton from "./LazyLoadingButton";

const Container = styled.div`
  grid-area: main-content;
  display: flex;
  flex-direction: column;
  align-items: center;
  
  background: rgb(247,247,247);
  background: radial-gradient(circle, rgba(247,247,247,1) 0%, rgba(230,230,230,1) 100%);
`;

const LazyButtonWrapper = styled.div`
  width: 50%;
  
  margin: 1rem;
`;

const GET_OFFER_REQUEST = gql`
query ($offerId: String!){
  getOffer(offerId: $offerId){
    error
    offer{
      id
      user_id
      buyer_id
      is_mine
      trade_id
      price
      items{
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
      date
      status
    }
  }
}`;
type Props = {
    offerId: string | string[];
    user: UserType;
}
const OffersListEditor:React.FC<Props> = (props) => {
    const {user, offerId} = props;
    const [offers, setOffers] = useState<OfferType[]>([]);
    const [error, setError] = useState("");
    const { addToast } = useToasts();

    const [getQuery, {loading}] = useLazyQuery(GET_OFFER_REQUEST,{
        fetchPolicy: 'network-only',
        onCompleted: (data => {
            if(data) {
                if(data.getOffer?.error) {
                    let errorMsg = getErrorMessage(data.getOffer.error, "There was an error during data request");
                    setError(errorMsg);
                    addToast(errorMsg , {
                        appearance: 'warning',
                        autoDismiss: true,
                    })
                } else if(data.getOffer.offer) {
                    setError("");
                    setOffers([data.getOffer.offer]);
                }
            }
        }),
        onError: () => {
            addToast("There was an error during data request" , {
                appearance: 'error',
                autoDismiss: true,
            })
        }
    });

    useEffect(() => {
        fetchData();
    },[]);

    const fetchData = () => {
        getQuery({variables: {offerId: offerId}});
    }

    return(
        <Container>
            <LazyButtonWrapper>
                <LazyLoadingButton isLoading={loading} displayedText={"REFRESH"} action={fetchData} small={true}/>
            </LazyButtonWrapper>
            <OffersManager offers={offers} isLoading={loading} error={error} singleOffer={true} offersPerPage={1} user={user}/>
        </Container>
    );
};

export default OffersListEditor;