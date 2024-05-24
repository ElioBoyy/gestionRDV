'use client'

import { Divider } from "@nextui-org/divider";
import { MailIcon } from "../../../public/MailIcon";
import { act, useEffect, useState } from "react";
import { EyeFilledIcon, EyeSlashFilledIcon } from "../../../public/EyeIcons";
import { Button, Card, CardBody, DatePicker, DateValue, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Tab, Tabs, Tooltip, useDisclosure } from "@nextui-org/react";
import { queryMaker } from "../../../utils/dbConnection";
import Alert from '@mui/material/Alert';
import { Loader } from "@/components/loader/Loader";

export default function Login() {
    const [ isVisible, setIsVisible ] = useState(false);
    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ token, setToken ] = useState<string | null>(null);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [ firstName, setFirstName ] = useState('');
    const [ lastName, setLastName ] = useState('');
    const [ bDay, setBDay ] = useState<DateValue>();
    const [ userSexe, setUserSexe ] = useState('');
    const [ confirmEmail, setConfirmEmail ] = useState('');
    const [ confirmPassword, setConfirmPassword ] = useState('');
    const [ isMounted, setIsMounted ] = useState(false);
    const toggleVisibility = () => setIsVisible(!isVisible);

    useEffect(() => {
        const getTokenFromLocalStorage = () => {
            try {
                const token = localStorage.getItem('token');
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

    const registerSubmit = async () => {
        try {
            await queryMaker('api/users', 'POST', 
                JSON.parse(JSON.stringify(
                    {
                        firstName: firstName,
                        lastName: lastName,
                        email: email,
                        password: password,
                        birthDate: new Date(bDay?.toString() || ''),
                        activated: true,
                        role: 'user',
                        sexe: userSexe
                    }
                )))
                ?.then((res) => { window.location.href = '/user_profile', setToken(res.data.token), localStorage.setItem('token', res.data.token) });
                // console.log(localStorage.getItem('token'));
        } catch (error) {
            console.error('Error during authentication:', error);
        }
    };

    const isEmailAlreadyUsed = async (email: string) => {
        try {
            await queryMaker('api/users/check', 'POST', JSON.parse(JSON.stringify({ email: email })))?.then((res) => {
                if (res.data.isUserExist === true) {
                    alert('Email déjà utilisé');
                } else {
                    registerSubmit();
                }
            });
        } catch (error) {
            console.error('Error while checking email:', error);
        }
        return false;
    }

    const dateValidator = (date: DateValue) => {
        if (date === undefined) {
            return false;
        }

        const dateString = new Date(date.toString());

        try {
            const dateObj = new Date(dateString);
            if (dateObj instanceof Date && !isNaN(dateObj.getTime())) {
                if (dateObj.getUTCFullYear() > 1900) {
                    // console.log(dateObj.toISOString());
                    setBDay(date);
                    console.log(bDay);
                    return true;
                }
            }
        } catch (error) {
            console.error('Error while validating date:', error);
        }
    }

    return (
        <>
            <div className="absolute w-full h-full z-0">
                <div className="relative left-1/2 top-[50%] -translate-x-1/2 -translate-y-1/2 w-[300px] flex flex-col gap-10">
                    <h1 className="underline text-xl font-semibold">Créer un compte</h1>
                    <Input
                        isRequired
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
                        isRequired
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
                        <Tooltip content="Informations utilisateur" placement={"bottom"}>
                            { email.length < 5 || email.match(/@/) === null || (password.length < 8) ? (
                                <Button className="relative" variant="bordered" isDisabled onPress={onOpen} >Etape suivante</Button>
                            ) : (
                                <Button className="relative" variant="bordered" onPress={onOpen} >Etape suivante</Button>
                            )}
                        </Tooltip>
                        <Divider orientation="vertical" className="h-[40px]" />
                    </div>
                </div>
            </div>
            
            <Modal isOpen={isOpen} backdrop="blur" onOpenChange={onOpenChange} isDismissable={false} isKeyboardDismissDisabled={true}>
                <ModalContent>
                {(onClose) => (
                    <>
                    <ModalHeader className="flex flex-col gap-1">Informations utilisateur</ModalHeader>
                    <Divider />
                    <ModalBody>
                    <Tabs
                        aria-label="Options"
                        disabledKeys={
                            lastName.length < 3 || firstName.length < 3
                                ? ["profile", "confirmer"]
                                : (userSexe !== "Homme" && userSexe !== "Femme") || bDay === undefined
                                ? ["confirmer"]
                                : []
                        }
                        className="mt-[15px]"
                    >
                        <Tab key="nomDUtilisateur" title="Nom d'utilisateur">
                        <Card className="relative">
                            <CardBody className="relative h-[300px] flex justify-center flex-col left-1/2 -translate-x-1/2 gap-6 w-[75%]">
                                <Input
                                    isRequired
                                    type="text"
                                    label="Nom"
                                    placeholder="Nom"
                                    variant="bordered"
                                    labelPlacement="outside"
                                    onChange={(e) => { setLastName(e.target.value) }}
                                    value={lastName}
                                />
                                <Input
                                    isRequired
                                    type="text"
                                    label="Prénom"
                                    placeholder="Prénom"
                                    variant="bordered"
                                    labelPlacement="outside"
                                    onChange={(e) => { setFirstName(e.target.value) }}
                                    value={firstName}
                                />
                            </CardBody>
                        </Card>  
                        </Tab>
                        <Tab key="profile" title="Profile">
                        <Card>
                            <CardBody className="relative h-[300px] flex justify-center flex-col left-1/2 -translate-x-1/2 gap-6 w-[75%]">
                                <Dropdown>
                                    <DropdownTrigger>
                                        <Button variant="bordered">
                                            {userSexe.length === 0 ? "Sélectionnez votre sexe" : (
                                                userSexe === "Homme" ? "Vous êtes un homme" : "Vous êtes une femme"
                                            )}
                                        </Button>
                                    </DropdownTrigger>
                                    <DropdownMenu aria-label="Static Actions" onAction={(key) => setUserSexe(key.toString())}>
                                        <DropdownItem key="Homme">Homme</DropdownItem>
                                        <DropdownItem key="Femme">Femme</DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                                <DatePicker 
                                    label="Anniversaire"
                                    isRequired
                                    value={bDay}
                                    onChange={dateValidator}
                                />
                            </CardBody>
                        </Card>  
                        </Tab>
                        <Tab key="confirmer" title="Confirmer">
                        <Card>
                            <CardBody className="relative h-[300px] flex justify-center flex-col left-1/2 -translate-x-1/2 gap-2 w-[75%]">
                                <h1>Confirmez vos informations</h1>
                                <Input
                                    isRequired
                                    type="email"
                                    label="Email"
                                    placeholder="you@example.com"
                                    variant="bordered"
                                    labelPlacement="outside"
                                    endContent={
                                        <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                                    }
                                    value={confirmEmail}
                                    onChange={(e) => setConfirmEmail(e.target.value)}
                                />
                                <Input
                                    isRequired
                                    labelPlacement="outside"
                                    label="Password"
                                    variant="bordered"
                                    placeholder="Entrez un mot de passe"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                            </CardBody>
                        </Card>  
                        </Tab>
                    </Tabs>
                    </ModalBody>
                    <Divider className="mt-[4px]" />
                    <ModalFooter>
                        <Button color="danger" variant="light" onPress={onClose}>
                            Fermer
                        </Button>
                        {confirmEmail.length !== 0 || confirmPassword.length !== 0 ? (
                            confirmEmail.length < 5 || confirmEmail.match(/@/) === null || (confirmPassword.length < 8) ? (
                                <Tooltip content="Email ou mot de passe invalide" placement={"top"}>
                                        <div>
                                        <Button color="default" isDisabled onPress={onClose}>
                                            Créer un compte
                                        </Button>
                                    </div>
                                </Tooltip>
                            ) : 
                            confirmEmail === email && confirmPassword === password ? (
                                <Button color="default" onPress={onClose} onClick={(e) => {(isEmailAlreadyUsed(email))}}>
                                    Créer un compte
                                </Button>
                            ) : (
                                <Tooltip content="Les identifiants ne correspondent pas" placement={"top"}>
                                    <div>
                                        <Button color="default" onPress={onClose} isDisabled >
                                            Créer un compte
                                        </Button>
                                    </div>
                                </Tooltip>
                            )                           
                        ) : (
                            <Tooltip content="Veuillez remplir les champs" placement={"top"}>
                                <div>
                                    <Button color="default" isDisabled onPress={onClose}>
                                        Créer un compte
                                    </Button>
                                </div>
                            </Tooltip>
                        )}
                        
                    </ModalFooter>
                    </>
                )}
                </ModalContent>
            </Modal>
        </>
    );
}