import { ReactNode } from "react"
import Image from "next/image"

const MainLayout = ({ children }: { children: ReactNode }) => {

    return (
        <>
            <Image src={'/backgroud1.webp'} width={1920} height={1080} alt="background" className="absolute w-full min-h-screen object-cover " />
            <div className=" absolute  flex md:flex-row flex-col inset-0 bg-gradient-to-r from-black/70 bg-cover bg-no-repeat bg-fixed filter transition-opacity ">
                <div className="hidden md:block md:w-1/2 lg:w-2/3 ">
                    <div className=" text-white font-[family-name:var(--font-poiret-one)] flex flex-col justify-end  h-screen px-10 pb-32 ">
                        <h1 className="text-6xl mb-5 ">Don&apos;t have an <span className="text-amber-400 font-bold">account?</span> </h1>
                        <p>Register now to unlock all the features of the app.</p>
                        <p>Explore countries, add notes about your experiences, and keep track of the people you meet.</p>
                    </div>
                </div>
                <div className="w-full md:w-1/2 lg:w-1/3 backdrop-blur-md bg-gray-950/20 px-10  " style={{
                    boxShadow: "rgba(0, 0, 0, 0.20) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px"
                }}>
                    <div className="flex flex-col justify-center  h-screen items-center ">
                        <h1 className="text-center text-3xl font-[family-name:var(--font-poiret-one)]  text-white ">Welcome to <span className="font-bold">World<span className="text-amber-400 ">sx</span>Map</span>  </h1>
                        {children}
                    </div>
                </div>
            </div>
        </>

    )
}


export default MainLayout