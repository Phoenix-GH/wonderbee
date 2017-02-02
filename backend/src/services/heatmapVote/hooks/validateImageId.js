import { BadRequest } from 'feathers-errors';

export default function () {
  return function validateImageId(hook) {
    if (!hook.data.imageId) {
      throw new BadRequest('Invalid imageId', { imageId: 'imageId is required' });
    }
  };
}
