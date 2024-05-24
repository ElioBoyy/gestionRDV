'use client'

import ThemeSwitch from "@/components/ThemeSwitch";
import { Button, ButtonGroup, Card, CardBody, Divider, Input } from "@nextui-org/react";
import useWindowWidth from "../useWindowWidth";
import { useEffect, useState } from "react";
import { Loader } from "../loader/Loader";

export default function Header() {
    const [isWindowLoaded, setIsWindowLoaded] = useState(false);
    const windowWidth = useWindowWidth();

    useEffect(() => {
        setIsWindowLoaded(true);
    }, [windowWidth]);

    return (
        <>
            {!isWindowLoaded ? (
                <Loader />
            ) : (
                <header className="fixed top-[20px] left-1/2 -translate-x-1/2 h-[57px]" style={{width: `${windowWidth && windowWidth < 1240 ? windowWidth - 40 + 'px' : '1200px'}`}}>
                    <Card>
                        <CardBody className="flex flex-row justify-between items-center px-6">
                            <div className="flex items-center gap-5">
                                <a href="/">
                                    <h1 className="text-xl font-bold">Rendz-Vous</h1>
                                </a>
                                <Divider orientation="vertical" style={{height: '40px'}} />
                            </div>
                            <div>
                                
                            </div>
                            <div className="flex items-center gap-5">
                                <ButtonGroup>
                                    <Button onClick={(e: any) => window.location.href = "/login"}>Se connecter</Button>
                                    <Button onClick={(e: any) => window.location.href = "/register"}>Créer un compte</Button>
                                </ButtonGroup>
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