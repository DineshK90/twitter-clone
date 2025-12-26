import axios from "axios";
import { useState } from "react";
import {Button, Form, Modal} from 'react-bootstrap'
import { jwtDecode } from "jwt-decode";

export default function NewPostModal({show, handleClose}){
    const [postContent, setPostContent]= useState('')

    const handleSave = () =>{
        const token = localStorage.getItem('authToken')

        const decode = jwtDecode(token)
        const userId = decode.id
        const data = {
            title: 'Post Title',
            content: postContent,
            user_id: userId,
        }
        axios
        .post('https://f53b4046-5164-4ce1-a0dd-d5bf3beb1799-00-1nvu78jv81s33.janeway.replit.dev/posts', data)
        .then((response)=>{
            console.log('Success:', response.data)
            handleClose()
        })
        .catch((error)=>{
            console.error('Error', error)
        })
    }

return(
    <>
    <Modal show={show} onHide={handleClose}>
    <Modal.Header closeButton></Modal.Header>
    <Modal.Body>
        <Form>
            <Form.Group controlId ='pstContent'>
                <Form.Control placeholder="What is happening?!" as='textarea' rows={3}
                onChange={(e) => setPostContent(e.target.value)}/>
            </Form.Group>
        </Form>
    </Modal.Body>
    <Modal.Footer>
        <Button variant="primary"
        className="rounded-pill"
        onClick={handleSave}>Tweet</Button>
    </Modal.Footer>
    </Modal>
    </>
)
}