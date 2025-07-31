import './index.scss';
import mp4 from './i.MP4';
import poster from './1.png';
export default function VideoList() {
  return (
    <div className="video-list">
      <div className="video-list-item">
        <video 
          src={mp4} 
          poster={poster}
          className="video-list-item-video"
          controls
          muted
          loop
        />
      </div>
    </div>
  );
}