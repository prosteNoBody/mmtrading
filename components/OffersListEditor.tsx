import React, {useEffect, useRef, useState} from 'react';
import { useToasts } from 'react-toast-notifications';
import styled from 'styled-components';

import {useLazyQuery, useQuery} from "@apollo/react-hooks";
import {gql} from 'apollo-boost';

import TwoButtonSwitch from "./TwoButtonSwitch";
import OffersManager from "./OffersManager";
import LoadingIcon from "./LoadingIcon";
import {OfferType, UserType} from "./Types";

const Container = styled.div`
  grid-area: main-content;
  display: flex;
  flex-direction: column;
  align-items: center;
    
  padding: 2rem;
  
  background: rgb(247,247,247);
  background: radial-gradient(circle, rgba(247,247,247,1) 0%, rgba(230,230,230,1) 100%);
`;

const GET_ALLOFFERS_REQUEST = gql`
query ($method: Boolean!){
  getAllOffers(method: $method){
    error
    offers{
      id
      user_id
      buyer_id
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
    user: UserType;
}
const OffersListEditor:React.FC<Props> = (props) => {
    const {user} = props;
    const [offersTypeSwitch, setOffersTypeSwitch] = useState(true);
    const [offers, setOffers] = useState<OfferType[]>([]);
    const [error, setError] = useState("");
    const { addToast } = useToasts();

    const [getQuery, {loading}] = useLazyQuery(GET_ALLOFFERS_REQUEST,{
        fetchPolicy: 'network-only',
        onCompleted: (data => {
            if(data) {
                if(data.getAllOffers?.error) {
                    let errorMsg = "There was an error during data request"
                    switch (data.getAllOffers.error) {
                        case 1:
                            errorMsg = "You are required to be logged in! Please re/login first"
                            break;
                        case 2:
                            errorMsg = "There was problem in fetching offers"
                            break;
                    }
                    setError(errorMsg);
                    addToast(errorMsg , {
                        appearance: 'warning',
                        autoDismiss: true,
                    })
                } else if(data.getAllOffers.offers) {
                    setError("");
                    setOffers(data.getAllOffers.offers);
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
    },[offersTypeSwitch]);

    const fetchData = () => {
        getQuery({variables: {method: offersTypeSwitch}});
    }

    const changeSwitch = (value:boolean) => {
        setOffersTypeSwitch(value);
    }

    return(
        <Container>
            <TwoButtonSwitch refreshAction={fetchData} changeSwitch={changeSwitch} isOn={offersTypeSwitch} firstSwitchText="My Offers" secondSwitchText="Bought Offers"/>
            <OffersManager offers={offers} isLoading={loading} error={error} offersPerPage={10} user={user}/>
        </Container>
    );
};

export default OffersListEditor;