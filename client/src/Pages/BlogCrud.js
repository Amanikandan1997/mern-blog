import React from 'react';

function BlogCrud() {
  return (
    <div className="container" style={{ padding: '30px' }}>
      <div id="carouselExampleControls" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img
              src="https://mms.businesswire.com/media/20230208005858/en/1709020/5/NEWBANNER_02-07-2023ctm360-press-banner_%28002%29.jpg"
              className="d-block w-100"
              alt="First Slide"
            />
          </div>
          <div className="carousel-item">
            <img
              src="https://resource.cobalt.io/hubfs/Frost-and-sullivan-brand-protection-report-cover-image.jpg"
              className="d-block w-100"
              alt="Second Slide"
            />
          </div>
          <div className="carousel-item">
            <img
              src="https://www.vhive.ai/wp-content/uploads/2023/11/14.11.23.jpg"
              className="d-block w-100"
              alt="Third Slide"
            />
          </div>
        </div>
        <a className="carousel-control-prev" href="#carouselExampleControls" role="button" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </a>
        <a className="carousel-control-next" href="#carouselExampleControls" role="button" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </a>
      </div>
    </div>
  );
}

export default BlogCrud;
