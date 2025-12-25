import { createContext, useContext, useState, type ReactNode, type Dispatch, type SetStateAction } from "react";
import { Lab } from "@/types";

interface LabsContextType {
    labs: Lab[];
    setLabs: Dispatch<SetStateAction<Lab[]>>;
}

const LabsContext = createContext<LabsContextType | undefined>(undefined);

export const LabsProvider = ({ children }: { children: ReactNode }) => {
    const [labs, setLabs] = useState<Lab[]>([]);
    return (
        <LabsContext.Provider value={{ labs, setLabs }}>
            {children}
        </LabsContext.Provider>
    );
};

export const useLabs = () => {
    const context = useContext(LabsContext);
    if (!context) {
        throw new Error("useLabs must be used within a LabsProvider");
    }
    return context;
};
