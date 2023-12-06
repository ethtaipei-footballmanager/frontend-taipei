"use client";
import React, { useRef } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import { EffectCoverflow, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import TeamCard from "./TeamCard";
import { Button } from "./ui/button";
interface ITeamSelection {}

const TeamSelection: React.FC<ITeamSelection> = ({}) => {
  const swiperRef = useRef<any>();

  const teams = [
    {
      name: "Fenerbahçe",
      image: "team-a",
      attack: 95,
      defense: 80,
    },
    {
      name: "Beşiktaş",
      image: "team-b",
      attack: 80,
      defense: 82,
    },
    {
      name: "Galatasaray",
      image: "team-c",
      attack: 90,
      defense: 78,
    },
  ];
  return (
    <div className="flex flex-col items-center gap-16 mt-16 justify-around ">
      <Swiper
        effect={"coverflow"}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={"auto"}
        onBeforeInit={(swiper) => {
          swiperRef.current = swiper;
        }}
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 300,
          modifier: 1,
          slideShadows: false,
          //   scale: 0.9,
        }}
        direction="horizontal"
        navigation={{
          nextEl: "swiper-button-prev",
          prevEl: "swiper-button-next",
        }}
        initialSlide={teams.length / 2}
        // navigation={true}
        modules={[EffectCoverflow, Navigation]}
        className="mySwiper h-full"
      >
        {/* {artists.map((artist) => (
          <SwiperSlide key={artist.id} className={SwiperSlideClass}>
            <FeaturedEventCard artist={artist} />
          </SwiperSlide>
        ))} */}
        {teams.map((team) => {
          console.log("teams", team);
          return (
            <SwiperSlide
              key={team.name}
              className="max-w-fit flex flex-col gap-8 items-center justify-center rounded-3xl font-bold"
            >
              <TeamCard team={team} />
            </SwiperSlide>
          );
        })}
      </Swiper>
      <div className="hidden sm:block  absolute top-[45%]  left-48">
        <Button
          size={"icon"}
          className="rounded-full"
          variant={"ghost"}
          onClick={() => swiperRef.current?.slidePrev()}
          title="Previous"
        >
          <FaChevronLeft size={24} />
        </Button>
      </div>
      <div className="hidden sm:block  absolute top-[45%]  right-48">
        <Button
          size={"icon"}
          className="rounded-full"
          variant={"ghost"}
          onClick={() => {
            swiperRef.current?.slideNext();
          }}
          title="Next"
        >
          {" "}
          <FaChevronRight size={24} />
        </Button>
        {/* <div className="flex flex-row gap-1"> */}
        {/* </div> */}
            
      </div>
      <Button className="w-48">Pick Team</Button>
    </div>
  );
};
export default TeamSelection;
