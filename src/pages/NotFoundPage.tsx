import { NotFoundLogoSvg } from "../assets/NotFound";

const NotFoundPage = () => {

    return (
        <div className='flex justify-center bg-[#222222] h-full w-full font-roboto min-h-screen'>
            <div className='flex flex-col items-center justify-center gap-[30px]'>
                <div className='flex flex-col gap-5'>
                    <span className='text-[50px] font-bold text-center text-white/50 leading-6 h-auto'>404</span>
                    <span className='text-[24px] font-[600] text-center text-white mt-2.5 leading-6'>
                        Page not found
                    </span>
                </div>
                <NotFoundLogoSvg />
            </div>
        </div>
    );
};

export default NotFoundPage;