var sorteados = [];
var valorMaximo = 80;
inicio=0;
function sorteio() {
    if (sorteados.length == valorMaximo) {
        alert('Já não há mais! Quer recomeçar?');
        sorteados = [];
        document.getElementById("parag").innerHTML=" ";
        for(var i=1;i<valorMaximo;i++){
            var botao= "B"+i;
            document.getElementById(botao).style.backgroundColor="#CCCCCC";
        }
    }else{
        var sugestao = Math.ceil(Math.random() * valorMaximo); // Escolher um numero ao acaso
        while (sorteados.indexOf(sugestao) >= 0) {  // Enquanto o numero já existir, escolher outro
            sugestao = Math.ceil(Math.random() * valorMaximo);
        }
        sorteados.push(sugestao);
        //mudar a cor do botao
        var botao= "B"+sugestao;
        document.getElementById(botao).style.backgroundColor="#70DB93";
        //escreve o numero sorteado
        document.getElementById("parag").innerHTML="Numero sorteado: " + sugestao;
    }
}

function recomecar() {
    // if(confirm('Tem certeza que quer recomeçar?')){
    document.getElementById("parag").innerHTML=" ";
    sorteados = [];
    for(var i=1;i<valorMaximo;i++){
        var botao= "B"+i;
        document.getElementById(botao).style.backgroundColor="#CCCCCC";
    }
    // }
} 