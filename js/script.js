let conversas = []

const nomeUsuario = prompt("Digite seu nome de usuario")

let nome = { name: nomeUsuario }

const BatePapo = document.querySelector('.bate-papo');
BatePapo.scrollIntoView(false)

function mostrarBatePapo() {

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

    const praBaixo = document.querySelector('.enviarMensagem');
    praBaixo.scrollIntoView(false)
}

setInterval(pegarConversasDoServidor, 3000);

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
    const promessa = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", nome);
    promessa.then(nomeChegou);
    promessa.catch(nomeNaoChegou);
}

function nomeChegou(resposta) {
    console.log("tudo certo")
    console.log(resposta)
}

function nomeNaoChegou() {
    console.log("algo deu errado")
}

/*******************************/
function enviarMensagem() {
    let mensagemDigitada = document.querySelector('input').value;

    let dadosDaMensagem = {
        from: nomeUsuario,
        to: "Todos",
        text: mensagemDigitada,
        type: "message"
    }

    const promessa = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', dadosDaMensagem);
    promessa.then(mensagemChegou);
    promessa.catch(mensagemNaoChegou);
}

function mensagemChegou() {

}

function mensagemNaoChegou() {
    console.log("não chegou")
}

/**************************/

setInterval(verificarUsuario, 5000);

function verificarUsuario() {
    const promessa = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', nome);
    promessa.then(aindaLogado);
    promessa.catch(usuarioSaiu);
}

function aindaLogado() {
    console.log("ainda estou aqui")
}

function usuarioSaiu() {
    console.log("o usuario saiu")
}


