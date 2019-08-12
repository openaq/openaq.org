'use strict';
import qs from 'qs';
import { set, get } from 'lodash';

/**
 * Qs State is used to sync a state object with url search string.
 * Given a search string will return an object and given an object will return
 * a search string.
 * Values will be validated according to the state definition and returned
 * in an object whose path is defined by the accessor.
 *
 * Example:
 * {
 *  field: {
 *    accessor: 'filters.field',
 *    hydrator: (v) => v,
 *    default: 'all',
 *    validator: [1, 2, 3]
 *  }
 * }
 *
 * {string} accessor - Where in the state object to look for the value. When
 *                     returning the state it will also be the path to the val.
 * {func} hydrator - Any transformation to apply to the value from the search
 *                   string before using it. Converting to number for example.
 * {func} dehydrator - Any transformation to apply to the value before adding it
 *                     to the search. Converting a number to string for example.
 * {string|num} default - Default value. To note that when a state value is
 *                        default it won't go to the search string.
 * {array|func} validator - Validator function for the value. If is an array
 *                          should contain valid options. If it is a function
 *                          should return true or false.
 *
 * @param {object} definition The definition object.
 *
 */
export default class QsState {
  constructor (definition) {
    // {
    //   field: {
    //     accessor: 'filters.field',
    //     hydrator: () => {}
    //     dehydrator: () => {}
    //     default: 'all',
    //     validator: [1, 2, 3]
    //   }
    // }
    this.definition = definition;
  }

  /**
   * Sets a new definition
   *
   * @param {string} opt What definition to update
   * @param {object} definition New or additional definition values
   * @param {bool} force If true the definition will be replaced, otherwise
   *                     merged. Default false
   */
  setDefinition (opt, definition, force = false) {
    this.definition[opt] = force
      ? definition
      : Object.assign({}, this.definition[opt], definition);

    return this;
  }

  /**
   * Gets the state from the search string.
   *
   * @param {string} qString The search string: param=1&param=2
   *
   * @returns {object} The new state
   */
  getState (qString) {
    const parsedQS = qs.parse(qString);
    const validOptions = Object.keys(this.definition);

    return validOptions.reduce((acc, opt) => {
      const optDef = this.definition[opt];
      // Function to convert the value from the string before using it.
      const hydrator = optDef.hydrator || (v => v);
      // Get the value.
      const value = hydrator(parsedQS[opt]);

      // Get the correct validator
      let validator = v => !!v;
      if (optDef.validator && typeof optDef.validator.indexOf === 'function') {
        validator = v => optDef.validator.indexOf(v) !== -1;
      } else if (typeof optDef.validator === 'function') {
        validator = optDef.validator;
      }

      const v = validator(value) ? value : optDef.default;

      return set(acc, optDef.accessor, v);
    }, {});
  }

  /**
   * Computes the query object from the state.
   *
   * @param {object} state The state from where to get the values
   *
   * @returns {object} The query object ready to be stringified
   */
  getQueryObject (state) {
    const validOptions = Object.keys(this.definition);
    return validOptions.reduce((acc, opt) => {
      const optDef = this.definition[opt];
      // Function to convert the value to the string before using it.
      const dehydrator = optDef.dehydrator || (v => v);
      // Get the value.
      const value = dehydrator(get(state, optDef.accessor, optDef.default));

      if (value !== optDef.default) {
        return Object.assign({}, acc, {
          [opt]: value
        });
      }

      return acc;
    }, {});
  }

  /**
   * Computes the search string from the state.
   *
   * @param {object} state The state from where to get the values
   *
   * @returns {string} The new search string
   */
  getQs (state) {
    return qs.stringify(this.getQueryObject(state));
  }
}

// Example in the wild.
// class Cmp extends Component {
//   constructor (props) {
//     super(props);

//     this.qsState = new QsState({
//       province: {
//         accessor: 'province',
//         default: null
//       },
//       district: {
//         accessor: 'district',
//         default: null
//       },
//       round: {
//         accessor: 'round',
//         default: null
//       }
//     });

//     this.state = {
//       ...this.qsState.getState(this.props.location.search.substr(1))
//     };

//     this.onNavValueChange = this.onNavValueChange.bind(this);
//   }

//   async onNavValueChange (what, id) {
//     await this.setState({ [what]: id });
//     // Update the url
//     const qString = this.qsState.getQs(this.state);
//     this.props.history.push({ search: qString });
//   }

//   render () {
//     const {
//       province,
//       district,
//       round
//     } = this.state;

//     return (
//      ...
//     );
//   }
// }
