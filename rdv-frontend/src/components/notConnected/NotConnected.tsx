'use client'

import { Button } from "@nextui-org/button";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/modal"

export const NotConnected = () => {
    const { onOpenChange } = useDisclosure();
    const isOpen = true;
    
    return (
        <>
            <Modal isOpen={isOpen} backdrop="blur" onOpenChange={onOpenChange}>
                <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">{'Vous n\'êtes pas identifié'}</ModalHeader>
                        <ModalBody>
                            <p className="text-default-900">Vous devez être connecté pour accéder à cette page.</p>
                        </ModalBody>
                        <ModalFooter className="flex justify-between">
                            <Button className="w-fit" color="primary" variant="bordered" onClick={(e:any) => window.location.href = '/login'}>
                                Connexion
                            </Button>
                            <Button className="w-fit text-white" color="primary" onClick={(e:any) => window.location.href = '/'}>
                                {'Page d\'accueil'}
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
            </Modal>
        </>
    )
}