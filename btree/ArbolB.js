var Nodo = require("./Nodo");

class ArbolB {

  pila = [];

  constructor(grado, llaves){
    this.raiz = null;
    this.grado = grado;
    this.llaves = llaves; // arreglo con las llaves de comparación del nodo
  }

  compararValor (valor1, valor2) {
    // asume llaves es un array con los keys del objeto que sirven de llave de comparacion
    // 1 si el valor del nodo es mayor al nodo a comparar 
    // -1 si el valor del nodo es menor al nodo a comparar
    for (var idx = 0; idx < this.llaves.length; idx++) {
      var llave = this.llaves[idx];
      if (valor1[llave] < valor2[llave]) {
        return -1;
      }
      if (valor1[llave] > valor2[llave]) {
        return 1;
      }
    }
    return 0; // es igual
  }

  buscarValor (nodo, valor) {
    if (nodo === null || nodo.valores.length <= 0) {
      return null;
    }
    var i = 0;
    while (i < nodo.valores.length && this.compararValor(nodo.valores[i], valor) === -1) {
      i = i + 1;
    }
    if (i < nodo.valores.length && this.compararValor(nodo.valores[i], valor) === 0) {
      return { valor: nodo.valores[i], nodo: nodo, posicion: i };
    }
    if (nodo.hijos.length <= 0) {
      return null;
    }
    return this.buscarValor(nodo.hijos[i], valor);
  }

  actualizarValor (nodo, valor) {
    if (nodo === null || nodo.valores.length <= 0) {
      return null;
    }
    var i = 0;
    while (i < nodo.valores.length && this.compararValor(nodo.valores[i], valor) === -1) {
      i = i + 1;
    }
    if (i < nodo.valores.length && this.compararValor(nodo.valores[i], valor) === 0) {
      nodo.valores[i] = Object.assign({}, nodo.valores[i], valor);
      return { valor: nodo.valores[i], nodo: nodo, posicion: i };
    }
    if (nodo.hijos.length <= 0) {
      return null;
    }
    return this.actualizarValor(nodo.hijos[i], valor);
  }

  insercionOrdenada (nodo, valor, hijoDerecho) {
    var pivote = 0;
    while (pivote < nodo.valores.length && this.compararValor(nodo.valores[pivote], valor) === -1) {
      pivote = pivote + 1;
    }
    nodo.valores.splice(pivote, 0, valor); // agrega el valor al nodo empuja los valores mayores a la derecha
    if (nodo.hijos.length < pivote + 1) {
      nodo.hijos.push(null);  // agrega el hijo izquierdo si aun no tiene
    }
    nodo.hijos.splice(pivote + 1, 0, hijoDerecho); // traslada el hijo derecho hacia la derecha
    return nodo;
  }

  dividir (nodo) {
    var nuevoNodo = new Nodo();
    var pivote = Math.ceil(this.grado / 2) - 1;
    nuevoNodo.valores = nodo.valores.slice(pivote);
    nuevoNodo.hijos = nodo.hijos.slice(pivote + 1);
    // extrae los valores del nodo
    nodo.valores.splice(pivote, nodo.valores.length - pivote);
    nodo.hijos.splice(pivote + 1, nodo.hijos.length - pivote);
    // nodo.hijos.push(null);
    nuevoNodo.hijos.splice(0, 0, nodo);
    return nuevoNodo;
  }

  buscarHijo (nodo, valor) {
    var pivote = 0;
    while (pivote < nodo.valores.length - 1 && this.compararValor(nodo.valores[pivote], valor) === -1) {
      pivote = pivote + 1;
    }
    if (this.compararValor(nodo.valores[pivote], valor) === -1) { // devuelve hijo a la derecha
      return pivote + 1;
    } 
    return pivote;
  }

  insercion (nodo, valor) {
    if (!nodo || nodo === null) {
      nodo = new Nodo();
    }
    if (nodo.valores.length < this.grado - 1) {
      return this.insercionOrdenada(nodo, valor, null);
    } else {
      var hijo = this.buscarHijo(nodo, valor);
      nodo.hijos[hijo] = this.insercion(nodo.hijos[hijo], valor);
      return nodo;
    }
    return this.dividir(nodo, valor);
    // if (nodo.hijos.length > this.grado - 1) {
    //   nodo = this.insercionOrdenada(nodo, valor, null);
    //   return this.dividir(nodo, valor);
    // }
    // return nodo;
  }

  insertar (valor) {
    this.raiz = this.insercion (this.raiz, valor);
  }

  recorreInFijo (nodo) {
    if (nodo === null || nodo.valores.length <= 0) {
      return;
    }
    for (var idx = 0; idx < nodo.valores.length; idx++) {
      if (idx === 0) {
        this.recorreInFijo(nodo.hijos[idx]);
      }
      var valor = nodo.valores[idx];
      console.log(JSON.stringify(valor));
      this.recorreInFijo(nodo.hijos[idx+1]);
    }
  }

  eliminarValor (nodo, valor) {
    if (nodo === null || nodo.valores.length <= 0) {
      return;
    }
    for (var idx = 0; idx < nodo.valores.length; idx++) {
      if (idx === 0) {
        this.eliminarValor(nodo.hijos[idx], valor);
      }
      if (this.compararValor(nodo.valores[idx], valor) !== 0) {
        this.pila.push(nodo.valores[idx]);
      } 
      this.eliminarValor(nodo.hijos[idx+1], valor);
    }
  }

  buscarValorPorLlave (nodo, valor) {
    if (nodo === null || nodo.valores.length <= 0) {
      return;
    }
    for (var idx = 0; idx < nodo.valores.length; idx++) {
      if (idx === 0) {
        this.buscarValorPorLlave(nodo.hijos[idx], valor);
      }
      var llavesBusqueda = Object.keys(valor);
      for (var idxBusqueda = 0; idxBusqueda < llavesBusqueda.length; idxBusqueda++) {
        if (nodo.valores[idx][llavesBusqueda[idxBusqueda]] === valor[llavesBusqueda[idxBusqueda]]) {
          this.pila.push(nodo.valores[idx]);
        } 
      }
      this.buscarValorPorLlave(nodo.hijos[idx+1], valor);
    }
  }

  descargar (nodo) {
    if (nodo === null || nodo.valores.length <= 0) {
      return;
    }
    for (var idx = 0; idx < nodo.valores.length; idx++) {
      if (idx === 0) {
        this.descargar(nodo.hijos[idx]);
      }
      this.pila.push(nodo.valores[idx]);
      this.descargar(nodo.hijos[idx+1]);
    }
  }

  imprimir () {
    this.recorreInFijo(this.raiz);
  }

  buscar (valor) {
    return this.buscarValor(this.raiz, valor);
  }

  buscarPorLlave (valor) {
    this.pila = [];
    this.buscarValorPorLlave(this.raiz, valor);
    return this.pila;
  }

  descargarArbol () {
    this.pila = [];
    this.descargar(this.raiz);
    return this.pila;
  }

  actualizar (valor) {
    return this.actualizarValor(this.raiz, valor);
  }

  eliminar(valor) {
    this.pila = [];
    this.eliminarValor(this.raiz, valor);
    this.raiz = null;
    for (var idx = 0; idx < this.pila.length; idx++) {
      this.insertar(this.pila[idx]);
    };
  }
}

module.exports = ArbolB
