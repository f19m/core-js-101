/* ************************************************************************************************
 *                                                                                                *
 * Plese read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectagle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  this.width = width;
  this.height = height;
  this.getArea = () => this.width * this.height;
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const obj = JSON.parse(json);
  return new proto.constructor(...Object.values(obj));
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurences
 *
 * All types of selectors can be combined using the combinators ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string repsentation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

const cssSelectorBuilder = {

  throwErr(param) {
    let msg = 'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element';
    if (param === 1) {
      msg = 'Element, id and pseudo-element should not occur more then one time inside the selector';
    }
    console.log(`>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ${this.selector}`);
    throw new Error(msg);
  },

  create(value) {
    let that = {};
    if (this.selector) {
      this.selector += value;
      that = this;
    } else {
      that.selector = value;
      //Object.assign(that, cssSelectorBuilder);
      that.__proto__ = cssSelectorBuilder;

      console.log(`that + css =======================`);
      console.log(that);
      console.log(cssSelectorBuilder);
    }
 

    return that;
  },


  element(value) {
    // if (this.selector) this.throwErr();
    if (this.selector && this.el) this.throwErr(1);
    this.el = true;

    return this.create(value);
  },

  id(value) {
    // console.log(cssSelectorBuilder)
    // console.log(this)
    if (this.selector && this.selector.match(/\.|::/)) this.throwErr();
    if (this.selector && this.customId) this.throwErr(1);
    this.customId = true;
    return this.create(`#${value}`);
  },

  class(value) {
    if (this.selector && this.selector.indexOf('[') > -1) this.throwErr();
    return this.create(`.${value}`);
  },

  attr(attr) {
    if (this.selector && this.selector.indexOf(':') > -1) this.throwErr();
    // this.selector = `${this.selector}[${attr}]`;
    return this.create(`[${attr}]`);
  },

  pseudoClass(value) {
    if (this.selector && this.selector.indexOf('::') > -1) this.throwErr();

    // this.selector = `${this.selector}:${value}`;
    return this.create(`:${value}`);
  },

  pseudoElement(value) {
    if (this.selector && this.pseudoElement) this.throwErr(1);
    this.pseudoElement = true;
    // this.selector = `${this.selector}::${value}`;
    return this.create(`::${value}`);
  },

  combine(selector1, combinator, selector2) {
    const newObj = {};
    newObj.selector = `${selector1.stringify()} ${combinator} ${selector2.stringify()}`;

    return Object.assign(newObj, cssSelectorBuilder);
  },

  stringify() {
    return this.selector;
  },
};

 const builder = cssSelectorBuilder;
 builder.id('nav-bar').stringify();
builder.element('li').id('main').stringify()
// builder.element('div').stringify();
// builder.element('div').stringify();

// const builder = cssSelectorBuilder;
// console.log(
//   builder.combine(
//           builder.element('div').id('main').class('container').class('draggable'),
//           '+',
//           builder.combine(
//               builder.element('table').id('data'),
//               '~',
//                builder.combine(
//                    builder.element('tr').pseudoClass('nth-of-type(even)'),
//                    ' ',
//                    builder.element('td').pseudoClass('nth-of-type(even)')
//                )
//           )
//       ).stringify()
// )


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
