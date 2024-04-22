
"use client";

import * as z from 'zod';
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod'
import { Textarea } from "@/components/ui/textarea"
import { usePathname, useRouter } from 'next/navigation';

// import { updateUser } from '@/lib/actions/user.actions';
import { ThreadValidation } from '@/lib/validations/thread';

type props = {
    user: {
        id: string;
        objectId: string;
        username: string;
        name: string;
        bio: string;
        image: string;
    };
    btnTitle: string
}

function PostThread({ userId }: { userId: string }) {
    const router = useRouter();
    const pathname = usePathname();

    const defaultValues = {
        thread: '',
        accountId: userId,
    };

    const onSubmit = async () => {

    }

    const form = useForm({
        resolver: zodResolver(ThreadValidation),
        defaultValues,
    });


    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col justify-start gap-7 mt-10"
            >
                <FormField
                    control={form.control}
                    name="thread"
                    render={({ field }) => (
                        <FormItem className='flex flex-col gap-3 w-full'>
                            <FormLabel className='capitalize text-base-semibold text-light-2 pl-1.5'>
                                content
                            </FormLabel>
                            <FormControl className='no-foucs border border-dark-4 bg-dark-3 text-light-1'>
                                <Textarea
                                    rows={15}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type='submit' className='bg-primary-500 capitalize'>
                    post thread
                </Button>

            </form>
        </Form>
    )
};

export default PostThread;