import React, { Component } from 'react';
import Web3 from 'web3';
import Identicon from 'identicon.js';
import './App.css';
import MetaGram from '../abis/Metagram.json'
import Navbar from './Navbar'
import Main from './Main'

import detectEthereumProvider from '@metamask/detect-provider'

const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({host: 'ipfs.infura.io', port: 5001, protocol: 'https'})

let metaGram

class App extends Component {
  async componentWillMount(){
    // Connect automatically if MetaMask exists (and connected) and an account is already logged in 
    const provider = await detectEthereumProvider()
    if(provider){
      window.ethereum.sendAsync({
        method: "eth_accounts",
        params: [],
        jsonrpc: "2.0",
        id: new Date().getTime()
        } , async (error, result) =>{
            console.log(result);
            if (result["result"]!="") {
              await this.loadWeb3();
              await this.loadBlockchainData();//addresses found. result["result"] contains wallet address
            }else {console.log("MetaMask account may not be connected");}//found not address, which mean this wallet is not logged in
        });
    }
  }
  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    } else {
      window.alert("Non-Ethereum browser detected. Try using MetaMask.")
    }
    
  }

  async loadBlockchainData(){
    const web3 = window.web3
    // try{
    //   const accounts = await web3.eth.getAccounts()
    // }catch(e){
    //   console.log("Loading error")
    // }
    const accounts = await web3.eth.getAccounts()

    
    this.setState({ account: accounts[0] })

    console.log("Account:", this.state.account)

    // Load Token contract //
    const networkId = await web3.eth.net.getId()
    // const address = MetaGram.networks['5777'].address
    const metaData = MetaGram.networks[networkId]

    if (metaData) {
      metaGram = new web3.eth.Contract(MetaGram.abi, metaData.address)
      this.setState({ metaGram })
      
      const imageCount = await metaGram.methods.imageCount().call()
      this.setState({imageCount})

      for( var i = 1; i<= imageCount; i++){
        const image = await metaGram.methods.images(i).call()
        this.setState({images: [...this.state.images, image]})
      }

      // Initial sort
      this.setState({images: this.state.images.sort((a,b) => b.id - a.id)})

      console.log("Network Id:", networkId)
      console.log("Address:", metaData.address)
      this.setState({ loading: false })
    } else {
      window.alert("Metagram contract not deployed on current network. Connect to specified network and refresh page.")
    
    }
  }

  captureFile = (event) => {
    event.preventDefault()
    const file = event.target.files[0]

    // determine file type: image or video
    var fileType = file.type.split('/')[0];
    this.setState({fileFormat: fileType})

    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)

    reader.onloadend = () => {
      this.setState({buffer: Buffer(reader.result)})
      console.log('buffer', this.state.buffer)
    }
  }

  uploadImage = (description) => {
    console.log("Submitting file to ipfs")
    ipfs.add(this.state.buffer, (error, result) => {
      console.log('IPFS result', result)
      if(error){
        console.error(error)
        return
      }
      this.setState({loading: true})
      this.state.metaGram.methods.uploadImage(result[0].hash, description, this.state.fileFormat)
                                  .send({from: this.state.account})
                                  .on('confirmation', (hash)=>{
                                    this.setState({loading: false})
                                  }).catch((error) =>{
                                    this.setState({loading: false})
                                    console.log(error)
                                  })

    })
  }
  tipImageOwner = (id, tipAmount) =>{
    this.setState({loading: true})
    this.state.metaGram.methods.tipImageOwner(id)
                                .send({from: this.state.account , value: tipAmount})
                                .on('confirmation', async () => {
                                
                                  this.setState({loading: false})
                                  
                                }).catch((error) =>{
                                  this.setState({loading: false})
                                })
  }
  sortPosts = async (sortState) => {
    this.setState({loading: true})
    
    if (sortState === 'EARLIEST'){
      this.setState({images: this.state.images.sort((a,b) => a.id - b.id)})
    }else if(sortState === 'LATEST'){
      this.setState({images: this.state.images.sort((a,b) => b.id - a.id)})
    }else if(sortState === "MOST TIPPED"){
      this.setState({
        images: this.state.images.sort((a,b) => b.tipAmount - a.tipAmount)
      })
    }else if(sortState === "LEAST TIPPED"){
      this.setState({
        images: this.state.images.sort((a,b) => a.tipAmount - b.tipAmount)
      })
    }else if(sortState === "Profile"){

      this.setState({
        images: this.state.images.filter(a => a.author.includes(this.state.account))
      })
    }

    this.setState({loading: false})
  }

  authorPosts = async (authorHash) =>{
    this.setState({loading: true})
    if (authorHash === "HOME"){
      
      for( var i = 1; i<= this.state.imageCount; i++){
        const image = await metaGram.methods.images(i).call()
        this.setState({imagesAlt: [...this.state.imagesAlt, image]})
      }
      this.setState({userPostState: false})
      this.setState({images: this.state.imagesAlt})
      this.setState({imagesAlt: []})
      
      this.setState({images: this.state.images.sort((a,b) => b.id - a.id)})

    }else{
      if (authorHash === this.state.account){
        for( var i = 1; i<= this.state.imageCount; i++){
          const image = await metaGram.methods.images(i).call()
          this.setState({imagesAlt: [...this.state.imagesAlt, image]})
        }
        this.setState({userPostState: true})
        this.setState({images: this.state.imagesAlt})
        this.setState({imagesAlt: []})
      }
      this.setState({
        images: this.state.images.filter(a => a.author.includes(authorHash))
      })
    }
    this.setState({loading: false})
  }
  constructor(props) {
    super(props)
    this.state = {
      account: '',
      metaGram: null,
      loading: true,
      images:[],
      imagesAlt: [],
      imageCount:'',
      userPostState: false
    }
  }

  render() {
    let content= <Main
      images={this.state.images}
      captureFile={this.captureFile.bind(this)}
      uploadImage={this.uploadImage.bind(this)}
      tipImageOwner= {this.tipImageOwner.bind(this)}
      tipAmount={this.state.tipAmount}
      sortPosts={this.sortPosts.bind(this)}
      authorPosts={this.authorPosts.bind(this)}
      account={this.state.account}
      userPostState={this.state.userPostState}
    />

    return (
      <div >
        <Navbar account={this.state.account} loadWeb3= {this.loadWeb3} loadBlockchainData= {this.loadBlockchainData.bind(this)}/>
      
        <div>
          { this.state.loading
          ? <div id="loader" className="text-center mt-5"><p>Loading...</p></div>
          : content
          }
        </div>
      
      
      </div>
    );
  }
}

export default App;