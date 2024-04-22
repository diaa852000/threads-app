import PostThread from "@/components/forms/PostThread";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

async function CreateThread() {
    const user = await currentUser();

    if(!user) return null;

    const userInfo = await fetchUser(user.id);

    !userInfo?.onboarded && redirect('/onboarding');

    return (
        <>
            <h1 className="head-text capitalize">create thread</h1>
            <PostThread userId={userInfo._id}/>
        </>
    )
};


export default CreateThread;