const Property = require('./Property');
const InputNumber = require('domain_abstract/ui/InputNumber');

module.exports = Property.extend({

  defaults: { ...Property.prototype.defaults,
    // Array of units, eg. ['px', '%']
    units: [],

    // Selected unit, eg. 'px'
    unit: '',

    // Integer value steps
    step: 1,

    // Minimum value
    min: '',

    // Maximum value
    max: '',
  },


  init() {
    const unit = this.get('unit');
    const units = this.get('units');
    this.input = new InputNumber({ model: this });

    if (units.length && !unit) {
      this.set('unit', units[0]);
    }
  },


  parseValue(val) {
    const parsed = Property.prototype.parseValue.apply(this, arguments);
    const { value, unit } = this.input.validateInputValue(parsed.value, {deepCheck: 1});
    parsed.value = value;
    parsed.unit = unit;
    return parsed;
  },


  getFullValue() {
    let value = this.get('value') + this.get('unit');
    return Property.prototype.getFullValue.apply(this, [value]);
  },

});
