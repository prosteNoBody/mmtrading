import * as React from "react";
import Head from "next/dist/next-server/lib/head";

import {UserType} from '../components/Types';

import MainContainer from "../components/MainContainer";
import Navbar from "../components/Navbar";
import IndexEditor from "../components/IndexEditor";
import { GetServerSideProps } from 'next'
import {IncomingMessage} from "http";

type Props = {
    user?: UserType;
}
const indexPage = (props:Props) => {
    const {user} = props;
    return (
        <MainContainer>
            <Head>
                <title>MMTrading</title>
            </Head>
            <Navbar user={user}/>
            <IndexEditor/>
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

export default indexPage;