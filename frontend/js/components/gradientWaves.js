/**
 * PurifyOps - GradientWaves Background Renderer
 * High-Performance Raymarched WebGL2 Gradient Wave Field
 */

const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return [1, 1, 1];
  return [parseInt(result[1], 16) / 255, parseInt(result[2], 16) / 255, parseInt(result[3], 16) / 255];
};

const vertexShaderSource = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragmentShaderSource = `#version 300 es
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform float uSpeed;
uniform float uAmplitude;
uniform float uWaveScale;
uniform float uWaveRatio;
uniform float uSwell;
uniform float uTurbulence;
uniform float uTilt;
uniform float uZoom;
uniform float uHeight;
uniform float uFogDepth;
uniform float uSteps;
uniform float uBrightness;
uniform float uOpacity;
uniform float uGrain;
uniform float uGrainIntensity;
uniform vec2 uMouse;
uniform float uParallax;
uniform bool uEnableMouse;
uniform vec3 uHorizonColor;
uniform vec3 uWaveColor;
uniform vec3 uCrestColor;
out vec4 fragColor;

const float MAX_DIST = 20000.0;

float hash21(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float plasma(vec3 r, vec2 freq, vec4 tc) {
  float mx = r.x + tc.x;
  mx += uSwell * sin((r.y + mx) / 20.0 + tc.y);
  float my = r.y - tc.z;
  my += uTurbulence * cos(r.x / 23.0 + tc.w);
  return r.z - (sin(mx * freq.x) * uAmplitude + sin(my * freq.y) * uAmplitude + uHeight);
}

float raymarch(vec3 pos, vec3 dir, vec2 freq, vec4 tc) {
  float dist = 0.0;
  for (int i = 0; i < 128; i++) {
    if (float(i) >= uSteps) break;
    float dscene = plasma(pos + dist * dir, freq, tc);
    if (abs(dscene) < 0.1) break;
    dist += 0.9 * dscene;
    if (!(abs(dist) < MAX_DIST)) return MAX_DIST;
  }
  return dist;
}

void main() {
  float T = iTime * uSpeed;
  vec2 freq = vec2(uWaveScale / 7.0, (uWaveScale * uWaveRatio) / 3.0);
  vec4 tc = vec4(T / 0.130, T / 0.810, T / 0.200, T / 0.710);
  float c, s;
  float vfov = (3.14159 / 2.3) / max(uZoom, 0.05);
  vec3 cam = vec3(0.0, 0.0, 30.0);
  vec2 uv = (gl_FragCoord.xy / iResolution.xy) - 0.5;
  uv.x *= iResolution.x / iResolution.y;
  uv.y *= -1.0;

  vec3 dir = vec3(0.0, 0.0, -1.0);
  float ulen = length(uv);
  float xrot = vfov * ulen;
  c = cos(xrot); s = sin(xrot);
  dir = mat3(1.0, 0.0, 0.0, 0.0, c, -s, 0.0, s, c) * dir;
  vec2 nuv = ulen > 1e-5 ? uv / ulen : vec2(1.0, 0.0);
  c = nuv.x; s = nuv.y;
  dir = mat3(c, -s, 0.0, s, c, 0.0, 0.0, 0.0, 1.0) * dir;
  c = cos(uTilt); s = sin(uTilt);
  dir = mat3(c, 0.0, s, 0.0, 1.0, 0.0, -s, 0.0, c) * dir;

  if (uEnableMouse) {
    float yaw = (uMouse.x - 0.5) * uParallax * 0.4;
    float pitch = (uMouse.y - 0.5) * uParallax * 0.4;
    c = cos(yaw); s = sin(yaw);
    dir = mat3(c, 0.0, s, 0.0, 1.0, 0.0, -s, 0.0, c) * dir;
    c = cos(pitch); s = sin(pitch);
    dir = mat3(1.0, 0.0, 0.0, 0.0, c, -s, 0.0, s, c) * dir;
  }

  float dist = raymarch(cam, dir, freq, tc);
  vec3 pos = cam + dist * dir;

  float t = clamp(uFogDepth / max(dist, 0.001), 0.0, 1.0);
  vec3 body = mix(uWaveColor, uCrestColor, clamp(pos.z * 0.08 + 0.5, 0.0, 1.0));
  vec3 col = mix(uHorizonColor, body, t);
  col *= uBrightness;
  col = clamp(col, 0.0, 1.0);

  float alpha = clamp(t, 0.0, 1.0) * uOpacity;
  if (uGrain > 0.5) {
    float g = hash21(gl_FragCoord.xy + mod(iTime, 64.0) * 11.0);
    alpha += (g - 0.5) * uGrainIntensity;
  }
  alpha = clamp(alpha, 0.0, 1.0);
  fragColor = vec4(col * alpha, alpha);
}
`;

export function initGradientWaves(canvasId = "gradient-waves-canvas", options = {}) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const config = {
    horizonColor: "#0b0c10",
    waveColor: "#4338ca",
    crestColor: "#818cf8",
    speed: 0.35,
    amplitude: 2.5,
    waveScale: 0.6,
    waveRatio: 0.9,
    swell: 35,
    turbulence: 20,
    tilt: 1.11,
    zoom: 1.0,
    height: 5.5,
    fogDepth: 16,
    steps: 60.0,
    brightness: 1.05,
    opacity: 0.65,
    grain: true,
    grainIntensity: 0.04,
    parallaxStrength: 0.4,
    mouseInteraction: true,
    ...options
  };

  let gl;
  try {
    gl = canvas.getContext("webgl2", { alpha: true, antialias: false, powerPreference: "low-power" });
  } catch (e) {
    console.warn("[GradientWaves] WebGL2 not supported:", e);
    return;
  }
  if (!gl) return;

  const compileShader = (src, type) => {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.warn("[GradientWaves] Shader compile error:", gl.getShaderInfoLog(s));
      gl.deleteShader(s);
      return null;
    }
    return s;
  };

  const vert = compileShader(vertexShaderSource, gl.VERTEX_SHADER);
  const frag = compileShader(fragmentShaderSource, gl.FRAGMENT_SHADER);
  if (!vert || !frag) return;

  const prog = gl.createProgram();
  gl.attachShader(prog, vert);
  gl.attachShader(prog, frag);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.warn("[GradientWaves] Program link error:", gl.getProgramInfoLog(prog));
    return;
  }

  gl.useProgram(prog);

  // Buffer quad
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);

  const posAttr = gl.getAttribLocation(prog, "position");
  gl.enableVertexAttribArray(posAttr);
  gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 0, 0);

  // Uniform locations
  const u = {
    iTime: gl.getUniformLocation(prog, "iTime"),
    iResolution: gl.getUniformLocation(prog, "iResolution"),
    uSpeed: gl.getUniformLocation(prog, "uSpeed"),
    uAmplitude: gl.getUniformLocation(prog, "uAmplitude"),
    uWaveScale: gl.getUniformLocation(prog, "uWaveScale"),
    uWaveRatio: gl.getUniformLocation(prog, "uWaveRatio"),
    uSwell: gl.getUniformLocation(prog, "uSwell"),
    uTurbulence: gl.getUniformLocation(prog, "uTurbulence"),
    uTilt: gl.getUniformLocation(prog, "uTilt"),
    uZoom: gl.getUniformLocation(prog, "uZoom"),
    uHeight: gl.getUniformLocation(prog, "uHeight"),
    uFogDepth: gl.getUniformLocation(prog, "uFogDepth"),
    uSteps: gl.getUniformLocation(prog, "uSteps"),
    uBrightness: gl.getUniformLocation(prog, "uBrightness"),
    uOpacity: gl.getUniformLocation(prog, "uOpacity"),
    uGrain: gl.getUniformLocation(prog, "uGrain"),
    uGrainIntensity: gl.getUniformLocation(prog, "uGrainIntensity"),
    uMouse: gl.getUniformLocation(prog, "uMouse"),
    uParallax: gl.getUniformLocation(prog, "uParallax"),
    uEnableMouse: gl.getUniformLocation(prog, "uEnableMouse"),
    uHorizonColor: gl.getUniformLocation(prog, "uHorizonColor"),
    uWaveColor: gl.getUniformLocation(prog, "uWaveColor"),
    uCrestColor: gl.getUniformLocation(prog, "uCrestColor")
  };

  // Set constant static uniforms
  gl.uniform1f(u.uSpeed, config.speed);
  gl.uniform1f(u.uAmplitude, config.amplitude);
  gl.uniform1f(u.uWaveScale, config.waveScale);
  gl.uniform1f(u.uWaveRatio, config.waveRatio);
  gl.uniform1f(u.uSwell, config.swell);
  gl.uniform1f(u.uTurbulence, config.turbulence);
  gl.uniform1f(u.uTilt, config.tilt);
  gl.uniform1f(u.uZoom, config.zoom);
  gl.uniform1f(u.uHeight, config.height);
  gl.uniform1f(u.uFogDepth, config.fogDepth);
  gl.uniform1f(u.uSteps, config.steps);
  gl.uniform1f(u.uBrightness, config.brightness);
  gl.uniform1f(u.uOpacity, config.opacity);
  gl.uniform1f(u.uGrain, config.grain ? 1.0 : 0.0);
  gl.uniform1f(u.uGrainIntensity, config.grainIntensity);
  gl.uniform1f(u.uParallax, config.parallaxStrength);
  gl.uniform1i(u.uEnableMouse, config.mouseInteraction ? 1 : 0);

  const hc = hexToRgb(config.horizonColor);
  const wc = hexToRgb(config.waveColor);
  const cc = hexToRgb(config.crestColor);
  gl.uniform3f(u.uHorizonColor, hc[0], hc[1], hc[2]);
  gl.uniform3f(u.uWaveColor, wc[0], wc[1], wc[2]);
  gl.uniform3f(u.uCrestColor, cc[0], cc[1], cc[2]);

  // Resize handler
  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const w = Math.floor(window.innerWidth * dpr);
    const h = Math.floor(window.innerHeight * dpr);
    canvas.width = w;
    canvas.height = h;
    gl.viewport(0, 0, w, h);
    gl.uniform2f(u.iResolution, w, h);
  };
  window.addEventListener("resize", resize);
  resize();

  // Mouse interaction
  const targetMouse = [0.5, 0.5];
  const currentMouse = [0.5, 0.5];
  window.addEventListener("pointermove", (e) => {
    targetMouse[0] = e.clientX / window.innerWidth;
    targetMouse[1] = 1.0 - (e.clientY / window.innerHeight);
  });

  // Render loop
  let rafId = 0;
  let isVisible = true;
  const t0 = performance.now();

  const render = (time) => {
    if (!isVisible) return;
    const elapsed = (time - t0) * 0.001;
    gl.uniform1f(u.iTime, elapsed);

    // Smooth mouse lerp
    currentMouse[0] += 0.05 * (targetMouse[0] - currentMouse[0]);
    currentMouse[1] += 0.05 * (targetMouse[1] - currentMouse[1]);
    gl.uniform2f(u.uMouse, currentMouse[0], currentMouse[1]);

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    rafId = requestAnimationFrame(render);
  };

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      isVisible = false;
      cancelAnimationFrame(rafId);
    } else {
      isVisible = true;
      rafId = requestAnimationFrame(render);
    }
  });

  rafId = requestAnimationFrame(render);
}
