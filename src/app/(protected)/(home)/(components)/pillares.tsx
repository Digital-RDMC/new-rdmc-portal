import ExcellenceIcon from './ExcellenceIcon';
import OneTeam from './OneTeam';
import Socity from './Socity';
import WeCare from './WeCare';
import { useTranslation } from "react-i18next";
export default function PillaresPage({ className }: { className?: string }) {
  const { t } = useTranslation()
  const pillares = [
    { title: t('homepage.OneTeam'), icon: OneTeam, color: 'text-gray-500' },
    { title: t('homepage.Excellence'), icon: ExcellenceIcon, color: 'text-red-500' },
    { title: t('homepage.Socity'), icon: Socity, color: 'text-socity' },
    { title: t('homepage.Wecare'), icon: WeCare, color: 'text-green-500' },
  ];
  return (
    <div
      className={`grid grid-cols-2 md:grid-cols-4 items-center gap-4   w-full  justify-center  ${className}`}
    >
      {pillares.map((item, index) => (
        <div
          key={index}
          className={`flex-1 flex-col justify-center py-5 items-center ${item.color}`}
        >
          <div className="w-[80px] h-[80px] mx-auto items-center justify-center text-center">
            <item.icon className={`${item.color}`} />
            <h3 className="font-bold">{item.title}</h3>
          </div>
        </div>
      ))}
    </div>
  );
}


