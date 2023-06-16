import server from "./main/main.js";

async function init() {
  server.listen(3001, () => {
    console.log("Express App Listening on Port 3001");
  });
}
init().catch((e) => {
  console.error(`An error occurred: ${JSON.stringify(e)}`);
  process.exit(1);
});
