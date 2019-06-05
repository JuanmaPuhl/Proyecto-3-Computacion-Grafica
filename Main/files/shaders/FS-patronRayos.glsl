var FS_Rayos = `#version 300 es
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

float snoise2(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,-0.577350269189626, 0.024390243902439);
    
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);

 	vec2 i1 = vec2(0.0);
    i1 = (x0.x > x0.y)? vec2(1.0, 0.0):vec2(0.0, 1.0);
    vec2 x1 = x0.xy + C.xx - i1;
    vec2 x2 = x0.xy + C.zz;
	
    i = mod289(i);
    vec3 p = permute(permute( i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0 ));
	vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x1,x1), dot(x2,x2)), 0.0);
    m = m*m ;
    m = m*m ;
    
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    
	m *= 1.79284291400159 - 0.85373472095314 * (a0*a0+h*h);

    vec3 g = vec3(0.0);
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * vec2(x1.x,x2.x) + h.yz * vec2(x1.y,x2.y);
    return 130.0 * dot(m, g);
    
}

float ridge(float h, float offset) {
    h = abs(h);     
    h = offset - h;
    h = h * h;     
    return h;
}

float ridgedMF(vec2 p, int OCTAVES) {
    float lacunarity = 5.0;
    float gain = .6;
    float offset = 0.7;

    float sum = 0.0;
    float freq = 1.0 ;
    float amp = 0.6;
    float prev = 0.9;
    
    for(int i=0; i < OCTAVES; i++) {
        float n = ridge(snoise2(p*freq), offset);
        sum += n*amp;
        sum += n*amp*prev;  
        prev = n;
        freq *= lacunarity;
        amp *= gain;
    }
    return sum;
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
    int Cant_Iteracion = 3;
  	color += ridgedMF(st*3.0, Cant_Iteracion);
    
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
    colorFrag= colorFrag+CookTorrenceBRDF;
   
    
}`
