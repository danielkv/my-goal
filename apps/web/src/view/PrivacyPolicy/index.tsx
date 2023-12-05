import { Component } from 'solid-js'

const PrivacyPolicy: Component<{}> = (props) => {
    return (
        <div class="max-w-5xl m-auto mt-8">
            <h1 class="font-bold my-4 text-xl">Política de Privacidade - Aplicativo móvel My Goal</h1>
            <p>
                Esta Política de Privacidade descreve como o My Goal, doravante denominado "nós" ou "nosso", coleta, usa
                e compartilha informações pessoais de usuários, doravante denominados "você" ou "seu", que acessam ou
                usam o aplicativo My Goal.
            </p>
            <h2 class="font-bold my-4">1. Informações que coletamos</h2>
            <p>
                Nós coletamos informações pessoais que você fornece diretamente através do aplicativo, incluindo nome,
                endereço de e-mail, telefone e opcionalmente fotos e vídeos. Podemos também coletar informações sobre a
                sua utilização do aplicativo, como a frequência de uso, os recursos acessados, o tempo de uso e outros
                dados semelhantes.
            </p>
            <h2 class="font-bold my-4">2. Como usamos as informações coletadas</h2>
            <p>
                As informações coletadas são utilizadas para personalização da experiência do usuário e análise de
                rendimento, incluindo a montagem de treinos personalizados e a identificação de oportunidades de
                melhoria do aplicativo. Além disso, podemos utilizar as informações para enviar e-mails com informações
                relevantes sobre o uso do aplicativo. As informações coletadas não são compartilhadas com terceiros,
                exceto quando necessário para o funcionamento do aplicativo ou quando exigido por lei.
            </p>
            <h2 class="font-bold my-4">3. Como protegemos suas informações</h2>
            <p>
                As informações pessoais fornecidas são armazenadas em servidores seguros e protegidas por medidas de
                segurança adequadas. Utilizamos técnicas de criptografia e autenticação para garantir a integridade e
                confidencialidade dos dados. No entanto, não podemos garantir a segurança absoluta das informações
                fornecidas.
            </p>
            <h2 class="font-bold my-4">4. Seus direitos</h2>
            <p>
                Você tem o direito de acessar, corrigir ou excluir as informações pessoais fornecidas a qualquer
                momento. Também pode optar por não receber e-mails com informações sobre o uso do aplicativo a qualquer
                momento. Para exercer esses direitos, entre em contato conosco através do e-mail de suporte disponível
                no aplicativo.
            </p>
            <h2 class="font-bold my-4">5. Alterações nesta política</h2>
            <p>
                Reservamo-nos o direito de alterar esta política de privacidade a qualquer momento, a nosso critério.
                Recomendamos que você verifique periodicamente a política de privacidade para se manter informado sobre
                as práticas atuais. O uso continuado do aplicativo após a publicação das alterações constitui sua
                aceitação das mesmas.
            </p>
            <h2 class="font-bold my-4">6. Contato</h2>
            <p>
                Se tiver alguma dúvida sobre esta política de privacidade ou sobre o uso do aplicativo, entre em contato
                conosco através do e-mail de suporte disponível no aplicativo.
            </p>
        </div>
    )
}

export default PrivacyPolicy
