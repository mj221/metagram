const Metagram = artifacts.require('./Metagram.sol')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('Metagram', ([deployer, author, tipper]) => {
  let metagram

  before(async () => {
    metagram = await Metagram.deployed()
  })

  describe('deployment', async () => {
    it('deploys successfully', async () => {
      const address = await metagram.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })

    it('has a name', async () => {
      const name = await metagram.name()
      assert.equal(name, 'Metagram')
    })
  })
  describe('images', async() =>{
    let result, imageCount
    const hash = 'abc123'

    before(async () => {
      result = await metagram.uploadImage(hash, 'Image description', {from: author})
      imageCount = await metagram.imageCount()
    })

    it('create image', async() =>{
      assert.equal(imageCount, 1)
      const event = result.logs[0].args
      assert.equal(event.id.toString(), imageCount.toString())
      assert.equal(event.hash, hash)
      assert.equal(event.description, 'Image description')
      assert.equal(event.tipAmount, 0)
      assert.equal(event.author, author)

      await metagram.uploadImage('', 'Image description', {from: author}).should.be.rejected;
    })
    it('list images', async() => {
      const image = await metagram.images(imageCount)

      assert.equal(image.id.toString(), imageCount.toString())
      assert.equal(image.hash, hash)
      assert.equal(image.description, 'Image description')
      assert.equal(image.tipAmount, 0)
      assert.equal(image.author, author)
    })
  })
})