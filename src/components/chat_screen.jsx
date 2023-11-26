import React from 'react';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import users, { messages } from '../global';

function ChatScreen({ login, userName, type }) {
    const [messagesList, setMessagesList] = React.useState(messages);
    const [newMessage, setNewMessage] = React.useState('');
    const [newKey, setNewKey] = React.useState('');
    const [newDecryptKey, setNewDecryptKey] = React.useState('');
    const [showModal, setShowModal] = React.useState(false);
    const [decryptAction, setDecryptAction] = React.useState('');
    const [recievedMessages, setRecievedMessages] = React.useState([]);
    const [sentMessages, setSentMessages] = React.useState([]);

    const encryptedData = async (key, message) => {
        const response = await fetch('http://localhost:5000/api/encryptmessage', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ type: type, key: key, text: message }),
        });
        
        const result = await response.json();
        return result.message
      };

      const decryptedData = async (key, message) => {
        const response = await fetch('http://localhost:5000/api/decryptmessage', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ type: type, key: key, text: message }),
        });
        
        const result = await response.json();
        return result.message
      };
    const sendMessageClick = async(e, user) => {
        //const encm = encrypt(newKey, newMessage);
        const startTime = performance.now();
        const encm = await encryptedData(newKey, newMessage);
        const mess = {
            message: encm,
            sender: userName,
            reciever: user
        };
        const mlist = [...sentMessages, mess];
        setSentMessages(mlist);
        setMessagesList([...messagesList, mlist]);
        const endTime = performance.now();
        const elapsedTime = endTime - startTime;
        console.log(`Encryption Time taken: ${elapsedTime} milliseconds`);
    };
    const handleClose = () => {
        setShowModal(false);
    }
    const onDecrypt = (e, action) => {
        setShowModal(true);
        setDecryptAction(action);
    }
    const onDecryptMessages = async() => {
        const startTime = performance.now();
        if (decryptAction === 'r') {
            const rm = await recievedMessages.map(async(message) => {
                //const dm = decrypt(newDecryptKey, message.message)
                const dm = await decryptedData(newDecryptKey, message.message);
                console.log(dm)
                message.decryptedMessage = dm;
                return message;
            })
            setRecievedMessages(rm);
        } else if (decryptAction === 's') {
            const sm = await  Promise.all(sentMessages.map(async(message) => {
                console.log(message.message, newDecryptKey)
                //const dm = decrypt(newDecryptKey, message.message)
                const dm = await decryptedData(newDecryptKey, message.message);
                message.decryptedMessage = dm;
                return message;
            }))
            const endTime = performance.now();
            const elapsedTime = endTime - startTime;
            console.log(`Decryption Time taken: ${elapsedTime} milliseconds`);
            setSentMessages(sm);
        }
        setShowModal(false);
    };

    const onNavSelect = (e) => {
        const recieved = messagesList.filter(message => message.reciever === userName && message.sender === e);
        setRecievedMessages(recieved);
        const sent = messagesList.filter(message => message.sender === userName && message.reciever === e);
        setSentMessages(sent);
    }
    return (
        <>
            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Enter Key to Decrypt</Modal.Title>
                </Modal.Header>
                <Modal.Body> <Form.Control
                    placeholder="Enter Key to Decrypt"
                    aria-label="message"
                    aria-describedby="basic-addon3"
                    value={newDecryptKey}
                    onChange={e => setNewDecryptKey(e.target.value)}
                /></Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={onDecryptMessages}>
                        Decrypt Messages
                    </Button>
                </Modal.Footer>
            </Modal>
            <Tab.Container onSelect={onNavSelect}>
                <Row className='m-1' style={{ height: '80%' }}>
                    <Col sm={4}>
                        <Nav variant="pills" className="flex-column">
                            {users.map(user => user !== userName &&
                                <Nav.Item>
                                    <Nav.Link eventKey={`${user}`} style={{ color: 'white', fontSize: '25px' }}>{user}</Nav.Link>
                                </Nav.Item>
                            )}
                        </Nav>
                    </Col>
                    <Col sm={8}>
                        <Tab.Content style={{ height: '100%' }}>
                            {users.map(user =>
                                <Tab.Pane eventKey={`${user}`} style={{ height: '100%' }}>
                                    <Card style={{ height: '100%' }}>
                                        <Card.Body style={{ display: 'flex', flexDirection: 'column'}}>
                                            {/* <Card.Title>Messages from {user}</Card.Title> */}

                                            <Card.Header style={{ color: '#0d6efd', fontSize: '20px' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center' }}>Messages Recieved</div>
                                                    <Button className="m-2" variant="outline-primary" onClick={e => onDecrypt(e, 'r')}>Decrypt</Button>
                                                </div>
                                            </Card.Header>
                                            {recievedMessages.length > 0 ? recievedMessages.map(message =>
                                                <Card.Text className='m-3'>{message.decryptedMessage ? message.decryptedMessage : message.message} </Card.Text>
                                            ) : <Card.Text className='m-3'>No Messages</Card.Text>}
                                            <Card.Header style={{ color: '#0d6efd', fontSize: '20px' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center' }}>Messages Sent by You</div>
                                                    <Button className="m-2" variant="outline-primary" onClick={e => onDecrypt(e, 's')}>Decrypt</Button>
                                                </div>
                                            </Card.Header>
                                            {sentMessages.length > 0 ? sentMessages.map(message =>
                                                <Card.Text className='m-3'>{message.decryptedMessage ? message.decryptedMessage : message.message} </Card.Text>
                                            ) : <Card.Text className='m-3'>No Messages</Card.Text>}
                                            <div style={{ display: 'flex', marginTop: 'auto', alignItems: 'flex-end' }}>
                                                <div className='nav-container-user' style={{width: '100%'}}>
                                                    <Form.Control
                                                        placeholder="Enter Message"
                                                        aria-label="message"
                                                        aria-describedby="basic-addon1"
                                                        className='mx-1'
                                                        value={newMessage}
                                                        onChange={e => setNewMessage(e.target.value)}
                                                    />
                                                    <Form.Control
                                                        placeholder="Enter Key"
                                                        aria-label="key"
                                                        aria-describedby="basic-addon2"
                                                        className='mx-1'
                                                        value={newKey}
                                                        onChange={e => setNewKey(e.target.value)}
                                                    />
                                                    <Button variant="primary" className='mx-1' onClick={e => sendMessageClick(e, user)}>Send Message</Button>
                                                </div>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Tab.Pane>
                            )}
                        </Tab.Content>
                    </Col>
                </Row>
            </Tab.Container>
        </>
    );
}

export default ChatScreen;
