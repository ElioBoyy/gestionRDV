'use client'

import { Divider } from "@nextui-org/divider";
import { MailIcon } from "../../../public/MailIcon";
import { useEffect, useState } from "react";
import { EyeFilledIcon, EyeSlashFilledIcon } from "../../../public/EyeIcons";
import { Button, Input } from "@nextui-org/react";
import { queryMaker } from "../../../utils/dbConnection";

export default function Login() {
    const  [isVisible, setIsVisible ] = useState(false);
    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ token, setToken ] = useState<string | null>(null);
    const toggleVisibility = () => setIsVisible(!isVisible);

    useEffect(() => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                setToken(token);
            }
        } catch (error) {
            console.error('Error while getting localStorage`s token:', error);
        }
    }, [token]);

    const connexionSubmit = async () => {
        try {
            await queryMaker('api/auth', 'POST', JSON.parse(JSON.stringify({email: email, password: password})))
                ?.then((res) => setToken(res.data.token));
                if (token) {
                    localStorage.setItem('token', token);
                }
                // console.log(localStorage.getItem('token'));
        } catch (error) {
            console.error('Error during authentication:', error);
        }
    };

    return (
        <>
            { token !== '' ? window.location.href = "/account" : (
                <div className="absolute w-full h-full">
                    <div className="relative left-1/2 top-[50%] -translate-x-1/2 -translate-y-1/2 w-[300px] flex flex-col gap-10">
                        <Input
                            type="email"
                            label="Email"
                            placeholder="you@example.com"
                            variant="bordered"
                            labelPlacement="outside"
                            endContent={
                                <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                            }
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Input
                            labelPlacement="outside"
                            label="Password"
                            variant="bordered"
                            placeholder="Entrez un mot de passe"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            endContent={
                                <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                                {isVisible ? (
                                    <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                ) : (
                                    <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                )}
                                </button>
                            }
                            type={isVisible ? "text" : "password"}
                            className="max-w-xs"
                        />
                        <div className="flex flex-row justify-between">
                            <Divider orientation="vertical" className="h-[40px]" />
                            <Button className="relative w-1/2" variant="bordered" onClick={connexionSubmit}>Se connecter</Button>
                            <Divider orientation="vertical" className="h-[40px]" />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}