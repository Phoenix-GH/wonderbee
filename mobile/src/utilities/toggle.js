export function toggle(currentValue, options, returnOptions = []) {
  const index = options.indexOf(currentValue);
  return returnOptions.length === 0 ?
    options[index >= options.length - 1 ? 0 : index + 1] :
    returnOptions[index >= options.length - 1 ? 0 : index + 1];
}
