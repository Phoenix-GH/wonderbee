/**
 * Created by nick on 09/08/16.
 */
import React from 'react';
import GL from 'gl-react';
const shaders = GL.Shaders.create({
  horizontal: {
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
      void main () {
        vec2 uv1 = uv * vec2(1.0, 2.0);
        vec2 uv2 = (uv + vec2(0.0, -0.5)) * vec2(1.0, 2.0);
        vec4 c1 = texture2D(texture2, uv1) * step(0.0, uv1.x)
         * step(uv1.x, 1.0) * step(0.0, 1.0-uv1.y) * step(1.0 - uv1.y, 1.0);
        vec4 c2 = texture2D(texture1, uv2) * step(0.0, uv2.x)
         * step(uv2.x, 1.0) *step(0.0, 1.0-uv2.y) * step(1.0 - uv2.y, 1.0);
        gl_FragColor = c1 + c2;
      }
    `
  },
  vertical: {
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
      void main () {
        vec2 uv2 = uv * vec2(2.0, 1.0);
        vec2 uv1 = (uv + vec2(-0.5, 0.0)) * vec2(2.0, 1.0);
        vec4 c1 = texture2D(texture2, uv1) * step(0.0, uv1.x)
         * step(uv1.x, 1.0) * step(0.0, 1.0-uv1.y) * step(1.0 - uv1.y, 1.0);
        vec4 c2 = texture2D(texture1, uv2) * step(0.0, uv2.x)
         * step(uv2.x, 1.0) *step(0.0, 1.0-uv2.y) * step(1.0 - uv2.y, 1.0);
        gl_FragColor = c1 + c2;
      }
    `
  }
});

export const Orientation = GL.createComponent(
  ({ source, orientation }) =>
    <GL.Node
      shader={orientation ? shaders.horizontal : shaders.vertical}
      uniforms={{
        texture1: { uri: source[0].uri },
        texture2: { uri: source[1].uri },
      }}
    />
);
