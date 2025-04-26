import { useContext } from "react";
import NotesContext from "@/contexts/NotesContext";

const useNotes = () => {
  return useContext(NotesContext);
};

export default useNotes;
