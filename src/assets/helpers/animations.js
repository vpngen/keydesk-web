import LeaderLine from 'leader-line-new';
import {ref} from 'vue';

export default function generateLines(start, end, lineOptions, shiftOptions) {
  const firstLine = ref();
  const secondLine = ref();
  const thirdLine = ref();

  const removeIfExists = (line) => {
    if (line) line.remove();
  };

  const getLineOptions = (index) => Array.isArray(lineOptions)
    ? lineOptions[index] || lineOptions[0]
    : lineOptions;

  const addLineClass = (className) => {
    const lines = document.querySelectorAll('svg.leader-line');
    const line = lines[lines.length - 1];

    line?.classList.add(className);
  };

  const drawOne = (componentA, componentB, useShift, optionsIndex) => {
    const line = new LeaderLine(
      componentA,
      useShift && shiftOptions ? LeaderLine.pointAnchor(componentB, shiftOptions) : componentB,
      {dash: true, color: 'white', size: 2, positionByWindowResize: false}
    ).setOptions(getLineOptions(optionsIndex) || {});

    addLineClass(`leader-line--${['desktop', 'tablet', 'mobile'][optionsIndex]}`);

    return line;
  };

  const setLine = () => {
    if (!start.value || !end.value) return;
    removeIfExists(firstLine.value);
    removeIfExists(secondLine.value);
    removeIfExists(thirdLine.value);
    firstLine.value = drawOne(start.value, end.value, true, 0);
    secondLine.value = drawOne(start.value, end.value, false, 1);
    thirdLine.value = drawOne(start.value, end.value, false, 2);
  };

  const applySizePositionOptions = (refToShape, position) => {
    if (!position || !refToShape.value) return;
    refToShape.value.style.width = `${position.width}px`;
    refToShape.value.style.top = `${position.top}px`;
    refToShape.value.style.left = `${position.left}px`;
    refToShape.value.style.height = `${position.height}px`;
    setTimeout(setLine, 100);
  };

  const removeLine = () => {
    removeIfExists(firstLine.value);
    removeIfExists(secondLine.value);
    removeIfExists(thirdLine.value);
    firstLine.value = null;
    secondLine.value = null;
    thirdLine.value = null;
  };

  return {applySizePositionOptions, setLine, removeLine};
}
