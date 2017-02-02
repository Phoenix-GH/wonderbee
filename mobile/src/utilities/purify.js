const purifiedComponents = new WeakMap();

function shallowEqual(obj, newObj) {
  if (obj === newObj) {
    return true;
  }

  const keys = Object.keys(obj);
  const keysNew = Object.keys(newObj);

  if (keys.length !== keysNew.length) {
    return false;
  }

  const hasOwn = Object.prototype.hasOwnProperty;

  for (let i = 0; i < keys.length; i++) {
    if (! keysNew::hasOwn(keys[i]) ||
        obj[keys[i]] !== newObj[keys[i]]) {
      return false;
    }
  }

  return true;
}

export default function purify(component, withState = true) {
  const cachedComponent = purifiedComponents.get(component);

  if (cachedComponent) {
    return cachedComponent;
  }

  const nextComponent = class extends component {
    shouldComponentUpdate(nextProps, nextState) {
      return shallowEqual(this.props, nextProps) && (
        !withState || shallowEqual(this.state, nextState)
      );
    }
  };

  purifiedComponents.set(component, nextComponent);

  return nextComponent;
}
