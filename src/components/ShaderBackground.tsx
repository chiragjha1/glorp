'use client';

import React, { useEffect, useRef } from 'react';

interface ShaderBackgroundProps {
  className?: string;
  speed?: number;
}

export const ShaderBackground: React.FC<ShaderBackgroundProps> = ({
  className = '',
  speed = 1.0,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', {
      alpha: false,
      antialias: true,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: false,
    });

    if (!gl) {
      console.warn('WebGL not supported for ShaderBackground, falling back.');
      return;
    }

    const vsSource = `
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    // High quality silk/computation fluid shader reproducing the reference image visual
    const fsSource = `
      precision highp float;
      uniform vec2 u_resolution;
      uniform float u_time;
      uniform vec2 u_mouse;

      // Hash function
      float hash(vec2 p) {
        p = fract(p * vec2(123.34, 456.21));
        p += dot(p, p + 45.32);
        return fract(p.x * p.y);
      }

      // 2D Value Noise
      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(
          mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
          mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
          u.y
        );
      }

      // Fractional Brownian Motion
      float fbm(vec2 p) {
        float v = 0.0;
        float a = 0.5;
        mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
        for (int i = 0; i < 5; i++) {
          v += a * noise(p);
          p = rot * p * 2.05 + vec2(0.12, 0.28);
          a *= 0.48;
        }
        return v;
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        float aspect = u_resolution.x / u_resolution.y;
        vec2 st = uv;
        st.x *= aspect;

        float t = u_time * 0.12;

        // Domain warping for smooth computational fluid/silk ripples
        vec2 q = vec2(
          fbm(st * 1.35 + vec2(0.0, t * 0.4)),
          fbm(st * 1.35 + vec2(5.2, 1.3 + t * 0.3))
        );

        vec2 r = vec2(
          fbm(st * 1.5 + 3.2 * q + vec2(1.7 - t * 0.2, 9.2 + t * 0.15)),
          fbm(st * 1.5 + 3.2 * q + vec2(8.3 + t * 0.25, 2.8 - t * 0.1))
        );

        float f = fbm(st * 1.25 + 4.0 * r);

        // Color palette carefully matched to the reference screenshot
        // Deep midnight black/indigo crevice
        vec3 colDarkAbyss   = vec3(0.015, 0.008, 0.035); 
        // Deep moody purple
        vec3 colMidShadow   = vec3(0.08, 0.02, 0.18);   
        // Rich royal violet
        vec3 colRoyalViolet = vec3(0.24, 0.07, 0.48);   
        // Vibrant neon purple fold highlight
        vec3 colBrightFold  = vec3(0.48, 0.16, 0.88);   
        // Electric lilac crest
        vec3 colElectricCrest = vec3(0.68, 0.32, 0.98); 

        // Blend based on fold depth
        vec3 color = mix(colDarkAbyss, colMidShadow, clamp(f * f * 3.5, 0.0, 1.0));
        color = mix(color, colRoyalViolet, clamp(length(q) * 1.1, 0.0, 1.0));
        color = mix(color, colBrightFold, clamp(pow(r.x, 2.4) * 2.2, 0.0, 1.0));
        color = mix(color, colElectricCrest, clamp(pow(f, 3.8) * 1.4, 0.0, 1.0));

        // Vignette: dark on left & center-bottom like the reference
        float vignette = uv.x * (1.0 - uv.x) * uv.y * (1.0 - uv.y) * 16.0;
        vignette = clamp(pow(vignette, 0.35), 0.0, 1.0);
        
        // Asymmetric lighting to match the screenshot fold placement
        float asymmetricShadow = smoothstep(-0.2, 0.8, uv.x - uv.y * 0.3 + 0.2);
        color *= (0.45 + 0.65 * asymmetricShadow);

        // Subtle film grain to prevent gradient banding and add tactile texture
        float grain = (hash(gl_FragCoord.xy + fract(u_time * 7.13)) - 0.5) * 0.035;
        color += vec3(grain);

        gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
      }
    `;

    // Compile helper
    const createShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compile error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertexShader = createShader(gl.VERTEX_SHADER, vsSource);
    const fragmentShader = createShader(gl.FRAGMENT_SHADER, fsSource);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    // Full screen quad buffer
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1,
    ]);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
    const timeLocation = gl.getUniformLocation(program, 'u_time');
    const mouseLocation = gl.getUniformLocation(program, 'u_mouse');

    let animationFrameId: number;
    let startTime = performance.now();
    let mouse = { x: 0.5, y: 0.5 };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX / window.innerWidth;
      mouse.y = 1.0 - e.clientY / window.innerHeight;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75); // Cap for efficiency
      const displayWidth = Math.floor(canvas.clientWidth * dpr);
      const displayHeight = Math.floor(canvas.clientHeight * dpr);

      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
        gl.viewport(0, 0, displayWidth, displayHeight);
      }
    };

    window.addEventListener('resize', resize);
    resize();

    const render = (time: number) => {
      resize();
      const elapsed = ((time - startTime) * 0.001) * speed;

      gl.useProgram(program);
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.uniform1f(timeLocation, elapsed);
      gl.uniform2f(mouseLocation, mouse.x, mouse.y);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (gl) {
        gl.deleteBuffer(positionBuffer);
        gl.deleteProgram(program);
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);
      }
    };
  }, [speed]);

  return (
    <div
      className={`fixed inset-0 pointer-events-none overflow-hidden z-0 ${className}`}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block object-cover"
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};

export default ShaderBackground;
