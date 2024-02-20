import KeenSlider from 'keen-slider'
import 'keen-slider/keen-slider.min.css'

import { Component, For, createEffect, createMemo, createSignal } from 'solid-js'

import AppStoreBadge from '@assets/images/app-store-badge.svg'
import followCommunity from '@assets/images/follow_community.png'
import PlayStoreBadge from '@assets/images/google-play-badge.png'
import group from '@assets/images/group.png'
import prs from '@assets/images/prs.png'
import timers from '@assets/images/timers.png'
import workoutsWeekly from '@assets/images/workouts-weekly.png'
import workouts from '@assets/images/workouts.png'
import ActivityIndicator from '@components/ActivityIndicator'
import HomeFeature, { HomeFeatureProps } from '@components/HomeFeature'
import StripePriceTable from '@components/StripePriceTable'
import TextInput from '@components/TextInput'
import { loggedUser } from '@contexts/user/user.context'
import { SubmitHandler, createForm, reset, zodForm } from '@modular-forms/solid'
import { useNavigate } from '@solidjs/router'
import { ChevronLeft, ChevronRight } from '@suid/icons-material'
import { Button, Container, IconButton, Stack } from '@suid/material'
import { sendEmailUseCase } from '@useCases/mail/send'
import { recaptchaVerifyUseCase } from '@useCases/recaptcha/verify'
import { getErrorMessage } from '@utils/errors'

import { IContactForm, formSchema, initialContactForm } from './config'

const STORE_URL = {
    playStore: 'https://play.google.com/store/apps/details?id=app.mygoal.goal',
    appStore: 'https://apps.apple.com/us/app/my-goal/id6449090065',
}

const FEATURES: HomeFeatureProps[] = [
    {
        title: 'Tenha seu treino semanal preparado',
        description:
            'Desperte o atleta interior em você com treinos semanais desafiadores e variados, cuidadosamente elaborados para ajudá-lo a atingir seu melhor desempenho. Nossos treinos semanais mantêm você motivado e no caminho certo para alcançar seus objetivos de condicionamento físico, garantindo que cada dia de treino seja uma nova oportunidade de superação.',
        image: workoutsWeekly,
    },
    {
        title: 'Timers Personalizáveis',
        description:
            'Você no controle do seu tempo! Nosso timer personalizável é a ferramenta perfeita para otimizar seus treinos de CrossFit. Configure intervalos, contagens regressivas e adapte o cronômetro às suas necessidades, garantindo que seus treinos sejam eficientes e eficazes. Mantenha-se no controle, desafie seus limites e alcance seus melhores resultados.',
        image: timers,
    },
    {
        title: 'Salvar PRs (Recordes Pessoais)',
        description:
            'Celebre suas conquistas e acompanhe seu progresso registrando todos os seus recordes pessoais. Não há melhor maneira de se motivar do que ver como você está constantemente superando seus próprios limites. Com nosso sistema de registro de PRs, você pode orgulhosamente ver como seus números continuam crescendo e suas habilidades melhorando.',
        image: prs,
    },
    {
        title: 'Salvar Resultados de Cada Workout',
        description:
            'Nunca perca o controle do seu progresso. Registre e mantenha um histórico de cada treino que você faz, monitorando tempos, repetições e pesos, para que você possa analisar seu desempenho ao longo do tempo. Visualize seu progresso, identifique áreas de melhoria e celebre suas vitórias.',
        image: workouts,
    },
    {
        title: 'Acompanhar os Treinos de Outros Usuários da Comunidade',
        description:
            'Faça parte de uma comunidade apaixonada por CrossFit! Acompanhe os treinos de outros membros, encontre inspiração em seus esforços e motive-se mutuamente. O CrossFit é um esporte coletivo, e agora você pode compartilhar e celebrar os triunfos de seus amigos, tornando sua jornada ainda mais gratificante.',
        image: followCommunity,
    },
    {
        title: 'Acompanhamento dos Headcoaches',
        description:
            'Receba orientação direta de treinadores especializados no mundo do CrossFit. Nossos head coaches oferecem dicas valiosas, planos de treinamento personalizados e orientação especializada para ajudá-lo a alcançar seus objetivos. Junte-se aos grupos de treinamento liderados por nossos head coaches e eleve seu nível de treinamento para o próximo patamar.',
        image: group,
    },
]

const INITIAL_FEATURE = 0

const RECAPTCHA_MIN_SCORE = 0.5

const Home: Component = () => {
    let slider: any

    const navigate = useNavigate()
    const [currentSlide, setCurrentSlide] = createSignal(INITIAL_FEATURE)
    const [loadingMail, setLoadingMail] = createSignal(false)

    createEffect(() => {
        slider = new KeenSlider('#my-goal-features', { initial: INITIAL_FEATURE, loop: true })

        slider.on('slideChanged', (event: any) => {
            setCurrentSlide(event.track.details.rel)
        })
    })

    const [form, { Form, Field }] = createForm<IContactForm>({
        validate: zodForm(formSchema),
        initialValues: initialContactForm,
    })

    const handleSubmit: SubmitHandler<IContactForm> = (values) => {
        setLoadingMail(true)
        // @ts-expect-error
        grecaptcha.ready(function () {
            // @ts-expect-error
            grecaptcha
                .execute(import.meta.env.VITE_APP_RECAPTCHA_SITE_KEY, { action: 'submit' })
                .then(async function (token: string) {
                    try {
                        const result = await recaptchaVerifyUseCase(token)
                        if (!result.success || result.score < RECAPTCHA_MIN_SCORE)
                            throw new Error('Essa parece uma ação de um bot')

                        await sendEmailUseCase(values)

                        reset(form)
                    } catch (err) {
                        alert(getErrorMessage(err))
                    } finally {
                        setLoadingMail(false)
                    }
                })
        })
    }

    return (
        <>
            {!!loggedUser() && (
                <div class="flex flex-row gap-2 justify-center items-center fixed z-20 w-full bg-[#ffcc00] py-2 text-gray-600 font-bold text-center">
                    Logado como {loggedUser()?.displayName}
                    <Button variant="contained" color="secondary" size="small" onClick={() => navigate('/dashboard')}>
                        Ir para dashboard
                    </Button>
                </div>
            )}
            <section
                class="bg-intro-section bg-cover bg-[25%] h-[370px] md:h-[570px]"
                classList={{ 'mt-[45px]': !!loggedUser() }}
            >
                <Container maxWidth="lg" class="h-full">
                    <Stack direction="row" class="h-full" justifyContent="flex-end">
                        <Stack justifyContent="center" alignItems="center" gap={3} p={5} class="lg:flex-[.5] flex-1">
                            <img src="images/logo-full.png" class="max-w-[70%]" />
                            <h2 class="text-xl lg:text-3xl text-center font-bold">MANTENHA O FOCO</h2>
                            <Stack alignItems="center" class="md:!flex-row md:!gap-5">
                                <a href={STORE_URL.appStore} target="_blank">
                                    <AppStoreBadge />
                                </a>
                                <a href={STORE_URL.playStore} target="_blank">
                                    <img src={PlayStoreBadge} style={{ height: '50px' }} />
                                </a>
                            </Stack>
                        </Stack>
                    </Stack>
                </Container>
            </section>
            <section class="py-10">
                <Container maxWidth="lg">
                    <div class="flex flex-1 flex-row items-center gap-5">
                        <IconButton class="!hidden md:!flex" size="large" onClick={() => slider.prev()}>
                            <ChevronLeft />
                        </IconButton>
                        <div id="my-goal-features" class="keen-slider">
                            <For each={FEATURES}>
                                {(item) => (
                                    <div class="keen-slider__slide">
                                        <HomeFeature
                                            image={item.image}
                                            title={item.title}
                                            description={item.description}
                                        />
                                    </div>
                                )}
                            </For>
                        </div>
                        <IconButton class="!hidden md:!flex" size="large" onClick={() => slider.next()}>
                            <ChevronRight />
                        </IconButton>
                    </div>
                    <div class="flex flex-1 flex-row justify-center mt-10 gap-2">
                        <For each={Array.from({ length: FEATURES.length })}>
                            {(_, index) => {
                                const selected = createMemo(() => currentSlide() === index())

                                return (
                                    <div
                                        class="w-1 h-1 opacity-50 bg-white rounded-xl transition-all"
                                        classList={{ '!opacity-100': selected(), 'scale-[2]': selected() }}
                                    />
                                )
                            }}
                        </For>
                    </div>
                </Container>
            </section>
            <section class="bg-gray-800 py-10 px-5">
                <div class="mb-6">
                    <h3 class="text-3xl font-bold text-center">Nossos planos</h3>
                    <div class="text-center">Cancele a qualquer momento</div>
                </div>
                <StripePriceTable />
            </section>
            <section class="bg-contact-section bg-right bg-no-repeat py-14">
                <Container maxWidth="lg">
                    <div class="flex flex-row">
                        <div class="flex flex-col gap-3 flex-1 lg:flex-[.4] px-10 md:px-40 lg:p-0">
                            <div>
                                <div class="text-3xl font-bold">Precisa de ajuda ou tem uma dúvida?</div>
                                <div class="text-xl">Entre em contato</div>
                            </div>
                            <Form onSubmit={handleSubmit} class="flex flex-col gap-2">
                                <Field name="subject">
                                    {(field, props) => (
                                        <TextInput
                                            disabled={loadingMail()}
                                            label="Assunto"
                                            error={field.error}
                                            value={field.value}
                                            required
                                            {...props}
                                        />
                                    )}
                                </Field>
                                <Field name="name">
                                    {(field, props) => (
                                        <TextInput
                                            disabled={loadingMail()}
                                            required
                                            label="Nome"
                                            error={field.error}
                                            value={field.value}
                                            {...props}
                                        />
                                    )}
                                </Field>
                                <Field name="email">
                                    {(field, props) => (
                                        <TextInput
                                            disabled={loadingMail()}
                                            required
                                            label="Email"
                                            error={field.error}
                                            value={field.value}
                                            {...props}
                                        />
                                    )}
                                </Field>
                                <Field name="phone">
                                    {(field, props) => (
                                        <TextInput
                                            disabled={loadingMail()}
                                            label="Telefone"
                                            error={field.error}
                                            value={field.value}
                                            {...props}
                                        />
                                    )}
                                </Field>
                                <Field name="message">
                                    {(field, props) => (
                                        <TextInput
                                            disabled={loadingMail()}
                                            rows={5}
                                            multiline
                                            required
                                            label="Mensagem"
                                            error={field.error}
                                            value={field.value}
                                            {...props}
                                        />
                                    )}
                                </Field>

                                <Button disabled={loadingMail()} variant="contained" class="self-start" type="submit">
                                    {loadingMail() ? (
                                        <>
                                            <ActivityIndicator color="white" />
                                            Enviando
                                        </>
                                    ) : (
                                        'Enviar'
                                    )}
                                </Button>
                            </Form>
                        </div>
                    </div>
                </Container>
            </section>
            <footer class="bg-gray-900 py-8">
                <div class="text-center text-sm">Todos os direitos reservados à My Goal</div>
            </footer>
        </>
    )
}

export default Home
