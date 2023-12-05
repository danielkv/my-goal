import { Component, createEffect } from 'solid-js'

const StripePriceTable: Component = (props) => {
    createEffect(() => {
        const script = document.createElement('script')
        script.src = 'https://js.stripe.com/v3/pricing-table.js'
        script.async = true
        document.body.appendChild(script)
    })

    return (
        <>
            <div class="w-full h-full">
                {/*@ts-expect-error */}
                <stripe-pricing-table
                    pricing-table-id="prctbl_1OJfrcADar8wSwCNR2QaNuh3"
                    publishable-key="pk_live_51O07qgADar8wSwCNRLg5BgVViiFflQ3yYeMRkaQ6zsxmTfRLZDdZDv7Z8QaYh1QfKOEdTnkNoLoGglS7IkYdLScb00OelcAcdN"
                />
            </div>
        </>
    )
}

export default StripePriceTable
