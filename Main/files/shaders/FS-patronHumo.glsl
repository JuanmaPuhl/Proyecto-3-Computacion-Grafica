var FS_Humo = `#version 300 es
#define PI 3.1415926535897932384626433832795
precision highp float;
uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
in vec2 fTexCoor;
in vec3 vNE;
// in vec3 vLE;
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
uniform float u_time;

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

vec3 calcularAporteSpot(Light l, vec3 N , vec3 V){
  vec4 posL = l.posL;
  vec4 dirL = l.dirL;
  vec3 ia = l.ia;
  float limit = l.limit;
  vec3 light_direction = vec3(posL + vec4(vVE,1.0)); //direccion de la luz al vertice
  vec3 L = normalize(light_direction);
  vec3 H = normalize(V+L);
  vec3 S = normalize(vec3(dirL));
  vec3 toReturn = vec3(0.0,0.0,0.0);
  float angle = acos(max(dot(S,-L),0.0));
  float inlight = smoothstep(radians(degrees(acos(limit))+10.0),acos(limit),angle);
  float titaH = max(dot(N,H),0.0);
  float titaI = max(dot(N,L),0.0);
  vec2 st = fTexCoor.st;
  vec3 color = vec3(0.0);
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
  color += fbm(st*3.0*u_time);
  toReturn= color;
  if(componente1*componente2!=0.0)
    toReturn = ia*titaI*(color*value*inlight + inlight*ks*(Fres/3.141516)* (Beckmann*GCT)/(componente1*componente2));
  else
     toReturn =ia*titaI*color *inlight*value;
  return toReturn;
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
  vec2 st = fTexCoor.st;
  vec3 color = vec3(0.0);
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
  color += fbm(st*3.0*u_time);
  toReturn= color;
  if(componente1*componente2!=0.0)
    toReturn = ia*titaI*(color*value+ks*(Fres/3.141516)* (Beckmann*GCT)/(componente1*componente2));
  else
     toReturn =ia*color*value*titaI;
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
  vec2 st = fTexCoor.st;
  vec3 color = vec3(0.0);
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
  color += fbm(st*3.0*u_time);
  toReturn= color;
  if(componente1*componente2!=0.0)
    toReturn = ia*titaI*(color*value+ks*(Fres/3.141516)* (Beckmann*GCT)/(componente1*componente2));
  else
     toReturn =ia*titaI*color*value;
  return toReturn;
}


void main()
{
    // Normalizo los vectores
    vec3 N = normalize(vNE);
    vec3 V = normalize(vVE);

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
