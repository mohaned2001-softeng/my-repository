import { useLab } from "@/contexts/LabContext";
import { useLabs } from "@/contexts/LabsContext";
import React, { useEffect , useState } from "react";
import "@/styles/styles.css";
import SkillsDialog from "./SkillsDialog";
import { AddLabState, Lab } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { buildAssetUrl } from "@/lib/config";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
export default function LabManagementForm() {
     const categories = [
        { name: 'Linux', count: 25, icon: 'M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z' },
        { name: 'Web', count: 15, icon: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9' },
        { name: 'Network', count: 8, icon: 'M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0' },
        { name: 'Crypto', count: 5, icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
  ];
  const {lab , setLab ,addLab , fetchTeacherLabs , fetchLabs, deleteLab , editLab } = useLab();
  const {token} = useAuth();
  const [openDialog , setOpenDialog] = useState(false);
  const [image , setImage] = useState<File | null>(null);
  const [imagePath , setImagePath] = useState<string | null>(null);
  const {toast} = useToast();
  const [labsList , setLabsList] = useState<Lab[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedLabId, setSelectedLabId] = useState<string | null>(null);
  
  const { setLabs } = useLabs();
   useEffect(()=>{
       if(token){
          setLabsList([]);
           fetchTeacherLabs(token.access_token).then((data)=>{
             setLabsList(data);
          });
       }
    },[token])
  const handleAddLab = async (labData:AddLabState) => {
    if(labData.title.trim() === ""  || labData.estimated_time <=0  || labData.writeup_url.trim() === ""){
        alert("Please fill in all required fields.");
        return;
    }
    if(!token){
      return;
    }
     setLab({...lab , image_url:""})
    try{
     
      console.log(labData)
      await addLab(token.access_token, labData);
      setLab({...lab, id:""})
      toast({
        title: "Success",
        description: "Lab added successfully",
        duration: 5000
      });
      clearInputs();
      const updatedLabs = await fetchTeacherLabs(token.access_token);
      setLabsList(updatedLabs);
      const allLabs = await fetchLabs();
      setLabs(allLabs);

    }catch(error){
      toast({
        title: "Error",
        description: "Unable to add lab. Please try again.",
        variant: "destructive"
      });
    }
  }
  
  const clearInputs = () =>{
    setLab({ ...lab,
      id:"",
      title: '',
      description: '',
      difficulty: 'Beginner',
      category: 'Linux',
      image: null,
      writeup_url: '',
      skills: [],
      estimated_time: 0
    });
  }

  const handleUpdateLab = async (labData:Lab) =>{
    if(labData.title.trim() === "" || labData.description.trim() === ""  || labData.estimated_time <=0 ){
        alert("Please fill in all required fields.");
        return;
    }
    if(!token){
      return;
    }
    try{
      await editLab(token.access_token, labData);
      toast({
        title: "Success",
        description: "Lab updated successfully",
        duration: 5000
      });
      clearInputs();
      const updatedLabs = await fetchTeacherLabs(token.access_token);
      setLabsList(updatedLabs);
      const allLabs = await fetchLabs();
      setLabs(allLabs);
    }catch(error){
      toast({
        title: "Error",
        description: "Unable to update lab. Please try again.",
        variant: "destructive"
      });
    }
  }

  const getLabById = (labId:string) =>{
    return labsList.find((lab) => lab.id === labId) || null;
  }

  const selectLabForEdit = (labId:string) =>{
     const selectedLab = getLabById(labId);
      if(selectedLab){
        setLab(selectedLab);
        setLab({...selectedLab, image_url: selectedLab.image.toString() });
        window.scrollTo({ top: 600 , behavior: 'smooth' });
      }
  }

  const openDeleteDialog = (labId: string) => {
    setSelectedLabId(labId);
    setDeleteDialogOpen(true);
  }

  const confirmDeleteLab = async () => {
    if (selectedLabId && token) {
      try{
        await deleteLab(token.access_token, selectedLabId);
        toast({
          title: "Success",
          description: "Lab deleted successfully",
          duration: 5000
        });
        const updatedLabs = await fetchTeacherLabs(token.access_token);
        setLabsList(updatedLabs);
        const allLabs = await fetchLabs();
         setLabs(allLabs);
      }catch(error){
        toast({
          title: "Error",
          description: "Unable to delete lab. Please try again.",
          variant: "destructive"
        });
      }finally{
        setDeleteDialogOpen(false);
        setSelectedLabId(null);
      }
    }
  }
 return (
   <>
      <div  style={{backgroundColor:"#123" , padding:"20px" , marginTop:"14px" , borderRadius:"8px" , width:"100%"}}>
        <div >
          <div style={{width:"100%", textAlign:"center"}}>
            <h2  style={{color:"white"  , margin:"auto"}}>Lab management</h2>
          </div>
             <div style={{display:"flex", justifyContent:"space-between"}}>
                <div>
                  <input type="hidden" value={lab.id} />
                  <label style={{color:"white"}}>Lab title :</label>
                  <br/>
                  <input type="text" required value={lab.title} onChange={(e)=>{setLab({...lab, title: e.target.value})}} className="inputs" placeholder="title" />
                </div>
                <div>
                   <label style={{color:"whitesmoke"}}>Difficulty :</label>
                  <br/>
                  <select value={lab.difficulty} onChange={(e)=>{setLab({...lab, difficulty: e.target.value})}} className={"inputs selects"}>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Expert">Expert</option>
                    <option value="Crypto">Crypto</option>
                  </select>
               </div>
                <div >
                   <label style={{color:"whitesmoke"}}>Category :</label>
                  <br/>
                  <select value={lab.category} onChange={(e)=>{setLab({...lab, category: e.target.value})}}  className={"inputs selects"}>
                      {categories.map((cat)=> 
                        <option key={cat.name} value={cat.name}>{cat.name}</option>
                      )}
                  </select>
               </div>
             </div >
             <div style={{display:"flex", justifyContent:"space-between"}}>
               <div>
                  <label style={{color:"whitesmoke"}}>Writeup URL :</label>
                  <br/>
                  <input type="url" value={lab.writeup_url} onChange={(e)=>{setLab({...lab, writeup_url: e.target.value})}} className="inputs" placeholder="writeup URL" />
               </div>
               <div>
                    
               </div>
               <div style={{display:"flex" , justifyContent:"space-between" , width:"360px" ,alignItems:"center"}}>
                  <label style={{color:"whitesmoke"}}>Estimated Time  between:</label>
                  <br/>
                  <input required type="number" value={lab.estimated_time} onChange={(e)=>{setLab({...lab, estimated_time: Number(e.target.value)})}} className="inputs numberInputs"  />
                  <span style={{color:"white" , marginLeft:"4px"}}>hours</span>
               </div>
             </div>
             <div style={{display:"flex", justifyContent:"space-between"}}>
               <div>
                  <label style={{color:"whitesmoke"}}>select image for lab :</label>
                  <div style={{marginTop:"10px" , borderRadius:"8px" , marginBottom:"6px" , width:"200px" , height:"120px" , border:"1px dashed gray"  , display:"flex" , alignItems:"center" , justifyContent:"center"}}>
                    <img src={lab.image_url ? buildAssetUrl(lab.image_url) ?? "" : ""} alt="Lab Image" style={{width:"200px" , height:"120px" , objectFit:"cover" , borderRadius:"8px"}}/>
                  </div>
                  <input type="file" style={{backgroundColor:"#3330b1ff" , color:"black" , padding:"8px 16px" , borderRadius:"8px" , marginTop:"10px"}} accept="image/jpg,image/jpeg,image/png,image/webp" placeholder="select image"  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      const nextImage = e.target.files[0];
                      const previewUrl = URL.createObjectURL(nextImage);
                      setLab(prev => ({ ...prev, image_url: previewUrl, image: nextImage }));
                    }
                  }} />
               </div>
               <div style={{width:"60%"}}>
                <label style={{color:"whitesmoke"}}>Description</label>
                <br/>
                <textarea value={lab.description} onChange={(e)=>{
                   setLab({...lab , description: e.target.value})
                }} placeholder="lab description" className="textarea"></textarea>
               </div>
             </div>
             <div style={{display:"flex" , justifyContent:"space-around"}}>
                <button type="submit" onClick={()=>{handleAddLab(lab)}} style={{backgroundColor:"#44ef69ff" , color:"black" , padding:"8px 16px" , borderRadius:"8px" , marginTop:"10px"}}>Add Lab</button>
                <button type="submit"  style={{backgroundColor:"#EF4444" , color:"white" , padding:"8px 16px" , borderRadius:"8px" , marginTop:"10px"}}>Delete Lab</button>
                <button type="submit" onClick={()=> {handleUpdateLab(lab)}}  style={{backgroundColor:"#e4ef44ff" , color:"black" , padding:"8px 16px" , borderRadius:"8px" , marginTop:"10px"}}>Update Lab</button>
                <button type="submit" onClick={()=>{
                   setOpenDialog(true)
                }}  style={{backgroundColor:"#3330b1ff" , color:"black" , padding:"8px 16px" , borderRadius:"8px" , marginTop:"10px"}}>Skills manage</button>
            
             </div>

        </div>
        <div>
           <table style={{height:"300px" , overflowY:"scroll" , display:"block" , marginTop:"20px" , border:"1px solid gray"}}>
              <thead style={{position:"sticky" , top:0  , borderBottom:"1px solid gray" , backgroundColor:"#367527ff"}} >
                <tr style={{}} >
                  <th style={{color:"gold"}}>Title</th>
                  <th style={{color:"gold"}}>Writeup URL</th>
                  <th style={{color:"gold"}}>Category</th>
                  <th style={{color:"gold"}}>Difficulty</th>
                  <th style={{color:"gold"}}>Estimated Time</th>
                  <th style={{color:"gold"}}>Delete</th>
                  <th style={{color:"gold"}}>Edit</th>
                </tr>
              
              </thead>
                <tbody>
                    {labsList.map((lab) => (
                  <tr key={lab.id}>
                    <td style={{color:"white"}}>{lab.title}</td>
                    <td style={{color:"white"}}><a href={lab.writeup_url} target="_blank" rel="noopener noreferrer" style={{color:"lightblue"}}>Writeup</a></td>
                    <td style={{color:"white"}}>{lab.category}</td>
                    <td style={{color:"white"}}>{lab.difficulty}</td>
                    <td style={{color:"white"}}>{lab.estimated_time} hours</td>
                    <td style={{color:"white"}}><button className="deleteButtons" onClick={() => openDeleteDialog(lab.id)}>Delete</button></td>
                    <td style={{color:"white"}}><button className="editButtons" onClick={() => selectLabForEdit(lab.id)}>Edit</button></td>
                  </tr>
                ))}
                </tbody> 
           </table>
        </div>
        <SkillsDialog openDialog={openDialog} setOpenDialog={setOpenDialog} />
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this lab? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <button
                onClick={() => setDeleteDialogOpen(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteLab}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 ml-2"
              >
                Delete
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
   </>
 )
}