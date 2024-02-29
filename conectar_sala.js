// Função para entrar em uma sala
function joinRoom() {
  const destPeerId = document.getElementById("room-input").value.trim();

  navigator.mediaDevices
    .getUserMedia({ video: true, audio: true })
    .then(function (mediaStream) {
      localMediaStream = mediaStream;

      peer = new Peer({ config: turnConfig });

      peer.on("error", function (err) {
        // Lógica de erro, se necessário
        devInfo.innerHTML = "Erro no Peer:" + err;
      });

      peer.on("open", function (id) {
        var conn = peer.connect(destPeerId);

        conn.on("open", function () {
          // Ocultar a div 'conteiner-formulário' durante a chamada
          document.getElementById('conteiner-formulário').style.display = 'none';
          
          // Mostrar a div 'conteiner-call' onde a chamada é exibida
          document.getElementById('conteiner-call').style.display = 'block';
          document.getElementById('conteiner-encerrar-chamada').style.display = 'block';

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
              // Lógica de erro ao obter o stream de mídia
              devInfo.innerHTML = "Erro ao obter o stream de mídia, não é possível fazer streamer";
            });

          call.on("stream", function (remoteStream) {
            var remoteVideo = document.getElementById("remote-video");
            remoteVideo.srcObject = remoteStream;
            remoteVideo.play();
          });

          call.on("close", function () {
            // Lógica de fechamento da chamada
            document.getElementById('conteiner-formulário').style.display = 'block';
            
            // Oculta a div 'conteiner-call' onde a chamada é exibida
            document.getElementById('conteiner-call').style.display = 'none';
            document.getElementById('conteiner-encerrar-chamada').style.display = 'none';
          });

          peer.on("close", () => {
            // Lógica de fechamento da chamada
            devInfo.innerHTML = "Chamada de vídeo encerrada.";
          });

          document
            .getElementById("end-call-button")
            .addEventListener("click", function () {
              if (call) {
                call.close();
                // Lógica de encerramento da chamada
                devInfo.innerHTML = "A chamada de vídeo será encerrada.";
              } else {
                // Lógica se o par não estiver definido
                devInfo.innerHTML = "O par não está definido. Não é possível fechar.";
              }
            });
        });

        conn.on("error", function (err) {
          // Lógica de erro na conexão
          devInfo.innerHTML = "Erro na conexão:" + err;
        });
      });
    })
    .catch(function (err) {
      // Lógica de erro ao obter o stream de mídia
      devInfo.innerHTML = "Erro ao obter o stream de mídia, não é possível fazer streamer";
    });
            }
                                
