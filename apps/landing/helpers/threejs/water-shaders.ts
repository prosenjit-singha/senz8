export const WIDTH = 128;
export const BOUNDS = 6;
export const BOUNDS_HALF = BOUNDS * 0.5;

export const smoothFragmentShader = `
uniform sampler2D smoothTexture;
uniform vec2 resolution;

void main() {
  vec2 cellSize = 1.0 / resolution.xy;
  vec2 uv = gl_FragCoord.xy * cellSize;
  
  vec4 textureValue = texture2D(smoothTexture, uv);
  textureValue += texture2D(smoothTexture, uv + vec2(0.0, cellSize.y));
  textureValue += texture2D(smoothTexture, uv + vec2(0.0, -cellSize.y));
  textureValue += texture2D(smoothTexture, uv + vec2(cellSize.x, 0.0));
  textureValue += texture2D(smoothTexture, uv + vec2(-cellSize.x, 0.0));
  
  textureValue /= 5.0;
  gl_FragColor = textureValue;
}
`;

export const readWaterLevelFragmentShader = `
uniform vec2 point1;
uniform sampler2D levelTexture;
uniform vec2 resolution;

float shift_right(float v, float amt) {
  v = floor(v) + 0.5;
  return floor(v / exp2(amt));
}

float shift_left(float v, float amt) {
  return floor(v * exp2(amt) + 0.5);
}

float mask_last(float v, float bits) {
  return mod(v, shift_left(1.0, bits));
}

float extract_bits(float num, float from, float to) {
  from = floor(from + 0.5); to = floor(to + 0.5);
  return mask_last(shift_right(num, from), to - from);
}

vec4 encode_float(float val) {
  if (val == 0.0) return vec4(0, 0, 0, 0);
  float sign = val > 0.0 ? 0.0 : 1.0;
  val = abs(val);
  float exponent = floor(log2(val));
  float biased_exponent = exponent + 127.0;
  float fraction = ((val / exp2(exponent)) - 1.0) * 8388608.0;
  float t = biased_exponent / 2.0;
  float last_bit_of_biased_exponent = fract(t) * 2.0;
  float remaining_bits_of_biased_exponent = floor(t);
  float byte4 = extract_bits(fraction, 0.0, 8.0) / 255.0;
  float byte3 = extract_bits(fraction, 8.0, 16.0) / 255.0;
  float byte2 = (last_bit_of_biased_exponent * 128.0 + extract_bits(fraction, 16.0, 23.0)) / 255.0;
  float byte1 = (sign * 128.0 + remaining_bits_of_biased_exponent) / 255.0;
  return vec4(byte4, byte3, byte2, byte1);
}

void main() {
  vec2 cellSize = 1.0 / resolution.xy;
  float waterLevel = texture2D(levelTexture, point1).x;
  
  vec2 normal = vec2(
    (texture2D(levelTexture, point1 + vec2(-cellSize.x, 0)).x - texture2D(levelTexture, point1 + vec2(cellSize.x, 0)).x) * ${WIDTH.toFixed(1)} / ${BOUNDS.toFixed(1)},
    (texture2D(levelTexture, point1 + vec2(0, -cellSize.y)).x - texture2D(levelTexture, point1 + vec2(0, cellSize.y)).x) * ${WIDTH.toFixed(1)} / ${BOUNDS.toFixed(1)});
  
  if (gl_FragCoord.x < 1.5) {
    gl_FragColor = encode_float(waterLevel);
  } else if (gl_FragCoord.x < 2.5) {
    gl_FragColor = encode_float(normal.x);
  } else if (gl_FragCoord.x < 3.5) {
    gl_FragColor = encode_float(normal.y);
  } else {
    gl_FragColor = encode_float(0.0);
  }
}
`;

export const shaderChange = {
  heightmap_frag: `
  #include <common>
  uniform vec2 mousePos;
  uniform float mouseSize;
  uniform float viscosity;
  uniform float deep;
  
  void main() {
    vec2 cellSize = 1.0 / resolution.xy;
    vec2 uv = gl_FragCoord.xy * cellSize;
    
    vec4 heightmapValue = texture2D(heightmap, uv);
    
    vec4 north = texture2D(heightmap, uv + vec2(0.0, cellSize.y));
    vec4 south = texture2D(heightmap, uv + vec2(0.0, -cellSize.y));
    vec4 east = texture2D(heightmap, uv + vec2(cellSize.x, 0.0));
    vec4 west = texture2D(heightmap, uv + vec2(-cellSize.x, 0.0));
    
    float newHeight = ((north.x + south.x + east.x + west.x) * 0.5 - (heightmapValue.y)) * viscosity;
    
    float mousePhase = clamp(length((uv - vec2(0.5)) * ${BOUNDS.toFixed(1)} - vec2(mousePos.x, -mousePos.y)) * PI / mouseSize, 0.0, PI);
    newHeight -= (cos(mousePhase) + 1.0) * deep;
    
    heightmapValue.y = heightmapValue.x;
    heightmapValue.x = newHeight;
    
    gl_FragColor = heightmapValue;
  }
  `,
  common: `
  #include <common>
  uniform sampler2D heightmap;
  `,
  beginnormal_vertex: `
  vec2 cellSize = vec2(1.0 / ${WIDTH.toFixed(1)}, 1.0 / ${WIDTH.toFixed(1)});
  vec3 objectNormal = vec3(
    (texture2D(heightmap, uv + vec2(-cellSize.x, 0)).x - texture2D(heightmap, uv + vec2(cellSize.x, 0)).x) * ${WIDTH.toFixed(1)} / ${BOUNDS.toFixed(1)},
    (texture2D(heightmap, uv + vec2(0, -cellSize.y)).x - texture2D(heightmap, uv + vec2(0, cellSize.y)).x) * ${WIDTH.toFixed(1)} / ${BOUNDS.toFixed(1)},
    1.0);
  #ifdef USE_TANGENT
    vec3 objectTangent = vec3(tangent.xyz);
  #endif
  `,
  begin_vertex: `
  float heightValue = texture2D(heightmap, uv).x;
  vec3 transformed = vec3(position.x, position.y, heightValue);
  #ifdef USE_ALPHAHASH
    vPosition = vec3(position);
  #endif
  `,
};
