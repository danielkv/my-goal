import { H1, Image, Stack, Text } from 'tamagui'

import Img4 from '@assets/images/onboardings/v1.4/add-results.png'
import Img2 from '@assets/images/onboardings/v1.4/follow-PR.png'
import Img5 from '@assets/images/onboardings/v1.4/follow-results.png'
import Img3 from '@assets/images/onboardings/v1.4/jump-to-PR.png'
import Img6 from '@assets/images/onboardings/v1.4/privacy.png'
import Img1 from '@assets/images/onboardings/v1.4/tour-open-PR.png'
import Onboarding from '@components/Onboarding'

const HomeOnboarding: React.FC = () => {
    return (
        <Onboarding id="tour-version-1.4">
            <Stack ai="center" jc="center" gap="$4" my="$3" mx="$3">
                <H1 ta="center" fontSize="$9" fontWeight="700" lh="$9">
                    Novidades
                </H1>
                <Text ta="center" fontSize="$5">
                    Agora você pode adicionar seus PRs
                </Text>
                <Image source={Img1} maxWidth="100%" maxHeight={300} resizeMode="contain" />

                <Text ta="center" fontSize="$5">
                    Vá até a tela de seu perfil e pressione PRs
                </Text>
            </Stack>
            <Stack ai="center" jc="center" gap="$4" my="$3" mx="$3">
                <H1 ta="center" fontSize="$9" fontWeight="700" lh="$9">
                    Acompanhar PRs
                </H1>
                <Text ta="center" fontSize="$5">
                    Adicione novos PRs
                </Text>

                <Image source={Img2} maxWidth="100%" maxHeight={300} resizeMode="contain" />

                <Text ta="center" fontSize="$5">
                    Acompanhe também PRs e resultados de outros atletas ou filtre somente os seus
                </Text>
            </Stack>
            <Stack ai="center" jc="center" gap="$4" my="$3" mx="$3">
                <H1 ta="center" fontSize="$9" fontWeight="700" lh="$9">
                    Acesso rápido
                </H1>

                <Image source={Img3} maxWidth="100%" maxHeight={300} resizeMode="contain" />

                <Text ta="center" fontSize="$5">
                    Pule rapidamente para a tela de PRs
                </Text>
            </Stack>
            <Stack ai="center" jc="center" gap="$3" my="$3" mx="$3">
                <H1 ta="center" fontSize="$9" fontWeight="700" lh="$9">
                    Adicione resultados
                </H1>

                <Text ta="center" fontSize="$5">
                    Acompanhe os resultados de seus Workouts
                </Text>
                <Image source={Img4} maxWidth="100%" maxHeight={275} resizeMode="contain" />
                <Text ta="center" fontSize="$5">
                    Clique em qualquer bloco para adicionar o resultado do workout
                </Text>
            </Stack>
            <Stack ai="center" jc="center" gap="$3" my="$3" mx="$3">
                <H1 ta="center" fontSize="$9" fontWeight="700" lh="$9">
                    Entenda seus resultados
                </H1>

                <Image source={Img5} maxWidth="100%" maxHeight={275} resizeMode="contain" />
                <Text ta="center" fontSize="$5">
                    Entenda melhor sua melhora comparando seus resultados
                </Text>
            </Stack>
            <Stack ai="center" jc="center" gap="$3" my="$3" mx="$3">
                <H1 ta="center" fontSize="$9" fontWeight="700" lh="$9">
                    Privacidade
                </H1>
                <Text ta="center" fontSize="$5">
                    Caso não queira exibir seus resultados para outras pessoas, basta mudar a exibição para privado
                </Text>
                <Stack bg="$gray9" my="$6" py="$6" br="$4">
                    <Image source={Img6} maxWidth="100%" maxHeight={58} resizeMode="contain" />
                </Stack>
                <Text ta="center" fontSize="$5">
                    Os resultados ainda vão ser salvos, mas serão exibidos somente para você
                </Text>
            </Stack>
        </Onboarding>
    )
}

export default HomeOnboarding
