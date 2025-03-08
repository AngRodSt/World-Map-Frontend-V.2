'use client'
import { useState, useEffect, useMemo } from "react"
import Alert from "./Alert";
import useNotes from "@/hooks/useNotes";
import Button from "./Button";

interface NoteModalProps {
  countryName?: string,
  countryCode?: string,
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>
}

const NoteModal: React.FC<NoteModalProps> = ({ countryName, countryCode, setIsOpen }) => {
  const [alert, setAlert] = useState<{ msg: string | null, error: boolean }>({ msg: '', error: false })
  const { saveNote, note, setNote } = useNotes()
  const { country = '', message = '', name = '', code = '', _id = null } = note || {}
  const MAX_WORDS = 100;
  const [noteLocal, setNoteLocal] = useState({
    message: message,
    country: country,
    name: name,
    code: code,
    id: _id
  })
  const [buttonClicked, setButtonClicked] = useState(false)

  useEffect(() => {
    const updateNote = () => {
      setNoteLocal({ ...noteLocal, country: countryName ?? '', code: countryCode ?? '' })
    }
    updateNote()

  }, [countryName, countryCode])


  const handleChangeTextArea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputText = e.target.value;
    const words = inputText.trim().split(/\s+/).filter(Boolean);
    if (words.length <= MAX_WORDS) {
      setNoteLocal({ ...noteLocal, message: inputText });
    } else {
      const limitedText = words.slice(0, MAX_WORDS).join(' ');
      setNoteLocal({ ...noteLocal, message: limitedText });
    }
  }

  const wordCount = useMemo(() => {
    return noteLocal.message.trim().split(/\s+/).filter(Boolean).length;
  }, [noteLocal.message])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!noteLocal.message) {
      setAlert({
        msg: 'The field cannot be empty',
        error: true
      })
      return
    }
    setAlert({ msg: '', error: false })

    setButtonClicked(true)

    const saveNoteError = await saveNote(noteLocal)
    if (saveNoteError) {
      setAlert({
        msg: saveNoteError || 'Hubo un error',
        error: true
      })
    }
    else {
      setAlert({
        msg: 'Note saved successfully',
        error: false
      })
    }

    
    setTimeout(() => {
      setNoteLocal({ ...noteLocal, message: '', name: '' })
      setButtonClicked(false)
      if (setIsOpen) {
        setIsOpen(false)
      }
      setNote({ _id: '' })
    }, 1000);

  }

  const { msg } = alert

  return (
    <>
      {msg && <Alert alert={alert} />}
      <div className="mt-5  ">
        <form onSubmit={handleSubmit} className="flex flex-col">
          <label htmlFor="name" className="font-bold text-xl text-gray-700">Name</label>
          <input value={noteLocal.name} onChange={(e) => setNoteLocal({ ...noteLocal, name: e.target.value })} id="name" type="text" placeholder="Name of the person you met (not mandatory)" className="p-2 rounded-lg my-2 bg-gray-100 border" />
          <label htmlFor="messege" className="font-bold text-xl text-gray-700">Notes</label>
          <textarea value={noteLocal.message} onChange={handleChangeTextArea} rows={4} name="messege" id="messege" placeholder="Add Note" className="p-2 rounded-lg my-2 bg-gray-100 border " style={{
            resize: 'none'
          }}></textarea>
          <p className="text-gray-400 mb-4 text-sm">Words: {wordCount}/{MAX_WORDS}</p>
          <Button text={`${Object.keys(note ?? {}).length ? 'Edit Note' : 'Add Note'}`} setButtonClicked={buttonClicked} />
        </form>
      </div>
    </>
  )
}


export default NoteModal

