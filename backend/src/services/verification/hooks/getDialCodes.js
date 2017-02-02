import countryDialCodes from '../../../../lib/countries.json';

export default function () {
  return function (hook) {
    if (hook.params.query.dialCodes) {
      console.log(countryDialCodes);
      hook.result = countryDialCodes;
    }
    return hook;
  };
}
