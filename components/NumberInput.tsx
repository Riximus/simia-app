import {HStack} from "@/components/ui/hstack";
import {Input, InputField} from "@/components/ui/input";
import {Button, ButtonIcon} from "@/components/ui/button";
import {MinusIcon, PlusIcon} from "lucide-react-native";

export function NumberInput(props: { count: number, isReadOnly: boolean, onPressIncrease: () => void, onPressDecrease: () => void }) {
    return <HStack space={"xl"} className={"items-center"}>
        <Input size={"xl"} isRequired={true} isReadOnly={props.isReadOnly} className={"flex-1"}>
            <InputField >
                {props.count}
            </InputField>
        </Input>
        <Button onPress={props.onPressDecrease} size={"xl"} className={"rounded-full p-3.5"}>
            <ButtonIcon as={MinusIcon}/>
        </Button>
        <Button onPress={props.onPressIncrease} size={"xl"} className={"rounded-full p-3.5"}>
            <ButtonIcon as={PlusIcon}/>
        </Button>
    </HStack>;
}
