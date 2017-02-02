/**
 * Created by nick on 09/08/16.
 */
import React from 'react';
import GL from 'gl-react';
const shaders = GL.Shaders.create({
  image: {
    vert: `
      precision highp float;
      attribute vec3 position;
      varying vec2 uv;
      uniform float u_s;
      uniform float u_r;
      uniform float u_left;
      uniform float u_top;
      void main() {
        float x0 = position.x;
        float y0 = position.y;
        x0 = x0 * u_s;
        y0 = y0 * u_s;
        float x1 = x0 * cos(u_r) - y0 * sin(u_r);
        float y1 = x0 * sin(u_r) + y0 * cos(u_r);
        y1 = y1 + u_top;
        x1 = x1 + u_left;
        gl_Position=vec4(x1, y1, 0.0, 1.0);
        uv = 0.5 * (position.xy + vec2(1.0, 1.0));
      }
    `,
    frag: `
      precision highp float;
      varying vec2 uv;
      uniform sampler2D texture;
      uniform vec4 u_crop;
      vec2 invert (vec2 p) {
        return vec2(p.x, 1.0-p.y);
      }
      void main () {
      vec2 p = invert(invert(uv) * u_crop.zw + u_crop.xy);
        gl_FragColor =
          step(0.0, p.x) *
          step(0.0, p.y) *
          step(p.x, 1.0) *
          step(p.y, 1.0) *
          texture2D(texture, p);
      }
    `
  }
});

const calculateCrop = (width, height) => {
  const ratio = 1.0;
  const imageRatio = width / height;
  return (
    imageRatio < 1.0
      ? [(1 - ratio / imageRatio) / 2, 0, ratio / imageRatio, 1]
      : [0, (1 - imageRatio / ratio) / 2, 1, imageRatio / ratio]
  );
};

export const Transform = GL.createComponent(
  ({
    source, rotate, translateX, translateY, scale, width, height, cropSize
  }) => {
    const angle = 3.14 / 180 * (rotate);
    const imageRatio = width / height;
    const cropScale = imageRatio > 1.0 ? scale * imageRatio : scale / imageRatio;
    const crop = calculateCrop(width, height);
    return (
      <GL.Node
        width={width}
        height={height}
        shader={shaders.image}
        uniforms={{
          texture: source.uri,
          u_r: angle,
          u_s: cropScale,
          u_crop: crop,
          u_left: translateX / cropSize,
          u_top: -translateY / cropSize,
        }}
      >
      </GL.Node>
    );
  }
);

