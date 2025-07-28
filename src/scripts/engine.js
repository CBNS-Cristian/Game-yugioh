const estado = {
    pontuacao:{
        pontuacaoJogador: 0,
        pontuacaoComputador:0,
        caixaPontuacao: document.querySelector('#score-pontos'),
    },
    cartasImagens:{
        avatar: document.querySelector('#carta-imagem'),
        nome: document.querySelector('#carta-nome'),
        tipo: document.querySelector('#carta-tipo'),
    },
    cartasInternas:{
        cartaJogador: document.querySelector('#cartas-jogador'), 
        cartaComputador: document.querySelector('#cartas-computador'),

        cartaDueloJogador: document.querySelector('#cards-campo-jogador'), 
        cartaDueloComputador: document.querySelector('#cards-campo-maquina'), 
    },
    acoes:{
        button: document.querySelector('#proximo-duelo')
    }
}   


const caminhoImg = "src/assets/icons/"
const infoCartas = [
    {
        id:0,
        nome:'Dragão Branco de Olhos Azuis',
        tipo: 'Papel',
        img: `${caminhoImg}dragon.png`,
        ganha:[1],
        perde:[2],
    },
    {
        id:1,
        nome:'Mago Negro',
        tipo: 'Pedra',
        img: `${caminhoImg}magician.png`,
        ganha:[2],
        perde:[0],
    },
    {
        id:2,
        nome:'Exôdia',
        tipo: 'Tesoura',
        img: `${caminhoImg}exodia.png`,
        ganha:[1],
        perde:[2],
    },
]

async function pegarCartaAleatoria(){
    const idAleatorio = Math.floor(Math.random() * infoCartas.length);
    return infoCartas[idAleatorio].id;
}
async function criarImagemCarta(idCarta, camposTotais){
    const cartaCriada = document.createElement("img");
    cartaCriada.setAttribute('height', '100px');
    cartaCriada.setAttribute('src', 'src/assets/icons/card-back.png');
    cartaCriada.setAttribute('data-id', idCarta);
    cartaCriada.classList.add('card')

    if(camposTotais === estado.cartasInternas.cartaJogador.id){
            cartaCriada.addEventListener('mouseover', ()=>{
            mostrarCartaSelecionada(idCarta)
         })
            cartaCriada.addEventListener('click', ()=>{
            colocarNoCampo(cartaCriada.getAttribute('data-id'))
        })
    }
    return cartaCriada;
}
async function colocarNoCampo(idCarta){
    await removerTodasCartas();
    let idCartaComputador = await pegarCartaAleatoria();

    estado.cartasInternas.cartaJogador.style.display = "block"
    estado.cartasInternas.cartaComputador.style.display = "block"

    estado.cartasInternas.cartaDueloJogador.src = infoCartas[idCarta].img;
    estado.cartasInternas.cartaDueloComputador.src = infoCartas[idCartaComputador].img;

    let resultadoDuelo = await checarResultadoDuelo(idCarta, idCartaComputador);

    await atualizarPontuacao();
    await botaoResultado(resultadoDuelo);
}
async function botaoResultado(text){
    estado.acoes.button.innerText = text
    estado.acoes.button.style.display = 'block'
}
async function atualizarPontuacao(){
    estado.pontuacao.caixaPontuacao.innerText =`Win: ${estado.pontuacao.pontuacaoJogador} | Lose: ${estado.pontuacao.pontuacaoComputador}`
}
async function checarResultadoDuelo(idCarta, idCartaComputador){
    let resultadoDuelo = 'Empate'
    let cartaJogador = infoCartas[idCarta]
    if(cartaJogador.ganha.includes(idCartaComputador)){
        resultadoDuelo = 'Ganhou'
        estado.pontuacao.pontuacaoJogador++;
    };
    if(cartaJogador.perde.includes(idCartaComputador)){
        resultadoDuelo = 'Perdeu'
        estado.pontuacao.pontuacaoComputador++;
    };
    return resultadoDuelo;
}
async function removerTodasCartas(){
    let imagemCartas = estado.cartasInternas.cartaComputador.querySelectorAll('img')
    imagemCartas.forEach((img)=> img.remove())

    imagemCartas = estado.cartasInternas.cartaJogador.querySelectorAll('img')
    imagemCartas.forEach((img)=> img.remove())
}
async function mostrarCartaSelecionada(index){
    estado.cartasImagens.avatar.src = infoCartas[index].img;
    estado.cartasImagens.nome.innerHTML = infoCartas[index].nome;
    estado.cartasImagens.tipo.innerHTML = `Attibute: ${infoCartas[index].tipo}`
}
async function repartirCartas(numeroCartas, camposTotais){
    for(let i = 0; i < numeroCartas; i++){
        const cartaAleatoria = await pegarCartaAleatoria();
        const criarCarta = await criarImagemCarta(cartaAleatoria, camposTotais);
        
        document.getElementById(camposTotais).appendChild(criarCarta);
    }
}
async function resetarDuelo(){
    estado.cartasImagens.avatar.src = '';
    estado.acoes.button.style.display='none';

    estado.cartasInternas.cartaDueloJogador.style.display='none'
    estado.cartasInternas.cartaDueloComputador.style.display='none'

    init()
}
function init(){
    repartirCartas(5, estado.cartasInternas.cartaJogador.id)
    repartirCartas(5, estado.cartasInternas.cartaComputador.id)

}
init()