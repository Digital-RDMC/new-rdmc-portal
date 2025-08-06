import * as React from 'react';
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';
import { useTranslation } from "react-i18next";
// import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  //   CarouselNext,
  //   CarouselPrevious,
} from '@/components/ui/carousel';

export default function CarouselPlugin() {
  const { t } = useTranslation()
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true }),
  );

  const slides: {
    url: string;
    title: string;
    text: { __html: string | TrustedHTML };
  }[] = [
    {
      url: '/images/lrt1.jpeg',
      title: t('homepage.CapitalTrain'),
      text: {
        __html: t('homepage.Currently12stations22trains20000passengerday'),
      },
    },
  ];

  return (
    <Carousel plugins={[plugin.current]} className="w-full max-w-xs mx-auto">
      <CarouselContent>
        {slides.map((slide, index) => (
          <CarouselItem key={index}>
            <div className="p-1 flex flex-col gap-4">
              <Image
                className="flex-1"
                src={slide.url}
                alt="LRT"
                width={300}
                height={300}
              />
              <div className="flex flex-col ">
                <h3>{slide.title}</h3>
                <p dangerouslySetInnerHTML={slide.text}></p>
              </div>
              {/* <Card>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <span className="text-4xl font-semibold">{index + 1}</span>
                </CardContent>
              </Card> */}
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      {/* <CarouselPrevious />
      <CarouselNext /> */}
    </Carousel>
  );
}
