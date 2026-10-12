// Page scaffolding only: toggle, canvas swap and source panel.
import './style.css';

// old schema professor example
import { run as runFF } from './shapes/triangle.ff';
import { run as runVanilla } from './examples/triangle.vanilla';
import ffSource from './shapes/triangle.ff.ts?raw';
import vanillaSource from './examples/triangle.vanilla.ts?raw';

// new applied by us
const shapes: string[] = ["triangle", "quad", "hexagon", "circle"];
const colors: string[] = ["red", "verde", "azul"];
let shape_i = 1;
let color_i = 1;


// Diccionario para traducir los nombres de colores de tu arreglo a valores RGBA (de 0.0 a 1.0)
const colorMap: Record<string, [number, number, number, number]> = {
  red:   [1.0, 0.0, 0.0, 1.0],
  verde: [0.0, 1.0, 0.0, 1.0],
  azul:  [0.0, 0.0, 1.0, 1.0],
  rojo:  [1.0, 0.0, 0.0, 1.0],
};

//

type Mode = 'shape' | 'color';
type ModeFig = 'triangle' | 'triangle99';

const figures: Record<ModeFig, { file: string; source: string; run: (canvas: HTMLCanvasElement, customColor?: [number, number, number, number]) => void }> = {
  triangle: { file: 'triangle.ff.ts', source: ffSource, run: runFF },
  triangle99: { file: 'triangle.vanilla.ts', source: vanillaSource, run: runVanilla },
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
    show(currentMode, currentColor);
    buttons.shape.textContent = `shape ${shapes[shape_i]}`;

    shape_i ++;

    if (shape_i >= shapes.length){
      shape_i = 0;
    }

  }
);
buttons.color.addEventListener('click', () => 
  {

    buttons.color.textContent = `color ${colors[color_i]}`;

    const currentColorName = colors[color_i];
    const rgba = colorMap[currentColorName] || [1, 1, 1, 1];

    show(currentMode, rgba);
    color_i ++;

    if (color_i >= colors.length){
      color_i = 0;
    }

  }
);

show(currentMode, currentColor);
