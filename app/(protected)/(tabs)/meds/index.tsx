import { View, StyleSheet } from 'react-native';
import {VStack} from "@/components/ui/vstack";
import {Heading} from "@/components/ui/heading";
import {HStack} from "@/components/ui/hstack";
import {Text} from "@/components/ui/text";
import {Button, ButtonIcon, ButtonText} from "@/components/ui/button";
import {ChevronLeftIcon, ChevronRightIcon, CalendarDaysIcon, Icon} from '@/components/ui/icon';
import {Card} from "@/components/ui/card";
import MedsCard from '@/components/meds-card';
import { Pill, EllipsisVertical } from "lucide-react-native"
import MedsList from "@/components/meds-list";

export default function Tab() {
    return (
        <View className={"mt-3 mx-3"}>
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

                <MedsCard />

                <MedsList />

            </VStack>
        </View>
    );
};

const styles = StyleSheet.create({
    textColor: {
        color: 'red'
    }
});
