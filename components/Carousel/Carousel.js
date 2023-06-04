import {useState} from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const CustomCarousel = ({children}) => {
  const [index, setIndex] = useState(0);
  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };

  const responsive = {
    desktop: {
      breakpoint: {max: 2000, min: 1024},
      items: 5,
    },
    tablet: {
      breakpoint: {max: 1024, min: 700},
      items: 3,
    },
    phone: {
      breakpoint: {max: 700, min: 300},
      items: 1,
    },
  };

  return (
    <Carousel
      activeIndex={index}
      onSelect={handleSelect}
      responsive={responsive}
      width={500}
      ssr={true} // means to render carousel on server-side.
      keyBoardControl={true}
      customTransition="all .5"
      transitionDuration={500}
      removeArrowOnDeviceType={["mobile"]}
      itemClass="carousel-item-padding-1-px"
    >
      {children}
    </Carousel>
  );
};
export default CustomCarousel;
