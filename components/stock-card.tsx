import { Text } from '@/components/ui/text';
import {Card} from "@/components/ui/card";
import {HStack} from "@/components/ui/hstack";
import {Heading} from "@/components/ui/heading";
import {StyleSheet} from "react-native";
import {Button, ButtonIcon, ButtonText} from "@/components/ui/button";
import {
    BoxIcon,
    CalendarClockIcon,
    HourglassIcon,
    Pencil,
    PillBottleIcon,
    Plus,
    Trash2,
    TriangleAlert, TriangleAlertIcon
} from "lucide-react-native";
import {FontAwesome} from "@expo/vector-icons";
import {Icon} from "@/components/ui/icon";
import {baseStyles} from "@/styles/base";
import {VStack} from "@/components/ui/vstack";
import Grid from "@/components/custom/grid";
import {Badge, BadgeIcon, BadgeText} from "@/components/custom/badge";

export default function StockCard() {
    return (
        <Card size={'lg'} style={styles.card}>
            <HStack space={'sm'} className={'items-center justify-between'}>
                <HStack space={'sm'} className={'items-center'}>
                    <FontAwesome name={"circle"} color={"#3471fa"}/>
                    <Heading size={'2xl'}>Elvanse</Heading>
                    <Badge size={'lg'} variant={'solid'} action={'warning'}>
                        <BadgeIcon>
                            <Icon as={TriangleAlertIcon} size={'xs'} style={baseStyles.iconOpacity}/>
                        </BadgeIcon>
                        <BadgeText>Running low</BadgeText>
                    </Badge>
                </HStack>
                <Button variant="link">
                    <ButtonIcon as={Trash2} color={'red'} />
                </Button>
            </HStack>
            <Grid columns={2} gap={20}>
                <HStack className={'items-center'} space={'xs'}>
                    <Icon size={'sm'} as={BoxIcon} style={baseStyles.iconOpacity}/>
                    <Text bold={true} size={'xl'}>50</Text>
                </HStack>
                <HStack className={'items-center'} space={'xs'}>
                    <Icon size={'sm'} as={CalendarClockIcon} style={baseStyles.iconOpacity}/>
                    <Text bold={true} size={'xl'}>Mar 20</Text>
                </HStack>
                <HStack className={'items-center'} space={'xs'}>
                    <Icon size={'sm'} as={PillBottleIcon} style={baseStyles.iconOpacity}/>
                    <Text bold={true} size={'xl'}>1 per Dose</Text>
                </HStack>
                <HStack className={'items-center'} space={'xs'}>
                    <Icon size={'sm'} as={HourglassIcon} style={baseStyles.iconOpacity}/>
                    <Text bold={true} size={'xl'}>Daily</Text>
                </HStack>
            </Grid>
            <VStack>
                <Text bold={true}>{'Notes'}</Text>
                <Text>{'This will be the description and it should stretch a specified column width for example in this code 2 columns'}</Text>
            </VStack>
            <HStack space={'md'} className={'justify-end'}>
                <Button variant={'outline'}>
                    <ButtonIcon as={Pencil} />
                    <ButtonText size={'xl'}>Edit</ButtonText>
                </Button>
                <Button>
                    <ButtonIcon as={Plus} />
                    <ButtonText size={'xl'}>Restock</ButtonText>
                </Button>
            </HStack>
        </Card>
    );
}

const styles = StyleSheet.create({
    card: {
        borderLeftColor: '#ff9804',
        borderLeftWidth: 3,
        gap: 20
    }
})
