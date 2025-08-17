import React, { useState } from "react";
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
import { message } from 'antd';
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
// 进度状态枚举
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
  // 更新步骤状态
  const getStepStatus = (stepId) => {
    if (stepId <= currentStep) return ProgressStatus.COMPLETED;
    return ProgressStatus.PENDING;
  };

  const [updateId, setUpdateId] = useState(null);
  const handleConfirm = async () => {
    await apiService.updatePatientProgress(uuid, Number(updateId));
    onUpdate && onUpdate(Number(updateId))
    setUpdateId(null);
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
          return (
            <React.Fragment key={step.id}>
              <div style={{ textAlign: "center", flex: 1, position: "relative" }}
                onClick={() => setUpdateId(step.id)}
              >
                {
                  updateId === step.id && <TreatmentSelection title={step.title} onCancel={() => setTimeout(() => setUpdateId(null), 0)} onConfirm={() => setTimeout(handleConfirm, 0)} />
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

// 步骤连接点
function StepDot() {
  return null;
}

// 步骤状态指示器
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
