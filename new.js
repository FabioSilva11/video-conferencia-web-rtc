// Prefixo e sufixo para formar o ID da sala
const PRE = "DELTA";
const SUF = "MEET";

// Variáveis globais para armazenar informações da sala e streams
let room_id;
let local_stream;
let screenStream;
let peer = null;
let currentPeer = null;
let screenSharing = false;

// Verifica a disponibilidade dos métodos getUserMedia para diferentes navegadores
const getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

// Função para criar uma sala
function createRoom() {
    console.log("Criando Sala");
    const roomInput = document.getElementById("room-input");
    const room = roomInput.value.trim();
    
    // Valida se o número da sala foi inserido
    if (room === "") {
        alert("Por favor, insira o número da sala");
        return;
    }

    // Forma o ID da sala
    room_id = `${PRE}${room}${SUF}`;
    peer = new Peer(room_id);

    // Evento disparado quando a conexão com o Peer é aberta
    peer.on('open', (id) => {
        console.log("Conectado ao Peer com ID: ", id);
        hideModal();
        // Solicita acesso à câmera e microfone
        getUserMedia({ video: true, audio: true }, handleStream, handleError);
        notify("Aguardando o peer se juntar.");
    });

    // Evento disparado quando uma chamada é recebida
    peer.on('call', (call) => {
        // Responde à chamada e configura o stream remoto
        call.answer(local_stream);
        call.on('stream', handleRemoteStream);
        currentPeer = call;
    });
}

// Função chamada ao obter acesso à câmera e microfone
function handleStream(stream) {
    local_stream = stream;
    setLocalStream(local_stream);
}

// Função para lidar com erros
function handleError(err) {
    console.log(err);
}

// Função chamada ao receber o stream remoto
function handleRemoteStream(stream) {
    setRemoteStream(stream);
}

// Configura o elemento de vídeo para mostrar o stream local
function setLocalStream(stream) {
    const video = document.getElementById("local-video");
    video.srcObject = stream;
    video.muted = true;
    video.play();
}

// Configura o elemento de vídeo para mostrar o stream remoto
function setRemoteStream(stream) {
    const video = document.getElementById("remote-video");
    video.srcObject = stream;
    video.play();
}

// Esconde o modal de entrada
function hideModal() {
    document.getElementById("entry-modal").hidden = true;
}

// Exibe uma notificação por um curto período de tempo
function notify(msg) {
    const notification = document.getElementById("notification");
    notification.innerHTML = msg;
    notification.hidden = false;
    setTimeout(() => {
        notification.hidden = true;
    }, 3000);
}

// Função para entrar em uma sala existente
function joinRoom() {
    console.log("Entrando na Sala");
    const roomInput = document.getElementById("room-input");
    const room = roomInput.value.trim();

    // Valida se o número da sala foi inserido
    if (room === "") {
        alert("Por favor, insira o número da sala");
        return;
    }

    // Forma o ID da sala
    room_id = `${PRE}${room}${SUF}`;
    hideModal();
    peer = new Peer();

    // Evento disparado quando a conexão com o Peer é aberta
    peer.on('open', (id) => {
        console.log("Conectado com o ID: " + id);
        // Solicita acesso à câmera e microfone
        getUserMedia({ video: true, audio: true }, handleStream, handleError);
        notify("Conectando ao peer");
        // Inicia a chamada ao peer da sala
        const call = peer.call(room_id, local_stream);
        call.on('stream', handleRemoteStream);
        currentPeer = call;
    });
}

// Inicia o compartilhamento de tela
function startScreenShare() {
    if (screenSharing) {
        stopScreenSharing();
    }

    // Obtém o stream de compartilhamento de tela
    navigator.mediaDevices.getDisplayMedia({ video: true }).then((stream) => {
        screenStream = stream;
        const videoTrack = screenStream.getVideoTracks()[0];

        // Configura a função a ser chamada quando o compartilhamento de tela é interrompido
        videoTrack.onended = stopScreenSharing;

        if (peer) {
            // Substitui a faixa de vídeo do stream local pela do compartilhamento de tela
            const sender = currentPeer.peerConnection.getSenders().find((s) => s.track.kind === videoTrack.kind);
            sender.replaceTrack(videoTrack);
            screenSharing = true;
        }

        console.log(screenStream);
    });
}

// Interrompe o compartilhamento de tela
function stopScreenSharing() {
    if (!screenSharing) return;
    const videoTrack = local_stream.getVideoTracks()[0];
    if (peer) {
        // Substitui a faixa de vídeo do stream local pela original
        const sender = currentPeer.peerConnection.getSenders().find((s) => s.track.kind === videoTrack.kind);
        sender.replaceTrack(videoTrack);
    }
    // Para todos os tracks do stream de compartilhamento de tela
    screenStream.getTracks().forEach((track) => track.stop());
    screenSharing = false;
}
