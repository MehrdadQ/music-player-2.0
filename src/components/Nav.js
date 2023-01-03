import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMusic, faPlus, faSignOutAlt, faSignInAlt } from "@fortawesome/free-solid-svg-icons";
import { Modal, Button, Form, Accordion, ButtonGroup, ToggleButton, Alert } from 'react-bootstrap';
import { db } from "../utils/firebase.js";
import { useState, useEffect } from "react";
import { set, ref } from "firebase/database"
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { uid } from "uid"
import { SliderPicker } from 'react-color';
import { Portal } from 'react-portal';

const AddModal = (props) => {
  const [title, setTitle] = useState("")
  const [artist, setArtist] = useState("")
  const [cover, setCover] = useState("")
  const [audio, setAudio] = useState("")
  const [playerBackgroundColor, setPlayerBackgroundColor] = useState("white")
  const [trackerColor, setTrackerColor] = useState("black")
  const [libraryBackgroundColor, setLibraryBackgroundColor] = useState("lightgray")

  const handleAdd = () => {
    const uuid = uid()
    const colors = [playerBackgroundColor, trackerColor, libraryBackgroundColor]
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
    setTrackerColor("rgb(0, 0, 0)")
    setLibraryBackgroundColor("rgb(255, 255, 255)")
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
                    color={trackerColor}
                    onChangeComplete={(e) => setTrackerColor(e.hex)}
                  />
                </Form.Group>
                <Form.Group className="flex mb-3">
                  <Form.Label>Library Background Color</Form.Label>
                  <SliderPicker
                    color={libraryBackgroundColor}
                    onChangeComplete={(e) => setLibraryBackgroundColor(e.hex)}
                  />
                </Form.Group>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => handleAdd()}>Add</Button>
      </Modal.Footer>
    </Modal>
  );
}


const Nav = ({ libraryStatus, setLibraryStatus, currentUser, setCurrentUser }) => {
  console.log(currentUser)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [showLoginSuccess, setShowLoginSuccess] = useState(false)

  const LoginModal = (props) => {
    const [action, setAction] = useState("login")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [passwordConfirm, setPasswordConfirm] = useState("")
  
    const handleChangeAction = (userAction) => {
      setEmail("")
      setPassword("")
      setPasswordConfirm("")
      setAction(userAction)
    }
  
    const handleSignUp = () => {
      const auth = getAuth();
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in 
          setCurrentUser(userCredential.user)
          setShowLoginSuccess(true)
        })
        .catch((error) => {
          console.log(error.message)
          // ..
        });
      }
      
    const handleLogin = () => {
      const auth = getAuth();
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in 
          const user = userCredential.user;
          setShowLoginModal(false)
          setShowLoginSuccess(true)
        })
        .catch((error) => {
          console.log(error.message)
        });
    }
  
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header className="ps-5" closeButton>
          <ButtonGroup type="radio" name="options" defaultValue={1}>
            <ToggleButton
              className="shadow-none"
              type="checkbox"
              variant="outline-primary"
              checked={action === "login"}
              onClick={() => handleChangeAction("login")}
            >
              Log in
            </ToggleButton>
            <ToggleButton
              className="shadow-none"
              type="checkbox"
              variant="outline-primary"
              checked={action === "signup"}
              onClick={() => handleChangeAction("signup")}
            >
              Sign Up
            </ToggleButton>
          </ButtonGroup>
        </Modal.Header>
        <Modal.Body className="p-5">
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            {action === "signup" ?
            <>
              <Form.Group>
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Confirm password"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                />
              </Form.Group>
            </> : <></>}
          </Form>

          {action === "signup" && password.length < 6 && password !== "" ?
          <>
            <Alert variant="danger" className="mt-3">Password should be at least 6 characters</Alert>
          </> : action === "signup" && password !== passwordConfirm && passwordConfirm !== "" ? <>
            <Alert variant="danger" className="mt-3">Passwords do not match</Alert>
          </> : <></>}
        </Modal.Body>
        <Modal.Footer>
          <Button
            disabled={action === "signup" && (password !== passwordConfirm || password.length < 6)}
            onClick={action === "signup" ? ()=>{handleSignUp()} : ()=>{handleLogin()}}
          >
            {action === "login" ? `Log in` : `Sign up`}
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  const LogoutModal = () => {
    const handleSignOut = () => {
      const auth = getAuth()
      signOut(auth)
      window.location.reload();
    }

    return <Modal show={showLogoutModal} onHide={() => setShowLogoutModal(false)}>
    <Modal.Header closeButton>
      <Modal.Title>Sign Out</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      Are you sure you want to sign out?
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={() => setShowLogoutModal(false)}>
        Cancel
      </Button>
      <Button variant="danger" onClick={handleSignOut}>
        Sign Out
      </Button>
    </Modal.Footer>
  </Modal>
  }

  const LoginSuccess = () => {
    useEffect(() => {
      const timeout = setTimeout(() => {
        setShowLoginSuccess(false);
      }, 7000);
      return () => clearTimeout(timeout);
    }, []);
  
    if (!showLoginSuccess) {
      return null;
    }
  
    return (
      <Portal>
        <div className="wrapper">
          <div className="alert alert-success success-box" role="alert">
            Successfully logged in!
          </div>
        </div>
      </Portal>
    );
  }

  return (
    <>
      <nav>
        {currentUser === null ? 
          <button onClick={() => setShowLoginModal(!showLoginModal)}>
            <FontAwesomeIcon icon={faSignInAlt} size={"2x"} />
          </button> : <button onClick={() => setShowLogoutModal(!showLogoutModal)}>
            <FontAwesomeIcon icon={faSignOutAlt} size={"2x"} />
          </button>
        }
        <button onClick={() => setLibraryStatus(!libraryStatus)}>
          <FontAwesomeIcon icon={faMusic} size={"2x"} />
        </button>
        <button onClick={() => setShowAddModal(!showAddModal)}>
          <FontAwesomeIcon icon={faPlus} size={"2x"} />
        </button>
      </nav>

      <LoginSuccess
        show={showLoginSuccess}
        onHide={() => setShowLoginSuccess(false)}
      />

      <AddModal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
      />

      <LoginModal
        show={showLoginModal}
        onHide={() => setShowLoginModal(false)}
      />

      <LogoutModal
        show={showLogoutModal}
        onHide={() => setShowLogoutModal(false)}
      />
    </>
  );
};

export default Nav;
