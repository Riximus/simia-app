import {Card} from "@/components/ui/card";
import {Heading} from "@/components/ui/heading";
import {HStack} from "@/components/ui/hstack";
import {Text} from "@/components/ui/text";
import {Icon} from "@/components/ui/icon";
import {Badge, BadgeIcon, BadgeText} from "@/components/custom/badge"
import {StyleSheet} from "react-native";
import {
    AlarmClock,
    Clock,
    Pill,
    Circle,
    Utensils,
    Info,
    TriangleAlert,
    Package,
    SkipForward, CircleCheckBig, CircleCheck, Hourglass, Undo, Check, EllipsisVertical, BoxIcon
} from "lucide-react-native";
import {baseStyles} from "@/styles/base";
import {FontAwesome} from "@expo/vector-icons";
import {VStack} from "@/components/ui/vstack";
import {Progress, ProgressFilledTrack} from "@/components/custom/progress";
import {Button, ButtonIcon, ButtonText} from "@/components/ui/button";
import {Divider} from "@/components/ui/divider";

export default function MedsCard() {
    return (
        <Card size={"lg"} className={'flex gap-4'}>
            {/* Header */}
            <VStack>
                <HStack className={'flex items-center justify-between'}>
                    {/*<Icon size={'md'} as={Pill} style={baseStyles.iconOpacity} />*/}
                    <HStack space={'sm'} className={'items-center'}>
                        <FontAwesome name={"circle"} color={"#3471fa"}/>
                        <Heading size={'2xl'}>{'Elvanse'}</Heading>
                        <Badge action={'warning'} variant={'solid'} size={'md'}>
                            <BadgeIcon>
                                <Icon as={TriangleAlert} size={'xs'} style={baseStyles.iconOpacity}/>
                            </BadgeIcon>
                            <BadgeText>{'Next dose: 32m'}</BadgeText>
                        </Badge>
                    </HStack>
                    <Button variant="link">
                        <ButtonIcon as={EllipsisVertical}/>
                    </Button>
                </HStack>
                <HStack space={'xs'} className={'items-center'} style={baseStyles.textOpacity}>
                    <Text>{'Pill'}</Text>
                    <Text>•</Text>
                    <Text>{'Daily'}</Text>
                    <Text>•</Text>
                    <Text>{'1 per dose'}</Text>
                    <Text>•</Text>
                    <Text>{'50mg'}</Text>
                </HStack>
            </VStack>

            {/* Content */}
            <HStack className={'justify-between'}>
                <HStack space={'xs'} className={'items-center'}>
                    <Icon as={AlarmClock} size={'sm'} style={baseStyles.iconOpacity}/>
                    {/* TODO: Or 'Mar 5 at 11:00 AM' when everything was taken */}
                    <Text>{'11:00 AM'}</Text>
                </HStack>
                <HStack space={'xs'} className={'items-center'}>
                    <Icon as={Utensils} size={'sm'} style={baseStyles.iconOpacity}/>
                    <Text>During meal</Text>
                </HStack>
                <HStack space={'xs'} className={'items-center'}>
                    <Icon as={BoxIcon} size={'sm'} style={baseStyles.iconOpacity}/>
                    <Text>32 remaining</Text>
                </HStack>
            </HStack>

            {/* Stock */}
            {/*}
            <VStack>
                <HStack className={'flex justify-between'}>
                    <HStack space={'xs'} className={'items-center'}>
                        <Icon as={Package} size={'sm'} style={baseStyles.iconOpacity}/>
                        <Text>{'45 Remaining'}</Text>
                    </HStack>

                    <Text>{'Runs out: Jun 18'}</Text>
                </HStack>

                <Progress value={45}>
                    <ProgressFilledTrack style={{ backgroundColor: '#a1a1a1'}} />
                </Progress>

            </VStack>
            */}

            {/* Notes */}
            <VStack>
                <Text bold={true}>{'Notes'}</Text>
                <Text>{'This will be the description and it should stretch a specified column width for example in this code 2 columns'}</Text>
            </VStack>

            <Divider />

            {/* Doses */}
            <VStack space={'sm'}>
                <HStack className={'flex flex-row justify-between'} style={[styles.padding]}>
                    <HStack space={'xs'} className={'items-center'}>
                        <Icon as={Clock} size={'sm'} style={baseStyles.iconOpacity}/>
                        <Text>{'8:00 AM'}</Text>
                        <Badge size={"sm"} action={"error"}>
                            <BadgeIcon>
                                <Icon as={TriangleAlert} />
                            </BadgeIcon>
                            <BadgeText>Overdue</BadgeText>
                        </Badge>
                    </HStack>
                    <HStack space={'md'}>
                        <Button variant={'outline'} size={'sm'}>
                            <ButtonIcon as={SkipForward}/>
                            <ButtonText size={'md'}>
                                Skip
                            </ButtonText>
                        </Button>
                        <Button size={'sm'}>
                            <ButtonIcon as={Check}/>
                            <ButtonText size={'md'}>
                                Take
                            </ButtonText>
                        </Button>
                    </HStack>
                </HStack>
                <HStack className={'flex justify-between'} style={styles.padding}>
                    <HStack space={'xs'} className={'items-center'}>
                        <Icon as={Clock} size={'sm'} style={baseStyles.iconOpacity}/>
                        <Text>{'12:00 PM'}</Text>
                        <Badge size={"sm"}>
                            <BadgeIcon>
                                <Icon as={SkipForward} />
                            </BadgeIcon>
                            <BadgeText>Skipped 4:02 PM</BadgeText>
                        </Badge>
                    </HStack>
                    <Button variant={'link'}>
                        <ButtonIcon as={Undo}/>
                        <ButtonText>
                            Undo
                        </ButtonText>
                    </Button>
                </HStack>
                <HStack className={'flex justify-between'} style={styles.padding}>
                    <HStack space={'xs'} className={'items-center'}>
                        <Icon as={Clock} size={'sm'} style={baseStyles.iconOpacity}/>
                        <Text>{'4:00 PM'}</Text>
                        <Badge action={"success"} size={"sm"}>
                            <BadgeIcon>
                                <Icon as={Check} />
                            </BadgeIcon>
                            <BadgeText>Taken 4:02 PM</BadgeText>
                        </Badge>
                    </HStack>
                    <Button variant={'link'}>
                        <ButtonIcon as={Undo}/>
                        <ButtonText>
                            Undo
                        </ButtonText>
                    </Button>
                </HStack>
                <HStack className={'flex justify-between'} style={styles.padding}>
                    <HStack space={'xs'} className={'items-center'}>
                        <Icon as={AlarmClock} size={'sm'} style={baseStyles.iconOpacity}/>
                        <Text>{'8:00 PM'}</Text>
                        <Badge action={"info"} size={"sm"}>
                            <BadgeIcon>
                                <Icon as={Info} />
                            </BadgeIcon>
                            <BadgeText>in 32m</BadgeText>
                        </Badge>
                    </HStack>
                    <HStack space={'md'}>
                        <Button variant={'outline'} size={'sm'}>
                            <ButtonIcon as={SkipForward}/>
                            <ButtonText size={'md'}>
                                Skip
                            </ButtonText>
                        </Button>
                        <Button size={'sm'}>
                            <ButtonIcon as={Check}/>
                            <ButtonText size={'md'}>
                                Take
                            </ButtonText>
                        </Button>
                    </HStack>
                </HStack>
            </VStack>

        </Card>
    )
}

const styles = StyleSheet.create({
    overdueBg: {
        backgroundColor: '#ffe8e5',
        borderRadius: 8,
    },
    skippedBg: {
        backgroundColor: 'lightgrey'
    },
    takenBg: {
        backgroundColor: 'lightgreen'
    },
    upcomingBg: {
        backgroundColor: 'lightblue'
    },
    padding: {
        padding: 4
    },
    colorLabel: {
        color: '#3471fa'
    }
})
