import React, { useState, useMemo } from "react";
import { useLocation } from 'react-router-dom';
import png1 from './imgs/1.png'
import png2 from './imgs/2.png'
import png3 from './imgs/3.png'
import png4 from './imgs/4.png'
import png5 from './imgs/5.png'
import png6 from './imgs/6.png'
import png11 from './imgs/11.png'
import png22 from './imgs/22.png'
import png33 from './imgs/33.png'
import png44 from './imgs/44.png'
import png55 from './imgs/55.png'
import png66 from './imgs/66.png'
import TreatmentSelection from '../update-model'
import { cardPaddingStyle, cardTitleSizeStyle } from "../../contants";
import { useAuth } from '../../context/AuthContext';
import apiService from "../../services/api";
export const l = [
  {
    title: '等待預約',
  },
  {
    title: '預約完成',
    icon: png1,
  },
  {
    title: '確認方案',
    icon: png2,
  },
  {
    title: '付款完成',
    icon: png3,
  },
  {
    title: '生產完成',
    icon: png4,
  },
  {
    title: '治療中',
    icon: png5,
  },
  {
    title: '治療完成',
    icon: png6,
  }
];
// 进度狀態枚举
export const ProgressStatus = {
  COMPLETED: 'completed',    // 已完成
  CURRENT: 'current',        // 当前步骤
  PENDING: 'pending'         // 待处理
};

// 步骤配置
const steps = [
  {
    id: 1,
    title: "預約完成",
    // icon: CalendarIcon,
    icon: () => <img src={png1} alt="1" style={{ width: 50 }} />,
    activeIcon: () => <img src={png11} alt="1" style={{ width: 50 }} />,
    status: ProgressStatus.COMPLETED
  },
  {
    id: 2,
    title: "確認方案",
    // icon: ClipBoardIcon,
    icon: () => <img src={png2} alt="2" style={{ width: 50 }} />,
    activeIcon: () => <img src={png22} alt="2" style={{ width: 50 }} />,
    status: ProgressStatus.COMPLETED
  },
  {
    id: 3,
    title: "付款完成",
    // icon: PayIcon,
    icon: () => <img src={png3} alt="3" style={{ width: 50 }} />,
    activeIcon: () => <img src={png33} alt="3" style={{ width: 50 }} />,
    status: ProgressStatus.CURRENT
  },
  {
    id: 4,
    title: "生產完成",
    // icon: MachineIcon,
    icon: () => <img src={png4} alt="4" style={{ width: 50 }} />,
    activeIcon: () => <img src={png44} alt="4" style={{ width: 50 }} />,
    status: ProgressStatus.PENDING
  },
  {
    id: 5,
    title: "治療中",
    // icon: DoctorIcon,
    icon: () => <img src={png5} alt="5" style={{ width: 50 }} />,
    activeIcon: () => <img src={png55} alt="5" style={{ width: 50 }} />,
    status: ProgressStatus.PENDING
  },
  {
    id: 6,
    title: "治療完成",
    // icon: ToothIcon,
    icon: () => <img src={png6} alt="6" style={{ width: 50 }} />,
    activeIcon: () => <img src={png66} alt="6" style={{ width: 50 }} />,
    status: ProgressStatus.PENDING
  }
];

// 进度组件
export default function ProgressTracker({ 
  currentStep = 0, 
  steps: customSteps = steps,
  uuid,
  onUpdate,
}) {
  const { userInfo } = useAuth();
  const location = useLocation();
  
  const role = useMemo(() => {
    try {
      return userInfo?.role;
    } catch {
      return null;
    }
  }, [userInfo])

  // 检查是否为患者页面
  const isPatientPage = useMemo(() => {
    return location.pathname === '/patient';
  }, [location.pathname]);

  // 更新步骤狀態
  const getStepStatus = (stepId) => {
    if (stepId <= currentStep) return ProgressStatus.COMPLETED;
    return ProgressStatus.PENDING;
  };

  const [updateId, setUpdateId] = useState(null);
  const handleConfirm = async () => {
    const updateIdNum = Number(updateId);
    let updNum = updateIdNum;
    if (updateIdNum === currentStep) {
      // 当前是取消
      updNum = updateIdNum - 1;
    }
    await apiService.updatePatientProgress(uuid, updNum);
    onUpdate && onUpdate(updNum)
    setUpdateId(null);
  }

  const handleUpdateId = (nextId) => {
    // 如果是患者页面，不允许任何状态修改
    if (isPatientPage) {
      return;
    }
    
    const nextIdNum = Number(nextId);
    const changeableId = [currentStep, currentStep + 1];
    if (!changeableId.includes(nextIdNum)) {
      return;
    }
    /**
      1 預約完成：自动
      2 確認方案：醫生
      3 付款完成：超管、管理員
      4 生产完成：巧医
      5 治療中：醫生
      6 治療完成：醫生
    */
    if (role === 'doctor') {
      // 當前是醫生
      if (![2, 5, 6].includes(nextIdNum)) {
        return;
      }
    }
    if (role === 'hospital') {
      if (nextIdNum !== 4) {
        return;
      }
    }
    if (role === 'super_admin' || role === 'admin') {
      if (nextIdNum !== 3) return;
    }
    setUpdateId(nextIdNum);
  }

  return (
    <div style={{
      background: "#fff", 
      borderRadius: "18px", 
      marginBottom: "24px",
        ...cardPaddingStyle,
    }}>
      <div style={{ 
        ...cardTitleSizeStyle,
      }}>
        {l[currentStep]?.title}
      </div>
      <div style={{ 
        display: "flex", 
        alignItems: "flex-end", 
        justifyContent: "space-between", 
        padding: "0 16px" 
      }}>
        {customSteps.map((step, index) => {
          const isCompleted = getStepStatus(step.id) === ProgressStatus.COMPLETED;
          const isCancel = step.id === currentStep ? '取消' : '';
          return (
            <React.Fragment key={step.id}>
              <div style={{ 
                textAlign: "center", 
                flex: 1, 
                position: "relative",
                cursor: isPatientPage ? 'default' : 'pointer'
              }}
                onClick={() => handleUpdateId(step.id)}
              >
                {
                  updateId === step.id && (
                    <TreatmentSelection
                      title={isCancel + step.title}
                      onCancel={() => setTimeout(() => setUpdateId(null), 0)}
                      onConfirm={() => setTimeout(handleConfirm, 0)}
                      confirmText="執行"
                      cancelText="不執行"
                    />
                  )
                }
                {isCompleted ? step.activeIcon() : step.icon()}
                <div style={{ 
                  fontSize: 18, 
                  color: getStepStatus(step.id) === ProgressStatus.CURRENT ? "#48d2ce" : "#999", 
                  marginTop: 12,
                  fontWeight: getStepStatus(step.id) === ProgressStatus.CURRENT ? 600 : 400
                }}>
                  {step.title}
                </div>
                <div style={{ marginTop: 12 }}>
                  <StepCheck status={getStepStatus(step.id)} />
                </div>
              </div>
              {index < customSteps.length - 1 && <StepDot />}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  );
}

    // 步驟連接點
function StepDot() {
  return null;
}

// 步驟狀態指示器
function StepCheck({ status }) {
  switch (status) {
    case ProgressStatus.COMPLETED:
      return (
        <span style={{
          display: "inline-block", 
          width: 25, 
          height: 25, 
          borderRadius: "50%",
          background: "#38cf88", 
          color: "#fff", 
          fontWeight: "bold",
          fontSize: 19, 
          verticalAlign: "middle", 
          lineHeight: "25px",
          textAlign: "center"
        }}>
          ✓
        </span>
      );
    default:
      return (
        <span style={{
          display: "inline-block", 
          width: 25, 
          height: 25, 
          borderRadius: "50%",
          fontWeight: "bold",
          fontSize: 18, 
          verticalAlign: "middle", 
          lineHeight: "25px",
          textAlign: "center",
        }}>
        </span>
      );
  }
}
