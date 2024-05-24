import { Spinner } from "@nextui-org/react";
import { useEffect, useState } from "react";

export const Loader = () => {
    return (
        <div className="absolute z-50 w-full h-full flex flex-col items-center justify-center gap-10" style={{ backgroundColor: "#000" }}>
            <Spinner color="primary" size="lg" />
            <h1 className="text-text text-xl"  style={{ color: "#fff" }}>Chargement de la page...</h1>
        </div>
    );
}