import * as React from "react";
import Head from "next/head";
import {IncomingMessage} from "http";
import {GetServerSideProps} from "next";

import {UserType} from '../components/Types';

import MainContainer from "../components/MainContainer";
import Navbar from "../components/Navbar";
import SettingsEditor from "../components/SettingsEditor";

type Props = {
    user?: UserType;
}
const dashboard = (props:Props) => {
    const {user} = props;
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