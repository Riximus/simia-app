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
                    <Button size={'xl'} className={'rounded-xl'} variant={'outline'}>
                        <ButtonIcon as={ChevronLeftIcon}/>
                    </Button>
                    <Button size={'xl'} className={'rounded-xl'}>
                        <ButtonIcon as={CalendarDaysIcon}/>
                        <ButtonText>March 3 2025</ButtonText>
                    </Button>
                    <Button size={'xl'} className={'rounded-xl'} variant={'outline'}>
                        <ButtonIcon as={ChevronRightIcon}/>
                    </Button>
                </HStack>

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
        marginBottom: 105,
        borderRadius: 8
    }
});
