import { ReactNode } from "react"

export interface SaveNotesProps {
    message?: string,
    country?: string,
    name?: string,
    code?: string,
    id: string | null
    date?: Date
}

export interface NotesProviderProps {
    children: ReactNode
}

export interface Note {
    message?: string,
    country?: string,
    name?: string,
    code?: string,
    _id: string,
    date?: Date
}

export interface FilterNotesPros {
    country?: string,
    date?: Date
}

export interface NotesContextProps {
    note: Note
    setNote: React.Dispatch<React.SetStateAction<Note>>;
    notes: Note[];
    setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
    saveNote: (note: SaveNotesProps) => Promise<null | string>;
    editNote: (note: Note) => Promise<void>;
    filterNotes: (params: FilterNotesPros) => Promise<null | string>;
    deleteNote: (id: string) => Promise<null | string>;
    notesFiltered: Note[]
    setNotesFiltered: React.Dispatch<React.SetStateAction<Note[]>>;
}