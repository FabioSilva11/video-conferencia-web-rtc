// Referência ao Realtime Database
const database = firebase.database();

// Variável para armazenar o temporizador de desconexão
let disconnectTimeout;

// Função para configurar o peer
function setupPeer(roomId, callback) {
  const peer = new Peer(roomId, { config: turnConfig });

  peer.on("error", function (err) {
    devInfo.innerHTML = "Erro no Peer: " + err;
  });

  peer.on("open", function (id) {
    devInfo.innerHTML = "Conectado com sucesso! ID: " + id;
    if (callback) callback(peer);
  });

  window.addEventListener("beforeunload", function () {
    if (peer) {
      peer.destroy();
      database.ref('pairs').orderByChild('roomId').equalTo(roomId).once('value', snapshot => {
        snapshot.forEach(childSnapshot => {
          childSnapshot.ref.remove();
        });
      });
    }
  });

  return peer;
}

// Função para obter a mídia local
function getLocalMedia(constraints) {
  return navigator.mediaDevices.getUserMedia(constraints);
}

// Função para lidar com a chamada
function handleCall(call, localMediaStream) {
  call.answer(localMediaStream);

  // Desconexão por tempo
  disconnectTimeout = setTimeout(() => {
    call.close();
    devInfo.innerHTML = "Desconectado por tempo. Não recebeu o vídeo remoto.";
    resetCallUI();
  }, 10000); // 10 segundos de tempo limite

  call.on("stream", function (remoteStream) {
    clearTimeout(disconnectTimeout);
    const remoteVideo = document.getElementById("remote-video");
    remoteVideo.srcObject = remoteStream;
    remoteVideo.play();
  });

  call.on("close", function () {
    devInfo.innerHTML = "Conexão de vídeo encerrada pelo outro lado.";
    resetCallUI();
  });
}

// Função para configurar os eventos de chamada
function setupCallEvents(peer, localMediaStream) {
  peer.on("call", function (call) {
    showCallUI();
    handleCall(call, localMediaStream);
  });

  document.getElementById("end-call-button").addEventListener("click", function () {
    if (peer) peer.destroy();
  });
}

// Função para mostrar a UI de chamada
function showCallUI() {
  document.getElementById('conteiner-formulário').style.display = 'none';
  document.getElementById('conteiner-call').style.display = 'block';
  document.getElementById('conteiner-encerrar-chamada').style.display = 'block';
}

// Função para resetar a UI após a chamada
function resetCallUI() {
  document.getElementById('conteiner-formulário').style.display = 'block';
  document.getElementById('conteiner-call').style.display = 'none';
  document.getElementById('conteiner-encerrar-chamada').style.display = 'none';
}

// Função para parear usuários
function pairUsers() {
  devInfo.innerHTML = "Aguardando outro usuário...";

  // Referência à lista de pares
  const pairsRef = database.ref('pairs');

  pairsRef.once('value', snapshot => {
    if (snapshot.exists()) {
      // Se houver pares disponíveis, conectar-se ao primeiro
      const pairs = snapshot.val();
      const firstPairKey = Object.keys(pairs)[0];
      const firstPair = pairs[firstPairKey];
      const roomId = firstPair.roomId;

      // Remover o par usado do Firebase
      pairsRef.child(firstPairKey).remove();

      // Iniciar chamada como callee
      joinRoom(roomId);
    } else {
      // Se não houver pares disponíveis, criar um novo par
      const newPairRef = pairsRef.push();
      const roomId = newPairRef.key;

      newPairRef.set({ roomId }).then(() => {
        // Iniciar chamada como caller
        createRoom(roomId);
      });
    }
  });
}

// Função para criar uma sala
function createRoom(roomId) {
  getLocalMedia({ video: true, audio: true })
    .then(function (mediaStream) {
      localMediaStream = mediaStream;
      const peer = setupPeer(roomId, function (peer) {
        setupCallEvents(peer, localMediaStream);
      });

      const video_local = document.getElementById("local-video");
      video_local.srcObject = localMediaStream;
      video_local.play();
    })
    .catch(function (err) {
      devInfo.innerHTML = "Erro ao obter o stream de mídia, não é possível fazer streaming";
    });
}

// Função para entrar em uma sala
function joinRoom(roomId) {
  getLocalMedia({ video: true, audio: true })
    .then(function (mediaStream) {
      localMediaStream = mediaStream;
      const peer = new Peer({ config: turnConfig });

      peer.on("error", function (err) {
        devInfo.innerHTML = "Erro no Peer: " + err;
      });

      peer.on("open", function (id) {
        const conn = peer.connect(roomId);

        conn.on("open", function () {
          showCallUI();
          const call = peer.call(roomId, localMediaStream);

          call.on("stream", function (remoteStream) {
            const remoteVideo = document.getElementById("remote-video");
            remoteVideo.srcObject = remoteStream;
            remoteVideo.play();
          });

          call.on("close", function () {
            resetCallUI();
          });

          document.getElementById("end-call-button").addEventListener("click", function () {
            if (call) {
              call.close();
              devInfo.innerHTML = "A chamada de vídeo será encerrada.";
            } else {
              devInfo.innerHTML = "O par não está definido. Não é possível fechar.";
            }
          });
        });

        conn.on("error", function (err) {
          devInfo.innerHTML = "Erro na conexão: " + err;
        });
      });
    })
    .catch(function (err) {
      devInfo.innerHTML = "Erro ao obter o stream de mídia, não é possível fazer streaming";
    });
}

// Inicializar pareamento de usuários ao clicar no botão "ficar on"
document.getElementById("go-online-button").addEventListener("click", pairUsers);
