/* eslint-disable react/forbid-foreign-prop-types */

export default class BaseModel {
  constructor(props, propTypes, options = {}) {
    /**
     * Prop types reference.
     * @type {!Object.<string, !Object>}
     */
    if (!propTypes) {
      throw new Error('The base model requires prop types.');
    }

    this.propTypes = propTypes;

    /**
     * Model options.
     * @type {!Object}
     */
    const defaultOpts = { forceID: false, nullable: false }
    this.options = Object.assign({}, defaultOpts, options);

    /**
     * Data (values) reference.
     * @type {!Object.<string, *>}
     */
    this.data = BaseModel.populate(props, propTypes, this.options);
  }

  /**
   * Returns populated data for the model.
   *
   * Values will be coerced to proper-type to prevent malformed data errors,
   * such as empty strings for number fields, non-bools for booleans, and so on.
   *
   * @param {!Object} props The props. Can be null in special cases
   * @param {!Object} propTypes The propTypes (includes the formfield configs). Non-null.
   * @param {!Object} options Model options.
   * @return {!Object} The populated data for this model.
  */
  static populate(props, propTypes, options) {
    let data = {};

    //  If this model is nullable & props is null, just set data to null.
    const { nullable } = options;

    if (nullable && props === null) {
      data = null;
    } else {
      // Populate the data from the supplied props (if any).
      const modelProps = props || {};
      Object.keys(propTypes).forEach((key) => {
        const { type } = propTypes[key];
        const value = modelProps[key];
        data[key] = BaseModel.coerceValueForType(type, value, options);
      });
    }

    return data;
  }

  static coerceValueForType(type, value, options = {}) {
    // JS requires a capital letter for using the "new" keyword.
    const Model = type;
    const { forceID, nullable } = options;

    let out;

    switch (type) {
      // @todo(dlochrie): We could create a new "Model" for ID in the futue,
      // but it would need to be flat, and not nested like Links and Images.
      case 'id':
        out = forceID ? uuidv4().toString() : (value || '').toString();
        break;
      case 'string':
        out = (value || '').toString();
        break;
      case 'int':
      case 'number':
        out = parseInt(value, 10) || 0;
        break;
      case 'boolean':
      case 'bool':
        out = Boolean(value);
        break;
      case 'array':
        out = Array.isArray(value) ? value : [];
        break;
      case 'object':
        // Silly JS: In JS, `null` has a type of `object`.
        out = typeof value === 'object' && value !== null ? value : {};
        break;
      default:
        try {
          if (nullable && value === null) {
            out = null; // Need to coerce null on intentional null values when model updates
          } else {
            out = new Model({ ...value }).getData();
          }
        } catch (e) {
          out = value || '';
        }
        break;
    }

    return out;
  }


  /**
   * Gets the data for a specific field (if supplied), or all the model data.
   * @param {string=} name The optional field to get data for.
   * @return {!Object} The data for a specific field, or all the data on the
   *   model.
   */
  getData(name) {
    if (name) return this.data[name];
    return this.data;
  }

  // Gets a subset of the data using an array of field names
  // https://stackoverflow.com/questions/38750705/filter-object-properties-by-key-in-es6
  getDataSubset(allowed) {
    
    const subsetData = Object.keys(this.data)
      .filter(name => allowed.includes(name))
      .reduce((obj, key) => {
        obj[key] = this.data[key];
        return obj;
      }, {});

    return subsetData
  }


  /**
   * Trims a payload for an API request.
   * For now, this just removes "ID" fields from a payload to appease the API.
   * @return {!Object} The data object with trimmed fields.
   */
  trim() {
    const { propTypes, data } = this;

    const trimmedData = {};
    Object.keys(data).forEach((key) => {
      if (propTypes[key].type !== 'id') trimmedData[key] = data[key];
    });
    return trimmedData;
  }

}
