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


    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.replace('/login'); // Redirect to login after logout
    };

    return (
        <VStack>
            <Text>Welcome, User Email!</Text>
            <Button>
                <ButtonText>Logout</ButtonText>
            </Button>
        </VStack>
    );
}
