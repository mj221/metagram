const Metagram = artifacts.require("Metagram");

module.exports = async function(deployer) {
  await deployer.deploy(Metagram);
  
};