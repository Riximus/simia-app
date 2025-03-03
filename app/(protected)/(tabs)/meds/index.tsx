import { View, StyleSheet } from 'react-native';
import {VStack} from "@/components/ui/vstack";
import {Heading} from "@/components/ui/heading";
import {HStack} from "@/components/ui/hstack";
import {Text} from "@/components/ui/text";
import {Button, ButtonIcon, ButtonText} from "@/components/ui/button";
import {ChevronLeftIcon, ChevronRightIcon, CalendarDaysIcon, Icon} from '@/components/ui/icon';
import {Card} from "@/components/ui/card";
import { Pill, EllipsisVertical } from "lucide-react-native"

export default function Tab() {
    return (
        <>
        <View>
            <VStack>
                {/* Medication View Options */}
                <HStack className="flex justify-between">
                    <HStack>
                        <Button>
                            <ButtonText>Card</ButtonText>
                        </Button>
                        <Button>
                            <ButtonText>List</ButtonText>
                        </Button>
                        <Button>
                            <ButtonText>Timeline</ButtonText>
                        </Button>
                    </HStack>

                    {/* Add Medication Button */}
                    <HStack>
                        <Button>
                            <ButtonText>Add Medication</ButtonText>
                        </Button>
                    </HStack>
                </HStack>

                {/* Calendar View */}
                <HStack className="flex justify-between">
                    <Button>
                        <ButtonIcon as={ChevronLeftIcon}/>
                    </Button>
                    <Button>
                        <ButtonIcon as={CalendarDaysIcon}/>
                        <ButtonText>Calendar Day March 3</ButtonText>
                    </Button>
                    <Button>
                        <ButtonIcon as={ChevronRightIcon}/>
                    </Button>
                </HStack>
                <Button>
                    <ButtonText>Today</ButtonText>
                </Button>

                {/* Medication List */}
                {/* "No Medication" Card */}
                <Card size="lg">
                    <Text className="text-center">
                        No medications scheduled for this day
                    </Text>
                </Card>

                {/* Medication Card */}
                {/* TODO: Do a Grid instead */}
                <Card size="lg">
                    <HStack className="flex items-center justify-between">
                        <HStack>
                            <Icon as={Pill}/>
                            <Heading>Elvanse</Heading>
                        </HStack>
                        <Button variant="link">
                            <ButtonIcon as={EllipsisVertical} />
                        </Button>
                    </HStack>
                    <HStack className="flex">
                        <VStack className="grow">
                            <Text bold={true}>Next dose</Text>
                            <Text>9:00</Text>
                            <Text size="sm" style={styles.textColor}>1h 22m until next dose</Text>
                        </VStack>
                        <VStack className="grow">
                            <Text>10:00 AM</Text>
                            <Text>Take 1 capsule</Text>
                        </VStack>
                    </HStack>
                </Card>
            </VStack>
        </View>
        </>
    );
};

const styles = StyleSheet.create({
    textColor: {
        color: 'red'
    }
});
