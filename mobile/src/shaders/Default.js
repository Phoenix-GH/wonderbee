/**
 * Created by nick on 09/08/16.
 */
import React from 'react';
import GL from 'gl-react';
const shaders = GL.Shaders.create({
  shader: {
    vert: `
      precision highp float;
      attribute vec3 position;
      varying vec2 uv;
      void main() {
        gl_Position=vec4(position.x, position.y, 0.0, 1.0);
        uv = 0.5 * (position.xy + vec2(1.0, 1.0));
      }
    `,
    frag: `
      precision highp float;
      varying vec2 uv;
      uniform sampler2D texture;
      void main () {
        gl_FragColor = texture2D(texture, uv) * step(0.0, 1.0-uv.x) * step(0.0, 1.0-uv.y);
      }
    `
  }
});

export const Default = GL.createComponent(
  ({ children, width, height }) =>
    <GL.Node shader={shaders.shader} width={width} height={height}>
      <GL.Uniform name="texture">{children}</GL.Uniform>
    </GL.Node>
);
