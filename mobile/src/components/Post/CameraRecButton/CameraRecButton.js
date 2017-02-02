import React, { PropTypes, Component } from 'react';
import { View } from 'react-native';
import GL from "gl-react";
import {Surface} from "gl-react-native";

const shaders = GL.Shaders.create({
  pieProgress: {
    frag: `
      precision highp float;
      varying vec2 uv;
      uniform float progress;
      uniform vec2 dim;
      const vec2 center = vec2(0.5);
      const float PI = acos(-1.0);
      void main () {
        float h = atan(uv.y-0.5, uv.x-0.5)/PI*180.0;
        if (h < 0.0) {
          h = h + 360.0;
        }
        float s = 1.0;
        float v = 1.0;
        h = h / 60.0;
        float i = floor(h);
        float f = h-i;
        float p = v*(1.0-s);
        float q = v*(1.0-s*f);
        float t = v*(1.0-s*(1.0-f));
        float r=0.0, g=0.0, b=0.0;
        if (i==0.0){
          r=v; g=t; b=p;
        } else if (i==1.0){
          r=q; g=v; b=p;
        } else if (i==2.0){
          r=p; g=v; b=t;
        } else if (i==3.0){
          r=p; g=q; b=v;
        } else if (i==4.0){
          r=t; g=p; b=v;
        } else {
          r=v; g=p; b=q;
        }
        vec2 norm = dim / min(dim.x, dim.y);
        vec2 delta = uv * norm - (norm-1.0)/2.0 - center;
        float inside =
          step(length(delta), 0.5) *
          step(0.45, length(delta)) *
          step((PI*1.0 + atan(delta.x, -1.0 * delta.y)) / (2.0 * PI), progress);
          gl_FragColor = mix(
            vec4(0.0, 0.0, 0.0, 0.0),
            vec4(r, g, b, 1.0),
            inside
          );
      }
    `
  }
});

const PieProgress = GL.createComponent(
  ({
    width,
    height,
    progress
  }) =>
  <GL.Node
    shader={shaders.pieProgress}
    uniforms={{
      dim: [ width, height ],
      progress
    }}
  />,
);

export class CameraRecButton extends Component {
  static propTypes = {
    progress: PropTypes.number.isRequired,
    radius: PropTypes.number.isRequired,
  };
  constructor(props, context) {
    super(props, context);
  }
  render() {
    const {radius} = this.props;
    return(
      <View style={{backgroundColor:'#000', borderRadius:radius}}>
        <Surface width={radius*2} height={radius*2} backgroundColor="transparent">
          <PieProgress progress={this.props.progress} />
        </Surface>
      </View>
    )
  }
}

CameraRecButton.defaultProps = {
  radius: 50,
  progress: 1,
};
