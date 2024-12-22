import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as stylex from '@stylexjs/stylex';
import { ClientOnly, Delay } from '@suspensive/react';
import { motion } from 'motion/react';
import { useRouter } from 'nextra/hooks';
import { Link } from 'nextra-theme-docs';
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  vec2 hash(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
  }

  float noise(vec2 p) {
    const float K1 = 0.366025404; // (sqrt(3)-1)/2
    const float K2 = 0.211324865; // (3-sqrt(3))/6
    vec2 i = floor(p + (p.x + p.y) * K1);
    vec2 a = p - i + (i.x + i.y) * K2;
    vec2 o = (a.x > a.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec2 b = a - o + K2;
    vec2 c = a - 1.0 + 2.0 * K2;
    vec3 h = max(0.5 - vec3(dot(a, a), dot(b, b), dot(c, c)), 0.0);
    vec3 n = h * h * h * h * vec3(dot(a, hash(i)), dot(b, hash(i + o)), dot(c, hash(i + 1.0)));
    return dot(n, vec3(70.0));
  }

  uniform float time;
  varying vec2 vUv;

  void main() {
    vec2 pos = vUv - 0.5;
    float len = length(pos);
    float angle = atan(pos.y, pos.x);
    float radius = len;
    angle += time * 2.0;
    pos = vec2(cos(angle), sin(angle)) * radius;

    float n = noise(pos * 5.0 + time * 0.5);
    n += 0.5 * noise(pos * 10.0 + time * 1.0);
    n += 0.25 * noise(pos * 20.0 + time * 2.0);

    vec3 color = mix(vec3(0.0, 0.0, 1.0), vec3(1.0, 0.0, 1.0), n);
    color = mix(color, vec3(1.0, 1.0, 1.0), len);

    float alpha = 1.0 - smoothstep(0.3, 0.5, len);

    gl_FragColor = vec4(color, alpha);
  }
`;

const BurningCircle = () => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const [outerRadius, setOuterRadius] = useState(3.4); // 초기 외부 반지름 설정

  useFrame(({ clock }) => {
    if (materialRef.current) {
      const elapsedTime = clock.getElapsedTime();
      materialRef.current.uniforms.time.value = elapsedTime;
      // 외부 반지름을 시간에 따라 증가
      setOuterRadius((prev) => prev + elapsedTime * 0.001);
    }
  });

  return (
    <mesh>
      <ringGeometry args={[1.65, outerRadius, 1000]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          time: { value: 0 },
        }}
        transparent
      />
    </mesh>
  );
};

const MixedControlledCamera: React.FC = () => {
  const { camera } = useThree();

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    // Math.sin으로 부드럽게 반복하는 값을 생성 (-1 ~ 1)
    const oscillation = Math.sin(Number(elapsedTime) * 2);
    camera.position.z = THREE.MathUtils.lerp(3, 3.2, (oscillation + 1) / 2);
  });

  const handleMouseMove = (event: MouseEvent) => {
    const { innerWidth, innerHeight } = window;
    const x = (event.clientX / innerWidth - 0.5) * 2; // -1 ~ 1
    const y = -(event.clientY / innerHeight - 0.5) * 2; // -1 ~ 1

    camera.rotation.y = x * 0.1; // 마우스 좌우 회전
    camera.rotation.x = y * 0.1; // 마우스 상하 회전
    camera.position.z = 3;
  };

  const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
    const { beta, gamma } = event; // 자이로스코프 값
    if (beta !== null && gamma !== null) {
      camera.rotation.x += THREE.MathUtils.degToRad((beta - 45) * 0.0005); // 자이로스코프 상하
      camera.rotation.y += THREE.MathUtils.degToRad(gamma * 0.0005); // 자이로스코프 좌우
      camera.position.z = 3;
    }
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('deviceorientation', handleDeviceOrientation);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('deviceorientation', handleDeviceOrientation);
    };
  }, []);

  return null;
};

type MainProps = {
  title: string;
  description: string;
  navButtonText: string;
  items: Array<{ title: string; description: string }>;
};

export function Main({ navButtonText, items }: MainProps) {
  const router = useRouter();

  return (
    <section {...stylex.props(styles.root)}>
      <div style={{ position: 'relative', height: '60vh' }}>
        <motion.div initial={{ opacity: 1 }} animate={{ opacity: 0, transition: { duration: 2, delay: 12 } }}>
          <Canvas
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              filter: 'blur(10px) saturate(0.8)',
              pointerEvents: 'none',
            }}
            camera={{ position: [0, 0, 3], fov: 75 }}
          >
            <MixedControlledCamera />
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <BurningCircle />
          </Canvas>
        </motion.div>
        <Canvas
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none' }}
          camera={{ position: [0, 0, 3], fov: 75 }}
        >
          <MixedControlledCamera />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <LineCircle />
        </Canvas>
        <StarCanvasFar />
        <ClientOnly>
          <StarCanvasClose />
        </ClientOnly>
        <motion.div
          layout
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            height: '100%',
          }}
        >
          <Delay
            ms={6000}
            fallback={
              <motion.span
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 5 } }}
                {...stylex.props(styles.title1)}
              >
                <div>Declarative</div>
                <div>Overlay</div>
                <div>Pattern</div>
              </motion.span>
            }
          >
            <motion.span
              layout
              animate={{ transition: { duration: 10, ease: 'linear' } }}
              {...stylex.props(styles.title2)}
            >
              overlay-kit
            </motion.span>
            <motion.span
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { ease: 'linear', delay: 0.4 } }}
              style={{ fontSize: 20, opacity: 0.8, marginBottom: 16 }}
            >
              npm install overlay-kit
            </motion.span>
            <motion.nav
              layout
              initial={{ display: 'hidden', opacity: 0 }}
              animate={{ display: 'block', opacity: 1, transition: { delay: 1.2 } }}
              style={{ marginTop: 16 }}
              whileHover={{ scale: 1.2 }}
            >
              <Link
                href={`/${router.locale}/docs/guides/introduction`}
                {...stylex.props(styles.navigation)}
                style={{ color: 'white', textDecoration: 'none' }}
              >
                {navButtonText}
              </Link>
            </motion.nav>
          </Delay>
        </motion.div>
      </div>

      <section {...stylex.props(styles.cardRoot)}>
        {items.map(({ title, description }) => (
          <article {...stylex.props(styles.card)} key={title}>
            <div {...stylex.props(styles.cardTitle)}>{title}</div>
            <p
              {...stylex.props(styles.cardDescription)}
              dangerouslySetInnerHTML={{ __html: formatCodeBlocks(description) }}
            ></p>
          </article>
        ))}
      </section>
    </section>
  );
}

const styles = stylex.create({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  title1: {
    display: 'flex',
    flexDirection: {
      default: 'row',
      '@media (max-width: 800px)': 'column',
    },
    lineHeight: 1,
    gap: {
      default: 12,
      '@media (max-width: 800px)': 4,
    },
    textAlign: 'center',
    fontSize: {
      default: 80,
      '@media (max-width: 800px)': 60,
    },
    fontWeight: 700,
    zIndex: 10,
  },
  title2: {
    fontSize: {
      default: 60,
      '@media (max-width: 800px)': 40,
    },
    fontWeight: 700,
  },
  navigation: {
    padding: '12px 28px',
    borderRadius: 8,
    backgroundColor: 'rgb(0, 162, 255)',
    fontSize: 16,
    fontWeight: 700,
    textDecoration: 'none',
  },
  cardRoot: {
    flexDirection: {
      default: 'row',
      '@media (max-width: 800px)': 'column',
    },
    maxWidth: 1440,
    padding: '66px 16px',
    display: 'flex',
    margin: 'auto',
    gap: 32,
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    flex: 1,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 700,
  },
  cardDescription: {
    fontSize: 16,
    fontWeight: 500,
    whiteSpace: 'pre-line',
  },
});

const CodeBlockClassName = 'nextra-code';

const escapeHtml = (text: string) => text.replace(/</g, '&lt;').replace(/>/g, '&gt;');

const backtickToCodeBlock = (text: string) =>
  text.replace(/`([^`]+)`/g, `<code class="${CodeBlockClassName}">$1</code>`);

const formatCodeBlocks = (desc: string) => backtickToCodeBlock(escapeHtml(desc));

const LineCircle: React.FC = () => {
  // 각 선분의 시작점과 끝점을 계산
  const vertices = React.useMemo<THREE.TypedArray>(() => {
    const lineCount = 60000; // 선분의 개수
    const radius = 2; // 원의 반지름
    const positions = [];
    for (let i = 0; i < lineCount; i++) {
      const angle = (i / lineCount) * Math.PI * 2; // 현재 각도
      const nextAngle = ((i + 1) / lineCount) * Math.PI * 2; // 다음 각도

      // 선분의 시작점
      const x1 = Math.cos(angle) * (radius + 0.2 * Math.random());
      const y1 = Math.sin(angle) * (radius + 0.2 * Math.random());

      // 선분의 끝점 (살짝 안쪽으로 이동)
      const x2 = Math.cos(nextAngle) * (radius - 0.3 * Math.random());
      const y2 = Math.sin(nextAngle) * (radius - 0.3 * Math.random());

      positions.push(x1, y1, Math.random() * 0.8); // 시작점
      positions.push(x2, y2, Math.random() * 0.8); // 끝점
    }
    return new Float32Array(positions);
  }, []);

  return (
    <lineSegments>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={vertices.length / 3} array={vertices} itemSize={3} />
      </bufferGeometry>
      <lineBasicMaterial color="#c2c2c2" />
    </lineSegments>
  );
};

interface Vertex {
  pos: number[];
  velocity: number[];
  distance: number;
  size: number;
  backgroundColor: { r: number; g: number; b: number };
}

const TILE = 16;
const OFFSET_FACTOR = 0.75;
const RANDOM_Z_FACTOR = 2;
const VELOCITY_CONSTANT = 8;
const RANDOM_DISTANCE_MAX = 900;
const RANDOM_SIZE_FACTOR = 2;

const StarCanvasFar = () => {
  const animationFrameIdRef = useRef<number | null>(null);
  const resizeAnimationFrameIdRef = useRef(0);
  const onRenderRef = useRef<VoidFunction | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parentElement = canvas?.parentElement;
    const ctx = canvas?.getContext('2d');
    const vertexMap: Record<string, Vertex> = {};
    const startTime = Date.now();

    function getVertex(sx: number, sy: number): Vertex {
      const id = `${sx}x${sy}`;

      if (!vertexMap[id]) {
        const x = TILE * sx + TILE * 1.5 * Math.random() - TILE * OFFSET_FACTOR;
        const y = TILE * sy + TILE * 1.5 * Math.random() - TILE * OFFSET_FACTOR;
        const z = Math.random() * RANDOM_Z_FACTOR;
        const vx = 1 + Math.random() * VELOCITY_CONSTANT;
        const vy = 1 + Math.random() * VELOCITY_CONSTANT;
        const distance = 10 + Math.random() * RANDOM_DISTANCE_MAX;
        const size = 0.1 + Math.random() * RANDOM_SIZE_FACTOR;

        vertexMap[id] = {
          pos: [x, y, z],
          velocity: [vx, vy],
          size,
          distance,
          backgroundColor: { r: Math.random() * 255, g: Math.random() * 255, b: Math.random() * 255 },
        };
      }
      return vertexMap[id];
    }

    onRenderRef.current = () => {
      const width = canvas?.width ?? 0;
      const height = canvas?.height ?? 0;
      const distTime = Date.now() - startTime;

      ctx?.clearRect(0, 0, width, height);

      const maxSX = Math.ceil(width / TILE);
      const maxSY = Math.ceil(height / TILE);

      for (let sx = 0; sx <= maxSX; ++sx) {
        for (let sy = 0; sy <= maxSY; ++sy) {
          const { velocity, distance, pos, size, backgroundColor } = getVertex(sx, sy);
          const scalar = Math.sqrt(velocity[0] * velocity[0] + velocity[1] * velocity[1]);
          const totalDistance = (distTime * scalar) / 1000;
          const isReverse = Math.floor(totalDistance / distance) % 2 !== 0;
          let nextDistance = totalDistance % distance;

          if (isReverse) {
            nextDistance = distance - nextDistance;
          }
          const x = pos[0] + (nextDistance / scalar) * velocity[0];
          const y = pos[1] + (nextDistance / scalar) * velocity[1];
          const a = 1 - pos[2];

          ctx?.beginPath();
          ctx!.fillStyle = `rgba(${backgroundColor.r}, ${backgroundColor.g}, ${backgroundColor.b}, ${a})`;
          ctx?.arc(x, y, size, 0, 2 * Math.PI);
          ctx?.fill();
        }
      }
    };
    const observer = new ResizeObserver(() => {
      const inlineSize = parentElement?.offsetWidth ?? 0;
      const blockSize = parentElement?.offsetHeight ?? 0;

      cancelAnimationFrame(resizeAnimationFrameIdRef.current);
      resizeAnimationFrameIdRef.current = requestAnimationFrame(() => {
        if (canvas) {
          canvas.width = inlineSize;
          canvas.height = blockSize;
          canvas.style.cssText += `width: ${inlineSize}px; height: ${blockSize}px;`;
          onRenderRef.current?.();
        }
      });
    });
    parentElement && observer.observe(parentElement);

    return () => {
      cancelAnimationFrame(resizeAnimationFrameIdRef.current);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const requestAnimation = () => {
      onRenderRef.current?.();
      animationFrameIdRef.current = requestAnimationFrame(requestAnimation);
    };

    if (animationFrameIdRef.current === null) {
      animationFrameIdRef.current = requestAnimationFrame(requestAnimation);
    }

    return () => {
      if (animationFrameIdRef.current !== null) {
        cancelAnimationFrame(animationFrameIdRef.current);
        animationFrameIdRef.current = null;
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        zIndex: -10,
        filter: 'saturate(0.4)',
      }}
    />
  );
};

const TILE_CLOSE = 400;

const StarCanvasClose = () => {
  const animationFrameIdRef = useRef<number | null>(null);
  const resizeAnimationFrameIdRef = useRef(0);
  const onRenderRef = useRef<VoidFunction | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parentElement = canvas?.parentElement;
    const ctx = canvas?.getContext('2d');
    const vertexMap: Record<string, Vertex> = {};
    const startTime = Date.now();

    function getVertex(sx: number, sy: number): Vertex {
      const id = `${sx}x${sy}`;

      if (!vertexMap[id]) {
        const x = TILE_CLOSE * sx + TILE_CLOSE * 1.5 * Math.random() - TILE_CLOSE * 0.75;
        const y = TILE_CLOSE * sy + TILE_CLOSE * 1.5 * Math.random() - TILE_CLOSE * 0.75;
        const z = Number(Math.random());
        const vx = 1 + Math.random() * 200;
        const vy = 1 + Math.random() * 200;
        const distance = 1000 + Math.random() * 1000;
        const size = 100 + Math.random() * 100;

        vertexMap[id] = {
          pos: [x, y, z],
          velocity: [vx, vy],
          size,
          distance,
          backgroundColor: Math.random() > 0.3 ? { r: 255, g: 0, b: 255 } : { r: 0, g: 0, b: 255 },
        };
      }
      return vertexMap[id];
    }

    onRenderRef.current = () => {
      const width = canvas?.width ?? 0;
      const height = canvas?.height ?? 0;
      const distTime = Date.now() - startTime;

      ctx?.clearRect(0, 0, width, height);

      const maxSX = Math.ceil(width / TILE_CLOSE);
      const maxSY = Math.ceil(height / TILE_CLOSE);

      for (let sx = 0; sx <= maxSX; ++sx) {
        for (let sy = 0; sy <= maxSY; ++sy) {
          const { velocity, distance, pos, size, backgroundColor } = getVertex(sx, sy);
          const scalar = Math.sqrt(velocity[0] * velocity[0] + velocity[1] * velocity[1]);
          const totalDistance = (distTime * scalar) / 1000;
          const isReverse = Math.floor(totalDistance / distance) % 2 !== 0;
          let nextDistance = totalDistance % distance;

          if (isReverse) {
            nextDistance = distance - nextDistance;
          }
          const x = pos[0] + (nextDistance / scalar) * velocity[0];
          const y = pos[1] + (nextDistance / scalar) * velocity[1];
          const a = 1 - pos[2];

          ctx?.beginPath();
          ctx!.fillStyle = `rgba(${backgroundColor.r}, ${backgroundColor.g}, ${backgroundColor.b}, ${a})`;
          ctx?.arc(x, y, size, 0, 2 * Math.PI);
          ctx?.fill();
        }
      }
    };
    const observer = new ResizeObserver(() => {
      const inlineSize = parentElement?.offsetWidth ?? 0;
      const blockSize = parentElement?.offsetHeight ?? 0;

      cancelAnimationFrame(resizeAnimationFrameIdRef.current);
      resizeAnimationFrameIdRef.current = requestAnimationFrame(() => {
        if (canvas) {
          canvas.width = inlineSize;
          canvas.height = blockSize;
          canvas.style.cssText += `width: ${inlineSize}px; height: ${blockSize}px; filter: blur(100px); opacity: 0.15;`;
          onRenderRef.current?.();
        }
      });
    });
    parentElement && observer.observe(parentElement);

    return () => {
      cancelAnimationFrame(resizeAnimationFrameIdRef.current);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const requestAnimation = () => {
      onRenderRef.current?.();
      animationFrameIdRef.current = requestAnimationFrame(requestAnimation);
    };

    if (animationFrameIdRef.current === null) {
      animationFrameIdRef.current = requestAnimationFrame(requestAnimation);
    }

    return () => {
      if (animationFrameIdRef.current !== null) {
        cancelAnimationFrame(animationFrameIdRef.current);
        animationFrameIdRef.current = null;
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        zIndex: -10,
        opacity: 0,
        transitionProperty: 'opacity',
        transitionDuration: '100ms',
      }}
    />
  );
};
