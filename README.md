# Chamada de Vídeo usando WebRTC e PeerJS

Este projeto visa possibilitar chamadas de vídeo semelhantes às do Omegle. Abaixo estão as funções principais e suas explicações:

## Instalação

1. Inclua o script do PeerJS no seu HTML:

```html
<script src="https://unpkg.com/peerjs@1.5.2/dist/peerjs.min.js"></script>
```

2. Certifique-se de ter o Firebase Database configurado conforme necessário.

## Constantes

```javascript
var peer;
let localMediaStream = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
var devInfo = document.getElementById("info-messages");
```

## Variáveis

- **peer:** Declaração global da variável fora das funções para ser acessível globalmente.
- **localMediaStream:** Inicialmente é uma variável global, mas é reatribuída dentro das funções `createRoom` e `joinRoom`.
- **devInfo:** Representa o elemento HTML com o ID "info-messages".
  
## Credenciais do Servidor TURN

Adicione as credenciais do servidor TURN no objeto `turnConfig`:

```javascript
let turnConfig = {
  iceServers: [
    {
      urls: "turn:a.relay.metered.ca:443?transport=tcp",
      username: "83eebabf8b4cce9d5dbcb649",
      credential: "2D7JvfkOQtBdYW3R",
    },
  ],
};
```

## Funções

### `createRoom()`

A função `createRoom` é responsável por criar uma sala de comunicação para videochamadas. Aqui está uma breve explicação das etapas realizadas pela função:

1. Obtém o ID da sala a partir do elemento HTML com o ID "room-input".
2. Tenta obter acesso à câmera e ao microfone do usuário usando `navigator.mediaDevices.getUserMedia`.
3. Se a obtenção do stream de mídia for bem-sucedida, inicializa a variável `localMediaStream` com o stream obtido.
4. Cria uma instância do objeto Peer com o ID da sala e a configuração do servidor TURN.
5. Configura manipuladores de eventos para lidar com diferentes eventos do objeto Peer, como erro, abertura da sala e chamada recebida.
6. Quando uma chamada é recebida, a função responde à chamada, fornecendo o `localMediaStream` como resposta.
7. Adiciona manipuladores de eventos para tratar o stream remoto recebido, exibindo-o no elemento HTML adequado.
8. Inclui lógica para encerrar a chamada quando o botão com o ID "end-call-button" é clicado.

### `joinRoom()`

A função `joinRoom` permite que um usuário entre em uma sala existente para participar de uma videochamada. Aqui está uma breve explicação das etapas realizadas por essa função:

1. Obtém o ID do par de destino (peer) a partir do elemento HTML com o ID "room-input".
2. Tenta obter acesso à câmera e ao microfone do usuário usando `navigator.mediaDevices.getUserMedia`.
3. Se a obtenção do stream de mídia for bem-sucedida, inicializa a variável `localMediaStream` com o stream obtido.
4. Cria uma instância do objeto Peer com a configuração do servidor TURN.
5. Configura manipuladores de eventos para lidar com diferentes eventos do objeto Peer, como erro, abertura da conexão e chamada recebida.
6. Quando a conexão é estabelecida, inicia uma conexão com o par de destino utilizando o método `peer.connect(destPeerId)`.
7. Adiciona manipuladores de eventos para lidar com o estado da conexão, como abertura bem-sucedida e erro.
8. Inicia uma chamada de vídeo para o par de destino usando `peer.call(destPeerId, localMediaStream)`.
9. Adiciona manipuladores de eventos para tratar o stream remoto recebido, exibindo-o no elemento HTML adequado.
10. Inclui lógica para encerrar a chamada quando o botão com o ID "end-call-button" é clicado.


## Execução Online

Atualmente, o projeto está configurado para ser acessível online, permitindo que qualquer pessoa no mundo faça chamadas.

## Como Contribuir

Sinta-se à vontade para contribuir com melhorias, correções de bugs ou sugestões. Abra problemas (issues) ou envie pull requests para colaborar no desenvolvimento deste projeto.

Agradecemos pela sua colaboração! Caso note problemas de compatibilidade em alguns navegadores, como no iPhone (iOS), por favor, relate. Até o momento, foi testado no Xiaomi Redmi Note e no PC, mas é necessário verificar a compatibilidade em outros dispositivos e navegadores.
