import { Component, createEffect } from 'solid-js'

const StripePriceTable: Component = (props) => {
    createEffect(() => {
        const script = document.createElement('script')
        script.src = 'https://js.stripe.com/v3/pricing-table.js'
        script.async = true
        document.body.appendChild(script)
        return () => {
            document.body.removeChild(script)
        }
    })

    return (
        <>
            <div class="w-full h-full">
                {/*@ts-expect-error */}
                <stripe-pricing-table
                    pricing-table-id="prctbl_1O0PdnADar8wSwCNJf86Xgvs"
                    publishable-key="pk_test_51O07qgADar8wSwCNScm1R7RyOzkdCaT4JStq4o9orBXq4sn2ELeYiVXf9nHHjs8KHa8GyCAx7D3sEQ6eFbD4YMdP00uWLcS6Js"
                />
            </div>
        </>
    )
}

export default StripePriceTable
