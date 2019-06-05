var vertexShaderSource = `#version 300 es
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
uniform vec3 CoefiienteAmbiental;

float random (vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}
float noise (vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}
#define OCTAVES 6
float fbm (vec2 st) {
    // Initial values
    float value = 0.0;
    float amplitude = .5;
    float frequency = 0.;
    //
    // Loop of octaves
    for (int i = 0; i < OCTAVES; i++) {
        value += amplitude * noise(st);
        st *= 2.;
        amplitude *= .5;
    }
    return value;
}


void main()
{
    float u_time=10.0*modelMatrix[0][0];
    // Normalizo los vectores
    vec3 N = normalize(vNE);
    vec3 L = normalize(vLE);
    vec3 V = normalize(vVE);
    vec3 H = normalize(L+V);
	
    
    
    
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
    
       // NDF - Termino de Beackmann
    float Beckmann;
 	float coeficienteA = max(rugosidad*rugosidad, 0.00001);
    float divisorBec = pow(coeficienteA,2.0)* pow(NdotH,4.0);
    float exponente = -(pow(tan(acos(NdotH))/coeficienteA,2.0));
    exponente = exp(exponente);
    Beckmann = exponente/divisorBec;
    
    
    //Geometric Shadowing - Kelemen
    float GSKelemen = (NdotL * NdotV) / pow(VdotH,2.0);
    
	float Fresnel = CK;
   	float NDF = TrRe;
   	float GeometricShadowing = GSKelemen;
    
   	float CookTorrenceBRDF = (NDF * GeometricShadowing * CK) / (4.0 * NdotL * NdotV);
	

    vec2 st = fTexCoor.st;
    

    vec3 color = vec3(0.0);
    color += fbm(st*3.0*u_time);

    colorFrag= vec4(color,1.0);
    colorFrag = vec4((CoefiienteAmbiental + color.xyz*Beckmann/4.0 + color*CookTorrenceBRDF),1.0);
    
	
    
}
