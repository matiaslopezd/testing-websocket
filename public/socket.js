/**
 * @name websocket-playground-client
 * @author Videsk
 * @license MIT
 * @website https://videsk.io
 *
 * Fork this project and use it to play
 * with websocket-client.
 *
 * This websocket client is focus in play with
 * custom configuration, authentication headers
 * with JWT.
 *
 * You can find more examples in https://open.videsk.io
 */

const host = window.location.hostname; // This is added because in codesandbox change URL

const socket = new WebSocket(`ws://${host}`);

socket.addEventListener("open", (event) => {
  console.log(event);
  socket.send("Hello world");
});

socket.addEventListener("message", (event) => console.log(event));
