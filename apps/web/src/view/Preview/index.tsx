import { IWorksheetModel } from 'goal-models'
import html2pdf from 'html2pdf.js'

import { Component, createResource } from 'solid-js'

import ActivityIndicator from '@components/ActivityIndicator'
import DashboardContainer from '@components/DashboardContainer'
import WorksheetPreview from '@components/WorksheetPreview'
import { useParams } from '@solidjs/router'
import { getWorksheetByIdUseCase } from '@useCases/worksheet/getWorksheetById'

const Preview: Component = () => {
    const params = useParams()

    const [worksheet] = createResource(params.id, getWorksheetByIdUseCase)

    function generatePDF() {
        const html = document.querySelectorAll('.period')
        if (!html) return

        const pdfElement = document.createElement('div')
        pdfElement.classList.add('pdf-page')

        html.forEach((item) => {
            const cloned = item.cloneNode(true)

            pdfElement.appendChild(cloned)
        })

        html2pdf()
            .set({
                html2canvas: {
                    scale: 2,
                },
                jsPDF: {
                    floatPrecision: 'smart',
                    format: 'letter',
                },
            })
            .from(pdfElement)
            .save()
    }

    return (
        <DashboardContainer>
            {worksheet.loading ? (
                <div class="w-full h-full flex items-center justify-center">
                    <ActivityIndicator color="#fff" size={40} />
                </div>
            ) : (
                <div>
                    {worksheet() ? (
                        <>
                            <div class="h-[60px] bg-gray-500 flex items-center px-6 justify-end">
                                <button class="btn btn-main" onClick={() => generatePDF()}>
                                    Baixar PDF
                                </button>
                            </div>
                            <div id="pdfContent">
                                <WorksheetPreview item={worksheet() as IWorksheetModel} />
                            </div>
                        </>
                    ) : (
                        <div class="w-full h-full flex items-center justify-center">
                            <div>Ocorreu um erro</div>
                        </div>
                    )}
                </div>
            )}
        </DashboardContainer>
    )
}

export default Preview
