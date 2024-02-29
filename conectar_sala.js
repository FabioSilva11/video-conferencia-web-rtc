var peer;
var devInfo = document.getElementById("info-messages");

// Função para entrar em uma sala
function joinRoom() {
  const destPeerId = document.getElementById("room-input").value.trim();  

  navigator.mediaDevices
    .getUserMedia({ video: true, audio: true })
    .then(function (mediaStream) {
      localMediaStream = mediaStream;

      peer = new Peer({ config: turnConfig });

      peer.on("error", function (err) {
        devInfo.innerHTML = "Erro no Peer:" + err;
      });

      peer.on("open", function (id) {
        devInfo.innerHTML = " Chamada Conectada";

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
            })
            .catch(function (err) {
              devInfo.innerHTML = "Erro ao obter o stream de mídia não é possível fazer streamer";
            });

          call.on("stream", function (remoteStream) {
            var remoteVideo = document.getElementById("remote-video");
            remoteVideo.srcObject = remoteStream;
            remoteVideo.play();
          });

          call.on("close", function () {
            devInfo.innerHTML = "Chamada de vídeo encerrada pelo outro lado.";
            // Adicione aqui qualquer lógica adicional necessária ao encerrar a chamada.
          });

          peer.on("close", () => {
            devInfo.innerHTML = "Chamada de vídeo encerrada.";
          });

          document
            .getElementById("end-call-button")
            .addEventListener("click", function () {
              if (peer) {
                peer.destroy();
                devInfo.innerHTML = "A chamada de vídeo será encerrada.";
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
      devInfo.innerHTML = "Erro ao obter o stream de mídia não é possível fazer streamer";
    });
}
