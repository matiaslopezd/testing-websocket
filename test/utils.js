const chai = require("chai"),
  chaiHTTP = require("chai-http");
const jwt = require("jsonwebtoken");
chai.use(chaiHTTP);

const { server } = require("../src/server");
const { wsOptions } = require("../src/options");

const port = 5050;
const host = "http://localhost:" + port;

const io = require("socket.io-client");

module.exports = {
  // server
  server,
  port,
  host,
  wsOptions,
  // libraries
  jwt,
  chai,
  io
};
