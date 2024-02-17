// Definindo constantes para o prefixo e sufixo do room_id
const PREFIX = "DELTA";
const SUFFIX = "MEET";
let room_id; // Variável para armazenar o identificador da sala
let getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia; // Obtendo a função getUserMedia com suporte a navegadores
let local_stream; // Variável para armazenar o stream local
let peer = null; // Objeto para gerenciar a comunicação peer-to-peer
let currentPeer = null; // Variável para armazenar o objeto de chamada atual

// Adicione as credenciais do servidor TURN aqui
let turnConfig = {
    iceServers: [
        { urls: "turn:a.relay.metered.ca:443?transport=tcp", username: "83eebabf8b4cce9d5dbcb649", credential: "2D7JvfkOQtBdYW3R" }
    ]
};

// Função para criar uma sala
function createRoom() {
    console.log("Creating Room");
    let room = document.getElementById("room-input").value;
    if (!room.trim()) {
        alert("Please enter a room number");
        return;
    }
    room_id = PREFIX + room + SUFFIX;
    console.log("Room ID:", room_id); // Novo log adicionado
    peer = new Peer(room_id, { config: turnConfig });
    peer.on('open', (id) => {
        console.log("Peer Connected with ID:", id);
        hideModal();
        getUserMedia({ video: true, audio: true }, (stream) => {
            local_stream = stream;
            setLocalStream(local_stream);
            console.log("Local stream initialized");
        }, (err) => {
            console.log("Error accessing local media:", err);
        });
        notify("Waiting for peer to join.");
    });
    peer.on('call', (call) => {
        console.log("Call received"); // Novo log adicionado
        call.answer(local_stream);
        call.on('stream', (stream) => {
            setRemoteStream(stream);
        });
        currentPeer = call;
    });
}

// Função para definir o stream local no elemento de vídeo
function setLocalStream(stream) {
    let video = document.getElementById("local-video");
    video.srcObject = stream;
    video.muted = true;
    video.play();
    console.log("Local stream set");
}

// Função para definir o stream remoto no elemento de vídeo
function setRemoteStream(stream) {
    console.log("Setting remote stream");
    let video = document.getElementById("remote-video");
    if (video) {
        video.srcObject = stream;
        video.play().then(() => {
            console.log("Remote video playback started successfully");
        }).catch((error) => {
            console.error("Error starting remote video playback:", error);
        });
    } else {
        console.error("Remote video element not found");
    }
}

// Restante do seu script permanece inalterado

// Função para ocultar o modal de entrada
function hideModal() {
    document.getElementById("entry-modal").hidden = true;
}

// Função para exibir notificação
function notify(msg) {
    let notification = document.getElementById("notification");
    notification.innerHTML = msg;
    notification.hidden = false;
    setTimeout(() => {
        notification.hidden = true;
    }, 3000);
}

// Função para entrar em uma sala existente
function joinRoom() {
    console.log("Joining Room");
    let room = document.getElementById("room-input").value;
    if (!room.trim()) {
        alert("Please enter a room number");
        return;
    }
    room_id = PREFIX + room + SUFFIX;
    console.log("Room ID:", room_id); // Novo log adicionado
    hideModal();
    peer = new Peer({ config: turnConfig });
    peer.on('open', (id) => {
        console.log("Connected with Id: " + id);
        getUserMedia({ video: true, audio: true }, (stream) => {
            local_stream = stream;
            setLocalStream(local_stream);
            notify("Joining peer");
            let call = peer.call(room_id, stream);
            call.on('stream', (stream) => {
                setRemoteStream(stream);
            });
            currentPeer = call;
        }, (err) => {
            console.log("Error accessing local media:", err);
        });
    });
}
