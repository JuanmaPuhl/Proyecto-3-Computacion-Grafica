var fs_degradacion = `#version 300 es
#define PHI 3.1415926535897932384626433832795
precision highp float;
uniform mat4 modelMatrix;

in vec2 fTexCoor;
in vec3 vNE; 
in vec3 vLE;
in vec3 vVE;

out vec4 colorFrag;

uniform float rugosidad; // Se usa en las funciones de microfacetas
uniform float F0;        //Se usa en las funciones de fresnel

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }


// Se utiliza en Patron 1
float linesX(vec2 pos, float b){
    float scale = 3.0;
    pos *= scale;
    return smoothstep(0.0,.5+b*.5,abs((sin(pos.x*3.1415)+b*2.0))*.5);
}
float linesY(vec2 pos, float b){
    float scale = .5;
    pos *= scale;
    return smoothstep(0.0,.5+b*.5,abs((sin(pos.y*3.1415)+b*2.0))*.5);
}
float random (vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))
                 * 43758.5453123);
}
float noise (vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    // Smooth Interpolation

    // Cubic Hermine Curve.  Same as SmoothStep()
    vec2 u = f*f*(3.0-2.0*f);
    // u = smoothstep(0.,1.,f);

    // Mix 4 coorners percentages
    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}
mat2 rotate2d(float angle){
    return mat2(1.0+cos(0.5*angle),-sin(angle),
                sin(angle),8.0+cos(angle));
}
void main()
{
    // Normalizo los vectores
    vec3 N = normalize(vNE);
    vec3 L = normalize(vLE);
    vec3 V = normalize(vVE);
    vec3 H = normalize(L+V);
	
    
    
   	vec2 st = fTexCoor.xy;
    vec3 color = vec3(0.0);
    
    vec2 pos = vec2(st*2.0);
    float n = noise(pos);
	pos = rotate2d( noise(pos) ) * pos; // rotate the space
    float pattern = linesY(st,5.8) * linesX(st,0.02); // draw lines
    
    // Producto escalar
    float NdotH = max(dot(N,H),0.000001);
    float NdotL = max(dot(N,L),0.000001);
    float VdotH = max(dot(V,H),0.000001);
    float NdotV = max (dot(N,V),0.00001);
    float HdotL = max (dot(H,L),0.00001);
    

    
    
    
    //Termino de Fresnel segun Schlick

    float terminoN = (1.0+sqrt(F0))/(1.0-sqrt(F0));
    float terminoC = max(dot(V,H),0.0);
    float terminoG = sqrt( pow(terminoN,2.0) + pow(terminoC,2.0) -1.0);
    float CK1T = pow( (terminoG-terminoC)/(terminoG+terminoC) ,2.0) * 0.5;
    float CK2T = (1.0 + pow( ( (terminoG + terminoC)*terminoC -1.0 )/((terminoG - terminoC)*terminoC + 1.0 ),2.0));
    float CK = CK1T*CK2T;
    
    //NDF - Termino de Trrowbridge-Reitz
    
    float coeficienteATR = rugosidad*rugosidad;
    float divisorTR = 3.1415 * pow( (pow(NdotH,2.0)*(coeficienteATR-1.0)) +1.0 ,2.0 );
    float TrRe = coeficienteATR / divisorTR;
    
    
    //Geometric Shadowing - Kelemen
    float GSKelemen = (NdotL * NdotV) / pow(VdotH,2.0);
    
	float Fresnel = CK;
   	float NDF = TrRe;
   	float GeometricShadowing = GSKelemen;
    
   	float CookTorrenceBRDF = (NDF * GeometricShadowing * CK) / (4.0 * NdotL * NdotV);
	
	colorFrag= vec4(color,1.0);
   	colorFrag= vec4(vec3(pattern)/PHI + CookTorrenceBRDF,1.0);
   
    
}`
