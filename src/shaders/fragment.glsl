uniform float uTime;
uniform vec4 uResolution;
uniform sampler2D uTexture;
uniform float progress;

varying vec2 vUv;

void main()
{
    vec2 newUv=(vUv-vec2(.5))*uResolution.zw+vec2(.5);
    vec4 color=texture2D(uTexture,newUv);
    gl_FragColor=vec4(progress,1.,1.,1.);
    // gl_FragColor=color;
}