let conversas = []

let nomeUsuario = prompt("Digite seu nome de usuario")

let nome = { name: nomeUsuario }

const BatePapo = document.querySelector('.bate-papo');

entrarNaSala();

function entrarNaSala() {

    const promessa = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", nome);
    promessa.then(nomeChegou);
    promessa.catch(nomeNaoChegou);
}

function nomeChegou() {

    pegarConversasDoServidor();
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
        } else if (conversas[i].to === "Todos") {
            let template = `
        <div class="mensagem" data-test="message">
            <p><strong>${conversas[i].from}</strong> para <strong>${conversas[i].to}</strong>: ${conversas[i].text}</p>
        </div>
        `;

            BatePapo.innerHTML = BatePapo.innerHTML + template;
        } else if (conversas[i].type === "private_message" && conversas[i].to === nome.name) {
            let template = `
        <div class="mensagem reservadamente" data-test="message">
            <p><strong>${conversas[i].from}</strong> para <strong>${conversas[i].to}</strong>: ${conversas[i].text}</p>
        </div>
        `;

            BatePapo.innerHTML = BatePapo.innerHTML + template;
        } else if (conversas[i].type === "private_message" && conversas[i].to !== nome.name) {
            let template = `
        <div class="mensagem reservadamente none" data-test="message">
            <p><strong>${conversas[i].from}</strong> para <strong>${conversas[i].to}</strong>: ${conversas[i].text}</p>
        </div>
        `;

            BatePapo.innerHTML = BatePapo.innerHTML + template;
        }
    }
}

function pegarConversasDoServidor() {
    const promessa = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages')
    promessa.then(conversaChegou);
    promessa.catch(conversaNaoChegou);
}

function conversaChegou(resposta) {
    conversas = resposta.data;

    mostrarBatePapo();

    setInterval(atualizarConversasDoServidor, 3000)

    const praBaixo = document.querySelector('.enviarMensagem');
    praBaixo.scrollIntoView(false)
}

function conversaNaoChegou() {
    console.log("deu ruim")
}

function atualizarConversasDoServidor() {
    const promessa = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages')
    promessa.then(conversaAtualizou);
    promessa.catch(conversaNaoAtualizou);
}

function conversaAtualizou(resposta) {
    conversas = resposta.data;

    mostrarBatePapo();
}

function conversaNaoAtualizou() {
    console.log("deu ruim")
}


/*******************************/
function enviarMensagem() {
    let mensagemDigitada = document.querySelector('input').value;

    let dadosDaMensagem = {
        from: `${nome.name}`,
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
    atualizarConversasDoServidor()

}

function mensagemNaoChegou() {
    window.location.reload()
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
    window.location.reload()
}

document.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        const botao = document.querySelector('button');

        botao.click();
    }
})
