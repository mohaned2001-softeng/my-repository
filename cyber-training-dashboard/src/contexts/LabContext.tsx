import { AddLabState, Lab } from '@/types';
import {createContext , useState , useContext, type ReactNode, useCallback, type Dispatch, type SetStateAction} from 'react'; 
import { addLabAPIClient , deleteAllLabsAPIClient, updateLabAPIClient, deleteLabAPIClient, getAllLabsAPIClient, getTeacherLabsAPIClient } from '@/core/apiClient';


interface LabContextType {
    lab: Lab;
    setLab: Dispatch<SetStateAction<Lab>>;
    addLab: (token:string , labData:AddLabState) => Promise<void>;  
    editLab: (token:string , labData:Lab) => Promise<void>;
    deleteLab: (token:string , labId:string) => Promise<void>;
    deleteAllLabs: (token:string) => Promise<void>;
    fetchLabs: () => Promise<Lab[]>;
    fetchTeacherLabs: ( token:string) => Promise<Lab[]>;
}
const LabContext = createContext<LabContextType | null>(null);

const defaultLab: Lab = {
  id: '',
  title: '',
  description: '',
  difficulty: 'Beginner',
  category: 'Linux',
  image: null,
  image_url: null,
  writeup_url: '',
  skills: [],
  estimated_time: 0
};

export const LabProvider = ({children}: {children: ReactNode}) => {
   const [lab , setLab ] = useState<Lab>(defaultLab);

    const addLab = useCallback(async (token:string , labData:AddLabState)=>{
         await addLabAPIClient(token, labData);
    },[]);

    const editLab  = useCallback(async (token:string , labData:Lab)=>{
        if(!labData.id){
            throw new Error("Lab id is required to edit a lab");
        }
        await updateLabAPIClient(token,labData.id, labData);
    },[]);

    const deleteLab = useCallback(async (token:string , labId:string)=>{
        await deleteLabAPIClient(token, labId);
    },[]);
     
    const deleteAllLabs = useCallback(async (token:string)=>{
        await deleteAllLabsAPIClient(token);
    },[]);
    const  fetchLabs = useCallback(async ()=>{
        const response = await getAllLabsAPIClient();
        return response.data as Lab[];
    },[]);
    const fetchTeacherLabs = useCallback( async ( token:string)=>{
       const response = await getTeacherLabsAPIClient(token);
       return response.data as Lab[];
    },[]);
    return(
    <LabContext.Provider value={{lab , setLab, addLab, editLab, deleteLab, deleteAllLabs, fetchLabs, fetchTeacherLabs}}>
        {children}
    </LabContext.Provider>
   )
}

export const useLab = () =>{
    const context = useContext(LabContext);
    if(!context){
        throw new Error("useLab must be used within a LabProvider");
    }
    return context;
}