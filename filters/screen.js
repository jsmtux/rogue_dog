Phaser.Filter.Screen = function (game) {

    Phaser.Filter.call(this, game);

    //this.uniforms.texture = { type: 'sampler2D', value: undefined };
    this.uniforms.time = { type: '1f', value: 1.0 };
    this.uniforms.height = { type: '1f', value: 1.0 };

    this.fragmentSrc = [

        "precision mediump float;",

        "varying vec2       vTextureCoord;",
        "varying vec4       vColor;",
        "uniform sampler2D  uSampler;",
        "uniform float      time;",
        "uniform float      height;",
        
        "float noise(vec2 pos) {",
            "return fract(sin(dot(pos, vec2(12.9898 - time,78.233 + time))) * 43758.5453);",
        "}",
        
        "void main(void)",
        "{",
            "float pos = (gl_FragCoord.y + height) / 720.0;",
        
            "float c = sin(pos * 400.0) * 0.4 + 0.4;",
            "c = pow(c, 0.2);",
            "c *= 0.2;",
            
            "vec4 pic = texture2D(uSampler,vTextureCoord.xy);",
        
            "float band_pos = fract(time * 0.6) * 3.0 - 1.0;",
            "c += clamp( (1.0 - abs(band_pos - pos) * 10.0), 0.0, 1.0) * 0.1 * clamp(pic.r, 0.1, 0.6);",
            
            "c += c * 2. * step(0.8, pic.x);",
            
            "// noise",
            "c += (noise(gl_FragCoord.xy) - 0.5) * (0.09);",
        
            "float alphaTest = step(0.5, pic.a);",
            "gl_FragColor = vec4( 0.0, c * alphaTest, c * alphaTest, pic.a * 0.8 );",
        "}"
    ];

};

Phaser.Filter.Screen.prototype = Object.create(Phaser.Filter.prototype);
Phaser.Filter.Screen.prototype.constructor = Phaser.Filter.Screen;

Object.defineProperty(Phaser.Filter.Screen.prototype, 'time', {

    get: function() {
        return this.uniforms.time.value;
    },

    set: function(value) {
        this.uniforms.time.value = value;
    }

});

Object.defineProperty(Phaser.Filter.Screen.prototype, 'height', {

    get: function() {
        return this.uniforms.height.value;
    },

    set: function(value) {
        this.uniforms.height.value = value;
    }

});
