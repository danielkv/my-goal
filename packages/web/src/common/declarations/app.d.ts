declare module 'html2pdf.js' {
    type SourceTypes = 'string' | 'element' | 'canvas' | 'img'
    type PagebreakModeTypes = 'avoid-all' | 'css' | 'legacy'
    interface PagebreakOpt {
        mode: PagebreakModeTypes | PagebreakModeTypes[]
        before: string | string[]
        after: string | string[]
        avoid: string | string[]
    }
    interface ImageOpt {
        type: string
        quality: number
    }
    interface Options {
        margin: number | number[]
        file: string
        pagebreak: Partial<PagebreakOpt>
        image: ImageOpt
        enableLinks: boolean
        html2canvas: Partial<import('html2canvas').Options>
        jsPDF: Partial<import('jspdf').jsPDFOptions>
    }
    interface Worker {
        from(src: HTMLElement | string, type?: SourceTypes): Worker
        set(options: Partial<Options>): Worker
        save(): Promise<void>
    }

    function call(): Worker
    export = call
}
