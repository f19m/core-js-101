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
    // console.log(`>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ${this.selector}`);
    // console.log(this);
    throw new Error(msg);
  },

  create(value) {
    let that = {};
    if (this.selector) {
      this.selector += value;
      that = this;
    } else {
      // Object.assign(that, cssSelectorBuilder);
      // that.__proto__ = cssSelectorBuilder;
      // that = Object.getPrototypeOf(cssSelectorBuilder);
      that = { __proto__: cssSelectorBuilder, selector: value };
      // that.selector = value;
      // console.log(`that + css =======================`);
      // console.log(that);
      // console.log(this);
    }
    // console.log('that + css =======================');
    // console.log(that.selector);
    return that;
  },


  element(value) {
    if (this.el) this.throwErr(1);
    if (this.selector) this.throwErr();


    const item = this.create(value);
    item.el = true;
    return item;
  },

  id(value) {
    // console.log(cssSelectorBuilder)
    if (this.selector && this.selector.match(/\.|::/)) this.throwErr();
    if (this.selector && this.customId) this.throwErr(1);
    const item = this.create(`#${value}`);

    item.customId = true;

    // console.log(item);

    return item;
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
    // console.log(`pseudoElement - ${value}`);
    // console.log(this);
    if (this.selector && this.pl) {
      this.throwErr(1);
    }
    // console.log('creating');
    const item = this.create(`::${value}`);
    item.pl = true;
    return item;
  },

  combine(selector1, combinator, selector2) {
    const newObj = {};
    newObj.selector = `${selector1.stringify()} ${combinator} ${selector2.stringify()}`;

    return Object.assign(newObj, cssSelectorBuilder);
  },

  stringify() {
    // console.log(this);
    return this.selector;
  },
};

// const builder = cssSelectorBuilder;
// builder.element('table').element('div')

//   builder.class('main').id('id')
//   builder.attr('href').class('download-link')
//   builder.pseudoClass('hover').attr('title')
//   builder.pseudoElement('after').pseudoClass('valid')
//   builder.pseudoElement('after').id('id')

// console.log(
//   builder.element('div').stringify() ,
//   'div'
// );
// console.log(
//   builder.id('nav-bar').stringify() ===
//   '#nav-bar'
// );
// console.log(
//   builder.class('warning').stringify()===
//   '.warning'
// );
// console.log(
//   builder.attr('href$=".png"').stringify()===
//   '[href$=".png"]'
// );
// console.log(
//   builder.pseudoClass('invalid').stringify()===
//   ':invalid'
// );
// console.log(
//   builder.pseudoElement('first-letter').stringify()===
//   '::first-letter'
// );

// // Test complex selectors
// console.log(
//   builder.element('li').id('main').stringify()===
//   'li#main'
// );
// console.log(
//   builder.element('div').class('container').stringify()===
//   'div.container'
// );


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
