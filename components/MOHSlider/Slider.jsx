import React, { useState, useEffect, useRef } from "react";
import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

//INTERNAL IMPORT
import Style from "./Slider.module.css";
import SliderCard from "./MOHSlider/MOHSliderCard";
import user1 from "../../img";
import user2 from "../../img";
import user3 from "../../img";
import user4 from "../../img";
import user5 from "../../img";
import user6 from "../../img";
import creatorbackground1 from "../../img/creatorbackground-1.jpeg";
import creatorbackground2 from "../../img/creatorbackground-2.jpeg";
import creatorbackground3 from "../../img/creatorbackground-3.jpeg";
import creatorbackground4 from "../../img/creatorbackground-4.jpg";
import creatorbackground5 from "../../img/creatorbackground-5.jpg";
import creatorbackground6 from "../../img/creatorbackground-6.jpg";
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/autoplay';

const Slider = () => {
  const FollowingArray = [
    {
      background: creatorbackground3,
      user: user3,
    },
    {
      background: creatorbackground4,
      user: user4,
    },
    {
      background: creatorbackground5,
      user: user5,
    },
    {
      background: creatorbackground6,
      user: user6,
    },
    {
      background: creatorbackground1,
      user: user1,
    },
    {
      background: creatorbackground2,
      user: user2,
    },
  ];
  const [width, setWidth] = useState(0);
  const dragSlider = useRef();

  useEffect(() => {
    setWidth(dragSlider.current.scrollWidth - dragSlider.current.offsetWidth);
  });

  const handleScroll = (direction) => {
    const { current } = dragSlider;
    const scrollAmount = window.innerWidth > 1800 ? 270 : 210;

    if (direction == "left") {
      current.scrollLeft -= scrollAmount;
    } else {
      current.scrollLeft += scrollAmount;
    }
  };

  return (
    <div className={Style.slider}>
      <div className={Style.slider_box}>
        <div className={Style.slider_box_button}></div>
        </div>
        <Swiper className={Style.slider_box_items} ref={dragSlider}
          modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
          spaceBetween={100}
          slidesPerView={2}
          loop={true}
          navigation={true}
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000 }}
          onSlideChange={() => console.log('slide change')}
          onSwiper={(swiper) => console.log(swiper)}
        >
          {FollowingArray.map((el, i) => (
            <SwiperSlide key={i + 1}>
              <SliderCard el={el} i={i} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>   
  );
};

export default Slider;