const fs = require('fs');
const huffman = require('huffman-javascript/dist/index')
const readline = require('readline');
const { ArbolB } = require("./btree");

const zeroPad = function (val, size) {
  var s = String(val);
  while (s.length < (size || 2)) {s = "0" + s;}
  return s;
}

const codificaDpi = function (json) {
  // codifica en la llave companies el dpi 
  // usando el algoritmo de codificación aritmetico
  const listaCompanias = json.companies;
  const listaCodificada = {};
  const listaCodes = {};
  const listaLlaves = {};
  listaCompanias.forEach(function (compania, indice) {
    const textoACodificar = zeroPad(indice,3) + '' + json.dpi;
    let codes = huffman.getCodesFromText(textoACodificar);
    let encodedArray = huffman.encode(textoACodificar, codes);
    let encodedText = encodedArray.join('');
    listaCodificada[compania] = encodedText;
    listaCodes[compania] =  Object.fromEntries(codes);
    listaLlaves[compania] = encodedArray;
  });
  json.companies = listaCodificada;
  // guarda datos para decodificar en memoria
  json.codes = listaCodes;
  json.keys = listaLlaves;
  return json;
};

const decodificaDpi = function (json) {
  const objetoCompanias = json.companies;
  const objetoCodes = json.codes;
  const objetoLlaves = json.keys;
  const companias = {};
  Object.keys(objetoCompanias).forEach(function (compania) {
    let codes = new Map(Object.entries(objetoCodes[compania]))
    companias[compania] = huffman.decode(objetoLlaves[compania], codes);
  });
  return companias;
};

(async function () {
  var arbol = new ArbolB(3, ['name', 'dpi']);

  const fileStream = fs.createReadStream('input.csv');

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    const elements = line.split(";");
    let json = elements[1];
    json = JSON.parse(json);
    if (elements[0] === "INSERT") {
      json = codificaDpi(json);
      arbol.insertar(json);
    }
    else if (elements[0] === "PATCH") {
      json = codificaDpi(json);
      arbol.actualizar(json);
    }
    else {
      arbol.eliminar(json);
    }
  };

  // arbol.imprimir();
  var buscar1 = arbol.buscarPorLlave({ name: 'abdul' });
  const toStr = Object.assign({}, buscar1[0], { codes: undefined, keys: undefined })
  console.log('buscar name: abdul', JSON.stringify(toStr));
  console.log('decodificado', decodificaDpi(buscar1[0]));

  var buscar2 = arbol.buscarPorLlave({ name: 'abel' });
  console.log('buscar name: abel');
  const outStream = fs.createWriteStream('./outputs2/salida.csv');
  for (var idx = 0; idx < buscar2.length; idx++) {
    const busqueda = Object.assign({}, buscar2[idx], { codes: undefined, keys: undefined })
    outStream.write(JSON.stringify(busqueda));
    console.log('ocurrencia', idx, JSON.stringify(busqueda));
    outStream.write('\n\r');
  }
  outStream.close();

  var descargar = arbol.descargarArbol();
  const arbolcsv = fs.createWriteStream('./outputs2/arbol.csv');
  for (var idx = 0; idx < descargar.length; idx++) {
    const busqueda = Object.assign({}, descargar[idx], { codes: undefined, keys: undefined })
    arbolcsv.write(JSON.stringify(busqueda));
    arbolcsv.write('\n');
  }
  arbolcsv.close();
})();