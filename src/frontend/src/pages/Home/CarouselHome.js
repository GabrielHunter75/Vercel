import React, { Component } from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { withStyles } from '@mui/styles';
import ComplexoJunino from './../../assets/ComplexoJunino.png';
import Hackaton from './../../assets/Hackaton.png';
import LuanaPradoTOUR from './../../assets/LuanaPradoTOUR.png';

class Index extends Component {
  state = { isMoving: false };
  render() {
    const images = [ComplexoJunino, Hackaton, LuanaPradoTOUR];
    const texts = [];
    const fakerData = Array(3)
      .fill(0)
      .map((item, index) => {
        return {
          image: images[index],
          description: texts[index] || texts[0],
        };
      });
    const responsive = {
      desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 1,
        slidesToSlide: 1,
      },
      tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 1,
        slidesToSlide: 1,
      },
      mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 1,
        slidesToSlide: 1,
      },
    };
    return (
      <Carousel
        responsive={responsive}
        ssr
        showDots
        infinite
        containerClass="container-with-dots"
        itemClass="image-item"
      >
        {fakerData.slice(0, 3).map((card, index) => (
          <img
            key={index}
            src={card.image}
            alt={card.description}
            style={{
              maxHeight: '50vh',
              maxWidth: '80vw',
              margin: '0 auto',
              display: 'block',
            }}
          />
        ))}
      </Carousel>
    );
  }
}

const styles = () => ({
  root: {
    textAlign: 'center',
  },
  title: {
    maxWidth: 400,
    margin: 'auto',
    marginTop: 10,
  },
});

export default withStyles(styles)(Index);
