varying vec2 vUv;
uniform float progress;
uniform float direction;
uniform float uTime;

void main()
{
    // vec4 mvPosition=modelViewMatrix*vec4(position,1.);
    // gl_PointSize=100.*(1./-mvPosition.z);
    vec3 pos=position;
    float distance=length(uv-vec2(.5));
    float maxdist=length(vec2(.5));
    float normalizedDistance=distance/maxdist;
    float stickTo=normalizedDistance;
    float stickOut=-normalizedDistance;
    
    float stick=mix(stickTo,stickOut,progress);
    
    float hyperProgress=min(2.*progress,2.*(1.-progress));
    
    float zOffset=2.;
    float zProgress=mix(clamp(2.*progress,0.,1.),clamp(1.-2.*(1.-progress),0.,1.),direction);
    
    pos.z+=zOffset*(stick*hyperProgress-zProgress);
    pos.z+=progress*sin(distance*10.+2.*uTime)*.1;
    
    gl_Position=projectionMatrix*modelViewMatrix*vec4(pos,1.);
    
    vUv=uv;
}