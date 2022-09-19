class Nodo {
  constructor(node){
      this.valores = [];
      this.hijos = [];
  }

  toStringify () {
    return JSON.stringify(this.valores);
  }

  esHoja () {
    if (this.hijos.length <= 0) {
      return true;
    } else {
      for (var idx = 0; idx < this.hijos.length; idx++) {
        var hijo = this.hijos[idx];
        if (hijo !== null) {
          return false;
        }
      }
      return true;
    }
    return false;
  }
}

module.exports = Nodo
