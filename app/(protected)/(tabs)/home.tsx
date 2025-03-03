import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { VStack } from '@/components/ui/vstack';
import {Button, ButtonText} from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import { supabase } from '@/utils/supabase';
import { User } from '@supabase/supabase-js';

export default function HomeScreen() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const checkUser = async () => {
            try {
                const { data, error } = await supabase.auth.getUser();
                if (error) {
                    // TODO: add this to a logging service
                    console.error('Failed to get user:', error);
                }
                if (!data.user) {
                    router.replace('/login');
                } else {
                    setUser(data.user);
                }
            } catch (err) {
                // TODO: add this to a logging service
                console.error('Unexpected error:', err);
            } finally {
                setLoading(false);
            }
        };
        checkUser();
    }, []);


    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.replace('/login'); // Redirect to login after logout
    };

    if (loading) return <Spinner size="large" />;

    return (
        <VStack>
            <Text>Welcome, {user?.email}!</Text>
            <Button onPress={handleLogout}>
                <ButtonText>Logout</ButtonText>
            </Button>
        </VStack>
    );
}
