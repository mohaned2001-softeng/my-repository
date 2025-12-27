import { createContext , useState , useContext  , type Dispatch, type SetStateAction } from "react";

interface Skill {
    id: string;
    name: string;
}

interface SkillsContextType {
    skills: Skill[];
    setSkills: Dispatch<SetStateAction<Skill[]>>;
}

const SkillsContext = createContext<SkillsContextType | undefined>(undefined);

export const SkillsProvider = ({ children }: { children: React.ReactNode }) => {
    const [skills, setSkills] = useState<Skill[]>([]);
    return (
        <SkillsContext.Provider value={{ skills, setSkills }}>
            {children}
        </SkillsContext.Provider>
    );
}
export const useSkills = () => {
    const context = useContext(SkillsContext);  

    if (!context) {
        throw new Error("useSkills must be used within a SkillsProvider");
    }   
    return context;

};