
// ---------- BEGIN MODULE SCOPE VARIABLES ----------
var
  beams, profiles, materials,
  getW, getI, getE, getRi,
  setParts, setActiveParts,
  setPart, getPart,
  doForEachOwnProperty,

  configMap = {
    activePart: {
      beams: 'beam_single_span',
      materials: 'pine',
      profiles: 'rectangular'
    }
  },

  stateMap = {
    beams: {
      active: null
    },
    materials: {
      active: null
    },
    profiles: {
      active: null
    }
  },

  model = {};

// ----------- END MODULE SCOPE VARIABLES -----------

// -------------- BEGIN MODULE PARTS ----------------

profiles = [
  {
    _name: 'rectangular',
    b: null,
    h: null,
    get W() {
      return this.b * Math.pow( this.h, 2 ) / 6;
    },
    get I() {
      return this.b * Math.pow( this.h, 3 ) / 12;
    }
  }
];

materials = [
  {
    _name: 'pine',
    E: 100000,
    Ri: 130
  }
];

beams = [
  {
    _name: 'beam_single_span',
    qn: null,
    qr: null,
    l: null,
    _f_to_l_ratio: 0.004,
    set f_to_l_ratio(val) {
      this._f_to_l_ratio = val;
    },
    get f_to_l_ratio() {
      return this._f_to_l_ratio;
    },
    get Mmax() {
      return this.qr * Math.pow(this.l, 2) / 8;
    },
    get f() {
      return 5 * this.qn * Math.pow(this.l, 4) / (384 * getE() * getI());
    },
    get Wr() {
      return this.Mmax / getRi();
    },
    get gps1() {
      return this.Wr < getW();
    },
    get gps2() {
      return this.f / this.l < this.f_to_l_ratio;
    }
  }
];

// -------------- BEGIN MODULE PARTS ----------------


// ------------ BEGIN UTILITY FUNCTIONS -------------

/**
 * Invokes callback for each own enumerable property
 * of the passed object
 *
 * @function
 * @param {object} obj Passed object which properties
 * are to be iterated
 * @param {function} callback Passed callback function
 * It is invoked with property, property name and
 * passed object as arguments
 * @throws {void} none
 * @return {undefined} none
 */
doForEachOwnProperty = function(obj, callback) {
  for (let prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      callback( obj[prop], prop, obj );
    }
  }
};

// ------------- END UTILITY FUNCTIONS --------------


// ---------- BEGIN MODULE PRIVATE METHODS ----------
getW = function () {
  return stateMap.profiles.active.W;
};

getI = function () {
  return stateMap.profiles.active.I;
};

getE = function () {
  return stateMap.materials.active.E;
};

getRi = function () {
  return stateMap.materials.active.Ri;
};

/**
 * Setup model parts
 *
 * @method
 * @private
 * @param {string} partsName Name of group of parts
 * @param {array} parts Set of parts maps
 * @throws {void} none
 * @return {undefined} none
 */
setParts = function( partsName, parts ) {
  parts.forEach( (part) => {
    stateMap[partsName][part._name] = part;
  });
};

setActiveParts = function() {
  doForEachOwnProperty(configMap.activePart, (activePart, partsName) => {
    stateMap[partsName].active = stateMap[partsName][activePart];
  });
};

/**
 * Adjusts model part parameters
 *
 * @method
 * @private
 * @param {string} partsName Model parts group name
 * @param {string} partName Model part name
 * @param {object} params Proposed parameters maps
 * @throws {void} none
 * @return {undefined} none
 *
 * TODO - Throw exception on invalid provided
 * parameter name or type
 */
setPart = function( partsName, partName, params ) {
  var part = stateMap[partsName][partName];
  doForEachOwnProperty( params, (param, paramName) => {
    if (part.hasOwnProperty(paramName)) {
      part[paramName] = param;
    }
  });
  stateMap[partsName].active = part;
};


/**
 * Provides model part parameters
 *
 * @method
 * @private
 * @param {string} partsName Model parts group name
 * @param {string} partName Model part name
 * @param {object} params Requested parameters maps
 * @throws {void} none
 * @return {undefined} none
 *
 * TODO - Throw exception on invalid requested
 * parameter name
 */
getPart = function (partsName, partName, params) {
  var part, result, paramsMap = {};
  switch (arguments.length) {
  case 2:
    part = stateMap[partsName][partName];
    doForEachOwnProperty(part, (param, paramName) => {
      paramsMap[paramName] = param;
    });
    result = paramsMap;
    break;
  case 3:
    part = stateMap[partsName][partName];
    switch (typeof params) {
    case 'string':
      result = part[params];
      break;
    default:
      params.forEach( (reqParam) => {
        paramsMap[reqParam] = getPart(partsName, partName, reqParam);
      });
      result = paramsMap;
    }
    break;
  default:
  }
  return result;
};

// ----------- END MODULE PRIVATE METHODS -----------


// ---------- BEGIN MODULE PUBLIC METHODS ----------

model.set = function( args ) {
  for (let arg in args) {
    if (args.hasOwnProperty( arg )) {
      switch (arg) {
      case 'rectangular':
        setPart( 'profiles', arg, args[arg] );
        break;
      case 'pine':
        setPart( 'materials', arg, arg[args] );
        break;
      case 'beam_single_span':
        setPart( 'beams', arg, args[arg] );
        break;
      default:
      }
    }
  }
};

/**
 * Module public API - method get
 *
 * @method
 * @public
 * @param {string|object} args Requested model parameters
 * @throws {void} none
 * @return {string|number|object} Requested parameters values
 */
model.get = function( args ) {
  var result;
  switch (typeof args) {
  case 'string':
    switch (args) {
    case 'beam_single_span':
      result = getPart('beams', args);
      break;
    default:
    }
    break;
  case 'object':
    for (let arg in args) {
      if (args.hasOwnProperty( arg )) {
        switch (arg) {
        case 'rectangular':
          result = getPart( 'profiles', arg, args[arg] );
          break;
        case 'beam_single_span':
          result = getPart( 'beams', arg, args[arg] );
          break;
        case 'pine':
          result = getPart( 'materials', arg, args[arg] );
          break;
        default:
        }
      }
    }
    break;
  default:
  }
  return result;
};

// ----------- END MODULE PUBLIC METHODS -----------

model.init = function() {
  setParts( 'beams', beams );
  setParts( 'materials', materials );
  setParts( 'profiles', profiles );
  setActiveParts();
};

export {model};
