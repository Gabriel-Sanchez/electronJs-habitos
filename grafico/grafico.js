const { ipcRenderer } = require('electron')

function definir() {
    return new Promise((resolve, reject) => {

        ipcRenderer.on('button-value', function (event, value) {
            ciclos = value.count;
            tiempoTrabajo = Number(value.work_time) * 60;
            tiempoDescanso = Number(value.short_break) * 60;

            document.getElementById('header').innerText = value.nombre;
            objeto_habito = value

            resolve([ciclos, tiempoTrabajo, tiempoDescanso]);
        });
    });
}
definir()

// const d3 = require('d3');
// const CalHeatMap = require('cal-heatmap');
// Resto de tu código...

// import * as d3 from 'd3';
// import CalHeatMap from 'cal-heatmap';

const d3 = require('d3')



// var d3 = require('d3@3');

// Generar datos de prueba
var testData = [];
for (var month = 0; month < 12; month++) {
  for (var day = 0; day < 31; day++) {
    testData.push({
      day: day,
      month: month,
      value: Math.floor(Math.random() * 100) // Valor aleatorio entre 0 y 100
    });
  }
}

// Crear escala de colores para el heatmap
var colorScale = d3.scale.linear()
  .domain([0, 100])
  .range(['white', 'red']);

// Seleccionar el cuerpo del documento y agregar un SVG
var svg = d3.select('body')
  .append('svg')
  .attr('width', 800)
  .attr('height', 800);

// Crear el heatmap
svg.selectAll('rect')
  .data(testData)
  .enter()
  .append('rect')
  .attr('x', function(d) { return d.day * 25; })
  .attr('y', function(d) { return d.month * 65; })
  .attr('width', 20)
  .attr('height', 60)
  .attr('fill', function(d) { return colorScale(d.value); });
