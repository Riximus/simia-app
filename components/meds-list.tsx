import {Card} from "@/components/ui/card";
import {Text} from "@/components/ui/text";
import {FontAwesome, Ionicons} from "@expo/vector-icons";
import {HStack} from "@/components/ui/hstack";
import {Box} from "@/components/ui/box";
import {Heading} from "@/components/ui/heading";
import {baseStyles} from "@/styles/base";
import {Button, ButtonIcon, ButtonText} from "@/components/ui/button";
import {AlarmClock, BoxIcon, Check, Circle, SkipForward, TriangleAlert, Utensils} from "lucide-react-native";
import {VStack} from "@/components/ui/vstack";
import {Icon} from "@/components/ui/icon";
import {Badge, BadgeIcon, BadgeText} from "@/components/custom/badge";
import {StyleSheet} from "react-native";

export default function MedsList() {
    return (
        <Card size={"sm"}>
            <HStack className={'items-center justify-between'}>
                <HStack space={'md'} className={'items-center'}>
                    <FontAwesome name={"circle"} color={"#3471fa"}/>
                    <VStack space={'xs'}>
                        <HStack space={'xs'} className={'items-center'}>
                            <Heading bold={true}>Elvanse</Heading>
                            <Badge action={'warning'} variant={'solid'} size={'sm'}>
                                <BadgeIcon>
                                    <Icon as={TriangleAlert} size={'xs'} style={baseStyles.iconOpacity}/>
                                </BadgeIcon>
                                <BadgeText>{'Next dose: 32m'}</BadgeText>
                            </Badge>
                        </HStack>
                        <HStack space={'xs'} className={'items-center'}>
                            <Icon as={Utensils} size={'sm'} style={baseStyles.iconOpacity}/>
                            <Text>During meal</Text>
                        </HStack>
                    </VStack>
                </HStack>
                <HStack className={'items-center'}>
                    <FontAwesome name={"circle"} color={"#f12121"}/>
                    <FontAwesome name={"circle"} color={"#919191"}/>
                    <FontAwesome name={"circle"} color={"#4de818"}/>
                    <FontAwesome name={"circle"} color={"#ffffff"} style={styles.iconBorder}/>
                    {/*}
                    <Ionicons name={"close-circle"} size={16} color={"#d51e1e"}/>
                    <Ionicons name={"play-skip-forward-circle"} size={16} color={"#858585"}/>
                    <Ionicons name={"checkmark-circle"} size={16} color={"#36d51e"}/>
                    <Icon as={Circle} size={'sm'} />
                    */}
                </HStack>
                <HStack space={'md'}>
                    <Button variant={'outline'} size={'sm'}>
                        <ButtonIcon as={SkipForward}/>
                    </Button>
                    <Button size={'sm'}>
                        <ButtonIcon as={Check}/>
                    </Button>
                </HStack>
            </HStack>
        </Card>
    )
}

const styles = StyleSheet.create({
  iconBorder: {
    borderWidth: 1,
    borderColor: '#000'
  }
})
