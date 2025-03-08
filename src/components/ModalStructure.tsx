'use client'

import Modal from "react-modal";
import { ChromePicker } from "react-color";
import { Feature, Polygon, MultiPolygon } from "geojson";
import styled from 'styled-components';
import { useState, useEffect } from "react"
import L from "leaflet"
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import NoteModal from "./NoteModal";
import "leaflet/dist/leaflet.css";
import Alert from "./Alert";


interface ModalStructureProps {
  modalIsOpen: boolean,
  setModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
  countryName: string,
  countryCode: string,
  selectedContry: Feature<MultiPolygon, { ADMIN: string; ISO_A2: string; ISO_A3: string }>,
  selectedColor: string,
  setSelectedColor: React.Dispatch<React.SetStateAction<string>>,
  onAccept: (color: string) => void,
  onDelete: () => void
}


const ModalStructure: React.FC<ModalStructureProps> = ({ modalIsOpen, setModalIsOpen, countryName, countryCode, selectedContry, selectedColor, setSelectedColor, onAccept, onDelete }) => {
  const [color, setColor] = useState('#fff')
  const [isModalClosing, setIsModalClosing] = useState(false);
  const [alert, setAlert] = useState<{ msg: string | null, error: boolean }>({ msg: null, error: false })

  const handleCloseModal = () => {
    setIsModalClosing(true);
    setModalIsOpen(false);
  };

  const handleChange = (color: { hex: string }) => {
    setColor(color.hex)
    setSelectedColor(color.hex)
  }

  useEffect(() => {
    if (!modalIsOpen) {
      const timeout = setTimeout(() => {
        setIsModalClosing(false);
      }, 500);

      return () => clearTimeout(timeout);
    }
  }, [modalIsOpen]);

  const CenterMap: React.FC<{ selectedCountry: Feature<Polygon | MultiPolygon> }> = ({ selectedCountry }) => {
    const map = useMap();
    useEffect(() => {
      if (selectedCountry) {
        const geoJsonLayer = L.geoJSON(selectedCountry);
        const bounds = geoJsonLayer.getBounds();
        map.fitBounds(bounds);
      }
    }, [selectedContry, map]);
    return null;
  };
  const { msg } = alert

  return (
    <>

      <Modal
        isOpen={modalIsOpen && !isModalClosing}
        onRequestClose={handleCloseModal}
        contentLabel="Paleta de Colores"
        shouldCloseOnOverlayClick={false}
        className={''}
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: '9999'
          },
          content: {
            height: "fit-content",
            maxWidth: "700px",
            margin: 'auto',
            padding: '10px',
            backgroundColor: " rgb(255, 250, 250)",
            borderRadius: "10px",
            border: "1px solid rgb(206, 206, 206)",
            fontFamily: "Arial, Helvetica, sans-serif",
            boxShadow: "0px 10px 10px rgba(0, 0, 0, 0.066)"

          }
        }}
      >
        {msg && <Alert alert={alert} />}
        <div className="overflow-y-auto sm:max-h-[50rem] max-h-[30rem] p-4 [direction:rtl]">
          <StyledWrapper>
            <div className="absolute right-0 mr-2 top-2 [direction:ltr]">
              <button className="exit-button flex " onClick={handleCloseModal}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 162 162" className="svgIconCross">
                  <path strokeLinecap="round" strokeWidth={17} stroke="black" d="M9.01074 8.98926L153.021 153" />
                  <path strokeLinecap="round" strokeWidth={17} stroke="black" d="M9.01074 153L153.021 8.98926" />
                </svg>
              </button>
            </div>
            <div className="[direction:ltr] flex md:flex-row flex-col gap-5 px-4 w-auto justify-center items-center ">
              <div className="sm:w-1/2 w-full">
                <h1 className="text-center font-bold text-xl">{countryName}</h1>
                <MapContainer className="" center={[34, 66]} zoom={5} style={{ height: "300px", width: "100%" }} >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  {<GeoJSON data={selectedContry} />}
                  {<CenterMap selectedCountry={selectedContry} />}
                </MapContainer>
              </div>
              <div className="w-1/2 flex flex-col items-center justify-center ">
                <p className="cookie-heading text-center">Select Color</p>
                <p className="cookie-para text-center">
                  Select your favorite color to fill the contry
                </p>
                <ChromePicker color={color} onChange={handleChange} />

                <div className="button-wrapper mt-5 flex flex-col md:flex-row">
                  <button className="reject cookie-button w-full md:w-1/2 " onClick={() => {
                    onDelete()
                    setAlert({
                      msg: 'Color erased successfully',
                      error: false
                    })
                  }}>Delete Color</button>
                  <button className="accept cookie-button w-full md:w-1/2" onClick={() => {
                    onAccept(selectedColor)
                    setAlert({
                      msg: 'Color added successfully',
                      error: false
                    })
                  }} >Add Color</button>
                </div>
              </div>
            </div>
            <div className="[direction:ltr]">
              <NoteModal countryCode={countryCode} countryName={countryName} />
            </div>

          </StyledWrapper>
        </div>
      </Modal >
    </>
  )
}
const StyledWrapper = styled.div`
  
  .cookie-heading {
    color: rgb(34, 34, 34);
    font-weight: 800;
  }
  .cookie-para {
    font-size: 11px;
    font-weight: 400;
    color: rgb(51, 51, 51);
  }
  .button-wrapper {
    width: 100%;
    height: auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
  }
  .cookie-button {
    padding: 8px 0;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  .accept {
    background-color: rgb(34, 34, 34);
    color: white;
  }
  .reject {
    background-color: #ececec;
    color: rgb(34, 34, 34);
  }
  .accept:hover {
    background-color:  #FFC000;
;
  }
  .reject:hover {
    background-color: #ddd;
  }
  .exit-button {
   
    top: 0px;
    right: 0px;
    width: 20px;
    height: 20px;
    display: fixed;
    align-items: center;
    justify-content: center;
    background-color: transparent;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  .exit-button:hover {
    background-color: #ddd;
    color: white;
  }
  .svgIconCross {
    height: 10px;
  }`;

export default ModalStructure
