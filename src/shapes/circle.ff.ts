import { ATTRIB, createFixedFunction, LIGHTING } from '../vendor/ff/ff';
import { CANVAS_SIZE, CLEAR_COLOR } from '../examples/shared';

const SEGMENTS = 64; 

function getContext(canvas: HTMLCanvasElement): WebGL2RenderingContext {
  const gl = canvas.getContext('webgl2');
  if (!gl) throw new Error('WebGL2 is not available.');
  return gl;
}

function createVertexBuffer(gl: WebGL2RenderingContext, data: Float32Array): WebGLBuffer {
  const buffer = gl.createBuffer()!;
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  return buffer;
}

function createVAO(gl: WebGL2RenderingContext, buffer: WebGLBuffer): WebGLVertexArrayObject {
  const vao = gl.createVertexArray()!;
  gl.bindVertexArray(vao);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.enableVertexAttribArray(ATTRIB.POSITION);
  gl.vertexAttribPointer(ATTRIB.POSITION, 3, gl.FLOAT, false, 0, 0); 
  gl.bindVertexArray(null);
  return vao;
}

function setupState(gl: WebGL2RenderingContext, canvas: HTMLCanvasElement): void {
  canvas.width = CANVAS_SIZE;
  canvas.height = CANVAS_SIZE;
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(CLEAR_COLOR[0], CLEAR_COLOR[1], CLEAR_COLOR[2], CLEAR_COLOR[3]);
}

function draw(gl: WebGL2RenderingContext, ff: ReturnType<typeof createFixedFunction>, vao: WebGLVertexArrayObject, color: [number, number, number, number]): void {
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.bindVertexArray(vao);
  ff.setColor(color);
  ff.drawArrays(gl.TRIANGLE_FAN, 0, SEGMENTS + 2);
}

export function run(canvas: HTMLCanvasElement, customColor: [number, number, number, number] = [1, 0, 0, 1]): void {
  const gl = getContext(canvas);
  const ff = createFixedFunction(gl, { debug: true });
  ff.disable(LIGHTING);

  // armamos los puntos del circulo
  const puntos = [];
  puntos.push(0.0, 0.0, 0.0); // centro

  const radius = 0.7;
  for (let i = 0; i <= SEGMENTS; i++) {
    const angle = (i * 2 * Math.PI) / SEGMENTS;
    puntos.push(radius * Math.cos(angle), radius * Math.sin(angle), 0.0);
  }

  const dynamicCircle = new Float32Array(puntos);
  const buffer = createVertexBuffer(gl, dynamicCircle);
  const vao = createVAO(gl, buffer);
  
  setupState(gl, canvas);
  draw(gl, ff, vao, customColor);
}