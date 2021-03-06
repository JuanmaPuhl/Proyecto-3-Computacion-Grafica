var FS_Lava = `#version 300 es
#define PI 3.1415926535897932384626433832795
precision highp float;
uniform mat4 modelMatrix;

in vec2 fTexCoor;
in vec3 vNE;
in vec3 vVE;

out vec4 colorFrag;

struct Light{
  vec4 posL;
  vec4 dirL;
  float limit;
  vec3 ia;
  int type;
};
uniform Light lights[10];
uniform float rugosidad; // Se usa en las funciones de microfacetas
uniform float F0;        //Se usa en las funciones de fresnel
uniform float p;
uniform float sigma;
uniform vec3 ka;
uniform vec3 kd;
uniform vec3 ks;
uniform float coefEspec;
uniform mat4 viewMatrix;

uniform float u_time;
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

float orenNayar(vec3 N, vec3 V, vec3 L, vec3 H){
  float f0N = 0.0;

  float A = 1.0 - 0.5 * sigma/(pow(sigma,2.0)+0.33);
  float B = 0.45 * (sigma/(pow(sigma,2.0)+0.09));
  float cosR = max(dot(N,V),0.0);
  float cosI = max(dot(N,L),0.0);
  float anguloR = acos(cosR);
  float anguloI = acos(cosI);
  float a = max(anguloR,anguloI);
  float b = min(anguloR,anguloI);
  float cosPHI = dot( normalize(V-N*(cosR)), normalize(L - N*(cosI)) );
  f0N = (p/PI)*cosI*(A+(B*max(0.0,cosPHI))*sin(a)*tan(b));
  return f0N;
}


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

vec3 calcularAportePuntual(Light l, vec3 N , vec3 V){
  vec4 posL = l.posL;
  vec4 dirL = l.dirL;
  vec3 ia = l.ia;
  float limit = l.limit;
  vec3 light_direction = vec3(posL + vec4(vVE,1.0)); //direccion de la luz al vertice
  vec3 L = normalize(light_direction);
  vec3 H = normalize(V+L);
  vec3 S = normalize(vec3(dirL));
  vec3 toReturn = vec3(0.0,0.0,0.0);
  float titaH = max(dot(N,H),0.0);
  float titaI = max(dot(N,L),0.0);


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
  color =0.9 * 1.0 - color + 0.5 *color ;

  float Beckmann;
  //Termino de Fresnel
  float Fres = pow(1.0 - titaH, 5.0);
  Fres *= (1.0 - F0);
  Fres += F0;
  //Termino de Beackmann
  float divisor = pow(rugosidad,2.0)* pow(titaH,4.0);
  float exponente = -(pow(tan(acos(titaH))/rugosidad,2.0));
  exponente = exp(exponente);
  Beckmann = exponente/divisor;
  //Variables de la atenuacion geometrica
  float GCT;
  float Ge;
  float Gs;
  float titaV = max(dot(V,H),0.0);
  Ge = (2.0*titaH*titaV)/(titaV);
  Gs = (2.0*titaH*titaI)/(titaV);
  GCT=min(1.0,Ge);
  GCT=min(GCT,Gs);
  float componente1 = max(dot(N,V),0.0);
  float componente2 = max(dot(N,L),0.0);
  float value = orenNayar(N,V,L,H);

  if(componente1*componente2!=0.0)
    toReturn = ia*(vec3(1.0,0.0,0.0)*color*value+vec3(1.0,0.0,0.0)*ks*(Fres/3.141516)* (Beckmann*GCT)/(componente1*componente2));
  else
     toReturn =ia*color*vec3(1.0,0.0,0.0)*value;
  return toReturn;

}

vec3 calcularAporteSpot(Light l, vec3 N, vec3 V){
  vec4 posL = l.posL;
  vec4 dirL = l.dirL;
  vec3 ia = l.ia;
  float limit = l.limit;
  vec3 light_direction = vec3(posL + vec4(vVE,1.0)); //direccion de la luz al vertice
  vec3 L = normalize(light_direction);
  vec3 H = normalize(V+L);
  vec3 S = normalize(vec3(dirL));
  vec3 toReturn = vec3(0.0,0.0,0.0);
  float titaH = max(dot(N,H),0.0);
  float titaI = max(dot(N,L),0.0);
  float angle = acos(max(dot(S,-L),0.0));
  float inlight = smoothstep(radians(degrees(acos(limit))+10.0),acos(limit),angle);

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
  color =0.9 * 1.0 - color + 0.5 *color ;

  float Beckmann;
  //Termino de Fresnel
  float Fres = pow(1.0 - titaH, 5.0);
  Fres *= (1.0 - F0);
  Fres += F0;
  //Termino de Beackmann
  float divisor = pow(rugosidad,2.0)* pow(titaH,4.0);
  float exponente = -(pow(tan(acos(titaH))/rugosidad,2.0));
  exponente = exp(exponente);
  Beckmann = exponente/divisor;
  //Variables de la atenuacion geometrica
  float GCT;
  float Ge;
  float Gs;
  float titaV = max(dot(V,H),0.0);
  Ge = (2.0*titaH*titaV)/(titaV);
  Gs = (2.0*titaH*titaI)/(titaV);
  GCT=min(1.0,Ge);
  GCT=min(GCT,Gs);
  float componente1 = max(dot(N,V),0.0);
  float componente2 = max(dot(N,L),0.0);
  float value = orenNayar(N,V,L,H);

  if(componente1*componente2!=0.0)
    toReturn = ia*(inlight*vec3(1.0,0.0,0.0)*color*value+inlight*vec3(1.0,0.0,0.0)*ks*(Fres/3.141516)* (Beckmann*GCT)/(componente1*componente2));
  else
     toReturn =ia*inlight*vec3(1.0,0.0,0.0)*color*value;
  return toReturn;

}

vec3 calcularAporteDireccional(Light l, vec3 N , vec3 V){
  vec4 posL = l.posL;
  vec4 dirL = l.dirL;
  vec3 ia = l.ia;
  float limit = l.limit;
  vec3 light_direction = vec3(posL + vec4(vVE,1.0)); //direccion de la luz al vertice
  vec3 L = normalize(light_direction);
  vec3 S = -normalize(vec3(dirL));
  vec3 H = normalize(V+S);
  vec3 toReturn = vec3(0.0,0.0,0.0);
  float titaH = max(dot(N,H),0.0);
  float titaI = max(dot(N,S),0.0);

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
  color =0.9 * 1.0 - color + 0.5 *color ;

  float Beckmann;
  //Termino de Fresnel
  float Fres = pow(1.0 - titaH, 5.0);
  Fres *= (1.0 - F0);
  Fres += F0;
  //Termino de Beackmann
  float divisor = pow(rugosidad,2.0)* pow(titaH,4.0);
  float exponente = -(pow(tan(acos(titaH))/rugosidad,2.0));
  exponente = exp(exponente);
  Beckmann = exponente/divisor;
  //Variables de la atenuacion geometrica
  float GCT;
  float Ge;
  float Gs;
  float titaV = max(dot(V,H),0.0);
  Ge = (2.0*titaH*titaV)/(titaV);
  Gs = (2.0*titaH*titaI)/(titaV);
  GCT=min(1.0,Ge);
  GCT=min(GCT,Gs);
  float componente1 = max(dot(N,V),0.0);
  float componente2 = max(dot(N,S),0.0);
  float value = orenNayar(N,V,S,H);

  if(componente1*componente2!=0.0)
    toReturn = ia*(vec3(1.0,0.0,0.0)*color*value+vec3(1.0,0.0,0.0)*ks*(Fres/3.141516)* (Beckmann*GCT)/(componente1*componente2));
  else
     toReturn =ia*vec3(1.0,0.0,0.0)*color*value;
  return toReturn;

}



void main()
{
    //u_time=10.0*modelMatrix[0][0];
    // Normalizo los vectores
    vec3 N = normalize(vNE);
    //vec3 L = normalize(vLE);
    vec3 V = normalize(vVE);
    //vec3 H = normalize(L+V);

    colorFrag = vec4(0.0);
    int cant = lights.length();
    for(int i = 0; i<cant; i++){
      if(lights[i].type==0)
        colorFrag += vec4(calcularAporteSpot(lights[i],N,V),1.0);
      if(lights[i].type==1)
        colorFrag += vec4(calcularAportePuntual(lights[i],N,V),1.0);
      if(lights[i].type==2)
        colorFrag += vec4(calcularAporteDireccional(lights[i],N,V),1.0);
    }


}`
