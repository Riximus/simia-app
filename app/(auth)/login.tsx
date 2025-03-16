import { useState } from 'react';
import { useRouter } from 'expo-router';
import { VStack } from '@/components/ui/vstack';
import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import {Input, InputField} from '@/components/ui/input';
import { supabase } from '@/utils/supabase';
import { Alert } from 'react-native';

export default function LoginScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setLoading(true);
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        setLoading(false);

        if (error) {
            Alert.alert('Error', error.message);
        } else if (data.session) {
            router.replace('/(protected)/(tabs)/meds'); // Redirect to home after login
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
            <Button onPress={handleLogin}>
                {loading ?
                <>
                    <ButtonSpinner />
                    <ButtonText>Please wait...</ButtonText>
                </>
                    :
                <ButtonText>Login</ButtonText>
                }
            </Button>
            <Button variant="outline" onPress={() => supabase.auth.signInWithOAuth({ provider: 'google' })}>
                <ButtonText>Sign in with Google</ButtonText>
            </Button>
            <Button variant="link" onPress={() => router.push('/signup')}>
                <ButtonText>No account yet? Sign up here.</ButtonText>
            </Button>

        </VStack>
    );
}
