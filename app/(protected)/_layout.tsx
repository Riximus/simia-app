import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase';
import {VStack} from '@/components/ui/vstack';
import {Spinner} from '@/components/ui/spinner';

export default function ProtectedLayout() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const { data } = await supabase.auth.getSession();
            if (!data.session) {
                router.replace('/(auth)/login'); // Redirect to login if not authenticated
            } else {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    if (loading) {
        return (
            <VStack>
                <Spinner size="large" />
            </VStack>
        );
    }

    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)"/>
        </Stack>
    );
}
