const { server, port, host, jwt, chai } = require("./utils");

describe("Test authorization", function () {
  before(function (done) {
    this.app = server.listen(port);
    this.app.once("listening", done);
  });

  after(function (done) {
    this.app.close();
    done();
  });

  it("Get authorization", () => {
    return chai
      .request(host)
      .get("/access-token")
      .then((response) => {
        chai.expect(response).to.have.status(200);
        chai.expect(response).to.be.json;
        const decoded = jwt.decode(response.body.accessToken);
        chai.assert.ok(decoded);
      });
  });
});
