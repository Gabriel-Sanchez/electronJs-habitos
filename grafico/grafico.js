
const CalHeatMap = require('cal-heatmap');

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
     resultado = 'sin registro'
     
 }else{
     
     resultado = ` <br>  La fecha es ${diaSemana}, ${dia} de ${mes} del año ${ano} </br>  <br> Concentración: ${datos_historial.duracion} - Descanso: ${datos_historial.duracion_descanso} <br/> <br> Hora de inicio: ${datos_historial.start_timer} - Hora de fin: ${datos_historial.end_timer}  <br/> `
 }



 document.getElementById('onClick-placeholder').innerHTML = `

 <!-- <b>${date}</b>  -->
<br/> <b>${resultado}</b> <br/>
 
 <!-- with 

 
 <b>${(nb === null ? 'unknown' : nb)}</b> items -->
`;

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
 });



 var cal2 = new CalHeatMap();
       cal2.init({
         itemSelector: '#mes_habito',
         domain: 'month',
         subDomain: 'x_day',
         data: datasjs,
         start: new Date(),
         highlight: "now",
         cellSize: 15,
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
         label: {
           position: 'left',
           offset: {
             x: 20,
             y: 35,
           },
           width: 110,
         },
         onClick: function (date, nb) {
             mostrar_datos(date, nb)
           },
         //legend: [20, 40, 60, 80],
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

         transformarDatos(value.id, 'historial_habitos.csv');

        
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

