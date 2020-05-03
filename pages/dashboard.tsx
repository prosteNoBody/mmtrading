import * as React from "react";
import Head from 'next/head';
import styled from 'styled-components'

import { GetServerSideProps } from 'next'
import {IncomingMessage} from "http";

import Navbar from '../components/Navbar';
import OfferEditor from "../components/OfferEditor";

const Container = styled.div`
  display:grid;
  width: 100vw;
  height: 100vh;
  max-height: 100vh;
  
  grid-template-columns: 100vw;
  grid-template-rows: 5rem calc(100vh - 5rem);
  grid-template-areas:
  "navbar"
  "offer-manager";
`;

const dashboard = (props) => {
    const {user} = props;
    return (
        <Container>
            <Head>
                <title>MMTrading | Dashboard</title>
            </Head>
            <Navbar user={user}/>
            <OfferEditor/>
        </Container>
    );
};

interface ReqUser extends IncomingMessage{
    user?:User;
}
type User = {
    name:string;
    avatar:string;
    credit:number;
}

export const getServerSideProps: GetServerSideProps = async ({req}:{req:ReqUser}) =>{
    if(req.user){
        return {
            props:{
                user:{
                    persona: req.user.name,
                    avatar: req.user.avatar,
                    credit: req.user.credit,
                }
            }
        };
    }
};
export default dashboard;