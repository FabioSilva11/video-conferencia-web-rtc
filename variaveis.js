function pedirPermissao() {
  navigator.mediaDevices.getUserMedia({ audio: true, video: true })
    .then(function (stream) {
      // Permissões concedidas, faça algo com o stream
    })
    .catch(function (error) {
      console.error('Erro ao obter permissões:', error);
      // Tentar novamente após um curto período de tempo
      setTimeout(pedirPermissao, 2000);
    });
}

// Chame a função para iniciar o processo de permissão
pedirPermissao();

// Adicione as credenciais do servidor TURN aqui
let turnConfig = {
  iceServers: [
    {
      urls: "turn:a.relay.metered.ca:443?transport=tcp",
      username: "83eebabf8b4cce9d5dbcb649",
      credential: "2D7JvfkOQtBdYW3R",
    },
  ],
};
