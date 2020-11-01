export function bindFunctions(context, functions) {
    for (const f of functions) {
        context[f.name] = f.bind(context);
    }
}
