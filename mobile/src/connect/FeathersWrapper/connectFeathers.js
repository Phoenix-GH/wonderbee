import { Component, createElement } from 'react';
import contextShape from './utils/contextShape';
import shallowEqual from './utils/shallowEqual';
import invariant from 'invariant';

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export function connectFeathers(WrappedComponent, options = {}) {
  const displayName = `Feathers(${getDisplayName(WrappedComponent)})`;
  const { pure = true, withRef = false } = options;

  class FeathersConnector extends Component {
    static propTypes = {
      feathers: contextShape
    };

    static contextTypes = {
      feathers: contextShape
    };

    constructor(props, context) {
      super(props, context);
      this.feathers = props.feathers || context.feathers;
      this.haveOwnPropsChanged = false;
      this.state = {};

      invariant(this.feathers,
        'Could not find "feathers" in either the context or ' +
        `props of "${displayName}". ` +
        'Either wrap the root component in a <FeathersWrapper>, ' +
        'or explicitly pass "feathers" as a prop to "${displayName}".'
      );
    }

    componentWillReceiveProps(nextProps) {
      if (!pure || !shallowEqual(nextProps, this.props)) {
        this.haveOwnPropsChanged = true;
      }
    }

    shouldComponentUpdate() {
      return !pure || this.haveOwnPropsChanged;
    }

    getWrappedInstance() {
      invariant(withRef,
        'To access the wrapped instance, you need to specify ' +
        '{ withRef: true } as the fourth argument of the connect() call.'
      );

      return this._ref;
    }


    render() {
      const finalProps = {
        feathers: this.feathers,
        ...this.state,
        ...this.props
      };

      if (withRef) {
        this.renderedElement = createElement(WrappedComponent, {
          ...finalProps,
          ref: (ref) => (this._ref = ref)
        });
      } else {
        this.renderedElement = createElement(WrappedComponent,
          finalProps
        );
      }

      return this.renderedElement;
    }
  }

  return FeathersConnector;
}
