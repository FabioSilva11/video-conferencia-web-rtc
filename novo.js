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
                // Armazenar a chamada para que possamos encerrá-la posteriormente se necessário
                var currentCall = call;

                // Atende a chamada, fornecendo nosso mediaStream
                call.answer(localMediaStream);
                navigator.mediaDevices.getUserMedia({ video: true, audio: false })
                    .then(function(mediaStream) {
                        // Restante do código permanece o mesmo
                        localMediaStream = mediaStream;
                        var video_local = document.getElementById('local-video');
                        video_local.srcObject = localMediaStream;
                        video_local.play();
                    })
                    .catch(function(err) {
                        console.log('Erro ao obter o stream de mídia:', err);
                    });

                call.on('stream', function(remoteStream) {
                    console.log('Stream recebido do chamador:', remoteStream);
                    var remoteVideo = document.getElementById('remote-video');

                    // Define o stream de mídia no elemento de vídeo remoto
                    remoteVideo.srcObject = remoteStream;

                    // Inicia a reprodução do vídeo remoto
                    remoteVideo.play();
                });

                // Adicionar um botão ou lógica para encerrar a chamada
                document.getElementById('end-call-button').addEventListener('click', function() {
                    // Encerrar a chamada
                    currentCall.close();
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

                    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
                        .then(function(mediaStream) {
                            // Restante do código permanece o mesmo
                            localMediaStream = mediaStream;
                            var video_local = document.getElementById('local-video');
                            video_local.srcObject = localMediaStream;
                            video_local.play();
                        })
                        .catch(function(err) {
                            console.log('Erro ao obter o stream de mídia:', err);
                        });

                    call.on('stream', function(remoteStream) {
                        console.log('Stream recebido do chamador:', remoteStream);
                        var remoteVideo = document.getElementById('remote-video');

                        // Define o stream de mídia no elemento de vídeo remoto
                        remoteVideo.srcObject = remoteStream;

                        // Inicia a reprodução do vídeo remoto
                        remoteVideo.play();
                    });

                    // Adicionar um botão ou lógica para encerrar a chamada
                    document.getElementById('end-call-button').addEventListener('click', function() {
                        // Encerrar a chamada
                        call.close();
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
