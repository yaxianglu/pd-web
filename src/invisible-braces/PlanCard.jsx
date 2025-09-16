import React from "react";
import './PlanCard.scss';
import CardWrapper from "../components/card-wrapper";
import DetailButton from "../components/detail-button";
import PlanCard from "../components/plan-card";
import { useLanguage } from '../context/LanguageContext';

export default function WhichPlan() {
  const { t } = useLanguage();
  
  const plans = [
    {
      tag: t('invisibleBraces.planSelection.plans.mild.tag'),
      duration: t('invisibleBraces.planSelection.plans.mild.duration'),
      subtitle: t('invisibleBraces.planSelection.plans.mild.subtitle'),
      price: t('invisibleBraces.planSelection.plans.mild.price'),
      badge: t('invisibleBraces.planSelection.plans.mild.badge'),
      features: t('invisibleBraces.planSelection.plans.mild.features'),
      checks: t('invisibleBraces.planSelection.plans.mild.checks'),
      color: "#48d2ce",
    },
    {
      tag: t('invisibleBraces.planSelection.plans.moderate.tag'),
      duration: t('invisibleBraces.planSelection.plans.moderate.duration'),
      subtitle: t('invisibleBraces.planSelection.plans.moderate.subtitle'),
      price: t('invisibleBraces.planSelection.plans.moderate.price'),
      badge: t('invisibleBraces.planSelection.plans.moderate.badge'),
      features: t('invisibleBraces.planSelection.plans.moderate.features'),
      checks: t('invisibleBraces.planSelection.plans.moderate.checks'),
      color: "#48d2ce",
    },
    {
      tag: t('invisibleBraces.planSelection.plans.severe.tag'),
      duration: t('invisibleBraces.planSelection.plans.severe.duration'),
      subtitle: t('invisibleBraces.planSelection.plans.severe.subtitle'),
      price: t('invisibleBraces.planSelection.plans.severe.price'),
      badge: t('invisibleBraces.planSelection.plans.severe.badge'),
      features: t('invisibleBraces.planSelection.plans.severe.features'),
      checks: t('invisibleBraces.planSelection.plans.severe.checks'),
      color: "#48d2ce",
    }
  ];

  return (
    <CardWrapper
      title={t('invisibleBraces.planSelection.title')}
      subtitle={<>{t('invisibleBraces.planSelection.subtitle')}</>}
    >
      <div className="plan-cards">
        {plans.map((plan, idx) =>
          <PlanCard key={plan.tag} {...plan} />
        )}
      </div>
      <DetailButton text={t('invisibleBraces.planSelection.buttonText')}   />
    </CardWrapper>
    
  );
}
