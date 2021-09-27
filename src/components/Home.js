import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { withAuth0 } from '@auth0/auth0-react';
import { Card, Button } from 'react-bootstrap'


class Home extends React.Component {
  constructor() {
    super();
    this.state = {
      flowerArray: []
    }
  }
  componentDidMount = () => {
    const { isAuthenticated } = this.props.auth0;
    if (isAuthenticated) {
      axios.get(`${process.env.REACT_APP_URL}/flower`)
        .then(result => {
          this.setState({
            flowerArray: result.data.flowerslist
          })
        })
    }
  }

  addtofav=(idx)=>{
    let {name , photo} = this.state.flowerArray[idx];
    
    let email = this.props.auth0.user.email

    axios.post(`${process.env.REACT_APP_URL}/favlist/${email}` , {name:name , photo : photo})
    .then(result=>{
      alert('done');
      this.componentDidMount();
      this.forceUpdate()
    })
  }
  render() {
    return (
      <>
        <div>
          {this.state.flowerArray.map((item, idx) => {
            return (
              <>
                <Card style={{ width: '18rem' }}>
                  <Card.Img variant="top" src={item.photo} />
                  <Card.Body>
                    <Card.Title>{item.name}</Card.Title>
                   
                    <Button variant="primary" onClick={()=>this.addtofav(idx)}>favorite ❤</Button>
                  </Card.Body>
                </Card>
              </>
            )
          })}
        </div>
      </>
    )
  }
}

export default withAuth0(Home);
