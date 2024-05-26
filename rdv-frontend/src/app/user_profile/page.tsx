'use client'

import { NotConnected } from "@/components/notConnected/NotConnected";
import AccountSettings from "@/components/pageSections/user_profile/AccountSettings";
import Billing from "@/components/pageSections/user_profile/Billing";
import PersonalInfo from "@/components/pageSections/user_profile/PersonalInfo";
import Profile from "@/components/pageSections/user_profile/Profile";
import { Tab, Tabs } from "@nextui-org/tabs";
import { useEffect, useState } from "react";
// import { User } from "../../../public/User";

export default function UserProfile() {
    const [ token, setToken ] = useState<string | null>(null);
    
    useEffect(() => {
        const getTokenFromLocalStorage = () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    setToken(token);
                }
            } catch (error) {
                console.error('Error while getting localStorage`s token:', error);
            }
        };

        getTokenFromLocalStorage();
    }, []);

    return (
        <>
                {token ? 
                (
                    <div className="relative top-[120px] left-1/2 -translate-x-1/2 flex w-[1000px]">
                        <Tabs isVertical={true} variant="bordered">
                            <Tab className="relative h-fit"
                                title={
                                <div className="flex items-center space-x-2 py-2">
                                    <UserSVG color='black'/>
                                    <span>Profil</span>
                                </div>
                            }>
                                <div>
                                    <Profile />
                                </div>
                            </Tab>
                            <Tab className="h-fit"
                                title={
                                <div className="flex items-center space-x-2 py-2">
                                    <PersonalInfoSVG color='black' />
                                    <span>Informations personnelles</span>
                                </div>
                            }>
                                <div>
                                    <PersonalInfo />
                                </div>
                            </Tab>
                            <Tab className="h-fit"
                                title={
                                <div className="flex items-center space-x-2 py-2">
                                    <CreditCardSVG color='black'/>
                                    <span>Facturation</span>
                                </div>
                            }>
                                <div>
                                    <Billing />
                                </div>
                            </Tab>
                            <Tab className="h-fit" 
                                title={
                                <div className="flex items-center space-x-2 py-2">
                                    <GearSVG color='black'/>
                                    <span>Paramètres du compte</span>
                                </div>
                            }>
                                <div>
                                    <AccountSettings />
                                </div>
                            </Tab>
                        </Tabs>
                    </div>
                ) : (
                    <NotConnected />
                )
            }   
        </>
    );
}


function UserSVG(props: any) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
            className="h-5 w-5">
            <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" fill={props.color} />
        </svg>
    )
}

function PersonalInfoSVG(props: any) {
    return (
        <svg 
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            className="h-5 w-5">
            <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" fill={props.color} />
        </svg>
    )
}

function CreditCardSVG(props: any) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 576 512"
            className="h-5 w-5">
            <path d="M64 32C28.7 32 0 60.7 0 96v32H576V96c0-35.3-28.7-64-64-64H64zM576 224H0V416c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V224zM112 352h64c8.8 0 16 7.2 16 16s-7.2 16-16 16H112c-8.8 0-16-7.2-16-16s7.2-16 16-16zm112 16c0-8.8 7.2-16 16-16H368c8.8 0 16 7.2 16 16s-7.2 16-16 16H240c-8.8 0-16-7.2-16-16z" fill={props.color} />
        </svg>
    );
}

function GearSVG(props: any) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            className="h-5 w-5">
            <path d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z" fill={props.color} />
        </svg>
    )
}