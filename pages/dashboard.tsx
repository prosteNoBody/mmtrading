import * as React from "react";
import Head from 'next/head';
import styled from 'styled-components'

import {UserType} from '../components/Types';

import { GetServerSideProps } from 'next'
import {IncomingMessage} from "http";

import MainContainer from "../components/MainContainer";
import Navbar from '../components/Navbar';
import OfferEditor from "../components/OfferEditor";

type Props = {
    user?: UserType;
}
const dashboard = (props:Props) => {
    const {user} = props;
    const avatar = user ? user.avatar : "";
    const persona = user ? user.name : "";
    return (
        <MainContainer>
            <Head>
                <title>MMTrading | Dashboard</title>
            </Head>
            <Navbar user={user}/>
            <OfferEditor avatar={avatar} persona={persona}/>
        </MainContainer>
    );
};

interface ReqUser extends IncomingMessage{
    user?:UserType;
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