import React, { PropTypes, Component } from 'react';
import WebViewBridge from 'react-native-webview-bridge';

export class VideoPlayer extends Component {
  static propTypes = {
    uri: PropTypes.string.isRequired,
    maxtime: PropTypes.number.isRequired,
    onBridgeMessage: PropTypes.func.isRequired,
  };

  constructor(props, context) {
    super(props, context);
  }

  onBridgeMessage(message) {
    this.props.onBridgeMessage(JSON.parse(message));
  }

  sendToBridge(message) {
    this.refs.webviewbridge.sendToBridge(message);
  }

  render() {
    return(
      <WebViewBridge
        ref="webviewbridge"
        bounces={true}
        scrollEnabled={true}
        onBridgeMessage={this.onBridgeMessage.bind(this)}
        injectedJavaScript={this.getJavascript()}
        source={{html: this.getHtml()}}/>
    )
  }

  getHtml() {
    return `
      <video id='theVideo' style='display:none;'></video>
      <canvas id='theCanvas' style='width:100%'></canvas>
      <style>
      body {
        margin: 0;
        align-items: center;
        display: flex;
        background: #000;
      }
      *::-webkit-media-controls-start-playback-button {
        display: none!important;
        -webkit-appearance: none;
      }
      </style>
    `;
  }

  getJavascript() {
    return `
    (function () {

      var Player = function () {
        this.canvas = document.getElementById('theCanvas');
        this.video = document.getElementById('theVideo');
      }

      Player.prototype.init = function() {
        this.video.currentTime = 0;
        this.range = [0, Math.min(this.video.duration, ${this.props.maxtime})];
        this.canvas.width = 480;
        this.canvas.height = this.canvas.width * this.video.videoHeight / this.video.videoWidth;
        WebViewBridge.send(JSON.stringify({
          type: 'info',
          duration: this.video.duration,
          range: this.range,
        }));
      }

      Player.prototype.play = function(uri) {
        if (uri) {
          this.video.src = uri;
          this.video.load();
          var self = this;
          this.video.addEventListener('loadeddata', function() {
            self.init();
            self.getAllFilterPreviews();
            self.play();
          });
        } else {
          this.playing = true;
          this.lastTime = Date.now();
          this.loop();
        }
      }

      Player.prototype.stop = function() {
        this.playing = false;
      }

      Player.prototype.setFrame = function(frame) {
        if (frame < this.range[0] || frame > this.range[1]) {
          frame = this.range[0];
        }
        this.video.currentTime = frame;
        this.render(this.canvas, this.filter);
      }

      Player.prototype.loop = function() {
        var time = Date.now();
        var elapsed = (time - this.lastTime) / 1000;
        if(elapsed >= (1 / 25)) {
          this.setFrame(this.video.currentTime + elapsed);
          this.lastTime = time;
        }
        if (this.playing) {
          var self = this;
          this.animationFrame = requestAnimationFrame(function() {
            self.loop();
          });
        } else {
          cancelAnimationFrame(this.animationFrame);
        }
      }

      Player.prototype.getAllFilterPreviews = function() {
        var canvas = document.createElement('canvas');
        canvas.width = 200;
        canvas.height = canvas.width * this.video.videoHeight / this.video.videoWidth;
        var imgs = [];
        for(var i=0; i<7; i++) {
          this.render(canvas, i);
          var uri = canvas.toDataURL();
          imgs.push(uri);
        }
        WebViewBridge.send(JSON.stringify({type:'filterIcons', data:imgs}));
      }

      Player.prototype.getCover = function(frame) {
        var canvas = document.createElement('canvas');
        canvas.width = this.video.videoWidth;
        canvas.height = this.video.videoHeight;
        this.video.currentTime = frame;
        this.render(canvas, this.filter);
        var uri = canvas.toDataURL();
        WebViewBridge.send(JSON.stringify({type:'coverImg', data:uri}));
      }

      Player.prototype.render = function(canvas, filter) {
        // var c = document.createElement('canvas');
        // c.width = canvas.width*2;
        // c.height = canvas.height*2;
        // c.getContext('2d').drawImage(this.video, 0, 0, c.width, c.height);

        var context = canvas.getContext('2d');
        //context.drawImage(c, 0, 0, canvas.width, canvas.height);
        context.drawImage(this.video, 0, 0, canvas.width, canvas.height);
        if (!filter) return;

        var idata = context.getImageData(0, 0, canvas.width, canvas.height);
        var data = idata.data;
        switch (filter) {
          case 1:
            for(var i = 0; i < data.length; i+=4) {
                var r = data[i];
                var g = data[i+1];
                var b = data[i+2];
                var brightness = (3*r+4*g+b)>>>3;
                data[i] = brightness;
                data[i+1] = brightness;
                data[i+2] = brightness;
            }
            break;
          case 2:
            var w = idata.width;
            var limit = data.length
            for(var i = 0; i < limit; i++) {
                if( i%4 == 3 ) continue;
                data[i] = 127 + 2*data[i] - data[i + 4] - data[i + w*4];
            }
            break;
          case 3:
            for(var i = 0; i < data.length; i+=4) {
                data[i] = 0;
            }
            break;
          case 4:
            for(var i = 0; i < data.length; i+=4) {
                data[i+1] = 0;
            }
            break;
          case 5:
            for(var i = 0; i < data.length; i+=4) {
                data[i+2] = 0;
            }
            break;
          case 6:
            for(var i = 0; i < data.length; i+=4) {
                var r = data[i];
                var g = data[i+1];
                var b = data[i+2];
                data[i] = g;
                data[i+1] = b;
                data[i+2] = r;
            }
            break;
          default:
            return;
        }
        idata.data = data;
        context.putImageData(idata, 0, 0);
      }

      var player = new Player();
      player.play('${this.props.uri}');

      if (WebViewBridge) {
        WebViewBridge.onMessage = function (message) {
          var data = JSON.parse(message) || {};
          if (data.play) {
            player.play(data.uri);
          } else if (data.stop) {
            player.stop();
          }
          if (data.range != undefined) {
            player.range = data.range;
          }
          if (data.frame != undefined) {
            player.setFrame(data.frame);
          }
          if (data.filter != undefined) {
            player.filter = data.filter;
          }
          if (data.getCover != undefined) {
            player.getCover(data.getCover);
          }
        };
      }

    }());
    `;
  }
}
