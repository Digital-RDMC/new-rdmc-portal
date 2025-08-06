'use client';

import { Separator } from '@/components/ui/separator';
import { useTranslation } from "react-i18next";
import Pillares from './(components)/pillares';
import PortalQr from './(components)/PortalQr';
import HomePageSlider from './(components)/HomePageSlider';

export default function HomePage() {
   const { t } = useTranslation()
  return (
    <div>
      <div
        className="flex flex-col justify-center items-start"
        style={{
          backgroundImage: 'url(/images/gl33.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '20rem',
          width: '100%',
        }}
      >
        <h2 className="w-full max-w-7xl h-14 mx-12 text-2xl font-bold text-white flex flex-row items-center">
          {' '}
          <Separator
            className="bg-gray-300 w-1  mx-5"
            orientation="vertical"
          />{' '}
          <span>
            {t('homepage.HOME')} <span className="font-light ms-1">{t('homepage.PAGE')}</span>{' '}
          </span>
        </h2>
      </div>

      <Pillares className="bg-gray-100 dark:bg-gray-800 pb-10" />

      <div className="flex flex-col md:flex-row justify-center items-center max-w-6xl mx-auto">
        <div className="flex-1 p-5 max-w-[550px]">
          <h2 className="text-xl font-bold ">{t('homepage.AboutPortal')}</h2>
          <Separator className="my-5" />
          <p>
          {t('homepage.TheRDMCPortalisa')}
          </p>
          <div className="w-40 h-40 m-5">
            <PortalQr />
          </div>
        </div>

        <div className="flex-1 mx-auto justify-center items-center">
          <HomePageSlider />
        </div>
      </div>
    </div>
  );
}
