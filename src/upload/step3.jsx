import React, { useState, useRef, useEffect } from 'react';
import QRCode from 'qrcode';
import './step3.scss';
import p7 from './imgs/7.svg';
import p71 from './imgs/71.svg';
import p15 from './imgs/15.svg';
import p151 from './imgs/151.svg';
import p16 from './imgs/16.svg';
import p161 from './imgs/161.svg';
import p17 from './imgs/17.svg';
import p171 from './imgs/171.svg';

const url = 'http://xxxxx';

const pMap = {
  1: [p7, p71],
  2: [p15, p151],
  3: [p16, p161],
  4: [p17, p171]
}

// 二维码组件
const QRCodeComponent = ({ url, size = 120, onClick }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  useEffect(() => {
    if (url) {
      QRCode.toDataURL(url, {
        width: size,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      })
      .then(url => {
        setQrCodeUrl(url);
      })
      .catch(err => {
        console.error('生成二维码失败:', err);
      });
    }
  }, [url, size]);

  return qrCodeUrl ? (
    <img 
      src={qrCodeUrl} 
      alt="二维码" 
      style={{ 
        width: size, 
        height: size,
        borderRadius: '8px',
        border: '2px solid rgba(255, 255, 255, 0.2)',
        cursor: onClick ? 'pointer' : 'default'
      }} 
      onClick={onClick}
    />
  ) : null;
};

export default function Step3({ onNext, onPrev, style }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [photos, setPhotos] = useState([]);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [stream, setStream] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showQrFull, setShowQrFull] = useState(false);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  // 检测是否为移动设备
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
      setIsMobile(isMobileDevice);
    };
    
    checkMobile();
  }, []);

  // 启动摄像头
  const startCamera = async () => {
    try {
      console.log('开始启动摄像头...');
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      console.log('摄像头流获取成功:', mediaStream);
      setStream(mediaStream);
      setIsCameraActive(true);
      setIsVideoReady(false); // 重置视频准备状态
      
      // 确保视频元素存在后再设置
      if (videoRef.current) {
        console.log('设置视频源...');
        videoRef.current.srcObject = mediaStream;
        
        // 等待视频加载完成
        videoRef.current.onloadedmetadata = () => {
          console.log('视频元数据加载完成');
        };
        
        videoRef.current.oncanplay = () => {
          console.log('视频可以播放，设置准备状态为true');
          setIsVideoReady(true);
        };
        
        videoRef.current.onloadeddata = () => {
          console.log('视频数据加载完成');
        };
        
        videoRef.current.onplay = () => {
          console.log('视频开始播放');
        };
        
        videoRef.current.onerror = (error) => {
          console.error('视频加载失败:', error);
          setIsCameraActive(false);
          setIsVideoReady(false);
        };
        
        // 强制触发加载事件
        setTimeout(() => {
          if (videoRef.current && videoRef.current.readyState >= 2) {
            console.log('视频已准备就绪，手动设置状态');
            setIsVideoReady(true);
          }
        }, 1000);
      } else {
        console.error('视频元素不存在');
      }
    } catch (error) {
      console.error('摄像头启动失败:', error);
      alert('无法访问摄像头，请检查权限设置');
      setIsCameraActive(false);
      setIsVideoReady(false);
    }
  };

  // 停止摄像头
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsCameraActive(false);
      setIsVideoReady(false);
    }
  };

  // 拍照
  const takePhoto = () => {
    console.log('拍照按钮被点击，当前状态:', {
      isCameraActive,
      isVideoReady,
      hasVideoRef: !!videoRef.current,
      hasCanvasRef: !!canvasRef.current
    });

    if (!isCameraActive) {
      // 如果摄像头未启动，先启动摄像头
      console.log('摄像头未启动，开始启动摄像头...');
      startCamera();
      return;
    }

    if (!isVideoReady) {
      console.log('视频还未加载完成，请稍后再试');
      alert('摄像头还未准备就绪，请稍后再试');
      return;
    }

    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      console.log('视频元素状态:', {
        videoWidth: video.videoWidth,
        videoHeight: video.videoHeight,
        readyState: video.readyState,
        paused: video.paused,
        ended: video.ended
      });

      // 检查视频是否已经加载并且可以播放
      if (video.videoWidth === 0 || video.videoHeight === 0 || video.readyState < 2) {
        console.log('视频还未加载完成，请稍后再试');
        alert('摄像头还未准备就绪，请稍后再试');
        return;
      }

      // 设置canvas尺寸
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      try {
        // 绘制视频帧到canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // 转换为图片数据
        canvas.toBlob((blob) => {
          if (blob) {
            try {
              const photoUrl = URL.createObjectURL(blob);
              const newPhoto = {
                id: Date.now(),
                url: photoUrl,
                step: currentStep
              };
              
              // 替换当前步骤的照片，而不是添加新照片
              setPhotos(prev => {
                const filteredPhotos = prev.filter(photo => photo.step !== currentStep);
                const updated = [...filteredPhotos, newPhoto];
                // 自动切换到下一个未完成的步骤
                const nextStep = [1, 2, 3, 4].find(s => !updated.find(p => p.step === s));
                if (nextStep) {
                  setCurrentStep(nextStep);
                }
                return updated;
              });
              
              // 拍摄完成后停止摄像头，回到案例展示状态
              setTimeout(() => {
                stopCamera();
              }, 500);
              
              // 如果已经拍了4张照片，自动进入下一步
              const updatedPhotosCount = photos.filter(photo => photo.step !== currentStep).length + 1;
              if (updatedPhotosCount >= 4) {
                setTimeout(() => {
                  const finalPhotos = photos.filter(photo => photo.step !== currentStep).concat(newPhoto);
                  onNext && onNext(finalPhotos);
                }, 1000);
              }
            } catch (error) {
              console.error('创建图片URL失败:', error);
              alert('拍照失败，请重试');
            }
          } else {
            console.error('Canvas转Blob失败');
            alert('拍照失败，请重试');
          }
        }, 'image/jpeg', 0.8);
      } catch (error) {
        console.error('绘制视频帧失败:', error);
        alert('拍照失败，请重试');
      }
    } else {
      console.error('摄像头未准备就绪');
      alert('摄像头未准备就绪，请重试');
    }
  };

  // 从相册选择照片
  const selectFromGallery = () => {
    fileInputRef.current?.click();
  };

  // 处理文件选择
  const handleFileSelect = (event) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      
      try {
        const photoUrl = URL.createObjectURL(file);
        const newPhoto = {
          id: Date.now(),
          url: photoUrl,
          step: currentStep
        };
        
        // 替换当前步骤的照片，而不是添加新照片
        setPhotos(prev => {
          const filteredPhotos = prev.filter(photo => photo.step !== currentStep);
          const updated = [...filteredPhotos, newPhoto];
          // 自动切换到下一个未完成的步骤
          const nextStep = [1, 2, 3, 4].find(s => !updated.find(p => p.step === s));
          if (nextStep) {
            setCurrentStep(nextStep);
          }
          return updated;
        });
        
        // 如果已经选择了4张照片，自动进入下一步
        const updatedPhotosCount = photos.filter(photo => photo.step !== currentStep).length + 1;
        if (updatedPhotosCount >= 4) {
          setTimeout(() => {
            const finalPhotos = photos.filter(photo => photo.step !== currentStep).concat(newPhoto);
            onNext && onNext(finalPhotos);
          }, 1000);
        }
      } catch (error) {
        console.error('创建文件URL失败:', error);
        alert('文件选择失败，请重试');
      }
    }
  };

  // 删除照片
  const deletePhoto = (photoId) => {
    setPhotos(prev => {
      const updatedPhotos = prev.filter(photo => photo.id !== photoId);
      return updatedPhotos;
    });
  };

  // 切换到指定步骤
  const switchToStep = (stepNumber) => {
    setCurrentStep(stepNumber);
  };

  // 组件卸载时清理资源
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // 监听视频状态变化
  useEffect(() => {
    if (videoRef.current && isCameraActive) {
      const video = videoRef.current;
      
      const checkVideoReady = () => {
        console.log('检查视频状态:', {
          readyState: video.readyState,
          videoWidth: video.videoWidth,
          videoHeight: video.videoHeight,
          isVideoReady
        });
        
        if (video.readyState >= 2 && video.videoWidth > 0 && video.videoHeight > 0) {
          console.log('视频已准备就绪，设置状态');
          setIsVideoReady(true);
        }
      };
      
      // 立即检查一次
      checkVideoReady();
      
      // 每秒检查一次
      const interval = setInterval(checkVideoReady, 1000);
      
      return () => {
        clearInterval(interval);
      };
    }
  }, [isCameraActive, isVideoReady]);

  // 确保视频流正确设置
  useEffect(() => {
    if (stream && videoRef.current && isCameraActive) {
      console.log('重新设置视频流到视频元素');
      videoRef.current.srcObject = stream;
      
      // 确保视频开始播放
      videoRef.current.play().catch(error => {
        console.error('视频播放失败:', error);
      });
    }
  }, [stream, isCameraActive]);

  // 移除自动启动摄像头的逻辑
  // useEffect(() => {
  //   startCamera();
  // }, []);


  return (
    <div className="step3-wrapper" style={style}>
      <div className="step3-content">
        {/* 顶部信息区 */}
        <div className="step3-header">
          <div className="step-info">
            <div className="step-number">{currentStep}/4</div>
            <div className="step-instruction">
              後牙咬緊,前牙放鬆上下門牙不需刻意對齊
            </div>
          </div>
          {!isMobile && (
            <div className="mobile-prompt" onClick={selectFromGallery}>
              <div className="mobile-icon">
                <QRCodeComponent url={url} size={40} onClick={e => { e.stopPropagation(); setShowQrFull(true); }} />
              </div>
              <span>前往使用手機填寫</span>
            </div>
          )}
        </div>

        {/* 中部拍照区域 */}
        <div className="camera-area">
          {isCameraActive ? (
            // 摄像头模式：显示实时摄像头，案例照片在左上角
            <div className="camera-container">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="camera-video"
                onLoadStart={() => console.log('视频开始加载')}
                onLoadedMetadata={() => console.log('视频元数据加载完成')}
                onCanPlay={() => console.log('视频可以播放')}
                onPlay={() => console.log('视频开始播放')}
                onError={(e) => console.error('视频错误:', e)}
              />
              <img className='posture-hint-tishi-img' src={pMap[currentStep][1]} alt="拍照姿势提示" />
              {/* 案例照片在左上角 */}
              <div className="example-photo-corner">
                <div className="posture-hint-small">
                  <img src={pMap[currentStep][0]} alt="拍照姿势提示" />
                </div>
              </div>
            </div>
          ) : (
            // 拍摄准备模式：显示案例照片在中央
            <div className="camera-container">
              <div className="example-photo">
                {/* 案例照片作为主要显示 */}
                <div className="posture-hint">
                  <img src={pMap[currentStep][0]} alt="拍照姿势提示" />
                  <img className='posture-hint-tishi-img' src={pMap[currentStep][1]} alt="拍照姿势提示" />
                </div>
              </div>
            </div>
          )}
          
          {/* 隐藏的canvas用于拍照 */}
          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>

        {/* 底部操作区 */}
        <div className="step3-footer">
          {/* 照片缩略图 */}
          <div className="photo-thumbnails">
            {[1, 2, 3, 4].map((step) => (
              <div 
                key={step} 
                className={`thumbnail-container ${currentStep === step ? 'active' : ''} ${isCameraActive ? 'disabled' : ''}`}
                onClick={() => { if (!isCameraActive) switchToStep(step); }}
                style={isCameraActive ? { pointerEvents: 'none', opacity: 0.5 } : {}}
              >
                {photos.find(photo => photo.step === step) ? (
                  <div className="thumbnail-photo">
                    <img 
                      src={photos.find(photo => photo.step === step)?.url} 
                      alt={`照片 ${step}`} 
                    />
                    <button 
                      className="delete-photo"
                      onClick={(e) => {
                        e.stopPropagation(); // 阻止事件冒泡
                        deletePhoto(photos.find(photo => photo.step === step)?.id);
                      }}
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div className="thumbnail-placeholder">
                    <span>{step}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* 拍照按钮 */}
          <div className="capture-controls">
            {isCameraActive ? null : (
              <button 
                className="gallery-button"
                onClick={selectFromGallery}
              >
                從相冊選擇
              </button>
            )}
            <button 
              className="capture-button"
              onClick={takePhoto}
              disabled={isCameraActive && !isVideoReady}
            >
              {isCameraActive ? (isVideoReady ? '拍攝' : '準備中...') : '開始拍攝'}
            </button>
            {isCameraActive && (
              <button 
                className="exit-camera-button"
                onClick={stopCamera}
              >
                退出拍攝
              </button>
            )}
          </div>

          {/* 导航按钮 */}
          <div className="step3-buttons">
            <button
              type="button"
              className="step3-prev-button"
              onClick={onPrev}
            >
              上一步
            </button>
          </div>
        </div>

        {/* 隐藏的文件输入 */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
        {/* 全屏二维码遮罩 */}
        {showQrFull && (
          <div className="qr-fullscreen-mask" onClick={() => setShowQrFull(false)}>
            <QRCodeComponent url={url} size={280} />
            <div className="qr-fullscreen-tip">点击任意处关闭</div>
          </div>
        )}
      </div>
    </div>
  );
}