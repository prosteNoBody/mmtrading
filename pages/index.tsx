import * as React from "react";
import styled from 'styled-components';
import Head from "next/dist/next-server/lib/head";

import {UserType} from '../components/Types';

import MainContainer from "../components/MainContainer";
import Navbar from "../components/Navbar";
import IndexEditor from "../components/IndexEditor";
import { GetServerSideProps } from 'next'
import {IncomingMessage} from "http";

const TosLink = styled.div`
  position: fixed;
  bottom: 10px;
  right: 10px;
  
  text-decoration: underline;
  color: gray;
  
  cursor: pointer;
  
  &:hover {
    color: gainsboro;
  }
`;

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
            <a href={"/tos"} target="_blank">
                <TosLink>Terms of Service</TosLink>
            </a>
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