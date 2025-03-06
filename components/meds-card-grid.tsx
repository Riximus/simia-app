import Grid from "@/components/custom/grid";
import {Text} from "@/components/ui/text";
import {HStack} from "@/components/ui/hstack";
import {Icon} from "@/components/ui/icon";
import {Clock, EllipsisVertical, Pill} from "lucide-react-native";
import {Heading} from "@/components/ui/heading";
import {Button, ButtonIcon} from "@/components/ui/button";
import {Card} from "@/components/ui/card";
import { Divider } from '@/components/ui/divider';
import {StyleSheet} from "react-native";

export default function MedsCardGrid() {
    return (
            <Card size={"lg"} >
                <HStack className="flex items-center justify-between">
                    <HStack>
                        <Icon as={Pill}/>
                        <Heading>Elvanse</Heading>
                    </HStack>
                    <Button variant="link">
                        <ButtonIcon as={EllipsisVertical}/>
                    </Button>
                </HStack>

                <Grid columns={2} gap={8}>
                    {/* Row 1 */}
                    <Grid.Item>
                        <Text bold={true}> <Icon as={Clock} size={"xs"}/> Next dose</Text>
                        <Text>9:00</Text>
                        <Text size={"sm"} style={styles.textColor}>1h 22m until next dose</Text>
                    </Grid.Item>
                    <Grid.Item>
                        <Text bold={true}>Remaining</Text>
                        <Text>30 left</Text>
                        <Text size={"sm"} style={styles.textOpacity}>Runs out Mar 19</Text>
                    </Grid.Item>

                    {/* Row 2 */}
                    <Grid.Item>
                        <Text bold={true}>Interval</Text>
                        <Text>Daily</Text>
                    </Grid.Item>
                    <Grid.Item>
                        <Text bold={true}>Last taken</Text>
                        <Text>about 16 hours ago</Text>
                    </Grid.Item>

                    {/* Row 3 */}
                    <Grid.Item>
                        <Text bold={true}>Instructions</Text>
                        <Text>During meal</Text>
                    </Grid.Item>

                    {/* Row 4 */}
                    <Grid.Item colSpan={2}>
                        <Text bold={true}>Notes</Text>
                        <Text>This will be the description and it should stretch a specified column width for example in this code 2 columns</Text>
                    </Grid.Item>
                </Grid>

                <Divider />

                    <Grid style={styles.gridBackground} columns={3} gap={8}>
                        <Grid.Item>
                            <Text>8:00</Text>
                        </Grid.Item>
                    </Grid>
            </Card>
    )
}

const styles = StyleSheet.create({
    textColor: {
        color: 'red'
    },
    textOpacity: {
        opacity: 0.6
    },
    gridBackground: {
        backgroundColor: 'red'
    }
});
