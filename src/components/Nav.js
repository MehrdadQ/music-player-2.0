import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMusic, faPlus, faSignOutAlt, faSignInAlt } from "@fortawesome/free-solid-svg-icons";
import { Modal, Button, Form, Accordion, ButtonGroup, ToggleButton, Alert } from 'react-bootstrap';
import { db } from "../utils/firebase.js";
import { useState, useEffect } from "react";
import { set, ref, push } from "firebase/database"
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from "firebase/auth";
import { uid } from "uid"
import { SliderPicker } from 'react-color';
import { Portal } from 'react-portal';

const AddModal = ({ show, onHide, currentUser }) => {
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
    push(ref(db, `${currentUser.uid}/songs`), song)
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
      show={show}
      onHide={onHide}
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

const LoginSuccess = ({ show, setShowLoginSuccess }) => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowLoginSuccess(false);
    }, 7000);
    return () => clearTimeout(timeout);
  }, []);

  if (!show) {
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

const NotLoggedInModal = ({ show, onHide, setShowAddModal, setShowLoginModal }) => {
  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <h4>Login required</h4>
      </Modal.Header>
      <Modal.Body>It seems like you're not logged in</Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => {setShowAddModal(false)}}>Cancel
        </Button>
        <Button
          variant="primary"
          onClick={() => {setShowAddModal(false); setShowLoginModal(true)}}>Log in
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

const LoginModal = ({ show, onHide, setCurrentUser, setShowLoginSuccess, setShowLoginModal }) => {
  const [action, setAction] = useState("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [passwordConfirm, setPasswordConfirm] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    setErrorMessage("")
  }, [action])

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
        setCurrentUser(userCredential.user)
        setShowLoginSuccess(true)
        setShowLoginModal(false)
      })
      .catch((error) => {
        if (error.code === 'auth/email-already-in-use') {
          setErrorMessage("The email address you provided is already in use. Please try a different email address.");
        } else if (error.code === 'auth/invalid-email') {
          setErrorMessage("Invalid email address entered.");
        } else if (error.code === 'auth/operation-not-allowed') {
          setErrorMessage("This operation is not allowed. Please contact the site administrator for more information.");
        } else if (error.code === 'auth/weak-password') {
          setErrorMessage("The password you provided is not strong enough. Please choose a stronger password.");
        } else {
          setErrorMessage(error.message);
        }
      });
  }
    
  const handleLogin = () => {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        setCurrentUser(userCredential.user)
        setShowLoginModal(false)
        setShowLoginSuccess(true)
      })
      .catch((error) => {
        if (error.code === "auth/invalid-email") {
          setErrorMessage("Invalid email address entered.")
        } else if (error.code === "auth/user-not-found") {
          setErrorMessage("The email address you entered is not registered. Please check the email address and try again, or sign up for a new account.")
        } else if (error.code === "auth/wrong-password") {
          setErrorMessage("The password you entered is incorrect. Please try again.")
        } else if (error.code === "auth/user-disabled") {
          setErrorMessage("Your account has been disabled. Please contact the site administrator for more information.")
        } else if (error.code === "auth/too-many-requests") {
          setErrorMessage("There have been too many failed login attempts. Please try again later.")
        } else {
          setErrorMessage(error.message)
        }
      });
  }

  const handleResetPassword = () => {
    const auth = getAuth();
    sendPasswordResetEmail(auth, email)
      .then(() => {
        setAction("reset_email_sent")
      })
      .catch((error) => {
        if (error.code === 'auth/invalid-email') {
          setErrorMessage('Invalid email address entered.');
        } else if (error.code === 'auth/user-not-found') {
          setErrorMessage("We could not find an account associated with the email address you provided. Please check that you have entered the correct email address or create a new account.");
        } else if (error.code === 'auth/too-many-requests') {
          setErrorMessage("Too many requests, please try again later.");
        } else {
          setErrorMessage('An unexpected error occurred. Please try again later.');
        }
      });
  }

  const handleCloseModal = () => {
    onHide();
    setTimeout(() => {
      setAction("login");
    }, 300);
  }
  
  if (action === "reset_password") {
    return (
      <Modal
        show={show}
        onHide={handleCloseModal}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Reset Password
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            {errorMessage !== "" ?
            <>
              <Alert variant="danger" className="mt-3">{errorMessage}</Alert>
            </> : <></>
            }
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={onHide}>Close</Button>
          <Button onClick={() => handleResetPassword()}>Reset Password</Button>
        </Modal.Footer>
      </Modal>
    )
  } else if (action === "reset_email_sent") {
    return (
      <Modal
        show={show} 
        onHide={handleCloseModal}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Password reset email sent</Modal.Title>
        </Modal.Header>
        <Modal.Body>A request to reset your password has been sent to your email address.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }

  return (
    action !== "reset_password" ?
    <Modal
      show={show}
      onHide={onHide}
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
          <p
            className="text-primary font-weight-bold text-sm float-end" 
            variant="secondary"
            onClick={() => {setAction("reset_password")}}
            style={{cursor:"pointer"}}
          >
            Forgot your password?
          </p>
        </Form>


        {errorMessage !== "" ?
        <>
          <Alert variant="danger" className="mt-3">{errorMessage}</Alert>
        </> : <></>
        }


        {action === "signup" && password.length < 6 && password !== "" ?
          <>
            <Alert variant="danger" className="mt-3">Password should be at least 6 characters</Alert>
          </> : action === "signup" && password !== passwordConfirm && passwordConfirm !== "" ? <>
            <Alert variant="danger" className="mt-3">Passwords do not match</Alert>
          </> : <></>
        }
      </Modal.Body>
      <Modal.Footer className="ps-5 pe-5">
        <Button
          className="w-100"
          disabled={action === "signup" && (password !== passwordConfirm || password.length < 6)}
          onClick={action === "signup" ? ()=>{handleSignUp()} : ()=>{handleLogin()}}
        >
          {action === "login" ? `Log in` : `Sign up`}
        </Button>
      </Modal.Footer>
    </Modal> :
    <></>
  );
}

const Nav = React.memo(({ libraryStatus, setLibraryStatus, currentUser, setCurrentUser }) => {
  const [showAddModal, setShowAddModal] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [showLoginSuccess, setShowLoginSuccess] = useState(false)

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

  return (
    <>
      <nav>
        {currentUser === null ? 
          <button onClick={() => setShowLoginModal(true)}>
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
        setShowLoginSuccess={setShowLoginSuccess}
      />

      {currentUser ? 
        <AddModal
          show={showAddModal}
          onHide={() => setShowAddModal(false)}
          currentUser={currentUser}
        /> : 
        <NotLoggedInModal
          show={showAddModal}
          onHide={() => setShowAddModal(false)}
          setShowLoginModal={setShowLoginModal}
          setShowAddModal={setShowAddModal}
        />
      }

      <LoginModal
        show={showLoginModal}
        onHide={() => setShowLoginModal(false)}
        setCurrentUser={setCurrentUser}
        setShowLoginSuccess={setShowLoginSuccess}
        setShowLoginModal={setShowLoginModal}
      />

      <LogoutModal
        show={showLogoutModal}
        onHide={() => setShowLogoutModal(false)}
      />
    </>
  );
});

export default Nav;
