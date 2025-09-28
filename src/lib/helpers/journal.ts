
export const journalCodeFormatter = {
    format: (code: number, year: number) => (`DOC-${year}-${code.toString().padStart(5, "0")}`),
    codeformat: (code: number) => code.toString().padStart(5, "0"),
}