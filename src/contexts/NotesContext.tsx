'use client'

import { useState, useEffect, createContext, ReactNode } from "react";
import axiosClient from "../config/axios";
import useAuth from "@/hooks/UseAuth";
import axios from "axios";
import handleApiError from "@/utils/handleApiError";



interface NotesContextProps {
    note: Note
    setNote: React.Dispatch<React.SetStateAction<Note>>;
    notes: Note[];
    setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
    saveNote: (note: SaveNotesProps) => Promise<null| string>;
    editNote: (note: Note) => Promise<void>;
    filterNotes: (params: FilterNotesPros) => Promise<null| string>;
    deleteNote: (id: string) => Promise<null| string>;
    notesFiltered: Note[]
    setNotesFiltered: React.Dispatch<React.SetStateAction<Note[]>>;
}


const NotesContext = createContext<NotesContextProps>({
    note: { _id: '' },
    setNote: () => {},
    notes: [],
    setNotes: () => {},
    saveNote:async () => null,
    editNote: async () => {},
    filterNotes: async () => null,
    deleteNote: async () => null,
    notesFiltered: [],
    setNotesFiltered:()=> {}
});


interface SaveNotesProps {
    message?: string,
    country?: string,
    name?: string,
    code?: string,
    id: string | null
    date?: Date
}


interface NotesProviderProps {
    children: ReactNode
}

interface Note {
    message?: string,
    country?: string,
    name?: string,
    code?: string,
    _id: string,
    date?: Date
}

interface FilterNotesPros {
    country?:string,
    date?: Date
}

const NotesProvider: React.FC<NotesProviderProps> = ({ children }) => {
    const { auth } = useAuth();
    const [notes, setNotes] = useState<Note[]>([])
    const [notesFiltered, setNotesFiltered] = useState<Note[]>([]);
    const [note, setNote] = useState<Note>({ _id: '' })


    useEffect(() => {

        const getNotes = async () => {
            const token = localStorage.getItem('MapToken');
            if (!token) return;

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            try {
                const { data } = await axiosClient('/notes', config)
                setNotes(data);
            } catch (error: unknown) {
                if (axios.isAxiosError(error) && error.response) {
                    throw new Error(error.response.data.msg)
                }
            }
        }

        getNotes()
    }, [auth])

   

    const saveNote = async (note: SaveNotesProps) => {
        const token = localStorage.getItem('MapToken');
        if (!token) return;

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }

        if (note.id) {

            try {
                const { data } = await axiosClient.put(`/notes/${note.id}`, note, config)
                const updatedNotes = notes.map(note => note._id === data._id ? data : note)
                setNotes(updatedNotes)
                return null
            } catch (error: unknown) {
                return handleApiError(error)
            }

        }
        else {
            try {
                const { data } = await axiosClient.post(`/notes`, note, config)
                setNotes([data, ...notes])
                return null
            } catch (error: unknown) {
                return handleApiError(error)
            }

        }
    }

    const editNote = async (note: Note): Promise<void> => {
        setNote(note)
    }

    
    const filterNotes = async (params: FilterNotesPros) => {
        const token = localStorage.getItem('MapToken');
        if (!token) return;

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }

        try {
            const { data } = await axiosClient.post('/notes/filter', params, config)
            setNotesFiltered(data)
            return null
        } catch (error: unknown) {
            return handleApiError(error)
        }
    }
    const deleteNote = async (id: string) => {
        const token = localStorage.getItem('MapToken');
        if (!token) return;

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }

        try {
            await axiosClient.delete(`/notes/${id}`, config)
            const updateNotes = notes.filter(note => note._id !== id)
            setNotes(updateNotes)
            return null
        } catch (error: unknown) {
           return handleApiError(error)
        }
    }


    return (
        <NotesContext.Provider value={{ setNotes, editNote, note, setNote, notes, saveNote, deleteNote, filterNotes, notesFiltered, setNotesFiltered }}>
            {children}
        </NotesContext.Provider>
    )
}

export {
    NotesProvider
}

export default NotesContext