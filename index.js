const fs = require('fs');
const Papa = require('papaparse');
const moment = require('moment');

var data_historial
var records

const Sortable = require('sortablejs');

// let lista 
 var sortable 



const path = require('path');
// Al cargar la página, recuperar el orden de la lista del archivo
function ordenar_lista_habitos() {
let orden;
// try {
//    let data = fs.readFileSync(path.join(__dirname, 'ordenLista.json'));
//    if (data) {
//        orden = JSON.parse(data);
//    }
// } catch (error) {
//    console.error('Error al leer el archivo:', error);
// }


 // Selecciona la lista
 const listaOrdenable = document.getElementById('miLista');
 // Obtiene todos los elementos <li>
 const elementos = listaOrdenable.children
 // Ordena los elementos basados en su atributo id numérico
 const elementosOrdenados = Array.from(elementos).sort((a, b) => {
   const idA = parseInt(a.id);
   const idB = parseInt(b.id);
   return idA - idB;
 });
 // Reemplaza los elementos en la lista con los elementos ordenados
 elementosOrdenados.forEach((elemento) => listaOrdenable.appendChild(elemento));

// if (orden) {
// //    sortable.sort(orden);
// sortable.toArray();
// console.log(orden) 
// }
};


function eventos_lista_habitos() {
    var data = fs.readFileSync("data.json", 'utf8');
    var obj = JSON.parse(data);

    // Crear una nueva instancia de Sortable
    let lista = document.getElementById('miLista');
    sortable = Sortable.create(lista, {
        // Definir el evento onEnd
        onEnd: function (/**Event*/evt) {
            // Guardar el nuevo orden de la lista en un archivo
            // let orden = sortable.toArray();
            // fs.writeFileSync(path.join(__dirname, 'ordenLista.json'), JSON.stringify(orden));

            // let nuevoOrden = sortable.toArray();
            let elementos_all  = document.getElementById('miLista')
            let elementos_li = elementos_all.children;

            console.log(obj)
            console.log(elementos_li)

            for (let i = 0; i < elementos_li.length; i++) {
                let id = obj[i].id;




                let objStr = elementos_li[i].dataset.obj;

                // Convertir la cadena de texto a un objeto
                let obj2 = JSON.parse(objStr);
            
                // console.log(obj2.id);

                var index = obj.findIndex(item => item.id === obj2.id);
                obj[index].orden_n = i


           
                // console.log(elementos_li[i].dataset.obj)
                
                // let index = nuevoOrden.indexOf(id.toString());

                // console.log(index)
                // if (index !== -1) {
                //     let nuevaPosicion = index + 1;
                //     obj[i].orden_n = nuevaPosicion;
                // } else {
                //     console.log(`ID ${id} not found in nuevoOrden`);
                // }
            }

            console.log(obj)

            fs.writeFileSync("data.json", JSON.stringify(obj, null, 2), 'utf8');

            // let data = JSON.stringify(obj, null, 2);
            // fs.writeFileSync('data.json', data, 'utf8');

            console.log('se guardo orden json')
            // console.log(orden)
        },
    });

    ordenar_lista_habitos()
}



// window.onload =  ordenar_lista_habitos
window.onload = eventos_lista_habitos

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
    eventos_lista_habitos()
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



