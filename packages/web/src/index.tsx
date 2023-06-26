/* @refresh reload */
import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'
import duration from 'dayjs/plugin/duration'
import isBetween from 'dayjs/plugin/isBetween'

import { render } from 'solid-js/web'

import { Router } from '@solidjs/router'

import App from './App'
import './index.css'

dayjs.extend(isBetween)
dayjs.extend(duration)
dayjs.locale('pt-br')

const root = document.getElementById('root')

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
    throw new Error(
        'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got mispelled?'
    )
}

render(
    () => (
        <Router>
            <App />
        </Router>
    ),
    root!
)
