import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`

// Dark, soft, interactive “lab” background (inspired-by, not copied)
const fragmentShader = `
precision highp float;

varying vec2 vUv;
uniform float uTime;
uniform vec2 uMouse;
uniform vec2 uRes;
uniform float uIntensity;

// iq noise
float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = m * p;
    a *= 0.5;
  }
  return v;
}

vec3 palette(float t) {
  // deep ink → violet/blue/teal hints
  vec3 a = vec3(0.02, 0.03, 0.05);
  vec3 b = vec3(0.06, 0.07, 0.10);
  vec3 c = vec3(0.55, 0.35, 0.75);
  vec3 d = vec3(0.10, 0.35, 0.55);
  return a + b * cos(6.28318 * (c * t + d));
}

void main() {
  vec2 uv = vUv;

  // aspect-correct space
  vec2 p = (uv - 0.5) * vec2(uRes.x / uRes.y, 1.0);

  // mouse in same space
  vec2 m = (uMouse - 0.5) * vec2(uRes.x / uRes.y, 1.0);
  float md = length(p - m);

  // base flow field
  float t = uTime * 0.18;
  vec2 q = p;
  q += 0.18 * vec2(
    fbm(p * 1.4 + vec2(0.0, t)),
    fbm(p * 1.4 + vec2(t, 0.0))
  );

  float n1 = fbm(q * 1.7 + t);
  float n2 = fbm(q * 3.2 - t * 0.7);
  float field = smoothstep(0.2, 0.95, n1) * 0.55 + n2 * 0.35;

  // subtle “energy” ring around cursor
  float ring = exp(-md * 3.2) * (0.25 + 0.75 * sin(uTime * 1.2));
  ring *= 0.35;

  // vignette
  float vig = smoothstep(1.1, 0.2, length(p));

  float k = (field + ring) * uIntensity;
  vec3 col = palette(k);

  // dark base + glow
  col = mix(vec3(0.01, 0.01, 0.015), col, 0.85);
  col *= (0.85 + 0.25 * vig);

  // filmic curve-ish
  col = col / (col + vec3(0.85));

  // micro grain
  float g = noise(uv * uRes.xy * 0.35 + uTime * 0.5);
  col += (g - 0.5) * 0.035;

  gl_FragColor = vec4(col, 1.0);
}
`

function FullscreenShader({ reducedMotion }: { reducedMotion: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const { size } = useThree()
  const mouse = useRef(new THREE.Vector2(0.5, 0.5))
  const smoothMouse = useRef(new THREE.Vector2(0.5, 0.5))

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uRes: { value: new THREE.Vector2(1, 1) },
        uIntensity: { value: 1.0 },
      },
    })
  }, [])

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const w = window.innerWidth || 1
      const h = window.innerHeight || 1
      mouse.current.set(e.clientX / w, 1 - e.clientY / h)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  useFrame((state, delta) => {
    const m = material.uniforms.uMouse.value as THREE.Vector2
    const r = material.uniforms.uRes.value as THREE.Vector2

    material.uniforms.uTime.value = state.clock.getElapsedTime()
    r.set(size.width, size.height)

    // Smooth mouse so it feels “buttery”
    const lerpAmt = reducedMotion ? 0.02 : 1.0 - Math.pow(0.001, delta)
    smoothMouse.current.lerp(mouse.current, lerpAmt)
    m.copy(smoothMouse.current)

    material.uniforms.uIntensity.value = reducedMotion ? 0.65 : 1.0
  })

  return (
    <mesh ref={meshRef} material={material}>
      <planeGeometry args={[2, 2]} />
    </mesh>
  )
}

export function LusionBackground({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <div className="lusion-bg">
      <Canvas
        dpr={[1, 1.6]}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0, 1] }}
      >
        <FullscreenShader reducedMotion={reducedMotion} />
      </Canvas>
      <div className="lusion-overlay" />
      <div className="noise-overlay" />
    </div>
  )
}

