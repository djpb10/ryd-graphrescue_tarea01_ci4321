// Page scaffolding only: toggle, canvas swap and source panel.
import './style.css';

// rutas de archivos
import { run as runTriangle } from './shapes/triangle.ff';
import { run as runQuad } from './shapes/quad.ff';
import { run as runHexagon} from './shapes/hexagon.ff';
import { run as runCircle} from './shapes/circle.ff';


// new applied by us
const shapes: string[] = ["triangle", "quad", "hexagon", "circle"];
const colors: string[] = ["red", "verde", "azul"];
let shape_i = 0;
let color_i = 0;


// Diccionario para traducir los nombres de colores de tu arreglo a valores RGBA (de 0.0 a 1.0)
const colorMap: Record<string, [number, number, number, number]> = {
  red:   [1.0, 0.0, 0.0, 1.0],
  verde: [0.0, 1.0, 0.0, 1.0],
  azul:  [0.0, 0.0, 1.0, 1.0],
  rojo:  [1.0, 0.0, 0.0, 1.0],
};

//

type Mode = 'shape' | 'color';
type ModeFig = 'triangle' | 'quad' | 'hexagon' | 'circle' ;

const figures: Record<ModeFig, { file: string; run: (canvas: HTMLCanvasElement, customColor?: [number, number, number, number]) => void }> = {
  triangle: { file: 'triangle.ff.ts', run: runTriangle },
  quad: { file: 'quad.ff.ts',  run: runQuad },
  hexagon: { file: 'hexagon.ff.ts', run: runHexagon},
  circle: { file: 'circle.ff.ts', run: runCircle},
};

const stage = document.getElementById('stage')!;

const buttons: Record<Mode, HTMLElement> = {
  shape: document.getElementById('btn-shape')!,
  color: document.getElementById('btn-color')!,
};

// set the style of pressed over the buttens always
// then change it better
buttons.shape.setAttribute('aria-pressed', 'true');
buttons.color.setAttribute('aria-pressed', 'true');

let currentMode: ModeFig = 'triangle';
let currentColor: [number, number, number, number] = colorMap[colors[0]] || [1.0, 0.0, 0.0, 1.0];

function show(mode: ModeFig = currentMode, customColor: [number, number, number, number] = currentColor): void {
  currentMode = mode;
  currentColor = customColor;
  const canvas = document.createElement('canvas');
  stage.replaceChildren(canvas);
  
  figures[mode].run(canvas, customColor);

  history.replaceState(null, '', `#${mode}`);
}

// change file with an event over the button
buttons.shape.addEventListener('click', () => 
  {

    shape_i ++;
    if (shape_i >= shapes.length){
      shape_i = 0;
    }

    show(shapes[shape_i], currentColor);
    buttons.shape.textContent = `Shape ${shapes[shape_i]}`;

    //shape_i ++;



  }
);
buttons.color.addEventListener('click', () => 
  {
    color_i ++;
    if (color_i >= colors.length){
      color_i = 0;
    }

    buttons.color.textContent = `Color ${colors[color_i]}`;

    const currentColorName = colors[color_i];
    const rgba = colorMap[currentColorName] || [1, 1, 1, 1];

    show(shapes[shape_i], rgba);
    //color_i ++;


    

  }
);

show(currentMode, currentColor);
