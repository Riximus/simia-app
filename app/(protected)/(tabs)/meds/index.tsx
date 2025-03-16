import {View, StyleSheet, ScrollView} from 'react-native';
import {VStack} from "@/components/ui/vstack";
import {Heading} from "@/components/ui/heading";
import {HStack} from "@/components/ui/hstack";
import {Text} from "@/components/ui/text";
import {Button, ButtonGroup, ButtonIcon, ButtonText} from "@/components/ui/button";
import {ChevronLeftIcon, ChevronRightIcon, CalendarDaysIcon, Icon} from '@/components/ui/icon';
import {Card} from "@/components/ui/card";
import MedsCard from '@/components/meds-card';
import {Pill, EllipsisVertical, Grid2x2, List} from "lucide-react-native"
import { Switch } from "@/components/ui/switch";
import MedsList from "@/components/meds-list";
import {useState} from "react";
import {baseStyles} from "@/styles/base";

export default function Tab() {
    const [isCardView, setIsCardView] = useState(true);

    const toggleView = (view: boolean) => {
        setIsCardView(view);
    }

    return (
        <View className={"mt-2 mx-2"}>
            <VStack space={"xs"}>
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
                {/* Medication View Options */}
                <HStack className="justify-center items-center">
                    {/*}
                    <ButtonGroup space={'xl'} flexDirection={'row'}>
                        <Button variant={isCardView ? 'outline' : 'solid'} onPress={()=>toggleView(false)}>
                            <ButtonIcon as={List}/>
                        </Button>
                        <Button variant={isCardView ? 'solid' : 'outline'} onPress={()=>toggleView(true)}>
                            <ButtonIcon as={Grid2x2}/>
                        </Button>
                    </ButtonGroup>
                    */}
                </HStack>

                {/* Medication List */}
                {/* "No Medication" Card */}
                {/*
                <Card size="lg">
                    <Text className="text-center">
                        No medications scheduled for this day
                    </Text>
                </Card>

                                {
                    isCardView ? <MedsCard /> : <MedsList />
                }
                */}

                {/* Medication Card */}
                <ScrollView style={styles.scrollView}>
                    <VStack space={"md"}>
                        <MedsCard />
                        <MedsCard />
                        <MedsCard />
                        <MedsCard />
                        <MedsCard />
                        <MedsCard />
                        <MedsCard />
                    </VStack>
                </ScrollView>

            </VStack>
        </View>
    );
};

const styles = StyleSheet.create({
    textColor: {
        color: 'red'
    },
    scrollView: {
        marginBottom: 90
    }
});
