import React, { Component } from 'react';
import Identicon from 'identicon.js';

import Fab from '@material-ui/core/Fab';
import EditIcon from '@material-ui/icons/Edit';
import HomeIcon from '@material-ui/icons/Home';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';


import { LazyLoadImage } from 'react-lazy-load-image-component';
import LazyLoad from 'react-lazyload';

import 'react-lazy-load-image-component/src/effects/blur.css';
 

import { Button, Modal, Dropdown } from 'react-bootstrap';

import './App.css'
let content
class Main extends Component {

  constructor(props) {
    super(props)
    this.state = {
      show: false,
      showPicModal: false,
      eventKey: 'LATEST',
      userPostState: this.props.userPostState,
      currentAuthor: this.props.account,
      fabVisible: false,
      playVideo: 'false',
      theme: 'white'
    }
  }

  render() {
    const fabStyle = {
      left: 20,
      bottom: 20,
      position: 'fixed'
    };
    const fabStyle2 = {
      left: 20,
      bottom: 90,
      position: 'fixed'
    };
    const fabStyle3 = {
      left: 20,
      bottom: 160,
      position: 'fixed'
    };
    const fabStyle4 = {
      right: 20,
      bottom: 20,
      position: 'fixed'
    };
    const fabStyle5 = {
      right: 20,
      top: 50,
      position: 'fixed'
    };
    const identiconStyle ={
      width: 45,
      height: 45,
      borderRadius: 45 / 2,
      overflow: "hidden",
      borderWidth: 2,
      borderColor: "grey"
    }


    var dropDownOptions = ["LATEST", "EARLIEST", "MOST TIPPED", "LEAST TIPPED"]
    
    const scrollToTop = () => {
      window.scrollTo({
        top: 0, 
        behavior: 'smooth'
      });
    }
    
    content = <div>{this.state.userPostState?
                   <h2><img
                   style={identiconStyle}
                   src={`data:image/png;base64,${new Identicon(this.state.currentAuthor, 30).toString()}`}
                   alt="" />'s Gram</h2>: 
                   <h2>Today's Gram</h2>}</div>
    return (
      
      <div className="container-fluid mt-4_3" style={{background: this.state.theme}}>
        <div>
          <div>
            <Fab style={fabStyle} 
              aria-label="edit"
              onClick={()=>this.setState({show: true})}
              >
              <EditIcon />
            </Fab>
          </div>
          <div>
            <Fab style={fabStyle2} 
              aria-label="home"
              onClick={()=>{
                this.setState({currentAuthor: this.props.account})
                this.setState({userPostState: false})
                this.props.authorPosts("HOME")
              }}
              >
              <HomeIcon />
            </Fab>
          </div>
          <div>
            <Fab style={fabStyle3} 
              aria-label="profile"
              onClick={()=> {
                this.setState({currentAuthor: this.props.account})
                this.setState({userPostState: true})
                this.props.authorPosts(this.props.account)
              }}
              >
              <img
                  style ={identiconStyle}
                  src={`data:image/png;base64,${new Identicon(this.props.account, 30).toString()}`}
                  alt="" />
            </Fab>
          </div>
          <div>
            <Fab style={fabStyle4} 
              aria-label="scrollup"
              size= "small"
              onClick={()=> {
                scrollToTop()
              }}
              >
              <ArrowDropUpIcon/>
            </Fab>
          </div>
          <div>
            <Fab style={Object.assign({}, fabStyle5, {background: this.state.theme, borderColor: "grey"})} 
              aria-label="toggleTheme"
              size= "small"
              onClick={()=> {
                this.state.theme === "white" 
                ? 
                this.setState({theme: 'orange'})
                
                :this.setState({theme: 'white'})
              }}>
            </Fab>
          </div>

          
        </div>
        
        <div>
            <Modal 
              show={this.state.show} 
              onHide={()=>this.setState({show: false})}
              aria-labelledby="contained-modal-title-vcenter"
              centered>
              <Modal.Header closeButton>
                <Modal.Title>Share Content</Modal.Title>
              </Modal.Header>
              <form onSubmit={(event) => {
                  event.preventDefault()
                  const description = this.imageDescription.value
                  this.props.uploadImage(description)
              }}>
                <Modal.Body>
                  <input
                    type="file"
                    accept=".jpg, .jpeg, .png, .bmp, .gif, .mp4, .mkv, .gg .wmv"
                    onChange={this.props.captureFile}/>

                  <div className="form-group mr-sm-2">
                    <br></br>
                    <input
                      id = "imageDescription"
                      type = "text"
                      ref={(input) => {this.imageDescription = input}}
                      className="form-control"
                      placeholder = "Type something?"
                      required />
                  </div>
                </Modal.Body>
                
                <Modal.Footer>
                  <Button variant="secondary" onClick={()=>this.setState({show: false})}>
                    Close
                  </Button>
                  <Button type="submit" variant="primary" onClick={()=>{
                                                                      this.setState({show: false})
                                                                      }}>
                    Post
                  </Button>
                </Modal.Footer>

              </form>
              
              
            </Modal>
        </div>
        <div className="row">
          <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '500px' }}>
            <div className="content mr-auto ml-auto">
              <p>&nbsp;</p>
              
              <div className="d-flex flex-row" style={{justifyContent:"space-between"}}>
                <div className="mt-1">
                  {content}
                  
                </div>
                <div className="d-flex flex-row"> 
                  <div className="mt-3 mr-2"><small className = "text-muted">SORTBY</small></div>
                  <div>
                    
                    <Dropdown>
                      <Dropdown.Toggle variant="secondary" id="dropdown-basic" style={{ width: '140px' }}>
                          {this.state.eventKey}
                      </Dropdown.Toggle>
                      <Dropdown.Menu >
                        {dropDownOptions.map((option) => {
                          return (
                            <Dropdown.Item
                              key = {option}
                              onSelect = {()=> {
                                this.setState({eventKey: option})
                                this.props.sortPosts(option)
                              }}
                              >
                              {option}
                            </Dropdown.Item>
                          )
                        })}
                          
                        
                        {/* <Dropdown.Item href="#/action-1">EARLIEST</Dropdown.Item>
                        <Dropdown.Item href="#/action-1">LATEST</Dropdown.Item>
                        <Dropdown.Item href="#/action-2">MOST TIPPED</Dropdown.Item>
                        <Dropdown.Item href="#/action-3">LEAST TIPPED</Dropdown.Item> */}
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                  
                </div>
              </div>
                        {/* Checkpoint */}
              <div>
                {this.state.contentFormat === "image"
                ? <Modal
                show={this.state.showPicModal}
                onHide={()=>this.setState({showPicModal: false})}
                aria-labelledby="contained-modal-title-vcenter"
                centered>
                  <Modal.Body>
                    <p className="text-center mt-2">
                      <img style={{maxWidth: '450px'}} src={`https://ipfs.infura.io/ipfs/${this.state.imageHash}`}/>
                      
                    </p>
                  </Modal.Body>
                
                </Modal>
                :<p></p>}
              </div>
                {this.props.images.map((image, key) => {
                  return(
                    <div className="card mb-4" key={key}>

                      {/* Uploader */}
                        <div className="card-header" 
                          onMouseOver={(event)=>{event.target.style.cursor = "pointer"}}
                          onClick = {() => {
                            this.setState({ currentAuthor: image.author})
                
                              this.setState({userPostState: true})
                              this.props.authorPosts(image.author)}}
                          >
                          <img
                            className="mr-2"
                            width="30"
                            height="30"
                            src={`data:image/png;base64, ${new Identicon(image.author, 30).toString()}`}
                          />

                          <small className = "text-muted"
                            >{image.author}
                          </small>
                          
                        </div>
                        
                        <ul id="imageList" className="list-group list-group-flush">

                          {/* Show content image or video */}
                          <li className="list-group-item">
                            <div className="pic-hover" onClick={()=>{this.setState({showPicModal: true})
                                                                      this.setState({imageHash: image.hash})
                                                                      this.setState({contentFormat: image.format})
                                                                      }}>
                              <p className="text-center">
                                {/* {image.format === "image"
                                ? <img src={`https://ipfs.infura.io/ipfs/${image.hash}`} style={{maxWidth: '420px'}}/>
                                : 
                                <video 
                                  className="embed-responsive embed-responsive-16by9 ml-1" 
                                  src={`https://ipfs.infura.io/ipfs/${image.hash}`} 
                                  style={{maxWidth: '420px'}}                                  
                                  controls>
                                </video>} */}
                                {image.format === "image"
                                ? <LazyLoadImage style={{maxWidth: '420px'}}  effect="blur" src={`https://ipfs.infura.io/ipfs/${image.hash}`}/>
                                : 
                                <LazyLoad><video 
                                  className="embed-responsive embed-responsive-16by9 ml-1" 
                                  src={`https://ipfs.infura.io/ipfs/${image.hash}`} 
                                  style={{maxWidth: '420px'}}                                  
                                  controls>
                                </video></LazyLoad>}
                              </p>
                            </div>
              
                            <p>{image.description}</p>
                          </li>
                          
                          {/* Tipping */}
                          <li key={key} className="list-group-item py-2">
                            <small className="float-left mt-1 text-muted">
                              TIPS: {window.web3.utils.fromWei(image.tipAmount.toString(), 'ether')} ETH
                            </small>
                            <button
                              className="btn btn-link btn-sm float-right pt-0"
                              name={image.id}
                              onClick={(event) => {
                                let tipAmount = window.web3.utils.toWei('0.1', "ether")
                                console.log(event.target.name, tipAmount)
                                this.props.tipImageOwner(event.target.name, tipAmount)
                              }}>
                              TIP 0.1 ETH
                            </button>
                          </li>

                        </ul>

                    </div>
                  )
                })}

            </div>
          </main>
        </div>
      </div>
    );
  }
}

export default Main;