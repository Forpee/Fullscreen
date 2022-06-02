uniform float uTime;
uniform vec4 uResolution;
uniform sampler2D uTexture;
uniform float progress;
uniform float speed;
uniform vec2 uMouse;

varying vec2 vUv;

void main()
{
    float normSpeed=clamp(speed*10.,0.,1.);
    float mouseDist=length(vUv-uMouse);
    
    float c=smoothstep(.2,0.,mouseDist);
    
    vec2 newUv=(vUv-vec2(.5))*uResolution.zw+vec2(.5);
    vec4 color=texture2D(uTexture,newUv);
    
    float r=texture2D(uTexture,newUv+.5*c*normSpeed).r;
    float g=texture2D(uTexture,newUv+.3*c*normSpeed).g;
    float b=texture2D(uTexture,newUv+.1*c*normSpeed).b;
    
    gl_FragColor=color;
    gl_FragColor=vec4(normSpeed*mouseDist,0.,0.,1.);
    gl_FragColor=vec4(c,0.,0.,1.);
}