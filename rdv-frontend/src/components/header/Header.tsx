'use client'

import ThemeSwitch from "@/components/theme/ThemeSwitch";
import { Button, ButtonGroup, Card, CardBody, Divider, Input } from "@nextui-org/react";
import useWindowWidth from "../useWindowWidth";
import { useEffect, useState } from "react";
import { Loader } from "../loader/Loader";

export default function Header() {
    const [ isWindowLoaded, setIsWindowLoaded ] = useState(false);
    const [ isMounted, setIsMounted ] = useState(false);
    const [ token, setToken ] = useState<string | null>(null);
    const windowWidth = useWindowWidth();

    useEffect(() => {
        setIsWindowLoaded(true);
    }, [windowWidth]);

    useEffect(() => {
        const getTokenFromLocalStorage = async () => {
            try {
                const token = await localStorage.getItem('token');
                if (token) {
                    setToken(token);
                    setIsMounted(true);
                }
            } catch (error) {
                console.error('Error while getting localStorage`s token:', error);
                setIsMounted(true);
            }
        };

        getTokenFromLocalStorage();
    }, []);

    const handleLogout = async () => {
        try {
            localStorage.removeItem('token');
            setToken(null);
            window.location.href = "/";
        } catch (error) {
            console.error('Error while removing token from localStorage:', error);
        }
    }

    return (
        <>
            {!isWindowLoaded && !isMounted ? (
                <Loader />
            ) : (
                <header className="fixed top-[20px] left-1/2 -translate-x-1/2 h-[57px] z-50" style={{width: `${windowWidth && windowWidth < 1240 ? windowWidth - 40 + 'px' : '1200px'}`}}>
                    <Card>
                        <CardBody className="flex flex-row justify-between items-center px-6">
                            <div className="flex items-center gap-5">
                                <a href="/">
                                    <h1 className="text-xl font-bold">Rendez-Vous.</h1>
                                </a>
                                <Divider orientation="vertical" style={{height: '40px'}} />
                                {token ? (
                                    <ButtonGroup>
                                        <Button onClick={(e: any) => window.location.href = "/dashboard"}>Dashboard</Button>
                                        <Divider orientation="vertical" style={{height: '40px'}} />
                                        <Button onClick={(e: any) => window.location.href = "/prendre_rdv"}>Prendre un Rendez-Vous</Button>
                                        <Divider orientation="vertical" style={{height: '40px'}} />
                                        <Button onClick={(e: any) => window.location.href = "/mes_conversations"}>Conversations</Button>
                                        <Divider orientation="vertical" style={{height: '40px'}} />
                                        <Button onClick={(e: any) => window.location.href = "/user_profile"}>Profil</Button>
                                    </ButtonGroup>
                                ) : (
                                    <></>
                                )}
                            </div>
                            <div>
                                
                            </div>
                            <div className="flex items-center gap-5">
                                {token ? (
                                    <ButtonGroup>
                                        <Button onClick={ handleLogout }>Se déconnecter</Button>
                                    </ButtonGroup>
                                ) : (
                                    <ButtonGroup>
                                        <Button onClick={(e: any) => window.location.href = "/login"}>Se connecter</Button>
                                        <Divider orientation="vertical" style={{height: '40px'}} />
                                        <Button onClick={(e: any) => window.location.href = "/register"}>Créer un compte</Button>
                                    </ButtonGroup>
                                )}
                                
                                <Divider orientation="vertical" style={{height: '40px'}} />
                                <ThemeSwitch />
                            </div>
                        </CardBody>
                    </Card>
                </header>
            )}
        </>
    )
}