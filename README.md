## Integração do Firebase Database para Projeto de Videoconferência e chamada de video aleatoria

Este projeto tem como objetivo utiliza o Firebase Database para armazenar informações relacionadas às salas de vídeo conferência. para posibilitar chamadas de video como as do omigle Abaixo estão as funções principais e sua explicação:

### Constantes
Definimos constantes para o prefixo e sufixo do `room_id`:
```javascript
const PREFIX = "DELTA";
const SUFFIX = "MEET";
```

### Variáveis
- `room_id`: Armazena o identificador da sala.
- `getUserMedia`: Obtém a função `getUserMedia` com suporte a diferentes navegadores.
- `local_stream`: Armazena o stream local.
- `peer`: Objeto para gerenciar a comunicação peer-to-peer.
- `currentPeer`: Armazena o objeto de chamada atual.

### Funções

#### `createRoom()`
Cria uma nova sala de vídeo conferência.
- Obtém o número da sala do input.
- Inicializa o Peer com o `room_id`.
- Aguarda a conexão do peer.
- Inicializa o stream local.
- Notifica que está aguardando a entrada do peer.

#### `setLocalStream(stream)`
Define o stream local no elemento de vídeo.
- Recebe o stream como parâmetro.
- Configura o vídeo local e inicia a reprodução.

#### `setRemoteStream(stream)`
Define o stream remoto no elemento de vídeo.
- Recebe o stream como parâmetro.
- Configura o vídeo remoto e inicia a reprodução.

#### `hideModal()`
Oculta o modal de entrada.

#### `notify(msg)`
Exibe uma notificação na interface.
- Recebe uma mensagem como parâmetro.
- Exibe a mensagem por 3 segundos e oculta.

#### `joinRoom()`
Entra em uma sala existente.
- Obtém o número da sala do input.
- Inicializa o Peer.
- Aguarda a conexão do peer.
- Inicializa o stream local.
- Notifica que está se juntando ao peer.
- Realiza a chamada para a sala existente.

### Configuração do Projeto para Execução Online

Atualmente, o projeto está configurado para funcionar apenas em localhost. O objetivo é torná-lo acessível online para que qualquer pessoa no mundo possa fazer chamadas.

### Como Contribuir
Fique à vontade para contribuir com melhorias, correções de bugs ou sugestões. Abra problemas (issues) ou envie pull requests para colaborar no desenvolvimento deste projeto.

Agradecemos pela sua colaboração!

**Nota:** Certifique-se de configurar e incluir o Firebase Database no seu projeto conforme necessário.
