import {HStack} from "@/components/ui/hstack";
import {Input, InputField, InputIcon, InputSlot} from "@/components/ui/input";
import {AlarmClockPlusIcon, ClockIcon, PlusIcon, Trash2Icon} from "lucide-react-native";
import {Button, ButtonIcon, ButtonText} from "@/components/ui/button";
import {TimerPickerModal} from "react-native-timer-picker";
import {LinearGradient} from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import {TimePickerFieldProps} from "@/types/time-picker-field";
import {Pressable} from "react-native";
import {Text} from "@/components/ui/text";
import {CloseIcon, Icon} from "@/components/ui/icon";
import {baseStyles} from "@/styles/base";

export function TimePickerField(props: TimePickerFieldProps) {
    return <HStack space={"xs"} className={"items-center"}>
        <Pressable onPress={props.onPress} className={"flex-row flex-1 gap-3 items-center border border-gray-300 p-2 rounded-lg"}>
            <Icon size={'xl'} as={AlarmClockPlusIcon} style={baseStyles.iconOpacity}/>
            <Text size={'xl'}>{props.alarmString || "No time set"}</Text>
        </Pressable>
        {
            props.onDelete ?
                <Button variant={'link'} className={"rounded-full p-2.5"} onPress={props.onDelete}>
                    <ButtonIcon as={CloseIcon} style={baseStyles.iconOpacity}/>
                </Button>
                : null
        }
        <TimerPickerModal
            modalTitle="Set Alarm"
            LinearGradient={LinearGradient}
            Haptics={Haptics}
            onConfirm={props.onConfirm}
            setIsVisible={props.isVisible}
            visible={props.visible}
            onCancel={props.onCancel}
            hideSeconds={true}
            minuteInterval={5}
        />
    </HStack>;
}
