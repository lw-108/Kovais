import React, { useEffect } from 'react';
import { Container } from 'react-bootstrap';
import AOS from 'aos';
import 'aos/dist/aos.css';

import LightGallery from 'lightgallery/react';

// Import lightGallery styles
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-share.css';

// Import lightGallery plugins
import lgZoom from 'lightgallery/plugins/zoom';
import lgShare from 'lightgallery/plugins/share';
import lgHash from 'lightgallery/plugins/hash';

// Import our custom CSS
import './Gallery.css';

const Gallery = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  const galleryData = [
    {
      src: "https://images.unsplash.com/photo-1588093413519-17cec3f64e40?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80",
      thumb: "https://images.unsplash.com/photo-1588093413519-17cec3f64e40?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=240&q=80",
      size: "1400-1400",
      subHtml: "<h4>Photo by - <a href='https://unsplash.com/@entrycube'>Diego Guzmán</a></h4><p>Location - Kyoto, Japan</p>"
    },
    {
      src: "https://images.unsplash.com/photo-1563502310703-1ffe473ad66d?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1443&q=80",
      thumb: "https://images.unsplash.com/photo-1563502310703-1ffe473ad66d?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=240&q=80",
      size: "1443-1329",
      subHtml: "<h4>Photo by - <a href='https://unsplash.com/@asoshiation'>Shah</a></h4><p>Location - Osaka, Japan</p>"
    },
    {
      src: "https://images.unsplash.com/photo-1613541444699-39429d990353?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80",
      thumb: "https://images.unsplash.com/photo-1613541444699-39429d990353?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=240&q=80",
      size: "1400-1402",
      subHtml: "<h4>Photo by - <a href='https://unsplash.com/@katherine_xx11'>Katherine Gu</a></h4><p>For all those years we were alone and helpless.</p>"
    }
  ];

  return (
    <div className="kovais-gallery-page py-5 mt-5">
      <Container>
        <div className="gallery-header" data-aos="fade-down">
          <h1>Image Gallery</h1>
          <p>
            Explore our visual journey. Click on any image to view it in full screen, zoom in, or share.
          </p>
        </div>

        <div data-aos="fade-up" data-aos-delay="200">
          <LightGallery
            speed={500}
            plugins={[lgZoom, lgShare, lgHash]}
            elementClassNames="d-flex align-items-center justify-content-center flex-wrap gap-4"
          >
            {galleryData.map((item, index) => (
              <a
                key={index}
                data-lg-size={item.size}
                className="gallery-item"
                data-src={item.src}
                data-sub-html={item.subHtml}
              >
                <img className="img-fluid" src={item.thumb} alt={`Gallery item ${index + 1}`} />
              </a>
            ))}
          </LightGallery>
        </div>
      </Container>
    </div>
  );
};

export default Gallery;
