const fs = require('fs');
const Papa = require('papaparse');
const moment = require('moment');

var data_historial
var records

function leer_archivo_historial(archivo){
    const data = fs.readFileSync(archivo, 'utf8');
          const records = Papa.parse(data, {
              header: true,
              skipEmptyLines: true
          }).data;

    //console.log(records)
    return records
}

function existeRegistroHoy(records, id) {
    // Obtén la fecha de hoy en formato yyyy-mm-dd
    //const hoy = new Date().toISOString().split('T')[0];
    const hoy = new Date().toLocaleDateString('en-CA');
    
    // console.log(records)
    // console.log(id)
    // console.log(hoy)

    // Utiliza el método 'some' para buscar un registro que cumpla con la condición
    return records.some(record => record.id_habito == id && record.fecha == hoy);
}

// // Uso de la función
// const id = 2; // Reemplaza esto con el id que deseas verificar
// console.log(existeRegistroHoy(records, id));




function registrar_Habitos_checker(id_habito) {
    console.log(id_habito)
    id_habito = id_habito+""
    let data = fs.readFileSync('historial_habitos.csv', 'utf8');
    let records = Papa.parse(data, {header: true}).data;

    let hoy = moment().format('YYYY-MM-DD');
    let hora = moment().format('HH:mm:ss');

    let existeHoy = records.some(record => moment(record.fecha).format('YYYY-MM-DD') === hoy && record.id_habito === id_habito);
    console.log(existeHoy)
    if (!existeHoy) {
        let nueva_fila = {
            id_habito: id_habito,
            fecha: hoy,
            duracion: "0"+":"+1+":"+'0',
            start_timer: hora,
            end_timer: hora,
            duracion_descanso: 0
        };
        records.push(nueva_fila);
    }

    let csv = Papa.unparse(records);
    fs.writeFileSync('historial_habitos.csv', csv);
}


function cambiarVentana(id) {
    var ventanas = document.getElementsByClassName('ventana');
    for (var i = 0; i < ventanas.length; i++) {
      ventanas[i].style.display = 'none';
    }
    document.getElementById(id).style.display = 'block';
  }

function configurar_habito(valor){
    var titulo = document.getElementById('titulo_habito')
    titulo.innerText = valor.nombre

    document.getElementById('id').value = valor.id;
document.getElementById('nombre').value = valor.nombre;
document.getElementById('work_time').value = valor.work_time;
document.getElementById('short_break').value = valor.short_break;
document.getElementById('count').value = valor.count;
document.getElementById('type').value = valor.type;
document.getElementById('orden_n').value = valor.orden_n;

console.log(valor.orden_n)

var button = document.getElementById('boton_agregar');
button.onclick = function() {
    guardar_habito_json()
};

document.getElementById('boton_borrar').style.display = 'block'

}


function guardar_habito_json(){
    console.log('editar existente')
    var data = fs.readFileSync("data.json", 'utf8');
    var jsonData = JSON.parse(data);
    var formValues = {
        "id": Number(document.getElementById('id').value) ,
        "nombre": document.getElementById('nombre').value,
        "work_time": Number(document.getElementById('work_time').value)  ,
        "short_break": Number(document.getElementById('short_break').value) ,
        "count": Number(document.getElementById('count').value) ,
        "type": Number(document.getElementById('type').value) ,
        "orden_n": Number(document.getElementById('orden_n').value) ,
    };

    console.log(formValues)

    // Buscar el índice del objeto con el id dado
    var index = jsonData.findIndex(item => item.id === formValues.id);

    // Si el objeto existe, actualizarlo
    if (index !== -1) {
        jsonData[index] = formValues;
        fs.writeFileSync("data.json", JSON.stringify(jsonData, null, 2), 'utf8');
        console.log('guardardó')
    } else {
        // Si el objeto no existe, puedes decidir qué hacer (por ejemplo, añadirlo al array)
        console.log('El objeto con id ' + formValues.id + ' no existe');
    }

    actualizar_listas()
    cambiarVentana('ventana1')
}


function actualizar_listas(){

    document.getElementById('miLista').innerHTML = '';
    document.getElementById('miLista_hechos').innerHTML = '';

    llenar_lista_habitos("miLista", false)
    llenar_lista_habitos("miLista_hechos", true)
    console.log('guardar')
  }

function agregar_Nuevo_habito_js(){
    console.log('guarda uno nuevo')


    var data = fs.readFileSync("data.json", 'utf8');
    var jsonData = JSON.parse(data);

    var maxId = Math.max.apply(Math, jsonData.map(function(item) { return item.id; }));
    var maxOrdenN = Math.max.apply(Math, jsonData.map(function(item) { return item.orden_n; }));


    var formValues = {
        "id": maxId + 1 ,
        "nombre": document.getElementById('nombre').value,
        "work_time": Number(document.getElementById('work_time').value)  ,
        "short_break": Number(document.getElementById('short_break').value) ,
        "count": Number(document.getElementById('count').value) ,
        "type": Number(document.getElementById('type').value) ,
        "orden_n": maxOrdenN + 1 ,
    };

    console.log(formValues)

    jsonData.push(formValues);
    fs.writeFileSync("data.json", JSON.stringify(jsonData, null, 2), 'utf8');

    // Buscar el índice del objeto con el id dado
    // var index = jsonData.findIndex(item => item.id === formValues.id);


    // Si el objeto existe, actualizarlo
    // if (index !== -1) {
    //     jsonData[index] = formValues;
    //     console.log('guardardó')
    // } else {
    //     // Si el objeto no existe, puedes decidir qué hacer (por ejemplo, añadirlo al array)
    //     console.log('El objeto con id ' + formValues.id + ' no existe');
    // }

    actualizar_listas()
    cambiarVentana('ventana1')
}


function configurar_habito_nuevo(){
    
    cambiarVentana('ventana2')
    var titulo = document.getElementById('titulo_habito')
    titulo.innerText = ''

    document.getElementById('id').value = '';
document.getElementById('nombre').value = '';
document.getElementById('work_time').value = '';
document.getElementById('short_break').value = '';
document.getElementById('count').value = '';
document.getElementById('type').value = '';
document.getElementById('orden_n').value = '';

// console.log(valor.orden_n)

var button = document.getElementById('boton_agregar');
button.onclick = function() {
    agregar_Nuevo_habito_js()
};

document.getElementById('boton_borrar').style.display = 'none'

}


function eliminar_habito(){
    var data = fs.readFileSync("data.json", 'utf8');
    var jsonData = JSON.parse(data);
    // Buscar el índice del objeto con el id dado
var idParaEliminar = Number(document.getElementById('id').value);

// Filtrar el array para excluir el objeto con el id dado
jsonData = jsonData.filter(item => item.id !== idParaEliminar);

// Guardar el nuevo array en el archivo JSON
fs.writeFileSync("data.json", JSON.stringify(jsonData, null, 2), 'utf8');
console.log('Registro eliminado');
actualizar_listas()
cambiarVentana('ventana1')

}