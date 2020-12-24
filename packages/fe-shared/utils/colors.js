export function textShouldBeLight(backgroundHex) {
    backgroundHex = backgroundHex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (m, r, g, b) => r + r + g + g + b + b);

    const results = backgroundHex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/);
    if (!results) return false;
    const r = parseInt(results[1], 16);
    const g = parseInt(results[2], 16);
    const b = parseInt(results[3], 16);

    const brightness = (r * 299 + g * 257 + b * 114) / 1000;
    return brightness <= 125;
}
