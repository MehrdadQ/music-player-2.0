import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMusic, faPlus } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { Modal, Button, Form, Accordion } from 'react-bootstrap';
import {db} from "../utils/firebase.js";
import { useState } from "react";
import { set, ref } from "firebase/database"
import {uid} from "uid"
import { SliderPicker } from 'react-color';

const AddModal = (props) => {
  const [title, setTitle] = useState("")
  const [artist, setArtist] = useState("")
  const [cover, setCover] = useState("")
  const [audio, setAudio] = useState("")
  const [playerBackgroundColor, setPlayerBackgroundColor] = useState("white")
  const [color2, setColor2] = useState("black")
  const [color3, setColor3] = useState("lightgray")
  const [selectColors, setSelectColors] = useState(false)

  const handleAdd = () => {
    const uuid = uid()
    const colors = [playerBackgroundColor, color2, color3]
    const song = {
      title,
      artist,
      cover,
      audio,
      id: uuid,
      colors
    }
    set(ref(db, uuid), song)
    setTitle("")
    setArtist("")
    setCover("")
    setAudio("")
    setPlayerBackgroundColor("rgb(255, 255, 255)")
    setColor2("rgb(0, 0, 0)")
    setColor3("rgb(255, 255, 255)")
  }

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Add new song
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Song title</Form.Label>
            <Form.Control type="text" value={title} 
            onChange={(e) => setTitle(e.target.value)}/>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Artist</Form.Label>
            <Form.Control type="text" value={artist} 
            onChange={(e) => setArtist(e.target.value)}/>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Cover photo link</Form.Label>
            <Form.Control type="text" value={cover} 
            onChange={(e) => setCover(e.target.value)}/>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Audio link</Form.Label>
            <Form.Control type="text"  value={audio} 
            onChange={(e) => setAudio(e.target.value)}/>
          </Form.Group>

          <Accordion defaultActiveKey="0">
            <Accordion.Item>
              <Accordion.Header>Customize Colors</Accordion.Header>
              <Accordion.Body>
                <Form.Group className="flex mb-3">
                  <Form.Label>Player Background Color</Form.Label>
                  <SliderPicker
                    color={playerBackgroundColor}
                    onChangeComplete={(e) => setPlayerBackgroundColor(e.hex)}
                  />
                </Form.Group>
                <Form.Group className="flex mb-3">
                  <Form.Label>Tracker Color</Form.Label>
                  <SliderPicker
                    color={color2}
                    onChangeComplete={(e) => setColor2(e.hex)}
                  />
                </Form.Group>
                <Form.Group className="flex mb-3">
                  <Form.Label>Library Background Color</Form.Label>
                  <SliderPicker
                    color={color3}
                    onChangeComplete={(e) => setColor3(e.hex)}
                  />
                </Form.Group>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
          {/* <Form.Group className="mb-3">
            <Form.Label>Player Background Color</Form.Label>
            <Form.Control type="text"  value={playerBackgroundColor} 
            onChange={(e) => setPlayerBackgroundColor(e.target.value)}/>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Tracker Color</Form.Label>
            <Form.Control type="text"  value={color2} 
            onChange={(e) => setColor2(e.target.value)}/>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Library Background Color</Form.Label>
            <Form.Control type="text"  value={color3} 
            onChange={(e) => setColor3(e.target.value)}/>
          </Form.Group> */}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => handleAdd()}>Add</Button>
      </Modal.Footer>
    </Modal>
  );
}

const Nav = ({ libraryStatus, setLibraryStatus }) => {
  const [show, setShow] = useState(false)

  return (
    <>
      <nav>
        <a href="https://github.com/MehrdadQ/music-player-2.0" target="blank">
          <FontAwesomeIcon icon={faGithub} size={"2x"} />
        </a>
        <button onClick={() => setLibraryStatus(!libraryStatus)}>
          <FontAwesomeIcon icon={faMusic} size={"2x"} />
        </button>
        <button onClick={() => setShow(!show)}>
          <FontAwesomeIcon icon={faPlus} size={"2x"} />
        </button>
      </nav>

      <AddModal
        show={show}
        onHide={() => setShow(false)}
      />
    </>
  );
};

export default Nav;
