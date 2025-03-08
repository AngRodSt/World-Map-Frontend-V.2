'use client'

import useNotes from "@/hooks/useNotes"
import Note, { NoteProps as NoteType } from "@/components/NoteBody"
import { useEffect, useState, memo } from "react"
import ReactPaginate from "react-paginate"
import { fillSelectCountries } from "@/utils/fetchGeoData"


export default function Notes() {
  const { notes, filterNotes, notesFiltered } = useNotes()
  const [countries, setCountries] = useState<string[]>([])
  const [selectedFilter, setSelectedFilter] = useState({
    country: '',
    date: ''
  })
  const [charging, setCharging] = useState(false)

  useEffect(() => {
    fillSelectCountries().then(setCountries)
  }, [])

  useEffect(() => {
    const fillFilter = async () => {
      setCharging(true)
      try {
        if (selectedFilter?.country || selectedFilter?.date) {
          await filterNotes({
            ...selectedFilter,
            date: selectedFilter.date ? new Date(selectedFilter.date) : undefined
          })
        }
      } catch (error) {
        console.log(error)
      }
      setCharging(false)
    }
    fillFilter()

  }, [selectedFilter, notes])


  return (
    <>
      <main className="mt-10">
        <div className="bg-amber-400 p-2  rounded-lg shadow-xl flex  m-10 flex-col">
          <label htmlFor="countryFilter" className="font-bold mb-3">Filter By </label>
          <section className="flex gap-2 flex-col sm:flex-row ">
            <div className="flex  ">
              {countries && <select name="countryFilter" value={selectedFilter.country || ""} id="countryFilter" onChange={(e) => { setSelectedFilter({ ...selectedFilter, country: e.target.value }) }} className=" p-2 rounded-md w-full bg-gray-100 ">
                <option disabled value=''>Countrys</option>
                {countries.map((country) => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>}
              {selectedFilter.country && <button className=" font-bold m-2 px-2 rounded-full bg-blur-md bg-red-500 hover:bg-red-700" onClick={() => setSelectedFilter({ ...selectedFilter, country: '' })}>X</button>}

            </div>
            <div className="flex">
              <input value={selectedFilter.date} type="date" name="dateFilter" id="dateFilter" className="p-2 rounded-md w-full  bg-gray-100 " onChange={(e) => setSelectedFilter({ ...selectedFilter, date: e.target.value })} />
              {selectedFilter.date && <button className="font-bold m-2 px-2 rounded-full bg-blur-md bg-red-500 hover:bg-red-700" onClick={() => setSelectedFilter({ ...selectedFilter, date: '' })}>X</button>}
            </div>
          </section>
        </div>
          {selectedFilter.country !== '' || selectedFilter.date !== ''
            ? (notesFiltered && notesFiltered.length > 0
              ? (<Paginator notes={notesFiltered} />) 
              : !charging && <p className="m-10 font-bold">Doesn&apos;t exist notes with this filter</p>)
            : (<Paginator notes={notes} />) }
      </main>
    </>
  )
}



const Paginator = memo(({ notes }: { notes: NoteType[] }) => {
Paginator.displayName = "Paginator";

  function Items({ currentItems } : {currentItems: NoteType[]}) {
    return (
      <>
        {currentItems &&
          currentItems.map((note, index) => (
            <Note key={index} note={note} />
          ))}
      </>
    );
  }

  function PaginatedItems({ itemsPerPage }: {itemsPerPage: number}) {
    const [itemOffset, setItemOffset] = useState(0);

    const endOffset = itemOffset + itemsPerPage;
    const currentItems = notes.slice(itemOffset, endOffset);
    const pageCount = Math.ceil(notes.length / itemsPerPage);

    const handlePageClick = (event: { selected: number }) => {
      const newOffset = (event.selected * itemsPerPage) % notes.length;

      setItemOffset(newOffset)
    }

    return (
      <>
        <section className="grid xl:grid-cols-5 font-bold lg:grid-cols-3 md:grid-cols-2  grid-cols-1 m-10 gap-5 ">
          <Items currentItems={currentItems} /> 
        </section>
        <ReactPaginate
          breakLabel='...'
          nextLabel='next >'
          onPageChange={handlePageClick}
          pageRangeDisplayed={2}
          pageCount={pageCount}
          previousLabel='< previous'
          marginPagesDisplayed={2}
          pageClassName=" p-2 border-2 border-amber-400 hover:scale-105 transition-all ease-in-out duration-200 font-bold"
          pageLinkClassName=" p-2"
          previousClassName="border-2 border-amber-400 p-2 hover:scale-105 transition-all ease-in-out duration-200 font-bold"
          previousLinkClassName=" p-2 "
          nextClassName=" p-2 border-2 border-amber-400 hover:scale-105 transition-all ease-in-out duration-200 font-bold"
          nextLinkClassName=" p-2 "
          breakClassName="bg-blue-200"
          breakLinkClassName=""
          containerClassName="flex justify-center items-center  pb-10 "
          activeClassName="active bg-amber-400"
        />
      </>
    )
  }

  return (
    <>
      <div>
        <PaginatedItems itemsPerPage={15} />
      </div>

    </>)

})
