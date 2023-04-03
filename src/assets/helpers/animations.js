import LeaderLine from "leader-line-new";
import {ref} from "vue";

export default function generateLines(start, end, optionFirstLine, optionSecondLine, optionThirdLine, shiftOptions) {

    const firstLine = ref();
    const secondLine = ref();
    const thirdLine = ref();

    const removeLines = (line) => {
        line.remove()
    }

    const checkToRemoveLinesIfExists = (line) => {
        if (line) {
            removeLines(line)
        }
    }
    const drawLines = (componentA, componentB, options, shiftOption) => {
        return new LeaderLine(
            componentA,
            shiftOption ? LeaderLine.pointAnchor(componentB, shiftOptions) : componentB,
            {dash: true, color: 'white', size: 2, positionByWindowResize: false}).setOptions(options)
    }

    const setLine = (start, end, shiftOptions) => {
        if (!start || !end) return
        checkToRemoveLinesIfExists(firstLine?.value)
        checkToRemoveLinesIfExists(secondLine?.value)
        checkToRemoveLinesIfExists(thirdLine?.value)
        firstLine.value = drawLines(start.value, end.value, optionFirstLine, shiftOptions)
        secondLine.value = drawLines(start.value, end.value, optionSecondLine)
        thirdLine.value = drawLines(start.value, end.value, optionThirdLine)
    }
    const applySizePositionOptions = (ref, position) => {
        if (!position || !ref.value) {
            return
        }
        ref.value.style.width = `${position.width}px`;
        ref.value.style.top = `${position.top}px`;
        ref.value.style.left = `${position.left}px`;
        ref.value.style.height = `${position.height}px`;

        setTimeout(() => {  setLine(start, end, shiftOptions)}, 100)
    }

    return {applySizePositionOptions, firstLine, secondLine, thirdLine, setLine}
}