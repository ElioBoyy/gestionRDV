import { useEffect, useState } from "react";
import { Switch } from "@nextui-org/switch";
import { MoonIcon } from "../../public/MoonIcon";
import { SunIcon } from "../../public/SunIcon";

const ThemeSwitch = () => {
    const [theme, setTheme] = useState("light");
    
    useEffect(() => {
        if (typeof window !== "undefined") {
            const localTheme = localStorage.getItem("theme");
            if (
                localTheme === "dark" ||
                (!localTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)
            ) {
                document.documentElement.classList.add("dark");
                setTheme("dark");
            } else {
                document.documentElement.classList.remove("dark");
                setTheme("light");
            }
        }
    }, []);

    const toggleTheme = () => {
        if (theme === "light") {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
            setTheme("dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
            setTheme("light");
        }
    };

    return (
        <div className="flex gap-2 items-center">
            <Switch
                size="lg"
                defaultChecked={theme === "dark"}
                onClick={toggleTheme}
                color="default"
                className="mr-[-9px]"
                startContent={<SunIcon />}
                endContent={<MoonIcon />}
            />
        </div>
    );
};

export default ThemeSwitch;
