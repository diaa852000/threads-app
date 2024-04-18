import { AccountProfile } from "@/components/index";
import { currentUser } from "@clerk/nextjs";

async function Page() {
    const user = await currentUser();
    //todo => make it type
    const userInfo = {};

    const userData = {
        id: user?.id,
        userId: userInfo?._id,
        username: userInfo?.username || user?.username,
        name: userInfo?.name || user?.firstName || "",
        bio: userInfo?.bio || "",
        image: userInfo?.image || user?.imageUrl
    }

    return (
        <main className="max-w-3xl mx-auto flex flex-col justify-start px-10 py-20">
            <h1 className="head-text">Onboarding</h1>
            <p className="mt-3 text-base-regular text-light-2">
                Complete your profile no to use Threads
            </p>
            <section className="mt-9 bg-dark-2 p-10 rounded">
                <AccountProfile 
                    user={userData}
                    btnTitle="Continue"
                />
            </section>
        </main>
    )
}

export default Page;