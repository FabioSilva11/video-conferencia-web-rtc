## CHAMADA DE VIDEO USANDO WEB RTC É PEEJS

<script src="https://unpkg.com/peerjs@1.5.2/dist/peerjs.min.js"></script>

Este projeto tem como objetivo posibilitar chamadas de video como as do omigle Abaixo estão as funções principais e sua explicação:

### Constantes
Definimos constantes para o prefixo e sufixo do `room_id`:
```javascript
var peer;
let localMediaStream =
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia;


var devInfo = document.getElementById("info-messages");
```

### Variáveis

peer: Declaração global da variável fora das funções para ser acessível globalmente.
localMediaStream: Inicialmente é uma variável global, mas é reatribuída dentro da função createRoom e joinRoom.
devInfo: Representa o elemento HTML com o ID "info-messages".

### Funções

#### `createRoom()`
A função createRoom neste código é responsável por criar uma sala de comunicação para videochamadas. Aqui está uma breve explicação das etapas realizadas pela função:

Obtém o ID da sala a partir do elemento HTML com o ID "room-input".
Tenta obter acesso à câmera e ao microfone do usuário usando navigator.mediaDevices.getUserMedia.
Se a obtenção do stream de mídia for bem-sucedida, inicializa a variável localMediaStream com o stream obtido.
Cria uma instância do objeto Peer (provavelmente de alguma biblioteca externa) com o ID da sala e a configuração do servidor TURN.
Configura manipuladores de eventos para lidar com diferentes eventos do objeto Peer, como erro, abertura da sala e chamada recebida.
Quando uma chamada é recebida (peer.on("call", function (call) {...}), a função responde à chamada, fornecendo o localMediaStream como resposta.
Adiciona manipuladores de eventos para tratar o stream remoto recebido, exibindo-o no elemento HTML adequado.
Inclui lógica para encerrar a chamada quando o botão com o ID "end-call-button" é clicado.

#### `joinRoom()`
A função joinRoom neste código é responsável por permitir que um usuário entre em uma sala existente para participar de uma videochamada. Aqui está uma breve explicação das etapas realizadas por essa função:

Obtém o ID do par de destino (peer) a partir do elemento HTML com o ID "room-input".
Tenta obter acesso à câmera e ao microfone do usuário usando navigator.mediaDevices.getUserMedia.
Se a obtenção do stream de mídia for bem-sucedida, inicializa a variável localMediaStream com o stream obtido.
Cria uma instância do objeto Peer (provavelmente de alguma biblioteca externa) com a configuração do servidor TURN.
Configura manipuladores de eventos para lidar com diferentes eventos do objeto Peer, como erro, abertura da conexão e chamada recebida.
Quando a conexão é estabelecida (peer.on("open", function (id) {...}), inicia uma conexão com o par de destino utilizando o método peer.connect(destPeerId).
Adiciona manipuladores de eventos para lidar com o estado da conexão, como abertura bem-sucedida e erro.
Inicia uma chamada de vídeo para o par de destino usando peer.call(destPeerId, localMediaStream).
Adiciona manipuladores de eventos para tratar o stream remoto recebido, exibindo-o no elemento HTML adequado.
Inclui lógica para encerrar a chamada quando o botão com o ID "end-call-button" é clicado.

### Configuração do Projeto para Execução Online

Atualmente, o projeto está configurado para acessível online para que qualquer pessoa no mundo possa fazer chamadas.

### Como Contribuir
Fique à vontade para contribuir com melhorias, correções de bugs ou sugestões. Abra problemas (issues) ou envie pull requests para colaborar no desenvolvimento deste projeto.

Agradecemos pela sua colaboração!

**Nota:** Certifique-se de configurar e incluir o Firebase Database no seu projeto conforme necessário.
