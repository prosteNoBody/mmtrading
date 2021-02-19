import * as React from "react";
import Head from "next/head";
import {useRouter} from "next/router";
import {IncomingMessage} from "http";
import {GetServerSideProps} from "next";

import {UserType} from '../../components/Types';

import MainContainer from "../../components/MainContainer";
import Navbar from "../../components/Navbar";
import SingleOfferEditor from "../../components/SingleOfferEditor";

type Props = {
    user?: UserType;
}
const offers = (props:Props) => {
    const {user} = props;
    const router = useRouter();
    const {id} = router.query;
    return (
        <MainContainer>
            <Head>
                <title>MMTrading | Offer</title>
            </Head>
            <Navbar user={user}/>
            <SingleOfferEditor offerId={id} user={user}/>
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
export default offers;