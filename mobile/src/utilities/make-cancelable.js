function CancelledPromiseError(originalError) {
  this.name = 'CancelledPromiseError';
  this.originalError = originalError;
  this.isCanceled = true;
}

CancelledPromiseError.prototype = Error.prototype;

export const makeCancelable = (promise) => {
  let hasCanceled = false;

  promise.then(val => {
    if (hasCanceled) {
      throw new CancelledPromiseError();
    }
    return val;
  })
  .catch(error => {
    if (hasCanceled) {
      return new CancelledPromiseError(error);
    }
    return error;
  });

  return {
    promise,
    cancel() {
      hasCanceled = true;
    },
  };
};
