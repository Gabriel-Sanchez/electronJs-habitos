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
    const hoy = new Date().toISOString().split('T')[0];

    // Utiliza el método 'some' para buscar un registro que cumpla con la condición
    return records.some(record => record.id_habito == id && record.fecha == hoy);
}

// // Uso de la función
// const id = 2; // Reemplaza esto con el id que deseas verificar
// console.log(existeRegistroHoy(records, id));




function registrar_Habitos_checker(id_habito) {
    console.log(id_habito)
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