// Declarar a variável peer fora das funções para que seja acessível globalmente
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

function toggleLog() {
  var logDiv = document.getElementById("log");
  if (logDiv.style.display === "none") {
    logDiv.style.display = "block";
  } else if (logDiv.style.display === "block") {
    logDiv.style.display = "none";
  } else if (logDiv.style.display === "") {
    logDiv.style.display = "none";
  }
}


function toggleLogfinaly() {
  var logDiv = document.getElementById("finaly");
  if (logDiv.style.display === "none") {
    logDiv.style.display = "block";
  } else if (logDiv.style.display === "block") {
    logDiv.style.display = "none";
  } else if (logDiv.style.display === "") {
    logDiv.style.display = "none";
  }
}

// Função para criar uma sala
function createRoom() {
  const roomId = document.getElementById("room-input").value.trim();
  toggleLog();

  // Certifique-se de ter o objeto mediaStream disponível
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
        // Armazenar a chamada para que possamos encerrá-la posteriormente se necessário
        var currentCall = call;

        // Atende a chamada, fornecendo nosso mediaStream
        call.answer(localMediaStream);
        navigator.mediaDevices
          .getUserMedia({ video: true, audio: false })
          .then(function (mediaStream) {
            toggleLogfinaly();
            // Restante do código permanece o mesmo
            localMediaStream = mediaStream;
            var video_local = document.getElementById("local-video");
            video_local.srcObject = localMediaStream;
            video_local.play();
          })
          .catch(function (err) {
            devInfo.innerHTML = "Erro ao obter o stream de mídia não é possivel fazer streamer";
      toggleLog();
          });

        call.on("stream", function (remoteStream) {
          devInfo.innerHTML = "Stream recebido do chamador:" + remoteStream;
          var remoteVideo = document.getElementById("remote-video");

          // Define o stream de mídia no elemento de vídeo remoto
          remoteVideo.srcObject = remoteStream;

          // Inicia a reprodução do vídeo remoto
          remoteVideo.play();
        });
        peer.on('close', () => {
          devInfo.innerHTML = "Conexão de video incerrada.";
          var remoteVideo = document.getElementById("remote-video");
          toggleLog();
          // Adicione aqui a lógica que você deseja executar quando a conexão for fechada.
        });

        // Adicionar um botão ou lógica para encerrar a chamada
        document
          .getElementById("end-call-button")
          .addEventListener("click", function () {
            // Encerrar a chamada
            if (peer) {
              // Chama 'destroy' para fechar o par e suas conexões
              peer.destroy();
              devInfo.innerHTML = "Par destruído. Operações de limpeza concluídas.";
            } else {
              devInfo.innerHTML = "O par não está definido. Não é possível fechar.";
            }
          });
      });
    })
    .catch(function (err) {
      devInfo.innerHTML = "Erro ao obter o stream de mídia não é possivel fazer streamer";
      toggleLog();
    });
}

// Função para entrar em uma sala
function joinRoom() {
  const destPeerId = document.getElementById("room-input").value.trim();
  toggleLog();

  // Certifique-se de ter o objeto mediaStream disponível
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

        // Iniciar uma conexão com o peer da sala (destPeerId)
        var conn = peer.connect(destPeerId);

        conn.on("open", function () {
          devInfo.innerHTML = "Conexão estabelecida com sucesso!";

          // Iniciar a chamada de vídeo
          var call = peer.call(destPeerId, localMediaStream);

          navigator.mediaDevices
            .getUserMedia({ video: true, audio: false })
            .then(function (mediaStream) {
              // Restante do código permanece o mesmo
              toggleLogfinaly();
              localMediaStream = mediaStream;
              var video_local = document.getElementById("local-video");
              video_local.srcObject = localMediaStream;
              video_local.play();
            })
            .catch(function (err) {
              devInfo.innerHTML = "Erro ao obter o stream de mídia não é possivel fazer streamer";
      toggleLog();
            });

          call.on("stream", function (remoteStream) {
            devInfo.innerHTML = "Stream recebido do chamador:" + remoteStream;
            var remoteVideo = document.getElementById("remote-video");

            // Define o stream de mídia no elemento de vídeo remoto
            remoteVideo.srcObject = remoteStream;

            // Inicia a reprodução do vídeo remoto
            remoteVideo.play();
          });

          peer.on('close', () => {
            devInfo.innerHTML = "Conexão de video incerrada.";
            var remoteVideo = document.getElementById("remote-video");
            toggleLog();
            // Adicione aqui a lógica que você deseja executar quando a conexão for fechada.
          });

          // Adicionar um botão ou lógica para encerrar a chamada
          document
            .getElementById("end-call-button")
            .addEventListener("click", function () {
              // Encerrar a chamada
              if (peer) {
                // Chama 'destroy' para fechar o par e suas conexões
                peer.destroy();
                devInfo.innerHTML = "Par destruído. Operações de limpeza concluídas.";
              } else {
                devInfo.innerHTML = "O par não está definido. Não é possível fechar.";
              }
            });
        });

        conn.on("error", function (err) {
          devInfo.innerHTML = "Erro na conexão:" + err;
        });
      });
    })
    .catch(function (err) {
      devInfo.innerHTML = "Erro ao obter o stream de mídia não é possivel fazer streamer";
      toggleLog();
    });
}
