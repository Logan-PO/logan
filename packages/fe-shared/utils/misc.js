export function noProp(fn) {
    return (event, ...otherProps) => {
        event.stopPropagation();
        fn(event, ...otherProps);
    };
}
