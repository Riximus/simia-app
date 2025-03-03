import { useState } from 'react';
import { useRouter } from 'expo-router';
import { VStack } from '@/components/ui/vstack';
import {Input, InputField} from '@/components/ui/input';
import {Button, ButtonSpinner, ButtonText} from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { supabase } from '@/utils/supabase';
import { Alert } from 'react-native';

export default function SignupScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSignUp = async () => {
        setLoading(true);
        const { error } = await supabase.auth.signUp({ email, password });
        setLoading(false);

        if (error) {
            Alert.alert('Error', error.message);
        } else {
            Alert.alert(
                'Check Your Email',
                'A confirmation link has been sent to your email. Verify your account before logging in.'
            );
            router.replace('/login'); // Redirect user to login page
        }
    };

    return (
        <VStack space="md">
            <Input>
                <InputField placeholder="Email" onChangeText={setEmail} value={email} />
            </Input>
            <Input>
                <InputField placeholder="Password" type="password" onChangeText={setPassword} value={password} />
            </Input>
            <Button onPress={handleSignUp}>
                {loading ?
                <>
                    <ButtonSpinner />
                    <ButtonText>Please wait...</ButtonText>
                </>
                    :
                <ButtonText>Sign Up</ButtonText>
                }
            </Button>
            <Button variant="link" onPress={() => router.push('/login')} >
                <ButtonText>Already have an account? Login here.</ButtonText>
            </Button>
        </VStack>
    );
}
