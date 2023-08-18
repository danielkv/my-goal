import { useState } from 'react'

import { IEventBlock } from 'goal-models'
import { Separator } from 'tamagui'

import Button from '@components/Button'
import Modal, { ModalProps } from '@components/Modal'
import Paper from '@components/Paper'
import WorkoutResultDialog from '@components/WorkoutResultDialog'
import { useBackHandler } from '@react-native-community/hooks'
import { Clock, Medal } from '@tamagui/lucide-icons'

interface EventBlockDialogProps extends ModalProps {
    block: IEventBlock | null
}

const EventBlockDialog: React.FC<EventBlockDialogProps> = ({ block, open, onClose }) => {
    const [displayResultFomOpen, setDisplayResultFomOpen] = useState(false)

    const handleBackPress = () => {
        if (displayResultFomOpen) {
            setDisplayResultFomOpen(false)
            return true
        }

        if (open) {
            onClose()
            return true
        }

        return false
    }

    useBackHandler(handleBackPress)

    return (
        <>
            <Modal open={open} onClose={onClose} id="menu">
                <Paper>
                    <Button icon={<Medal />} onPress={() => setDisplayResultFomOpen(true)}>
                        Ver resultados
                    </Button>
                    <Button icon={<Clock />}>Timer</Button>

                    <Separator borderColor="$gray9" br={10} width={80} bw={3} alignSelf="center" />

                    <Button onPress={() => onClose()}>Fechar</Button>
                </Paper>
            </Modal>

            <WorkoutResultDialog
                open={displayResultFomOpen}
                onClose={() => setDisplayResultFomOpen(false)}
                block={block}
            />
        </>
    )
}

export default EventBlockDialog
