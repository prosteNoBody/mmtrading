import Link from "next/link";
import * as React from "react";
import Head from "next/head";
import {IncomingMessage} from "http";
import {GetServerSideProps} from "next";


import MainContainer from "../components/MainContainer";
import Navbar from "../components/Navbar";
import SettingsEditor from "../components/SettingsEditor";
import OfferEditor from "../components/OfferEditor";

type Props = {
    user?: User;
}
const dashboard = (props:Props) => {
    const {user} = props;
    const avatar = user ? user.avatar : "";
    const persona = user ? user.name : "";
    return (
        <MainContainer>
            <Head>
                <title>MMTrading | Settings</title>
            </Head>
            <Navbar user={user}/>
            <SettingsEditor/>
        </MainContainer>
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