"use client";

import Image from 'next/image';
import { ChangeEvent, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod'
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
import { UserValidation } from '@/lib/validations/user';

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { isBase64Image } from '@/lib/utils';
import { useUploadThing } from '@/lib/uploadthing'
import { updateUser } from '@/lib/actions/user.actions';
import { usePathname, useRouter } from 'next/navigation';

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

const AccountProfile = ({ user, btnTitle }: props) => {
    const [files, setFiles] = useState<File[]>([]);
    const {startUpload} = useUploadThing("media");
    const router = useRouter();
    const pathname = usePathname();

    const defaultValues = {
        profile_photo: user?.image || '',
        name: user?.name || '',
        username: user?.username || '',
        bio: user?.bio || ''
    }

    const handleImage = (e: ChangeEvent<HTMLInputElement>, fieldChange: (value: string) => void) => {
        e.preventDefault();

        const fileReader = new FileReader();

        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0]

            setFiles(Array.from(e.target.files));

            if (!file.type.includes('image')) return;

            fileReader.onload = async (e) => {
                const imageDataUrl = e.target?.result?.toString() || '';
                fieldChange(imageDataUrl);
            }

            fileReader.readAsDataURL(file);
        }
    }

    const onSubmit = async (values: z.infer<typeof UserValidation>) => {
        const blob = values.profile_photo;

        const hasImageChanged = isBase64Image(blob);

        if (hasImageChanged) {
            const imgRes = await startUpload(files);
            
            if(imgRes && imgRes[0].url) {
                values.profile_photo = imgRes[0].url;
            }
        }

        await updateUser({
            userId: user.id,
            username: values.username,
            name: values.name,
            bio: values.bio,
            image: values.profile_photo,
            path: pathname
        });

        if(pathname === '/profile/edit') {
            router.back();
        } else {
            router.push('/');
        }
    };

    const form = useForm({
        resolver: zodResolver(UserValidation),
        defaultValues,
    });

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col justify-start gap-7"
            >
                <FormField
                    control={form.control}
                    name="profile_photo"
                    render={({ field }) => (
                        <FormItem className='flex items-center gap-4'>
                            <FormLabel className='account-form_image-label'>
                                {field.value ? (
                                    <Image
                                        src={field.value}
                                        alt='profile photo'
                                        width={96}
                                        height={96}
                                        priority
                                        className='rounded-full object-contain'
                                    />
                                ) : (
                                    <Image
                                        src='/assets/profile.svg'
                                        alt='profile photo'
                                        width={24}
                                        height={24}
                                        className='object-contain mt-2'
                                    />
                                )}
                            </FormLabel>
                            <FormControl className='flex-1 text-base-semibold text-gray-200'>
                                <Input
                                    type='file'
                                    accept='image/*'
                                    placeholder='Upload a photo'
                                    className='account-form_image-input'
                                    onChange={e => handleImage(e, field.onChange)}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem className='flex flex-col gap-3 w-full'>
                            <FormLabel className='capitalize text-base-semibold text-light-2 pl-1.5'>
                                name
                            </FormLabel>
                            <FormControl>
                                <Input
                                    type='text'
                                    className='account-form_input no-foucs'
                                    {...field}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem className='flex flex-col gap-3 w-full'>
                            <FormLabel className='capitalize text-base-semibold text-light-2 pl-1.5'>
                                username
                            </FormLabel>
                            <FormControl>
                                <Input
                                    type='text'
                                    className='account-form_input no-foucs'
                                    {...field}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                        <FormItem className='flex flex-col gap-3 w-full'>
                            <FormLabel className='capitalize text-base-semibold text-light-2 pl-1.5'>
                                bio
                            </FormLabel>
                            <FormControl>
                                <Textarea
                                    rows={10}
                                    className='account-form_input no-foucs'
                                    {...field}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <Button type="submit">Submit</Button>
            </form>
        </Form>
    )
}

export default AccountProfile;