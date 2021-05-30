
export const DecoratorDecision = (condition, successDecorator, failDecorator?) => {
    if (condition) {
        return successDecorator;
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const emptyDecorator = () => {};
    return failDecorator || emptyDecorator;
};
