let conversas = []

let nomeUsuario = prompt("Digite seu nome de usuario")

let nome = { name: nomeUsuario }

let online = []

const BatePapo = document.querySelector('.bate-papo');

entrarNaSala();

function entrarNaSala() {

    const promessa = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", nome);
    promessa.then(nomeChegou);
    promessa.catch(nomeNaoChegou);
}

function nomeChegou() {
    let entrou = `
    <div class="mensagem on-off" data-test="message">
        <p><strong>${nome.name}</strong> entra na sala...</p>
    </div>
    `;

    BatePapo.innerHTML = BatePapo.innerHTML + entrou;

    const praBaixo = document.querySelector('.enviarMensagem');
    praBaixo.scrollIntoView(false)
}
let usuarioInvalido;

function nomeNaoChegou(erro) {
    usuarioInvalido = erro.response.status;
    while (usuarioInvalido === 400) {
        alterarNome();
    }
}

function alterarNome() {
    let novoNome = { name: prompt("Este nome ja esta em uso, escolha outro nome") }
    while (novoNome === nomeUsuario) {
        novoNome = { name: prompt("Este nome ja esta em uso, escolha outro nome") }
    }
    usuarioInvalido = null
    nome = novoNome;
    entrarNaSala()
}

function mostrarBatePapo() {

    BatePapo.innerHTML = '';

    for (let i = 0; i < conversas.length; i++) {
        if (conversas[i].type === "status") {
            let template = `
        <div class="mensagem on-off" data-test="message">
            <p><strong>${conversas[i].from}</strong> ${conversas[i].text}</p>
        </div>
        `;

            BatePapo.innerHTML = BatePapo.innerHTML + template;
        } else if (conversas[i].type === "private_message") {
            let template = `
        <div class="mensagem reservadamente" data-test="message">
            <p><strong>${conversas[i].from}</strong> para <strong>${conversas[i].to}</strong>: ${conversas[i].text}</p>
        </div>
        `;

            BatePapo.innerHTML = BatePapo.innerHTML + template;
        } else {
            let template = `
        <div class="mensagem" data-test="message">
            <p><strong>${conversas[i].from}</strong> para <strong>${conversas[i].to}</strong>: ${conversas[i].text}</p>
        </div>
        `;

            BatePapo.innerHTML = BatePapo.innerHTML + template;
        }
    }
}

pegarConversasDoServidor();
setInterval(pegarConversasDoServidor, 3000)

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

/*******************************/
function enviarMensagem() {
    let mensagemDigitada = document.querySelector('input').value;

    let mensagem = `
    <div class="mensagem">
        <p><strong>${nome.name}</strong> para <strong>Todos</strong>: ${mensagemDigitada}</p>
    </div>
    `;

    BatePapo.innerHTML = BatePapo.innerHTML + mensagem

    let dadosDaMensagem = {
        from: nome.name,
        to: "Todos",
        text: mensagemDigitada,
        type: "message"
    }

    const promessa = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', dadosDaMensagem);
    promessa.then(mensagemChegou);
    promessa.catch(mensagemNaoChegou);

    document.querySelector('input').value = ''
}

function mensagemChegou() {
    const praBaixo = document.querySelector('.enviarMensagem');
    praBaixo.scrollIntoView(false)

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
    alert("Você foi desconectado, a pagina será reiniciada")
    alert('Se o problema persistir entre em contato com o suporte')
    location.reload(true)
}