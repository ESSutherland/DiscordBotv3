"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.areCommandsDifferent = void 0;
const areCommandsDifferent = (existingCommand, localCommand) => {
    const areChoicesDifferent = (existingChoices, localChoices) => {
        let areDifferent = false;
        areDifferent = localChoices.some((localChoice) => {
            const existingChoice = existingChoices?.find((choice) => choice.name === localChoice.name);
            if (!existingChoice) {
                return true;
            }
            if (localChoice.value !== existingChoice.value) {
                return true;
            }
        });
        return areDifferent;
    };
    const areOptionsDifferent = (existingOptions, localOptions) => {
        let areDifferent = false;
        areDifferent = localOptions.some((localOption) => {
            const existingOption = existingOptions?.find((option) => option.name === localOption.name);
            if (!existingOption) {
                return true;
            }
            if (localOption.description !== existingOption.description ||
                localOption.type !== existingOption.type ||
                (localOption.required || false) !== existingOption.required ||
                (localOption.choices?.length || 0) !==
                    (existingOption.choices?.length || 0) ||
                areChoicesDifferent(localOption.choices || [], existingOption.choices || [])) {
                return true;
            }
        });
        return areDifferent;
    };
    if (existingCommand.description !== localCommand.description ||
        existingCommand.options?.length !== (localCommand.options?.length || 0) ||
        areOptionsDifferent(existingCommand.options, localCommand.options || [])) {
        return true;
    }
    return false;
};
exports.areCommandsDifferent = areCommandsDifferent;
