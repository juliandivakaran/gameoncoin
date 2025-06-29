async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying with address:", deployer.address);

  const WETH = await ethers.deployContract("WETH9");
  await WETH.waitForDeployment();
  console.log("WETH deployed to:", WETH.target);

  const Factory = await ethers.deployContract("UniswapV2Factory", [deployer.address]);
  await Factory.waitForDeployment();
  console.log("Factory deployed to:", Factory.target);

  const Router = await ethers.deployContract("UniswapV2Router02", [
    Factory.target,
    WETH.target
  ]);
  await Router.waitForDeployment();
  console.log("Router deployed to:", Router.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
