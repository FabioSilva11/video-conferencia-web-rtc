
    // Definindo constantes para o prefixo e sufixo do room_id
    const PREFIX = "DELTA";
    const SUFFIX = "MEET";
    let room_id; // Variável para armazenar o identificador da sala
    let getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia; // Obtendo a função getUserMedia com suporte a navegadores
    let local_stream; // Variável para armazenar o stream local
    let peer = null; // Objeto para gerenciar a comunicação peer-to-peer
    let currentPeer = null; // Variável para armazenar o objeto de chamada atual

    // Função para criar uma sala
    function createRoom() {
        console.log("Creating Room");
        let room = document.getElementById("room-input").value;
        if (!room.trim()) {
            alert("Please enter a room number");
            return;
        }
        room_id = PREFIX + room + SUFFIX;
        peer = new Peer(room_id);
        peer.on('open', (id) => {
            console.log("Peer Connected with ID:", id);
            hideModal();
            getUserMedia({ video: true, audio: true }, (stream) => {
                local_stream = stream;
                setLocalStream(local_stream);
            }, (err) => {
                console.log(err);
            });
            notify("Waiting for peer to join.");
        });
        peer.on('call', (call) => {
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
    }

    // Função para definir o stream remoto no elemento de vídeo
    function setRemoteStream(stream) {
        let video = document.getElementById("remote-video");
        video.srcObject = stream;
        video.play();
    }

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
        hideModal();
        peer = new Peer();
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
                console.log(err);
            });
        });
    }
