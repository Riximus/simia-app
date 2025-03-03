import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { supabase } from '@/utils/supabase';
import { Spinner } from '@/components/ui/spinner';
import { VStack } from '@/components/ui/vstack';

export default function Index() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const { data } = await supabase.auth.getSession();
            if (data.session) {
                router.replace('/(protected)/(tabs)/home'); // If logged in, go to HomeScreen
            } else {
                router.replace('/(auth)/login'); // If not logged in, go to LoginScreen
            }
            setLoading(false);
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

    return null; // Empty return since user is redirected
}
