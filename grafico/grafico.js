
const CalHeatMap = require('cal-heatmap');
const { duration } = require('moment');

var data = {
 '2023-12-18': 5,
 '2023-12-19': 10,
 '2023-12-20': 3,
 '2023-12-21': 8,
 '2023-12-22': 6,
 '2023-12-23': 12,
 '2023-12-24': 4,
 '2023-1-1': 24,
 '2023-2-4': 64,
};

var datasjs = {};

Object.keys(data).forEach(function(key) {
 var date = new Date(key);
 var timestamp = Math.floor(date.getTime() / 1000); // Convertir la fecha a timestamp UNIX

 // Transformar los valores como se desee
 var transformedValue = data[key] * 0.5; // Solo un ejemplo de transformación

 datasjs[timestamp] = transformedValue; // Asignar el valor transformado al nuevo objeto
});

console.log(datasjs); // Mostrar el nuevo objeto con fechas en formato timestamp y valores transformados




// const fs = require('fs');
// const Papa = require('papaparse');

function mostrar_datos(date, nb){

 let dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
 let meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

 let diaSemana = dias[date.getDay()];
 let ano = date.getFullYear();
 let mes = meses[date.getMonth()];
 let dia = date.getDate();
 console.log(`La fecha es ${diaSemana}, ${dia} de ${mes} del año ${ano}`);

 let fecha = date.toISOString().split('T')[0];
 datos_historial =  get_datos_historial(valor_completo.id, fecha,'historial_habitos.csv' )
 console.log(datos_historial)

 if (nb === null){
     resultado = 'sin registro <br>'
     duracion_historial = document.getElementById("duracion_historial").value = '0:0:0'
     
 }else{
  duracion_historial = document.getElementById("duracion_historial").value = datos_historial.duracion
  var objetoDatos_historial = document.getElementById("objeto_historial");
  objetoDatos_historial.dataset.objeto = JSON.stringify(datos_historial);
  console.log("Objeto guardado en atributo de datos.");
  // console.log("objeto_guardado:",objeto_habito)
  
  
  resultado = ` <br>  La fecha es ${diaSemana}, ${dia} de ${mes} del año ${ano} </br>  <br> Concentración: ${datos_historial.duracion} - Descanso: ${datos_historial.duracion_descanso} <br/> <br> Hora de inicio: ${datos_historial.start_timer} - Hora de fin: ${datos_historial.end_timer}  <br/> `
}

document.getElementById('form_edicion_historial').style.display = 'none'

document.getElementById('onClick-placeholder').innerHTML = `

<!-- <b>${date}</b>  -->
<br/> <b>${resultado}</b> <br/>


<button id="boton_visibleEdicionHistorial" onclick="visibleEdicionHistorial()">Editar</button>

<!-- with 


<b>${(nb === null ? 'unknown' : nb)}</b> items -->
`;


id_historial = document.getElementById("id_historial_habito").value = valor_completo.id
fecha_historial = document.getElementById("fecha_historial").value = fecha
console.log(id_historial)




var objetoDatos = document.getElementById("objeto_habito_edicion");
objeto_habito = obtenerObjetoHabito(id_historial)
objetoDatos.dataset.objeto = JSON.stringify(objeto_habito);
console.log("Objeto guardado en atributo de datos.");
console.log("objeto_guardado:",objeto_habito)



}


function get_datos_historial(idHabito, fechaHabito, archivo) {
 const data = fs.readFileSync(archivo, 'utf8');
 const records = Papa.parse(data, {
     header: true,
     skipEmptyLines: true
 }).data;

 for (let record of records) {
     if (parseInt(record.id_habito) === idHabito && record.fecha === fechaHabito) {
         console.log(record); // Imprime todo el registro en la consola
         return record
     }
 }
}


function transformarDatos(idHabito, archivo) {
   const data = fs.readFileSync(archivo, 'utf8');
   const records = Papa.parse(data, {
       header: true,
       skipEmptyLines: true
   }).data;

   let datasjs = {};
   for (let record of records) {
       if (parseInt(record.id_habito) === idHabito) {
           //let fecha = record.fecha;
           let duracion = record.duracion;
           // Convertir la fecha a timestamp
           //let timestamp = Math.floor(new Date(fecha).getTime() / 1000);

           let fecha = record.fecha.split('-'); // Suponiendo que la fecha está en formato 'YYYY-MM-DD'
             console.log(fecha)
           //let timestamp = Date.UTC(fecha[0], fecha[1] - 1, fecha[2] ) / 1000;

           let fechaUTC = new Date(Date.UTC(fecha[0], fecha[1] - 1, fecha[2]));
           let fechaLocal = fechaUTC.toLocaleString();
           fechaUTC.setDate(fechaUTC.getDate() + 1); 
           let timestamp = fechaUTC.getTime() / 1000;

           //let timestamp = Math.floor(new Date(fechaLocal).getTime() / 1000);
           // Convertir la duración a minutos
           let [h, m, s] = duracion.split(':').map(Number);
           let minutos = h * 60 + m + s / 60;
           minutos = Math.trunc(minutos * 100) / 100;
           console.log(fecha)
           console.log(duracion)
           console.log(minutos)
           datasjs[timestamp] = minutos;
       }
   }
   console.log(datasjs);

   var cal = new CalHeatMap();
   cal.init({
     data: datasjs,
     start: new Date(),
    //  start: new Date(Date.UTC(2023, 1)), 
     /*
     subDomainTextFormat: function (date, value) {
         return value;
       },
       */
     /*
     start: new Date(), 
     minDate: new Date(Date.UTC(2023, 1)), 
     maxDate: new Date(Date.UTC(2023, 12)), 
     */
     id: "cal-heatmap",
     domain: "year",
     range: 1,
     cellRadius: 3,
     subDomain: "day",
     cellSize: 15,
     //cellpadding: 3,
     highlight: "now",
     //range: 4
     //domainGutter: 15,
     //itemName: window.innerWidth < 768 ? ["week", "day"] : ["month", "day"], // Cambiar la unidad de tiempo según el ancho de la ventana
     itemName: "minuto",
     previousSelector: '#minDate-previous_year',
     nextSelector: '#minDate-next_year',
     
     onClick: function (date, nb) {
         mostrar_datos(date, nb)
     },
     
     tooltip: true,
     //legend: [0, 1, 5, 10,25,100],
     legend: [5, 25, 50 , 100],
     legendColors: {
       min: "#49c94f",
       max: "#055585",
       empty: "white",
       base: "#525467",
       overflow: "black"
      },
 });

 
 var cal2 = new CalHeatMap();
       cal2.init({
         itemSelector: '#mes_habito',
         domain: 'month',
         subDomain: 'x_day',
         data: datasjs,
         start: new Date(),
         highlight: "now",
         cellSize: 20,
         cellRadius: 3,
         cellPadding: 5,
         range: 1,
         domainMargin: 20,
         animationDuration: 800,
         domainDynamicDimension: false,
         previousSelector: '#minDate-previous',
         nextSelector: '#minDate-next',
         itemName: "minuto",
         tooltip: true,
         subDomainTextFormat: '%d',
         label: {
           position: 'left',
           offset: {
             x: 20,
             y: 35,
           },
           width: 100,
         },
         onClick: function (date, nb) {
             mostrar_datos(date, nb)
           },
           legend: [5, 25, 50 , 100],
           legendColors: {
             min: "#49c94f",
             max: "#055585",
             empty: "white",
             base: "#525467",
             overflow: "white"
            },
            
            //legendColors: ['#00ff00', '#0000ff', '#ffff00'],




        //  legendColors: {
        //    min: '#efefef',
        //    max: 'steelblue',
        //    empty: 'white'
        //  }
       });
 /*
   document.getElementById('minDate-previous').addEventListener('click', function(e) {
     e.preventDefault();
     if (!cal.previous()) {
         this.disabled = true; // Desactiva el botón 'minDate-previous'
     }
     document.getElementById('minDate-next').disabled = false; // Activa el botón 'minDate-next'
 });
 
 document.getElementById('minDate-next').addEventListener('click', function(e) {
     e.preventDefault();
     if (!cal.next()) {
         this.disabled = true; // Desactiva el botón 'minDate-next'
     }
     document.getElementById('minDate-previous').disabled = false; // Activa el botón 'minDate-previous'
 });
 */
 
 
}

// Uso de la función

var valor_completo


function definir(value) {
 //const { ipcRenderer } = require('electron')

    // ipcRenderer.on('button-value', function (event, value) {
       
         document.getElementById('cal-heatmap').innerHTML = "";
         document.getElementById('mes_habito').innerHTML = "";

         document.getElementById('header').innerText = value.nombre;

         valor_completo = value
         document.getElementById('onClick-placeholder').innerHTML = ''
         document.getElementById('form_edicion_historial').style.display = 'none'

         transformarDatos(value.id, 'historial_habitos.csv');

         Ver_horas_invertidas_habito(value.id+'')
         dias_totales_invertidos_habito(value.id+'')

         let botones_prev_next = document.getElementsByClassName('botones_nyp')
         for (let boton of botones_prev_next) {
          boton.style.display = 'block';
        }

        
   //  });
 
}

//definir()



function mostrar_flechas() {
  var x = document.getElementsByClassName('center_div');
  
  for(var i =0; i < x.length; i++){

    if (x[i].style.display === "none") {
      x[i].style.display = "block";
    } 
  }
}

function convertirATiempoEnMinutos(tiempo) {
  let partes = tiempo.split(':');
  let horas = parseInt(partes[0]);
  let minutos = parseInt(partes[1]);
  let segundos = parseInt(partes[2]);
  return horas * 60 + minutos + segundos / 60;
}


function graficar_semana(id, valorObjetivo) {
    // Leer los datos del archivo CSV
    const datos = fs.readFileSync('historial_habitos.csv', 'utf8');
    const registros = Papa.parse(datos, {
        header: true,
        skipEmptyLines: true
    }).data;


    let hoy_fecha = new Date();
    let diaSemana_fecha = hoy_fecha.getDay();
    let lunes_fecha = new Date(hoy_fecha);
    lunes_fecha.setDate(hoy_fecha.getDate() - diaSemana_fecha + (diaSemana_fecha == 0 ? -6 : 1)); // Ajusta al lunes de esta semana
    let domingo_fecha = new Date(lunes_fecha);
    domingo_fecha.setDate(lunes_fecha.getDate() + 6);

    // Obtener la fecha actual y la fecha del lunes de esta semana
    let fechaActual = new Date();
    let diaDeLaSemana = fechaActual.getDay();
    let lunesDeEstaSemana = new Date(fechaActual.setDate(fechaActual.getDate() - diaDeLaSemana + (diaDeLaSemana === 0 ? -7 : 1)));

    lunesDeEstaSemana.setHours(0, 0, 0, 0)
    console.log('lunesDeEstaSemana')
    console.log(lunesDeEstaSemana)
    console.log('lunesDeEstaSemana')



    // Filtrar los datos para obtener solo los de esta semana y el id especificado
    let registrosDeEstaSemana = registros.filter(registro => {
        let fechaDelRegistro = new Date(registro.fecha);
        fechaDelRegistro.setHours(0, 0, 0, 0)
        lunesDeEstaSemana.setDate(lunesDeEstaSemana.getDate() - 1);

        return fechaDelRegistro >= lunesDeEstaSemana && registro.id_habito == id;
    });
    
    console.log('-rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr')
    console.log(registrosDeEstaSemana)
    console.log('-rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr')

    // Preparar los datos para el gráfico
    let etiquetas = registrosDeEstaSemana.map(registro => registro.fecha);
    // let datosParaElGrafico = registrosDeEstaSemana.map(registro => registro.duracion);
    let datosParaElGrafico = registrosDeEstaSemana.map(registro => convertirATiempoEnMinutos(registro.duracion));
    let objeto_fecha = Object.fromEntries(etiquetas.map((key, i) => [key, datosParaElGrafico[i]]));
    console.log(datosParaElGrafico)

    let nombresPorDia = [
      'Lun',
      'Mar',
      'Mié',
      'Jue',
      'Vie',
      'Sáb',
      'Dom'
    ]
    idx_dia = 0
     
    let dataCompleta = {};
    lunes_fecha = moment(lunes_fecha);
    domingo_fecha = moment(domingo_fecha)

    while (lunes_fecha <= domingo_fecha) {
      let fechaStr =  lunes_fecha.format("YYYY-MM-DD");
      dataCompleta[nombresPorDia[idx_dia]+'-'+fechaStr.split("-")[2]] = objeto_fecha[fechaStr] || 0;
      lunes_fecha.add(1, 'days');
      idx_dia = idx_dia + 1
}

console.log(dataCompleta)

etiquetas = Object.keys(dataCompleta);
datosParaElGrafico = Object.values(dataCompleta);

//let valorObjetivo = 5; // Cambia esto por tu valor objetivo

// Crear un array con el valor objetivo para cada día de la semana
let datosObjetivo = etiquetas.map(() => valorObjetivo);

    // Crear el gráfico con Chart.js
    let contexto = document.getElementById('miGrafico').getContext('2d');
    if(window.miGrafico instanceof Chart) {
        window.miGrafico.destroy(); // Destruir el gráfico anterior si existe
    }
    window.miGrafico = new Chart(contexto, {
        type: 'bar',
        data: {
            labels: etiquetas,
            datasets: [{
                label: 'Duración',
                data: datosParaElGrafico,
                backgroundColor: colorSecundario,
                borderColor: colorTerciario,
                borderWidth: 1
            }, {
              label: 'Valor Objetivo',
              data: datosObjetivo,
              type: 'line',
              fill: false,
              borderColor: colorPrimario,
              backgroundColor: colorPrimario,
              pointRadius: 0,
              borderWidth: 2,
              
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Llamar a la función con el id que quieres graficar


function agregarEditarHabito() {
  id_habitoObjet = document.getElementById("id_historial_habito")
  id_habito = id_habitoObjet.value
  duracion_historialobject = document.getElementById("duracion_historial")

  var objeto_historial_leido = {}
  var objeto_historial = document.getElementById("objeto_historial");
  var objetoGuardado_historial = objeto_historial.dataset.objeto;
  if (objetoGuardado_historial) {
    objeto_historial_leido = JSON.parse(objetoGuardado_historial);
      console.log("Objeto recuperado:", objeto_historial_leido);
  } else {
      console.log("No hay ningún objeto guardado.");
  }

  fecha_historial = document.getElementById("fecha_historial").value

  duracion_historial = duracion_historialobject.value
  let data = fs.readFileSync('historial_habitos.csv', 'utf8');
  let records = Papa.parse(data, {header: true}).data;

  console.log('se guardara en -', id_habito, ' el tiempo', duracion_historial, 'en-', objeto_historial_leido.fecha)

  let hoy = moment().format('YYYY-MM-DD');
  let hora = moment().format('HH:mm:ss');

  fechaSeleccionada = objeto_historial_leido.fecha

  let existeHoy = records.some(record => moment(record.fecha).format('YYYY-MM-DD') === fecha_historial && record.id_habito === id_habito);
  console.log(existeHoy)
  console.log("--eeeeeeeeeeeeeeettttttttttttttttttteeeeeuuuuuuuuuuuuaaaaaaaaaaaaaaaaaaaaaaaaaaa")
  if (!existeHoy) {
      let nueva_fila = {
          id_habito: id_habito,
          fecha: fecha_historial,
          duracion: duracion_historial,
          start_timer: hora,
          end_timer: 0,
          duracion_descanso: 0
      };
      records.push(nueva_fila);
  }else{
    records.forEach(record => {
      if(moment(record.fecha).format('YYYY-MM-DD') === fechaSeleccionada && record.id_habito === id_habito) {
          record.duracion = duracion_historial;
      }
  });
  }

  let csv = Papa.unparse(records);
  fs.writeFileSync('historial_habitos.csv', csv);
  
  var objetoDatos = document.getElementById("objeto_habito_edicion");
  var objetoGuardado = objetoDatos.dataset.objeto;
  if (objetoGuardado) {
      var objeto = JSON.parse(objetoGuardado);
      console.log("Objeto recuperado:", objeto);
      definir(objeto)
      generarGraficoDuracionPorAnio(objeto.id+'', objeto.objetivo);
      graficar_semana(objeto.id+'', objeto.objetivo);
  } else {
      console.log("No hay ningún objeto guardado.");
  }
  id_habitoObjet.value = ''
  duracion_historialobject.value = ''
  objetoDatos.dataset = {}


}


function visibleEdicionHistorial(){
  document.getElementById('boton_visibleEdicionHistorial').style.display = 'none'
  document.getElementById('form_edicion_historial').style.display = 'block'
}