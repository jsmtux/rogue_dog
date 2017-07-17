/**
* @author Mat Groves http://matgroves.com/ @Doormat23
*/

/**
* This turns your displayObjects to grayscale.
* @class Gray
* @contructor
*/
Phaser.Filter.Gray = function (game) {

    Phaser.Filter.call(this, game);

    this.uniforms.gray = { type: '1f', value: 1.0 };
    this.uniforms.mask = { type: 'sampler2D', value: undefined };

    this.fragmentSrc = [

        "precision mediump float;",

        "varying vec2       vTextureCoord;",
        "varying vec4       vColor;",
        "uniform sampler2D  uSampler;",
        "uniform sampler2D  mask;",

        "void main(void) {",
            "gl_FragColor = texture2D(uSampler, vTextureCoord);",
            "vec2 correctedUV = vec2(vTextureCoord.x, 1.0 - vTextureCoord.y);",
            "vec4 maskColor = texture2D(mask, correctedUV);",
            "gl_FragColor.rgb = vec3(gl_FragColor.r * maskColor.x, gl_FragColor.g * maskColor.y, gl_FragColor.b * maskColor.z);",
        "}"
    ];

};

Phaser.Filter.Gray.prototype = Object.create(Phaser.Filter.prototype);
Phaser.Filter.Gray.prototype.constructor = Phaser.Filter.Gray;

Object.defineProperty(Phaser.Filter.Gray.prototype, 'mask', {

    get: function() {
        return this.uniforms.mask.value;
    },

    set: function(value) {
        this.uniforms.mask.value = value;
    }

});
