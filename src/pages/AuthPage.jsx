import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth'

import { Button, Col, Row, Image, Modal, Form } from 'react-bootstrap'
import { useState, useEffect, useContext } from 'react'
import useLocalStorage from 'use-local-storage'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../components/AuthProvider'

export default function AuthPage() {
  const loginImage = 'https://sig1.co/img-twitter-1'
  const [modalShow, setModalShow] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [authToken, setAuthToken] = useLocalStorage('authToken', '')
  const navigate = useNavigate()

  const auth = getAuth()
  const provider = new GoogleAuthProvider()
  const { currentUser } = useContext(AuthContext)

  useEffect(() => {
    if (currentUser) navigate('/profile')
  }, [currentUser, navigate])

  const handleShowSignUp = () => setModalShow('SignUp')
  const handleShowLogin = () => setModalShow('Login')
  const handleClose = () => setModalShow(null)

  const handleSignUp = async (e) => {
    e.preventDefault()
    try {
      await createUserWithEmailAndPassword(auth, username, password)
    } catch (error) {
      console.error(error)
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      await signInWithEmailAndPassword(auth, username, password)
    } catch (error) {
      console.error(error)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, provider)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Row>
      <Col sm={6}>
        <Image src={loginImage} fluid />
      </Col>

      <Col sm={6} className="p-4">
        <i className="bi bi-twitter" style={{ fontSize: 50, color: 'dodgerblue' }}></i>
        <p className="mt-5" style={{ fontSize: 64 }}>Happening Now</p>
        <h2 className="my-5" style={{ fontSize: 31 }}>Join Twitter Now</h2>

        <Col sm={5} className="d-grid gap-2">
          <Button
            className="rounded-pill"
            variant="outline-dark"
            onClick={handleGoogleSignIn}
          >
            <i className="bi bi-google"></i> Sign up with Google
          </Button>

          <Button className="rounded-pill" variant="outline-dark">
            <i className="bi bi-apple"></i> Sign up with Apple
          </Button>

          <Button className="rounded-pill" variant="outline-dark">
            <i className="bi bi-facebook"></i> Sign up with Facebook
          </Button>

          <p style={{ textAlign: 'center' }}>or</p>

          <Button className="rounded-pill" onClick={handleShowSignUp}>
            Create an account
          </Button>

          <p style={{ fontSize: '12px' }}>
            By signing up, you agree to the Terms of Service and Privacy Policy including Cookie Use
          </p>

          <p className="mt-5" style={{ fontWeight: 'bold' }}>
            Already have an account?
          </p>

          <Button
            className="rounded-pill"
            variant="outline-primary"
            onClick={handleShowLogin}
          >
            Sign In
          </Button>
        </Col>

        <Modal show={modalShow !== null} onHide={handleClose} centered>
          <Modal.Body className="d-grid gap-2 px-5">
            <h2 className="mb-4" style={{ fontWeight: 'bold' }}>
              {modalShow === 'SignUp'
                ? 'Create your account'
                : 'Log in to your account'}
            </h2>

            <Form
              className="d-grid gap-2 px-5"
              onSubmit={modalShow === 'SignUp' ? handleSignUp : handleLogin}
            >
              <Form.Group className="mb-3">
                <Form.Control
                  type="email"
                  placeholder="Enter username"
                  onChange={(e) => setUsername(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Control
                  type="password"
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>

              <p style={{ fontSize: '12px' }}>
                By signing up, you agree to the Terms of Service and Privacy Policy, including Cookie Use.
              </p>

              <Button className="rounded-pill" type="submit">
                {modalShow === 'SignUp' ? 'Sign up' : 'Log in'}
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </Col>
    </Row>
  )
}
