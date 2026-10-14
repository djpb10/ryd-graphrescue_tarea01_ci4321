import { ATTRIB, createFixedFunction, LIGHTING } from '../vendor/ff/ff';
import { CANVAS_SIZE, CLEAR_COLOR } from '../examples/shared';

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

// buffer para los indices
function createIndexBuffer(gl: WebGL2RenderingContext, data: Uint16Array): WebGLBuffer {
  const buffer = gl.createBuffer()!;
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW);
  return buffer;
}

function createVAO(gl: WebGL2RenderingContext, vBuffer: WebGLBuffer, iBuffer: WebGLBuffer): WebGLVertexArrayObject {
  const vao = gl.createVertexArray()!;
  gl.bindVertexArray(vao);
  
  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
  gl.enableVertexAttribArray(ATTRIB.POSITION);
  gl.vertexAttribPointer(ATTRIB.POSITION, 3, gl.FLOAT, false, 0, 0); 
  
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer); 
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
  ff.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0); 
}

export function run(canvas: HTMLCanvasElement, customColor: [number, number, number, number] = [1, 0, 0, 1]): void {
  const gl = getContext(canvas);
  const ff = createFixedFunction(gl, { debug: true });
  ff.disable(LIGHTING);

  // los 4 puntos
  const vertices = new Float32Array([
    -0.5,  0.5, 0.0, // izq arriba
    -0.5, -0.5, 0.0, // izq abajo
     0.5, -0.5, 0.0, // der abajo
     0.5,  0.5, 0.0, // der arriba
  ]);

  const indices = new Uint16Array([
    0, 1, 2, 
    0, 2, 3  
  ]);

  const vBuffer = createVertexBuffer(gl, vertices);
  const iBuffer = createIndexBuffer(gl, indices);
  const vao = createVAO(gl, vBuffer, iBuffer);
  
  setupState(gl, canvas);
  draw(gl, ff, vao, customColor);
}