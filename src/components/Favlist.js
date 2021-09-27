import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { withAuth0 } from '@auth0/auth0-react';
import { Card, Button } from 'react-bootstrap';
import Modalform from './Modalform';

export class Favlist extends Component {
  constructor() {
    super();
    this.state = {
      flowerArray: [],
      isShow : false ,
      id: 0,
      item: []
    }
  }
  componentDidMount = async () => {
    const { isAuthenticated } = this.props.auth0;
    let email = this.props.auth0.user.email
    if (isAuthenticated) {
      await axios
        .get(`${process.env.REACT_APP_URL}/favlist/${email}`)
        .then(result => {
          this.setState({
            flowerArray: result.data.flowers
          })
        })
    }
  }

  deletefav=(idx)=>{
    let id=idx 
    let email = this.props.auth0.user.email
axios.delete(`${process.env.REACT_APP_URL}/delete/${email}/${id}`)
.then(res=>{
  alert('done');
  this.componentDidMount();
  this.forceUpdate()
})
  }


showmodal=(idx)=>{
  this.setState({
    isShow:true ,
    id : idx ,
    item:this.state.flowerArray[idx]
  })
}

closehandle=()=>{
  this.setState({
    isShow:false
  })
}



updatehandle=(e)=>{
  e.preventDefault();
let id = this.state.id ;
let data={
  name : e.target.name.value ,
  photo : e.target.photo.value
}
axios.put(`${process.env.REACT_APP_URL}/update/${id}` , data)
.then(res=>{
  this.setState({
    flowerArray : res.data.flowers
  })
  this.componentDidMount();
  this.forceUpdate();
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

                    <Button variant="danger" onClick={() => this.deletefav(idx)}>delete</Button>
                    <Button variant="primary" onClick={() => this.showmodal(idx)}>edit</Button>
                  </Card.Body>
                </Card>
              </>
            )
          })}
        </div>

        <div>
          {this.state.isShow && 
          <Modalform 
        show={this.state.isShow}
      hide={this.closehandle}
    item={this.state.item}
  update={this.updatehandle}
/>}
        </div>
      </>
    )
  }
}

export default withAuth0(Favlist)
