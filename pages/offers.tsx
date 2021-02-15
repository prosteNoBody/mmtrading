import * as React from "react";
import Head from "next/head";
import {IncomingMessage} from "http";
import {GetServerSideProps} from "next";

import {UserType} from '../components/Types';

import MainContainer from "../components/MainContainer";
import Navbar from "../components/Navbar";
import OffersListEditor from "../components/OffersListEditor";

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
                <title>MMTrading | Offers</title>
            </Head>
            <Navbar user={user}/>
            <OffersListEditor/>
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