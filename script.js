
let jogosPorDia = [];
let diaSelecionado = "";
let boletim = [];

document.addEventListener("DOMContentLoaded", () => {
    fetch("jogos.json")
        .then(res => res.json())
        .then(data => {
            jogosPorDia = data;
            renderizarDias();
            if (data.length > 0) {
                selecionarDia(data[0].dia);
            }
        });
});

function renderizarDias() {
    const lista = document.getElementById("dias-lista");
    lista.innerHTML = "";
    jogosPorDia.forEach(dia => {
        const li = document.createElement("li");
        li.textContent = dia.dia;
        li.onclick = () => selecionarDia(dia.dia);
        lista.appendChild(li);
    });
}

function selecionarDia(dia) {
    diaSelecionado = dia;
    document.getElementById("titulo-dia").textContent = "Jogos - " + dia;
    const diaObj = jogosPorDia.find(d => d.dia === dia);
    const listaJogos = document.getElementById("lista-jogos");
    listaJogos.innerHTML = "";

    diaObj.jogos.forEach(jogo => {
        const div = document.createElement("div");
        div.className = "jogo";
        div.innerHTML = `
            <h4>${jogo.timeCasa} x ${jogo.timeFora} - ${jogo.horario}</h4>
        `;

        for (let mercado in jogo.mercados) {
            const divMercado = document.createElement("div");
            divMercado.className = "mercado";
            divMercado.innerHTML = "<strong>" + mercado + ":</strong><br>";
            for (let op in jogo.mercados[mercado]) {
                const odd = jogo.mercados[mercado][op];
                const span = document.createElement("span");
                span.textContent = `${op} (${odd})`;
                span.onclick = () => selecionarOdd(jogo, mercado, op, odd);
                divMercado.appendChild(span);
            }
            div.appendChild(divMercado);
        }

        listaJogos.appendChild(div);
    });
}

function selecionarOdd(jogo, mercado, selecao, odd) {
    const id = `${jogo.timeCasa}x${jogo.timeFora}-${mercado}-${selecao}`;
    const existente = boletim.find(item => item.id === id);

    if (existente) {
        boletim = boletim.filter(item => item.id !== id);
    } else {
        boletim.push({
            id,
            jogo: `${jogo.timeCasa} x ${jogo.timeFora}`,
            mercado,
            selecao,
            odd
        });
    }

    atualizarBoletim();
}

function atualizarBoletim() {
    const container = document.getElementById("boletim-apostas");
    if (boletim.length === 0) {
        container.innerHTML = "<p>Nenhuma aposta selecionada</p>";
        return;
    }

    let html = "<ul>";
    let total = 1;
    boletim.forEach(aposta => {
        html += `<li>${aposta.jogo} - ${aposta.mercado} - ${aposta.selecao} @ ${aposta.odd}</li>`;
        total *= parseFloat(aposta.odd);
    });
    html += "</ul>";
    html += `<p><strong>Retorno Potencial:</strong> R$ ${(total * 10).toFixed(2)} (apostando R$10)</p>`;
    html += `<button onclick="limparBoletim()">Limpar</button>`;
    container.innerHTML = html;
}

function limparBoletim() {
    boletim = [];
    atualizarBoletim();
}
