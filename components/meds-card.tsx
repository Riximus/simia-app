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
    SkipForward, CircleCheckBig, CircleCheck, Hourglass
} from "lucide-react-native";
import {baseStyles} from "@/styles/base";
import {FontAwesome} from "@expo/vector-icons";
import {VStack} from "@/components/ui/vstack";
import {Box} from "@/components/ui/box";
import {Progress, ProgressFilledTrack} from "@/components/custom/progress";
import {Button, ButtonText} from "@/components/ui/button";

export default function MedsCard() {
    return (
        <Card size={"lg"} className={'flex gap-4'}>
            {/* Header */}
            <VStack>
                <HStack space={'sm'} className={'items-center'}>
                    <Icon size={'md'} as={Pill} style={baseStyles.iconOpacity} />
                    <Heading size={'2xl'}>{'Elvanse'}</Heading>
                    <Badge action={'warning'} variant={'solid'} size={'md'}>
                        <BadgeIcon>
                            <Icon as={TriangleAlert} size={'xs'} style={baseStyles.iconOpacity}/>
                        </BadgeIcon>
                        <BadgeText>{'1h 32m'}</BadgeText>
                    </Badge>
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
            <VStack>
                <HStack space={'xs'} className={'items-center'}>
                    <Icon as={AlarmClock} size={'sm'} style={baseStyles.iconOpacity}/>
                    {/* TODO: Or 'Mar 5 at 11:00 AM' when everything was taken */}
                    <Text size={'xl'} bold={true}>{'11:00 AM'}</Text>
                </HStack>
                <HStack space={'xs'} className={'items-center'}>
                    <Icon as={Utensils} size={'sm'} style={baseStyles.iconOpacity}/>
                    <Text size={'xl'}>During meal</Text>
                </HStack>
            </VStack>

            {/* Stock */}
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

            {/* Notes */}
            <VStack>
                <Text bold={true}>{'Notes'}</Text>
                <Text>{'This will be the description and it should stretch a specified column width for example in this code 2 columns'}</Text>
            </VStack>

            {/* Doses */}
            <VStack space={'md'}>
                <HStack className={'flex flex-row justify-between'} style={[styles.overdueBg ,styles.padding]}>
                    <HStack space={'xs'} className={'items-center'}>
                        <Icon as={TriangleAlert} size={'sm'} style={baseStyles.iconOpacity}/>
                        <Text>{'8:00 AM'}</Text>
                        <Text size={"2xs"}>{'• 20m overdue'}</Text>
                    </HStack>
                    <HStack space={'md'}>
                        <Button variant={'outline'}>
                            <ButtonText>
                                Skip
                            </ButtonText>
                        </Button>
                        <Button>
                            <ButtonText>
                                Take
                            </ButtonText>
                        </Button>
                    </HStack>
                </HStack>
                <HStack className={'flex justify-between'} style={styles.padding}>
                    <HStack space={'xs'} className={'items-center'}>
                        <Icon as={SkipForward} size={'sm'} style={baseStyles.iconOpacity}/>
                        <Text>{'12:00 PM'}</Text>
                    </HStack>
                    <HStack space={'md'}>
                        <Badge size={"lg"}>
                            <BadgeText>Skipped</BadgeText>
                        </Badge>
                    </HStack>
                </HStack>
                <HStack className={'flex justify-between'} style={styles.padding}>
                    <HStack space={'xs'} className={'items-center'}>
                        <Icon as={CircleCheckBig} size={'sm'} style={baseStyles.iconOpacity}/>
                        <Text>{'4:00 PM'}</Text>
                    </HStack>
                    <HStack space={'md'}>
                        <Badge action={"success"} size={"lg"}>
                            <BadgeText>Taken</BadgeText>
                        </Badge>
                    </HStack>
                </HStack>
                <HStack className={'flex justify-between'} style={styles.padding}>
                    <HStack space={'xs'} className={'items-center'}>
                        <Icon as={Clock} size={'sm'} style={baseStyles.iconOpacity}/>
                        <Text>{'8:00 PM'}</Text>
                        <Text size={"2xs"}>{'• in 20m'}</Text>
                    </HStack>
                    <HStack space={'md'}>
                        <Button variant={'outline'}>
                            <ButtonText>
                                Skip
                            </ButtonText>
                        </Button>
                        <Button>
                            <ButtonText>
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
    }
})
