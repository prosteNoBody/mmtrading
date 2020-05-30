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
  grid-template-rows: 5.5rem calc(100vh - 5.5rem);
  grid-template-areas:
  "navbar"
  "offer-manager";
`;

type Props = {
    user?: User;
}
const dashboard = (props:Props) => {
    const {user} = props;
    const avatar = user ? user.avatar : "";
    const persona = user ? user.name : "";
    return (
        <Container>
            <Head>
                <title>MMTrading | Dashboard</title>
            </Head>
            <Navbar user={user}/>
            <OfferEditor avatar={avatar} persona={persona}/>
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
                    name: req.user.name,
                    avatar: req.user.avatar,
                    credit: req.user.credit,
                }
            }
        };
    }
    return {
        props: {}
    };
};
export default dashboard;