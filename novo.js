// Adicione as credenciais do servidor TURN aqui
let turnConfig = {
    iceServers: [
        { urls: "turn:a.relay.metered.ca:443?transport=tcp", username: "83eebabf8b4cce9d5dbcb649", credential: "2D7JvfkOQtBdYW3R" }
    ]
};

let peer;
let localStream; // Variável para armazenar a stream local

// Função para obter a stream local
async function getLocalStream() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localStream = stream;
        document.getElementById('local-video').srcObject = stream;
    } catch (error) {
        console.error('Erro ao obter a stream local:', error);
    }
}

// Função para criar uma sala
function createRoom() {
    // Obter o valor do campo de entrada (room ID)
    const roomId = document.getElementById('room-input').value.trim();

    if (roomId) {
        // Inicializar o objeto Peer com a configuração de servidor TURN e o ID da sala
        peer = new Peer(roomId, { config: turnConfig });

        // Evento disparado quando a conexão Peer é aberta (open)
        peer.on('open', (peerId) => {
            console.log('Conexão Peer aberta. ID:', peerId);
            // Implemente aqui a lógica adicional, como exibir o ID em algum lugar na interface do usuário
        });

        // Evento disparado quando uma chamada é recebida
        peer.on('call', (incomingCall) => {
            console.log('Chamada recebida. Respondendo...');

            // Responder à chamada com a stream local
            incomingCall.answer(localStream);

            // Evento disparado quando a chamada é estabelecida
            incomingCall.on('stream', (remoteStream) => {
                // Exibir a stream remota no elemento de vídeo
                document.getElementById('remote-video').srcObject = remoteStream;
            });
        });

        // Evento disparado quando ocorre um erro
        peer.on('error', (error) => {
            console.error('Erro na conexão Peer:', error);
        });

        // Implementar lógica adicional, se necessário
    } else {
        console.error('ID da sala não pode estar vazio.');
    }
}

// Função para entrar em uma sala
function joinRoom() {
    // Obter o valor do campo de entrada (room ID)
    const roomId = document.getElementById('room-input').value.trim();

    if (roomId) {
        // Inicializar o objeto Peer com a configuração de servidor TURN
        peer = new Peer({ config: turnConfig });

        // Evento disparado quando a conexão do Peer é aberta
        peer.on('open', (id) => {
            console.log("Connected with Id: " + id); // Log indicando que a conexão foi estabelecida com sucesso
            // Obtém acesso à mídia local (vídeo e áudio)
            getUserMedia({ video: true, audio: true }, (stream) => {
                let call = peer.call(roomId, stream);
                call.on('stream', (remoteStream) => {
                    console.log('Recebendo stream remoto:', remoteStream);
                    // Faça algo com a stream remota, por exemplo, exibir no elemento de vídeo
                    document.getElementById('remote-video').srcObject = remoteStream;
                });
            }, (err) => {
                console.log("Error accessing local media:", err); // Log de erro caso haja problema ao acessar a mídia local
            });
        });
    } else {
        console.error('ID da sala não pode estar vazio.');
    }
}

// Chamar a função getLocalStream no início ou em resposta a uma ação do usuário
getLocalStream();
