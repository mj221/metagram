pragma solidity ^0.8.7;

contract Metagram {
  string public name = "Metagram";

  uint public imageCount = 0;
  mapping(uint => Image) public images;
  struct Image{
    uint id;
    string hash;
    string description;
    uint tipAmount;
    string format;
    address payable author;
  }

  event ImageUploaded(
    uint id,
    string hash,
    string description,
    uint tipAmount,
    string format,
    address payable author
  );

  event ImageTipped(
    uint id,
    string hash,
    string description,
    uint tipAmount,
    string format,
    address payable author
  );

  function uploadImage (string memory _imgHash, string memory _description, string memory _format) public{
    require(bytes(_imgHash).length > 0);
    require(bytes(_description).length > 0);
    require(msg.sender != address(0x0));

    imageCount += 1;
    images[imageCount] = Image(imageCount, _imgHash, _description, 0, _format, payable(msg.sender));

    emit ImageUploaded(imageCount, _imgHash, _description, 0, _format, payable(msg.sender));
  } 

  function tipImageOwner(uint _id) public payable{
    require(_id > 0 && _id <= imageCount);
    Image memory _image = images[_id];
    address payable _author = _image.author;
    _author.transfer(msg.value);
    _image.tipAmount = _image.tipAmount + msg.value;

    images[_id] = _image;

    emit ImageTipped(_id, _image.hash, _image.description, _image.tipAmount, _image.format,_author);
  }
}