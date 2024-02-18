// Declarar a variável peer fora das funções para que seja acessível globalmente
var peer;
let localMediaStream = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

// Função para criar uma sala
function createRoom() {
    const roomId = document.getElementById('room-input').value.trim();

    // Certifique-se de ter o objeto mediaStream disponível
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(function(mediaStream) {
            localMediaStream = mediaStream;

            peer = new Peer(roomId);

            peer.on('error', function(err) {
                console.log('Erro no Peer:', err);
            });

            peer.on('open', function(id) {
                console.log('Sala criada com sucesso! ID da sala:', id);
            });

            peer.on('call', function(call) {
                // Atende a chamada, fornecendo nosso mediaStream
                call.answer(localMediaStream);
                var video_local = document.getElementById('local-video');

                // Define o stream de mídia no elemento de vídeo local
                video_local.srcObject = localMediaStream;

                // Inicia a reprodução do vídeo local
                video_local.play();

                call.on('stream', function(remoteStream) {
                    console.log('Stream recebido do chamador:', remoteStream);
                    var remoteVideo = document.getElementById('remote-video');

                    // Define o stream de mídia no elemento de vídeo remoto
                    remoteVideo.srcObject = remoteStream;

                    // Inicia a reprodução do vídeo remoto
                    remoteVideo.play();
                });
            });
        })
        .catch(function(err) {
            console.log('Erro ao obter o stream de mídia:', err);
        });
}

// Função para entrar em uma sala
function joinRoom() {
    const destPeerId = document.getElementById('room-input').value.trim();

    // Certifique-se de ter o objeto mediaStream disponível
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(function(mediaStream) {
            localMediaStream = mediaStream;

            peer = new Peer();

            peer.on('error', function(err) {
                console.log('Erro no Peer:', err);
            });

            peer.on('open', function(id) {
                console.log('Conectado à sala com sucesso! ID do peer:', id);

                // Iniciar uma conexão com o peer da sala (destPeerId)
                var conn = peer.connect(destPeerId);

                conn.on('open', function() {
                    console.log('Conexão estabelecida com sucesso!');

                    // Iniciar a chamada de vídeo
                    var call = peer.call(destPeerId, localMediaStream);
                    var video_local = document.getElementById('local-video');

                    // Define o stream de mídia no elemento de vídeo local
                    video_local.srcObject = localMediaStream;

                    // Inicia a reprodução do vídeo local
                    video_local.play();

                    call.on('stream', function(remoteStream) {
                        console.log('Stream recebido do chamador:', remoteStream);
                        var remoteVideo = document.getElementById('remote-video');

                        // Define o stream de mídia no elemento de vídeo remoto
                        remoteVideo.srcObject = remoteStream;

                        // Inicia a reprodução do vídeo remoto
                        remoteVideo.play();
                    });
                });

                conn.on('error', function(err) {
                    console.log('Erro na conexão:', err);
                });
            });
        })
        .catch(function(err) {
            console.log('Erro ao obter o stream de mídia:', err);
        });
}
