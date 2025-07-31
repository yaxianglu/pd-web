import './index.scss';
import ImageCompareSlider from '../image-compare-slider';

export default function ImageCompareWrapper({ title, description, image1, image2 }) {
  return (
    <div className="image-compare-wrapper">
      <div style={{flex: 1}}>
        <h3 className="image-compare-wrapper-title">
          {title}
        </h3>
        <p className="image-compare-wrapper-description">
          {description}
        </p>
      </div>
      <div className="aligners-container">
        <ImageCompareSlider image1={image1} image2={image2} />
      </div>
    </div>
  )
}