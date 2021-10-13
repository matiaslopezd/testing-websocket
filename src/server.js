/**
 * @name websocket-testing
 * @author Videsk
 * @license MIT
 * @website https://videsk.io
 *
 * Fork this project and use it to play
 * with websocket.
 *
 * This websocket server is focus in play with
 * custom configuration, authentication headers,
 * create and verify JWT and other general things.
 *
 * You can find more examples in https://open.videsk.io
 */
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const checkAuthorization = require("./authorization");
const jwt = require("jsonwebtoken");
const { jwtOptions, wsOptions } = require("./options"); // Custom options

// Instantiate socket server and events
const ws = require("./ws");

// Set node app trust in proxy
app.set("trust proxy", true);

// Create and send a new access token in endpoint /access-token
app.get("/access-token", function (req, res) {
  // Create JWT
  const accessToken = jwt.sign(
    { iat: Math.floor(new Date().getTime() / 1000) },
    jwtOptions.secret,
    { expiresIn: jwtOptions.expiresIn }
  );
  // Set response have JSON format
  res.header("Content-Type", "application/json");
  // Send response
  res.json({
    message: "Now you can connect via socketio-client.",
    accessToken
  });
});

// In endpoint / show app in public folder
app.use("/", express.static(__dirname + "/../public/"));

const port = process.env.PORT || 3000;

// Handle exceptions
process.on("uncaughtException", function (err) {});
// Handle rejections
process.on("unhandledRejection", function (reason, p) {});

module.exports = {
  server,
  port
};
