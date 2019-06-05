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

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                        0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                        -0.577350269189626,  // -1.0 + 2.0 * C.x
                        0.024390243902439); // 1.0 / 41.0
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i); 
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))+ i.x + vec3(0.0, i1.x, 1.0 ));
	vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
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
	

    
    
    
	//vest = fTexCoor.xy;
 	vec2 st = fTexCoor.xy;
    vec2 pos = vec2(st*5.0);
    float DF = .5;
    vec2 vel = vec2(u_time*.1);
    DF += snoise(pos+vel)*.25+.25;
    float a = snoise(pos*vec2(cos(u_time*0.15),sin(u_time*0.1))*0.1)*3.1415;
    vel = vec2(cos(a),sin(a));
    DF += snoise(pos*vel)*.65+.25;
	vec3 color = vec3( smoothstep(.1,.2,fract(DF)) );
    
	color = vec3( smoothstep(.9,.1,fract(DF)) );
   	colorFrag =0.9*vec4(1.0-color,1.0)+0.5*colorFrag ;
  	colorFrag = vec4((CoefiienteAmbiental + colorFrag.xyz*Beckmann/4.0 + color*CookTorrenceBRDF),1.0);
   
    
}
