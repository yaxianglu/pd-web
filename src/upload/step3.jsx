import React, { useState, useRef, useEffect } from 'react';
import QRCode from 'qrcode';
import { useLocation } from 'react-router-dom';
import { Modal, Button } from 'antd';
import { smileTestApi } from '../services/smileTestApi';
import apiService from '../services/api';
import './step3.scss';
import p7 from './imgs/7.png';
import p15 from './imgs/15.png';
import p16 from './imgs/16.png';
import p17 from './imgs/17.png';

const pMap = {
  1: [p7, p7],
  2: [p15, p15],
  3: [p16, p16],
  4: [p17, p17]
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

export default function Step3({ onNext, setStep, style }) {
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [photos, setPhotos] = useState([]);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [stream, setStream] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showQrFull, setShowQrFull] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  // 获取当前URL
  const currentUrl = window.location.href;

  // 从URL获取UUID
  const getTestUuid = () => {
    const urlParams = new URLSearchParams(location.search);
    return urlParams.get('id');
  };

  // 保存照片到数据库
  const savePhotoToDatabase = async (photoData) => {
    const testUuid = getTestUuid();
    if (!testUuid) {
      console.error('No test UUID found for saving photo');
      return;
    }

    console.log('Saving photo to database:', {
      testUuid,
      step: photoData.step,
      photoUrlLength: photoData.url ? photoData.url.length : 0
    });

    try {
      // 检查是否是base64数据
      const isBase64 = photoData.url && photoData.url.startsWith('data:image/');
      
      if (!isBase64) {
        console.error('Photo data is not in base64 format');
        alert('照片格式錯誤，請重試');
        return;
      }
      
      // 使用新的API上传到smile_test_files表
      const result = await apiService.uploadSmileTestImage(
        testUuid, 
        photoData.step, 
        photoData.url
      );
      
      console.log('Save photo result:', result);
      
      if (!result.success) {
        console.error('Failed to save photo:', result.message);
        alert(`保存照片失敗: ${result.message}`);
      } else {
        console.log(`Photo for step ${photoData.step} saved successfully`);
      }
    } catch (error) {
      console.error('Failed to save photo to database:', error);
      alert('保存照片失敗，請重試');
    }
  };

  // 删除照片从数据库（现在删除整个图片组）
  const deletePhotoFromDatabase = async (step) => {
    const testUuid = getTestUuid();
    if (!testUuid) {
      console.error('No test UUID found for deleting photo');
      return;
    }

    console.log('Deleting photo group from database:', {
      testUuid,
      step
    });

    try {
      // 获取文件列表，找到微笑测试图片组
      const filesResult = await apiService.getSmileTestFiles(testUuid);
      
      if (filesResult.success) {
        const imageGroup = filesResult.data.find(file => 
          file.upload_type === 'smile_test' && 
          file.file_name === '微笑测试图片组'
        );
        
        if (imageGroup) {
          // 删除整个图片组
          const deleteResult = await apiService.deleteFile(imageGroup.uuid);
          if (deleteResult.success) {
            console.log('Photo group deleted successfully');
          } else {
            console.error('Failed to delete photo group:', deleteResult.message);
            alert(`刪除照片組失敗: ${deleteResult.message}`);
          }
        } else {
          console.log('No image group found');
        }
      } else {
        console.error('Failed to get files list:', filesResult.message);
        alert(`獲取文件列表失敗: ${filesResult.message}`);
      }
    } catch (error) {
      console.error('Failed to delete photo group from database:', error);
      alert('刪除照片組失敗，請重試');
    }
  };

  // 完成提交
  const handleComplete = async () => {
    if (photos.length < 4) {
      alert('請先上傳4張照片');
      return;
    }

    setSaving(true);
    const testUuid = getTestUuid();
    
    console.log('🔍 完成提交 - 使用的UUID:', testUuid);
    console.log('🔍 完成提交 - 照片数量:', photos.length);
    
    try {
      // 1. 保存4张图片到smile_test_files表
      console.log('📸 开始保存4张图片到smile_test_files表...');
      
      // 准备照片数据，按步骤排序
      const sortedPhotos = photos.sort((a, b) => a.step - b.step);
      
      // 創建图片组数据
      const imageGroup = {
        images: sortedPhotos.map((photo, index) => ({
          index: index + 1,
          field: `teeth_image_${index + 1}`,
          data: photo.url
        }))
      };
      
      console.log('📦 保存的图片组数据:', {
        imageCount: imageGroup.images.length,
        photo1Length: imageGroup.images[0]?.data?.length || 0,
        photo2Length: imageGroup.images[1]?.data?.length || 0,
        photo3Length: imageGroup.images[2]?.data?.length || 0,
        photo4Length: imageGroup.images[3]?.data?.length || 0
      });
      
      // 保存到smile_test_files表
      const imageGroupResult = await apiService.uploadSmileTestImageGroup(testUuid, imageGroup);
      
      if (!imageGroupResult.success) {
        console.error('Failed to save image group:', imageGroupResult.message);
        alert(`保存图片组失敗: ${imageGroupResult.message}`);
        return;
      }
      
      console.log('✅ 图片组保存成功:', imageGroupResult.data);
      
      // 2. 更新smile_test表的test_status
      console.log('📝 更新smile_test表的test_status...');
      
      const result = await smileTestApi.saveOrUpdateSmileTestByUuid(testUuid, {
        test_status: 'completed'
      });
      
      if (result.success) {
        console.log('✅ Test completed successfully with all 4 photos saved');
        // 显示成功Modal
        setShowSuccessModal(true);
        // 调用onNext回调
        onNext && onNext(photos);
      } else {
        console.error('Failed to complete test:', result.message);
        alert('保存失敗，請重試');
      }
    } catch (error) {
      console.error('Failed to complete test:', error);
      alert('保存失敗，請重試');
    } finally {
      setSaving(false);
    }
  };

  // 關閉当前页面
  const closePage = () => {
    // 重定向到首页
    window.location.href = '/';
  };

  // 组件加载时初始化狀態
  useEffect(() => {
    // 重置照片狀態，不加载已保存的照片
    setPhotos([]);
    setCurrentStep(1);
  }, [location.search]);

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
      setIsVideoReady(false); // 重置视频准备狀態
      
      // 确保视频元素存在后再设置
      if (videoRef.current) {
        console.log('设置视频源...');
        videoRef.current.srcObject = mediaStream;
        
        // 等待视频加载完成
        videoRef.current.onloadedmetadata = () => {
          console.log('视频元数据加载完成');
        };
        
        videoRef.current.oncanplay = () => {
          console.log('视频可以播放，设置准备狀態为true');
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
            console.log('视频已准备就绪，手动设置狀態');
            setIsVideoReady(true);
          }
        }, 1000);
      } else {
        console.error('视频元素不存在');
      }
    } catch (error) {
      console.error('摄像头启动失败:', error);
      alert('無法訪問攝像頭，請檢查權限設置');
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

  // 从相机拍照（移动端）
  const takePhotoFromCamera = () => {
    if (cameraInputRef.current) {
      cameraInputRef.current.click();
    }
  };

  // 拍照
  const takePhoto = () => {
    console.log('拍照按钮被点击，当前狀態:', {
      isCameraActive,
      isVideoReady,
      hasVideoRef: !!videoRef.current,
      hasCanvasRef: !!canvasRef.current,
      isMobile
    });

    // 如果是移动设备，直接使用相机拍照
    if (isMobile) {
      takePhotoFromCamera();
      return;
    }

    if (!isCameraActive) {
      // 如果摄像头未启动，先启动摄像头
      console.log('摄像头未启动，开始启动摄像头...');
      startCamera();
      return;
    }

    if (!isVideoReady) {
      console.log('視頻還未加載完成，請稍後再試');
      alert('攝像頭還未準備就緒，請稍後再試');
      return;
    }

    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      console.log('视频元素狀態:', {
        videoWidth: video.videoWidth,
        videoHeight: video.videoHeight,
        readyState: video.readyState,
        paused: video.paused,
        ended: video.ended
      });

      // 检查视频是否已经加载并且可以播放
      if (video.videoWidth === 0 || video.videoHeight === 0 || video.readyState < 2) {
        console.log('視頻還未加載完成，請稍後再試');
        alert('攝像頭還未準備就緒，請稍後再試');
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
              // 将blob转换为base64
              const reader = new FileReader();
              reader.onload = () => {
                const base64Data = reader.result;
                const newPhoto = {
                  id: Date.now(),
                  url: base64Data, // 使用base64数据
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
                
                // 保存照片到数据库
                console.log('Calling savePhotoToDatabase for new photo:', newPhoto);
                savePhotoToDatabase(newPhoto);
                
                // 拍摄完成后停止摄像头，回到案例展示狀態
                setTimeout(() => {
                  stopCamera();
                }, 500);
              };
              reader.readAsDataURL(blob);
            } catch (error) {
              console.error('創建图片URL失败:', error);
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
    // 移除capture属性，确保打开相册而不是相机
    if (fileInputRef.current) {
      fileInputRef.current.removeAttribute('capture');
      fileInputRef.current.click();
    }
  };

  // 处理文件选择（相册选择）
  const handleFileSelect = (event) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      
      try {
        // 将文件转换为base64
        const reader = new FileReader();
        reader.onload = () => {
          const base64Data = reader.result;
          const newPhoto = {
            id: Date.now(),
            url: base64Data, // 使用base64数据
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
          
          // 保存照片到数据库
          console.log('Calling savePhotoToDatabase for new photo:', newPhoto);
          savePhotoToDatabase(newPhoto);
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error('創建文件URL失败:', error);
        alert('文件选择失败，请重试');
      }
    }
    
    // 清空input值，允许重复选择同一文件
    event.target.value = '';
  };

  // 处理相机拍照文件选择
  const handleCameraFileSelect = (event) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      
      try {
        // 将文件转换为base64
        const reader = new FileReader();
        reader.onload = () => {
          const base64Data = reader.result;
          const newPhoto = {
            id: Date.now(),
            url: base64Data, // 使用base64数据
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
          
          // 保存照片到数据库
          console.log('Calling savePhotoToDatabase for camera photo:', newPhoto);
          savePhotoToDatabase(newPhoto);
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error('創建相机文件URL失败:', error);
        alert('拍照失败，请重试');
      }
    }
    
    // 清空input值，允许重复拍照
    event.target.value = '';
  };

  // 删除照片
  const deletePhoto = (photoId) => {
    console.log('Deleting photo:', photoId);
    
    setPhotos(prev => {
      const photoToDelete = prev.find(photo => photo.id === photoId);
      console.log('Photo to delete:', photoToDelete);
      
      if (photoToDelete) {
        // 从数据库删除照片
        console.log('Calling deletePhotoFromDatabase for step:', photoToDelete.step);
        deletePhotoFromDatabase(photoToDelete.step);
      } else {
        console.error('Photo not found for deletion:', photoId);
      }
      
      const updatedPhotos = prev.filter(photo => photo.id !== photoId);
      console.log('Updated photos after deletion:', updatedPhotos);
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

  // 监听视频狀態变化
  useEffect(() => {
    if (videoRef.current && isCameraActive) {
      const video = videoRef.current;
      
      const checkVideoReady = () => {
        console.log('检查视频狀態:', {
          readyState: video.readyState,
          videoWidth: video.videoWidth,
          videoHeight: video.videoHeight,
          isVideoReady
        });
        
        if (video.readyState >= 2 && video.videoWidth > 0 && video.videoHeight > 0) {
          console.log('视频已准备就绪，设置狀態');
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

  return (
    <div className="step3-wrapper" style={style}>
      <div className="step3-content">
        {/* 顶部信息区 */}
        <div className="step3-header">
          <div className="step-info">
            <div className="step-number">{currentStep}/4</div>
            <div className="step-instruction">
              後牙咬緊,上下門牙不需刻意對齊
            </div>
          </div>
          {!isMobile && (
            <div className="mobile-prompt" onClick={selectFromGallery}>
              <div className="mobile-icon">
                <QRCodeComponent url={currentUrl} size={80} onClick={e => { e.stopPropagation(); setShowQrFull(true); }} />
              </div>
              <span>前往使用手機拍攝照片</span>
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
              {/* 案例照片在左上角 */}
              <div className="example-photo-corner">
                <div className="posture-hint-small">
                  <img src={pMap[currentStep][0]} alt="拍照姿势提示" />
                </div>
              </div>
            </div>
          ) : (
            // 拍摄准备模式：根据currentStep判断显示上传图片或模版图片
            <div className="camera-container">
              <div className="example-photo">
                <div className="posture-hint">
                  {(() => {
                    // 查找当前步骤是否有上传的图片
                    const currentPhoto = photos.find(photo => photo.step === currentStep);
                    
                    if (currentPhoto) {
                      // 如果有上传的图片，显示上传的图片
                      return (
                        <img 
                          src={currentPhoto.url} 
                          alt={`已拍摄照片 - 步骤 ${currentPhoto.step}`}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain'
                          }}
                        />
                      );
                    } else {
                      // 如果没有上传的图片，显示模版图片
                      return (
                        <>
                          <img src={pMap[currentStep][0]} alt="拍照姿势提示" />
                          <img className='posture-hint-tishi-img' src={pMap[currentStep][1]} alt="拍照姿势提示" />
                        </>
                      );
                    }
                  })()}
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
            {isMobile ? (
              // 移动端：显示两个独立按钮
              <>
                <button 
                  className="gallery-button"
                  onClick={selectFromGallery}
                >
                  從相冊選擇
                </button>
                <button 
                  className="capture-button"
                  onClick={takePhoto}
                >
                  拍照
                </button>
              </>
            ) : (
              // 桌面端：保持原有逻辑
              <>
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
              </>
            )}
          </div>

          {/* 导航按钮 */}
          <div className="step3-buttons">
            <button
              type="button"
              className="step3-prev-button"
              onClick={() => setStep(pre => pre - 1)}
            >
              上一步
            </button>

            <button
              type="button"
              className="step3-save-button"
              onClick={handleComplete}
              disabled={photos.length < 4 || saving}
            >
              {saving ? '保存中...' : '完成提交'}
            </button>
          </div>
        </div>

        {/* 隐藏的文件输入 - 相册选择 */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
        
        {/* 隐藏的文件输入 - 相机拍照 */}
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleCameraFileSelect}
          style={{ display: 'none' }}
        />
        {/* 全屏二维码遮罩 */}
        {showQrFull && (
          <div className="qr-fullscreen-mask" onClick={() => setShowQrFull(false)}>
            <QRCodeComponent url={currentUrl} size={280} />
            <div className="qr-fullscreen-tip">点击任意处關閉</div>
          </div>
        )}

        {/* 成功提示Modal */}
        <Modal
          title="提交成功"
          open={showSuccessModal}
          onCancel={() => setShowSuccessModal(false)}
          footer={[
            <Button key="close" type="primary" onClick={closePage}>
              關閉頁面
            </Button>
          ]}
          closable={true}
          maskClosable={false}
        >
          <p>您的微笑測試已完成並成功提交！</p>
          <p>感謝您的參與，我們會盡快為您分析結果。</p>
        </Modal>
      </div>
    </div>
  );
}