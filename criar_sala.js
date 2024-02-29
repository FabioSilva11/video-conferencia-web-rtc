var peer;
var devInfo = document.getElementById("info-messages");

// Função para criar uma sala
function createRoom() {
  const roomId = document.getElementById("room-input").value.trim();

  // Mostrar mensagem de aguarde
  devInfo.innerHTML = "Ligação em andamento, aguarde...";

  navigator.mediaDevices
    .getUserMedia({ video: true, audio: true })
    .then(function (mediaStream) {
      localMediaStream = mediaStream;

      peer = new Peer(roomId, { config: turnConfig });

      peer.on("error", function (err) {
        // Exibir mensagem de erro
        devInfo.innerHTML = "Erro no Peer:" + err;
      });

      peer.on("open", function (id) {
        // Exibir mensagem de sucesso com o ID da sala
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
            document.getElementById('conteiner-call').style.display = 'block';
            document.getElementById('conteiner-encerrar-chamada').style.display = 'block';
          })
          .catch(function (err) {
            // Exibir mensagem de erro ao obter o stream de mídia
            devInfo.innerHTML = "Erro ao obter o stream de mídia, não é possível fazer streamer";
          });

        call.on("stream", function (remoteStream) {
          var remoteVideo = document.getElementById("remote-video");
          remoteVideo.srcObject = remoteStream;
          remoteVideo.play();
        });

        call.on("close", function () {
          // Exibir mensagem ao encerrar a chamada pelo outro lado
          devInfo.innerHTML = "Conexão de vídeo encerrada pelo outro lado.";
          // Adicione aqui qualquer lógica adicional necessária ao encerrar a chamada.
        });

        peer.on("close", () => {
          // Exibir mensagem ao encerrar a conexão de vídeo
          devInfo.innerHTML = "Conexão de vídeo encerrada.";
        });

        document
          .getElementById("end-call-button")
          .addEventListener("click", function () {
            if (currentCall) {
              currentCall.close();
              // Exibir mensagem ao encerrar a chamada de vídeo
              devInfo.innerHTML = "A chamada de vídeo será encerrada.";
            } else {
              // Exibir mensagem se a chamada não estiver definida
              devInfo.innerHTML = "A chamada não está definida. Não é possível fechar.";
            }
          });
      });
    })
    .catch(function (err) {
      // Exibir mensagem de erro ao obter o stream de mídia
      devInfo.innerHTML = "Erro ao obter o stream de mídia, não é possível fazer streamer";
    });
}
