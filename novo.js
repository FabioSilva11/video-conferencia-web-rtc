var peer;
let localMediaStream =
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia;

var devInfo = document.getElementById("info-messages");

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

function toggleLog(elementId) {
  var logDiv = document.getElementById(elementId);
  if (logDiv.style.display === "none") {
    logDiv.style.display = "block";
  } else if (logDiv.style.display === "block") {
    logDiv.style.display = "none";
  } else if (logDiv.style.display === "") {
    logDiv.style.display = "none";
  }
}

function toggleLogfinaly() {
  toggleLog("finaly");
  toggleLog("call");
}

// Função para criar uma sala
function createRoom() {
  const roomId = document.getElementById("room-input").value.trim();
  toggleLog("log");

  navigator.mediaDevices
    .getUserMedia({ video: true, audio: true })
    .then(function (mediaStream) {
      localMediaStream = mediaStream;

      peer = new Peer(roomId, { config: turnConfig });

      peer.on("error", function (err) {
        devInfo.innerHTML = "Erro no Peer:" + err;
      });

      peer.on("open", function (id) {
        devInfo.innerHTML = "Sala criada com sucesso! ID da sala:" + id;
      });

      peer.on("call", function (call) {
        var currentCall = call;

        call.answer(localMediaStream);
        navigator.mediaDevices
          .getUserMedia({ video: true, audio: false })
          .then(function (mediaStream) {
            localMediaStream = mediaStream;
            var video_local = document.getElementById("local-video");
            video_local.srcObject = localMediaStream;
            video_local.play();
            toggleLogfinaly();
          })
          .catch(function (err) {
            devInfo.innerHTML =
              "Erro ao obter o stream de mídia não é possível fazer streamer";
            toggleLog("log");
          });

        call.on("stream", function (remoteStream) {
          devInfo.innerHTML =
            "Stream recebido do chamador:" + JSON.stringify(remoteStream);
          var remoteVideo = document.getElementById("remote-video");

          remoteVideo.srcObject = remoteStream;
          remoteVideo.play();
        });

        peer.on("close", () => {
          devInfo.innerHTML = "Conexão de vídeo encerrada.";
          toggleLog("log");
        });

        document
          .getElementById("end-call-button")
          .addEventListener("click", function () {
            if (peer) {
              peer.destroy();
              devInfo.innerHTML =
                "Par destruído. Operações de limpeza concluídas.";
                toggleLogfinaly();
            } else {
              devInfo.innerHTML =
                "O par não está definido. Não é possível fechar.";
            }
          });
      });
    })
    .catch(function (err) {
      devInfo.innerHTML =
        "Erro ao obter o stream de mídia não é possível fazer streamer";
      toggleLog("log");
    });
}

// Função para entrar em uma sala
function joinRoom() {
  const destPeerId = document.getElementById("room-input").value.trim();
  toggleLog("log");

  navigator.mediaDevices
    .getUserMedia({ video: true, audio: true })
    .then(function (mediaStream) {
      localMediaStream = mediaStream;

      peer = new Peer({ config: turnConfig });

      peer.on("error", function (err) {
        devInfo.innerHTML = "Erro no Peer:" + err;
      });

      peer.on("open", function (id) {
        devInfo.innerHTML = "Conectado à sala com sucesso! ID do peer:" + id;

        var conn = peer.connect(destPeerId);

        conn.on("open", function () {
          devInfo.innerHTML = "Conexão estabelecida com sucesso!";

          var call = peer.call(destPeerId, localMediaStream);

          navigator.mediaDevices
            .getUserMedia({ video: true, audio: false })
            .then(function (mediaStream) {
              localMediaStream = mediaStream;
              var video_local = document.getElementById("local-video");
              video_local.srcObject = localMediaStream;
              video_local.play();
              toggleLogfinaly();
            })
            .catch(function (err) {
              devInfo.innerHTML =
                "Erro ao obter o stream de mídia não é possível fazer streamer";
              toggleLog("log");
            });

          call.on("stream", function (remoteStream) {
            devInfo.innerHTML =
              "Stream recebido do chamador:" + JSON.stringify(remoteStream);
            var remoteVideo = document.getElementById("remote-video");

            remoteVideo.srcObject = remoteStream;
            remoteVideo.play();
          });

          peer.on("close", () => {
            devInfo.innerHTML = "Conexão de vídeo encerrada.";
            toggleLog("log");
            toggleLogfinaly();
          });

          document
            .getElementById("end-call-button")
            .addEventListener("click", function () {
              if (peer) {
                peer.destroy();
                devInfo.innerHTML =
                  "Par destruído. Operações de limpeza concluídas.";
              } else {
                devInfo.innerHTML =
                  "O par não está definido. Não é possível fechar.";
              }
            });
        });

        conn.on("error", function (err) {
          devInfo.innerHTML = "Erro na conexão:" + err;
        });
      });
    })
    .catch(function (err) {
      devInfo.innerHTML =
        "Erro ao obter o stream de mídia não é possível fazer streamer";
      toggleLog("log");
    });
}
