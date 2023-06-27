import { useState } from 'react'

import { IEventBlock, IRound } from 'goal-models'
import { Dialog } from 'tamagui'

import Button from '@components/Button'
import EventBlock from '@components/EventBlock'
import EventBlockRound from '@components/EventBlockRound'
import { Eye } from '@tamagui/lucide-icons'

type WodDialogProps = { round: IRound; block?: never } | { block: IEventBlock; round?: never }

const WodDialog: React.FC<WodDialogProps> = (props) => {
    const [worOpen, setWodOpen] = useState(false)

    return (
        <>
            <Dialog open={worOpen} onOpenChange={setWodOpen}>
                <Dialog.Portal>
                    <Dialog.Overlay
                        onPressOut={() => setWodOpen(false)}
                        key="overlay"
                        animation="quick"
                        opacity={0.5}
                        enterStyle={{ opacity: 0 }}
                        exitStyle={{ opacity: 0 }}
                    />
                    <Dialog.Content
                        key="content"
                        animation={[
                            'quick',
                            {
                                opacity: {
                                    overshootClamping: true,
                                },
                            },
                        ]}
                        enterStyle={{ opacity: 0, scale: 0.9 }}
                        exitStyle={{ opacity: 0, scale: 0.95 }}
                        w="100%"
                        maxWidth={380}
                    >
                        {props.block ? <EventBlock block={props.block} /> : <EventBlockRound round={props.round} />}
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog>
            <Button
                position="absolute"
                b="$3"
                right="$3"
                size="$6"
                onPressIn={() => setWodOpen(true)}
                onPressOut={() => setWodOpen(false)}
                variant="icon"
                bg="$gray5"
                icon={<Eye size={28} />}
            />
        </>
    )
}

export default WodDialog
