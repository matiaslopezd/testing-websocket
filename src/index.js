const { server, port } = require("./server");

// Start server
server.listen(port, function () {
  console.log(`listening on *:${port}`);
});
