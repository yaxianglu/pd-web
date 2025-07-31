import React from "react";
import './PlanCard.scss';
import CardWrapper from "../components/card-wrapper";
import DetailButton from "../components/detail-button";
import PlanCard from "../components/plan-card";

const plans = [
  {
    tag: "輕度",
    duration: "3-9個月",
    subtitle: "(平均治療週期)",
    price: "$ 48,000",
    badge: "限時優惠",
    features: [
      "針對前排牙齒外觀",
      "沒有或少量附件",
      "無需拔牙",
    ],
    checks: [
      "美觀為主，日常幾乎無感",
      "無附件設計，簡潔自然"
    ],
    color: "#48d2ce",
  },
  {
    tag: "中度",
    duration: "9-15個月",
    subtitle: "(平均治療週期)",
    price: "$ 98,000",
    badge: "限時優惠",
    features: [
      "前排與部分後排牙齒",
      "多數牙齒需黏附件",
      "視乎情況或需拔牙"
    ],
    checks: [
      "美觀與功能兼顧",
      "符合多數成人矯正需求"
    ],
    color: "#48d2ce",
  },
  {
    tag: "重度",
    duration: "15-22個月",
    subtitle: "(平均治療週期)",
    price: "$ 118,000",
    badge: "限時優惠",
    features: [
      "前排牙齒調整，並改善咬合",
      "大多數牙齒上需要黏附件",
      "視乎情況或需拔牙"
    ],
    checks: [
      "全面改善齒列與咬合關係",
      "適用於進階需求或骨架型調整"
    ],
    color: "#48d2ce",
  }
];

export default function WhichPlan() {
  return (
    <CardWrapper
      title="哪一種更適合我？"
      subtitle={<>根據您的牙齒狀況，專業推薦三種隱形牙套方案，無論是輕微排列或是複雜牙齒問題，我們都有完善的療程，給你閃耀動人的微笑。</>}
    >
      <div className="plan-cards">
        {plans.map((plan, idx) =>
          <PlanCard key={plan.tag} {...plan} />
        )}
      </div>
      <DetailButton text="我適合哪種方案？"   />
    </CardWrapper>
    
  );
}
