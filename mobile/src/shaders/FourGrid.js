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
      uniform sampler2D texture1;
      uniform sampler2D texture2;
      uniform sampler2D texture3;
      uniform sampler2D texture4;
      void main () {
        vec2 uv1 = uv * 2.0;
        vec2 uv2 = (uv + vec2(-0.5, 0.0)) * 2.0;
        vec2 uv3 = (uv + vec2(-0.0, -0.5)) * 2.0;
        vec2 uv4 = (uv + vec2(-0.5, -0.5)) * 2.0;
        vec4 c1 = texture2D(texture3, uv1) * step(0.0, uv1.x)
         * step(uv1.x, 1.0) * step(0.0, 1.0-uv1.y) * step(1.0 - uv1.y, 1.0);
        vec4 c2 = texture2D(texture4, uv2) * step(0.0, uv2.x)
         * step(uv2.x, 1.0) *step(0.0, 1.0-uv2.y) * step(1.0 - uv2.y, 1.0);
        vec4 c3 = texture2D(texture1, uv3) * step(0.0, uv3.x)
         * step(uv3.x, 1.0) * step(0.0, 1.0-uv3.y) * step(1.0 - uv3.y, 1.0);
        vec4 c4 = texture2D(texture2, uv4) * step(0.0, uv4.x)
         * step(0.0, 1.0-uv4.y) * step(1.0 - uv4.y, 1.0);
        gl_FragColor = c1 + c2 + c3 + c4;
      }
    `
  }
});

export const FourGrid = GL.createComponent(
  ({ source }) =>
    <GL.Node
      shader={shaders.shader}
      uniforms={{
        texture1: { uri: source[0] },
        texture2: { uri: source[1] },
        texture3: { uri: source[2] },
        texture4: { uri: source[3] },
      }}
    />
);
