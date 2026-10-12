// RGB triangle, FixedFunction (FF) version.
// FF hides the shaders. Compare with triangle.vanilla.ts, which shows them.
import { ATTRIB, createFixedFunction, LIGHTING } from '../vendor/ff/ff';
import { CANVAS_SIZE, CLEAR_COLOR, COLOR_OFFSET_BYTES, STRIDE_BYTES } from '../examples/shared';

// Step 1. Get the WebGL2 context.
function getContext(canvas: HTMLCanvasElement): WebGL2RenderingContext {
  const gl = canvas.getContext('webgl2');
  if (!gl) throw new Error('WebGL2 is not available.');
  return gl;
}

// Step 2. Shaders and program: FF creates and owns them.
// Step 3. Vertex specification: copy the vertex data to the GPU.
function createVertexBuffer(gl: WebGL2RenderingContext, data: Float32Array): WebGLBuffer {
  const buffer = gl.createBuffer()!;
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  return buffer;
}

// Step 4. Describe how the vertex data is laid out, using FF's attribute slots.
function createVAO(gl: WebGL2RenderingContext, buffer: WebGLBuffer): WebGLVertexArrayObject {
  const vao = gl.createVertexArray()!;
  gl.bindVertexArray(vao);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.enableVertexAttribArray(ATTRIB.POSITION);
  gl.vertexAttribPointer(ATTRIB.POSITION, 3, gl.FLOAT, false, STRIDE_BYTES, 0);
  gl.enableVertexAttribArray(ATTRIB.COLOR);
  gl.vertexAttribPointer(ATTRIB.COLOR, 4, gl.FLOAT, false, STRIDE_BYTES, COLOR_OFFSET_BYTES);
  gl.bindVertexArray(null);
  return vao;
}

// Step 5. Pipeline state: canvas size, viewport, clear color.
function setupState(gl: WebGL2RenderingContext, canvas: HTMLCanvasElement): void {
  canvas.width = CANVAS_SIZE;
  canvas.height = CANVAS_SIZE;
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(CLEAR_COLOR[0], CLEAR_COLOR[1], CLEAR_COLOR[2], CLEAR_COLOR[3]);
}

// Step 6. Draw. ff.drawArrays binds the FF program and uploads its uniforms first.
function draw(gl: WebGL2RenderingContext, ff: ReturnType<typeof createFixedFunction>, vao: WebGLVertexArrayObject): void {
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.bindVertexArray(vao);
  ff.drawArrays(gl.TRIANGLES, 0, 18);
}

export function run(canvas: HTMLCanvasElement, customColor: [number, number, number, number] = [1, 0, 0, 1]): void {
  const gl = getContext(canvas);
  const ff = createFixedFunction(gl, { debug: true });
  ff.disable(LIGHTING);

  const dynamicHexagon = new Float32Array([
      // Triángulo 1 (Derecha)
       0.0,   0.0,   0.0,   ...customColor, // Centro
       0.7,   0.0,   0.0,   ...customColor, // Extremo derecho (Punta)
       0.35,  0.606, 0.0,   ...customColor, // Superior derecho

      // Triángulo 2 (Lado superior - Borde plano arriba)
       0.0,   0.0,   0.0,   ...customColor, // Centro
       0.35,  0.606, 0.0,   ...customColor, // Superior derecho
      -0.35,  0.606, 0.0,   ...customColor, // Superior izquierdo

      // Triángulo 3 (Izquierda)
       0.0,   0.0,   0.0,   ...customColor, // Centro
      -0.35,  0.606, 0.0,   ...customColor, // Superior izquierdo
      -0.7,   0.0,   0.0,   ...customColor, // Extremo izquierdo (Punta)

      // Triángulo 4 (Izquierda inferior)
       0.0,   0.0,   0.0,   ...customColor, // Centro
      -0.7,   0.0,   0.0,   ...customColor, // Extremo izquierdo (Punta)
      -0.35, -0.606, 0.0,   ...customColor, // Inferior izquierdo

      // Triángulo 5 (Lado inferior - Borde plano abajo)
       0.0,   0.0,   0.0,   ...customColor, // Centro
      -0.35, -0.606, 0.0,   ...customColor, // Inferior izquierdo
       0.35, -0.606, 0.0,   ...customColor, // Inferior derecho

      // Triángulo 6 (Derecha inferior)
       0.0,   0.0,   0.0,   ...customColor, // Centro
       0.35, -0.606, 0.0,   ...customColor, // Inferior derecho
       0.7,   0.0,   0.0,   ...customColor, // Extremo derecho (Punta)
    ]);

  const buffer = createVertexBuffer(gl, dynamicHexagon);
  const vao = createVAO(gl, buffer);
  setupState(gl, canvas);
  draw(gl, ff, vao);
}