varying vec2 vUv;

void main()
{
    // vec4 mvPosition=modelViewMatrix*vec4(position,1.);
    // gl_PointSize=100.*(1./-mvPosition.z);
    vec3 pos=position;
    float distance=length(uv-vec2(.5));
    float maxdist=length(vec2(.5));
    float normalizedDistance=distance/maxdist;
    float stickTo=normalizedDistance;
    
    pos.z+=stickTo;
    
    gl_Position=projectionMatrix*modelViewMatrix*vec4(pos,1.);
    
    vUv=uv;
}