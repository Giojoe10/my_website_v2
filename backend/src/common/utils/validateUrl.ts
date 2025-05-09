export function validateUrl(url: string): boolean {
    let urlValidation: URL;
    try {
        urlValidation = new URL(url);
    } catch (_) {
        return false;
    }

    return urlValidation.protocol === "http:" || urlValidation.protocol === "https:";
}
