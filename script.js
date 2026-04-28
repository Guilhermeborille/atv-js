google.charts.load('current', { 'packages': ['corechart', 'geochart', 'table'] });
google.charts.setOnLoadCallback(desenharGraficos);

var registrosDoencas = JSON.parse(localStorage.getItem("registro")) || [];



document.querySelectorAll(".form-doenca").forEach(form => {
    form.addEventListener("submit", function(e){
        e.preventDefault();
        
        let dados = new FormData(form)
        let pais = dados.get("pais");
        let doenca = e.submitter.value;
        let data = new Date

        let registro = new RegistroDoença(doenca,pais,data)
        registrosDoencas.push(registro)
        localStorage.setItem("registro", JSON.stringify(registrosDoencas));
        desenharGraficos()
        console.log(registro)
    })
})

const clock = () => {
    const dataAtual = new Date()

    const horas = dataAtual.getHours().toString().padStart(2, '0')
    const minutos = dataAtual.getMinutes().toString().padStart(2, '0')
    const segundos = dataAtual.getSeconds().toString().padStart(2, '0')

    document.querySelector('#relogio').innerText = `${horas}:${minutos}:${segundos}`
    
    const ano = dataAtual.getFullYear()
    const mes = (dataAtual.getMonth() + 1).toString().padStart(2, '0')
    const dia = dataAtual.getDate().toString().padStart(2, '0')
    
    document.querySelector('#data').innerText = `${dia}/${mes}/${ano}`
}


setInterval(clock, 1000)

function RegistroDoença(doenca, pais, data) {
    this.doenca = doenca
    this.pais = pais
    this.data = data
}


function desenharGraficos() {
    let casosDoencas = {
        covidEua: casosDoenca("covid","Estados unidos"),
        covidBrasil: casosDoenca("covid","Brasil"),
        covidChina: casosDoenca("covid","China"),
        covidRussia: casosDoenca("covid","Russia"),
        covidAustralia: casosDoenca("covid","Australia"),
    
        mpoxEua: casosDoenca("mpox","Estados unidos"),
        mpoxBrasil: casosDoenca("mpox","Brasil"),
        mpoxChina: casosDoenca("mpox","China"),
        mpoxRussia: casosDoenca("mpox","Russia"),
        mpoxAustralia: casosDoenca("mpox","Australia"),
    
        ebolaEua: casosDoenca("ebola","Estados unidos"),
        ebolaBrasil: casosDoenca("ebola","Brasil"),
        ebolaChina: casosDoenca("ebola","China"),
        ebolaRussia: casosDoenca("ebola","Russia"),
        ebolaAustralia: casosDoenca("ebola","Australia")
    }
    graficoBarrasPrincipal(casosDoencas)
    graficoCovid(casosDoencas)
    graficoMpox(casosDoencas)
    tabelaEbola(casosDoencas)
    graficoEbola(casosDoencas)
    atualizarCasos()

    
}

function graficoBarrasPrincipal(casosDoencas) {
    let data = google.visualization.arrayToDataTable([
        ['pais', 'COVID', 'MPOX', 'EBOLA'],
        ['Australia', casosDoencas.covidAustralia, casosDoencas.mpoxAustralia, casosDoencas.ebolaAustralia],
        ['Brasil', casosDoencas.covidBrasil, casosDoencas.mpoxBrasil, casosDoencas.ebolaBrasil],
        ['China', casosDoencas.covidChina, casosDoencas.mpoxChina, casosDoencas.ebolaChina],
        ['EUA', casosDoencas.covidEua, casosDoencas.mpoxEua, casosDoencas.ebolaEua],
        ['Russia', casosDoencas.covidRussia, casosDoencas.mpoxRussia, casosDoencas.ebolaRussia]
    ])

    let options = {
        bars: 'horizontal',
        colors: ['#008B11', '#960000', '#8F007B'],
        
    }

    var grafico = new google.visualization.BarChart(
        document.getElementById('graficoPrincipal')
    );

    grafico.draw(data,options);
}

function casosDoenca(doenca, pais){
    if(pais === undefined){
        return registrosDoencas.reduce((acumulador, item) =>{
           return item.doenca === doenca ? acumulador + 1 : acumulador
        }, 0)
    }
    
    return registrosDoencas.reduce((acumulador, item) =>{
        return (item.doenca === doenca && item.pais === pais )? acumulador + 1 : acumulador
    }, 0)

}

function atualizarCasos(){
    document.querySelectorAll(".total-casos").forEach(element => {
        const doenca = element.dataset.doenca;
        element.innerText = `Casos registrados: ${casosDoenca(doenca)}`;
    });

}

function graficoCovid(casosDoencas) {
    let data = google.visualization.arrayToDataTable([
        ['pais', 'COVID'],
        ['Australia', casosDoencas.covidAustralia],
        ['Brazil', casosDoencas.covidBrasil],
        ['China', casosDoencas.covidChina],
        ['United States', casosDoencas.covidEua],
        ['Russia', casosDoencas.covidRussia]
    ])

    console.log(casosDoencas.covidAustralia)

    let options = {
        title: 'Casos de COVID-19 por país',
        colors: ['#008B11']
    }

    let grafico = new google.visualization.GeoChart(
        document.getElementById('graficoCovid')
    );

    grafico.draw(data,options);
}

function graficoMpox(casosDoencas) {
    let data = google.visualization.arrayToDataTable([
        ['pais', 'MPOX'],
        ['Australia', casosDoencas.mpoxAustralia],
        ['Brazil', casosDoencas.mpoxBrasil],
        ['China', casosDoencas.mpoxChina],
        ['United States', casosDoencas.mpoxEua],
        ['Russia', casosDoencas.mpoxRussia]
    ])

    let options = {
        title: 'Casos de MPOX por país',
        colors: ['#8B0000']
    }

    let grafico = new google.visualization.GeoChart(
        document.getElementById('graficoMPOX')
    );

    grafico.draw(data,options);
}

function tabelaEbola(casosDoencas) {
    let data = google.visualization.arrayToDataTable([
        ['pais', 'Casos Ebola'],
        ['Australia', String(casosDoencas.ebolaAustralia)],
        ['Brazil', String(casosDoencas.ebolaBrasil)],
        ['China', String(casosDoencas.ebolaChina)],
        ['United States', String(casosDoencas.ebolaEua)],
        ['Russia', String(casosDoencas.ebolaRussia)]
    ])

    let options = {
        showRowNumber: false,
        width: '100%',
        height: '100%',
        cssClassNames: {
            headerRow: 'header-row',
            tableRow: 'table-row',
            oddTableRow: 'odd-table-row',
        }
    }

    let grafico = new google.visualization.Table(
        document.getElementById('tabelaEbola')
    );

    grafico.draw(data,options);
}

function graficoEbola(casosDoencas) {
    let data = google.visualization.arrayToDataTable([
        ['pais', 'EBOLA'],
        ['Australia', casosDoencas.ebolaAustralia],
        ['Brazil', casosDoencas.ebolaBrasil],
        ['China', casosDoencas.ebolaChina],
        ['United States', casosDoencas.ebolaEua],
        ['Russia', casosDoencas.ebolaRussia]
    ])

    let options = {
        title: 'Casos de EBOLA por país',
        is3D: true,
        colors: ['#8F007B', '#7B008F', '#5B005B', '#3B003B', '#1B001B'],
        height: 300
    }

    let grafico = new google.visualization.PieChart(
        document.getElementById('graficoEbola')
    );

    grafico.draw(data,options);
}