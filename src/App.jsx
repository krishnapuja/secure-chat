import React from 'react';
import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import ChatScreen from './components/chat_screen';
import Dropdown from 'react-bootstrap/Dropdown';
import users from './global';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [userName, setUserName] = React.useState('')
  const [type, setType] = React.useState('AES')
  const [login, setLogin] = React.useState(false)
  const myStyle = {
    backgroundImage:
      "url('/background.jpg')",
    height: '100vh',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center center'
  };
  const onUserNameSelect = (e) => {
    setUserName(e);
  }

  const onLogin = () => {
    setLogin(true);
  }
  const onCheck = () => {
    if(type === "3DES"){
      setType("AES")
    } else{
      setType("3DES")
    }
  }

  return (
    <div style={myStyle}>
      <div className='p-2'>
        <Navbar className="justify-content-between m-3">
          <Navbar.Brand href="#home" style={{ color: 'white', fontSize: '40px' }} className='mx-3'>Secure Chat</Navbar.Brand>
          <Form inline>
            <Row>
            <Col xs="auto">
            <Form.Label style={{ fontSize: '25px', color: "white" }} >AES</Form.Label>
            </Col>
              <Col xs="auto">
                <Form.Check // prettier-ignore
                  type="switch"
                  id="custom-switch"
                  label="Triple DES"
                  value={type}
                  onChange={onCheck}
                  style={{ fontSize: '25px', color: "white" }} 
                />
              </Col>
              <Col xs="auto">
                <Dropdown className='px-2' onSelect={onUserNameSelect}>
                  <Dropdown.Toggle variant="outline-light" size="lg" style={{ fontWeight: 'bold' }} id="dropdown-basic">
                    {userName ? userName : 'Select the User Name'}
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    {users.map(user =>
                      <Dropdown.Item eventKey={user}>{user}</Dropdown.Item>
                    )}
                  </Dropdown.Menu>
                </Dropdown>
              </Col>
              <Col xs="auto">
                <Button variant="outline-light" size="lg" onClick={onLogin}>LOGIN</Button>
              </Col>
            </Row>
          </Form>
        </Navbar>
      </div>
      {login &&
        <ChatScreen userName={userName} login={login} type={type}/>}
    </div>
  );
}

export default App;
