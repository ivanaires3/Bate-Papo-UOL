let conversas = []

const nomeUsuario = { name: prompt("Digite seu nome de usuario") }

function mostrarBatePapo() {

    const BatePapo = document.querySelector('.bate-papo');

    BatePapo.innerHTML = '';

    for (let i = 0; i < conversas.length; i++) {
        if (conversas[i].type === "status") {
            let template = `
        <div class="mensagem on-off">
            <p><strong>${conversas[i].from}</strong> para <strong>${conversas[i].to}</strong>: ${conversas[i].text}</p>
        </div>
        `;

            BatePapo.innerHTML = BatePapo.innerHTML + template;
        } else if (conversas[i].type === "private_message") {
            let template = `
        <div class="mensagem reservadamente">
            <p><strong>${conversas[i].from}</strong> para <strong>${conversas[i].to}</strong>: ${conversas[i].text}</p>
        </div>
        `;

            BatePapo.innerHTML = BatePapo.innerHTML + template;
        } else {
            let template = `
        <div class="mensagem">
            <p><strong>${conversas[i].from}</strong> para <strong>${conversas[i].to}</strong>: ${conversas[i].text}</p>
        </div>
        `;

            BatePapo.innerHTML = BatePapo.innerHTML + template;
        }
    }

}

pegarConversasDoServidor();

function pegarConversasDoServidor() {
    const promessa = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages')
    promessa.then(conversaChegou);
    promessa.catch(conversaNaoChegou);
}

function conversaChegou(resposta) {
    conversas = resposta.data;

    mostrarBatePapo();
}

function conversaNaoChegou() {
    console.log("deu ruim")
}

entrarNaSala();

function entrarNaSala() {
    const promessa = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", nomeUsuario);
    promessa.then(nomeChegou);
    promessa.catch(nomeNaoChegou);
}

function nomeChegou() {
    console.log("tudo certo")
}

function nomeNaoChegou() {
    console.log("algo deu errado")
}

/**************************/

setInterval(verificarUsuario, 5000);

function verificarUsuario() {
    const promessa = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', nomeUsuario);
    promessa.then(aindaLogado);
    promessa.catch(usuarioSaiu);
}

function aindaLogado() {
    console.log("ainda estou aqui")
}

function usuarioSaiu() {
    console.log("o usuario saiu")
}


