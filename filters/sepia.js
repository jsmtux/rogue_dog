Phaser.Filter.Sepia = function (game) {

    Phaser.Filter.call(this, game);

    this.uniforms.uIntensity = { type: '1f', value: 1.0 };
    
    this.fragmentSrc = [
                        "precision mediump float;",

                        "varying vec2       vTextureCoord;",
                        "varying vec4       vColor;",
                        "uniform sampler2D  uSampler;",
                        "uniform float      uIntensity;",
                        "// Vignette properties",
                        "const float RADIUS = 0.75;",
                        "const float SOFTNESS = 0.45;// Sepia Color",
                        "const vec3 SEPIA = vec3(1.25, 1.0, 0.85);\n",
                        "void main(void) {",
                        "    // Coordinate",
                        "    vec2 uv = vTextureCoord;",
                        "    ",
                        "    // Texture - the goofy mods are specifically for the nyan cat provided",
                        "    vec4 texColor = texture2D(uSampler, vTextureCoord);    //		1. VIGNETTE    // Center",
                        "    vec2 position = uv - vec2(0.5);    // Center position length",
                        "    float len = length(position);    // Smoothing the gradient",
                        "    float vignette = smoothstep(RADIUS, RADIUS-SOFTNESS, len);    // 50% vignette opacity",
                        "    texColor.rgb = mix(texColor.rgb, texColor.rgb * vignette, 0.5);    //		2. GRAYSCALE    // Grayscale conversion using NTSC conversion weights",
                        "    float gray = dot(texColor.rgb, vec3(0.299, 0.587, 0.114));    //		3. SEPIA    // Create sepia",
                        "    vec3 sepiaColor = vec3(gray) * SEPIA;    // Mix the opcatiy to 75%",
                        "    texColor.rgb = mix(texColor.rgb, sepiaColor, uIntensity);    // Final color",
                        "    gl_FragColor = texColor;",
                        "}"];
};

Phaser.Filter.Sepia.prototype = Object.create(Phaser.Filter.prototype);
Phaser.Filter.Sepia.prototype.constructor = Phaser.Filter.Sepia;

Object.defineProperty(Phaser.Filter.Gray.prototype, 'uIntensity', {

    get: function() {
        return this.uniforms.uIntensity.value;
    },

    set: function(value) {
        this.uniforms.uIntensity.value = value;
    }

});