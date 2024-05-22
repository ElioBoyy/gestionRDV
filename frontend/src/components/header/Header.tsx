import React from 'react';
import RendzVous from '../../../public/RendzVous.png';

const Header: React.FC = () => {
    const token = localStorage.getItem('token');
    const [isLogged, setIsLogged] = React.useState(false);

    React.useEffect(() => {
        if (token) {
            setIsLogged(true);
        } else {
            setIsLogged(false);
        }
    }, [token]);

    return (
        <header className="bg-darkGray fixed flex items-center justify-between top-0 left-0 w-full h-[80px] z-50">
            <a href="/">
                <img src={RendzVous} alt="RendzVous logo" className='w-[100px] h-[100px]' />
            </a>
            <div className='flex items-center gap-[20px]'>
                <div className='flex gap-[20px] items-center'>
                    <a href="/mes_rendzvous" className='cursor-pointer h-fit rounded-md text-primary transition-all hover:text-secondary'>{isLogged ? ('Mes '):('Prendre ')}Rendz-Vous</a>
                    {isLogged ? (
                        <a href="/mon_compte" className='cursor-pointer h-fit rounded-md text-primary transition-all hover:text-secondary'>Mon compte</a>
                    ) : (<></>)}
                    <input placeholder='Trouver un praticien...' type='text' className='w-[200px] px-[8px] py-[4px] rounded-md text-primary transition-all bg-secondary'
                    onClick={(e: any) => console.log("input clicked")}></input>
                </div>
                <div className='w-[1px] h-[55px] bg-secondary'></div>
                {isLogged ? (
                    <a className='cursor-pointer h-fit mr-[20px] px-[15px] py-[8px] rounded-md text-secondary transition-all bg-primary hover:text-primary hover:bg-secondary'>Se déconnecter</a>
                ) : (
                    <a className='cursor-pointer h-fit mr-[20px] px-[15px] py-[8px] rounded-md text-secondary transition-all bg-primary hover:text-primary hover:bg-secondary'>Se connecter</a>
                )}
            </div>
        </header>
    );
}

export default Header;
