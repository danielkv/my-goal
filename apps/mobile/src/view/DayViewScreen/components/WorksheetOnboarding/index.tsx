import BlockIdImage from '@assets/images/onboardings/worksheet/tour-blockid.png'
import ModesImage from '@assets/images/onboardings/worksheet/tour-mode.png'
import TimersImage from '@assets/images/onboardings/worksheet/tour-timers.png'
import WelcomeImage from '@assets/images/onboardings/worksheet/tour-welcome.png'
import Onboarding from '@components/Onboarding'

import { H1, Image, Stack, Text } from 'tamagui'

const WorksheetOnboarding: React.FC = () => {
    return (
        <Onboarding id="tour-worksheet">
            <Stack ai="center" jc="center" gap="$4" my="$3" mx="$3">
                <H1 ta="center" fontSize="$9" fontWeight="700" lh="$9">
                    Bem vindo a nova tela de planilha
                </H1>
                <Image source={WelcomeImage} maxWidth="100%" maxHeight={300} resizeMode="contain" />

                <Text ta="center" fontSize="$5">
                    Pensando em sua experiência, fizemos algumas mudanças. Vamos fazer um pequeno tour para entender
                    como funciona
                </Text>
            </Stack>
            <Stack ai="center" jc="center" gap="$4" my="$3" mx="$3">
                <H1 ta="center" fontSize="$9" fontWeight="700" lh="$9">
                    Timers
                </H1>
                <Text ta="center" fontSize="$5">
                    Você pode abrir os timers diretamente da planilha
                </Text>

                <Image source={TimersImage} maxWidth="100%" maxHeight={300} resizeMode="contain" />

                <Text ta="center" fontSize="$5">
                    Sempre que esse icone for exibido, você pode clicar no bloco para abrir o timer desse treino.
                </Text>
            </Stack>
            <Stack ai="center" jc="center" gap="$3" my="$3" mx="$3">
                <H1 ta="center" fontSize="$9" fontWeight="700" lh="$9">
                    Modos
                </H1>
                <Text ta="center" fontSize="$5">
                    Você pode vizualizar as planilhas de 2 maneiras: em períodos ou em seções
                </Text>
                <Image source={ModesImage} maxWidth="100%" maxHeight={275} resizeMode="contain" />
                <Text ta="center" fontSize="$5">
                    Você pode alternar entre esses modos clicando no icone que é exibido no canto inferior direito.
                </Text>
            </Stack>
            <Stack ai="center" jc="center" gap="$3" my="$3" mx="$3">
                <H1 ta="center" fontSize="$9" fontWeight="700" lh="$9">
                    ID do bloco
                </H1>
                <Text ta="center" fontSize="$5">
                    Cada bloco tem seu ID, assim você pode se guiar pela planilha
                </Text>
                <Image source={BlockIdImage} maxWidth="100%" maxHeight={285} resizeMode="contain" />
                <Text ta="center" fontSize="$5">
                    Os número são referentes ao período.seção.bloco
                </Text>
            </Stack>
        </Onboarding>
    )
}

export default WorksheetOnboarding
