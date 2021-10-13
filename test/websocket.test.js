const { server, port, host, wsOptions, chai, io } = require("./utils");

function getAccessToken() {
  return new Promise((resolve, reject) => {
    chai
      .request(host)
      .get("/access-token")
      .end((error, response) =>
        error ? reject(error) : resolve(response.body.accessToken)
      );
  });
}

describe("Test websocket", function () {
  before(function (done) {
    this.app = server.listen(port);
    this.accessToken = null;
    this.app.once("listening", async () => {
      this.accessToken = await getAccessToken();
      done();
    });
  });

  after(function (done) {
    this.app.close();
    done();
  });

  it("Connect to websocket (no namespace)", function (done) {
    const options = Object.create(wsOptions);
    options.query = { Authorization: `Bearer ${this.accessToken}` };

    const socket = io(host, options);
    const message = "My message :)";

    socket.on("message-received", (msg) => {
      chai.expect(msg).to.equal(message);
      socket.disconnect(true);
      done();
    });
    socket.emit("new-message", message);
  }).timeout(400); // More than 400ms is too much (locally)

  it("Connect to websocket with invalid accessToken", function (done) {
    const options = Object.create(wsOptions);
    options.query = { Authorization: `Bearer invalidAccessToken` };
    const socket = io(host, options);

    socket.on("ups-error", (payload) => {
      chai.assert.ok(typeof payload === "object");
      const { title, message, event } = payload;
      chai.expect(event).to.equal("authorization");
      chai.expect(title).to.equal("JsonWebTokenError");
      chai.expect(message).to.equal("jwt malformed");
      socket.disconnect(true);
      done();
    });
  }).timeout(400); // More than 400ms is too much (locally)

  it("Connect to websocket without accessToken", function (done) {
    const socket = io(host, wsOptions);

    socket.on("ups-error", (payload) => {
      chai.assert.ok(typeof payload === "object");
      const { title, message, event } = payload;
      chai.expect(event).to.equal("authorization");
      chai.expect(title).to.equal("TypeError");
      chai.expect(message).to.equal("Header value must be a string.");
      socket.disconnect(true);
      done();
    });
  }).timeout(400); // More than 400ms is too much (locally)

  it("Connect to websocket secret namespace", function (done) {
    const options = Object.create(wsOptions);
    options.query = { Authorization: `Bearer ${this.accessToken}` };
    const socket = io(`${host}/secret`, options);

    const message = "My message :)";

    socket.on("message-received", (msg) => {
      chai.assert.ok(msg.includes("secret"));
      socket.disconnect(true);
      done();
    });
    socket.emit("new-message", message);
  }).timeout(400); // More than 400ms is too much (locally)

  it("Connect to websocket area51 namespace", function (done) {
    const options = Object.create(wsOptions);
    options.query = { Authorization: `Bearer ${this.accessToken}` };
    const socket = io(`${host}/area51`, options);

    const message = "My message :)";

    socket.on("message-received", (msg) => {
      chai.assert.ok(msg.includes("area51"));
      socket.disconnect(true);
      done();
    });
    socket.emit("new-message", message);
  }).timeout(0); // Set in 0 for no timeout
});
