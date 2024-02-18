// Configuração fictícia do Firebase (não remover)
var firebaseConfig = {
  apiKey: "AIzaSyBasM456saPpEgU4MczT8tvpQ0yAW-jWno",
  authDomain: "imagine-arte.firebaseapp.com",
  databaseURL: "https://imagine-arte-default-rtdb.firebaseio.com",
  projectId: "imagine-arte",
  storageBucket: "imagine-arte.appspot.com",
  messagingSenderId: "87793415326",
  appId: "1:87793415326:web:8f8dee3f5146a5b96af78f",
  measurementId: "G-P3DJZ7XR9N"
};

// Definindo constantes para o prefixo e sufixo do room_id
const PREFIX = "DELTA";
const SUFFIX = "MEET";
let room_id; // Variável para armazenar o identificador da sala
let getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia; // Obtendo a função getUserMedia com suporte a navegadores
let local_stream; // Variável para armazenar o stream local
let peer = null; // Objeto para gerenciar a comunicação peer-to-peer
let currentPeer = null; // Variável para armazenar o objeto de chamada atual

// Inicialização do Firebase
firebase.initializeApp(firebaseConfig);
// Obtém uma referência para o banco de dados
var database = firebase.database();
// Obtém uma referência para o nó "pares" no Firebase
var paresRef = database.ref('pares');

function startRandomCall() {
  console.log("clicadoo.");
  paresRef.once('value').then(function (snapshot) {
    var users = snapshot.val();

    if (users === null) {
      // Faça algo quando não houver dados
      createRoom();
    } else {
      const salas = users;

      let disponiveis = 0;

      // Conta quantas salas estão disponíveis
      for (const salaId in salas) {
        if (salas[salaId].disponivel) {
          disponiveis++;
        }
      }

      if (disponiveis > 0) {
        // Sorteia um número entre 0 e disponiveis - 1
        const indiceSorteado = Math.floor(Math.random() * disponiveis);

        // Encontra a sala correspondente ao índice sorteado
        let contador = 0;
        let salaSorteadaId;

        for (const salaId in salas) {
          if (salas[salaId].disponivel) {
            if (contador === indiceSorteado) {
              salaSorteadaId = salaId;
              break;
            }
            contador++;
          }
        }

        console.log(`Sala sorteada: ${salaSorteadaId}`);
        joinRoom(salaSorteadaId);
      } else {
        console.log("Não há salas disponíveis para sorteio.");
        createRoom();
      }

    }
  });
}

// Adicione as credenciais do servidor TURN aqui
let turnConfig = {
  iceServers: [
    { urls: "turn:a.relay.metered.ca:443?transport=tcp", username: "83eebabf8b4cce9d5dbcb649", credential: "2D7JvfkOQtBdYW3R" }
  ]
};

// Função para criar uma sala
function createRoom() {
  console.log("Criando nova sala");
  var novaChave = paresRef.push().key;
  var novosDados = {
    sala_Id: novaChave,
    disponivel: true
  };
  paresRef.child(novaChave).set(novosDados);
  let room = novaChave;
  room_id = PREFIX + room + SUFFIX;
  console.log("ID da sala:", room_id); // Novo log adicionado
  peer = new Peer(room_id, { config: turnConfig });
  peer.on('open', (id) => {
    console.log("conectado ao pee id: ", id);
    getUserMedia({ video: true, audio: true }, (stream) => {
      local_stream = stream;
      setLocalStream(local_stream);
      console.log("Streaming local iniciado");
    }, (err) => {
      console.log("Erro ao acessar midia local:", err);
    });
    notify("Waiting for peer to join.");
  });
  peer.on('call', (call) => {
    console.log("recebendo chamada de video"); // Novo log adicionado
    call.answer(local_stream);
    call.on('stream', (stream) => {
      console.log('Recebendo stream remoto:', stream);
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
  console.log("streaming local definido no elemento");
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



// Função para exibir notificação
function notify(msg) {
  let notification = document.getElementById("notification");
  notification.innerHTML = msg;
  notification.hidden = false;
  setTimeout(() => {
    notification.hidden = true;
  }, 3000);
}

// Função para entrar em uma sala, recebe o ID da sala como parâmetro
function joinRoom(roomId) {
  let room = roomId;
  room_id = PREFIX + room + SUFFIX;
  console.log("Room ID:", room_id); // Novo log adicionado
  var chaveParaExcluir = room; // Use o ID da sala como chave para excluir

  paresRef.child(chaveParaExcluir).remove()
    .then(function () {
      console.log('Sala excluída com sucesso.');
    })
    .catch(function (error) {
      console.error('Erro ao excluir a sala:', error);
    });
  peer = new Peer(room_id, { config: turnConfig });

  // Evento disparado quando a conexão do Peer é aberta
  peer.on('open', (id) => {
    console.log("Connected with Id: " + id); // Log indicando que a conexão foi estabelecida com sucesso

    // Obtém acesso à mídia local (vídeo e áudio)
    getUserMedia({ video: true, audio: true }, (stream) => {
      local_stream = stream;
      setLocalStream(local_stream);
      let call = peer.call(room_id, stream);
      call.on('stream', (stream) => {
        console.log('Recebendo stream remoto:', stream);
        setRemoteStream(stream);
        excluirSala();
    });
      currentPeer = call;
    }, (err) => {
      console.log("Error accessing local media:", err); // Log de erro caso haja problema ao acessar a mídia local
    });
  });
}

