import { Component } from 'solid-js'

import { A } from '@solidjs/router'

const TermsOfUse: Component<{}> = (props) => {
    return (
        <div class="max-w-5xl m-auto mt-8">
            <div class="markdown prose w-full break-words dark:prose-invert dark">
                <h2 class="font-bold my-4 text-xl">Termos de Uso - Aplicativo móvel My Goal</h2>
                <p>
                    Estes Termos de Uso ("Termos") regem o acesso e uso do aplicativo My Goal ("Aplicativo para
                    dispositivos móveis") fornecido por nós, doravante referidos como "My Goal", "Goal", "nós", ou
                    "nosso". Ao acessar ou utilizar o Aplicativo, você, doravante referido como "usuário" ou "você",
                    concorda com estes Termos. Se você não concordar com estes Termos, por favor, não acesse ou utilize
                    o Aplicativo.
                </p>
                <h2 class="font-bold my-4 text-xl">1. Uso do Aplicativo:</h2>
                <p>
                    1.1. O Aplicativo é destinado exclusivamente para uso pessoal e não comercial. Você concorda em não
                    utilizar o Aplicativo para fins ilegais ou não autorizados.
                </p>
                <h2 class="font-bold my-4 text-xl">2. Conta do Usuário:</h2>
                <p>
                    2.1. Ao criar uma conta no Aplicativo, você concorda em fornecer informações precisas, completas e
                    atualizadas. Você é responsável por manter a confidencialidade de sua conta e senha.
                </p>
                <h2 class="font-bold my-4 text-xl">3. Informações Pessoais:</h2>
                <p>
                    3.1. O uso de informações pessoais fornecidas está sujeito à nossa Política de Privacidade (
                    <A class="text-[#0aa]" target="_blank" href="/politica-de-privacidade">
                        leia aqui
                    </A>
                    ). Ao utilizar o Aplicativo, você consente a coleta, uso e compartilhamento de suas informações de
                    acordo com essa política.
                </p>
                <h2 class="font-bold my-4 text-xl">4. Conteúdo Gerado pelo Usuário:</h2>
                <p>
                    4.1. Você pode fornecer conteúdo, como fotos e vídeos, através do Aplicativo. Ao fazer isso, você
                    concede à Goal uma licença mundial, não exclusiva, transferível e sublicenciável para usar,
                    armazenar, reproduzir e distribuir esse conteúdo.
                </p>
                <h2 class="font-bold my-4 text-xl">5. Propriedade Intelectual:</h2>
                <p>
                    5.1. Todo o conteúdo do Aplicativo, incluindo textos, gráficos, logotipos, ícones e imagens, é de
                    propriedade exclusiva da Goal e está protegido por leis de propriedade intelectual.
                </p>
                <h2 class="font-bold my-4 text-xl">6. Responsabilidades do Usuário:</h2>
                <p>
                    6.1. Você concorda em usar o Aplicativo de acordo com todas as leis e regulamentações aplicáveis.
                    Qualquer uso indevido do Aplicativo pode resultar na rescisão imediata de sua conta.
                </p>
                <h2 class="font-bold my-4 text-xl">7. Alterações nos Termos:</h2>
                <p>
                    7.1. Reservamos o direito de modificar ou revisar estes Termos a qualquer momento, a nosso critério.
                    As alterações entrarão em vigor após a publicação no Aplicativo. Recomendamos que você revise
                    periodicamente os Termos.
                </p>
                <h2 class="font-bold my-4 text-xl">8. Rescisão:</h2>
                <p>
                    8.1. Podemos rescindir ou suspender sua conta e acesso ao Aplicativo, a nosso critério, sem aviso
                    prévio, se violar estes Termos.
                </p>
                <h2 class="font-bold my-4 text-xl">9. Contato:</h2>
                <p>
                    9.1. Se tiver dúvidas sobre estes Termos, entre em contato conosco através do e-mail de suporte
                    disponível no Aplicativo.
                </p>
                <p>
                    Ao continuar a usar o Aplicativo, você indica que leu, compreendeu e concordou com estes Termos de
                    Uso. Estes Termos estão sujeitos a alterações, e a versão mais recente estará sempre disponível no
                    através do endereço desta página web.
                </p>
            </div>
        </div>
    )
}

export default TermsOfUse
