import React from 'react'
import ReactInfinite from 'react-infinite'

class GetHeightWrapper extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      height: undefined
    }
  }

  componentDidMount() {
    this.setHeight()
  }

  setHeight() {
    var height = this.node.getBoundingClientRect().height
      if (height === 190) {
          height = 363;
      }
    this.props.addHeight(height)
    this.setState({height})
  }

  render() {
    var s = {
      display: 'block',
      clear: 'both',
    }
    return (
      <span ref={node => this.node = node}
          style={s}>
        {this.props.children}
      </span>
    )
  }
}

GetHeightWrapper.propTypes = {
  addHeight: React.PropTypes.func,
  children: React.PropTypes.node,
}


class InfiniteAnyHeight extends React.Component {
  constructor(props) {
    super(props)

    this._heights = [];
    this.state = {
      heights: [],
      list: [],
    };

    this.lastScrollTop = 0
    this.scrollTopDelta = 0
  }

  shouldComponentUpdate(nextProps, nextState)
  {
    const sameProps = this.areObjectsEqual(nextProps, this.props);
    const sameHeights = this.areArraysEquals(nextState.heights, this._heights);
// console.log('comparing heights');
// console.dir([...this._heights]);
// console.dir(nextState.heights);
// console.log(sameHeights);
// console.log('comparing props');
// console.log(Object.assign({}, nextProps));
// console.log(this.props);
// console.log(sameProps);

    const shouldUpdate = !sameProps || !sameHeights;

    this._heights = [...nextState.heights];

    return shouldUpdate;
  }

  areArraysEquals(a1, a2)
  {
      return a1.length===a2.length && a1.every((v,i)=> v === a2[i]);
  }

    areObjectsEqual () {
    var i, l, leftChain, rightChain;

    function compare2Objects (x, y) {
        var p;

        // remember that NaN === NaN returns false
        // and isNaN(undefined) returns true
        if (isNaN(x) && isNaN(y) && typeof x === 'number' && typeof y === 'number') {
            return true;
        }

        // Compare primitives and functions.
        // Check if both arguments link to the same object.
        // Especially useful on the step where we compare prototypes
        if (x === y) {
            return true;
        }

        // Works in case when functions are created in constructor.
        // Comparing dates is a common scenario. Another built-ins?
        // We can even handle functions passed across iframes
        if ((typeof x === 'function' && typeof y === 'function') ||
            (x instanceof Date && y instanceof Date) ||
            (x instanceof RegExp && y instanceof RegExp) ||
            (x instanceof String && y instanceof String) ||
            (x instanceof Number && y instanceof Number)) {
            return x.toString() === y.toString();
        }

        // At last checking prototypes as good as we can
        if (!(x instanceof Object && y instanceof Object)) {
            return false;
        }

        if (x.isPrototypeOf(y) || y.isPrototypeOf(x)) {
            return false;
        }

        if (x.constructor !== y.constructor) {
            return false;
        }

        if (x.prototype !== y.prototype) {
            return false;
        }

        // Check for infinitive linking loops
        if (leftChain.indexOf(x) > -1 || rightChain.indexOf(y) > -1) {
            return false;
        }

        // Quick checking of one object being a subset of another.
        // todo: cache the structure of arguments[0] for performance
        for (p in y) {
            if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
                return false;
            }
            else if (typeof y[p] !== typeof x[p]) {
                return false;
            }
        }

        for (p in x) {
            if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
                return false;
            }
            else if (typeof y[p] !== typeof x[p]) {
                return false;
            }

            switch (typeof (x[p])) {
                case 'object':
                case 'function':

                    leftChain.push(x);
                    rightChain.push(y);

                    if (!compare2Objects (x[p], y[p])) {
                        return false;
                    }

                    leftChain.pop();
                    rightChain.pop();
                    break;

                default:
                    if (x[p] !== y[p]) {
                        return false;
                    }
                    break;
            }
        }

        return true;
    }

    if (arguments.length < 1) {
        return true; //Die silently? Don't know how to handle such case, please help...
        // throw "Need two or more arguments to compare";
    }

    for (i = 1, l = arguments.length; i < l; i++) {

        leftChain = []; //Todo: this can be cached
        rightChain = [];

        if (!compare2Objects(arguments[0], arguments[i])) {
            return false;
        }
    }

    return true;
}

  getScrollContainer() {
    if (this.props.useWindowAsScrollContainer)
      return document.body
    return this.props.scrollContainer
  }

  addHeight(i, height) {
    var heights = this.state.heights
    var scrollDiff = height -heights[i]
    if (scrollDiff && this.scrollTopDelta < 0)
      this.getScrollContainer().scrollTop += scrollDiff
    heights[i] = height
    this.props.heightsUpdateCallback(heights)
    this.setState({heights})
  }

  componentDidMount() {
    this.setList(this.props.list)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.list != this.props.list)
      this.setList(nextProps.list)
  }

  setList(propsList) {
    var heights = []

    var list = propsList.map((x, i) => {
      heights[i] = this.state.heights[i] || this.props.heights[i] || 200

      return (
        <GetHeightWrapper
            addHeight={this.addHeight.bind(this, i)}
            key={i}>
          {x}
        </GetHeightWrapper>
      )
    })

    this.setState({
      heights,
      list,
    })
  }

  handleScroll() {
    var scrollTop = this.getScrollContainer().scrollTop
    this.scrollTopDelta = scrollTop -this.lastScrollTop
    this.lastScrollTop = scrollTop
  }

  render() {
    return (
      <ReactInfinite
        elementHeight={this.state.heights}
        handleScroll={this.handleScroll.bind(this)}
        {...this.props}
        >
        {this.state.list}
      </ReactInfinite>
    )
  }
}

InfiniteAnyHeight.defaultProps = {
  heightsUpdateCallback: ()=>{},
  heights: []
}

InfiniteAnyHeight.propTypes = {
  heights: React.PropTypes.array,
  heightsUpdateCallback: React.PropTypes.func,
  list: React.PropTypes.node,
  scrollContainer: React.PropTypes.object,
  useWindowAsScrollContainer: React.PropTypes.bool
}

export default InfiniteAnyHeight
