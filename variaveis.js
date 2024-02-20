let localMediaStream =
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia;

// Adicione as credenciais do servidor TURN aqui
let turnConfig = {
  iceServers: [
    {
      urls: "turn:a.relay.metered.ca:443?transport=tcp",
      username: "83eebabf8b4cce9d5dbcb649",
      credential: "2D7JvfkOQtBdYW3R",
    },
  ],
};