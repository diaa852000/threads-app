import { OrganizationSwitcher, SignOutButton, SignedIn, auth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

export default async function Topbar() {
    const { userId } = auth();
    if (!userId) {
        return <div>nooooooooo</div>
    }

    return (
        <nav className="topbar">
            <Link href='/' className="flex items-center gap-4">
                <Image
                    src={'assets/logo.svg'}
                    alt="logo"
                    width={28}
                    height={28}
                />
                <p className="text-heading3-bold text-light-1 max-xs:hidden">Threads</p>
            </Link>

            <div className="flex items-center gap-1">
                <div className="block md:hidden">
                    <SignedIn>
                        <SignOutButton>
                            <div className="flex cursor-pointer">
                                <Image
                                    src={'/assets/logout.svg'}
                                    alt="logout"
                                    width={24}
                                    height={24}
                                />
                            </div>
                        </SignOutButton>
                    </SignedIn>
                </div>
                <div className="bg-red-50">
                    <OrganizationSwitcher
                        appearance={{
                            elements: {
                                organizationSwitcherTrigger: "py-2 px-4 bg-dark-2 rounded-none hover:bg-dark-3 text-white"
                            }
                        }}
                    />
                </div>
            </div>
        </nav>
    )
}
