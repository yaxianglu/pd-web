import React from "react";
import png1 from './imgs/1.png'
import png2 from './imgs/2.png'
import png3 from './imgs/3.png'
import png4 from './imgs/4.png'
import png5 from './imgs/5.png'
import png6 from './imgs/6.png'
import { cardPaddingStyle, cardTitleSizeStyle } from "../../contants";

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
    status: ProgressStatus.COMPLETED
  },
  {
    id: 2,
    title: "確認治療方案",
    // icon: ClipBoardIcon,
    icon: () => <img src={png2} alt="2" style={{ width: 50 }} />,
    status: ProgressStatus.COMPLETED
  },
  {
    id: 3,
    title: "付款完成",
    // icon: PayIcon,
    icon: () => <img src={png3} alt="3" style={{ width: 50 }} />,
    status: ProgressStatus.CURRENT
  },
  {
    id: 4,
    title: "生產完成",
    // icon: MachineIcon,
    icon: () => <img src={png4} alt="4" style={{ width: 50 }} />,
    status: ProgressStatus.PENDING
  },
  {
    id: 5,
    title: "治療中",
    // icon: DoctorIcon,
    icon: () => <img src={png5} alt="5" style={{ width: 50 }} />,
    status: ProgressStatus.PENDING
  },
  {
    id: 6,
    title: "治療完成",
    // icon: ToothIcon,
    icon: () => <img src={png6} alt="6" style={{ width: 50 }} />,
    status: ProgressStatus.PENDING
  }
];

// 进度组件
export default function ProgressTracker({ 
  currentStep = 3, 
  title = "等待確認支付",
  steps: customSteps = steps 
}) {
  // 更新步骤状态
  const getStepStatus = (stepId) => {
    if (stepId < currentStep) return ProgressStatus.COMPLETED;
    if (stepId === currentStep) return ProgressStatus.CURRENT;
    return ProgressStatus.PENDING;
  };

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
        {title}
      </div>
      <div style={{ 
        display: "flex", 
        alignItems: "flex-end", 
        justifyContent: "space-between", 
        padding: "0 16px" 
      }}>
        {customSteps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div style={{ textAlign: "center", flex: 1 }}>
              <step.icon status={getStepStatus(step.id)} />
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
        ))}
      </div>
    </div>
  );
}

// 步骤连接点
function StepDot() {
  return null;
  return (
    <div style={{ 
      width: 40, 
      flex: 0, 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center", 
      margin: "0 -2px" 
    }}>
      <div style={{ 
        width: 12, 
        height: 12, 
        borderRadius: "50%", 
        background: "#e4e7ed" 
      }}></div>
    </div>
  );
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
    case ProgressStatus.CURRENT:
      return (
        <span style={{
          display: "inline-block", 
          width: 25, 
          height: 25, 
          borderRadius: "50%",
          background: "#fff6dc", 
          color: "#ffce41", 
          fontWeight: "bold",
          fontSize: 18, 
          verticalAlign: "middle", 
          lineHeight: "25px",
          textAlign: "center",
          border: "2px solid #ffe8b0"
        }}>
          L
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

// 图标组件
function CalendarIcon({ status }) {
  const isActive = status === ProgressStatus.CURRENT;
  const isCompleted = status === ProgressStatus.COMPLETED;
  
  return (
    <svg width="46" height="46" fill="none" style={{ color: isActive ? "#48d2ce" : "#bbb" }}>
      <rect x="5" y="10" width="36" height="31" rx="8" 
        fill={isActive ? "#e8f8f8" : "#f6f7fa"} 
        stroke={isActive ? "#48d2ce" : "#ddd"} 
        strokeWidth={isActive ? "3" : "2"}/>
      <rect x="14" y="5" width="4" height="9" rx="2" fill={isActive ? "#48d2ce" : "#ddd"}/>
      <rect x="28" y="5" width="4" height="9" rx="2" fill={isActive ? "#48d2ce" : "#ddd"}/>  
      {isCompleted && (
        <>
          <circle cx="28" cy="28" r="8" fill="#fff"/>
          <path d="M32 24l-6 6m0-6l6 6" stroke="#38cf88" strokeWidth="2"/>
        </>
      )}
    </svg>
  );
}

function ClipBoardIcon({ status }) {
  const isActive = status === ProgressStatus.CURRENT;
  const isCompleted = status === ProgressStatus.COMPLETED;
  
  return (
    <svg width="46" height="46" fill="none" style={{ color: isActive ? "#48d2ce" : "#bbb" }}>
      <rect x="10" y="8" width="26" height="31" rx="7" 
        fill={isActive ? "#e8f8f8" : "#f6f7fa"} 
        stroke={isActive ? "#48d2ce" : "#ddd"} 
        strokeWidth={isActive ? "3" : "2"}/>
      <rect x="18" y="4" width="10" height="10" rx="5" fill={isActive ? "#48d2ce" : "#ddd"}/>
      <rect x="16" y="20" width="14" height="2.8" rx="1.4" fill={isActive ? "#48d2ce" : "#ddd"}/>
      {isCompleted && (
        <>
          <circle cx="32" cy="32" r="9" fill="#fff"/>
          <path d="M36 30l-6 6m0-6l6 6" stroke="#38cf88" strokeWidth="2"/>
        </>
      )}
    </svg>
  );
}

function PayIcon({ status }) {
  const isActive = status === ProgressStatus.CURRENT;
  
  return (
    <svg width="46" height="46" fill="none">
      <rect x="5" y="15" width="36" height="22" rx="6" 
        fill={isActive ? "#e8f8f8" : "#f6f7fa"} 
        stroke={isActive ? "#48d2ce" : "#ddd"} 
        strokeWidth={isActive ? "3" : "2"}/>
      <circle cx="23" cy="26" r="4" fill="#fff" stroke={isActive ? "#48d2ce" : "#ddd"} strokeWidth="2"/>
      <rect x="18" y="18" width="10" height="2.8" rx="1.4" fill={isActive ? "#48d2ce" : "#ddd"}/>
      <rect x="28" y="25" width="8" height="2.5" rx="1.2" fill="#ffce41" />
    </svg>
  );
}

function MachineIcon({ status }) {
  return (
    <svg width="46" height="46" fill="none">
      <rect x="10" y="15" width="26" height="18" rx="7" fill="#f6f7fa" stroke="#ddd" strokeWidth="2"/>
      <rect x="17" y="27" width="12" height="6" rx="2" fill="#ddd"/>
      <rect x="14" y="13" width="8" height="5" rx="2.5" fill="#ddd"/>
      <circle cx="36" cy="27" r="4" fill="#fff"/>
    </svg>
  );
}

function DoctorIcon({ status }) {
  return (
    <svg width="46" height="46" fill="none">
      <rect x="7" y="13" width="32" height="22" rx="11" fill="#f6f7fa" stroke="#ddd" strokeWidth="2"/>
      <rect x="18" y="17" width="10" height="7" rx="3.5" fill="#ddd"/>
      <rect x="16" y="30" width="14" height="4" rx="2" fill="#ddd"/>
      <circle cx="23" cy="21" r="5" fill="#fff"/>
    </svg>
  );
}

function ToothIcon({ status }) {
  return (
    <svg width="46" height="46" fill="none">
      <rect x="10" y="17" width="26" height="14" rx="7" fill="#f6f7fa" stroke="#ddd" strokeWidth="2"/>
      <ellipse cx="23" cy="23" rx="6" ry="8" fill="#ddd" />
    </svg>
  );
}
