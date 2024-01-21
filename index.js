const fs = require('fs')
const Papa = require('papaparse')
const moment = require('moment')

let data_historial
let records

const Sortable = require('sortablejs')

// let lista
let sortable

const path = require('path')
// Al cargar la página, recuperar el orden de la lista del archivo
function ordenar_lista_habitos () {
  let orden
  // try {
  //    let data = fs.readFileSync(path.join(__dirname, 'ordenLista.json'));
  //    if (data) {
  //        orden = JSON.parse(data);
  //    }
  // } catch (error) {
  //    console.error('Error al leer el archivo:', error);
  // }

  // Selecciona la lista
  const listaOrdenable = document.getElementById('miLista')
  // Obtiene todos los elementos <li>
  const elementos = listaOrdenable.children
  // Ordena los elementos basados en su atributo id numérico
  const elementosOrdenados = Array.from(elementos).sort((a, b) => {
    const idA = parseInt(a.id)
    const idB = parseInt(b.id)
    return idA - idB
  })
  // Reemplaza los elementos en la lista con los elementos ordenados
  elementosOrdenados.forEach((elemento) => listaOrdenable.appendChild(elemento))

// if (orden) {
// //    sortable.sort(orden);
// sortable.toArray();
// console.log(orden)
// }
};

function eventos_lista_habitos () {
  const lista = document.getElementById('miLista')
  sortable = Sortable.create(lista, {
    // Definir el evento onEnd
    onEnd: function (/** Event */evt) {
      const data = fs.readFileSync('data.json', 'utf8')
      const obj = JSON.parse(data)

      // Crear una nueva instancia de Sortable
      // Guardar el nuevo orden de la lista en un archivo
      // let orden = sortable.toArray();
      // fs.writeFileSync(path.join(__dirname, 'ordenLista.json'), JSON.stringify(orden));

      // let nuevoOrden = sortable.toArray();
      const elementos_all = document.getElementById('miLista')
      const elementos_li = elementos_all.children

      console.log(obj)
      console.log(elementos_li)

      const array = Array.from(elementos_li)
      console.log(array)

      // Ordenar el array
      array.sort(function (a, b) {
        const objA = JSON.parse(a.dataset.obj)
        const objB = JSON.parse(b.dataset.obj)

        // Comparar objA.orden_n y objB.orden_n
        return objA.orden_n - objB.orden_n
      })

      console.log(array)

      for (let i = 0; i < elementos_li.length; i++) {
        const id = obj[i].id

        // console.log(array[i].orden_n)
        // console.log(array[i].id)
        // console.log(JSON.parse(array[i].dataset.obj).orden_n)

        const objStr = elementos_li[i].dataset.obj

        // Convertir la cadena de texto a un objeto
        const obj2 = JSON.parse(objStr)

        // console.log(obj2.id);

        const index = obj.findIndex(item => item.id === obj2.id)
        obj[index].orden_n = Number(array[i].id)

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

      // console.log(obj)

      fs.writeFileSync('data.json', JSON.stringify(obj, null, 2), 'utf8')

      // let data = JSON.stringify(obj, null, 2);
      // fs.writeFileSync('data.json', data, 'utf8');

      console.log('se guardo orden json')
      // console.log(orden)
    }
  })

  ordenar_lista_habitos()
}

// window.onload =  ordenar_lista_habitos
window.onload = eventos_lista_habitos

function leer_archivo_historial (archivo) {
  const data = fs.readFileSync(archivo, 'utf8')
  const records = Papa.parse(data, {
    header: true,
    skipEmptyLines: true
  }).data

  // console.log(records)
  return records
}

function archivarHabito(){
  const data = fs.readFileSync('data.json', 'utf8')
  const dataJson = JSON.parse(data)

  habito = Number(document.getElementById('id').value) 
  console.log(habito)

   // Buscar el índice del objeto con el id dado
   const index = dataJson.findIndex(item => item.id === habito)

   // Si el objeto existe, actualizarlo
   if (index !== -1) {
     dataJson[index].archivado = 1
     fs.writeFileSync('data.json', JSON.stringify(dataJson, null, 2), 'utf8')
     console.log('guardardó')
   } else {
     // Si el objeto no existe, puedes decidir qué hacer (por ejemplo, añadirlo al array)
     console.log('El objeto con id ' + habito.id + ' no existe')
   }

   actualizar_listas()
   cambiarVentana('ventana1')


}

function existeRegistroHoy (records, id) {
  // Obtén la fecha de hoy en formato yyyy-mm-dd
  // const hoy = new Date().toISOString().split('T')[0];
  const hoy = new Date().toLocaleDateString('en-CA')

  // console.log(records)
  // console.log(id)
  // console.log(hoy)

  // Utiliza el método 'some' para buscar un registro que cumpla con la condición
  return records.some(record => record.id_habito == id && record.fecha == hoy)
}

// // Uso de la función
// const id = 2; // Reemplaza esto con el id que deseas verificar
// console.log(existeRegistroHoy(records, id));

function registrar_Habitos_checker (habito_obj) {
  console.log(habito_obj)
  id_habito = habito_obj.id + ''
  const data = fs.readFileSync('historial_habitos.csv', 'utf8')
  const records = Papa.parse(data, { header: true }).data

  const hoy = moment().format('YYYY-MM-DD')
  const hora = moment().format('HH:mm:ss')

  const existeHoy = records.some(record => moment(record.fecha).format('YYYY-MM-DD') === hoy && record.id_habito === id_habito)
  console.log(existeHoy)
  if (!existeHoy) {
    const nueva_fila = {
      id_habito,
      fecha: hoy,
      duracion: '0' + ':' + habito_obj.work_time + ':' + '0',
      start_timer: hora,
      end_timer: hora,
      duracion_descanso: 0
    }
    records.push(nueva_fila)
  }

  const csv = Papa.unparse(records)
  fs.writeFileSync('historial_habitos.csv', csv)
}

function cambiarVentana (id) {
  const ventanas = document.getElementsByClassName('ventana')
  for (let i = 0; i < ventanas.length; i++) {
    ventanas[i].style.display = 'none'
  }
  document.getElementById(id).style.display = 'block'
}

function configurar_habito (valor) {
  const titulo = document.getElementById('titulo_habito')
  titulo.innerText = valor.nombre

  document.getElementById('id').value = valor.id
  document.getElementById('nombre').value = valor.nombre
  document.getElementById('work_time').value = valor.work_time
  document.getElementById('short_break').value = valor.short_break
  document.getElementById('count').value = valor.count
  document.getElementById('type').value = valor.type
  document.getElementById('orden_n').value = valor.orden_n
  document.getElementById('color_hab').value = valor.color

  resetBorderColorsHabit(valor.color)

  console.log(valor.orden_n)

  const button = document.getElementById('boton_agregar')
  button.onclick = function () {
    guardar_habito_json()
  }

  document.getElementById('boton_borrar').style.display = 'block'
}

function guardar_habito_json () {
  console.log('editar existente')
  const data = fs.readFileSync('data.json', 'utf8')
  const jsonData = JSON.parse(data)
  const formValues = {
    id: Number(document.getElementById('id').value),
    nombre: document.getElementById('nombre').value,
    work_time: Number(document.getElementById('work_time').value),
    short_break: Number(document.getElementById('short_break').value),
    count: Number(document.getElementById('count').value),
    type: Number(document.getElementById('type').value),
    orden_n: Number(document.getElementById('orden_n').value),
    color: document.getElementById('color_hab').value
  }

  console.log(formValues)

  // Buscar el índice del objeto con el id dado
  const index = jsonData.findIndex(item => item.id === formValues.id)

  // Si el objeto existe, actualizarlo
  if (index !== -1) {
    jsonData[index] = formValues
    fs.writeFileSync('data.json', JSON.stringify(jsonData, null, 2), 'utf8')
    console.log('guardardó')
  } else {
    // Si el objeto no existe, puedes decidir qué hacer (por ejemplo, añadirlo al array)
    console.log('El objeto con id ' + formValues.id + ' no existe')
  }

  actualizar_listas()
  cambiarVentana('ventana1')
}

function actualizar_listas () {
  document.getElementById('miLista').innerHTML = ''
  document.getElementById('miLista_hechos').innerHTML = ''
  document.getElementById('miLista_archivados').innerHTML = ''

  llenar_lista_habitos('miLista', false, false)
  llenar_lista_habitos('miLista_hechos', true, false)
  llenar_lista_habitos('miLista_archivados', false, true)
  llenar_lista_habitos('miLista_archivados', true, true)
  console.log('guardar')
  eventos_lista_habitos()
}

function agregar_Nuevo_habito_js () {
  console.log('guarda uno nuevo')

  const data = fs.readFileSync('data.json', 'utf8')
  const jsonData = JSON.parse(data)

  const maxId = Math.max.apply(Math, jsonData.map(function (item) { return item.id }))
  const maxOrdenN = Math.max.apply(Math, jsonData.map(function (item) { return item.orden_n }))

  const formValues = {
    id: maxId + 1,
    nombre: document.getElementById('nombre').value,
    work_time: Number(document.getElementById('work_time').value),
    short_break: Number(document.getElementById('short_break').value),
    count: Number(document.getElementById('count').value),
    type: Number(document.getElementById('type').value),
    color: document.getElementById('color_hab').value,
    orden_n: maxOrdenN + 1
  }

  console.log(formValues)

  jsonData.push(formValues)
  fs.writeFileSync('data.json', JSON.stringify(jsonData, null, 2), 'utf8')

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

function configurar_habito_nuevo () {
  cambiarVentana('ventana2')
  const titulo = document.getElementById('titulo_habito')
  titulo.innerText = ''

  document.getElementById('id').value = ''
  document.getElementById('nombre').value = ''
  document.getElementById('work_time').value = ''
  document.getElementById('short_break').value = ''
  document.getElementById('count').value = ''
  document.getElementById('type').value = ''
  document.getElementById('orden_n').value = ''
  document.getElementById('color_hab').value = ''

  resetBorderColorsHabit('none')

  // console.log(valor.orden_n)

  const button = document.getElementById('boton_agregar')
  button.onclick = function () {
    agregar_Nuevo_habito_js()
  }

  document.getElementById('boton_borrar').style.display = 'none'
}

function eliminar_habito () {
  const data = fs.readFileSync('data.json', 'utf8')
  let jsonData = JSON.parse(data)
  // Buscar el índice del objeto con el id dado
  const idParaEliminar = Number(document.getElementById('id').value)

  // Filtrar el array para excluir el objeto con el id dado
  jsonData = jsonData.filter(item => item.id !== idParaEliminar)

  // Guardar el nuevo array en el archivo JSON
  fs.writeFileSync('data.json', JSON.stringify(jsonData, null, 2), 'utf8')
  console.log('Registro eliminado')
  actualizar_listas()
  cambiarVentana('ventana1')
}

function calcular_habitos_restanten (hecho, cantidad) {
  if (!hecho) {
    cantidad = cantidad + 1
  }

  return cantidad
}
function calcular_tiempo_restante(hecho, total, tiempo, ciclos) {
  tiempoTotal = Number(ciclos) * Number(tiempo) 
  console.log(total + '-'+tiempo)
  if (!hecho) {
    total = total + tiempoTotal
  }

  return total
}

function calcularDiasDeRachaHastaHoy (id, datos, hecho) {
  // Filtrar los datos por id
  const datosFiltrados = datos.filter(d => d.id_habito == id)

  // Ordenar los datos por fecha
  datosFiltrados.sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
  console.log(datosFiltrados)

  // Calcular los días de racha
  let racha = 0
  let hoy = new Date()
  let hoy_constante = new Date()
  hoy.setHours(0, 0, 0, 0) // Asegurarse de que la hora es medianoche para la comparación de fechas

  hoy_constante = hoy_constante = new Date()
  hoy_constante.setHours(0, 0, 0, 0) // Asegurarse de que la hora es medianoche para la comparación de fechas

  hoy_racha = false

  if (!hecho) {
    hoy.setDate(hoy.getDate() - 1)
  }

  for (let i = datosFiltrados.length - 1; i >= 0; i--) {
    const fechaActual = new Date(datosFiltrados[i].fecha)
    fechaActual.setHours(0, 0, 0, 0) // Asegurarse de que la hora es medianoche para la comparación de fechas

    //  if (hoy_constante.getTime() === fechaActual.getTime()){
    //     racha++;
    //     console.log('hoy')
    // }

    // Verificar si hay datos para el día de hoy
    if (esFechaConsecutiva(fechaActual, hoy)) {
      racha++
    } else if (racha > 0) {
      break // La racha se rompe, ya hemos contado los días consecutivos hasta hoy
    }

    hoy = restarUnDia(hoy) // Restar un día a la fecha de hoy para la próxima iteración
  }

  if (id == 19) {
    console.log(id)
    console.log(racha)
  }

  return racha
}

// Función para verificar si dos fechas son consecutivas
function esFechaConsecutiva (fecha1, fecha2) {
  const unDiaEnMilisegundos = 24 * 60 * 60 * 1000
  return Math.abs(fecha1 - fecha2) === unDiaEnMilisegundos
}

// Función para restar un día a una fecha
function restarUnDia (fecha) {
  return new Date(fecha.getTime() - 24 * 60 * 60 * 1000)
}

function resetBorderColorsHabit(colorHabito) {
  let colorPalette = document.getElementById('colorPalette');
  var divsHijos = colorPalette.getElementsByTagName('div');

  for (var i = 0; i < divsHijos.length; i++) {
    if (divsHijos[i].style.backgroundColor == colorHabito ){
      
      divsHijos[i].style.border = '3px solid black';
    }else{
      divsHijos[i].style.border = "none";

    }
  }
}

function convertirMinutosAHoras(minutos) {
  var horas = Math.floor(minutos / 60);
  var minutosRestantes = minutos % 60;
  return horas + " horas y " + minutosRestantes + " minutos";
}